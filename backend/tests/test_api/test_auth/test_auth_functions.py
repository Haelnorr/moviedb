import pytest
import sqlalchemy as sa

from src.api import db
from src.api.auth.functions import (
    check_username_exists,
    create_new_user,
    get_user,
    validate_username_format,
)
from src.api.models.user import User


def test_validate_username_format():
    assert validate_username_format("3wdad3rg42re2e12313e") == True
    assert validate_username_format("3wdad rg42re2e12313e") == False
    assert validate_username_format("3wd$d3rg42re2e1f313e") == False
    assert validate_username_format("3wdad3rg42r%2e12313e") == False
    assert validate_username_format("3wdad3rg42re2e12@13e") == False
    assert validate_username_format("3wdad3rg42re2#12313e") == False
    assert validate_username_format("3wdad3rg42r^2e12313e") == False
    assert validate_username_format("3wdad3r&42re2e12313e") == False
    assert validate_username_format("3wd*d3rg42re2e12313e") == False
    assert validate_username_format("3wdld3rg4}re2e12313e") == False
    assert validate_username_format("3wdld3rg4{re2e12313e") == False
    assert validate_username_format("3wdhd3rg42re2e1[313e") == False
    assert validate_username_format("3wdad3rg42re2]12313e") == False
    assert validate_username_format("3wdad3rg42r(2e12313e") == False
    assert validate_username_format("3wdad3r)42re2e12313e") == False
    assert validate_username_format("3wda`3rg42re2e12313e") == False
    assert validate_username_format("3wdad3rg~2re2e12313e") == False
    assert validate_username_format("3wdad3rg42re2e1>313e") == False
    assert validate_username_format("3wdad3rg4<re2e12313e") == False
    assert validate_username_format("3wdld,rg4gre2e12313e") == False
    assert validate_username_format("3wdld3rg4gre2e1231.e") == False
    assert validate_username_format("3wdld3\\g4gre2e12313e") == False
    assert validate_username_format("3wdld3r/4gre2e12313e") == False
    assert validate_username_format("3wdld3rg4?re2e12313e") == False
    assert validate_username_format("3wdld|rg4gre2e12313e") == False


def test_check_username_exists(app):
    with app.app_context():
        assert check_username_exists("test") == True
        assert check_username_exists("Test") == True
        assert check_username_exists("TEst") == True
        assert check_username_exists("TeSt") == True
        assert check_username_exists("TesT") == True
        assert check_username_exists("TEST") == True
        assert check_username_exists("est") == False
        assert check_username_exists("iteest") == False
        assert check_username_exists("itest") == False
        assert check_username_exists("testi") == False
        assert check_username_exists("itesti") == False
        assert check_username_exists("noexist") == False


def test_create_new_user(app):
    with app.app_context():
        assert check_username_exists("noexist") == False
        create_new_user("noexist", "password")
        assert check_username_exists("noexist") == True

        with pytest.raises(Exception) as e:
            create_new_user("noexist", "password")

        assert "UniqueViolation" in str(e)


def test_get_user(app):
    with app.app_context():
        user = get_user("test")
        assert isinstance(user, User)
        assert user.username == "test"

        user = get_user("Test")
        assert isinstance(user, User)
        assert user.username == "test"

        user = get_user("TEST")
        assert isinstance(user, User)
        assert user.username == "test"

        user = get_user("TeSt")
        assert isinstance(user, User)
        assert user.username == "test"

        user = get_user("tEsT")
        assert isinstance(user, User)
        assert user.username == "test"

        assert get_user("testi") is None
        assert get_user("itest") is None
        assert get_user("itesti") is None

        user = get_user(id=1)
        assert isinstance(user, User)
        assert user.username == "test"

        assert get_user("noexist") is None
        assert get_user() is None
