"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getToken } from "@/lib/session";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <section className="card">
        <p className="text-sm text-slate-600">Redirigiendo...</p>
      </section>
    </main>
  );
}
