"""Web app is instantiated and run from here"""
from src.logger import get_logger
log = get_logger(__name__)

log.info('Starting web app')
from src.api import create_app
app = create_app()
log.info('Accepting requests')

