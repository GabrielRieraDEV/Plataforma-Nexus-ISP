"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api";
import { getToken } from "@/lib/session";
import { Client } from "@/lib/types";

type ClientForm = {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  plan_name: string;
  monthly_fee: number;
  first_month_free: boolean;
};

const initialForm: ClientForm = {
  full_name: "",
  phone: "",
  email: "",
  address: "",
  plan_name: "Plan Starlink Residencial",
  monthly_fee: 40,
  first_month_free: true
};

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [form, setForm] = useState<ClientForm>(initialForm);
  const [editing, setEditing] = useState<Client | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadClients() {
    const token = getToken();
    if (!token) {
      return;
    }
    setLoading(true);
    try {
      setError("");
      const data = await apiRequest<Client[]>("/api/clients", { token });
      setClients(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadClients();
  }, []);

  async function createClient(e: FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      return;
    }
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await apiRequest<Client>("/api/clients", {
        token,
        method: "POST",
        body: form
      });
      setForm(initialForm);
      setMessage("Cliente creado.");
      await loadClients();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function updateClient(e: FormEvent) {
    e.preventDefault();
    if (!editing) {
      return;
    }
    const token = getToken();
    if (!token) {
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await apiRequest<Client>(`/api/clients/${editing.id}`, {
        token,
        method: "PUT",
        body: {
          full_name: editing.full_name,
          phone: editing.phone,
          email: editing.email,
          address: editing.address,
          plan_name: editing.plan_name,
          monthly_fee: editing.monthly_fee,
          service_status: editing.service_status
        }
      });
      setEditing(null);
      setMessage("Cliente actualizado.");
      await loadClients();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.full_name.toLowerCase().includes(search.toLowerCase()) ||
        client.phone.toLowerCase().includes(search.toLowerCase()) ||
        String(client.id).includes(search);
      const matchesStatus = statusFilter === "all" ? true : client.service_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  return (
    <>
      <header className="card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-slate-600">Registro, busqueda, filtros y edicion.</p>
        </div>
        <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium" onClick={loadClients}>
          Actualizar
        </button>
      </header>

      {message && <section className="card text-sm font-medium text-emerald-700">{message}</section>}
      {error && <section className="card text-sm font-medium text-rose-700">{error}</section>}

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="card">
          <h2 className="mb-3 text-xl font-semibold">Nuevo cliente</h2>
          <form className="grid gap-2 md:grid-cols-2" onSubmit={createClient}>
            <input
              className="rounded-lg border border-slate-300 p-2"
              placeholder="Nombre completo"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
            />
            <input
              className="rounded-lg border border-slate-300 p-2"
              placeholder="Telefono"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              className="rounded-lg border border-slate-300 p-2"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="rounded-lg border border-slate-300 p-2"
              placeholder="Plan"
              value={form.plan_name}
              onChange={(e) => setForm({ ...form, plan_name: e.target.value })}
            />
            <input
              className="rounded-lg border border-slate-300 p-2 md:col-span-2"
              placeholder="Direccion"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <input
              className="rounded-lg border border-slate-300 p-2"
              type="number"
              min="0"
              step="0.01"
              value={form.monthly_fee}
              onChange={(e) => setForm({ ...form, monthly_fee: Number(e.target.value) })}
              required
            />
            <label className="flex items-center gap-2 rounded-lg border border-slate-300 p-2">
              <input
                type="checkbox"
                checked={form.first_month_free}
                onChange={(e) => setForm({ ...form, first_month_free: e.target.checked })}
              />
              <span className="text-sm">Primer mes gratis</span>
            </label>
            <button className="rounded-lg bg-emerald-600 p-2 text-white disabled:opacity-50 md:col-span-2" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cliente"}
            </button>
          </form>
        </article>

        <article className="card space-y-3">
          <h2 className="text-xl font-semibold">Busqueda y filtros</h2>
          <input
            className="w-full rounded-lg border border-slate-300 p-2"
            placeholder="Buscar por nombre, telefono o ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full rounded-lg border border-slate-300 p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "suspended")}
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="suspended">Suspendidos</option>
          </select>
          <p className="text-sm text-slate-600">Resultados: {filteredClients.length}</p>
        </article>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="mb-3 text-xl font-semibold">Listado de clientes</h2>
        {loading ? (
          <p className="text-sm text-slate-600">Cargando clientes...</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Telefono</th>
                <th className="p-2 text-left">Plan</th>
                <th className="p-2 text-left">Estado</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b">
                  <td className="p-2">#{client.id}</td>
                  <td className="p-2 font-medium">{client.full_name}</td>
                  <td className="p-2">{client.phone}</td>
                  <td className="p-2">{client.plan_name}</td>
                  <td className="p-2">{client.service_status === "active" ? "Activo" : "Suspendido"}</td>
                  <td className="p-2">
                    <button className="rounded border border-slate-300 px-2 py-1 text-xs" onClick={() => setEditing(client)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <section className="w-full max-w-xl rounded-xl bg-white p-4 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">Editar cliente #{editing.id}</h3>
            <form className="grid gap-2 md:grid-cols-2" onSubmit={updateClient}>
              <input
                className="rounded-lg border border-slate-300 p-2"
                value={editing.full_name}
                onChange={(e) => setEditing({ ...editing, full_name: e.target.value })}
                required
              />
              <input
                className="rounded-lg border border-slate-300 p-2"
                value={editing.phone}
                onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                required
              />
              <input
                className="rounded-lg border border-slate-300 p-2"
                value={editing.email || ""}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              />
              <input
                className="rounded-lg border border-slate-300 p-2"
                value={editing.plan_name}
                onChange={(e) => setEditing({ ...editing, plan_name: e.target.value })}
                required
              />
              <input
                className="rounded-lg border border-slate-300 p-2 md:col-span-2"
                value={editing.address}
                onChange={(e) => setEditing({ ...editing, address: e.target.value })}
                required
              />
              <input
                className="rounded-lg border border-slate-300 p-2"
                type="number"
                min="0"
                step="0.01"
                value={editing.monthly_fee}
                onChange={(e) => setEditing({ ...editing, monthly_fee: Number(e.target.value) })}
                required
              />
              <select
                className="rounded-lg border border-slate-300 p-2"
                value={editing.service_status}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    service_status: e.target.value as "active" | "suspended"
                  })
                }
              >
                <option value="active">Activo</option>
                <option value="suspended">Suspendido</option>
              </select>
              <div className="flex justify-end gap-2 md:col-span-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  onClick={() => setEditing(null)}
                >
                  Cancelar
                </button>
                <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50" disabled={submitting}>
                  {submitting ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
