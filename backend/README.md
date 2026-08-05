# RaceCraft API

The backend is a layered FastAPI application. FastF1 is isolated behind a repository
and service facade, and its local cache is initialized and validated during app
startup. Routes are intentionally absent until real domain resources are implemented.

## Run locally

Requires Python 3.12 or newer.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
racecraft-api
```

The server listens on `http://127.0.0.1:8000` by default. Configure it through the
`RACECRAFT_*` environment variables shown in `.env.example`. The default FastF1
cache directory is `backend/.cache/fastf1`; it is created and write-validated at
startup. No routes are exposed until a real domain resource is implemented under
`src/app/api`.

## Quality checks

```powershell
ruff check .
ruff format --check .
mypy
```
