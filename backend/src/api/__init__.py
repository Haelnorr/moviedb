from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_smorest import Api
from flask_sqlalchemy import SQLAlchemy

from src.api.config import Config
from src.logger import get_logger

log = get_logger(__name__)

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()


def create_app(test_config=None):
    log.info("Creating flask app")
    app = Flask(__name__)
    log.info("Loading config from object")
    app.config.from_object(Config)
    if test_config is not None:
        app.config.from_mapping(SECRET_KEY="dev")
        app.config.from_mapping(test_config)

    log.info("Initializing flask_smorest")
    api = Api(app)

    log.info("Initializing database connection")
    db.init_app(app)

    log.info("Setting up Migrate")
    migrate.init_app(app, db)
    log.info("Setting up CORS")
    cors.init_app(app)
    log.info("Setting up JWT")
    jwt.init_app(app)

    log.info("Importing blueprints")
    from src.api.account import bp as account_bp
    from src.api.auth import bp as auth_bp
    from src.api.movies import bp as movies_bp

    log.info("Registering blueprints")
    api.register_blueprint(auth_bp)
    api.register_blueprint(account_bp)
    api.register_blueprint(movies_bp)

    log.info("Registering /isalive route")

    @app.route("/isalive")
    def isalive():
        return "I'm alive"

    log.info("App created, returning object")

    return app


from src.api import models, variables
