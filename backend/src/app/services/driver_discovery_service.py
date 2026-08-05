"""Business logic for the driver discovery workflow."""

import logging

from app.models.discovery import DriversPayload
from app.services.driver_discovery_serializer import DriverSerializer
from app.services.fastf1_service import FastF1Service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

logger = logging.getLogger("racecraft.driver_discovery")


class DriverDiscoveryService:
    """Load and serialize the drivers that participated in a selected session."""

    def __init__(self, fastf1_service: FastF1Service) -> None:
        self._fastf1_service = fastf1_service

    def list_drivers(self, season: int, event: str, session: str) -> DriversPayload:
        """Return frontend-ready driver metadata for one session."""
        try:
            provider_records = self._fastf1_service.load_driver_results(season, event, session)
            drivers = [DriverSerializer.serialize(driver) for driver in provider_records]
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(
                f"Session {session!r} was not found for {event!r} in season {season}."
            ) from error
        except Exception as error:
            logger.exception("Unable to load drivers for %s, %s, %s", season, event, session)
            raise DiscoveryProviderError("Driver data is temporarily unavailable.") from error

        if not drivers:
            raise DiscoveryResourceNotFoundError(
                f"Session {session!r} was not found for {event!r} in season {season}."
            )

        logger.info("Loaded %s drivers for %s, %s, %s", len(drivers), season, event, session)
        return DriversPayload(drivers=drivers)
