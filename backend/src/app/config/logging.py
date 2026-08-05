"""Logging configuration for the backend process."""

import logging.config

from app.config.settings import Settings


def configure_logging(settings: Settings) -> None:
    """Configure process logging from the validated application settings."""
    logging.config.dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "standard": {
                    "format": "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
                },
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "formatter": "standard",
                },
            },
            "loggers": {
                "racecraft": {
                    "handlers": ["console"],
                    "level": settings.log_level,
                    "propagate": False,
                },
            },
        }
    )
