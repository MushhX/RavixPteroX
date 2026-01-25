"use client";

import { useEffect, useState } from "react";
import { listPlugins, loadTokensFromStorage, refresh } from "@/lib/api";

export default function AdminPluginsPage() {
  const [plugins, setPlugins] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      loadTokensFromStorage();
      await refresh();
      const data = await listPlugins();
      setPlugins(data);
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
          <h1 className="text-xl font-semibold">Plugins</h1>
          <p className="text-sm text-zinc-600">Plugins cargados y metadata.</p>
        </div>
        <button className="rounded-md border px-3 py-2 bg-white" onClick={load}>
          Recargar
        </button>
      </div>

      {loading ? <div>Cargando...</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="rounded-xl border bg-white p-4">
        <pre className="text-xs overflow-auto bg-zinc-50 border rounded-md p-3">
          {JSON.stringify(plugins, null, 2)}
        </pre>
      </div>
    </div>
  );
}
