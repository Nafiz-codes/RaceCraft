"""Shared, safe API exception handling."""

import logging

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.exceptions import RaceCraftApiException
from app.models.api import ApiError, ErrorResponse

logger = logging.getLogger("racecraft.api")


def _error_response(status_code: int, code: str, message: str) -> JSONResponse:
    """Build an error response that conforms to the public API contract."""
    response = ErrorResponse(error=ApiError(code=code, message=message))
    return JSONResponse(status_code=status_code, content=response.model_dump(mode="json"))


async def handle_request_validation_error(
    _request: Request,
    _exception: Exception,
) -> JSONResponse:
    """Return validation failures without leaking implementation details."""
    return _error_response(
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "REQUEST_VALIDATION_ERROR",
        "Request validation failed.",
    )


async def handle_http_exception(_request: Request, exception: Exception) -> JSONResponse:
    """Return deliberate HTTP errors in the standard RaceCraft error shape."""
    if not isinstance(exception, HTTPException):
        return _error_response(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred.",
        )

    message = (
        exception.detail if isinstance(exception.detail, str) else "Request could not be completed."
    )
    code = exception.code if isinstance(exception, RaceCraftApiException) else "HTTP_ERROR"
    return _error_response(exception.status_code, code, message)


async def handle_unexpected_exception(_request: Request, exception: Exception) -> JSONResponse:
    """Log unexpected errors while returning a non-sensitive public response."""
    logger.exception("Unhandled API exception", exc_info=exception)
    return _error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "INTERNAL_SERVER_ERROR",
        "An unexpected error occurred.",
    )


def register_exception_handlers(application: FastAPI) -> None:
    """Register the shared error contract once at application creation."""
    application.add_exception_handler(RequestValidationError, handle_request_validation_error)
    application.add_exception_handler(HTTPException, handle_http_exception)
    application.add_exception_handler(Exception, handle_unexpected_exception)
