from datetime import date, datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


class ServiceStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"


class ClientBase(SQLModel):
    full_name: str
    phone: str
    email: Optional[str] = None
    address: str
    plan_name: str = "Plan Starlink Residencial"
    monthly_fee: float = 40
    first_month_free: bool = True
    service_status: ServiceStatus = ServiceStatus.ACTIVE
    due_date: Optional[date] = None


class Client(ClientBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PaymentBase(SQLModel):
    client_id: int = Field(foreign_key="client.id")
    amount: float
    paid_at: date = Field(default_factory=date.today)
    period_label: str
    note: Optional[str] = None


class Payment(PaymentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
