import sqlalchemy as sa

from src.api import db
from src.api.models.user import User


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
        sa.Select(User).where(User.username.ilike("test"))
    ).first()
    if not user:
        return
    tokens = user.generate_tokens(fresh)
    return {"access": tokens["access_token"], "refresh": tokens["refresh_token"]}


def get_headers(token):
    return {"Authorization": f"Bearer {token}"}
