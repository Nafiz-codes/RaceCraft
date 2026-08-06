"""Convert provider weather records into stable RaceCraft domain models."""

from collections.abc import Mapping
from math import isfinite
from numbers import Real

from app.models.discovery import WeatherModel


class WeatherSerializer:
    """Serialize one provider weather record without exposing provider types."""

    @staticmethod
    def serialize(record: Mapping[str, object]) -> WeatherModel:
        """Convert one recorded weather reference into the public contract."""
        return WeatherModel(
            airTemperature=_required_float(record, "AirTemp"),
            trackTemperature=_required_float(record, "TrackTemp"),
            humidity=_required_float(record, "Humidity"),
            windSpeed=_required_float(record, "WindSpeed"),
            windDirection=_required_integer(record, "WindDirection"),
            pressure=_required_float(record, "Pressure"),
            rainfall=_required_boolean(record, "Rainfall"),
        )


def _required_float(record: Mapping[str, object], key: str) -> float:
    value = record.get(key)
    if isinstance(value, bool) or not isinstance(value, Real) or not isfinite(value):
        raise ValueError(f"Provider weather record is missing a valid {key} value.")
    return float(value)


def _required_integer(record: Mapping[str, object], key: str) -> int:
    value = _required_float(record, key)
    if not value.is_integer():
        raise ValueError(f"Provider weather record has a non-integral {key} value.")
    return int(value)


def _required_boolean(record: Mapping[str, object], key: str) -> bool:
    value = record.get(key)
    if not isinstance(value, bool):
        raise ValueError(f"Provider weather record is missing a valid {key} value.")
    return value
