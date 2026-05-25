export type DashboardStats = {
  active_clients: number;
  suspended_clients: number;
  pending_payments: number;
  payments_this_month: number;
};

export type Client = {
  id: number;
  full_name: string;
  phone: string;
  email?: string | null;
  address: string;
  plan_name: string;
  due_date: string | null;
  service_status: "active" | "suspended";
  monthly_fee: number;
  first_month_free: boolean;
};

export type Payment = {
  id: number;
  client_id: number;
  amount: number;
  paid_at: string;
  period_label: string;
  note?: string | null;
};
