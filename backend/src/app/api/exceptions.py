"""Explicit public exceptions for API resources."""

from fastapi import HTTPException


class RaceCraftApiException(HTTPException):
    """An HTTP exception that carries RaceCraft's stable public error code."""

    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(status_code=status_code, detail=message)
        self.code = code
