"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
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

  const url = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (query) p.set("q", query);
    if (sort) { p.set("sort", sort.key); p.set("dir", sort.dir); }
    return `/api/admin/students?${p.toString()}`;
  }, [page, query, sort]);

  const { data, loading, error, reload } = useAdminFetch<StudentList>(url, { onUnauthorized: () => router.push("/admin") });

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
          ]} />
        )}
      />
    </div>
  );
}
