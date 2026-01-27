"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  LayoutDashboard,
  Network,
  RefreshCcw,
  Shield,
  Square,
  Triangle,
  Zap
} from "lucide-react";
import {
  logout,
  getServers,
  health,
  listMarketplaceItems,
  listPlugins,
  loadTokensFromStorage,
  me,
  powerServer,
  refresh
} from "@/lib/api";
import { Badge, Button, Card, CardBody, CardHeader, Container, Progress, Stat } from "@/app/ui";

type AnyObj = Record<string, any>;

type Mode = "normal" | "demo" | string;

function pct(n: number, d: number) {
  if (!Number.isFinite(n) || !Number.isFinite(d) || d <= 0) return 0;
  return Math.max(0, Math.min(100, (n / d) * 100));
}

function fmtMiB(v: number) {
  if (!Number.isFinite(v)) return "-";
  if (v >= 1024) return `${(v / 1024).toFixed(1)} GiB`;
  return `${Math.round(v)} MiB`;
}

function fmtUptime(sec: number) {
  if (!Number.isFinite(sec) || sec <= 0) return "0m";
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [servers, setServers] = useState<AnyObj | null>(null);
  const [plugins, setPlugins] = useState<AnyObj | null>(null);
  const [market, setMarket] = useState<AnyObj | null>(null);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serverItems = useMemo(() => {
    const arr = servers?.data;
    return Array.isArray(arr) ? arr : [];
  }, [servers]);

  const selectedServer = useMemo(() => {
    const id = selected ?? (serverItems[0]?.attributes?.identifier as string | undefined);
    if (!id) return null;
    const found = serverItems.find((it: AnyObj) => (it?.attributes?.identifier ?? it?.id) === id);
    const attr = (found?.attributes ?? {}) as AnyObj;
    return {
      id,
      name: String(attr?.name ?? id),
      description: String(attr?.description ?? ""),
      node: String(attr?.node ?? "-"),
      status: (attr?.status ?? {}) as AnyObj,
      limits: (attr?.limits ?? {}) as AnyObj,
      usage: (attr?.usage ?? {}) as AnyObj,
      sftp: (attr?.sftp ?? {}) as AnyObj,
      createdAt: Number(attr?.createdAt ?? 0)
    };
  }, [serverItems, selected]);

  const activityFeed = useMemo(() => {
    const base = [
      { icon: <Activity className="h-4 w-4" />, tone: "info" as const, text: "Metrics stream connected" },
      { icon: <Shield className="h-4 w-4" />, tone: "neutral" as const, text: "WAF rules applied" },
      { icon: <Database className="h-4 w-4" />, tone: "good" as const, text: "Backup completed" },
      { icon: <Network className="h-4 w-4" />, tone: "neutral" as const, text: "Network spike detected" }
    ];

    const out: Array<{ id: string; icon: any; tone: any; text: string; when: string }> = [];
    for (const it of serverItems) {
      const attr = (it?.attributes ?? {}) as AnyObj;
      const id = String(attr?.identifier ?? it?.id ?? "unknown");
      const name = String(attr?.name ?? id);
      const state = String(attr?.status?.state ?? "unknown");

      const pick = base[Math.abs(id.length * 17 + state.length * 31) % base.length];
      const when = state === "running" ? "just now" : "2m ago";
      out.push({
        id,
        icon: pick.icon,
        tone: pick.tone,
        text: `${name}: ${pick.text}`,
        when
      });
    }
    return out.slice(0, 6);
  }, [serverItems]);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      loadTokensFromStorage();
      await refresh();

      const [meRes, healthRes] = await Promise.all([me(), health()]);
      setUser({ email: meRes.user.email, role: meRes.user.role });
      setMode(healthRes?.mode ?? null);

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
    <main className="py-10">
      <Container>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] p-2">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge tone={mode === "demo" ? "info" : "neutral"}>{mode === "demo" ? "DEMO MODE" : "LIVE"}</Badge>
                    {user ? <Badge>{user.email}</Badge> : null}
                    {user?.role === "admin" ? <Badge tone="good">admin</Badge> : <Badge>user</Badge>}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm opacity-80">
                {mode === "demo"
                  ? "Vista demostración: datos simulados para que el panel se sienta real."
                  : "Conectado a RavixPteroX backend."}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {user?.role === "admin" ? (
                <Link href="/admin">
                  <Button variant="outline">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              ) : null}
              <Button
                variant="outline"
                onClick={async () => {
                  await logout();
                  router.replace("/login");
                }}
              >
                <Square className="h-4 w-4" />
                Salir
              </Button>
              <Button variant="outline" onClick={load}>
                <RefreshCcw className="h-4 w-4" />
                Recargar
              </Button>
            </div>
          </div>

          {loading ? <div className="mt-6 opacity-70">Cargando...</div> : null}
          {error ? <div className="mt-6 text-sm text-rose-300">{error}</div> : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <div className="font-semibold">Servidores</div>
                  </div>
                  <div className="text-xs opacity-70">Client API</div>
                </CardHeader>
                <CardBody>
                  {serverItems.length === 0 ? (
                    <div className="text-sm opacity-70">
                      Sin servidores / sin acceso.
                      <div className="mt-1 text-xs opacity-70">
                        En normal, configura `PTERO_CLIENT_API_KEY` en `backend/.env`.
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2">
                      {serverItems.map((it: AnyObj) => {
                        const attr = (it?.attributes ?? {}) as AnyObj;
                        const id = String(attr?.identifier ?? it?.id ?? "unknown");
                        const name = String(attr?.name ?? "server");
                        const desc = String(attr?.description ?? "");
                        const state = String(attr?.status?.state ?? "unknown");
                        const isSelected = (selected ?? serverItems[0]?.attributes?.identifier) === id;
                        const tone = state === "running" ? "good" : state === "stopped" ? "warn" : "neutral";

                        return (
                          <motion.button
                            key={id}
                            onClick={() => setSelected(id)}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className={`text-left rounded-2xl border px-4 py-3 transition ${
                              isSelected
                                ? "border-[color:var(--accent)] bg-[color:var(--muted)]"
                                : "border-[color:var(--border)] bg-transparent hover:bg-[color:var(--muted)]"
                            }`}
                            type="button"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="font-semibold truncate">{name}</div>
                                <div className="mt-1 text-xs opacity-70 truncate">{desc || id}</div>
                              </div>
                              <Badge tone={tone}>{state}</Badge>
                            </div>

                            <div className="mt-3 grid grid-cols-3 gap-2">
                              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-2 py-2">
                                <div className="text-[10px] font-semibold opacity-70">CPU</div>
                                <div className="mt-1 text-xs font-semibold">
                                  {Number(attr?.usage?.cpuPercent ?? 0).toFixed(0)}%
                                </div>
                              </div>
                              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-2 py-2">
                                <div className="text-[10px] font-semibold opacity-70">MEM</div>
                                <div className="mt-1 text-xs font-semibold">{fmtMiB(Number(attr?.usage?.memoryMiB ?? 0))}</div>
                              </div>
                              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-2 py-2">
                                <div className="text-[10px] font-semibold opacity-70">DISK</div>
                                <div className="mt-1 text-xs font-semibold">{fmtMiB(Number(attr?.usage?.diskMiB ?? 0))}</div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Triangle className="h-4 w-4" />
                    <div className="font-semibold">Panel</div>
                  </div>
                  {selectedServer ? <div className="text-xs opacity-70">{selectedServer.node}</div> : null}
                </CardHeader>
                <CardBody>
                  {!selectedServer ? (
                    <div className="opacity-70 text-sm">Selecciona un servidor para ver detalles.</div>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="text-lg font-semibold truncate">{selectedServer.name}</div>
                          <div className="mt-1 text-sm opacity-70 truncate">{selectedServer.description}</div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge tone={selectedServer.status.state === "running" ? "good" : "warn"}>
                              {String(selectedServer.status.state ?? "unknown")}
                            </Badge>
                            <Badge>uptime {fmtUptime(Number(selectedServer.status.uptimeSec ?? 0))}</Badge>
                            <Badge tone="neutral">{selectedServer.id}</Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => power(selectedServer.id, "start")}
                            disabled={loading}
                          >
                            Start
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => power(selectedServer.id, "restart")}
                            disabled={loading}
                          >
                            Restart
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => power(selectedServer.id, "stop")}
                            disabled={loading}
                          >
                            Stop
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <Stat
                          label="CPU"
                          value={`${Number(selectedServer.usage.cpuPercent ?? 0).toFixed(0)}%`}
                          sub={`${Number(selectedServer.limits.cpu ?? 0)}% limit`}
                          icon={<Cpu className="h-4 w-4" />}
                        />
                        <Stat
                          label="Memory"
                          value={fmtMiB(Number(selectedServer.usage.memoryMiB ?? 0))}
                          sub={`of ${fmtMiB(Number(selectedServer.limits.memoryMiB ?? 0))}`}
                          icon={<Database className="h-4 w-4" />}
                        />
                        <Stat
                          label="Disk"
                          value={fmtMiB(Number(selectedServer.usage.diskMiB ?? 0))}
                          sub={`of ${fmtMiB(Number(selectedServer.limits.diskMiB ?? 0))}`}
                          icon={<HardDrive className="h-4 w-4" />}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold opacity-70">Memory usage</div>
                            <div className="text-xs opacity-70">
                              {fmtMiB(Number(selectedServer.usage.memoryMiB ?? 0))} / {fmtMiB(Number(selectedServer.limits.memoryMiB ?? 0))}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Progress
                              value={pct(
                                Number(selectedServer.usage.memoryMiB ?? 0),
                                Number(selectedServer.limits.memoryMiB ?? 0)
                              )}
                              tone={
                                pct(
                                  Number(selectedServer.usage.memoryMiB ?? 0),
                                  Number(selectedServer.limits.memoryMiB ?? 0)
                                ) > 85
                                  ? "bad"
                                  : "accent"
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-semibold opacity-70">Disk usage</div>
                            <div className="text-xs opacity-70">
                              {fmtMiB(Number(selectedServer.usage.diskMiB ?? 0))} / {fmtMiB(Number(selectedServer.limits.diskMiB ?? 0))}
                            </div>
                          </div>
                          <div className="mt-2">
                            <Progress
                              value={pct(
                                Number(selectedServer.usage.diskMiB ?? 0),
                                Number(selectedServer.limits.diskMiB ?? 0)
                              )}
                              tone={
                                pct(
                                  Number(selectedServer.usage.diskMiB ?? 0),
                                  Number(selectedServer.limits.diskMiB ?? 0)
                                ) > 90
                                  ? "warn"
                                  : "accent"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <div className="font-semibold">Actividad</div>
                  </div>
                  <div className="text-xs opacity-70">live</div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {activityFeed.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-3"
                      >
                        <div className="mt-0.5">{a.icon}</div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">{a.text}</div>
                          <div className="mt-1 text-xs opacity-70">{a.when}</div>
                        </div>
                        <div className="ml-auto">
                          <Badge tone={a.tone}>{a.tone}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="font-semibold">Integraciones</div>
                  <div className="text-xs opacity-70">plugins / market</div>
                </CardHeader>
                <CardBody>
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                      <div className="text-xs font-semibold opacity-70">Plugins</div>
                      <div className="mt-1 text-sm opacity-80 truncate">
                        {plugins?.plugins ? `${plugins.plugins.length} cargados` : "-"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                      <div className="text-xs font-semibold opacity-70">Marketplace</div>
                      <div className="mt-1 text-sm opacity-80 truncate">
                        {market?.items ? `${market.items.length} items` : "-"}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </motion.div>
      </Container>
    </main>
  );
}
