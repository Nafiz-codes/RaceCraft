"""Dependency providers for services shared by future API routes."""

from functools import lru_cache

from app.repositories.fastf1_repository import FastF1Repository
from app.services.circuit_information_service import CircuitInformationService
from app.services.circuit_service import CircuitService
from app.services.corner_service import CornerService
from app.services.driver_discovery_service import DriverDiscoveryService
from app.services.fastf1_service import FastF1Service
from app.services.lap_discovery_service import LapDiscoveryService
from app.services.session_discovery_service import SessionDiscoveryService
from app.services.telemetry_service import TelemetryService
from app.services.weather_service import WeatherService


@lru_cache(maxsize=1)
def get_fastf1_service() -> FastF1Service:
    """Build the process-wide FastF1 service used by application startup and routes."""
    return FastF1Service(repository=FastF1Repository())


@lru_cache(maxsize=1)
def get_circuit_service() -> CircuitService:
    """Build the circuit service from the shared FastF1 dependency."""
    return CircuitService(fastf1_service=get_fastf1_service())


@lru_cache(maxsize=1)
def get_circuit_information_service() -> CircuitInformationService:
    """Build the circuit information service from the shared FastF1 dependency."""
    return CircuitInformationService(fastf1_service=get_fastf1_service())


@lru_cache(maxsize=1)
def get_corner_service() -> CornerService:
    """Build the corner service from the shared FastF1 dependency."""
    return CornerService(fastf1_service=get_fastf1_service())


@lru_cache(maxsize=1)
def get_session_discovery_service() -> SessionDiscoveryService:
    """Build the discovery service from the shared FastF1 service dependency."""
    return SessionDiscoveryService(fastf1_service=get_fastf1_service())


@lru_cache(maxsize=1)
def get_driver_discovery_service() -> DriverDiscoveryService:
    """Build the driver discovery service from the shared FastF1 dependency."""
    return DriverDiscoveryService(fastf1_service=get_fastf1_service())


@lru_cache(maxsize=1)
def get_lap_discovery_service() -> LapDiscoveryService:
    """Build the lap discovery service from the shared FastF1 dependency."""
    return LapDiscoveryService(fastf1_service=get_fastf1_service())


@lru_cache(maxsize=1)
def get_telemetry_service() -> TelemetryService:
    """Build the telemetry service from the shared FastF1 dependency."""
    return TelemetryService(fastf1_service=get_fastf1_service())


@lru_cache(maxsize=1)
def get_weather_service() -> WeatherService:
    """Build the weather service from the shared FastF1 dependency."""
    return WeatherService(fastf1_service=get_fastf1_service())
