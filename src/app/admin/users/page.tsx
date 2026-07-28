"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { DataTable, StatusBadge, AvatarCell, RowActions, formatDate, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";
import { useForm, TextField, SelectField } from "@/components/admin/FormKit";
import { required, email as emailRule, type FieldSchema } from "@/lib/admin/validators";

interface AdminUser {
  id: string; name: string; email: string; role: string; status: string; created_at: string; last_active_at?: string;
}
interface UserList { users: AdminUser[]; total: number }

const ROLES = [
  { label: "Super Admin", value: "super_admin" }, { label: "Admin", value: "admin" },
  { label: "Sub Admin", value: "sub_admin" }, { label: "Trainer", value: "trainer" },
  { label: "College Coordinator", value: "college_coordinator" }, { label: "Corporate User", value: "corporate_user" },
];
const STATUSES = [{ label: "Active", value: "active" }, { label: "Invited", value: "invited" }, { label: "Suspended", value: "suspended" }];
const ROLE_TONE: Record<string, "green" | "blue" | "cyan" | "amber" | "slate"> = {
  super_admin: "amber", admin: "cyan", sub_admin: "blue", trainer: "green", college_coordinator: "slate", corporate_user: "slate",
};

const schema: FieldSchema = { name: [required("Name is required")], email: [required("Email is required"), emailRule()] };
const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [banner, setBanner] = useState<{ ok: boolean; msg: string } | null>(null);

  const url = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (query) p.set("q", query);
    if (sort) { p.set("sort", sort.key); p.set("dir", sort.dir); }
    return `/api/admin/users?${p.toString()}`;
  }, [page, query, sort]);

  const { data, loading, error, reload } = useAdminFetch<UserList>(url, { onUnauthorized: () => router.push("/admin") });

  const form = useForm<Record<string, unknown>>({
    initial: { name: "", email: "", role: "admin", status: "active" },
    schema,
    onSubmit: async (values) => {
      setBanner(null);
      try {
        const res = await fetch("/api/admin/users", {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editing ? { id: editing.id, ...values } : values),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Save failed");
        setModalOpen(false); reload();
      } catch (e) { setBanner({ ok: false, msg: e instanceof Error ? e.message : "Save failed" }); }
    },
  });

  const openAdd = () => { form.reset({ name: "", email: "", role: "admin", status: "active" }); setEditing(null); setBanner(null); setModalOpen(true); };
  const openEdit = (u: AdminUser) => { form.reset({ name: u.name, email: u.email, role: u.role, status: u.status }); setEditing(u); setBanner(null); setModalOpen(true); };
  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`Remove ${u.name} from admin staff?`)) return;
    await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id }) });
    reload();
  };

  const columns: Column<AdminUser>[] = [
    { key: "name", header: "Staff member", sortable: true, searchText: (r) => `${r.name} ${r.email}`, cell: (r) => <AvatarCell name={r.name} sub={r.email} /> },
    { key: "role", header: "Role", sortable: true, cell: (r) => <StatusBadge label={ROLES.find((x) => x.value === r.role)?.label || r.role} tone={ROLE_TONE[r.role] || "slate"} /> },
    { key: "status", header: "Status", sortable: true, cell: (r) => <StatusBadge label={r.status} tone={r.status === "active" ? "green" : r.status === "invited" ? "amber" : "red"} /> },
    { key: "created_at", header: "Added", sortable: true, cell: (r) => formatDate(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Users & Roles</h2>
          <p className="text-sm text-slate-500">Internal staff directory and role assignment.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500">
          <Plus className="h-4 w-4" />Add staff
        </button>
      </div>
      <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-800">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>This directory records staff and their intended role. Sign-in still uses the single shared admin password — per-user login and permission enforcement is a planned follow-up (doc 013).</span>
      </div>

      <DataTable<AdminUser>
        columns={columns}
        data={data?.users ?? []}
        getRowId={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        manual
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onQueryChange={(q) => { setQuery(q); setPage(1); }}
        onSortChange={(s) => { setSort(s); setPage(1); }}
        searchPlaceholder="Search name or email…"
        emptyTitle="No staff added yet"
        emptyDescription="Add your team members and assign roles."
        rowActions={(r) => (
          <RowActions actions={[
            { label: "Edit", icon: Pencil, onClick: () => openEdit(r) },
            { label: "Remove", icon: Trash2, danger: true, onClick: () => handleDelete(r) },
          ]} />
        )}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">{editing ? "Edit staff member" : "Add staff member"}</h3>
              <button onClick={() => setModalOpen(false)} aria-label="Close"><X className="h-5 w-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            {banner && (
              <div className={`mb-4 flex items-center gap-2 rounded-lg border p-2.5 text-[13px] font-semibold ${banner.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                {banner.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{banner.msg}
              </div>
            )}
            <div className="space-y-4">
              <TextField form={form} name="name" label="Full name" required placeholder="Jane Doe" />
              <TextField form={form} name="email" type="email" label="Email" required placeholder="jane@kvjanalytics.com" />
              <SelectField form={form} name="role" label="Role" options={ROLES} />
              <SelectField form={form} name="status" label="Status" options={STATUSES} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">Cancel</button>
              <button onClick={() => form.handleSubmit()} disabled={form.isSubmitting}
                className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 disabled:opacity-60">
                {form.isSubmitting ? "Saving…" : editing ? "Save changes" : "Add staff"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
