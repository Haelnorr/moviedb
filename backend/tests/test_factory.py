from src.api import create_app

# from tests.conftest import client


def test_config():
    assert not create_app().testing
    assert create_app({"TESTING": True}).testing


def test_isalive(client):
    response = client.get("/isalive")
    assert response.data == b"I'm alive"
