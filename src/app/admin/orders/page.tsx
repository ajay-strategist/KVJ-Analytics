"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, RotateCcw, ShoppingCart } from "lucide-react";
import { DataTable, StatusBadge, RowActions, formatDateTime, formatCurrency, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface Order {
  id: string; student_name: string; organization?: string; course_title: string; amount: number;
  currency: string; razorpay_order_id: string; status: "pending" | "paid" | "failed" | "cancelled" | "refunded"; created_at: string;
}
interface OrderList { orders: Order[]; total: number }

const TONE: Record<Order["status"], "green" | "amber" | "red" | "slate"> = { paid: "green", pending: "amber", failed: "red", cancelled: "slate", refunded: "slate" };
const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const url = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (status) p.set("status", status);
    if (sort) { p.set("sort", sort.key); p.set("dir", sort.dir); }
    return `/api/admin/orders?${p.toString()}`;
  }, [page, status, sort]);

  const { data, loading, error, reload } = useAdminFetch<OrderList>(url, { onUnauthorized: () => router.push("/admin") });

  const setOrderStatus = async (o: Order, next: Order["status"]) => {
    await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: o.id, status: next }) });
    reload();
  };

  const columns: Column<Order>[] = [
    { key: "student_name", header: "Student", searchText: (r) => `${r.student_name} ${r.organization ?? ""}`, cell: (r) => <div><div className="font-semibold text-slate-800">{r.student_name}</div>{r.organization && <div className="text-[12px] text-slate-400">{r.organization}</div>}</div> },
    { key: "course_title", header: "Course", cell: (r) => r.course_title },
    { key: "amount", header: "Amount", align: "right", sortable: true, cell: (r) => formatCurrency(r.amount, r.currency === "INR" ? "₹" : r.currency + " ") },
    { key: "status", header: "Status", sortable: true, cell: (r) => <StatusBadge label={r.status} tone={TONE[r.status]} /> },
    { key: "razorpay_order_id", header: "Razorpay order", cell: (r) => <span className="font-mono text-[11px] text-slate-500">{r.razorpay_order_id}</span> },
    { key: "created_at", header: "Placed", sortable: true, cell: (r) => formatDateTime(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-brand" />Orders</h2>
        <p className="text-sm text-slate-500">Every Razorpay course order and its fulfilment status.</p>
      </div>

      <DataTable<Order>
        columns={columns}
        data={data?.orders ?? []}
        getRowId={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        manual
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onSortChange={(s) => { setSort(s); setPage(1); }}
        searchable={false}
        emptyTitle="No orders yet"
        emptyDescription="Course purchases will appear here."
        toolbar={
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/30">
            <option value="">All status</option>
            {["pending", "paid", "failed", "cancelled", "refunded"].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        }
        rowActions={(r) => (
          <RowActions actions={[
            { label: "Mark paid", icon: CheckCircle2, disabled: r.status === "paid", onClick: () => setOrderStatus(r, "paid") },
            { label: "Mark refunded", icon: RotateCcw, disabled: r.status !== "paid", onClick: () => setOrderStatus(r, "refunded") },
            { label: "Cancel", icon: XCircle, danger: true, disabled: r.status === "cancelled", onClick: () => setOrderStatus(r, "cancelled") },
          ]} />
        )}
      />
    </div>
  );
}
