"""Stable API response models shared by future domain routes."""

from datetime import UTC, datetime
from typing import Literal

from pydantic import BaseModel, Field


class ResponseMeta(BaseModel):
    """Metadata included with every successful API response."""

    api_version: Literal["v1"] = "v1"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class SuccessResponse[DataT](BaseModel):
    """The standard successful response contract documented for RaceCraft."""

    success: Literal[True] = True
    data: DataT
    meta: ResponseMeta = Field(default_factory=ResponseMeta)


class ApiError(BaseModel):
    """Safe, machine-readable public error information."""

    code: str = Field(min_length=1)
    message: str = Field(min_length=1)


class ErrorResponse(BaseModel):
    """The standard error response contract documented for RaceCraft."""

    success: Literal[False] = False
    error: ApiError
