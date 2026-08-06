"""Versioned read-only resources for Formula 1 circuit geometry."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.api.exceptions import RaceCraftApiException
from app.models.api import SuccessResponse
from app.models.discovery import CircuitPayload
from app.services.circuit_service import CircuitService
from app.services.dependencies import get_circuit_service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

router = APIRouter(tags=["Circuit"])

CURRENT_SEASON = datetime.now(UTC).year
SeasonPath = Annotated[int, Path(ge=2018, le=CURRENT_SEASON, description="Formula 1 season")]
EventPath = Annotated[str, Path(min_length=1, max_length=120, description="Event name")]
SessionPath = Annotated[str, Path(min_length=1, max_length=64, description="Session name or key")]


@router.get(
    "/seasons/{season}/events/{event}/sessions/{session}/circuit",
    response_model=SuccessResponse[CircuitPayload],
)
def get_circuit(
    season: SeasonPath,
    event: EventPath,
    session: SessionPath,
    circuit_service: Annotated[CircuitService, Depends(get_circuit_service)],
) -> SuccessResponse[CircuitPayload]:
    """Return the selected session's ordered circuit geometry."""
    try:
        return SuccessResponse(data=circuit_service.get_circuit(season, event, session))
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "CIRCUIT_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "CIRCUIT_UNAVAILABLE",
            "Circuit geometry is temporarily unavailable.",
        ) from error
