"use client";

import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/session";
import { Client, DashboardStats, Payment } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingClients, setPendingClients] = useState<Client[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [error, setError] = useState("");

  async function loadDashboard() {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      setError("");
      const [statsData, pendingData, paymentsData] = await Promise.all([
        apiRequest<DashboardStats>("/api/dashboard/stats", { token }),
        apiRequest<Client[]>("/api/payments/pending", { token }),
        apiRequest<Payment[]>("/api/payments", { token })
      ]);
      setStats(statsData);
      setPendingClients(pendingData.slice(0, 6));
      setRecentPayments(paymentsData.slice(0, 8));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  return (
    <>
      <header className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-600">Resumen operativo del servicio.</p>
        </div>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium" onClick={loadDashboard}>
          Actualizar
        </button>
      </header>

      {error && <section className="card text-sm font-medium text-rose-700">{error}</section>}

      {stats && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="card border-l-4 border-emerald-500">
            <p className="text-xs uppercase tracking-wide text-slate-500">Clientes activos</p>
            <p className="text-2xl font-bold">{stats.active_clients}</p>
          </article>
          <article className="card border-l-4 border-rose-500">
            <p className="text-xs uppercase tracking-wide text-slate-500">Suspendidos</p>
            <p className="text-2xl font-bold">{stats.suspended_clients}</p>
          </article>
          <article className="card border-l-4 border-amber-500">
            <p className="text-xs uppercase tracking-wide text-slate-500">Pendientes</p>
            <p className="text-2xl font-bold">{stats.pending_payments}</p>
          </article>
          <article className="card border-l-4 border-blue-500">
            <p className="text-xs uppercase tracking-wide text-slate-500">Cobrado este mes</p>
            <p className="text-2xl font-bold">${stats.payments_this_month.toFixed(2)}</p>
          </article>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card">
          <h2 className="mb-3 text-xl font-semibold">Clientes pendientes</h2>
          <div className="space-y-2">
            {pendingClients.length === 0 && <p className="text-sm text-slate-500">No hay pendientes.</p>}
            {pendingClients.map((client) => (
              <article key={client.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="font-medium">
                  #{client.id} - {client.full_name}
                </p>
                <p className="text-sm text-slate-700">Telefono: {client.phone}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card overflow-x-auto">
          <h2 className="mb-3 text-xl font-semibold">Pagos recientes</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Cliente ID</th>
                <th className="p-2 text-left">Periodo</th>
                <th className="p-2 text-left">Monto</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-2">{new Date(payment.paid_at).toLocaleDateString("es-DO")}</td>
                  <td className="p-2">#{payment.client_id}</td>
                  <td className="p-2">{payment.period_label}</td>
                  <td className="p-2">${payment.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
