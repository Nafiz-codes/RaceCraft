"""Startup-safe initialization for the on-disk FastF1 cache."""

import logging
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from app.services.fastf1_service import FastF1Service

logger = logging.getLogger("racecraft.cache")


class CacheInitializationError(RuntimeError):
    """Raised when the configured FastF1 cache cannot safely be used."""


@dataclass(frozen=True, slots=True)
class FastF1Cache:
    """Create, validate, and enable the cache before FastF1 is used."""

    directory: Path

    def initialize(self, fastf1_service: FastF1Service) -> Path:
        """Make the cache directory ready and configure the provider through its service."""
        try:
            self.directory.mkdir(parents=True, exist_ok=True)
            self._validate_directory()
        except OSError as error:
            raise CacheInitializationError(
                f"FastF1 cache directory is unavailable: {self.directory}"
            ) from error

        fastf1_service.initialize_cache(self.directory)
        logger.info("FastF1 cache initialized at %s", self.directory)
        return self.directory

    def _validate_directory(self) -> None:
        if not self.directory.is_dir():
            raise CacheInitializationError(
                f"FastF1 cache path is not a directory: {self.directory}"
            )

        probe = self.directory / f".racecraft-cache-probe-{uuid4().hex}"
        try:
            probe.write_text("racecraft-cache-validation", encoding="utf-8")
        finally:
            if probe.exists():
                probe.unlink()
