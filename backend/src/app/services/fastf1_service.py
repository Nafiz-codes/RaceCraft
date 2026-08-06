"""Internal application service for FastF1-backed resources."""

from pathlib import Path

from fastf1.core import Session
from fastf1.events import Event, EventSchedule

from app.repositories.fastf1_repository import (
    EventIdentifier,
    FastF1Repository,
    SessionIdentifier,
)


class FastF1Service:
    """Coordinate provider access without coupling callers to FastF1 functions."""

    def __init__(self, repository: FastF1Repository) -> None:
        self._repository = repository

    def initialize_cache(self, cache_directory: Path) -> None:
        """Enable the provider cache after filesystem validation succeeds."""
        self._repository.enable_cache(cache_directory)

    def load_season(self, season: int) -> EventSchedule:
        """Load a season's event schedule for internal domain processing."""
        self._validate_season(season)
        return self._repository.load_season(season)

    def load_event(self, season: int, event: EventIdentifier) -> Event:
        """Load an event for internal domain processing."""
        self._validate_season(season)
        self._validate_identifier(event, "event")
        return self._repository.load_event(season, event)

    def load_session(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> Session:
        """Load a session shell without requesting any telemetry data."""
        self._validate_season(season)
        self._validate_identifier(event, "event")
        self._validate_identifier(session, "session")
        return self._repository.load_session(season, event, session)

    def load_driver_results(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> list[dict[str, object]]:
        """Load driver metadata without requesting telemetry or lap data."""
        self._validate_season(season)
        self._validate_identifier(event, "event")
        self._validate_identifier(session, "session")
        return self._repository.load_driver_results(season, event, session)

    def load_driver_lap_records(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
        driver: str,
    ) -> list[dict[str, object]]:
        """Load one driver's lap metadata without requesting telemetry data."""
        self._validate_season(season)
        self._validate_identifier(event, "event")
        self._validate_identifier(session, "session")
        self._validate_identifier(driver, "driver")
        return self._repository.load_driver_lap_records(season, event, session, driver)

    def load_lap_telemetry_records(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
        driver: str,
        lap: int,
    ) -> list[dict[str, object]]:
        """Load raw telemetry records for one driver lap from the repository."""
        self._validate_season(season)
        self._validate_identifier(event, "event")
        self._validate_identifier(session, "session")
        self._validate_identifier(driver, "driver")
        if lap < 1:
            raise ValueError("lap must be a positive lap number")
        return self._repository.load_lap_telemetry_records(season, event, session, driver, lap)

    def load_circuit_geometry_records(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> list[dict[str, object]]:
        """Load ordered circuit geometry records from the repository."""
        self._validate_season(season)
        self._validate_identifier(event, "event")
        self._validate_identifier(session, "session")
        return self._repository.load_circuit_geometry_records(season, event, session)

    def load_session_weather_record(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> dict[str, object] | None:
        """Load the selected session's weather reference reading."""
        self._validate_season(season)
        self._validate_identifier(event, "event")
        self._validate_identifier(session, "session")
        return self._repository.load_session_weather_record(season, event, session)

    def load_circuit_information_record(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> dict[str, object]:
        """Load provider circuit metadata without exposing provider objects."""
        self._validate_season(season)
        self._validate_identifier(event, "event")
        self._validate_identifier(session, "session")
        return self._repository.load_circuit_information_record(season, event, session)

    @staticmethod
    def _validate_season(season: int) -> None:
        if season < 1950:
            raise ValueError("season must be 1950 or later")

    @staticmethod
    def _validate_identifier(value: EventIdentifier | SessionIdentifier, name: str) -> None:
        if isinstance(value, int) and value > 0:
            return
        if isinstance(value, str) and value.strip():
            return
        raise ValueError(f"{name} must be a positive round number or a non-empty name")
