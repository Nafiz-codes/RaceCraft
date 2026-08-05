"""Versioned read-only resources for Formula 1 lap discovery."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.api.exceptions import RaceCraftApiException
from app.models.api import SuccessResponse
from app.models.discovery import LapsPayload
from app.services.dependencies import get_lap_discovery_service
from app.services.lap_discovery_service import LapDiscoveryService
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

router = APIRouter(tags=["Lap discovery"])

CURRENT_SEASON = datetime.now(UTC).year
SeasonPath = Annotated[int, Path(ge=2018, le=CURRENT_SEASON, description="Formula 1 season")]
EventPath = Annotated[str, Path(min_length=1, max_length=120, description="Event name")]
SessionPath = Annotated[str, Path(min_length=1, max_length=64, description="Session name or key")]
DriverPath = Annotated[str, Path(min_length=1, max_length=16, description="Driver abbreviation")]


@router.get(
    "/seasons/{season}/events/{event}/sessions/{session}/drivers/{driver}/laps",
    response_model=SuccessResponse[LapsPayload],
)
def get_laps(
    season: SeasonPath,
    event: EventPath,
    session: SessionPath,
    driver: DriverPath,
    lap_discovery_service: Annotated[LapDiscoveryService, Depends(get_lap_discovery_service)],
) -> SuccessResponse[LapsPayload]:
    """List lap metadata for a selected driver and session."""
    try:
        return SuccessResponse(data=lap_discovery_service.list_laps(season, event, session, driver))
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "DRIVER_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "LAP_DISCOVERY_UNAVAILABLE",
            "Lap data is temporarily unavailable.",
        ) from error
