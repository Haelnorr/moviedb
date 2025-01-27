from datetime import timedelta
from time import time

from flask_jwt_extended import decode_token

from src.api.variables import JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY
from tests.helpers import response_is_jwt


def test_user_set_password(user, password):
    user.set_password(password)
    assert user.password_hash != password


def test_user_check_password(user, password):
    assert user.check_password(password) == False
    user.set_password(password)
    assert user.check_password(password) == True
    assert user.check_password("not the password") == False


def test_user_generate_tokens_fresh(app, user):
    with app.app_context():
        fresh_tokens = user.generate_tokens(timedelta(minutes=5))
        assert response_is_jwt(fresh_tokens)
        access_token = decode_token(fresh_tokens["access_token"])
        refresh_token = decode_token(fresh_tokens["refresh_token"])

        assert access_token["fresh"] > time()
        assert access_token["type"] == "access"
        assert access_token["sub"] == f"{user.id}"
        assert not refresh_token["fresh"]
        assert refresh_token["type"] == "refresh"
        assert refresh_token["sub"] == f"{user.id}"
        assert fresh_tokens["access_expires"] == JWT_ACCESS_EXPIRY.total_seconds()
        assert fresh_tokens["refresh_expires"] == JWT_REFRESH_EXPIRY.total_seconds()


def test_user_generate_tokens_not_fresh(app, user):
    with app.app_context():
        not_fresh_tokens = user.generate_tokens(fresh=False)
        expected_shape = {
            "access_token": "",
            "access_expires": 1,
            "refresh_token": "",
            "refresh_expires": 1,
        }
        assert response_is_jwt(not_fresh_tokens)
        access_token = decode_token(not_fresh_tokens["access_token"])
        refresh_token = decode_token(not_fresh_tokens["refresh_token"])

        assert access_token["fresh"] == False
        assert access_token["type"] == "access"
        assert access_token["sub"] == f"{user.id}"
        assert refresh_token["fresh"] == False
        assert refresh_token["type"] == "refresh"
        assert refresh_token["sub"] == f"{user.id}"
        assert not_fresh_tokens["access_expires"] == JWT_ACCESS_EXPIRY.total_seconds()
        assert not_fresh_tokens["refresh_expires"] == JWT_REFRESH_EXPIRY.total_seconds()


def test_user_repr(user):
    assert f"{user}" == f"<User {user.username}>"


# def test_user_json(user):
#     expected = {"id": user.id, "username": user.username}
#     assert user.json() == expected
