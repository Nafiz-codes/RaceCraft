"""Convert provider lap records into stable RaceCraft domain models."""

from collections.abc import Mapping
from datetime import timedelta
from math import isnan

from app.models.discovery import LapModel


class LapSerializer:
    """Serialize provider lap records without exposing provider types."""

    @staticmethod
    def serialize(record: Mapping[str, object]) -> LapModel:
        """Convert one provider lap record into frontend-ready metadata."""
        return LapModel(
            lapNumber=_required_lap_number(record),
            lapTime=_format_lap_time(record.get("LapTime")),
            sector1Time=_format_lap_time(record.get("Sector1Time")),
            sector2Time=_format_lap_time(record.get("Sector2Time")),
            sector3Time=_format_lap_time(record.get("Sector3Time")),
            tyreCompound=_optional_text(record.get("Compound")),
            tyreLife=_optional_integer(record.get("TyreLife")),
            isPersonalBest=_boolean(record.get("IsPersonalBest")),
            isAccurate=_boolean(record.get("IsAccurate")),
            pitOutLap=not _is_missing(record.get("PitOutTime")),
            pitInLap=not _is_missing(record.get("PitInTime")),
        )


def _required_lap_number(record: Mapping[str, object]) -> int:
    lap_number = _optional_integer(record.get("LapNumber"))
    if lap_number is None or lap_number < 1:
        raise ValueError("Provider lap record is missing a valid LapNumber value.")
    return lap_number


def _format_lap_time(value: object) -> str | None:
    if _is_missing(value) or not isinstance(value, timedelta):
        return None

    total_milliseconds = round(value.total_seconds() * 1_000)
    if total_milliseconds < 0:
        return None

    minutes, remainder = divmod(total_milliseconds, 60_000)
    seconds, milliseconds = divmod(remainder, 1_000)
    return f"{minutes}:{seconds:02d}.{milliseconds:03d}"


def _optional_text(value: object) -> str | None:
    if isinstance(value, str) and value.strip():
        return value.strip()
    return None


def _optional_integer(value: object) -> int | None:
    if _is_missing(value) or isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return None


def _boolean(value: object) -> bool:
    if _is_missing(value):
        return False
    return bool(value)


def _is_missing(value: object) -> bool:
    if value is None:
        return True
    if isinstance(value, float):
        return isnan(value)
    return type(value).__name__ == "NaTType"
