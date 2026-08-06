"""Versioned read-only resources for Formula 1 session weather."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.api.exceptions import RaceCraftApiException
from app.models.api import SuccessResponse
from app.models.discovery import WeatherPayload
from app.services.dependencies import get_weather_service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)
from app.services.weather_service import WeatherService

router = APIRouter(tags=["Weather"])

CURRENT_SEASON = datetime.now(UTC).year
SeasonPath = Annotated[int, Path(ge=2018, le=CURRENT_SEASON, description="Formula 1 season")]
EventPath = Annotated[str, Path(min_length=1, max_length=120, description="Event name")]
SessionPath = Annotated[str, Path(min_length=1, max_length=64, description="Session name or key")]


@router.get(
    "/seasons/{season}/events/{event}/sessions/{session}/weather",
    response_model=SuccessResponse[WeatherPayload],
)
def get_weather(
    season: SeasonPath,
    event: EventPath,
    session: SessionPath,
    weather_service: Annotated[WeatherService, Depends(get_weather_service)],
) -> SuccessResponse[WeatherPayload]:
    """Return the first recorded real weather reading for a selected session."""
    try:
        return SuccessResponse(data=weather_service.get_weather(season, event, session))
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "WEATHER_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "WEATHER_UNAVAILABLE",
            "Weather data is temporarily unavailable.",
        ) from error
