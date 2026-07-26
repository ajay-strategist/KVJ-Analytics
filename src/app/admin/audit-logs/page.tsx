"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollText } from "lucide-react";
import { DataTable, StatusBadge, formatDateTime, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface LogEntry { id: string; actor: string; action: string; entity_type: string; entity_id: string | null; meta: Record<string, unknown>; created_at: string; }
interface LogList { logs: LogEntry[]; total: number }

const ENTITY_TYPES = ["admin_user", "certificate", "order", "media_library"];
const PAGE_SIZE = 20;

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [entityType, setEntityType] = useState("");

  const url = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (entityType) p.set("entity_type", entityType);
    return `/api/admin/audit-logs?${p.toString()}`;
  }, [page, entityType]);

  const { data, loading, error, reload } = useAdminFetch<LogList>(url, { onUnauthorized: () => router.push("/admin") });

  const columns: Column<LogEntry>[] = [
    { key: "action", header: "Action", cell: (r) => <StatusBadge label={r.action} tone={r.action.includes("delete") ? "red" : r.action.includes("revoke") ? "amber" : "cyan"} /> },
    { key: "entity_type", header: "Entity", cell: (r) => <span className="capitalize">{r.entity_type.replace("_", " ")}</span> },
    { key: "entity_id", header: "Entity ID", cell: (r) => <span className="font-mono text-[11px] text-slate-500">{r.entity_id || "—"}</span> },
    { key: "actor", header: "Actor" },
    { key: "meta", header: "Detail", cell: (r) => <span className="truncate text-[12px] text-slate-500">{Object.keys(r.meta || {}).length ? JSON.stringify(r.meta) : "—"}</span> },
    { key: "created_at", header: "When", sortable: true, cell: (r) => formatDateTime(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><ScrollText className="h-5 w-5 text-brand" />Audit Logs</h2>
        <p className="text-sm text-slate-500">Trail of sensitive admin actions (staff, certificates, orders, media). Login/content-edit logging is a future extension.</p>
      </div>

      <DataTable<LogEntry>
        columns={columns}
        data={data?.logs ?? []}
        getRowId={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        manual
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        searchable={false}
        emptyTitle="No audit events yet"
        emptyDescription="Sensitive actions (issuing certificates, staff changes, order status) will be recorded here."
        toolbar={
          <select value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }} aria-label="Filter by entity"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/30">
            <option value="">All entities</option>
            {ENTITY_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
          </select>
        }
      />
    </div>
  );
}
