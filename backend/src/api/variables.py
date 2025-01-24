from copy import deepcopy
from datetime import timedelta

USERNAME_REGEX_PATTERN = "^[A-Za-z0-9_-]*$"

JWT_ACCESS_EXPIRY = timedelta(hours=2)
JWT_REFRESH_EXPIRY = timedelta(days=7)

JWT_AUTH_REQ = {
    "parameters": [
        {
            "name": "Authorization",
            "in": "header",
            "description": "Authorization Bearer <access_token>",
            "required": "true",
        }
    ],
    "security": [{"Bearer Auth": []}],
}

JWT_AUTH_OPT = deepcopy(JWT_AUTH_REQ)
JWT_AUTH_OPT["parameters"][0]["required"] = "false"

JWT_REFRESH_REQ = deepcopy(JWT_AUTH_REQ)
JWT_REFRESH_REQ["parameters"][0]["description"] = "Authorization Bearer <refresh_token>"

JWT_AUTH_REQ_DUAL = deepcopy(JWT_AUTH_REQ)
JWT_AUTH_REQ_DUAL["parameters"][0][
    "description"
] = "Authorization Bearer <access_token|refresh_token>"
