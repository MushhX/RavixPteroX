"use client";

import { useEffect, useState } from "react";
import { adminListAudit, loadTokensFromStorage, refresh } from "@/lib/api";

type AuditRow = {
  id: string;
  actorUserId: string | null;
  action: string;
  target: string | null;
  meta: any;
  ip: string | null;
  userAgent: string | null;
  createdAt: number;
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      loadTokensFromStorage();
      await refresh();
      const data = (await adminListAudit(100)) as { logs: AuditRow[] };
      setLogs(data.logs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Auditoría</h1>
          <p className="text-sm text-zinc-600">Acciones críticas registradas por el sistema.</p>
        </div>
        <button className="rounded-md border px-3 py-2 bg-white" onClick={load}>
          Recargar
        </button>
      </div>

      {loading ? <div>Cargando...</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="rounded-xl border bg-white p-4">
        <pre className="text-xs overflow-auto bg-zinc-50 border rounded-md p-3">
          {JSON.stringify(logs, null, 2)}
        </pre>
      </div>
    </div>
  );
}
