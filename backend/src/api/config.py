import os
from pathlib import Path

# Get directory of this file
path = os.path.dirname(os.path.abspath(__file__))
# Go up to project root
for _ in range(3):
    path = Path(path).parent.absolute()
dev_db = os.path.join(path, "data", "data.sqlite")


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    API_TITLE = "MovieDB API"
    API_VERSION = "v1"
    API_SPEC_OPTIONS = {
        "components": {
            "securitySchemes": {
                "Bearer Auth": {
                    "type": "apiKey",
                    "in": "header",
                    "name": "Authorization",
                    "bearerFormat": "JWT",
                    "description": "",
                }
            }
        }
    }
    OPENAPI_VERSION = "3.1.0"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{dev_db}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLACHEMY_ECHO = True
