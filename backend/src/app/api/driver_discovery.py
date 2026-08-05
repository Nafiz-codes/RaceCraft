"""Versioned read-only resources for Formula 1 driver discovery."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.api.exceptions import RaceCraftApiException
from app.models.api import SuccessResponse
from app.models.discovery import DriversPayload
from app.services.dependencies import get_driver_discovery_service
from app.services.driver_discovery_service import DriverDiscoveryService
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

router = APIRouter(tags=["Driver discovery"])

CURRENT_SEASON = datetime.now(UTC).year
SeasonPath = Annotated[int, Path(ge=2018, le=CURRENT_SEASON, description="Formula 1 season")]
EventPath = Annotated[str, Path(min_length=1, max_length=120, description="Event name")]
SessionPath = Annotated[str, Path(min_length=1, max_length=64, description="Session name or key")]


@router.get(
    "/seasons/{season}/events/{event}/sessions/{session}/drivers",
    response_model=SuccessResponse[DriversPayload],
)
def get_drivers(
    season: SeasonPath,
    event: EventPath,
    session: SessionPath,
    driver_discovery_service: Annotated[
        DriverDiscoveryService, Depends(get_driver_discovery_service)
    ],
) -> SuccessResponse[DriversPayload]:
    """List drivers with metadata for the selected Formula 1 session."""
    try:
        return SuccessResponse(data=driver_discovery_service.list_drivers(season, event, session))
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "SESSION_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "DRIVER_DISCOVERY_UNAVAILABLE",
            "Driver data is temporarily unavailable.",
        ) from error
