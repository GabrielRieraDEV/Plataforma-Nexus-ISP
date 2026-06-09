"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { API_URL, getToken, saveToken } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      setError("Credenciales invalidas.");
      setLoading(false);
      return;
    }

    const data = (await response.json()) as { access_token: string };
    saveToken(data.access_token);
    router.push("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      {/* Fondo cascada */}
      <Image
        src="/login-bg.jpeg"
        alt="Cascada"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/30" />

      {/* Tarjeta de login */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/30 bg-white/15 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/80 text-white shadow-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <Image
            src="/logo.jpeg"
            alt="NEXUS IPS"
            width={200}
            height={200}
            priority
            className="h-auto w-44 rounded-2xl"
          />
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-medium text-white">
              Usuario
            </label>
            <input
              id="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="flex h-11 w-full rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </label>
            <input
              id="password"
              placeholder="********"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex h-11 w-full rounded-lg border border-white/40 bg-white/80 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            />
          </div>
          {error && <p className="text-sm font-medium text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-slate-900 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-medium uppercase tracking-wide text-white/70">
          Conectamos salud, comunidad y futuro
        </p>
      </div>
    </main>
  );
}
