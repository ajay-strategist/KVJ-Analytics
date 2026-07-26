"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CreditCard, IndianRupee, TrendingUp, RotateCcw, Clock } from "lucide-react";
import { DataTable, StatusBadge, formatDateTime, formatCurrency, type Column } from "@/components/admin/DataTable";
import { StatWidget } from "@/components/admin/widgets";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface Txn { id: string; student_name: string; course_title: string; amount: number; currency: string; status: "paid" | "refunded"; razorpay_payment_id: string; created_at: string; }
interface Totals { totalRevenue: number; monthRevenue: number; refundedAmount: number; paidCount: number; pendingCount: number; failedCount: number; }
interface PaymentsData { totals: Totals; transactions: Txn[] }

export default function AdminPaymentsPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useAdminFetch<PaymentsData>("/api/admin/payments", { onUnauthorized: () => router.push("/admin") });
  const t = data?.totals;

  const columns: Column<Txn>[] = [
    { key: "student_name", header: "Student", searchText: (r) => r.student_name },
    { key: "course_title", header: "Course" },
    { key: "amount", header: "Amount", align: "right", sortable: true, sortValue: (r) => r.amount, cell: (r) => formatCurrency(r.amount, r.currency === "INR" ? "₹" : r.currency + " ") },
    { key: "status", header: "Status", cell: (r) => <StatusBadge label={r.status} tone={r.status === "paid" ? "green" : "slate"} /> },
    { key: "razorpay_payment_id", header: "Payment ID", cell: (r) => <span className="font-mono text-[11px] text-slate-500">{r.razorpay_payment_id || "—"}</span> },
    { key: "created_at", header: "Date", sortable: true, sortValue: (r) => r.created_at, cell: (r) => formatDateTime(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><CreditCard className="h-5 w-5 text-brand" />Payments</h2>
        <p className="text-sm text-slate-500">Revenue reconciliation across all Razorpay transactions.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatWidget label="Total revenue" value={t ? `₹${t.totalRevenue.toLocaleString("en-IN")}` : "—"} icon={IndianRupee} loading={loading} tone="emerald" />
        <StatWidget label="This month" value={t ? `₹${t.monthRevenue.toLocaleString("en-IN")}` : "—"} icon={TrendingUp} loading={loading} tone="cyan" />
        <StatWidget label="Refunded" value={t ? `₹${t.refundedAmount.toLocaleString("en-IN")}` : "—"} icon={RotateCcw} loading={loading} tone="amber" />
        <StatWidget label="Pending / Failed" value={t ? `${t.pendingCount} / ${t.failedCount}` : "—"} icon={Clock} loading={loading} href="/admin/orders" tone="rose" />
      </div>

      <DataTable<Txn>
        columns={columns}
        data={data?.transactions ?? []}
        getRowId={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        searchPlaceholder="Search student or course…"
        emptyTitle="No transactions yet"
        emptyDescription="Paid or refunded orders will appear here."
      />
    </div>
  );
}
