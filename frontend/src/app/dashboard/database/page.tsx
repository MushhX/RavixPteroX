"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Database as DatabaseIcon,
    Plus,
    Trash2,
    Key,
    Copy,
    CheckCircle
} from "lucide-react";
import { Card, CardBody, CardHeader, Container, Button, Badge } from "@/app/ui";
import { Modal } from "@/components/Modal";

interface DatabaseItem {
    id: string;
    name: string;
    size: string;
    created: string;
    users: number;
}

export default function DatabasePage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newDbName, setNewDbName] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Mock database data
    const databases: DatabaseItem[] = [
        { id: "db_1", name: "minecraft_main", size: "45.2 MB", created: "2 weeks ago", users: 2 },
        { id: "db_2", name: "player_data", size: "12.8 MB", created: "1 month ago", users: 1 },
        { id: "db_3", name: "economy", size: "8.4 MB", created: "3 weeks ago", users: 3 }
    ];

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
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
                                <DatabaseIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">Databases</h1>
                                <p className="text-sm opacity-70 mt-1">Manage MySQL databases and users</p>
                            </div>
                        </div>

                        <Button onClick={() => setShowCreateModal(true)}>
                            <Plus className="h-4 w-4" />
                            Create Database
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {databases.map((db, i) => (
                            <motion.div
                                key={db.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card>
                                    <CardBody>
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <DatabaseIcon className="h-5 w-5 opacity-70" />
                                                    <h3 className="text-lg font-semibold">{db.name}</h3>
                                                    <Badge tone="neutral">{db.size}</Badge>
                                                </div>

                                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                                        <div className="text-xs font-semibold opacity-70 mb-1">Database ID</div>
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-sm font-mono">{db.id}</code>
                                                            <button
                                                                onClick={() => copyToClipboard(db.id, db.id)}
                                                                className="rounded-lg p-1 hover:bg-[color:var(--border)] transition"
                                                            >
                                                                {copiedId === db.id ? (
                                                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                                                ) : (
                                                                    <Copy className="h-3.5 w-3.5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                                        <div className="text-xs font-semibold opacity-70 mb-1">Created</div>
                                                        <div className="text-sm">{db.created}</div>
                                                    </div>

                                                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                                        <div className="text-xs font-semibold opacity-70 mb-1">Users</div>
                                                        <div className="text-sm">{db.users} authorized</div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                                    <div className="text-xs font-semibold opacity-70 mb-2">Connection String</div>
                                                    <div className="flex items-center gap-2">
                                                        <code className="flex-1 text-xs font-mono opacity-80 truncate">
                                                            mysql://user:pass@localhost:3306/{db.name}
                                                        </code>
                                                        <button
                                                            onClick={() => copyToClipboard(`mysql://user:pass@localhost:3306/${db.name}`, `conn_${db.id}`)}
                                                            className="rounded-lg p-1.5 hover:bg-[color:var(--border)] transition shrink-0"
                                                        >
                                                            {copiedId === `conn_${db.id}` ? (
                                                                <CheckCircle className="h-4 w-4 text-emerald-400" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Key className="h-4 w-4" />
                                                    Manage Users
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {databases.length === 0 && (
                        <Card>
                            <CardBody>
                                <div className="text-center py-12 opacity-70">
                                    <DatabaseIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No databases created yet</p>
                                    <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
                                        <Plus className="h-4 w-4" />
                                        Create Your First Database
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </motion.div>
            </Container>

            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Database"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Database Name</label>
                        <input
                            type="text"
                            value={newDbName}
                            onChange={(e) => setNewDbName(e.target.value)}
                            placeholder="my_database"
                            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                        />
                        <p className="text-xs opacity-70 mt-2">
                            Only alphanumeric characters and underscores allowed
                        </p>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setShowCreateModal(false)}>
                            Create Database
                        </Button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
