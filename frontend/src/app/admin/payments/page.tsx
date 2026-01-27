"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, Users, TrendingUp, FileText } from "lucide-react";
import { Card, CardBody, CardHeader, Container, Badge } from "@/app/ui";
import { Tabs } from "@/components/Tabs";

export default function AdminPaymentsPage() {
    const totalRevenue = 12450.75;
    const monthlyRevenue = 2890.50;
    const activeSubscriptions = 47;

    const recentTransactions = [
        { id: "tx_1", user: "user@example.com", amount: "$29.99", date: "2024-01-27", status: "completed" },
        { id: "tx_2", user: "admin@test.com", amount: "$49.99", date: "2024-01-27", status: "completed" },
        { id: "tx_3", user: "demo@ravix.com", amount: "$29.99", date: "2024-01-26", status: "completed" },
        { id: "tx_4", user: "test@example.com", amount: "$29.99", date: "2024-01-26", status: "failed" }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold">Gestión de Pagos</h1>
                <p className="text-sm text-zinc-600">Administra transacciones y suscripciones</p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm opacity-70">Ingresos Totales</div>
                            <DollarSign className="h-4 w-4 opacity-70" />
                        </div>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        <div className="text-xs opacity-70 mt-1">Desde el inicio</div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm opacity-70">Este Mes</div>
                            <TrendingUp className="h-4 w-4 opacity-70" />
                        </div>
                        <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
                        <div className="text-xs text-emerald-400 mt-1">+12% vs mes anterior</div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm opacity-70">Suscripciones Activas</div>
                            <Users className="h-4 w-4 opacity-70" />
                        </div>
                        <div className="text-2xl font-bold">{activeSubscriptions}</div>
                        <div className="text-xs opacity-70 mt-1">Usuarios con plan activo</div>
                    </CardBody>
                </Card>
            </div>

            <Tabs
                tabs={[
                    {
                        id: "transactions",
                        label: "Transacciones",
                        icon: <CreditCard className="h-4 w-4" />,
                        content: (
                            <Card>
                                <CardHeader>
                                    <div className="font-semibold">Transacciones Recientes</div>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-2">
                                        {recentTransactions.map((tx, i) => (
                                            <motion.div
                                                key={tx.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex items-center justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3"
                                            >
                                                <div>
                                                    <div className="font-medium text-sm">{tx.user}</div>
                                                    <div className="text-xs opacity-70">{tx.date}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="font-semibold">{tx.amount}</div>
                                                    <Badge tone={tx.status === "completed" ? "good" : "bad"}>
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        )
                    },
                    {
                        id: "subscriptions",
                        label: "Suscripciones",
                        icon: <Users className="h-4 w-4" />,
                        content: (
                            <Card>
                                <CardHeader>
                                    <div className="font-semibold">Planes de Suscripción</div>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-3">
                                        {[
                                            { name: "Basic", price: "$9.99", users: 12, color: "sky" },
                                            { name: "Pro", price: "$29.99", users: 28, color: "emerald" },
                                            { name: "Enterprise", price: "$99.99", users: 7, color: "purple" }
                                        ].map((plan, i) => (
                                            <motion.div
                                                key={plan.name}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-semibold">{plan.name}</div>
                                                        <div className="text-sm opacity-70">{plan.price}/mes</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">{plan.users}</div>
                                                        <div className="text-xs opacity-70">usuarios</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        )
                    },
                    {
                        id: "settings",
                        label: "Configuración",
                        icon: <FileText className="h-4 w-4" />,
                        content: (
                            <Card>
                                <CardHeader>
                                    <div className="font-semibold">Configuración de Pagos</div>
                                </CardHeader>
                                <CardBody>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Stripe API Key</label>
                                            <input
                                                type="password"
                                                placeholder="sk_test_..."
                                                className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 font-mono text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">PayPal Client ID</label>
                                            <input
                                                type="password"
                                                placeholder="AYSq3RDGsmBLJE-otTkBtM-jBc4pjWCEmuYo..."
                                                className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 font-mono text-sm"
                                            />
                                        </div>
                                        <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                            <div className="text-sm opacity-70">
                                                Las claves de API se almacenan de forma segura y encriptada.
                                                Configura tus webhooks en el dashboard de Stripe/PayPal.
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )
                    }
                ]}
            />
        </div>
    );
}
