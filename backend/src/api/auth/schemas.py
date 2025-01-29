from marshmallow import Schema, fields, validate


class RegisterUserParams(Schema):
    username = fields.Str(
        required=True, metadata={"validator": validate.Length(max=64, min=1)}
    )
    password = fields.Str(required=True)
    confirm_password = fields.Str(required=True)


class LoginUserParams(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)


class CheckUserExistsParams(Schema):
    username = fields.Str(required=True)


class UserDetails(Schema):
    id = fields.Int()
    username = fields.Str()
    bio = fields.Str()
    joined = fields.DateTime()
    role = fields.Str()


class TokenResponse(Schema):
    access_token = fields.Str()
    access_expires = fields.Int()
    refresh_token = fields.Str()
    refresh_expires = fields.Int()


class UserExists(Schema):
    exists = fields.Bool()
