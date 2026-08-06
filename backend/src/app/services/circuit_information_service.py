"""Business logic for Formula 1 circuit information retrieval."""

import logging

from app.models.discovery import CircuitInformationPayload
from app.services.circuit_information_serializer import CircuitInformationSerializer
from app.services.fastf1_service import FastF1Service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

logger = logging.getLogger("racecraft.circuit_information")


class CircuitInformationService:
    """Load provider-backed circuit metadata for one selected session."""

    def __init__(self, fastf1_service: FastF1Service) -> None:
        self._fastf1_service = fastf1_service

    def get_circuit_information(
        self, season: int, event: str, session: str
    ) -> CircuitInformationPayload:
        """Return circuit metadata exactly where the provider makes it available."""
        try:
            provider_record = self._fastf1_service.load_circuit_information_record(
                season, event, session
            )
            circuit = CircuitInformationSerializer.serialize(provider_record)
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(
                f"Circuit information was not found for session {session!r} in {event!r} "
                f"for season {season}."
            ) from error
        except Exception as error:
            logger.exception(
                "Unable to load circuit information for %s, %s, %s", season, event, session
            )
            raise DiscoveryProviderError(
                "Circuit information is temporarily unavailable."
            ) from error

        logger.info("Loaded circuit information for %s, %s, %s", season, event, session)
        return CircuitInformationPayload(circuit=circuit)
