from typing import TYPE_CHECKING, List

import sqlalchemy as sa
import sqlalchemy.orm as so

from src.api import db
from src.api.models.user_role import user_role

if TYPE_CHECKING:
    from src.api.models import User


class Role(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(32), index=True, unique=True)
    description: so.Mapped[str] = so.mapped_column(sa.String(128))
    users: so.Mapped[List["User"]] = so.relationship(
        secondary=user_role, back_populates="roles"
    )

    def __repr__(self):
        return f"<Role {self.name}>"

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "users": [user.username for user in self.users],
        }
