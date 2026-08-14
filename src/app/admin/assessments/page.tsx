"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ClipboardList } from "lucide-react";
import { DataTable, StatusBadge, RowActions, formatDate, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface Assessment {
  id: string; title: string; course_id: string; course_title: string; course_slug: string | null;
  duration_mins: number; pass_mark: number; question_count: number; created_at: string;
}

export default function AdminAssessmentsPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useAdminFetch<{ assessments: Assessment[] }>("/api/admin/assessments", { onUnauthorized: () => router.push("/admin") });

  const columns: Column<Assessment>[] = [
    { key: "title", header: "Assessment", sortable: true, sortValue: (r) => r.title, searchText: (r) => `${r.title} ${r.course_title}`, cell: (r) => <div className="font-semibold text-slate-800">{r.title}</div> },
    { key: "course_title", header: "Course", sortable: true, cell: (r) => r.course_title },
    { key: "question_count", header: "Questions", align: "center", cell: (r) => <StatusBadge label={String(r.question_count)} tone={r.question_count > 0 ? "cyan" : "amber"} /> },
    { key: "duration_mins", header: "Duration", cell: (r) => `${r.duration_mins ?? 0} min` },
    { key: "pass_mark", header: "Pass %", cell: (r) => `${r.pass_mark ?? 84}%` },
    { key: "created_at", header: "Created", sortable: true, cell: (r) => formatDate(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><ClipboardList className="h-5 w-5 text-brand" />Assessments</h2>
        <p className="text-sm text-slate-500">Every mock test across all courses. Open a course to build or edit its questions.</p>
      </div>

      <DataTable<Assessment>
        columns={columns}
        data={data?.assessments ?? []}
        getRowId={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        searchPlaceholder="Search assessment or course…"
        emptyTitle="No assessments yet"
        emptyDescription="Mock tests created in a course's builder will appear here."
        rowActions={(r) => (
          <RowActions actions={[
            { label: "Open course builder", icon: ExternalLink, onClick: () => router.push(`/admin/courses/${r.course_id}`) },
          ]} />
        )}
      />
    </div>
  );
}
