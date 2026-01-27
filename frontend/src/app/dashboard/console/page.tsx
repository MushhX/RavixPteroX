"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Send, Trash2 } from "lucide-react";
import { Card, CardBody, CardHeader, Container, Button } from "@/app/ui";

export default function ConsolePage() {
    const [command, setCommand] = useState("");
    const [logs, setLogs] = useState<Array<{ type: "input" | "output" | "system"; text: string }>>([
        { type: "system", text: "Console connected. Type 'help' for available commands." },
        { type: "output", text: "[Server] Starting Minecraft server..." },
        { type: "output", text: "[Server] Done! Server is running." }
    ]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim()) return;

        setLogs((prev) => [...prev, { type: "input", text: command }]);

        // Simulate command response
        setTimeout(() => {
            setLogs((prev) => [
                ...prev,
                { type: "output", text: `[Server] Executed: ${command}` }
            ]);
        }, 100);

        setCommand("");
    };

    const clearLogs = () => {
        setLogs([{ type: "system", text: "Console cleared." }]);
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
                                <TerminalIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">Console</h1>
                                <p className="text-sm opacity-70 mt-1">Execute server commands in real-time</p>
                            </div>
                        </div>

                        <Button variant="outline" onClick={clearLogs}>
                            <Trash2 className="h-4 w-4" />
                            Clear
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-sm font-semibold">Live Console</span>
                                </div>
                                <div className="text-xs opacity-70">Connected</div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {/* Console Output */}
                            <div className="rounded-xl border border-[color:var(--border)] bg-black/40 p-4 font-mono text-sm h-96 overflow-y-auto">
                                {logs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.1 }}
                                        className={`mb-1 ${log.type === "input"
                                                ? "text-[color:var(--accent)]"
                                                : log.type === "system"
                                                    ? "text-amber-400"
                                                    : "text-gray-300"
                                            }`}
                                    >
                                        {log.type === "input" && "$ "}
                                        {log.text}
                                    </motion.div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>

                            {/* Command Input */}
                            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                                <div className="flex-1 relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--accent)] font-mono">
                                        $
                                    </span>
                                    <input
                                        type="text"
                                        value={command}
                                        onChange={(e) => setCommand(e.target.value)}
                                        placeholder="Enter command..."
                                        className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] pl-8 pr-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                                    />
                                </div>
                                <Button type="submit">
                                    <Send className="h-4 w-4" />
                                    Send
                                </Button>
                            </form>

                            {/* Quick Commands */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    onClick={() => setCommand("list")}
                                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-1.5 text-xs font-mono hover:bg-[color:var(--border)] transition"
                                >
                                    list
                                </button>
                                <button
                                    onClick={() => setCommand("save-all")}
                                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-1.5 text-xs font-mono hover:bg-[color:var(--border)] transition"
                                >
                                    save-all
                                </button>
                                <button
                                    onClick={() => setCommand("whitelist list")}
                                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-1.5 text-xs font-mono hover:bg-[color:var(--border)] transition"
                                >
                                    whitelist list
                                </button>
                                <button
                                    onClick={() => setCommand("help")}
                                    className="rounded-lg border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-1.5 text-xs font-mono hover:bg-[color:var(--border)] transition"
                                >
                                    help
                                </button>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            </Container>
        </main>
    );
}
