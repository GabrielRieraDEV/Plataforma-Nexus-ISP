"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/session";
import { Client, Payment } from "@/lib/types";

type PaymentForm = {
  client_id: string;
  amount: number;
  paid_at: string;
  period_label: string;
  note: string;
};

const initialPaymentForm: PaymentForm = {
  client_id: "",
  amount: 40,
  paid_at: new Date().toISOString().slice(0, 10),
  period_label: new Date().toISOString().slice(0, 7),
  note: ""
};

export default function PagosPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState<PaymentForm>(initialPaymentForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    const token = getToken();
    if (!token) {
      return;
    }

    setLoading(true);
    try {
      setError("");
      const [clientsData, paymentsData] = await Promise.all([
        apiRequest<Client[]>("/api/clients", { token }),
        apiRequest<Payment[]>("/api/payments", { token })
      ]);
      setClients(clientsData);
      setPayments(paymentsData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function createPayment(e: FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await apiRequest<Payment>("/api/payments", {
        token,
        method: "POST",
        body: {
          ...form,
          client_id: Number(form.client_id)
        }
      });
      setForm(initialPaymentForm);
      setMessage("Pago registrado.");
      await loadData();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const clientsMap = useMemo(() => {
    const map = new Map<number, Client>();
    clients.forEach((client) => map.set(client.id, client));
    return map;
  }, [clients]);

  return (
    <>
      <header className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pagos</h1>
          <p className="text-sm text-slate-600">Registro de pagos e historial reciente.</p>
        </div>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium" onClick={loadData}>
          Actualizar
        </button>
      </header>

      {message && <section className="card text-sm font-medium text-emerald-700">{message}</section>}
      {error && <section className="card text-sm font-medium text-rose-700">{error}</section>}

      <section className="card">
        <h2 className="mb-3 text-xl font-semibold">Registrar pago</h2>
        <form className="grid gap-2 md:grid-cols-2" onSubmit={createPayment}>
          <select
            className="rounded-lg border border-slate-300 p-2"
            value={form.client_id}
            onChange={(e) => setForm({ ...form, client_id: e.target.value })}
            required
          >
            <option value="">Seleccione cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                #{client.id} - {client.full_name}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border border-slate-300 p-2"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            required
          />
          <input
            className="rounded-lg border border-slate-300 p-2"
            type="date"
            value={form.paid_at}
            onChange={(e) => setForm({ ...form, paid_at: e.target.value })}
            required
          />
          <input
            className="rounded-lg border border-slate-300 p-2"
            placeholder="Periodo (YYYY-MM)"
            value={form.period_label}
            onChange={(e) => setForm({ ...form, period_label: e.target.value })}
            required
          />
          <input
            className="rounded-lg border border-slate-300 p-2 md:col-span-2"
            placeholder="Nota opcional"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <button className="rounded-lg bg-purple-600 p-2 text-white disabled:opacity-50 md:col-span-2" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar pago"}
          </button>
        </form>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="mb-3 text-xl font-semibold">Historial de pagos</h2>
        {loading ? (
          <p className="text-sm text-slate-600">Cargando pagos...</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-2 text-left">Fecha</th>
                <th className="p-2 text-left">Cliente</th>
                <th className="p-2 text-left">Periodo</th>
                <th className="p-2 text-left">Monto</th>
                <th className="p-2 text-left">Nota</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="p-2">{new Date(payment.paid_at).toLocaleDateString("es-DO")}</td>
                  <td className="p-2">{clientsMap.get(payment.client_id)?.full_name || `Cliente #${payment.client_id}`}</td>
                  <td className="p-2">{payment.period_label}</td>
                  <td className="p-2">${payment.amount.toFixed(2)}</td>
                  <td className="p-2">{payment.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
