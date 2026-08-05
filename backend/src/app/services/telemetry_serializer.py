"""Convert raw FastF1 telemetry records into RaceCraft domain models."""

from collections.abc import Mapping
from math import isfinite
from numbers import Real

from app.models.discovery import TelemetryModel


class TelemetrySerializer:
    """Serialize raw telemetry records without adding derived values."""

    @staticmethod
    def serialize(record: Mapping[str, object]) -> TelemetryModel:
        """Convert one raw provider sample into the public telemetry contract."""
        return TelemetryModel(
            time=_required_time(record, "Time"),
            distance=_required_float(record, "Distance"),
            speed=_required_float(record, "Speed"),
            throttle=_required_float(record, "Throttle"),
            brake=_required_boolean(record, "Brake"),
            rpm=_required_float(record, "RPM"),
            gear=_required_integer(record, "nGear"),
            drs=_required_integer(record, "DRS"),
            x=_required_float(record, "X"),
            y=_required_float(record, "Y"),
            z=_required_float(record, "Z"),
        )


def _required_time(record: Mapping[str, object], key: str) -> str:
    value = record.get(key)
    if value is None or type(value).__name__ == "NaTType":
        raise ValueError(f"Provider telemetry record is missing a valid {key} value.")
    return str(value)


def _required_float(record: Mapping[str, object], key: str) -> float:
    value = record.get(key)
    if isinstance(value, bool) or not isinstance(value, Real) or not isfinite(value):
        raise ValueError(f"Provider telemetry record is missing a valid {key} value.")
    return float(value)


def _required_integer(record: Mapping[str, object], key: str) -> int:
    value = _required_float(record, key)
    if not value.is_integer():
        raise ValueError(f"Provider telemetry record has a non-integral {key} value.")
    return int(value)


def _required_boolean(record: Mapping[str, object], key: str) -> bool:
    value = record.get(key)
    if value is None or type(value).__name__ == "NaTType":
        raise ValueError(f"Provider telemetry record is missing a valid {key} value.")
    return bool(value)
