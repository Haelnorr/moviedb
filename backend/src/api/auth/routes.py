from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, current_user
from flask_smorest import Blueprint, abort
from flask_smorest.blueprint import MethodView
from src.api.auth.functions import JWT_AUTH_REQ, check_username_exists, create_new_user, get_user, validate_username_format
from src.api.auth.schemas import LoginUserParams, RegisterUserParams, TokenResponse, UserDetails
from src.api import jwt
from src.logger.logger import get_logger
from datetime import timedelta

log = get_logger(__name__)

blp = Blueprint("auth", "auth", url_prefix="/auth", description="Auth API")

@jwt.user_identity_loader
def user_identity_lookup(user):
    return f"{user["id"]}"

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data): 
    identity = jwt_data["sub"]
    return get_user(id=identity)

# TODO: make all the potential error codes show up in the docs
@blp.route("/register")
class Register(MethodView):
    @blp.arguments(RegisterUserParams, location="json")
    @blp.response(status_code=201)
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

# TODO: make all the potential error codes show up in the docs
@blp.route("/login")
class Login(MethodView):
    @blp.arguments(LoginUserParams, location="json")
    @blp.response(status_code=200, schema=TokenResponse)
    def post(self, parameters):
        username = parameters["username"]
        password = parameters["password"]

        user = get_user(username)
        if not user or not user.check_password(password):
            abort(401, message="Invalid credentials")
        # TODO: change to 2 hr for access and 7 days for refresh
        access_expires = timedelta(seconds=15)
        refresh_expires = timedelta(hours=2)
        access_token = create_access_token(user.json(), expires_delta=access_expires)
        refresh_token = create_refresh_token(user.json(), expires_delta=refresh_expires)

        return { 
            "access_token": access_token,
            "access_expires": access_expires.total_seconds(),
            "refresh_token": refresh_token,
            "refresh_expires": refresh_expires.total_seconds()
        }

# TODO: make all the potential error codes show up in the docs
@blp.route("/@me")
class CheckCurrentUser(MethodView):
    @blp.doc(**JWT_AUTH_REQ)
    @jwt_required()
    @blp.response(status_code=200, schema=UserDetails)
    def get(self):
        return current_user.json()

# TODO: invalidate tokens
# TODO: use refresh token
# TODO: change password
