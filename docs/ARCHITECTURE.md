# Architecture Document

**Project:** RaceCraft  
**Version:** 1.0  
**Status:** Approved  
**Author:** Nafiz Shahriar 
**Last Updated:** August 2026

---

# 1. Executive Summary

RaceCraft follows a modular client-server architecture designed for maintainability, scalability, and clear separation of concerns. The platform is divided into an independent frontend responsible for presentation and interaction, and a backend responsible for telemetry retrieval, processing, caching, and API delivery.

Telemetry data is sourced through the FastF1 library, transformed into structured domain models, and exposed through a REST API. The frontend consumes these APIs to render synchronized visualizations, driver comparisons, and telemetry analytics.

Every architectural decision prioritizes:

- Separation of concerns
- Strong typing
- Modular design
- Extensibility
- Testability
- Performance
- Production-quality engineering

The architecture intentionally avoids unnecessary complexity while remaining flexible enough to support future features such as AI-powered analysis, telemetry exports, and additional racing series.

---

# 2. Architectural Principles

RaceCraft is built around the following engineering principles.

## 2.1 Separation of Concerns

Each layer of the application has one clearly defined responsibility.

Frontend components are responsible only for presentation and user interaction.

Backend routes are responsible only for HTTP communication.

Business logic exists only inside the service layer.

External data retrieval is isolated behind repository interfaces.

This separation minimizes coupling and improves maintainability.

---

## 2.2 Domain-Driven Organization

The project is organized around product domains rather than technical file types.

Examples include:

- Sessions
- Drivers
- Telemetry
- Laps
- Weather

Each domain owns its API routes, business logic, schemas, and future tests.

This approach scales significantly better than organizing by file extension alone.

---

## 2.3 Thin Controllers

API endpoints should never contain business logic.

Routes are responsible only for:

- Request validation
- Calling services
- Returning responses
- HTTP status handling

All computation belongs inside services.

---

## 2.4 Service-Oriented Backend

Services contain the application's business logic.

Examples include:

- Loading telemetry
- Driver comparison
- Session processing
- Telemetry synchronization
- Cache management

This makes services reusable across multiple endpoints and simplifies testing.

---

## 2.5 Stateless APIs

The backend does not maintain user session state.

Each request contains all information required to complete the operation.

Benefits include:

- Horizontal scalability
- Simpler deployment
- Easier debugging
- Predictable behavior

---

## 2.6 Type Safety

Every public interface must use explicit typing.

Examples include:

- FastAPI request models
- Response models
- Internal domain models
- TypeScript interfaces

Strong typing reduces runtime errors and improves maintainability.

---

## 2.7 Extensibility

Every architectural decision should support future expansion without requiring structural rewrites.

Examples include:

- AI analysis module
- Multi-series motorsport support
- Export functionality
- Strategy simulation
- Additional telemetry sources

The goal is to extend existing modules rather than replace them.

---

# 3. High-Level Architecture

RaceCraft uses a layered architecture composed of independent frontend and backend applications communicating through REST APIs.

```

```text
                    ┌──────────────────────────────┐
                    │          Frontend            │
                    │ React • TypeScript • Vite    │
                    └──────────────┬───────────────┘
                                   │
                             HTTPS / REST
                                   │
                    ┌──────────────▼───────────────┐
                    │           FastAPI            │
                    │        API Layer             │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │        Service Layer         │
                    │ Telemetry • Sessions • Laps  │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │      Data Providers          │
                    │ FastF1 • Pandas • Cache      │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │      Formula 1 Data          │
                    └──────────────────────────────┘
```

### Responsibilities

**Frontend**

- User interface
- Routing
- State management
- Data visualization
- User interactions

**API Layer**

- Request validation
- Authentication (future)
- Response serialization
- Error handling

**Service Layer**

- Telemetry processing
- Driver comparison
- Business rules
- Data transformation

**Data Layer**

- FastF1 integration
- Caching
- Data loading
- Data normalization

---

# 4. Technology Stack

| Layer | Technology | Reason |
|--------|------------|--------|
| Frontend | React + TypeScript | Component architecture and strong typing |
| Build Tool | Vite | Fast development and optimized builds |
| Styling | Tailwind CSS | Consistent utility-first design system |
| UI Components | shadcn/ui | Accessible, composable UI primitives |
| Charts | Plotly | Interactive engineering-grade visualizations |
| State | Zustand | Lightweight global state management |
| Server State | TanStack Query | Efficient data fetching and caching |
| Backend | FastAPI | Modern, type-safe API framework |
| Data Source | FastF1 | Reliable Formula 1 telemetry access |
| Data Processing | Pandas | Efficient telemetry manipulation |
| Testing | Pytest / Vitest | Backend and frontend testing |
| Deployment | Docker (future) | Consistent deployment environment |

---

# 5. System Components

RaceCraft is composed of six primary architectural components. Each component has a clearly defined responsibility and communicates only through well-defined interfaces.

```
┌──────────────────────────────────────────────────────┐
│                    User Interface                    │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                  Frontend Application                │
└───────────────────────┬──────────────────────────────┘
                        │ REST API
                        ▼
┌──────────────────────────────────────────────────────┐
│                    Backend API                       │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                  Service Layer                       │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│               Telemetry Data Provider                │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                 FastF1 + Local Cache                 │
└──────────────────────────────────────────────────────┘
```

Each component owns a single responsibility and never bypasses another layer.

---

# 6. Backend Architecture

The backend is responsible for transforming raw Formula 1 telemetry into a stable, predictable, and frontend-friendly API.

The backend does **not** expose FastF1 directly.

Instead, FastF1 acts as an internal data provider.

This abstraction protects the frontend from changes in external libraries and allows RaceCraft to evolve independently.

---

## Backend Responsibilities

The backend is responsible for:

- Loading Formula 1 sessions
- Managing telemetry retrieval
- Processing lap information
- Driver comparison
- Data transformation
- Response validation
- Error handling
- Caching
- Future AI integration

The backend is **not** responsible for:

- Visualization
- UI formatting
- User interactions
- Presentation logic

---

## Backend Layers

```
Routes
    │
    ▼
Services
    │
    ▼
Repositories
    │
    ▼
FastF1
```

Each layer has exactly one responsibility.

---

### Routes

Routes define the public API.

Responsibilities:

- Receive HTTP requests
- Validate parameters
- Invoke services
- Return HTTP responses

Routes must never:

- Process telemetry
- Perform calculations
- Read FastF1 directly
- Contain business rules

---

### Services

Services contain the application's business logic.

Examples include:

- Driver comparison
- Session loading
- Telemetry synchronization
- Weather retrieval
- Lap analysis

Services coordinate multiple repositories when necessary.

They remain completely independent from HTTP.

---

### Repositories

Repositories provide a consistent interface for accessing telemetry data.

Initially they wrap FastF1.

Later they may also support:

- Cached datasets
- Local databases
- Additional racing series
- Offline telemetry archives

The service layer should never know where the data originates.

---

# 7. Frontend Architecture

The frontend is designed around feature-based organization rather than page-based organization.

Features represent business domains.

Examples:

- Sessions
- Drivers
- Telemetry
- Comparison
- Track Map

Each feature owns:

- Components
- Hooks
- Types
- API integration
- UI state

This keeps related logic together and minimizes coupling between unrelated areas.

---

## Frontend Responsibilities

The frontend is responsible for:

- Navigation
- User interactions
- Rendering telemetry
- Rendering charts
- Track visualization
- Local UI state
- Responsive layouts

The frontend must never:

- Process telemetry algorithms
- Perform business calculations
- Know FastF1 internals
- Duplicate backend logic

---

## Frontend Layers

```
Pages

↓

Layouts

↓

Feature Components

↓

Shared Components

↓

API Client
```

---

### Pages

Pages assemble features into complete user experiences.

Examples:

- Landing Page
- Workspace
- Driver Comparison

Pages contain almost no logic.

---

### Layouts

Layouts provide structural consistency.

Examples include:

- Navigation
- Sidebar
- Workspace Grid
- Command Bar
- Footer

Layouts never own business logic.

---

### Features

Features implement complete product capabilities.

Examples:

Telemetry Feature

- Speed chart
- Brake chart
- RPM chart
- DRS chart

Comparison Feature

- Driver selection
- Lap comparison
- Delta visualization

Track Feature

- Circuit map
- Racing line
- Position marker

Future AI Feature

- Insight panel
- Session summary
- Driver explanation

Each feature should be independently maintainable.

---

### Shared Components

Shared components are generic UI building blocks.

Examples:

- Button
- Dropdown
- Card
- Modal
- Loading Skeleton
- Empty State

They contain no RaceCraft-specific business logic.

---

### API Client

The frontend communicates exclusively through the backend API.

No component is allowed to import FastF1 logic or communicate with external telemetry providers directly.

This guarantees a single source of truth.

---
# 8. Data Flow

RaceCraft follows a unidirectional data flow where requests always move from the user interface to the backend, through the service layer, into the data provider, and back as structured responses.

At no point does the frontend communicate directly with FastF1 or perform telemetry processing.

This architecture ensures predictable behavior, easier debugging, and a clear separation of responsibilities.

---

## High-Level Flow

```
User

↓

React UI

↓

TanStack Query

↓

REST API Request

↓

FastAPI Route

↓

Service Layer

↓

Repository

↓

FastF1

↓

Telemetry Processing

↓

Structured Response

↓

Frontend Cache

↓

Plotly Charts

↓

User
```

---

## Example Workflow

The following sequence illustrates what happens when a user requests telemetry for a driver.

### Step 1

The user opens the workspace and selects:

- Season
- Grand Prix
- Session
- Driver
- Lap

The frontend stores this selection as application state.

---

### Step 2

TanStack Query detects that telemetry data for the selected combination has not yet been loaded.

It sends a request to the backend.

```
GET /telemetry
```

---

### Step 3

The API validates:

- season
- event
- session
- driver
- lap

If validation fails, an appropriate HTTP error is returned.

---

### Step 4

The service layer receives the request.

Responsibilities include:

- Checking cache
- Loading session
- Validating driver
- Selecting lap
- Requesting telemetry

---

### Step 5

The repository retrieves telemetry from FastF1.

The repository is the only layer permitted to communicate with external telemetry providers.

---

### Step 6

Telemetry is normalized into RaceCraft domain models.

Examples include:

- Speed
- Throttle
- Brake
- Gear
- RPM
- DRS
- Position
- Distance
- Time

No raw FastF1 objects leave the backend.

---

### Step 7

The backend returns a structured JSON response.

The frontend never needs to understand FastF1 internals.

---

### Step 8

TanStack Query caches the response.

Subsequent requests reuse cached data whenever possible.

---

### Step 9

Plotly renders synchronized visualizations.

Multiple charts share the same telemetry timeline.

Hovering over one visualization updates all synchronized charts.

---

### Step 10

The user interacts with the visualization.

Interactions remain entirely within the frontend unless new telemetry data is required.

---

# 9. State Management

RaceCraft separates state into two categories.

---

## Server State

Managed by TanStack Query.

Examples include:

- Sessions
- Drivers
- Telemetry
- Weather
- Circuit information

Server state originates from the backend and is cached automatically.

---

## Client State

Managed by Zustand.

Examples include:

- Selected driver
- Selected lap
- Selected chart
- Theme
- Sidebar visibility
- Playback controls

Client state never duplicates server state.

---

## Why Separate State?

This separation provides:

- Better performance
- Cleaner architecture
- Automatic caching
- Easier debugging
- Reduced duplication

Each library performs one job exceptionally well.

---

# 10. Caching Strategy

Telemetry datasets are significantly larger than traditional REST responses.

Repeatedly loading identical sessions from FastF1 would introduce unnecessary latency.

RaceCraft therefore implements caching at multiple layers.

---

## Backend Cache

The backend caches processed telemetry.

Future implementations may use Redis for distributed caching.

During development, in-memory caching is sufficient.

---

## Frontend Cache

TanStack Query caches API responses.

Benefits include:

- Reduced network requests
- Faster page transitions
- Automatic background refetching
- Improved user experience

---

## Cache Invalidation

Cached data is invalidated only when necessary.

Examples include:

- Manual refresh
- Different session selected
- Different lap selected
- Different driver selected

Previously viewed telemetry remains cached for quick navigation.

---

# 11. Error Handling

RaceCraft treats errors as expected system events rather than exceptional failures.

Every error should provide a clear message to both developers and users.

---

## Backend Errors

The backend returns consistent HTTP status codes.

Examples include:

- 400 — Invalid request
- 404 — Session or driver not found
- 422 — Validation failed
- 500 — Internal server error

Responses include descriptive error messages.

---

## Frontend Errors

The frontend displays friendly error states.

Examples include:

- Unable to load telemetry
- Session unavailable
- Network error

Users should always understand what happened and how to recover.

---

## Logging

Errors are logged internally for debugging.

Sensitive implementation details are never exposed through public API responses.
# 12. Security Considerations

Although RaceCraft Version 1 does not include user authentication or user-generated content, security remains a core architectural concern.

The backend is designed following the principle of least privilege and validates all incoming requests before processing.

## Input Validation

All request parameters are validated using FastAPI and Pydantic.

Validation includes:

- Season
- Grand Prix
- Session
- Driver
- Lap

Invalid requests return descriptive HTTP error responses without exposing internal implementation details.

---

## Error Exposure

Internal exceptions are never returned directly to clients.

Unexpected failures are logged internally while the API returns a generic error response.

This prevents leaking implementation details.

---

## CORS

The backend explicitly defines allowed frontend origins.

Wildcard origins are avoided in production environments.

---

## Rate Limiting

Version 1 does not implement rate limiting.

The architecture allows middleware-based rate limiting to be introduced in future releases without changing application logic.

---

# 13. Deployment Architecture

RaceCraft is designed as two independently deployable applications.

```

```text
                Browser
                   │
                   ▼
        Frontend (React + Vite)
                   │
             HTTPS / REST
                   │
                   ▼
          Backend (FastAPI)
                   │
          FastF1 + Cache Layer
```

The separation provides:

- Independent deployments
- Easier debugging
- Better scalability
- Simpler CI/CD pipelines

## Frontend

Planned deployment:

- Vercel

Responsibilities:

- Static asset hosting
- Client-side routing
- API communication

---

## Backend

Planned deployment:

- Railway (initial target)

Responsibilities:

- API hosting
- Telemetry processing
- Cache management

The deployment target may change in future versions without affecting application architecture.

---

# 14. Scalability Strategy

RaceCraft is intentionally designed for growth.

Future improvements should extend existing modules rather than require architectural redesign.

Potential scaling areas include:

- Redis distributed caching
- Background processing
- Multiple telemetry providers
- Additional racing series
- AI-powered analytics
- Session export services

The layered architecture isolates these concerns, minimizing the impact of future enhancements.

---

# 15. Future AI Integration

Artificial intelligence is planned as an extension layer rather than a core dependency.

This ensures Version 1 remains complete and valuable without AI.

Future AI capabilities may include:

- Driver performance explanations
- Lap summaries
- Corner-by-corner analysis
- Strategy insights
- Natural language telemetry exploration

AI services will consume structured telemetry produced by the existing service layer.

They will not communicate directly with FastF1.

This preserves architectural consistency and allows AI models to evolve independently.

---

# 16. Folder Structure

The project is organized into independent frontend and backend applications.

```text
racecraft/
│
├── assets/
├── backend/
├── docs/
├── frontend/
├── prompts/
├── .github/
├── .editorconfig
├── .gitignore
├── LICENSE
└── README.md
```

### Backend

```text
backend/
│
├── app/
│   ├── api/
│   ├── services/
│   ├── repositories/
│   ├── schemas/
│   ├── models/
│   ├── cache/
│   ├── core/
│   └── utils/
│
└── tests/
```

### Frontend

```text
frontend/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── store/
│   └── types/
```

This structure emphasizes modularity, discoverability, and long-term maintainability.

---

# 17. Architectural Trade-offs

Every architectural decision involves trade-offs.

The following choices were made intentionally.

## REST over GraphQL

REST provides a simpler implementation, strong tooling, and is sufficient for the current product requirements.

---

## FastF1 as the Initial Data Provider

FastF1 provides reliable telemetry access while remaining abstracted behind repository interfaces.

Future providers can be integrated without modifying higher architectural layers.

---

## Desktop-First Design

Telemetry analysis benefits from wide layouts and synchronized visualizations.

Desktop receives the highest design priority while remaining responsive on smaller devices.

---

## Stateless Backend

Stateless services simplify deployment, improve scalability, and reduce operational complexity.

---

## Feature-Based Frontend

Organizing code around business domains improves maintainability as the application grows.

---

# 18. Conclusion

RaceCraft adopts a layered, modular architecture designed for clarity, maintainability, and future expansion.

Each architectural layer has a clearly defined responsibility and communicates only through well-defined interfaces.

By isolating business logic, abstracting external dependencies, and enforcing strong architectural boundaries, RaceCraft remains adaptable without sacrificing simplicity.

This architecture provides a stable foundation for the implementation of Version 1 while supporting future capabilities such as AI-assisted analysis, advanced telemetry workflows, and additional motorsport series without requiring structural redesign.