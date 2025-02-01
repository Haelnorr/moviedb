from datetime import timedelta

import sqlalchemy as sa
from flask_jwt_extended import create_access_token, create_refresh_token

from src.api import db
from src.api.models.user import User
from src.api.variables import JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY


def getshape(d):
    if isinstance(d, dict):
        return {k: getshape(d[k]) for k in d}
    else:
        return None


def response_is_jwt(jwt):
    expected_shape = {
        "access_token": "",
        "access_expires": 1,
        "refresh_token": "",
        "refresh_expires": 1,
    }
    return getshape(jwt) == getshape(expected_shape)


def get_user_tokens(fresh=True):
    user = db.session.scalars(
        sa.Select(User).where(User.username.ilike("admin"))
    ).first()
    fresh_timeout = False  # makes tokens always unfresh
    if fresh:
        fresh_timeout = timedelta(minutes=10)
    if not user:
        return
    access_token = create_access_token(
        user.json(), expires_delta=JWT_ACCESS_EXPIRY, fresh=fresh_timeout
    )
    refresh_token = create_refresh_token(user.json(), expires_delta=JWT_REFRESH_EXPIRY)
    return {"access": access_token, "refresh": refresh_token}


def get_headers(token):
    return {"Authorization": f"Bearer {token}"}
