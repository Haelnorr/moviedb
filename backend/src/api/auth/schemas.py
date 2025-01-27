from marshmallow import Schema, fields


class RegisterUserParams(Schema):
    username = fields.Str()
    password = fields.Str()
    confirm_password = fields.Str()


class LoginUserParams(Schema):
    username = fields.Str()
    password = fields.Str()


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


class CheckUserExistsParams(Schema):
    username = fields.Str()


class UserExistsSchema(Schema):
    exists = fields.Bool()
