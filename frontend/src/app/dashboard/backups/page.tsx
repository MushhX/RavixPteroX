"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Archive,
    Download,
    Trash2,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar
} from "lucide-react";
import { Card, CardBody, CardHeader, Container, Button, Badge } from "@/app/ui";
import { Modal } from "@/components/Modal";

interface Backup {
    id: string;
    name: string;
    size: string;
    created: string;
    status: "completed" | "failed" | "in-progress";
}

export default function BackupsPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const backups: Backup[] = [
        { id: "bk_1", name: "auto-backup-2024-01-27", size: "245 MB", created: "2 hours ago", status: "completed" },
        { id: "bk_2", name: "manual-backup-2024-01-26", size: "238 MB", created: "1 day ago", status: "completed" },
        { id: "bk_3", name: "auto-backup-2024-01-26", size: "242 MB", created: "1 day ago", status: "completed" },
        { id: "bk_4", name: "manual-backup-2024-01-25", size: "235 MB", created: "2 days ago", status: "completed" }
    ];

    const getStatusIcon = (status: Backup["status"]) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4 text-emerald-400" />;
            case "failed":
                return <AlertCircle className="h-4 w-4 text-rose-400" />;
            default:
                return <Clock className="h-4 w-4 text-amber-400 animate-pulse" />;
        }
    };

    const getStatusBadge = (status: Backup["status"]) => {
        switch (status) {
            case "completed":
                return <Badge tone="good">Completed</Badge>;
            case "failed":
                return <Badge tone="bad">Failed</Badge>;
            default:
                return <Badge tone="warn">In Progress</Badge>;
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
                                <Archive className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">Backups</h1>
                                <p className="text-sm opacity-70 mt-1">Create and restore server backups</p>
                            </div>
                        </div>

                        <Button onClick={() => setShowCreateModal(true)}>
                            <Archive className="h-4 w-4" />
                            Create Backup
                        </Button>
                    </div>

                    {/* Backup Schedule Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <div className="font-semibold">Automatic Backups</div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                    <div className="text-xs font-semibold opacity-70 mb-1">Schedule</div>
                                    <div className="text-sm font-medium">Daily at 3:00 AM</div>
                                </div>
                                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                    <div className="text-xs font-semibold opacity-70 mb-1">Retention</div>
                                    <div className="text-sm font-medium">Keep last 7 backups</div>
                                </div>
                                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                    <div className="text-xs font-semibold opacity-70 mb-1">Next Backup</div>
                                    <div className="text-sm font-medium">In 5 hours</div>
                                </div>
                            </div>
                            <Button variant="outline" className="mt-4">
                                Configure Schedule
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Backups List */}
                    <div className="space-y-3">
                        {backups.map((backup, i) => (
                            <motion.div
                                key={backup.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card>
                                    <CardBody>
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] p-3">
                                                {getStatusIcon(backup.status)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-semibold truncate">{backup.name}</h3>
                                                    {getStatusBadge(backup.status)}
                                                </div>
                                                <div className="text-sm opacity-70">
                                                    {backup.size} · Created {backup.created}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    Restore
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </Container>

            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Backup"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Backup Name</label>
                        <input
                            type="text"
                            placeholder="manual-backup-2024-01-27"
                            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                        />
                    </div>

                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                        <div className="text-sm opacity-70">
                            This will create a complete backup of your server files and configuration.
                            The backup will be compressed and stored securely.
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setShowCreateModal(false)}>
                            Create Backup
                        </Button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
