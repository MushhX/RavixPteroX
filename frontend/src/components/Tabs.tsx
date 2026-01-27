"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const activeContent = tabs.find((t) => t.id === activeTab)?.content;

    return (
        <div className="space-y-6">
            <div className="flex gap-2 border-b border-[color:var(--border)] overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition whitespace-nowrap ${isActive ? "text-[color:var(--accent)]" : "opacity-70 hover:opacity-100"
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--accent)]"
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeContent}
            </motion.div>
        </div>
    );
}
