"""Top-level API router.

Domain routers will be attached here as real versioned resources are implemented.
"""

from fastapi import APIRouter

from app.api.circuit import router as circuit_router
from app.api.circuit_information import router as circuit_information_router
from app.api.corners import router as corners_router
from app.api.driver_discovery import router as driver_discovery_router
from app.api.lap_discovery import router as lap_discovery_router
from app.api.session_discovery import router as session_discovery_router
from app.api.telemetry import router as telemetry_router
from app.api.weather import router as weather_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(session_discovery_router)
api_v1_router.include_router(circuit_router)
api_v1_router.include_router(circuit_information_router)
api_v1_router.include_router(corners_router)
api_v1_router.include_router(driver_discovery_router)
api_v1_router.include_router(lap_discovery_router)
api_v1_router.include_router(telemetry_router)
api_v1_router.include_router(weather_router)
