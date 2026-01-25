"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { loadTokensFromStorage, logout, me, refresh } from "@/lib/api";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        loadTokensFromStorage();
        await refresh();
        const meRes = await me();

        if (meRes.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        setUser({ email: meRes.user.email, role: meRes.user.role });
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div>
            <div className="font-semibold">RavixPteroX Admin</div>
            {user ? <div className="text-xs text-zinc-500">{user.email}</div> : null}
          </div>

          <div className="flex items-center gap-2">
            <Link className="rounded-md border px-3 py-2 bg-white" href="/dashboard">
              Usuario
            </Link>
            <button
              className="rounded-md border px-3 py-2 bg-white"
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
            >
              Salir
            </button>
          </div>
        </div>

        <nav className="mx-auto max-w-6xl px-6 pb-4 flex gap-2">
          <Link className="rounded-md border px-3 py-2 bg-white" href="/admin/users">
            Usuarios
          </Link>
          <Link className="rounded-md border px-3 py-2 bg-white" href="/admin/audit">
            Auditoría
          </Link>
          <Link className="rounded-md border px-3 py-2 bg-white" href="/admin/plugins">
            Plugins
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}
