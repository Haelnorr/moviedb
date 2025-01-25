import os
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
    UserDetails,
    UserExistsSchema,
)
from src.api.variables import (
    JWT_ACCESS_EXPIRY,
    JWT_AUTH_REQ,
    JWT_AUTH_REQ_DUAL,
    JWT_REFRESH_EXPIRY,
    JWT_REFRESH_REQ,
)
from src.logger.logger import get_logger

log = get_logger(__name__)

blp = Blueprint("auth", "auth", url_prefix="/auth", description="Auth API")

jwt_redis_blocklist = redis.StrictRedis(
    # NOTE: if REDIS envar not set, defaults to 'redis' as assumed to be
    # running inside docker compose with redis dependency
    host=os.getenv("REDIS", "redis"),
    port=6379,
    db=0,
    decode_responses=True,
)


@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_redis = jwt_redis_blocklist.get(jti)
    return token_in_redis is not None


@jwt.user_identity_loader
def user_identity_lookup(user):
    return f"{user["id"]}"


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return get_user(id=identity)


@blp.route("/exists")
class CheckUserExists(MethodView):
    @blp.arguments(CheckUserExistsParams, location="json")
    @blp.response(status_code=200, schema=UserExistsSchema)
    def post(self, parameters):
        username = parameters["username"]
        user = get_user(username)
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

        if not validate_username_format(username):
            abort(400, message="Username contains invalid characters")
        if check_username_exists(username):
            abort(400, message="Username already in use")
        if password != confirm_password:
            abort(400, message="Passwords do not match")

        create_new_user(username, password)


@blp.route("/login")
class Login(MethodView):
    @blp.arguments(LoginUserParams, location="json")
    @blp.response(status_code=200, schema=TokenResponse)
    @blp.alt_response(401, schema=error_handler.ErrorSchema)
    def post(self, parameters):
        username = parameters["username"]
        password = parameters["password"]

        user = get_user(username)
        if not user or not user.check_password(password):
            abort(401, message="Invalid credentials")

        return user.generate_tokens(fresh=timedelta(minutes=15))


@blp.route("/@me")
class CheckCurrentUser(MethodView):
    @blp.doc(**JWT_AUTH_REQ)
    @jwt_required()
    @blp.response(status_code=200, schema=UserDetails)
    @blp.alt_response(401, schema=error_handler.ErrorSchema)
    def get(self):
        return current_user.json()


@blp.route("/refresh")
class RefreshTokens(MethodView):
    @blp.doc(**JWT_REFRESH_REQ)
    @jwt_required(refresh=True)
    @blp.response(status_code=200, schema=TokenResponse)
    @blp.alt_response(401, schema=error_handler.ErrorSchema)
    def post(self):
        jti = get_jwt()["jti"]
        jwt_redis_blocklist.set(jti, "", ex=JWT_REFRESH_EXPIRY)
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
        ttl = {"access": JWT_ACCESS_EXPIRY, "refresh": JWT_REFRESH_EXPIRY}
        jwt_redis_blocklist.set(jti, "", ex=ttl[ttype])


# TODO: change password
# TODO: token freshness pattern
# https://flask-jwt-extended.readthedocs.io/en/stable/refreshing_tokens.html#token-freshness-pattern
@blp.route("/change_password")
class ChangePassword(MethodView):
    @blp.doc(**JWT_AUTH_REQ)
    @jwt_required(fresh=True)
    def put(self):
        pass
