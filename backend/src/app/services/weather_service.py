"""Business logic for session weather retrieval."""

import logging

from app.models.discovery import WeatherPayload
from app.services.fastf1_service import FastF1Service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)
from app.services.weather_serializer import WeatherSerializer

logger = logging.getLogger("racecraft.weather")


class WeatherService:
    """Load the recorded weather reference for a selected Formula 1 session."""

    def __init__(self, fastf1_service: FastF1Service) -> None:
        self._fastf1_service = fastf1_service

    def get_weather(self, season: int, event: str, session: str) -> WeatherPayload:
        """Return one real session weather reading without aggregation."""
        try:
            provider_record = self._fastf1_service.load_session_weather_record(
                season, event, session
            )
            if provider_record is None:
                raise DiscoveryResourceNotFoundError(
                    f"Weather data was not found for session {session!r} in {event!r} "
                    f"for season {season}."
                )
            weather = WeatherSerializer.serialize(provider_record)
        except DiscoveryResourceNotFoundError:
            raise
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(
                f"Weather data was not found for session {session!r} in {event!r} "
                f"for season {season}."
            ) from error
        except Exception as error:
            logger.exception("Unable to load weather for %s, %s, %s", season, event, session)
            raise DiscoveryProviderError("Weather data is temporarily unavailable.") from error

        logger.info("Loaded weather for %s, %s, %s", season, event, session)
        return WeatherPayload(weather=weather)
