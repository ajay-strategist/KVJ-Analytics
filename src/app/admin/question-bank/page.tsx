"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { DataTable, StatusBadge, RowActions, formatDate, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";
import { Button } from "@/components/ui/Button";

interface Question {
  id: string;
  test_id?: string;
  type: string;
  stem: string;
  marks: number;
  config?: any;
  image_url?: string | null;
  test_title?: string;
  course_title?: string;
  created_at?: string;
}

const TYPE_LABEL: Record<string, string> = {
  single: "MCQ",
  multiple: "Multiple select",
  truefalse: "True / False",
  fillblank: "Fill in the blank",
  dragdrop: "Match the following",
  dragtable: "Drag to Table",
  pivot_table: "Pivot Table",
  sequence: "Ordering",
  matrix: "Matrix",
  code: "Code",
};
const TYPES = Object.keys(TYPE_LABEL);

export default function AdminQuestionBankPage() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<{ stem: string; marks: number; image_url: string }>({
    stem: "",
    marks: 1,
    image_url: "",
  });

  const url = useMemo(() => (type ? `/api/admin/question-bank?type=${type}` : "/api/admin/question-bank"), [type]);
  const { data, loading, error, reload } = useAdminFetch<{ questions: Question[] }>(url, {
    onUnauthorized: () => router.push("/admin"),
  });

  const handleStartEdit = (q: Question) => {
    setEditingQuestion(q);
    setEditForm({
      stem: q.stem || "",
      marks: q.marks ?? 1,
      image_url: q.image_url || "",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingQuestion.id,
          stem: editForm.stem,
          marks: editForm.marks,
          image_url: editForm.image_url || null,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to update question");
      setEditingQuestion(null);
      reload();
    } catch (err: any) {
      alert(err.message || "Failed to update question");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch("/api/admin/questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to delete question");
      reload();
    } catch (err: any) {
      alert(err.message || "Failed to delete question");
    }
  };

  const columns: Column<Question>[] = [
    {
      key: "stem",
      header: "Question",
      searchText: (r) => `${r.stem ?? ""} ${r.test_title || ""} ${r.course_title || ""}`,
      cell: (r) => (
        <div
          className="max-w-md truncate font-semibold text-slate-800"
          dangerouslySetInnerHTML={{ __html: r.stem || "(untitled)" }}
        />
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      cell: (r) => <StatusBadge label={TYPE_LABEL[r.type] || r.type} tone="cyan" />,
    },
    { key: "test_title", header: "Assessment", sortable: true, cell: (r) => r.test_title || "—" },
    { key: "course_title", header: "Course", sortable: true, cell: (r) => r.course_title || "—" },
    { key: "marks", header: "Marks", align: "center" },
    { key: "created_at", header: "Created", sortable: true, cell: (r) => (r.created_at ? formatDate(r.created_at) : "—") },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-brand" />
          Question Bank
        </h2>
        <p className="text-sm text-slate-500">
          Every question across all assessments — MCQ, multiple-select, true/false, fill-in-the-blank, matching, drag-to-table, pivot table, ordering, matrix and code.
        </p>
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
        rowActions={(r) => (
          <RowActions
            actions={[
              { label: "Edit Question", icon: Pencil, onClick: () => handleStartEdit(r) },
              { label: "Delete Question", icon: Trash2, danger: true, onClick: () => handleDelete(r.id) },
            ]}
          />
        )}
        toolbar={
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Filter by type"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        }
      />

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-brand" />
                Edit Question Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Question Type
                </label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                  {TYPE_LABEL[editingQuestion.type] || editingQuestion.type}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Question Prompt / Stem
                </label>
                <textarea
                  rows={4}
                  required
                  value={editForm.stem}
                  onChange={(e) => setEditForm({ ...editForm, stem: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand/30"
                  placeholder="Question prompt text or HTML..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Marks Assigned
                  </label>
                  <input
                    type="number"
                    required
                    min={0.5}
                    step="any"
                    value={editForm.marks}
                    onChange={(e) => setEditForm({ ...editForm, marks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editForm.image_url}
                    onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <Button type="button" variant="secondary" onClick={() => setEditingQuestion(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-brand text-white font-bold">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
