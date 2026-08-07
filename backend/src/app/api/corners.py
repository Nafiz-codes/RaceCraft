"""Versioned read-only Formula 1 circuit corner resources."""

from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Path, status

from app.api.exceptions import RaceCraftApiException
from app.models.api import SuccessResponse
from app.models.discovery import CornersPayload
from app.services.corner_service import CornerService
from app.services.dependencies import get_corner_service
from app.services.session_discovery_service import (
    DiscoveryProviderError,
    DiscoveryResourceNotFoundError,
)

router = APIRouter(tags=["Corners"])

CURRENT_SEASON = datetime.now(UTC).year
SeasonPath = Annotated[int, Path(ge=2018, le=CURRENT_SEASON, description="Formula 1 season")]
EventPath = Annotated[str, Path(min_length=1, max_length=120, description="Event name")]
SessionPath = Annotated[str, Path(min_length=1, max_length=64, description="Session name or key")]


@router.get(
    "/seasons/{season}/events/{event}/sessions/{session}/corners",
    response_model=SuccessResponse[CornersPayload],
)
def get_corners(
    season: SeasonPath,
    event: EventPath,
    session: SessionPath,
    corner_service: Annotated[CornerService, Depends(get_corner_service)],
) -> SuccessResponse[CornersPayload]:
    """Return official FastF1 circuit corner metadata."""
    try:
        return SuccessResponse(data=corner_service.list_corners(season, event, session))
    except DiscoveryResourceNotFoundError as error:
        raise RaceCraftApiException(
            status.HTTP_404_NOT_FOUND, "CORNERS_NOT_FOUND", str(error)
        ) from error
    except DiscoveryProviderError as error:
        raise RaceCraftApiException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "CORNERS_UNAVAILABLE",
            "Corner metadata is temporarily unavailable.",
        ) from error
