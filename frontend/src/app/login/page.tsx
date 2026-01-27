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
    <main className="min-h-screen flex items-center justify-center py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[color:var(--accent)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <Container className="w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mx-auto w-full max-w-md">
            {/* Branding Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center justify-center gap-3 mb-4"
              >
                <div className="rounded-2xl border-2 border-[color:var(--accent)] bg-[color:var(--card)] p-3 shadow-lg">
                  <Shield className="h-8 w-8 text-[color:var(--accent)]" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">RavixPteroX</h1>
              <p className="text-sm opacity-70">by Ravix Studios</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Badge tone={mode === "demo" ? "info" : "good"}>
                  {mode === "demo" ? "DEMO MODE" : "LIVE"}
                </Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Iniciar Sesión</h2>
                  <p className="text-sm opacity-70 mt-1">Accede a tu dashboard profesional</p>
                </div>
              </CardHeader>

              <CardBody>
                {/* Quick Login Buttons */}
                <div className="mb-6">
                  <div className="text-xs font-semibold opacity-70 mb-3">Acceso rápido (demo)</div>
                  <div className="grid grid-cols-2 gap-3">
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
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[color:var(--border)]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[color:var(--card)] px-2 opacity-70">o ingresa manualmente</span>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold opacity-80">Email</span>
                    <input
                      className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2.5 outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="tu@email.com"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold opacity-80">Contraseña</span>
                    <input
                      className="mt-2 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2.5 outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </label>

                  {error ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
                    >
                      {error}
                    </motion.div>
                  ) : null}

                  <Button className="w-full" disabled={loading} type="submit">
                    <LogIn className="h-4 w-4" />
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs opacity-60">
                      {mode === "demo"
                        ? "Modo demo: usa las credenciales de arriba"
                        : "Credenciales configuradas en backend/.env"}
                    </p>
                  </div>
                </form>
              </CardBody>
            </Card>

            {/* Footer */}
            <div className="mt-6 text-center text-xs opacity-60">
              <p>El mejor complemento de Pterodactyl</p>
              <p className="mt-1">Creado con ❤️ por Ravix Studios</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
