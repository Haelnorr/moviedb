import os
import time
from datetime import timedelta

import redis
from flask_jwt_extended import current_user, get_jwt, jwt_required
from flask_smorest import Blueprint, abort, error_handler
from flask_smorest.blueprint import MethodView

from src.api import jwt
from src.api.auth.functions import (
    check_username_exists,
    create_new_user,
    get_user,
    validate_username_format,
)
from src.api.auth.schemas import (
    CheckUserExistsParams,
    LoginUserParams,
    RegisterUserParams,
    TokenResponse,
    UserDetailsResponse,
    UserExists,
)
from src.api.variables import (
    JWT_ACCESS_EXPIRY,
    JWT_AUTH_REQ,
    JWT_AUTH_REQ_DUAL,
    JWT_REFRESH_EXPIRY,
    JWT_REFRESH_REQ,
)
from src.logger import get_logger

log = get_logger(__name__)

blp = Blueprint("auth", "auth", url_prefix="/auth", description="Auth API")

redis_url = os.getenv("REDIS", "redis")
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_db = int(os.getenv("JWT_REDIS_INDEX", 0))
jwt_redis_blocklist = redis.StrictRedis(
    host=redis_url,
    port=redis_port,
    db=redis_db,
    decode_responses=True,
)


@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    log.debug("Checking if JWT is blocked")
    jti = jwt_payload["jti"]
    log.debug(f"Using redis connection {redis_url}:{redis_port}/{redis_db}")
    token_in_redis = jwt_redis_blocklist.get(jti)
    log.debug("JWT checked in redis")
    return token_in_redis is not None


@jwt.user_identity_loader
def user_identity_lookup(user):
    log.debug("User ID Loader Callback - Returning user id")
    return f"{user["id"]}"


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    log.debug("Fetching user identity")
    identity = jwt_data["sub"]
    return get_user(id=identity)


@blp.route("/exists")
class CheckUserExists(MethodView):
    @blp.arguments(CheckUserExistsParams, location="json")
    @blp.response(status_code=200, schema=UserExists)
    def post(self, parameters):
        username = parameters["username"]
        log.debug("Checking if username exists")
        user = check_username_exists(username)
        exists = bool(user)
        return {"exists": exists}


@blp.route("/register")
class Register(MethodView):
    @blp.arguments(RegisterUserParams, location="json")
    @blp.response(status_code=201)
    @blp.alt_response(400, schema=error_handler.ErrorSchema)
    def post(self, parameters):
        username = parameters["username"]
        password = parameters["password"]
        confirm_password = parameters["confirm_password"]
        log.debug("Validating new user input")
        if len(username) > 64:
            abort(400, message="Username too long")
        if not validate_username_format(username):
            abort(400, message="Username contains invalid characters")
        if check_username_exists(username):
            abort(400, message="Username already in use")
        if password != confirm_password:
            abort(400, message="Passwords do not match")
        log.debug(f"Creating new user {username}")
        create_new_user(username, password)


@blp.route("/login")
class Login(MethodView):
    @blp.arguments(LoginUserParams, location="json")
    @blp.response(status_code=200, schema=TokenResponse)
    @blp.alt_response(401, schema=error_handler.ErrorSchema)
    def post(self, parameters):
        username = parameters["username"]
        password = parameters["password"]
        log.debug(f"Checking user credentials for {username}")
        user = get_user(username)
        if not user or not user.check_password(password):
            abort(401, message="Invalid credentials")
        log.debug(f"Generating tokens for {user.username}")
        return user.generate_tokens(fresh=timedelta(minutes=15))


@blp.route("/@me")
class CheckCurrentUser(MethodView):
    @blp.doc(**JWT_AUTH_REQ)
    @jwt_required()
    @blp.response(status_code=200, schema=UserDetailsResponse)
    @blp.alt_response(401, schema=error_handler.ErrorSchema)
    def get(self):
        fresh = get_jwt()["fresh"]
        is_fresh = fresh > int(time.time())
        log.debug(f"Providing authenticated user details for {current_user.username}")
        return {"user": current_user.json(fresh=is_fresh)}


@blp.route("/refresh")
class RefreshTokens(MethodView):
    @blp.doc(**JWT_REFRESH_REQ)
    @jwt_required(refresh=True)
    @blp.response(status_code=200, schema=TokenResponse)
    @blp.alt_response(401, schema=error_handler.ErrorSchema)
    def post(self):
        log.debug(f"Rotating refresh token for {current_user.username}")
        jti = get_jwt()["jti"]
        log.debug(f"Using redis connection {redis_url}:{redis_port}/{redis_db}")
        jwt_redis_blocklist.set(jti, "", ex=JWT_REFRESH_EXPIRY)
        log.debug(f"Generating new tokens for {current_user.username}")
        return current_user.generate_tokens(fresh=False)


@blp.route("/logout")
class RevokeTokens(MethodView):
    @blp.doc(**JWT_AUTH_REQ_DUAL)
    @jwt_required(verify_type=False)
    @blp.response(status_code=200)
    @blp.alt_response(401, schema=error_handler.ErrorSchema)
    def delete(self):
        token = get_jwt()
        jti = token["jti"]
        ttype = token["type"]
        log.debug(f"Invalidating {ttype} token for {current_user.username}")
        ttl = {"access": JWT_ACCESS_EXPIRY, "refresh": JWT_REFRESH_EXPIRY}
        log.debug(f"Using redis connection {redis_url}:{redis_port}/{redis_db}")
        jwt_redis_blocklist.set(jti, "", ex=ttl[ttype])
        log.debug(f"{ttype} token for {current_user.username} invalidated")
