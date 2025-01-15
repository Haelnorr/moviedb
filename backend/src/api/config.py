import os, redis
from pathlib import Path

# Get directory of this file
path = os.path.dirname(os.path.abspath(__file__))
# Go up to project root
for _ in range(2):
    path = Path(path).parent.absolute()
dev_db = os.path.join(path, "data.sqlite")

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'lkjab8o7d1243o312d4')
    API_TITLE = "MovieDB API"
    API_VERSION = "v1"
    OPENAPI_VERSION = "3.1.0"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_SWAGGER_UI_PATH = "/docs"
    OPENAPI_SWAGGER_UI_URL = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{dev_db}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLACHEMY_ECHO = True
    
    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://redis:6379")

