import sqlalchemy as sa
import sqlalchemy.orm as so

from src.api import db


class Permission(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(32), index=True, unique=True)
    description: so.Mapped[str] = so.mapped_column(sa.String(128))
