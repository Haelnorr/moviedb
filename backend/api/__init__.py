from flask import Flask
from flask_smorest import Api
from backend.logger import get_logger
from backend.api.config import Config

log = get_logger(__name__)

def create_app(config_class=Config):
    log.info("Creating flask app")
    app = Flask(__name__)
    app.config.from_object(config_class)
    api = Api(app)

    # do stuff here

    from backend.api.blueprints.movies import bp as movies_bp
    api.register_blueprint(movies_bp)

    log.info("App created, returning object")

    return app


from backend.api import models
