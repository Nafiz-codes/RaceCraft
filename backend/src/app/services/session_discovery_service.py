"""Business logic for the season, event, and session discovery workflow."""

import logging
from datetime import UTC, datetime

from app.models.discovery import EventsPayload, SeasonModel, SeasonsPayload, SessionsPayload
from app.services.fastf1_service import FastF1Service
from app.services.session_discovery_serializers import serialize_event, serialize_sessions

logger = logging.getLogger("racecraft.discovery")

FIRST_SUPPORTED_SEASON = 2018


class DiscoveryResourceNotFoundError(LookupError):
    """Raised when the provider cannot locate a requested discovery resource."""


class DiscoveryProviderError(RuntimeError):
    """Raised when FastF1 cannot provide discovery data."""


class SessionDiscoveryService:
    """Coordinate discovery data through the provider-neutral service layer."""

    def __init__(self, fastf1_service: FastF1Service) -> None:
        self._fastf1_service = fastf1_service

    def list_seasons(self) -> SeasonsPayload:
        """Return every supported season that FastF1 can currently load."""
        current_season = datetime.now(UTC).year
        seasons: list[SeasonModel] = []

        for season in range(current_season, FIRST_SUPPORTED_SEASON - 1, -1):
            try:
                schedule = self._fastf1_service.load_season(season)
            except Exception:
                logger.warning(
                    "Unable to load FastF1 schedule for season %s", season, exc_info=True
                )
                continue

            if not schedule.empty:
                seasons.append(SeasonModel(year=season))

        if not seasons:
            raise DiscoveryProviderError("No Formula 1 seasons are currently available.")

        logger.info("Loaded %s available seasons", len(seasons))
        return SeasonsPayload(seasons=seasons)

    def list_events(self, season: int) -> EventsPayload:
        """Return event metadata for a selected season."""
        try:
            schedule = self._fastf1_service.load_season(season)
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(f"Season {season} was not found.") from error
        except Exception as error:
            logger.exception("Unable to load FastF1 schedule for season %s", season)
            raise DiscoveryProviderError("Event data is temporarily unavailable.") from error

        events = [
            serialize_event(event)
            for _, event in schedule.iterrows()
            if event.get("RoundNumber", 0) > 0
        ]
        if not events:
            raise DiscoveryResourceNotFoundError(f"Season {season} was not found.")

        logger.info("Loaded %s events for season %s", len(events), season)
        return EventsPayload(events=events)

    def list_sessions(self, season: int, event: str) -> SessionsPayload:
        """Return session metadata for a selected event."""
        try:
            provider_event = self._fastf1_service.load_event(season, event)
            sessions = serialize_sessions(provider_event)
        except (KeyError, ValueError, IndexError) as error:
            raise DiscoveryResourceNotFoundError(
                f"Event {event!r} was not found in season {season}."
            ) from error
        except Exception as error:
            logger.exception("Unable to load event %s for season %s", event, season)
            raise DiscoveryProviderError("Session data is temporarily unavailable.") from error

        if not sessions:
            raise DiscoveryResourceNotFoundError(
                f"Event {event!r} was not found in season {season}."
            )

        logger.info("Loaded %s sessions for %s in season %s", len(sessions), event, season)
        return SessionsPayload(sessions=sessions)
