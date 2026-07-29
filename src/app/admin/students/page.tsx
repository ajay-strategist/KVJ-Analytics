"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, KeyRound, X } from "lucide-react";
import { DataTable, StatusBadge, AvatarCell, RowActions, formatDate, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface Student {
  id: string; name: string; full_name?: string; organization?: string; phone?: string;
  profession?: string; account_type?: string; enrollment_count: number; created_at: string;
}
interface StudentList { students: Student[]; total: number }

const PAGE_SIZE = 10;

export default function AdminStudentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const [resetStudent, setResetStudent] = useState<Student | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const url = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (query) p.set("q", query);
    if (sort) { p.set("sort", sort.key); p.set("dir", sort.dir); }
    return `/api/admin/students?${p.toString()}`;
  }, [page, query, sort]);

  const { data, loading, error, reload } = useAdminFetch<StudentList>(url, { onUnauthorized: () => router.push("/admin") });

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetStudent) return;
    setResetLoading(true);
    setResetError("");
    setResetSuccess(false);

    try {
      const res = await fetch(`/api/admin/students/${resetStudent.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setResetSuccess(true);
      setTimeout(() => {
        setResetStudent(null);
        setNewPassword("");
        setResetSuccess(false);
      }, 2000);
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const columns: Column<Student>[] = [
    {
      key: "name", header: "Student", sortable: true, sortValue: (r) => r.name, searchText: (r) => `${r.name} ${r.full_name ?? ""}`,
      cell: (r) => <AvatarCell name={r.full_name || r.name} sub={r.phone} />,
    },
    { key: "organization", header: "Organization", sortable: true, cell: (r) => r.organization || "—" },
    { key: "profession", header: "Profession", cell: (r) => r.profession ? r.profession.replace("_", " ") : "—" },
    { key: "account_type", header: "Account", sortable: true, cell: (r) => <StatusBadge label={r.account_type || "individual"} tone={r.account_type === "corporate" ? "blue" : r.account_type === "college" ? "cyan" : "slate"} /> },
    { key: "enrollment_count", header: "Enrollments", align: "center", cell: (r) => <span className="font-semibold text-slate-700">{r.enrollment_count}</span> },
    { key: "created_at", header: "Joined", sortable: true, cell: (r) => formatDate(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">Students</h2>
        <p className="text-sm text-slate-500">Every enrolled learner, synced from Supabase Auth profiles.</p>
      </div>

      <DataTable<Student>
        columns={columns}
        data={data?.students ?? []}
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
        searchPlaceholder="Search name, organization, phone…"
        emptyTitle="No students yet"
        emptyDescription="Students appear here once they sign up on the site."
        rowActions={(r) => (
          <RowActions actions={[
            { label: "View enrollments", icon: Eye, onClick: () => router.push(`/admin/enrollments`) },
            { label: "Reset password", icon: KeyRound, onClick: () => { setResetStudent(r); setNewPassword(""); setResetError(""); setResetSuccess(false); } },
          ]} />
        )}
      />

      {resetStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Reset Password</h3>
              <button onClick={() => setResetStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Enter a new password for <strong>{resetStudent.full_name || resetStudent.name}</strong>.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="text"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter at least 6 characters"
                  />
                </div>

                {resetError && (
                  <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
                    {resetError}
                  </div>
                )}
                
                {resetSuccess && (
                  <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    Password successfully updated!
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResetStudent(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading || !newPassword || resetSuccess}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                >
                  {resetLoading ? "Updating..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
