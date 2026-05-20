"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { clearToken, getToken } from "@/lib/session";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clientes", label: "Clientes" },
  { href: "/pagos", label: "Pagos" }
];

export function PanelShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  function logout() {
    clearToken();
    router.push("/login");
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <section className="card">
          <p className="text-sm text-slate-600">Validando sesion...</p>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="text-lg font-semibold">
            Nexus ISP
          </Link>
          <Button variant="outline" size="sm" onClick={logout}>
            Cerrar sesion
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 p-4 md:grid-cols-[220px_1fr] md:p-8">
        <aside className="card h-fit">
          <nav className="space-y-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-6">{children}</section>
      </div>
    </div>
  );
}
