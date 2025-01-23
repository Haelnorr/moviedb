import pytest
from sqlalchemy import text

from src.api import db


def test_get_close_db(app):
    with app.app_context():
        assert db is db

    with pytest.raises(RuntimeError) as e:
        db.session.execute(text("SELECT 1"))

    assert "outside of application context" in str(e.value)
