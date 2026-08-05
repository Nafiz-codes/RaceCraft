"""Versioned read-only resources for Formula 1 session discovery."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.api.exceptions import RaceCraftApiException
from app.models.api import SuccessResponse
from app.models.discovery import EventsPayload, SeasonsPayload, SessionsPayload
from app.services.dependencies import get_session_discovery_service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
    SessionDiscoveryService,
)

router = APIRouter(tags=["Session discovery"])

CURRENT_SEASON = datetime.now(UTC).year
SeasonPath = Annotated[int, Path(ge=2018, le=CURRENT_SEASON, description="Formula 1 season")]
EventPath = Annotated[str, Path(min_length=1, max_length=120, description="Event name")]


@router.get("/seasons", response_model=SuccessResponse[SeasonsPayload])
def get_seasons(
    discovery_service: Annotated[SessionDiscoveryService, Depends(get_session_discovery_service)],
) -> SuccessResponse[SeasonsPayload]:
    """List the FastF1-backed seasons available for analysis."""
    try:
        return SuccessResponse(data=discovery_service.list_seasons())
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "SEASON_DISCOVERY_UNAVAILABLE",
            "Season data is temporarily unavailable.",
        ) from error


@router.get("/seasons/{season}/events", response_model=SuccessResponse[EventsPayload])
def get_events(
    season: SeasonPath,
    discovery_service: Annotated[SessionDiscoveryService, Depends(get_session_discovery_service)],
) -> SuccessResponse[EventsPayload]:
    """List events available for the selected season."""
    try:
        return SuccessResponse(data=discovery_service.list_events(season))
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "SEASON_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "EVENT_DISCOVERY_UNAVAILABLE",
            "Event data is temporarily unavailable.",
        ) from error


@router.get(
    "/seasons/{season}/events/{event}/sessions",
    response_model=SuccessResponse[SessionsPayload],
)
def get_sessions(
    season: SeasonPath,
    event: EventPath,
    discovery_service: Annotated[SessionDiscoveryService, Depends(get_session_discovery_service)],
) -> SuccessResponse[SessionsPayload]:
    """List sessions available for the selected event."""
    try:
        return SuccessResponse(data=discovery_service.list_sessions(season, event))
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "EVENT_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "SESSION_DISCOVERY_UNAVAILABLE",
            "Session data is temporarily unavailable.",
        ) from error
