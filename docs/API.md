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

---

# 9. Seasons API

The Seasons API provides the list of Formula 1 seasons supported by RaceCraft.

This endpoint serves as the starting point for all telemetry exploration workflows.

---

## GET /api/v1/seasons

### Purpose

Returns all Formula 1 seasons available within RaceCraft.

---

### Query Parameters

None.

---

### Success Response

```json
{
  "success": true,
  "data": {
    "seasons": [
      {
        "year": 2024
      },
      {
        "year": 2025
      }
    ]
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Seasons retrieved successfully |
| 500 | Internal server error |

---

### Notes

- Seasons are returned in descending order.
- Only supported seasons are included.
- The endpoint is read-only.

---

# 10. Events API

The Events API returns all Formula 1 Grand Prix events for a selected season.

---

## GET /api/v1/events

### Purpose

Returns all race events available for a specified Formula 1 season.

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| season | integer | Yes | Formula 1 season |

---

### Example Request

```
GET /api/v1/events?season=2025
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "round": 1,
        "name": "Australian Grand Prix",
        "country": "Australia",
        "location": "Melbourne"
      },
      {
        "round": 2,
        "name": "Chinese Grand Prix",
        "country": "China",
        "location": "Shanghai"
      }
    ]
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Events retrieved successfully |
| 400 | Invalid season |
| 404 | Season not found |
| 500 | Internal server error |

---

### Notes

- Events are ordered by championship round.
- Sprint weekends are included.
- Only official Formula 1 events are returned.

---

# 11. Sessions API

The Sessions API provides the available sessions for a selected Grand Prix.

---

## GET /api/v1/sessions

### Purpose

Returns all available sessions for a specified Formula 1 event.

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| season | integer | Yes | Formula 1 season |
| event | string | Yes | Grand Prix name |

---

### Example Request

```
GET /api/v1/sessions?season=2025&event=Australian Grand Prix
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "code": "FP1",
        "name": "Practice 1"
      },
      {
        "code": "FP2",
        "name": "Practice 2"
      },
      {
        "code": "FP3",
        "name": "Practice 3"
      },
      {
        "code": "Q",
        "name": "Qualifying"
      },
      {
        "code": "R",
        "name": "Race"
      }
    ]
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Sessions retrieved successfully |
| 400 | Invalid request |
| 404 | Event not found |
| 500 | Internal server error |

---

### Notes

- Available sessions depend on the selected event.
- Sprint weekends may include Sprint Qualifying and Sprint sessions.
- Sessions are returned in chronological order.

# 12. Drivers API

The Drivers API returns all drivers who participated in a selected Formula 1 session.

---

## GET /api/v1/drivers

### Purpose

Returns the list of drivers available for a specified session.

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| season | integer | Yes | Formula 1 season |
| event | string | Yes | Grand Prix name |
| session | string | Yes | Session code (FP1, FP2, FP3, SQ, S, Q, R) |

---

### Example Request

```http
GET /api/v1/drivers?season=2025&event=Australian Grand Prix&session=Q
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "drivers": [
      {
        "number": 4,
        "code": "NOR",
        "name": "Lando Norris",
        "team": "McLaren"
      },
      {
        "number": 81,
        "code": "PIA",
        "name": "Oscar Piastri",
        "team": "McLaren"
      }
    ]
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Drivers retrieved successfully |
| 400 | Invalid request |
| 404 | Session not found |
| 500 | Internal server error |

---

### Notes

- Drivers are returned in ascending car number.
- Only drivers who participated in the selected session are included.

---

# 13. Laps API

The Laps API provides the laps completed by a selected driver during a session.

---

## GET /api/v1/laps

### Purpose

Returns all valid laps for a selected driver.

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| season | integer | Yes | Formula 1 season |
| event | string | Yes | Grand Prix name |
| session | string | Yes | Session code |
| driver | string | Yes | Driver code (e.g., NOR, VER, HAM) |

---

### Example Request

```http
GET /api/v1/laps?season=2025&event=Australian Grand Prix&session=Q&driver=NOR
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "laps": [
      {
        "lap": 1,
        "lap_time": "1:28.621",
        "compound": "SOFT",
        "is_personal_best": false
      },
      {
        "lap": 2,
        "lap_time": "1:27.981",
        "compound": "SOFT",
        "is_personal_best": true
      }
    ]
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Laps retrieved successfully |
| 400 | Invalid request |
| 404 | Driver not found |
| 500 | Internal server error |

---

### Notes

- Invalid or deleted laps are excluded.
- Personal best laps are identified for convenience.
- Lap times are formatted for display.

---

# 14. Telemetry API

The Telemetry API returns engineering telemetry for a single driver on a selected lap.

---

## GET /api/v1/telemetry

### Purpose

Returns synchronized telemetry channels for visualization and analysis.

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| season | integer | Yes | Formula 1 season |
| event | string | Yes | Grand Prix name |
| session | string | Yes | Session code |
| driver | string | Yes | Driver code |
| lap | integer | Yes | Lap number |

---

### Example Request

```http
GET /api/v1/telemetry?season=2025&event=Australian Grand Prix&session=Q&driver=NOR&lap=2
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "lap": 2,
    "driver": "NOR",
    "distance": [],
    "speed": [],
    "throttle": [],
    "brake": [],
    "gear": [],
    "rpm": [],
    "drs": [],
    "x": [],
    "y": []
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Telemetry Channels

The response may include:

- Distance
- Speed
- Throttle
- Brake
- Gear
- RPM
- DRS
- X Position
- Y Position

All telemetry arrays are synchronized by sample index, allowing multiple charts to remain perfectly aligned.

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Telemetry retrieved successfully |
| 400 | Invalid request |
| 404 | Lap not found |
| 500 | Internal server error |

---

### Notes

- Responses are optimized for frontend visualization.
- Channel ordering remains consistent across all requests.
- The API returns processed telemetry rather than provider-specific objects.

# 15. Compare API

The Compare API returns synchronized telemetry for two drivers, enabling direct lap-by-lap performance analysis.

This endpoint is the foundation of RaceCraft's comparison workspace.

---

## GET /api/v1/compare

### Purpose

Returns telemetry and lap metadata for two selected drivers in a single response.

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| season | integer | Yes | Formula 1 season |
| event | string | Yes | Grand Prix name |
| session | string | Yes | Session code |
| driver1 | string | Yes | First driver code |
| lap1 | integer | Yes | Lap number for first driver |
| driver2 | string | Yes | Second driver code |
| lap2 | integer | Yes | Lap number for second driver |

---

### Example Request

```http
GET /api/v1/compare?season=2025&event=Australian Grand Prix&session=Q&driver1=NOR&lap1=2&driver2=VER&lap2=3
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "driver_one": {
      "driver": "NOR",
      "lap": 2,
      "telemetry": {
        "distance": [],
        "speed": [],
        "throttle": [],
        "brake": [],
        "gear": [],
        "rpm": [],
        "drs": [],
        "x": [],
        "y": []
      }
    },
    "driver_two": {
      "driver": "VER",
      "lap": 3,
      "telemetry": {
        "distance": [],
        "speed": [],
        "throttle": [],
        "brake": [],
        "gear": [],
        "rpm": [],
        "drs": [],
        "x": [],
        "y": []
      }
    }
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Comparison retrieved successfully |
| 400 | Invalid request |
| 404 | Driver or lap not found |
| 500 | Internal server error |

---

### Notes

- Both telemetry datasets are returned in a single response.
- Each driver's telemetry follows the same schema.
- The frontend is responsible for rendering overlays and synchronized visualizations.

---

# 16. Weather API

The Weather API provides weather conditions recorded during the selected session.

---

## GET /api/v1/weather

### Purpose

Returns weather information associated with a Formula 1 session.

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| season | integer | Yes | Formula 1 season |
| event | string | Yes | Grand Prix name |
| session | string | Yes | Session code |

---

### Example Request

```http
GET /api/v1/weather?season=2025&event=Australian Grand Prix&session=Q
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "air_temperature": 24.5,
    "track_temperature": 36.8,
    "humidity": 58,
    "pressure": 1013,
    "wind_speed": 11.4,
    "wind_direction": 225,
    "rainfall": false
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Weather retrieved successfully |
| 400 | Invalid request |
| 404 | Session not found |
| 500 | Internal server error |

---

### Notes

- Weather values correspond to the selected session.
- Units remain consistent across all responses.

---

# 17. Circuit API

The Circuit API provides metadata describing the selected Formula 1 circuit.

---

## GET /api/v1/circuit

### Purpose

Returns information required to identify and visualize the selected circuit.

---

### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| season | integer | Yes | Formula 1 season |
| event | string | Yes | Grand Prix name |

---

### Example Request

```http
GET /api/v1/circuit?season=2025&event=Australian Grand Prix
```

---

### Success Response

```json
{
  "success": true,
  "data": {
    "name": "Albert Park Circuit",
    "location": "Melbourne",
    "country": "Australia",
    "length_km": 5.278,
    "turns": 14,
    "clockwise": true
  },
  "meta": {
    "api_version": "v1",
    "timestamp": "2026-08-01T12:00:00Z"
  }
}
```

---

### Status Codes

| Status | Description |
|---------|-------------|
| 200 | Circuit information retrieved successfully |
| 400 | Invalid request |
| 404 | Circuit not found |
| 500 | Internal server error |

---

### Notes

- Circuit metadata is read-only.
- The endpoint returns descriptive information rather than graphical assets.

---

# 18. Future Endpoints

The following endpoints are intentionally excluded from Version 1 but are anticipated in future releases.

| Endpoint | Purpose |
|----------|---------|
| GET /api/v2/insights | AI-generated telemetry explanations |
| GET /api/v2/strategy | Strategy analysis |
| GET /api/v2/export | Export telemetry reports |
| GET /api/v2/share | Share analysis sessions |
| GET /api/v2/favorites | Saved workspaces |

The introduction of these endpoints will not modify the Version 1 API contract.

---

# 19. API Evolution Policy

RaceCraft follows a backward-compatible API evolution strategy.

## Non-Breaking Changes

The following changes may be introduced within Version 1:

- Additional optional fields
- Performance improvements
- Internal implementation changes
- New endpoints

These changes do not require a new API version.

---

## Breaking Changes

The following changes require a new API version:

- Removing existing fields
- Renaming fields
- Changing response structures
- Modifying endpoint behavior
- Removing endpoints

Breaking changes will be introduced through a new version (for example, `/api/v2`) while preserving the stability of existing clients.

---

# 20. Conclusion

The RaceCraft API provides a stable, consistent, and versioned interface for Formula 1 telemetry analysis.

By exposing domain-oriented resources through predictable REST endpoints, the API isolates clients from implementation details and supports long-term maintainability.

The Version 1 API establishes a reliable foundation for the RaceCraft frontend while remaining flexible enough to accommodate future features and capabilities without compromising backward compatibility.