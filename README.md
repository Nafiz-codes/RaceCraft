# RaceCraft

RaceCraft is a Formula One engineering workspace for exploring real session data through synchronized telemetry, circuit geometry, lap analysis, driver comparison, and browser-generated engineering reports.

## Highlights

- Formula One session discovery powered by FastF1
- Synchronized telemetry chart, circuit marker, scrubber, playback controls, and engineering rail
- Driver and circuit explorers backed by centralized registries
- Lap, sector, corner, braking, weather, and circuit-information workspaces
- Comparison-ready primary and secondary selections
- Local PDF, Markdown, and TXT engineering report exports
- React 19 / TypeScript / Vite frontend and layered FastAPI backend

## Repository structure

```text
RaceCraft/
├── frontend/    # React, TypeScript, Vite, Tailwind CSS, D3
├── backend/     # FastAPI, FastF1, repository/service/API architecture
├── docs/        # Product, architecture, UI/UX, and engineering standards
├── design/      # Approved visual references
└── assets/      # Project assets
```

## Prerequisites

- Node.js 20+
- npm 10+
- Python 3.12+

## Run locally

### 1. Start the backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
racecraft-api
```

The API runs on `http://127.0.0.1:8000` by default.

Copy the environment template when you need custom configuration:

```powershell
Copy-Item .env.example .env
```

### 2. Start the frontend

In another terminal:

```powershell
cd frontend
npm install
$env:VITE_API_BASE_URL="http://127.0.0.1:8000/api/v1"
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

## Available routes

| Route | Purpose |
| --- | --- |
| `/` | Premium RaceCraft landing page |
| `/drivers` | Driver Explorer |
| `/circuits` | Circuit Explorer |
| `/dashboard` | Engineering workspace |

## API resources

All API routes are versioned under `/api/v1`.

```text
GET /seasons
GET /seasons/{season}/events
GET /seasons/{season}/events/{event}/sessions
GET /seasons/{season}/events/{event}/sessions/{session}/drivers
GET /seasons/{season}/events/{event}/sessions/{session}/drivers/{driver}/laps
GET /seasons/{season}/events/{event}/sessions/{session}/drivers/{driver}/laps/{lap}/telemetry
GET /seasons/{season}/events/{event}/sessions/{session}/circuit
```

Additional circuit metadata, weather, and corner resources are available through the dashboard’s existing API layer.

## Quality checks

### Frontend

```powershell
cd frontend
npm run lint
npm run build
```

### Backend

```powershell
cd backend
ruff check .
ruff format --check .
mypy
```

## Deploying to Vercel

Deploy the frontend and backend as two Vercel projects from this repository:

- Frontend project root: `frontend`
- Backend project root: `backend`

Set the frontend environment variable:

```text
VITE_API_BASE_URL=https://your-api-domain.vercel.app/api/v1
```

Set backend production variables:

```text
RACECRAFT_ENVIRONMENT=production
RACECRAFT_DEBUG=false
RACECRAFT_FASTF1_CACHE_DIRECTORY=/tmp/racecraft-fastf1
RACECRAFT_CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

The FastF1 cache is ephemeral on serverless infrastructure and is recreated when a function cold-starts.

## Documentation

Read the project standards before contributing:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/UI_UX_SPEC.md`
- `docs/DEVELOPMENT_STANDARDS.md`
- `docs/TECH_STACK.md`

## License

See [LICENSE](LICENSE).
