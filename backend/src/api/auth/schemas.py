from marshmallow import Schema, fields


class RegisterUserParams(Schema):
    username = fields.Str()
    password = fields.Str()
    confirm_password= fields.Str()

class LoginUserParams(Schema):
    username = fields.Str()
    password = fields.Str()

class UserDetails(Schema):
    id = fields.Int()
    username = fields.Str()
