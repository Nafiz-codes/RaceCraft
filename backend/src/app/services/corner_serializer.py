"""Convert official FastF1 corner records into RaceCraft domain models."""

from collections.abc import Mapping
from math import isfinite
from numbers import Real

from app.models.discovery import CornerModel


class CornerSerializer:
    """Serialize provider circuit corner references."""

    @staticmethod
    def serialize(record: Mapping[str, object]) -> CornerModel:
        """Convert one official provider corner into the public contract."""
        return CornerModel(
            cornerNumber=_required_integer(record, "Number"),
            cornerLetter=_optional_text(record, "Letter"),
            cornerAngle=_optional_float(record, "Angle"),
            x=_required_float(record, "X"),
            y=_required_float(record, "Y"),
            distance=_optional_float(record, "Distance"),
        )


def _required_float(record: Mapping[str, object], key: str) -> float:
    value = _optional_float(record, key)
    if value is None:
        raise ValueError(f"Provider corner record is missing a valid {key} value.")
    return value


def _required_integer(record: Mapping[str, object], key: str) -> int:
    value = _required_float(record, key)
    if not value.is_integer():
        raise ValueError(f"Provider corner record has a non-integral {key} value.")
    return int(value)


def _optional_float(record: Mapping[str, object], key: str) -> float | None:
    value = record.get(key)
    if value is None or value.__class__.__name__ == "NaTType":
        return None
    if isinstance(value, bool) or not isinstance(value, Real) or not isfinite(value):
        return None
    return float(value)


def _optional_text(record: Mapping[str, object], key: str) -> str | None:
    value = record.get(key)
    return value.strip() if isinstance(value, str) and value.strip() else None
