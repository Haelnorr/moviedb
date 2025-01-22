from flask import Flask
from flask_smorest import Api
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from src.logger import get_logger
from src.api.config import Config

log = get_logger(__name__)

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()

def create_app(config_class=Config):
    log.info("Creating flask app")
    app = Flask(__name__)
    app.config.from_object(config_class)
    api = Api(app)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    jwt.init_app(app)

    from src.api.movies import bp as movies_bp
    from src.api.auth import bp as auth_bp
    api.register_blueprint(movies_bp)
    api.register_blueprint(auth_bp)

    log.info("App created, returning object")

    return app


from src.api import variables, models
