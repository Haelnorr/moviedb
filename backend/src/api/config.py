import os
from pathlib import Path

from src.logger.logger import get_logger

log = get_logger(__name__)

# Get directory of this file
path = os.path.dirname(os.path.abspath(__file__))
# Go up to project root
for _ in range(2):
    path = Path(path).parent.absolute()
dev_db = os.path.join(path, "data.sqlite")
database_file = os.getenv("DATABASE", dev_db)


postgres_user = os.getenv("POSTGRES_USER")
postgres_pass = os.getenv("POSTGRES_PASS")
postgres_host = os.getenv("POSTGRES_HOST")
postgres_port = os.getenv("POSTGRES_PORT")
postgres_ssl_mode = os.getenv("POSTGRES_SSL_MODE")
postgres_endpoint_id = os.getenv("POSTGRES_ENDPOINT")

if postgres_port:  # pragma: no cover
    postgres_host = f"{postgres_host}:{postgres_port}"

base_db_url = f"postgresql://{postgres_user}:{postgres_pass}@{postgres_host}/(database)?sslmode={postgres_ssl_mode}"
if postgres_endpoint_id:  # pragma: no cover
    base_db_url = base_db_url + f"&options=endpoint%3D{postgres_endpoint_id}"

DATABASE_NAME = os.getenv("POSTGRES_DB_NAME", "default")
moviedb_url = base_db_url.replace("(database)", DATABASE_NAME)

logsafe_url = f"postgresql://[username]:[password]@{postgres_host}/(database)?sslmode={postgres_ssl_mode}"
logsafe_url = logsafe_url.replace("(database)", DATABASE_NAME)
log.debug(f"Database connection configured as: {logsafe_url}")
log.debug("(Username and password have been obscured for security)")


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    API_TITLE = f"MovieDB API"
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

    SQLALCHEMY_DATABASE_URI = moviedb_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLACHEMY_ECHO = True
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_size": 0, "pool_pre_ping": True}
