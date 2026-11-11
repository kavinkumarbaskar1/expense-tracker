# Expense Tracker

Local/internal MVP scaffold for tracking expenses with a React frontend,
FastAPI backend, and SQLite persistence.

## Local-Only Use

This MVP intentionally has no authentication, authorization, user accounts, or
public internet exposure controls. Run it only on a trusted local or internal
host. Do not expose the frontend or backend directly to the public internet.

## Backend Startup

From the repository root:

```sh
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend serves the local API at `http://127.0.0.1:8000`, including
`/health` and the `/api` route prefix prepared for expense endpoints.

## Frontend Startup

From the repository root in a separate terminal:

```sh
cd frontend
npm install
npm run dev
```

The Vite dev server binds to `127.0.0.1` by default. To point the frontend at a
different local backend, set `VITE_API_BASE_URL` before starting Vite:

```sh
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

## Scaffold Checks

Run the backend checks:

```sh
cd backend
PYTHONPATH=. pytest
```

Run the frontend build check:

```sh
cd frontend
npm run build
```
