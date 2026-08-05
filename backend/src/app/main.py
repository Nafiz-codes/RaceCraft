"""FastAPI application factory and process entry point."""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_v1_router
from app.api.errors import register_exception_handlers
from app.cache import FastF1Cache
from app.config import Settings, get_settings
from app.config.logging import configure_logging
from app.services.dependencies import get_fastf1_service

logger = logging.getLogger("racecraft.application")


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create the stateless RaceCraft API application."""
    resolved_settings = settings or get_settings()
    configure_logging(resolved_settings)
    fastf1_service = get_fastf1_service()
    fastf1_cache = FastF1Cache(directory=resolved_settings.fastf1_cache_directory)

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncIterator[None]:
        application.state.fastf1_cache_directory = fastf1_cache.initialize(fastf1_service)
        logger.info("RaceCraft API starting in %s environment", resolved_settings.environment)
        yield
        logger.info("RaceCraft API stopped")

    application = FastAPI(
        title=resolved_settings.app_name,
        version=resolved_settings.app_version,
        docs_url="/docs" if resolved_settings.docs_enabled else None,
        redoc_url="/redoc" if resolved_settings.docs_enabled else None,
        openapi_url="/openapi.json" if resolved_settings.docs_enabled else None,
        debug=resolved_settings.debug,
        lifespan=lifespan,
    )
    application.state.settings = resolved_settings
    application.state.fastf1_service = fastf1_service
    application.add_middleware(
        CORSMiddleware,
        allow_origins=list(resolved_settings.cors_origins),
        allow_credentials=False,
        allow_methods=["GET", "OPTIONS"],
        allow_headers=["Accept", "Authorization", "Content-Type"],
    )
    application.include_router(api_v1_router)
    register_exception_handlers(application)
    return application


app = create_app()


def run() -> None:
    """Run the application using the configured host and port."""
    settings = get_settings()
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        log_level=settings.log_level.lower(),
        reload=settings.debug,
    )
