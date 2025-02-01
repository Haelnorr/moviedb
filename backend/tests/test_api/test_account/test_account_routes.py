from src.api.auth.functions import get_user
from src.api.models.user import User
from tests.helpers import get_headers, get_user_tokens


def test_change_username(app, client):
    with app.app_context():
        fresh_tokens = get_user_tokens(fresh=True)
        unfresh_tokens = get_user_tokens(fresh=False)
        if not fresh_tokens or not unfresh_tokens:
            assert False
        fresh_headers = get_headers(fresh_tokens["access"])
        unfresh_headers = get_headers(unfresh_tokens["access"])
        invalid_headers = get_headers("invalidtoken")

        # test user with unfresh token cant update username
        response = client.put(
            "/account/change_username",
            headers=unfresh_headers,
            json={"new_username": "newusername"},
        )
        assert response.status_code == 401
        # make sure user hasnt had their username changed
        assert get_user("newusername") is None
        assert isinstance(get_user("admin"), User)

        # test user with no token cant access route
        response = client.put(
            "/account/change_username",
            json={"new_username": "newusername"},
        )
        assert response.status_code == 401
        # make sure user hasnt had their username changed
        assert get_user("newusername") is None
        assert isinstance(get_user("admin"), User)

        # test user with invalid token cant access route
        response = client.put(
            "/account/change_username",
            headers=invalid_headers,
            json={"new_username": "newusername"},
        )
        assert response.status_code == 422
        # make sure user hasnt had their username changed
        assert get_user("newusername") is None
        assert isinstance(get_user("admin"), User)

        # test new username doesnt match valid format fails
        response = client.put(
            "/account/change_username",
            headers=fresh_headers,
            json={"new_username": "newu$ername"},
        )
        assert response.status_code == 400
        # make sure user hasnt had their username changed
        assert get_user("newusername") is None
        assert isinstance(get_user("admin"), User)

        # test new username too long fails
        long_username = "a" * 65
        response = client.put(
            "/account/change_username",
            headers=fresh_headers,
            json={"new_username": long_username},
        )
        assert response.status_code == 400
        # make sure user hasnt had their username changed
        assert get_user("newusername") is None
        assert isinstance(get_user("admin"), User)

        # test new username cant match existing user
        response = client.put(
            "/account/change_username",
            headers=fresh_headers,
            json={"new_username": "user"},
        )
        assert response.status_code == 409
        # make sure user hasnt had their username changed
        assert get_user("newusername") is None
        assert isinstance(get_user("admin"), User)

        # test new username cant be submitted unchanged
        response = client.put(
            "/account/change_username",
            headers=fresh_headers,
            json={"new_username": "admin"},
        )
        assert response.status_code == 409

        # test user with fresh token can update username
        response = client.put(
            "/account/change_username",
            headers=fresh_headers,
            json={"new_username": "newusername"},
        )
        assert response.status_code == 200
        assert get_user("test") is None
        assert isinstance(get_user("newusername"), User)


def test_change_password(app, client):
    with app.app_context():
        fresh_tokens = get_user_tokens(fresh=True)
        unfresh_tokens = get_user_tokens(fresh=False)
        if not fresh_tokens or not unfresh_tokens:
            assert False
        fresh_headers = get_headers(fresh_tokens["access"])
        unfresh_headers = get_headers(unfresh_tokens["access"])
        invalid_headers = get_headers("invalidtoken")

        # test user with unfresh token cant update password
        response = client.put(
            "/account/change_password",
            headers=unfresh_headers,
            json={"new_password": "newpassword", "confirm_password": "newpassword"},
        )
        assert response.status_code == 401
        # make sure user hasnt had their password changed
        user = get_user("admin")
        if not user:
            assert False
        assert user.check_password("newpassword") == False
        assert user.check_password("test") == True

        # test user with no token cant update password
        response = client.put(
            "/account/change_password",
            json={"new_password": "newpassword", "confirm_password": "newpassword"},
        )
        assert response.status_code == 401
        # make sure user hasnt had their password changed
        user = get_user("admin")
        if not user:
            assert False
        assert user.check_password("newpassword") == False
        assert user.check_password("test") == True

        # test user with invalid token cant update password
        response = client.put(
            "/account/change_password",
            headers=invalid_headers,
            json={"new_password": "newpassword", "confirm_password": "newpassword"},
        )
        assert response.status_code == 422
        # make sure user hasnt had their password changed
        user = get_user("admin")
        if not user:
            assert False
        assert user.check_password("newpassword") == False
        assert user.check_password("test") == True

        # check passwords have to match
        response = client.put(
            "/account/change_password",
            headers=fresh_headers,
            json={"new_password": "thesepasswords", "confirm_password": "dontmatch"},
        )
        assert response.status_code == 400
        # make sure user hasnt had their password changed
        user = get_user("admin")
        if not user:
            assert False
        assert user.check_password("thesepasswords") == False
        assert user.check_password("dontmatch") == False
        assert user.check_password("test") == True

        # check user with fresh token can update password
        response = client.put(
            "/account/change_password",
            headers=fresh_headers,
            json={"new_password": "newpassword", "confirm_password": "newpassword"},
        )
        assert response.status_code == 200
        # make sure user hasnt had their password changed
        user = get_user("admin")
        if not user:
            assert False
        assert user.check_password("test") == False
        assert user.check_password("newpassword") == True


def test_change_bio(app, client):
    with app.app_context():
        tokens = get_user_tokens(fresh=True)
        if not tokens:
            assert False
        headers = get_headers(tokens["access"])
        invalid_headers = get_headers("invalidtoken")

        user = get_user("admin")
        if not user:
            assert False
        new_bio = "Very new bio very different"
        old_bio = user.bio

        # test user with no token cant update bio
        response = client.put("/account/change_bio", json={"new_bio": new_bio})
        assert response.status_code == 401
        user = get_user("admin")
        if not user:
            assert False
        assert user.bio != new_bio
        assert user.bio == old_bio

        # test user with invalid token cant update bio
        response = client.put(
            "/account/change_bio", headers=invalid_headers, json={"new_bio": new_bio}
        )
        assert response.status_code == 422
        user = get_user("admin")
        if not user:
            assert False
        assert user.bio != new_bio
        assert user.bio == old_bio

        # test bio cannot be longer than 128 characters
        long_bio = "a" * 129
        response = client.put(
            "/account/change_bio", headers=headers, json={"new_bio": long_bio}
        )
        assert response.status_code == 400
        user = get_user("admin")
        if not user:
            assert False
        assert user.bio != new_bio
        assert user.bio == old_bio

        # test user with token can update bio
        response = client.put(
            "/account/change_bio", headers=headers, json={"new_bio": new_bio}
        )
        assert response.status_code == 200
        user = get_user("admin")
        if not user:
            assert False
        assert user.bio != old_bio
        assert user.bio == new_bio
