"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, LogIn, Shield, User } from "lucide-react";
import { health, loadTokensFromStorage, login } from "@/lib/api";
import { Badge, Button, Card, CardBody, CardHeader, Container } from "@/app/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);

  useEffect(() => {
    loadTokensFromStorage();
    (async () => {
      try {
        const h = await health();
        setMode(h?.mode ?? null);
      } catch {
        setMode(null);
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "login_failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <Container className="w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <div className="mx-auto w-full max-w-md">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] p-2">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <div className="text-lg font-semibold">RavixPteroX</div>
                    </div>
                    <div className="mt-2 text-sm opacity-80">Inicia sesión para continuar</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge tone={mode === "demo" ? "info" : "neutral"}>{mode === "demo" ? "DEMO" : "LIVE"}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEmail("admin@example.com");
                      setPassword("ChangeMe123!");
                    }}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEmail("user@example.com");
                      setPassword("ChangeMe123!");
                    }}
                  >
                    <User className="h-4 w-4" />
                    Usuario
                  </Button>
                </div>

                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold opacity-80">Email</span>
                    <input
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--accent)]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold opacity-80">Contraseña</span>
                    <input
                      className="mt-1 w-full rounded-xl border border-[color:var(--border)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--accent)]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      required
                    />
                  </label>

                  {error ? <div className="text-sm text-rose-300">{error}</div> : null}

                  <Button className="w-full" disabled={loading} type="submit">
                    <LogIn className="h-4 w-4" />
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>

                  <div className="text-xs opacity-70">Credenciales iniciales (dev) se toman de `backend/.env`.</div>
                </form>
              </CardBody>
            </Card>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
