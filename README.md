# RaceCraft

> **Formula One telemetry analysis, rebuilt as an engineering workspace.**

RaceCraft is a Formula One telemetry analysis platform designed to help explore lap performance through the lens of a race engineer.

Instead of presenting telemetry as a collection of disconnected charts, RaceCraft brings **drivers, circuits, lap telemetry, sectors, corners, comparisons, and engineering reports** into one focused workspace.

## Live

**[Open RaceCraft](https://race-craft-ebon.vercel.app/)**

## What RaceCraft does

RaceCraft turns raw F1 session data into an interactive engineering workflow.

- **Telemetry Analysis** — inspect speed, throttle, brake, gear, RPM, DRS, and lap-distance data.
- **Driver Comparison** — compare two drivers under the same session/lap context.
- **Circuit Analysis** — explore circuit geometry and live car position.
- **Lap Analysis** — inspect individual lap performance and deltas.
- **Sector Analysis** — compare sector-level performance.
- **Corner Analysis** — investigate corner-by-corner behavior.
- **Brake Comparison** — identify braking differences between drivers.
- **Engineering Insights** — surface useful performance observations from the active workspace.
- **Session Explorer** — move from season and event selection to the session and lap that matter.
- **Engineering Reports** — export the active workspace as PDF, Markdown, or TXT.

## The idea

Most telemetry tools expose a large amount of data but leave the user responsible for turning that data into an engineering story.

RaceCraft is built around a different idea:

> **Give the engineer the context first, then let the telemetry explain the lap.**

The interface therefore combines:

**Session → Driver → Lap → Telemetry → Circuit → Sector → Corner → Insight**

rather than treating each analysis as an isolated page.

## Key features

### Interactive telemetry

The telemetry workspace synchronizes:

- distance
- speed
- throttle
- brake
- gear
- RPM
- DRS
- lap position
- circuit position

A shared engineering timeline keeps the active telemetry point synchronized across the dashboard.

### Driver comparison

Compare two drivers using the same engineering context, including:

- lap time
- telemetry traces
- tyre compound
- sample count
- lap delta
- circuit position

### Circuit intelligence

RaceCraft maintains a centralized circuit registry covering the current 2026 Formula One calendar.

The circuit explorer provides:

- circuit search
- country filtering
- circuit metadata
- circuit layout assets
- direct analysis entry points

### Driver registry

The driver explorer provides the current 2026 grid with:

- driver identity
- number
- abbreviation
- nationality
- constructor
- driver imagery
- direct analysis entry points

### Engineering playback

Telemetry can be explored through a synchronized engineering timeline with:

- shared distance cursor
- current corner
- current sector
- speed
- throttle
- brake
- gear
- distance
- braking events
- DRS events
- gear-shift markers
- full-throttle markers

The timeline reuses the existing telemetry state rather than maintaining a separate playback system.

### Reports

The active workspace can be exported locally in three formats:

- **PDF** — monochrome engineering report
- **Markdown** — structured engineering report
- **TXT** — plain engineering log

Report generation happens in the browser and does not require an additional backend request.

## Tech stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Spline

### Backend

- Python
- FastAPI
- FastF1
- Pandas

### Deployment

- Vercel
- Frontend and backend deployed as separate Vercel projects

## Project structure

```text
RaceCraft/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── assets/
│   │   └── drivers/
│   └── ...
│
└── backend/
    ├── api/
    ├── src/
    │   └── app/
    └── ...
```

## Getting started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Git

### 1. Clone

```bash
git clone https://github.com/Nafiz-codes/RaceCraft.git
cd RaceCraft
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

### 3. Backend

In another terminal:

```bash
cd backend
python -m venv .venv
```

Activate the environment.

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI using the project's configured entrypoint.

The API documentation is available at:

```text
http://localhost:8000/docs
```

### Environment variables

Configure the backend using the variables documented in:

```text
backend/.env.example
```

For the frontend, configure the API base URL through:

```text
VITE_API_BASE_URL
```

Example:

```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Production architecture

RaceCraft is deployed as two services from the same repository:

```text
                   ┌─────────────────────┐
                   │      RaceCraft      │
                   │      Frontend       │
                   │   React + Vite      │
                   └──────────┬──────────┘
                              │
                              │ HTTPS / REST
                              ▼
                   ┌─────────────────────┐
                   │      RaceCraft      │
                   │       Backend       │
                   │ FastAPI + FastF1    │
                   └─────────────────────┘
```

The frontend is responsible for the interactive engineering workspace, while the backend handles data access and telemetry processing.

## Design philosophy

RaceCraft follows a few principles:

### Engineering over decoration

The UI should feel like an engineering tool rather than a generic dashboard.

### Context before complexity

Telemetry becomes useful when the user knows:

- who is driving
- where they are
- which lap they are looking at
- which session they are analyzing
- what the comparison is

### One source of truth

Playback, charts, circuit position, and engineering markers should derive from the same active telemetry state whenever possible.

### Progressive disclosure

Not every piece of telemetry needs to be visible at every moment. Analysis views should expose the information relevant to the task instead of overwhelming the engineer.

## Current status

RaceCraft is currently deployed and usable as a live portfolio project.

The current release focuses on:

- 2026 F1 driver and circuit registry
- telemetry analysis
- driver comparison
- circuit visualization
- sector and corner analysis
- engineering playback
- engineering report exports
- production deployment

## Roadmap

Potential future work includes:

- richer telemetry overlays
- advanced lap-delta analysis
- automated engineering recommendations
- tyre degradation analysis
- weather/performance correlation
- stint analysis
- race-strategy analysis
- historical season exploration
- more advanced telemetry-derived metrics

## Why I built it

RaceCraft sits at the intersection of several things I care about:

**Formula One + data analysis + software engineering + visualization.**

The goal was not simply to make another F1 statistics website, but to explore what a telemetry product could feel like if it were designed around the workflow of an engineer.

## Author

**Nafiz Shahriar**

Computer Science student • AI/ML enthusiast • Formula One & data analysis enthusiast

- GitHub: [@Nafiz-codes](https://github.com/Nafiz-codes)

---

<p align="center">
  <strong>Think Like an Engineer.</strong>
</p>
