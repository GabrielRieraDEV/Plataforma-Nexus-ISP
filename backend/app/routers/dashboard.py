from datetime import date

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.dependencies import get_current_admin
from app.models import Client, Payment, ServiceStatus
from app.schemas import DashboardStats
from app.services import update_overdue_statuses


router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def stats(
    _: str = Depends(get_current_admin),
    session: Session = Depends(get_session),
):
    update_overdue_statuses(session)
    clients = session.exec(select(Client)).all()
    payments = session.exec(select(Payment)).all()
    today = date.today()

    active_clients = sum(1 for c in clients if c.service_status == ServiceStatus.ACTIVE)
    suspended_clients = sum(1 for c in clients if c.service_status == ServiceStatus.SUSPENDED)
    pending_payments = sum(1 for c in clients if not c.due_date or c.due_date < today)
    payments_this_month = sum(
        p.amount for p in payments if p.paid_at.year == today.year and p.paid_at.month == today.month
    )

    return DashboardStats(
        active_clients=active_clients,
        suspended_clients=suspended_clients,
        pending_payments=pending_payments,
        payments_this_month=payments_this_month,
    )
