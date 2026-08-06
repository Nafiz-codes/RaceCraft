"""Business logic for circuit geometry retrieval."""

import logging

from app.models.discovery import CircuitPayload
from app.services.circuit_serializer import CircuitSerializer
from app.services.fastf1_service import FastF1Service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

logger = logging.getLogger("racecraft.circuit")


class CircuitService:
    """Load ordered circuit geometry for a selected Formula 1 session."""

    def __init__(self, fastf1_service: FastF1Service) -> None:
        self._fastf1_service = fastf1_service

    def get_circuit(self, season: int, event: str, session: str) -> CircuitPayload:
        """Return provider circuit points without simplification or smoothing."""
        try:
            provider_records = self._fastf1_service.load_circuit_geometry_records(
                season, event, session
            )
            points = [CircuitSerializer.serialize(record) for record in provider_records]
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(
                f"Circuit geometry was not found for session {session!r} in {event!r} "
                f"for season {season}."
            ) from error
        except Exception as error:
            logger.exception(
                "Unable to load circuit geometry for %s, %s, %s", season, event, session
            )
            raise DiscoveryProviderError("Circuit geometry is temporarily unavailable.") from error

        if not points:
            raise DiscoveryResourceNotFoundError(
                f"Circuit geometry was not found for session {session!r} in {event!r} "
                f"for season {season}."
            )

        logger.info("Loaded %s circuit points for %s, %s, %s", len(points), season, event, session)
        return CircuitPayload(points=points)
