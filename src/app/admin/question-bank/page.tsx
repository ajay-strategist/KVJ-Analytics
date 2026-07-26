"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { DataTable, StatusBadge, formatDate, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface Question {
  id: string; type: string; stem: string; marks: number; test_title: string; course_title: string; created_at: string;
}

const TYPE_LABEL: Record<string, string> = {
  single: "MCQ", multiple: "Multiple select", truefalse: "True / False", fillblank: "Fill in the blank",
  dragdrop: "Match the following", sequence: "Ordering", matrix: "Matrix", code: "Code",
};
const TYPES = Object.keys(TYPE_LABEL);

export default function AdminQuestionBankPage() {
  const router = useRouter();
  const [type, setType] = useState("");
  const url = useMemo(() => (type ? `/api/admin/question-bank?type=${type}` : "/api/admin/question-bank"), [type]);
  const { data, loading, error, reload } = useAdminFetch<{ questions: Question[] }>(url, { onUnauthorized: () => router.push("/admin") });

  const columns: Column<Question>[] = [
    { key: "stem", header: "Question", searchText: (r) => `${r.stem ?? ""} ${r.test_title} ${r.course_title}`, cell: (r) => <div className="max-w-md truncate font-semibold text-slate-800">{r.stem || "(untitled)"}</div> },
    { key: "type", header: "Type", sortable: true, cell: (r) => <StatusBadge label={TYPE_LABEL[r.type] || r.type} tone="cyan" /> },
    { key: "test_title", header: "Assessment", sortable: true, cell: (r) => r.test_title },
    { key: "course_title", header: "Course", sortable: true, cell: (r) => r.course_title },
    { key: "marks", header: "Marks", align: "center" },
    { key: "created_at", header: "Created", sortable: true, cell: (r) => formatDate(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-brand" />Question Bank</h2>
        <p className="text-sm text-slate-500">Every question across all assessments — MCQ, multiple-select, true/false, fill-in-the-blank, matching, ordering, matrix and code.</p>
      </div>

      <DataTable<Question>
        columns={columns}
        data={data?.questions ?? []}
        getRowId={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        searchPlaceholder="Search question, test or course…"
        emptyTitle="No questions yet"
        emptyDescription="Build questions inside a course's assessment editor."
        toolbar={
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/30">
            <option value="">All types</option>
            {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
          </select>
        }
      />
    </div>
  );
}
