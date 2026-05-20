from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_admin
from app.models import Client, ServiceStatus
from app.schemas import ClientCreate, ClientUpdate


router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("")
def list_clients(
    _: str = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    return session.exec(select(Client).order_by(Client.created_at.desc())).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def create_client(
    payload: ClientCreate,
    _: str = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    due_date = None
    status_value = ServiceStatus.ACTIVE
    if payload.first_month_free:
        due_date = date.today() + timedelta(days=30)
    else:
        status_value = ServiceStatus.SUSPENDED

    client = Client(
        **payload.model_dump(),
        due_date=due_date,
        service_status=status_value,
    )
    session.add(client)
    session.commit()
    session.refresh(client)
    return client


@router.put("/{client_id}")
def update_client(
    client_id: int,
    payload: ClientUpdate,
    _: str = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    client = session.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    updates = payload.model_dump(exclude_none=True)
    for key, value in updates.items():
        setattr(client, key, value)

    session.add(client)
    session.commit()
    session.refresh(client)
    return client
