from flask_jwt_extended import current_user, jwt_required
from flask_smorest import Blueprint, abort, error_handler
from flask_smorest.blueprint import MethodView

from src.api import db
from src.api.account.schemas import (
    ChangeBioParams,
    ChangeUsernameParams,
    NewPasswordParams,
)
from src.api.auth.functions import check_username_exists, validate_username_format
from src.api.variables import JWT_AUTH_REQ
from src.logger.logger import get_logger

log = get_logger(__name__)

blp = Blueprint("account", "account", url_prefix="/account", description="Account API")


@blp.route("/change_username")
class ChangeUsername(MethodView):
    @blp.doc(**JWT_AUTH_REQ)
    @jwt_required(fresh=True)
    @blp.response(status_code=200)
    @blp.arguments(ChangeUsernameParams, location="json")
    @blp.alt_response(400, schema=error_handler.ErrorSchema)
    @blp.alt_response(409, schema=error_handler.ErrorSchema)
    def put(self, parameters):
        new_username = parameters["new_username"]
        if len(new_username) > 64:
            abort(400, message="New username is too long")
        if not validate_username_format(new_username):
            abort(400, message="New username has invalid characters")
        if current_user.username == new_username or check_username_exists(new_username):
            abort(
                409, message="Username already taken or no change to current username"
            )
        current_user.username = new_username
        db.session.add(current_user)
        db.session.commit()


@blp.route("/change_password")
class ChangePassword(MethodView):
    @blp.doc(**JWT_AUTH_REQ)
    @jwt_required(fresh=True)
    @blp.response(status_code=200)
    @blp.arguments(NewPasswordParams, location="json")
    @blp.alt_response(400, schema=error_handler.ErrorSchema)
    def put(self, parameters):
        new_password = parameters["new_password"]
        confirm_password = parameters["confirm_password"]
        if new_password != confirm_password:
            abort(400, message="Passwords do not match")
        current_user.set_password(new_password)
        db.session.add(current_user)
        db.session.commit()


@blp.route("/change_bio")
class ChangeBio(MethodView):
    @blp.doc(**JWT_AUTH_REQ)
    @jwt_required()
    @blp.response(status_code=200)
    @blp.arguments(ChangeBioParams, location="json")
    @blp.alt_response(400, schema=error_handler.ErrorSchema)
    def put(self, parameters):
        new_bio = parameters["new_bio"]
        if len(new_bio) > 128:
            abort(400, message="New bio is too long")
        current_user.bio = new_bio
        db.session.add(current_user)
        db.session.commit()
