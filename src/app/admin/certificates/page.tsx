"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Copy, Ban, RotateCcw, Trash2, Award, AlertCircle, CheckCircle2 } from "lucide-react";
import { DataTable, StatusBadge, RowActions, formatDate, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";
import { useForm, TextField } from "@/components/admin/FormKit";
import { required, email as emailRule, slug as slugRule, type FieldSchema } from "@/lib/admin/validators";

interface Certificate {
  id: string; student_name: string; course_slug: string; certificate_number: string;
  verify_code: string; status: "issued" | "revoked"; issued_at: string;
}

const schema: FieldSchema = {
  email: [required("Student email is required"), emailRule()],
  course_slug: [required("Course slug is required"), slugRule()],
};

export default function AdminCertificatesPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useAdminFetch<{ certificates: Certificate[] }>("/api/admin/certificates", { onUnauthorized: () => router.push("/admin") });
  const [modalOpen, setModalOpen] = useState(false);
  const [banner, setBanner] = useState<{ ok: boolean; msg: string } | null>(null);

  const form = useForm<Record<string, unknown>>({
    initial: { email: "", course_slug: "" },
    schema,
    onSubmit: async (values) => {
      setBanner(null);
      try {
        const res = await fetch("/api/admin/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Could not issue certificate");
        setModalOpen(false); form.reset({ email: "", course_slug: "" }); reload();
      } catch (e) { setBanner({ ok: false, msg: e instanceof Error ? e.message : "Failed" }); }
    },
  });

  const setStatus = async (c: Certificate, status: "issued" | "revoked") => {
    await fetch("/api/admin/certificates", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id, status }) });
    reload();
  };
  const remove = async (c: Certificate) => {
    if (!confirm(`Delete certificate ${c.certificate_number}?`)) return;
    await fetch("/api/admin/certificates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id }) });
    reload();
  };
  const copyLink = (c: Certificate) => navigator.clipboard.writeText(`${window.location.origin}/certificates/verify/${c.verify_code}`);

  const columns: Column<Certificate>[] = [
    { key: "certificate_number", header: "Certificate #", cell: (r) => <span className="font-mono text-[12px] font-semibold text-slate-800">{r.certificate_number}</span> },
    { key: "student_name", header: "Student", searchText: (r) => r.student_name, cell: (r) => r.student_name },
    { key: "course_slug", header: "Course", cell: (r) => r.course_slug },
    { key: "status", header: "Status", cell: (r) => <StatusBadge label={r.status} tone={r.status === "issued" ? "green" : "red"} /> },
    { key: "issued_at", header: "Issued", sortable: true, cell: (r) => formatDate(r.issued_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Award className="h-5 w-5 text-brand" />Certificates</h2>
          <p className="text-sm text-slate-500">Issue and verify course-completion certificates.</p>
        </div>
        <button onClick={() => { setBanner(null); setModalOpen(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500">
          <Plus className="h-4 w-4" />Issue certificate
        </button>
      </div>

      <DataTable<Certificate>
        columns={columns}
        data={data?.certificates ?? []}
        getRowId={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        searchPlaceholder="Search student, course, certificate #…"
        emptyTitle="No certificates issued yet"
        emptyDescription="Issue a certificate once a student completes a course."
        rowActions={(r) => (
          <RowActions actions={[
            { label: "Copy verify link", icon: Copy, onClick: () => copyLink(r) },
            r.status === "issued"
              ? { label: "Revoke", icon: Ban, danger: true, onClick: () => setStatus(r, "revoked") }
              : { label: "Reinstate", icon: RotateCcw, onClick: () => setStatus(r, "issued") },
            { label: "Delete", icon: Trash2, danger: true, onClick: () => remove(r) },
          ]} />
        )}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">Issue certificate</h3>
              <button onClick={() => setModalOpen(false)} aria-label="Close"><X className="h-5 w-5 text-slate-400 hover:text-slate-700" /></button>
            </div>
            {banner && (
              <div className={`mb-4 flex items-center gap-2 rounded-lg border p-2.5 text-[13px] font-semibold ${banner.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                {banner.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{banner.msg}
              </div>
            )}
            <div className="space-y-4">
              <TextField form={form} name="email" type="email" label="Student email" required placeholder="student@example.com" help="Must match a registered student account." />
              <TextField form={form} name="course_slug" label="Course slug" required placeholder="advanced-excel-analytics" />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">Cancel</button>
              <button onClick={() => form.handleSubmit()} disabled={form.isSubmitting}
                className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 disabled:opacity-60">
                {form.isSubmitting ? "Issuing…" : "Issue certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
