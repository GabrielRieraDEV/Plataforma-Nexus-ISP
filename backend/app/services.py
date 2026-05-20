from datetime import date, timedelta

from sqlmodel import Session, select

from app.models import Client, Payment, ServiceStatus


def update_overdue_statuses(session: Session) -> None:
    today = date.today()
    clients = session.exec(select(Client)).all()
    for client in clients:
        if client.due_date and client.due_date < today:
            client.service_status = ServiceStatus.SUSPENDED
    session.commit()


def apply_payment_to_client(session: Session, client: Client) -> None:
    latest = session.exec(
        select(Payment).where(Payment.client_id == client.id).order_by(Payment.paid_at.desc())
    ).first()
    if latest:
        client.due_date = latest.paid_at + timedelta(days=30)
        client.service_status = ServiceStatus.ACTIVE
