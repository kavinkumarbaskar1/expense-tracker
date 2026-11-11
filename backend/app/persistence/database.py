"""SQLite persistence configuration for the Expense Tracker backend."""

from __future__ import annotations

import sqlite3
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[2]
DATA_DIRECTORY = BACKEND_ROOT / "data"
DEFAULT_DATABASE_PATH = DATA_DIRECTORY / "expense_tracker.sqlite3"


def get_database_path() -> Path:
    """Return the default local SQLite database path."""
    return DEFAULT_DATABASE_PATH


def initialize_persistence(database_path: Path | str | None = None) -> Path:
    """Initialize the local SQLite runtime without creating domain tables."""
    resolved_path = Path(database_path) if database_path is not None else get_database_path()
    resolved_path.parent.mkdir(parents=True, exist_ok=True)

    with sqlite3.connect(resolved_path) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        connection.execute("PRAGMA journal_mode = WAL")

    return resolved_path
