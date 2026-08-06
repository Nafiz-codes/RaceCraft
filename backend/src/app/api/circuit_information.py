"""Versioned read-only Formula 1 circuit information resource."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.api.exceptions import RaceCraftApiException
from app.models.api import SuccessResponse
from app.models.discovery import CircuitInformationPayload
from app.services.circuit_information_service import CircuitInformationService
from app.services.dependencies import get_circuit_information_service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

router = APIRouter(tags=["Circuit information"])

CURRENT_SEASON = datetime.now(UTC).year
SeasonPath = Annotated[int, Path(ge=2018, le=CURRENT_SEASON, description="Formula 1 season")]
EventPath = Annotated[str, Path(min_length=1, max_length=120, description="Event name")]
SessionPath = Annotated[str, Path(min_length=1, max_length=64, description="Session name or key")]


@router.get(
    "/seasons/{season}/events/{event}/sessions/{session}/circuit-information",
    response_model=SuccessResponse[CircuitInformationPayload],
)
def get_circuit_information(
    season: SeasonPath,
    event: EventPath,
    session: SessionPath,
    circuit_information_service: Annotated[
        CircuitInformationService, Depends(get_circuit_information_service)
    ],
) -> SuccessResponse[CircuitInformationPayload]:
    """Return available provider circuit information for the selected session."""
    try:
        return SuccessResponse(
            data=circuit_information_service.get_circuit_information(season, event, session)
        )
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "CIRCUIT_INFORMATION_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "CIRCUIT_INFORMATION_UNAVAILABLE",
            "Circuit information is temporarily unavailable.",
        ) from error
