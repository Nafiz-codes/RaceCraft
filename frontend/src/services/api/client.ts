import type { ApiFailureResponse, ApiSuccessResponse } from "@/types/api"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8001/api/v1"

const responseCache = new Map<string, unknown>()

export class ApiClientError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = "ApiClientError"
    this.code = code
    this.status = status
  }
}

interface RequestOptions {
  signal?: AbortSignal
  cache?: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isFailureResponse(value: unknown): value is ApiFailureResponse {
  return (
    isRecord(value) &&
    value.success === false &&
    isRecord(value.error) &&
    typeof value.error.code === "string" &&
    typeof value.error.message === "string"
  )
}

function isSuccessResponse<TData>(value: unknown): value is ApiSuccessResponse<TData> {
  return isRecord(value) && value.success === true && "data" in value && "meta" in value
}

export async function getApiData<TData>(
  path: string,
  { signal, cache = true }: RequestOptions = {},
): Promise<TData> {
  if (cache && responseCache.has(path)) {
    return responseCache.get(path) as TData
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    method: "GET",
    signal,
  })

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    if (isFailureResponse(body)) {
      throw new ApiClientError(body.error.message, body.error.code, response.status)
    }

    throw new ApiClientError("The RaceCraft API request failed.", "API_REQUEST_FAILED", response.status)
  }

  if (!isSuccessResponse<TData>(body)) {
    throw new ApiClientError("The RaceCraft API returned an invalid response.", "INVALID_RESPONSE", 502)
  }

  if (cache) {
    responseCache.set(path, body.data)
  }

  return body.data
}
