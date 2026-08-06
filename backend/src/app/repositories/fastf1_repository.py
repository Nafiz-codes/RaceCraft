"""The only backend layer that communicates with FastF1 directly."""

from pathlib import Path

import fastf1
from fastf1.core import Session
from fastf1.events import Event, EventSchedule

type EventIdentifier = int | str
type SessionIdentifier = int | str

TELEMETRY_COLUMNS = (
    "Time",
    "Distance",
    "Speed",
    "Throttle",
    "Brake",
    "RPM",
    "nGear",
    "DRS",
    "X",
    "Y",
    "Z",
)

CIRCUIT_GEOMETRY_COLUMNS = ("X", "Y", "Distance")


class FastF1Repository:
    """Thin provider adapter for loading FastF1 resources."""

    def enable_cache(self, cache_directory: Path) -> None:
        """Configure FastF1's own persistent cache location."""
        fastf1.Cache.enable_cache(str(cache_directory))

    def load_season(self, season: int) -> EventSchedule:
        """Load the FastF1 event schedule for a championship season."""
        return fastf1.get_event_schedule(season)

    def load_event(self, season: int, event: EventIdentifier) -> Event:
        """Load the FastF1 event identified by name or championship round."""
        return fastf1.get_event(season, event)

    def load_session(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> Session:
        """Create a FastF1 session object without loading telemetry data."""
        return fastf1.get_session(season, event, session)

    def load_driver_results(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> list[dict[str, object]]:
        """Load only the provider metadata needed to discover session drivers."""
        fastf1_session = self.load_session(season, event, session)
        fastf1_session.load(laps=False, telemetry=False, weather=False, messages=False)
        return [driver.to_dict() for _, driver in fastf1_session.results.iterrows()]

    def load_driver_lap_records(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
        driver: str,
    ) -> list[dict[str, object]]:
        """Load one driver's lap metadata without requesting telemetry data."""
        fastf1_session = self.load_session(season, event, session)
        fastf1_session.load(laps=True, telemetry=False, weather=False, messages=False)
        driver_laps = fastf1_session.laps.pick_drivers(driver)
        return [lap.to_dict() for _, lap in driver_laps.iterrows()]

    def load_lap_telemetry_records(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
        driver: str,
        lap: int,
    ) -> list[dict[str, object]]:
        """Load raw FastF1 telemetry records for one driver lap exactly once."""
        fastf1_session = self.load_session(season, event, session)
        fastf1_session.load(laps=True, telemetry=True, weather=False, messages=False)
        selected_laps = fastf1_session.laps.pick_drivers(driver).pick_laps(lap)
        if selected_laps.empty:
            return []

        telemetry = selected_laps.iloc[0].get_telemetry()
        return telemetry.loc[:, TELEMETRY_COLUMNS].to_dict(orient="records")

    def load_circuit_geometry_records(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> list[dict[str, object]]:
        """Load ordered provider circuit geometry from the session reference lap."""
        fastf1_session = self.load_session(season, event, session)
        fastf1_session.load(laps=True, telemetry=True, weather=False, messages=False)
        reference_lap = fastf1_session.laps.pick_fastest()
        if reference_lap is None:
            return []

        geometry = reference_lap.get_telemetry()
        return geometry.loc[:, CIRCUIT_GEOMETRY_COLUMNS].to_dict(orient="records")

    def load_session_weather_record(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> dict[str, object] | None:
        """Load the first recorded weather reading for a selected session."""
        fastf1_session = self.load_session(season, event, session)
        fastf1_session.load(laps=False, telemetry=False, weather=True, messages=False)
        if fastf1_session.weather_data.empty:
            return None
        return fastf1_session.weather_data.iloc[0].to_dict()

    def load_circuit_information_record(
        self,
        season: int,
        event: EventIdentifier,
        session: SessionIdentifier,
    ) -> dict[str, object]:
        """Load provider-backed event, session, and circuit metadata once."""
        fastf1_session = self.load_session(season, event, session)
        fastf1_session.load(laps=True, telemetry=False, weather=False, messages=False)
        circuit_info = fastf1_session.get_circuit_info()

        return {
            "CircuitName": None,
            "EventName": fastf1_session.event.get("EventName"),
            "Country": fastf1_session.event.get("Country"),
            "Location": fastf1_session.event.get("Location"),
            "CircuitLength": None,
            "NumberOfCorners": len(circuit_info.corners),
            "SessionName": fastf1_session.name,
            "EventDate": fastf1_session.event.get("EventDate"),
        }
