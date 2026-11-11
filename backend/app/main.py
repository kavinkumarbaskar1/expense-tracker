"""FastAPI application entrypoint for the Expense Tracker backend."""

from fastapi import FastAPI

from app.api import api_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    application = FastAPI(
        title="Expense Tracker API",
        version="0.1.0",
        description="Local/internal REST API for the Expense Tracker MVP.",
    )

    application.include_router(api_router)

    @application.get("/health", tags=["health"])
    def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return application


app = create_app()

