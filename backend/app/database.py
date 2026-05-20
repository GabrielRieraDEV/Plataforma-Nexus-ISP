import time

from sqlalchemy.exc import OperationalError
from sqlmodel import Session, SQLModel, create_engine

from app.core import settings


engine = create_engine(settings.database_url, echo=False)


def create_db_and_tables() -> None:
    max_retries = 20
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
