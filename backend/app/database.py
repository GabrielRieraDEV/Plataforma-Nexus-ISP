import time
from pathlib import Path

from sqlalchemy.exc import OperationalError
from sqlmodel import Session, SQLModel, create_engine

from app.core import settings


def _build_engine():
    url = settings.database_url
    connect_args = {}
    if url.startswith("sqlite"):
        connect_args["check_same_thread"] = False
    return create_engine(url, echo=settings.debug, connect_args=connect_args)


engine = _build_engine()


def _ensure_sqlite_dir() -> None:
    if not settings.database_url.startswith("sqlite"):
        return
    # sqlite:///./data/nexus.db -> ./data
    relative = settings.database_url.removeprefix("sqlite:///")
    if relative.startswith("./"):
        data_dir = Path(relative).parent
        if str(data_dir) not in (".", ""):
            data_dir.mkdir(parents=True, exist_ok=True)


def create_db_and_tables() -> None:
    _ensure_sqlite_dir()
    max_retries = 20 if settings.database_url.startswith("postgresql") else 1
    for attempt in range(1, max_retries + 1):
        try:
            SQLModel.metadata.create_all(engine)
            return
        except OperationalError:
            if attempt == max_retries:
                raise
            time.sleep(2)


def get_session():
    with Session(engine) as session:
        yield session
