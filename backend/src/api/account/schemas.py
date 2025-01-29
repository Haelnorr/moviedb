from marshmallow import Schema, fields, validate


class ChangeUsernameParams(Schema):
    new_username = fields.Str(
        required=True, metadata={"validator": validate.Length(max=64, min=1)}
    )


class ChangeBioParams(Schema):
    new_bio = fields.Str(
        required=True, metadata={"validator": validate.Length(max=128, min=None)}
    )


class NewPasswordParams(Schema):
    new_password = fields.Str(required=True)
    confirm_password = fields.Str(required=True)
