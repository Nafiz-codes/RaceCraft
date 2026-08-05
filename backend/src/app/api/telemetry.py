"""Versioned read-only resources for raw Formula 1 telemetry."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.api.exceptions import RaceCraftApiException
from app.models.api import SuccessResponse
from app.models.discovery import TelemetryPayload
from app.services.dependencies import get_telemetry_service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)
from app.services.telemetry_service import TelemetryService

router = APIRouter(tags=["Telemetry"])

CURRENT_SEASON = datetime.now(UTC).year
SeasonPath = Annotated[int, Path(ge=2018, le=CURRENT_SEASON, description="Formula 1 season")]
EventPath = Annotated[str, Path(min_length=1, max_length=120, description="Event name")]
SessionPath = Annotated[str, Path(min_length=1, max_length=64, description="Session name or key")]
DriverPath = Annotated[str, Path(min_length=1, max_length=16, description="Driver abbreviation")]
LapPath = Annotated[int, Path(ge=1, description="Driver lap number")]


@router.get(
    "/seasons/{season}/events/{event}/sessions/{session}/drivers/{driver}/laps/{lap}/telemetry",
    response_model=SuccessResponse[TelemetryPayload],
)
def get_lap_telemetry(
    season: SeasonPath,
    event: EventPath,
    session: SessionPath,
    driver: DriverPath,
    lap: LapPath,
    telemetry_service: Annotated[TelemetryService, Depends(get_telemetry_service)],
) -> SuccessResponse[TelemetryPayload]:
    """Return ordered, raw FastF1 telemetry for one selected driver lap."""
    try:
        return SuccessResponse(
            data=telemetry_service.get_lap_telemetry(season, event, session, driver, lap)
        )
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "LAP_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "TELEMETRY_UNAVAILABLE",
            "Telemetry data is temporarily unavailable.",
        ) from error
