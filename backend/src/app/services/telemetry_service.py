"""Business logic for raw telemetry retrieval."""

import logging

from app.models.discovery import TelemetryPayload
from app.services.fastf1_service import FastF1Service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)
from app.services.telemetry_serializer import TelemetrySerializer

logger = logging.getLogger("racecraft.telemetry")


class TelemetryService:
    """Load raw ordered telemetry samples for one selected driver lap."""

    def __init__(self, fastf1_service: FastF1Service) -> None:
        self._fastf1_service = fastf1_service

    def get_lap_telemetry(
        self, season: int, event: str, session: str, driver: str, lap: int
    ) -> TelemetryPayload:
        """Return raw provider samples without interpolation or analysis."""
        try:
            provider_records = self._fastf1_service.load_lap_telemetry_records(
                season, event, session, driver, lap
            )
            telemetry = [TelemetrySerializer.serialize(record) for record in provider_records]
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(
                f"Lap {lap} for driver {driver!r} was not found in session {session!r} "
                f"for {event!r} in season {season}."
            ) from error
        except Exception as error:
            logger.exception(
                "Unable to load telemetry for %s, %s, %s, %s, lap %s",
                season,
                event,
                session,
                driver,
                lap,
            )
            raise DiscoveryProviderError("Telemetry data is temporarily unavailable.") from error

        if not telemetry:
            raise DiscoveryResourceNotFoundError(
                f"Lap {lap} for driver {driver!r} was not found in session {session!r} "
                f"for {event!r} in season {season}."
            )

        logger.info(
            "Loaded %s telemetry samples for %s lap %s in %s, %s, %s",
            len(telemetry),
            driver,
            lap,
            season,
            event,
            session,
        )
        return TelemetryPayload(telemetry=telemetry)
