# API Specification

**Project:** RaceCraft  
**Version:** 1.0  
**Status:** Approved  
**Author:** Nafiz Shahriar 
**Last Updated:** August 2026

---

# 1. Executive Summary

The RaceCraft API provides a consistent, versioned, and RESTful interface for accessing Formula 1 telemetry data and related session information.

The API abstracts the complexity of telemetry retrieval by exposing structured resources instead of implementation-specific data. Clients interact with a stable contract regardless of the underlying telemetry provider.

The primary objectives of the API are to:

- Provide a predictable interface for frontend applications.
- Deliver engineering-grade telemetry data in a structured format.
- Maintain consistent response formats across all endpoints.
- Ensure long-term compatibility through API versioning.
- Support future platform growth without breaking existing clients.

The API is designed around resources rather than actions. Each endpoint exposes a specific domain within RaceCraft, such as seasons, sessions, drivers, laps, telemetry, or comparisons.

---

# 2. API Philosophy

The RaceCraft API follows several guiding principles that shape every endpoint and response.

## 2.1 Resource-Oriented Design

Endpoints represent resources rather than actions.

Examples include:

```
GET /api/v1/seasons
GET /api/v1/events
GET /api/v1/drivers
GET /api/v1/telemetry
```

Action-oriented endpoints such as `/getTelemetry` or `/loadDrivers` are intentionally avoided.

---

## 2.2 Consistency

Every endpoint follows the same design conventions.

This includes:

- URL structure
- Response format
- Error format
- HTTP status codes
- Naming conventions

A predictable API reduces frontend complexity and improves maintainability.

---

## 2.3 Stability

Once an endpoint is published within Version 1, its public contract should remain stable.

Breaking changes require a new API version rather than modifications to existing endpoints.

---

## 2.4 Separation of Concerns

The API exposes RaceCraft domain models instead of FastF1 objects.

Clients remain independent from implementation details and communicate only with the RaceCraft API.

---

## 2.5 Explicitness

All required parameters are validated.

Responses are fully documented.

Errors are descriptive.

The API favors clarity over implicit behavior.

---

# 3. API Versioning

RaceCraft uses URI-based versioning.

Current version:

```
/api/v1
```

Example:

```
GET /api/v1/seasons
```

Future breaking changes will introduce a new version rather than modifying existing endpoints.

Example:

```
/api/v2
```

This approach preserves backward compatibility and allows frontend applications to migrate safely.

---

# 4. Base URL

Development

```
http://localhost:8000/api/v1
```

Production

```
https://<production-domain>/api/v1
```

All endpoints described in this document are relative to the API base URL.

---

# 5. Design Principles

Every endpoint within RaceCraft adheres to the following principles.

### Single Responsibility

Each endpoint provides one clearly defined resource.

### Predictability

Identical requests produce identical responses when the underlying data has not changed.

### Statelessness

Each request contains all information required to process it.

No server-side user session is maintained.

### Strong Validation

All incoming parameters are validated before processing.

Invalid requests return standardized error responses.

### Read-Only Data Access

Version 1 exposes telemetry as read-only resources.

The API does not modify Formula 1 data.

---

# 6. Standard Response Format

Every successful response follows a consistent structure.

```json
{
  "success": true,
  "data": {},
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

### Response Fields

| Field | Description |
|--------|-------------|
| success | Indicates whether the request completed successfully. |
| data | Contains the requested resource. |
| meta | Provides metadata about the response. |

---

# 7. Standard Error Format

Every unsuccessful response follows the same structure.

```json
{
  "success": false,
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "The requested session could not be found."
  }
}
```

### Error Fields

| Field | Description |
|--------|-------------|
| success | Always `false`. |
| error.code | Machine-readable error identifier. |
| error.message | Human-readable error description. |

The API never exposes stack traces or internal implementation details to clients.

---

# 8. HTTP Status Codes

The following HTTP status codes are used throughout Version 1.

| Status | Meaning |
|---------|---------|
| 200 OK | Request completed successfully. |
| 400 Bad Request | Invalid request parameters. |
| 404 Not Found | Requested resource could not be located. |
| 422 Unprocessable Entity | Parameter validation failed. |
| 500 Internal Server Error | Unexpected server-side failure. |