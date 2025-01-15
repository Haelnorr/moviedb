"""Web app is instantiated and run from here"""
from src.logger import get_logger
log = get_logger(__name__)

log.info('Starting web app')
from src.api import create_app
app = create_app()
log.info('Accepting requests')


import sqlalchemy as sa
import sqlalchemy.orm as so
from src.api import db
from src.api.models import User

@app.shell_context_processor
def make_shell_context():
    return {
        'sa': sa,
        'so': so,
        'db': db,
        'User': User
    }
