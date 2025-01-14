"""Sets up the logging module"""
import logging, sys, os
from datetime import datetime
from pathlib import Path
from logging.handlers import TimedRotatingFileHandler

# Get directory of this file
path = os.path.dirname(os.path.abspath(__file__))
# Go up to project root
ROOT_DIR = Path(path).parent.absolute().parent.absolute()

def get_level(level):
    return {
        'notset': 0,
        'debug': 10,
        'info': 20,
        'warn': 30,
        'error': 40,
        'critical': 50
    }[level]

class LogConfig():
    log_dir = os.path.join(ROOT_DIR, "logs")
    file_name = "backend-{:%%Y-%%m-%%d}.log"
    level = get_level(os.getenv("LOG_LEVEL", "info"))
    format = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

def get_console_handler():
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(LogConfig.format)
    return console_handler


def get_file_handler():
    LOG_FILE = os.path.join(LogConfig.log_dir, LogConfig.file_name)
    file_handler = TimedRotatingFileHandler(LOG_FILE.format(datetime.now()), when='midnight')
    file_handler.setFormatter(LogConfig.format)
    return file_handler


def get_logger(logger_name):
    logger = logging.getLogger(logger_name)
    logger.setLevel(LogConfig.level)
    logger.addHandler(get_console_handler())
    logger.addHandler(get_file_handler())
    logger.propagate = False
    return logger
