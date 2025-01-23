import os
import tempfile

import pytest
from flask_migrate import upgrade
from sqlalchemy import text

from src.api import create_app, db
from src.api.models.user import User


@pytest.fixture()
def app():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
        }
    )
    with app.app_context():
        upgrade()
        with open(os.path.join(os.path.dirname(__file__), "data.sql")) as f:
            query = text(f.read())
            db.session.execute(query)
            db.session.commit()

    yield app

    with app.app_context():
        db.drop_all()
        db.session.execute(text("DROP TABLE alembic_version"))
        db.session.commit()

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


@pytest.fixture
def user():
    user = User()
    user.username = "tester"
    user.id = 1
    return user


@pytest.fixture
def password():
    return "test"
