import sqlalchemy as sa
from src.api import db
from src.api.models import User
import re
from src.logger import get_logger

log = get_logger(__name__)

USERNAME_REGEX_PATTERN = "^[A-Za-z0-9_-]*$"

JWT_AUTH_REQ = {
    "parameters": [{
        'name': 'Authorization',
        'in': 'header',
        'description': 'Authorization Bearer <access_token>',
        'required': 'true',
    }],
    "security": [{"Bearer Auth": []}]
}

JWT_AUTH_OPT = JWT_AUTH_REQ
JWT_AUTH_OPT["parameters"][0]["required"] = 'false'

def validate_username_format(username):
    return bool(re.match(USERNAME_REGEX_PATTERN, username))

def check_username_exists(username):
    query = sa.Select(User).where(User.username.is_(username))
    return bool(db.session.scalars(query).first())
    
def create_new_user(username, password):
    user = User()
    user.username = username
    user.set_password(password)
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        log.error("Failed adding new user to database")
        log.error(e)

def get_user(username=None, id=None):
    if username:
        query = sa.select(User).where(User.username.is_(username))
    elif id:
        query = sa.select(User).where(User.id.is_(id))
    else:
        return
    user = db.session.scalars(query).first()
    return user
