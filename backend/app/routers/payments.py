from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_admin
from app.models import Client, Payment
from app.schemas import PaymentCreate
from app.services import apply_payment_to_client


router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("")
def list_payments(
    _: str = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    return session.exec(select(Payment).order_by(Payment.paid_at.desc())).all()


@router.get("/pending")
def pending_payments(
    _: str = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    today = date.today()
    clients = session.exec(select(Client)).all()
    return [c for c in clients if not c.due_date or c.due_date < today]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_payment(
    payload: PaymentCreate,
    _: str = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    client = session.get(Client, payload.client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")

    payment = Payment(**payload.model_dump())
    session.add(payment)
    session.commit()
    session.refresh(payment)

    apply_payment_to_client(session, client)
    session.add(client)
    session.commit()

    return payment
