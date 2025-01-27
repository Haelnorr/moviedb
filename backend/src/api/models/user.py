from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional

import sqlalchemy as sa
import sqlalchemy.orm as so
from flask_jwt_extended import create_access_token, create_refresh_token
from werkzeug.security import check_password_hash, generate_password_hash

from src.api import db
from src.api.variables import JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY

if TYPE_CHECKING:
    from src.api.models import Role


class User(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(64), index=True, unique=True)
    password_hash: so.Mapped[str | None] = so.mapped_column(sa.String(256))
    bio: so.Mapped[str | None] = so.mapped_column(sa.String(128))
    joined: so.Mapped[datetime] = so.mapped_column(
        index=True, default=lambda: datetime.now(timezone.utc)
    )
    role_id: so.Mapped[int | None] = so.mapped_column(sa.ForeignKey("role.id"))
    role: so.Mapped[Optional["Role"]] = so.relationship(back_populates="users")

    def __repr__(self):
        return f"<User {self.username}>"

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if self.password_hash:
            return check_password_hash(self.password_hash, password)
        else:
            return False

    def generate_tokens(self, fresh):
        access_token = create_access_token(
            self.json(), expires_delta=JWT_ACCESS_EXPIRY, fresh=fresh
        )
        refresh_token = create_refresh_token(
            self.json(), expires_delta=JWT_REFRESH_EXPIRY
        )

        return {
            "access_token": access_token,
            "access_expires": JWT_ACCESS_EXPIRY.total_seconds(),
            "refresh_token": refresh_token,
            "refresh_expires": JWT_REFRESH_EXPIRY.total_seconds(),
        }

    def json(self):
        return {"id": self.id, "username": self.username}
