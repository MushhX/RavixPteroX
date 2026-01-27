"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    CreditCard,
    DollarSign,
    Download,
    FileText,
    Plus,
    CheckCircle
} from "lucide-react";
import { Card, CardBody, CardHeader, Container, Button, Badge } from "@/app/ui";
import { Tabs } from "@/components/Tabs";
import { Modal } from "@/components/Modal";

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: "paid" | "pending" | "failed";
    description: string;
}

interface PaymentMethod {
    id: string;
    type: "card" | "paypal";
    last4?: string;
    brand?: string;
    email?: string;
    isDefault: boolean;
}

export default function BillingPage() {
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

    const balance = 125.50;
    const invoices: Invoice[] = [
        { id: "INV-001", date: "2024-01-27", amount: "$29.99", status: "paid", description: "Monthly subscription" },
        { id: "INV-002", date: "2023-12-27", amount: "$29.99", status: "paid", description: "Monthly subscription" },
        { id: "INV-003", date: "2023-11-27", amount: "$29.99", status: "paid", description: "Monthly subscription" }
    ];

    const paymentMethods: PaymentMethod[] = [
        { id: "pm_1", type: "card", last4: "4242", brand: "Visa", isDefault: true },
        { id: "pm_2", type: "paypal", email: "user@example.com", isDefault: false }
    ];

    const getStatusBadge = (status: Invoice["status"]) => {
        switch (status) {
            case "paid":
                return <Badge tone="good">Paid</Badge>;
            case "pending":
                return <Badge tone="warn">Pending</Badge>;
            default:
                return <Badge tone="bad">Failed</Badge>;
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
                    <div className="flex items-center gap-3 mb-8">
                        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)] p-2">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
                            <p className="text-sm opacity-70 mt-1">Manage payments and subscriptions</p>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <Card className="mb-6">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm opacity-70 mb-1">Account Balance</div>
                                    <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
                                </div>
                                <Button>
                                    <Plus className="h-4 w-4" />
                                    Add Funds
                                </Button>
                            </div>
                        </CardBody>
                    </Card>

                    <Tabs
                        tabs={[
                            {
                                id: "invoices",
                                label: "Invoices",
                                icon: <FileText className="h-4 w-4" />,
                                content: (
                                    <div className="space-y-3">
                                        {invoices.map((invoice, i) => (
                                            <motion.div
                                                key={invoice.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                            >
                                                <Card>
                                                    <CardBody>
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] p-3">
                                                                    <FileText className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <span className="font-semibold">{invoice.id}</span>
                                                                        {getStatusBadge(invoice.status)}
                                                                    </div>
                                                                    <div className="text-sm opacity-70">
                                                                        {invoice.description} · {invoice.date}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <div className="text-lg font-bold">{invoice.amount}</div>
                                                                <Button variant="outline" size="sm">
                                                                    <Download className="h-4 w-4" />
                                                                    PDF
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                )
                            },
                            {
                                id: "payment-methods",
                                label: "Payment Methods",
                                icon: <CreditCard className="h-4 w-4" />,
                                content: (
                                    <div className="space-y-4">
                                        <div className="flex justify-end">
                                            <Button onClick={() => setShowAddPaymentModal(true)}>
                                                <Plus className="h-4 w-4" />
                                                Add Payment Method
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {paymentMethods.map((method, i) => (
                                                <motion.div
                                                    key={method.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <Card>
                                                        <CardBody>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] p-3">
                                                                        {method.type === "card" ? (
                                                                            <CreditCard className="h-5 w-5" />
                                                                        ) : (
                                                                            <DollarSign className="h-5 w-5" />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-3 mb-1">
                                                                            <span className="font-semibold">
                                                                                {method.type === "card"
                                                                                    ? `${method.brand} •••• ${method.last4}`
                                                                                    : `PayPal - ${method.email}`}
                                                                            </span>
                                                                            {method.isDefault && (
                                                                                <Badge tone="good">
                                                                                    <CheckCircle className="h-3 w-3" />
                                                                                    Default
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm opacity-70">
                                                                            {method.type === "card" ? "Credit Card" : "PayPal Account"}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    {!method.isDefault && (
                                                                        <Button variant="outline" size="sm">
                                                                            Set as Default
                                                                        </Button>
                                                                    )}
                                                                    <Button variant="outline" size="sm">
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            },
                            {
                                id: "subscription",
                                label: "Subscription",
                                icon: <DollarSign className="h-4 w-4" />,
                                content: (
                                    <Card>
                                        <CardHeader>
                                            <div className="font-semibold">Current Plan</div>
                                        </CardHeader>
                                        <CardBody>
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="text-2xl font-bold mb-1">Pro Plan</div>
                                                        <div className="text-sm opacity-70">$29.99 / month</div>
                                                    </div>
                                                    <Badge tone="good">Active</Badge>
                                                </div>

                                                <div className="grid gap-3 md:grid-cols-3">
                                                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                                        <div className="text-xs font-semibold opacity-70 mb-1">Next Billing</div>
                                                        <div className="text-sm font-medium">Feb 27, 2024</div>
                                                    </div>
                                                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                                        <div className="text-xs font-semibold opacity-70 mb-1">Servers</div>
                                                        <div className="text-sm font-medium">5 / 10 used</div>
                                                    </div>
                                                    <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-3">
                                                        <div className="text-xs font-semibold opacity-70 mb-1">Storage</div>
                                                        <div className="text-sm font-medium">45 GB / 100 GB</div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 pt-4">
                                                    <Button variant="outline">Upgrade Plan</Button>
                                                    <Button variant="outline">Cancel Subscription</Button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                )
                            }
                        ]}
                    />
                </motion.div>
            </Container>

            <Modal
                isOpen={showAddPaymentModal}
                onClose={() => setShowAddPaymentModal(false)}
                title="Add Payment Method"
                size="md"
            >
                <div className="space-y-4">
                    <div className="grid gap-3 grid-cols-2">
                        <button className="rounded-xl border-2 border-[color:var(--accent)] bg-[color:var(--muted)] px-4 py-6 text-center font-semibold">
                            <CreditCard className="h-6 w-6 mx-auto mb-2" />
                            Credit Card
                        </button>
                        <button className="rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-6 text-center font-semibold hover:border-[color:var(--accent)] transition">
                            <DollarSign className="h-6 w-6 mx-auto mb-2" />
                            PayPal
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Card Number</label>
                        <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                        />
                    </div>

                    <div className="grid gap-3 grid-cols-2">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Expiry</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">CVC</label>
                            <input
                                type="text"
                                placeholder="123"
                                className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)] px-4 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <Button variant="outline" onClick={() => setShowAddPaymentModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setShowAddPaymentModal(false)}>
                            Add Payment Method
                        </Button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
