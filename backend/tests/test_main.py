from fastapi.testclient import TestClient

from app.api import api_router
from app.main import app


def test_health_check_is_available_without_authentication() -> None:
    response = TestClient(app).get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_api_router_is_prepared_for_expense_routes() -> None:
    assert api_router.prefix == "/api"

