"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    Cpu,
    Database,
    HardDrive,
    Network,
    TrendingUp,
    Zap
} from "lucide-react";
import { Card, CardBody, CardHeader, Container, Stat } from "@/app/ui";
import { loadTokensFromStorage, refresh } from "@/lib/api";

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                loadTokensFromStorage();
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Mock data for charts - in production, this would come from the API
    const cpuData = [45, 52, 48, 61, 58, 65, 62, 70, 68, 72, 75, 71];
    const memoryData = [2048, 2156, 2234, 2389, 2456, 2512, 2678, 2734, 2812, 2890, 2945, 3012];
    const networkData = [120, 145, 132, 178, 165, 189, 201, 195, 210, 225, 218, 235];

    return (
        <main className="py-10">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] p-2">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
                            <p className="text-sm opacity-70 mt-1">
                                Monitor server performance and resource usage
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="opacity-70">Loading analytics...</div>
                    ) : (
                        <div className="space-y-6">
                            {/* Overview Stats */}
                            <div className="grid gap-4 md:grid-cols-4">
                                <Stat
                                    label="Avg CPU Usage"
                                    value="64%"
                                    sub="+12% from last week"
                                    icon={<Cpu className="h-4 w-4" />}
                                />
                                <Stat
                                    label="Memory Usage"
                                    value="2.9 GiB"
                                    sub="of 8 GiB total"
                                    icon={<Database className="h-4 w-4" />}
                                />
                                <Stat
                                    label="Disk I/O"
                                    value="235 MB/s"
                                    sub="+8% from yesterday"
                                    icon={<HardDrive className="h-4 w-4" />}
                                />
                                <Stat
                                    label="Network"
                                    value="1.2 GB"
                                    sub="transferred today"
                                    icon={<Network className="h-4 w-4" />}
                                />
                            </div>

                            {/* CPU Usage Chart */}
                            <Card>
                                <CardHeader className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="h-4 w-4" />
                                        <div className="font-semibold">CPU Usage (Last 12 Hours)</div>
                                    </div>
                                    <div className="text-xs opacity-70">Updated 2m ago</div>
                                </CardHeader>
                                <CardBody>
                                    <div className="h-64 flex items-end gap-2">
                                        {cpuData.map((value, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${value}%` }}
                                                transition={{ delay: i * 0.05, duration: 0.5 }}
                                                className="flex-1 bg-gradient-to-t from-[color:var(--accent)] to-transparent rounded-t-lg relative group"
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg px-2 py-1 text-xs font-semibold whitespace-nowrap">
                                                    {value}%
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-3 text-xs opacity-70">
                                        <span>12h ago</span>
                                        <span>6h ago</span>
                                        <span>Now</span>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Memory & Network */}
                            <div className="grid gap-6 lg:grid-cols-2">
                                <Card>
                                    <CardHeader className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Database className="h-4 w-4" />
                                            <div className="font-semibold">Memory Usage</div>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="h-48 flex items-end gap-1.5">
                                            {memoryData.map((value, i) => {
                                                const percentage = (value / 8192) * 100;
                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${percentage}%` }}
                                                        transition={{ delay: i * 0.04, duration: 0.4 }}
                                                        className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-400/50 rounded-t relative group"
                                                    >
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg px-2 py-1 text-xs font-semibold whitespace-nowrap">
                                                            {(value / 1024).toFixed(1)} GiB
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </CardBody>
                                </Card>

                                <Card>
                                    <CardHeader className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Network className="h-4 w-4" />
                                            <div className="font-semibold">Network Traffic</div>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="h-48 flex items-end gap-1.5">
                                            {networkData.map((value, i) => {
                                                const percentage = (value / 250) * 100;
                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${percentage}%` }}
                                                        transition={{ delay: i * 0.04, duration: 0.4 }}
                                                        className="flex-1 bg-gradient-to-t from-sky-400 to-sky-400/50 rounded-t relative group"
                                                    >
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg px-2 py-1 text-xs font-semibold whitespace-nowrap">
                                                            {value} MB/s
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Activity Timeline */}
                            <Card>
                                <CardHeader className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        <div className="font-semibold">Recent Activity</div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-3">
                                        {[
                                            { time: "2m ago", event: "Server restarted", type: "info" },
                                            { time: "15m ago", event: "High CPU usage detected", type: "warning" },
                                            { time: "1h ago", event: "Backup completed successfully", type: "success" },
                                            { time: "3h ago", event: "New plugin installed", type: "info" },
                                            { time: "5h ago", event: "Database optimized", type: "success" }
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{item.event}</div>
                                                    <div className="text-xs opacity-70 mt-1">{item.time}</div>
                                                </div>
                                                <div
                                                    className={`h-2 w-2 rounded-full ${item.type === "success"
                                                            ? "bg-emerald-400"
                                                            : item.type === "warning"
                                                                ? "bg-amber-400"
                                                                : "bg-sky-400"
                                                        }`}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    )}
                </motion.div>
            </Container>
        </main>
    );
}
