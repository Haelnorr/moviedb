from src.api.auth.functions import get_user
from tests.helpers import get_headers, get_user_tokens, response_is_jwt


def test_login(app, client):
    with app.app_context():
        # Check user with valid credentials can login
        response = client.post(
            "/auth/login", json={"username": "admin", "password": "test"}
        )
        assert response.status_code == 200
        # make sure the response is properly formed
        assert response_is_jwt(response.json)

        # invalid credentials testing
        bad_response = client.post(
            "/auth/login", json={"username": "admin", "password": "asdsad"}
        )
        assert bad_response.status_code == 401
        bad_response = client.post(
            "/auth/login", json={"username": "asdasd", "password": "test"}
        )
        assert bad_response.status_code == 401


def test_check_exists(app, client):
    with app.app_context():
        response = client.post("/auth/exists", json={"username": "admin"})
        assert response.json["exists"] == True

        response = client.post("/auth/exists", json={"username": "noexist"})
        assert response.json["exists"] == False


def test_register(app, client, newuser, password):
    with app.app_context():
        # check invalid username format
        response = client.post(
            "/auth/register",
            json={
                "username": "123 122e%$@#$% 2ewqqf",
                "password": password,
                "confirm_password": password,
            },
        )
        assert response.status_code == 400
        # check passwords are different
        response = client.post(
            "/auth/register",
            json={
                "username": newuser.username,
                "password": "noreallyits",
                "confirm_password": "notthesamepassword",
            },
        )
        assert response.status_code == 400
        # make sure new user can be registered
        response = client.post(
            "/auth/register",
            json={
                "username": newuser.username,
                "password": password,
                "confirm_password": password,
            },
        )
        assert response.status_code == 201
        # check duplicate username fails
        response = client.post(
            "/auth/register",
            json={
                "username": newuser.username,
                "password": password,
                "confirm_password": password,
            },
        )
        assert response.status_code == 400
        # check username longer than 64 characters fails
        long_username = "a" * 65
        response = client.post(
            "/auth/register",
            json={
                "username": long_username,
                "password": password,
                "confirm_password": password,
            },
        )
        assert response.status_code == 400


def test_check_current_user_logout(app, client):
    with app.app_context():
        tokens = get_user_tokens(fresh=True)
        if not tokens:
            assert False

        response = client.get("/auth/@me", headers=get_headers(tokens["access"]))
        assert response.status_code == 200
        user = get_user("admin")
        if not user:
            assert False
        expected_response = {
            "user": {
                "id": 1,
                "username": "admin",
                "bio": "This is a bio",
                "joined": "2025-01-15T11:45:00",
                "roles": ["admin", "user"],
                "fresh": "True",
            }
        }
        assert response.json == expected_response

        response = client.get("/auth/@me", headers=get_headers(tokens["refresh"]))
        assert response.status_code == 422

        response = client.get("/auth/@me")
        assert response.status_code == 401

        response = client.delete("/auth/logout", headers=get_headers(tokens["access"]))
        assert response.status_code == 200

        response = client.get("/auth/@me", headers=get_headers(tokens["access"]))
        assert response.status_code == 401


def test_refresh_tokens(app, client):
    with app.app_context():
        tokens = get_user_tokens()
        if not tokens:
            assert False

        response = client.post("/auth/refresh", headers=get_headers(tokens["access"]))
        assert response.status_code == 422

        response = client.post("/auth/refresh", headers=get_headers(tokens["refresh"]))
        assert response.status_code == 200
        assert response_is_jwt(response.json)

        response = client.post("/auth/refresh", headers=get_headers(tokens["refresh"]))
        assert response.status_code == 401
