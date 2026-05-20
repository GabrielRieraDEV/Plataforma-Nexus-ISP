from datetime import date
from typing import Optional

from pydantic import BaseModel

from app.models import ServiceStatus


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ClientCreate(BaseModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    address: str
    plan_name: str = "Plan Starlink Residencial"
    monthly_fee: float = 40
    first_month_free: bool = True


class ClientUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    plan_name: Optional[str] = None
    monthly_fee: Optional[float] = None
    first_month_free: Optional[bool] = None
    service_status: Optional[ServiceStatus] = None
    due_date: Optional[date] = None


class PaymentCreate(BaseModel):
    client_id: int
    amount: float
    paid_at: date
    period_label: str
    note: Optional[str] = None


class DashboardStats(BaseModel):
    active_clients: int
    suspended_clients: int
    pending_payments: int
    payments_this_month: float
