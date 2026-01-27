"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, LogOut, Shield } from "lucide-react";
import { health, loadTokensFromStorage, logout, me, refresh } from "@/lib/api";
import { Badge, Button, Card, CardBody, CardHeader, Container } from "@/app/ui";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        loadTokensFromStorage();
        await refresh();
        const [meRes, h] = await Promise.all([me(), health()]);
        setMode(h?.mode ?? null);

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
    return <div className="p-6 opacity-70">Cargando...</div>;
  }

  return (
    <div className="min-h-screen">
      <Container className="py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardHeader className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] p-2">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="font-semibold">RavixPteroX Admin</div>
                  <Badge tone={mode === "demo" ? "info" : "neutral"}>{mode === "demo" ? "DEMO" : "LIVE"}</Badge>
                </div>
                {user ? <div className="mt-1 text-xs opacity-70 truncate">{user.email}</div> : null}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/dashboard">
                  <Button variant="outline">
                    <LayoutGrid className="h-4 w-4" />
                    Usuario
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await logout();
                    router.replace("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </Button>
              </div>
            </CardHeader>

            <CardBody>
              <nav className="flex flex-wrap gap-2">
                <Link href="/admin/users">
                  <Button variant="outline">Usuarios</Button>
                </Link>
                <Link href="/admin/audit">
                  <Button variant="outline">Auditoría</Button>
                </Link>
                <Link href="/admin/plugins">
                  <Button variant="outline">Plugins</Button>
                </Link>
                <Link href="/admin/customize">
                  <Button variant="outline">Personalización</Button>
                </Link>
                <Link href="/admin/payments">
                  <Button variant="outline">Pagos</Button>
                </Link>
              </nav>
            </CardBody>
          </Card>

          <div className="mt-6">{children}</div>
        </motion.div>
      </Container>
    </div>
  );
}
