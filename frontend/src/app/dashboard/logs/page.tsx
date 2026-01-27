"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Download, Filter, AlertCircle, Info, CheckCircle } from "lucide-react";
import { Card, CardBody, CardHeader, Container, Button, Badge } from "@/app/ui";

interface LogEntry {
    id: string;
    timestamp: string;
    level: "info" | "warn" | "error" | "success";
    message: string;
    source: string;
}

export default function LogsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState<string>("all");

    const logs: LogEntry[] = [
        { id: "1", timestamp: "2024-01-27 21:45:32", level: "info", message: "Server started successfully", source: "core" },
        { id: "2", timestamp: "2024-01-27 21:45:35", level: "success", message: "Plugin 'EssentialsX' loaded", source: "plugins" },
        { id: "3", timestamp: "2024-01-27 21:46:12", level: "warn", message: "High memory usage detected (85%)", source: "monitor" },
        { id: "4", timestamp: "2024-01-27 21:47:05", level: "info", message: "Player 'Steve' joined the game", source: "game" },
        { id: "5", timestamp: "2024-01-27 21:48:20", level: "error", message: "Failed to connect to database", source: "database" },
        { id: "6", timestamp: "2024-01-27 21:49:01", level: "success", message: "Backup completed successfully", source: "backup" },
        { id: "7", timestamp: "2024-01-27 21:50:15", level: "info", message: "Autosave completed", source: "core" },
        { id: "8", timestamp: "2024-01-27 21:51:30", level: "warn", message: "TPS dropped below 15", source: "monitor" }
    ];

    const filteredLogs = logs.filter((log) => {
        const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.source.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLevel = levelFilter === "all" || log.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    const getLevelIcon = (level: LogEntry["level"]) => {
        switch (level) {
            case "error":
                return <AlertCircle className="h-4 w-4 text-rose-400" />;
            case "warn":
                return <AlertCircle className="h-4 w-4 text-amber-400" />;
            case "success":
                return <CheckCircle className="h-4 w-4 text-emerald-400" />;
            default:
                return <Info className="h-4 w-4 text-sky-400" />;
        }
    };

    const getLevelBadge = (level: LogEntry["level"]) => {
        switch (level) {
            case "error":
                return <Badge tone="bad">ERROR</Badge>;
            case "warn":
                return <Badge tone="warn">WARN</Badge>;
            case "success":
                return <Badge tone="good">SUCCESS</Badge>;
            default:
                return <Badge tone="info">INFO</Badge>;
        }
    };

    return (
        <main className="py-10">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                >
                    <div className="flex items-start justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] p-2">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">Server Logs</h1>
                                <p className="text-sm opacity-70 mt-1">View and search server activity logs</p>
                            </div>
                        </div>

                        <Button variant="outline">
                            <Download className="h-4 w-4" />
                            Export Logs
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="Search logs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setLevelFilter("all")}
                                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${levelFilter === "all"
                                                ? "bg-[color:var(--accent)] text-black"
                                                : "border border-[color:var(--border)] hover:bg-[color:var(--muted)]"
                                            }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setLevelFilter("error")}
                                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${levelFilter === "error"
                                                ? "bg-rose-400 text-black"
                                                : "border border-[color:var(--border)] hover:bg-[color:var(--muted)]"
                                            }`}
                                    >
                                        Errors
                                    </button>
                                    <button
                                        onClick={() => setLevelFilter("warn")}
                                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${levelFilter === "warn"
                                                ? "bg-amber-400 text-black"
                                                : "border border-[color:var(--border)] hover:bg-[color:var(--muted)]"
                                            }`}
                                    >
                                        Warnings
                                    </button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {filteredLogs.map((log, i) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="flex items-start gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3 hover:bg-[color:var(--border)] transition"
                                    >
                                        <div className="mt-0.5">{getLevelIcon(log.level)}</div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs opacity-70">{log.timestamp}</span>
                                                {getLevelBadge(log.level)}
                                                <Badge tone="neutral">{log.source}</Badge>
                                            </div>
                                            <div className="text-sm">{log.message}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredLogs.length === 0 && (
                                <div className="text-center py-12 opacity-70">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No logs found matching your criteria</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </motion.div>
            </Container>
        </main>
    );
}
