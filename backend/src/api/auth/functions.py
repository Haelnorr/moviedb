import re

import sqlalchemy as sa

from src.api import db
from src.api.models import User
from src.api.variables import USERNAME_REGEX_PATTERN
from src.logger import get_logger

log = get_logger(__name__)


def validate_username_format(username):
    return bool(re.match(USERNAME_REGEX_PATTERN, username))


def check_username_exists(username):
    log.debug(f"Attempting to query database for username {username}")
    query = sa.Select(User).where(User.username.ilike(username))
    return bool(db.session.scalars(query).first())


def create_new_user(username, password):
    user = User()
    user.username = username
    user.set_password(password)
    log.debug(f"Attempting to add new user {username} to the database")
    db.session.add(user)
    db.session.commit()
    log.debug(f"{username} added")


def get_user(username=None, id=None):
    if username:
        query = sa.select(User).where(User.username.ilike(username))
    elif id:
        query = sa.select(User).where(User.id == id)
    else:
        return
    log.debug(f"Quering database for user with username {username} or id {id}")
    user = db.session.scalars(query).first()
    log.debug(f"Query for {username} or {id} complete")
    return user
