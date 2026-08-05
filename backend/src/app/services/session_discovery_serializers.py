"""Convert provider records into stable RaceCraft discovery models."""

from datetime import date, datetime
from typing import Protocol

from app.models.discovery import EventModel, SessionModel


class ProviderEventRecord(Protocol):
    """The subset of a provider event record needed for discovery serialization."""

    def get(self, key: str, default: object | None = None) -> object: ...


SESSION_KEYS = {
    "Practice 1": "FP1",
    "Practice 2": "FP2",
    "Practice 3": "FP3",
    "Qualifying": "Q",
    "Sprint": "S",
    "Sprint Qualifying": "SQ",
    "Sprint Shootout": "SQ",
    "Race": "R",
}


def serialize_event(record: ProviderEventRecord) -> EventModel:
    """Serialize an event record without exposing provider-specific objects."""
    return EventModel(
        round=_required_int(record, "RoundNumber"),
        eventName=_required_text(record, "EventName"),
        country=_required_text(record, "Country"),
        location=_required_text(record, "Location"),
        date=_serialize_date(record.get("EventDate")),
    )


def serialize_sessions(record: ProviderEventRecord) -> list[SessionModel]:
    """Extract configured session metadata from one provider event record."""
    sessions: list[SessionModel] = []
    for position in range(1, 6):
        session_name = record.get(f"Session{position}")
        if not isinstance(session_name, str) or not session_name.strip():
            continue

        sessions.append(
            SessionModel(
                sessionKey=SESSION_KEYS.get(session_name, _fallback_session_key(session_name)),
                sessionName=session_name,
                date=_serialize_date(record.get(f"Session{position}Date")),
            )
        )
    return sessions


def _required_int(record: ProviderEventRecord, key: str) -> int:
    value = record.get(key)
    if isinstance(value, int):
        return value
    if isinstance(value, float) and value.is_integer():
        return int(value)
    raise ValueError(f"Provider event record is missing a valid {key} value.")


def _required_text(record: ProviderEventRecord, key: str) -> str:
    value = record.get(key)
    if isinstance(value, str) and value.strip():
        return value.strip()
    raise ValueError(f"Provider event record is missing a valid {key} value.")


def _serialize_date(value: object) -> date | None:
    if value is None or value.__class__.__name__ == "NaTType":
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    raise ValueError("Provider event record contains an invalid date value.")


def _fallback_session_key(session_name: str) -> str:
    return session_name.upper().replace(" ", "_")
