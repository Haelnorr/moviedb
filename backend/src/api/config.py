import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'lkjab8o7d1243o312d4')
    API_TITLE = "MovieDB API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.1.0"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

