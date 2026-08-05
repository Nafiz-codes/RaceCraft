"""Public RaceCraft domain models for session discovery."""

from __future__ import annotations

from datetime import date as Date

from pydantic import BaseModel, Field


class SeasonModel(BaseModel):
    """A Formula 1 season supported by the discovery workflow."""

    year: int = Field(ge=1950)


class EventModel(BaseModel):
    """Metadata required to select a Formula 1 event."""

    round: int = Field(ge=1)
    eventName: str = Field(min_length=1)
    country: str = Field(min_length=1)
    location: str = Field(min_length=1)
    date: Date | None = None


class SessionModel(BaseModel):
    """Metadata required to select one session within an event."""

    sessionKey: str = Field(min_length=1)
    sessionName: str = Field(min_length=1)
    date: Date | None = None


class SeasonsPayload(BaseModel):
    """Collection of available seasons."""

    seasons: list[SeasonModel]


class EventsPayload(BaseModel):
    """Collection of events for one season."""

    events: list[EventModel]


class SessionsPayload(BaseModel):
    """Collection of sessions for one event."""

    sessions: list[SessionModel]


class DriverModel(BaseModel):
    """Metadata required to identify a driver in the analysis workspace."""

    driverNumber: str = Field(min_length=1)
    abbreviation: str = Field(min_length=1)
    broadcastName: str = Field(min_length=1)
    fullName: str = Field(min_length=1)
    teamName: str = Field(min_length=1)
    teamColor: str | None = None
    countryCode: str | None = None
    headshotUrl: str | None = None


class DriversPayload(BaseModel):
    """Collection of drivers available in one Formula 1 session."""

    drivers: list[DriverModel]


class LapModel(BaseModel):
    """Metadata for one completed or in-progress lap in a selected session."""

    lapNumber: int = Field(ge=1)
    lapTime: str | None = None
    tyreCompound: str | None = None
    tyreLife: int | None = Field(default=None, ge=0)
    isPersonalBest: bool
    isAccurate: bool
    pitOutLap: bool
    pitInLap: bool


class LapsPayload(BaseModel):
    """Collection of lap metadata for one driver in a selected session."""

    laps: list[LapModel]


class TelemetryModel(BaseModel):
    """One raw FastF1 telemetry sample for a selected driver lap."""

    time: str = Field(min_length=1)
    distance: float
    speed: float
    throttle: float
    brake: bool
    rpm: float
    gear: int
    drs: int
    x: float
    y: float
    z: float


class TelemetryPayload(BaseModel):
    """Ordered raw telemetry samples for one selected driver lap."""

    telemetry: list[TelemetryModel]
