"""Convert provider circuit records into stable RaceCraft domain models."""

from collections.abc import Mapping
from math import isfinite
from numbers import Real

from app.models.discovery import CircuitPointModel


class CircuitSerializer:
    """Serialize ordered circuit geometry without altering provider points."""

    @staticmethod
    def serialize(record: Mapping[str, object]) -> CircuitPointModel:
        """Convert one raw provider geometry point into the public contract."""
        return CircuitPointModel(
            x=_required_float(record, "X"),
            y=_required_float(record, "Y"),
            distance=_required_float(record, "Distance"),
        )


def _required_float(record: Mapping[str, object], key: str) -> float:
    value = record.get(key)
    if isinstance(value, bool) or not isinstance(value, Real) or not isfinite(value):
        raise ValueError(f"Provider circuit record is missing a valid {key} value.")
    return float(value)
