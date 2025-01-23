import os
import tempfile

import pytest
from flask_migrate import upgrade
from sqlalchemy import text

from src.api import create_app, db

with open(os.path.join(os.path.dirname(__file__), "data.sql"), "rb") as f:
    _data_sql = f.read().decode("utf8")


@pytest.fixture()
def app():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app()
    app.config.update(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
        }
    )
    with app.app_context():
        upgrade()
        db.session.execute(text(_data_sql))

    yield app

    with app.app_context():
        db.drop_all()
        db.session.execute(text("DROP TABLE alembic_version"))

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()
