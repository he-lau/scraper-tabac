# scraper/logger.py

from loguru import logger
import sys

logger.remove()  # supprime le handler par défaut

logger.add(
    sys.stdout,
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
    level="INFO"
)

logger.add(
    "logs/scraper.log",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
    level="DEBUG",
    rotation="1 week",    # nouveau fichier chaque semaine
    retention="1 month",  # supprime les logs de plus d'1 mois
    compression="zip"     # archive les anciens logs
)