import sqlalchemy as sa

from src.api import db

user_role = sa.Table(
    "user_role",
    db.Model.metadata,
    sa.Column("user_id", sa.ForeignKey("user.id"), primary_key=True),
    sa.Column("role_id", sa.ForeignKey("role.id"), primary_key=True),
)
