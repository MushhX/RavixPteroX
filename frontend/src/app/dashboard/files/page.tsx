"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    File,
    Folder,
    Upload,
    Download,
    Trash2,
    Edit,
    Search,
    ChevronRight,
    FileText,
    Image as ImageIcon,
    Archive
} from "lucide-react";
import { Card, CardBody, CardHeader, Container, Button, Badge } from "@/app/ui";

interface FileItem {
    name: string;
    type: "file" | "folder";
    size?: string;
    modified: string;
    icon?: any;
}

export default function FilesPage() {
    const [currentPath, setCurrentPath] = useState("/");
    const [searchQuery, setSearchQuery] = useState("");

    // Mock file system data
    const files: FileItem[] = [
        { name: "config", type: "folder", modified: "2 hours ago" },
        { name: "plugins", type: "folder", modified: "1 day ago" },
        { name: "logs", type: "folder", modified: "5 minutes ago" },
        { name: "server.properties", type: "file", size: "2.4 KB", modified: "3 hours ago", icon: FileText },
        { name: "world.zip", type: "file", size: "145 MB", modified: "1 day ago", icon: Archive },
        { name: "banner.png", type: "file", size: "48 KB", modified: "2 days ago", icon: ImageIcon },
        { name: "whitelist.json", type: "file", size: "1.2 KB", modified: "1 week ago", icon: FileText }
    ];

    const filteredFiles = files.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFileIcon = (item: FileItem) => {
        if (item.type === "folder") return <Folder className="h-5 w-5" />;
        if (item.icon) return <item.icon className="h-5 w-5" />;
        return <File className="h-5 w-5" />;
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
                                <Folder className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">File Manager</h1>
                                <p className="text-sm opacity-70 mt-1">Browse and manage server files</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Upload className="h-4 w-4" />
                                Upload
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                                    <input
                                        type="text"
                                        placeholder="Search files..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                                    />
                                </div>
                            </div>

                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 mt-4 text-sm">
                                <button className="opacity-70 hover:opacity-100 transition">Home</button>
                                <ChevronRight className="h-4 w-4 opacity-50" />
                                <span className="font-medium">{currentPath}</span>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div className="space-y-2">
                                {filteredFiles.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3 cursor-pointer group"
                                    >
                                        <div className="opacity-70">{getFileIcon(item)}</div>

                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm truncate">{item.name}</div>
                                            <div className="text-xs opacity-70 mt-0.5">
                                                {item.type === "folder" ? "Folder" : item.size} · {item.modified}
                                            </div>
                                        </div>

                                        {item.type === "file" && (
                                            <Badge tone="neutral">{item.name.split(".").pop()}</Badge>
                                        )}

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                            <button className="rounded-lg p-2 hover:bg-[color:var(--border)] transition">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="rounded-lg p-2 hover:bg-[color:var(--border)] transition">
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button className="rounded-lg p-2 hover:bg-rose-400/20 transition text-rose-400">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredFiles.length === 0 && (
                                <div className="text-center py-12 opacity-70">
                                    <Folder className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No files found</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </motion.div>
            </Container>
        </main>
    );
}
