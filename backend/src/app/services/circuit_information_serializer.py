"""Convert provider circuit metadata into stable RaceCraft domain models."""

from collections.abc import Mapping
from datetime import date, datetime
from math import isfinite
from numbers import Real

from app.models.discovery import CircuitInformationModel


class CircuitInformationSerializer:
    """Serialize circuit metadata without exposing FastF1 objects."""

    @staticmethod
    def serialize(record: Mapping[str, object]) -> CircuitInformationModel:
        """Convert one provider-backed circuit information record."""
        return CircuitInformationModel(
            circuitName=_optional_text(record, "CircuitName"),
            eventName=_optional_text(record, "EventName"),
            country=_optional_text(record, "Country"),
            location=_optional_text(record, "Location"),
            circuitLength=_optional_float(record, "CircuitLength"),
            numberOfCorners=_optional_integer(record, "NumberOfCorners"),
            sessionName=_optional_text(record, "SessionName"),
            eventDate=_optional_date(record.get("EventDate")),
        )


def _optional_text(record: Mapping[str, object], key: str) -> str | None:
    value = record.get(key)
    return value.strip() if isinstance(value, str) and value.strip() else None


def _optional_float(record: Mapping[str, object], key: str) -> float | None:
    value = record.get(key)
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, Real) or not isfinite(value):
        raise ValueError(f"Provider circuit record contains an invalid {key} value.")
    return float(value)


def _optional_integer(record: Mapping[str, object], key: str) -> int | None:
    value = _optional_float(record, key)
    if value is None:
        return None
    if not value.is_integer():
        raise ValueError(f"Provider circuit record contains a non-integral {key} value.")
    return int(value)


def _optional_date(value: object) -> date | None:
    if value is None or value.__class__.__name__ == "NaTType":
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    raise ValueError("Provider circuit record contains an invalid EventDate value.")
