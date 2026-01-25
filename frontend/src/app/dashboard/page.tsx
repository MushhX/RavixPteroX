"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  logout,
  getServers,
  listMarketplaceItems,
  listPlugins,
  loadTokensFromStorage,
  me,
  powerServer,
  refresh
} from "@/lib/api";

type AnyObj = Record<string, any>;

export default function DashboardPage() {
  const router = useRouter();
  const [servers, setServers] = useState<AnyObj | null>(null);
  const [plugins, setPlugins] = useState<AnyObj | null>(null);
  const [market, setMarket] = useState<AnyObj | null>(null);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serverItems = useMemo(() => {
    const arr = servers?.data;
    return Array.isArray(arr) ? arr : [];
  }, [servers]);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      loadTokensFromStorage();
      await refresh();

      const meRes = await me();
      setUser({ email: meRes.user.email, role: meRes.user.role });

      const [s, p, marketRes] = await Promise.all([getServers(), listPlugins(), listMarketplaceItems()]);
      setServers(s);
      setPlugins(p);
      setMarket(marketRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function power(serverId: string, signal: "start" | "stop" | "restart" | "kill") {
    try {
      await powerServer(serverId, signal);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "power_failed");
    }
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-zinc-600">Conectado a RavixPteroX backend</p>
          {user ? (
            <p className="text-xs text-zinc-500 mt-1">
              {user.email} ({user.role})
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "admin" ? (
            <Link className="rounded-md border px-3 py-2 bg-white" href="/admin">
              Admin
            </Link>
          ) : null}
          <button
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
            className="rounded-md border px-3 py-2 bg-white"
          >
            Salir
          </button>
          <button onClick={load} className="rounded-md border px-3 py-2 bg-white">
            Recargar
          </button>
        </div>
      </header>

      {loading ? <div>Cargando...</div> : null}
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}

      <section className="rounded-xl border bg-white p-4">
        <h2 className="font-semibold">Servidores (Client API)</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Si está vacío, configura `PTERO_CLIENT_API_KEY` en `backend/.env`.
        </p>

        <div className="mt-4 space-y-3">
          {serverItems.length === 0 ? (
            <div className="text-sm text-zinc-500">Sin servidores / sin acceso.</div>
          ) : null}

          {serverItems.map((it: AnyObj) => {
            const attr = it?.attributes ?? {};
            const id = attr?.identifier ?? it?.id ?? "unknown";
            const name = attr?.name ?? "server";
            return (
              <div key={id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-xs text-zinc-500">{id}</div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md border px-2 py-1" onClick={() => power(id, "start")}>
                    Start
                  </button>
                  <button className="rounded-md border px-2 py-1" onClick={() => power(id, "restart")}>
                    Restart
                  </button>
                  <button className="rounded-md border px-2 py-1" onClick={() => power(id, "stop")}>
                    Stop
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Plugins registrados</h2>
          <pre className="mt-3 text-xs overflow-auto bg-zinc-50 border rounded-md p-3">
            {JSON.stringify(plugins, null, 2)}
          </pre>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold">Marketplace (stub)</h2>
          <pre className="mt-3 text-xs overflow-auto bg-zinc-50 border rounded-md p-3">
            {JSON.stringify(market, null, 2)}
          </pre>
        </div>
      </section>
    </main>
  );
}
