"""Validated environment configuration for the RaceCraft API."""

import os
from collections.abc import Mapping
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

BACKEND_DIRECTORY = Path(__file__).resolve().parents[3]
DEFAULT_CORS_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
DEFAULT_FASTF1_CACHE_DIRECTORY = BACKEND_DIRECTORY / ".cache" / "fastf1"
VALID_ENVIRONMENTS = frozenset({"development", "test", "production"})
VALID_LOG_LEVELS = frozenset({"CRITICAL", "ERROR", "WARNING", "INFO", "DEBUG"})


class SettingsError(ValueError):
    """Raised when runtime configuration is unsafe or invalid."""


def _read_bool(value: str, setting_name: str) -> bool:
    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes", "on"}:
        return True
    if normalized in {"0", "false", "no", "off"}:
        return False
    raise SettingsError(f"{setting_name} must be a boolean value.")


def _read_port(value: str) -> int:
    try:
        port = int(value)
    except ValueError as error:
        raise SettingsError("RACECRAFT_PORT must be an integer.") from error

    if not 1 <= port <= 65535:
        raise SettingsError("RACECRAFT_PORT must be between 1 and 65535.")
    return port


def _read_origins(value: str) -> tuple[str, ...]:
    origins = tuple(origin.strip().rstrip("/") for origin in value.split(",") if origin.strip())
    if not origins:
        raise SettingsError("RACECRAFT_CORS_ORIGINS must contain at least one origin.")
    if "*" in origins:
        raise SettingsError("RACECRAFT_CORS_ORIGINS cannot contain wildcard origins.")
    if any(not origin.startswith(("http://", "https://")) for origin in origins):
        raise SettingsError("RACECRAFT_CORS_ORIGINS must contain complete HTTP(S) origins.")
    return origins


def _read_cache_directory(value: str) -> Path:
    directory = Path(value).expanduser()
    if not directory.is_absolute():
        directory = BACKEND_DIRECTORY / directory
    return directory.resolve()


@dataclass(frozen=True, slots=True)
class Settings:
    """Runtime settings loaded from explicit environment variables."""

    app_name: str
    app_version: str
    environment: str
    debug: bool
    host: str
    port: int
    log_level: str
    cors_origins: tuple[str, ...]
    fastf1_cache_directory: Path

    @property
    def docs_enabled(self) -> bool:
        """Disable interactive API documentation in production by default."""
        return self.environment != "production"

    @classmethod
    def from_environment(cls, environment: Mapping[str, str] | None = None) -> "Settings":
        """Load, normalize, and validate the backend environment."""
        values = os.environ if environment is None else environment
        runtime_environment = values.get("RACECRAFT_ENVIRONMENT", "development").lower()
        if runtime_environment not in VALID_ENVIRONMENTS:
            raise SettingsError("RACECRAFT_ENVIRONMENT must be development, test, or production.")

        log_level = values.get("RACECRAFT_LOG_LEVEL", "INFO").upper()
        if log_level not in VALID_LOG_LEVELS:
            raise SettingsError("RACECRAFT_LOG_LEVEL must be a valid Python logging level.")

        debug = _read_bool(values.get("RACECRAFT_DEBUG", "false"), "RACECRAFT_DEBUG")
        if runtime_environment == "production" and debug:
            raise SettingsError("RACECRAFT_DEBUG cannot be enabled in production.")

        return cls(
            app_name=values.get("RACECRAFT_APP_NAME", "RaceCraft API"),
            app_version=values.get("RACECRAFT_APP_VERSION", "0.1.0"),
            environment=runtime_environment,
            debug=debug,
            host=values.get("RACECRAFT_HOST", "127.0.0.1"),
            port=_read_port(values.get("RACECRAFT_PORT", "8000")),
            log_level=log_level,
            cors_origins=_read_origins(values.get("RACECRAFT_CORS_ORIGINS", DEFAULT_CORS_ORIGINS)),
            fastf1_cache_directory=_read_cache_directory(
                values.get("RACECRAFT_FASTF1_CACHE_DIRECTORY", str(DEFAULT_FASTF1_CACHE_DIRECTORY))
            ),
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide validated settings instance."""
    return Settings.from_environment()
