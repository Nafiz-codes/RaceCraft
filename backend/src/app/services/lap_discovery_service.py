"""Business logic for the lap discovery workflow."""

import logging

from app.models.discovery import LapsPayload
from app.services.fastf1_service import FastF1Service
from app.services.lap_discovery_serializer import LapSerializer
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

logger = logging.getLogger("racecraft.lap_discovery")


class LapDiscoveryService:
    """Load and serialize one driver's lap metadata for a selected session."""

    def __init__(self, fastf1_service: FastF1Service) -> None:
        self._fastf1_service = fastf1_service

    def list_laps(self, season: int, event: str, session: str, driver: str) -> LapsPayload:
        """Return frontend-ready lap metadata without telemetry traces."""
        try:
            provider_records = self._fastf1_service.load_driver_lap_records(
                season, event, session, driver
            )
            laps = [LapSerializer.serialize(lap) for lap in provider_records]
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(
                f"Driver {driver!r} was not found in session {session!r} for {event!r} "
                f"in season {season}."
            ) from error
        except Exception as error:
            logger.exception(
                "Unable to load laps for %s, %s, %s, %s", season, event, session, driver
            )
            raise DiscoveryProviderError("Lap data is temporarily unavailable.") from error

        if not laps:
            raise DiscoveryResourceNotFoundError(
                f"Driver {driver!r} was not found in session {session!r} for {event!r} "
                f"in season {season}."
            )

        logger.info(
            "Loaded %s laps for %s in %s, %s, %s", len(laps), driver, season, event, session
        )
        return LapsPayload(laps=laps)
