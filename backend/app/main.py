from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import settings
from app.database import create_db_and_tables
from app.routers import auth, clients, dashboard, payments


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(auth.router, prefix="/api")
app.include_router(clients.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
