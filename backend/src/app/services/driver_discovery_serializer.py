"""Convert provider driver records into stable RaceCraft domain models."""

from collections.abc import Mapping

from app.models.discovery import DriverModel


class DriverSerializer:
    """Serialize provider driver records without exposing provider types."""

    @staticmethod
    def serialize(record: Mapping[str, object]) -> DriverModel:
        """Convert one result record into frontend-ready driver metadata."""
        return DriverModel(
            driverNumber=_required_text(record, "DriverNumber"),
            abbreviation=_required_text(record, "Abbreviation"),
            broadcastName=_required_text(record, "BroadcastName"),
            fullName=_required_text(record, "FullName"),
            teamName=_required_text(record, "TeamName"),
            teamColor=_optional_text(record, "TeamColor"),
            countryCode=_optional_text(record, "CountryCode"),
            headshotUrl=_optional_text(record, "HeadshotUrl"),
        )


def _required_text(record: Mapping[str, object], key: str) -> str:
    value = _optional_text(record, key)
    if value is None:
        raise ValueError(f"Provider driver record is missing a valid {key} value.")
    return value


def _optional_text(record: Mapping[str, object], key: str) -> str | None:
    value = record.get(key)
    if isinstance(value, str) and value.strip():
        return value.strip()
    return None
