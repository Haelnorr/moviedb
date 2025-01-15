from flask import session
from flask_smorest import Blueprint, abort
from flask_smorest.blueprint import MethodView
from src.api.auth.functions import check_username_exists, create_new_user, get_user, validate_username_format
from src.api.auth.schemas import LoginUserParams, RegisterUserParams, UserDetails

blp = Blueprint("auth", "auth", url_prefix="/auth", description="Auth API")

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

@blp.route("/login")
class Login(MethodView):
    @blp.arguments(LoginUserParams, location="json")
    @blp.response(status_code=201)
    def post(self, parameters):
        username = parameters["username"]
        password = parameters["password"]

        if not validate_username_format(username):
            abort(400, message="Username contains invalid characters")

        user = get_user(username)
        if not user:
            abort(401, message="Invalid credentials")

        if not user.check_password(password):
            abort(401, message="Invalid credentials")

        print(f'logged in as user {user.username}')
        session["user_id"] = user.id

@blp.route("/@me")
class CheckCurrentUser(MethodView):
    @blp.response(status_code=200, schema=UserDetails)
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            abort(401, message="Not logged in")

        user = get_user(id=user_id)
        if not user:
            abort(401, message="User does not exist")

        print(f'logged in as {user.username}')
        return user.json()

