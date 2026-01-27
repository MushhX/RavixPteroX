"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Palette, Upload, Type, Layout, Save, Eye } from "lucide-react";
import { Card, CardBody, CardHeader, Container, Button } from "@/app/ui";
import { Tabs } from "@/components/Tabs";

export default function CustomizePage() {
    const [selectedTheme, setSelectedTheme] = useState("dark");
    const [selectedBg, setSelectedBg] = useState("midnight");
    const [brandName, setBrandName] = useState("RavixPteroX");
    const [tagline, setTagline] = useState("by Ravix Studios");

    const themes = [
        { id: "light", name: "Light", preview: "bg-preview-snow" },
        { id: "dark", name: "Dark", preview: "bg-preview-midnight" },
        { id: "blue", name: "Blue", preview: "bg-preview-ocean" },
        { id: "sunset", name: "Sunset", preview: "bg-preview-sunset" },
        { id: "neon", name: "Neon", preview: "bg-preview-neon" },
        { id: "forest", name: "Forest", preview: "bg-preview-forest" },
        { id: "purple-haze", name: "Purple Haze", preview: "bg-preview-purple-haze" },
        { id: "graphite", name: "Graphite", preview: "bg-preview-graphite" }
    ];

    const backgrounds = [
        { id: "snow", name: "Snow" },
        { id: "midnight", name: "Midnight" },
        { id: "ocean", name: "Ocean" },
        { id: "graphite", name: "Graphite" },
        { id: "sunset", name: "Sunset" },
        { id: "neon", name: "Neon" },
        { id: "forest", name: "Forest" },
        { id: "purple-haze", name: "Purple Haze" }
    ];

    const applyTheme = () => {
        document.documentElement.setAttribute("data-theme", selectedTheme);
        document.documentElement.setAttribute("data-bg", selectedBg);
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
                                <Palette className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">Customization</h1>
                                <p className="text-sm opacity-70 mt-1">
                                    Personalize your dashboard appearance and branding
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={applyTheme}>
                                <Eye className="h-4 w-4" />
                                Preview
                            </Button>
                            <Button>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    <Tabs
                        tabs={[
                            {
                                id: "themes",
                                label: "Themes",
                                icon: <Palette className="h-4 w-4" />,
                                content: (
                                    <div className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <div className="font-semibold">Color Theme</div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="grid gap-3 md:grid-cols-4">
                                                    {themes.map((theme) => (
                                                        <motion.button
                                                            key={theme.id}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setSelectedTheme(theme.id)}
                                                            className={`rounded-2xl border-2 overflow-hidden transition ${selectedTheme === theme.id
                                                                    ? "border-[color:var(--accent)]"
                                                                    : "border-[color:var(--border)]"
                                                                }`}
                                                        >
                                                            <div className={`h-24 ${theme.preview}`} />
                                                            <div className="px-3 py-2 text-sm font-semibold bg-[color:var(--card)]">
                                                                {theme.name}
                                                            </div>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <div className="font-semibold">Background Style</div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="grid gap-3 md:grid-cols-4">
                                                    {backgrounds.map((bg) => (
                                                        <motion.button
                                                            key={bg.id}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setSelectedBg(bg.id)}
                                                            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${selectedBg === bg.id
                                                                    ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-black"
                                                                    : "border-[color:var(--border)] bg-[color:var(--muted)]"
                                                                }`}
                                                        >
                                                            {bg.name}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </CardBody>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <div className="font-semibold">Custom Colors</div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Primary Accent
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                defaultValue="#60a5fa"
                                                                className="h-10 w-20 rounded-lg border border-[color:var(--border)] cursor-pointer"
                                                            />
                                                            <input
                                                                type="text"
                                                                defaultValue="#60a5fa"
                                                                className="flex-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-2 text-sm font-mono"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Background Color
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="color"
                                                                defaultValue="#0b1020"
                                                                className="h-10 w-20 rounded-lg border border-[color:var(--border)] cursor-pointer"
                                                            />
                                                            <input
                                                                type="text"
                                                                defaultValue="#0b1020"
                                                                className="flex-1 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-3 py-2 text-sm font-mono"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                )
                            },
                            {
                                id: "branding",
                                label: "Branding",
                                icon: <Type className="h-4 w-4" />,
                                content: (
                                    <div className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <div className="font-semibold">Logo & Brand Identity</div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Brand Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={brandName}
                                                            onChange={(e) => setBrandName(e.target.value)}
                                                            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Tagline
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={tagline}
                                                            onChange={(e) => setTagline(e.target.value)}
                                                            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold mb-2">
                                                            Logo Upload
                                                        </label>
                                                        <div className="rounded-xl border-2 border-dashed border-[color:var(--border)] bg-[color:var(--muted)] p-8 text-center">
                                                            <Upload className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                                            <p className="text-sm opacity-70 mb-2">
                                                                Drag & drop your logo here, or click to browse
                                                            </p>
                                                            <Button variant="outline" size="sm">
                                                                Choose File
                                                            </Button>
                                                            <p className="text-xs opacity-50 mt-2">
                                                                Recommended: PNG or SVG, max 2MB
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] p-4">
                                                        <div className="text-sm font-semibold mb-2">Preview</div>
                                                        <div className="rounded-lg bg-[color:var(--card)] p-4 text-center">
                                                            <div className="text-2xl font-bold">{brandName}</div>
                                                            <div className="text-sm opacity-70 mt-1">{tagline}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                )
                            },
                            {
                                id: "layout",
                                label: "Layout",
                                icon: <Layout className="h-4 w-4" />,
                                content: (
                                    <Card>
                                        <CardHeader>
                                            <div className="font-semibold">Dashboard Layout</div>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="text-center py-12 opacity-70">
                                                <Layout className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                <p className="mb-2">Layout customization coming soon</p>
                                                <p className="text-sm opacity-70">
                                                    Drag and drop widgets to reorganize your dashboard
                                                </p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                )
                            }
                        ]}
                    />
                </motion.div>
            </Container>
        </main>
    );
}
