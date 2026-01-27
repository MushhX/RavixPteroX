"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarItem {
    id: string;
    label: string;
    icon: ReactNode;
    href: string;
    badge?: string;
}

interface SidebarProps {
    items: SidebarItem[];
    header?: ReactNode;
    footer?: ReactNode;
}

export function Sidebar({ items, header, footer }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <motion.aside
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 border-r border-[color:var(--border)] bg-[color:var(--card)] backdrop-blur-md z-30"
        >
            <div className="flex flex-col h-full">
                {header && (
                    <div className="border-b border-[color:var(--border)] px-4 py-4">
                        {header}
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-1">
                        {items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.id} href={item.href}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${isActive
                                                ? "bg-[color:var(--accent)] text-black"
                                                : "hover:bg-[color:var(--muted)]"
                                            }`}
                                    >
                                        <div className="shrink-0">{item.icon}</div>
                                        {!collapsed && (
                                            <>
                                                <span className="flex-1 font-medium text-sm truncate">
                                                    {item.label}
                                                </span>
                                                {item.badge && (
                                                    <span className="rounded-full bg-[color:var(--muted)] px-2 py-0.5 text-xs font-semibold">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {footer && (
                    <div className="border-t border-[color:var(--border)] px-4 py-4">
                        {footer}
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-20 rounded-full border border-[color:var(--border)] bg-[color:var(--card)] p-1.5 shadow-lg hover:bg-[color:var(--muted)] transition"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>
            </div>
        </motion.aside>
    );
}
