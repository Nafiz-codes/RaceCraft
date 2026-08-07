"""Business logic for official Formula 1 circuit corner retrieval."""

import logging

from app.models.discovery import CornersPayload
from app.services.corner_serializer import CornerSerializer
from app.services.fastf1_service import FastF1Service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

logger = logging.getLogger("racecraft.corners")


class CornerService:
    """Load official FastF1 circuit corner metadata for one session."""

    def __init__(self, fastf1_service: FastF1Service) -> None:
        self._fastf1_service = fastf1_service

    def list_corners(self, season: int, event: str, session: str) -> CornersPayload:
        """Return provider-defined circuit corners without deriving new geometry."""
        try:
            provider_records = self._fastf1_service.load_circuit_corner_records(
                season, event, session
            )
            corners = [CornerSerializer.serialize(record) for record in provider_records]
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(
                f"Corner metadata was not found for session {session!r} in {event!r} "
                f"for season {season}."
            ) from error
        except Exception as error:
            logger.exception("Unable to load corners for %s, %s, %s", season, event, session)
            raise DiscoveryProviderError("Corner metadata is temporarily unavailable.") from error

        if not corners:
            raise DiscoveryResourceNotFoundError(
                f"Corner metadata was not found for session {session!r} in {event!r} "
                f"for season {season}."
            )

        logger.info("Loaded %s corners for %s, %s, %s", len(corners), season, event, session)
        return CornersPayload(corners=corners)
