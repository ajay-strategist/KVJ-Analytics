"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, KeyRound, X, Plus, BookPlus, GraduationCap, CheckCircle } from "lucide-react";
import { DataTable, StatusBadge, AvatarCell, RowActions, formatDate, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface Student {
  id: string; name: string; full_name?: string; organization?: string; phone?: string;
  email?: string; profession?: string; account_type?: string; batch_name?: string; enrollment_count: number; created_at: string;
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

  // Direct Enroll modal state
  const [enrollStudent, setEnrollStudent] = useState<Student | null>(null);
  const [enrollCourseId, setEnrollCourseId] = useState("");
  const [enrollBatchId, setEnrollBatchId] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [courses, setCourses] = useState<{id: string, title: string, slug: string}[]>([]);
  const [batches, setBatches] = useState<{id: string, college_name: string, course_slug: string}[]>([]);
  const [addForm, setAddForm] = useState({
    name: "", email: "", phone: "", password: "", account_type: "individual", course_id: "", batch_id: ""
  });

  const url = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (query) p.set("q", query);
    if (sort) { p.set("sort", sort.key); p.set("dir", sort.dir); }
    return `/api/admin/students?${p.toString()}`;
  }, [page, query, sort]);

  const { data, loading, error, reload } = useAdminFetch<StudentList>(url, { onUnauthorized: () => router.push("/admin") });

  const loadCoursesAndBatches = async () => {
    try {
      const [cRes, bRes] = await Promise.all([
        fetch("/api/admin/courses"),
        fetch("/api/admin/batches")
      ]);
      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData.courses) setCourses(cData.courses);
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        if (bData.batches) setBatches(bData.batches);
      }
    } catch (e) {
      console.error("Failed to load options:", e);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/students/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm)
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to add student");
      setShowAddModal(false);
      setAddForm({ name: "", email: "", phone: "", password: "", account_type: "individual", course_id: "", batch_id: "" });
      reload();
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleDirectEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollStudent || !enrollCourseId) return;
    setEnrollLoading(true);
    setEnrollError("");
    setEnrollSuccess("");

    try {
      const res = await fetch("/api/admin/students/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: enrollStudent.id,
          course_id: enrollCourseId,
          batch_id: enrollBatchId || undefined,
        })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to enroll student.");
      setEnrollSuccess(d.message || "Student successfully enrolled!");
      setTimeout(() => {
        setEnrollStudent(null);
        setEnrollCourseId("");
        setEnrollBatchId("");
        setEnrollSuccess("");
        reload();
      }, 1500);
    } catch (err: any) {
      setEnrollError(err.message);
    } finally {
      setEnrollLoading(false);
    }
  };

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
      cell: (r) => <AvatarCell name={r.full_name || r.name} sub={r.phone || r.email} />,
    },
    { key: "batch_name", header: "Batch Name", sortable: true, cell: (r) => (
      r.batch_name ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <GraduationCap className="w-3.5 h-3.5" /> {r.batch_name}
        </span>
      ) : <span className="text-slate-400">—</span>
    )},
    { key: "organization", header: "Organization / College", sortable: true, cell: (r) => r.organization || "—" },
    { key: "profession", header: "Profession", cell: (r) => r.profession ? r.profession.replace("_", " ") : "—" },
    { key: "account_type", header: "Account", sortable: true, cell: (r) => <StatusBadge label={r.account_type || "individual"} tone={r.account_type === "corporate" ? "blue" : r.account_type === "college" ? "cyan" : r.account_type === "one_to_one" ? "purple" : "slate"} /> },
    { key: "enrollment_count", header: "Enrollments", align: "center", cell: (r) => <span className="font-semibold text-slate-700">{r.enrollment_count}</span> },
    { key: "created_at", header: "Joined", sortable: true, cell: (r) => formatDate(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Students</h2>
          <p className="text-sm text-slate-500">Every enrolled learner, synced from Supabase Auth profiles.</p>
        </div>
        <button
          onClick={() => { setShowAddModal(true); loadCoursesAndBatches(); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
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
        searchPlaceholder="Search name, organization, batch, phone…"
        emptyTitle="No students yet"
        emptyDescription="Students appear here once they sign up on the site."
        rowActions={(r) => (
          <RowActions actions={[
            { label: "View enrollments", icon: Eye, onClick: () => router.push(`/admin/enrollments`) },
            { label: "Enroll in Course", icon: BookPlus, onClick: () => { setEnrollStudent(r); loadCoursesAndBatches(); setEnrollError(""); setEnrollSuccess(""); } },
            { label: "Reset password", icon: KeyRound, onClick: () => { setResetStudent(r); setNewPassword(""); setResetError(""); setResetSuccess(false); } },
          ]} />
        )}
      />

      {/* Direct Course Enrollment Modal */}
      {enrollStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <BookPlus className="w-5 h-5 text-blue-600" />
                Enroll Student in Course
              </h3>
              <button onClick={() => setEnrollStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDirectEnrollSubmit} className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Enrolling <strong>{enrollStudent.full_name || enrollStudent.name}</strong> ({enrollStudent.email || enrollStudent.phone || "Student"}).
              </p>

              {enrollError && (
                <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100 mb-4">
                  {enrollError}
                </div>
              )}
              {enrollSuccess && (
                <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> {enrollSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Select Course *
                  </label>
                  <select
                    required
                    value={enrollCourseId}
                    onChange={(e) => setEnrollCourseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Associate with Batch (Optional)
                  </label>
                  <select
                    value={enrollBatchId}
                    onChange={(e) => setEnrollBatchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">-- No Batch Association --</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>{b.college_name} ({b.course_slug})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEnrollStudent(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrollLoading || !enrollCourseId || !!enrollSuccess}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  {enrollLoading ? "Enrolling..." : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-slate-800">Add New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                  <input type="text" required value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Student's full name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input type="email" required value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="student@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                  <input type="text" required value={addForm.phone} onChange={e => setAddForm({...addForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. 9876543210 or +919876543210" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Initial Password</label>
                  <input type="text" required minLength={6} value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="At least 6 characters" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account Type</label>
                  <select value={addForm.account_type} onChange={e => setAddForm({...addForm, account_type: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option value="individual">Individual</option>
                    <option value="college">College</option>
                    <option value="corporate">Corporate / Employee</option>
                    <option value="one_to_one">One to One</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Enroll in Course (Optional)</label>
                  <select value={addForm.course_id} onChange={e => setAddForm({...addForm, course_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option value="">-- No Course Enrollment --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Assign to Batch (Optional)</label>
                  <select value={addForm.batch_id} onChange={e => setAddForm({...addForm, batch_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option value="">-- No Batch --</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.college_name} ({b.course_slug})</option>)}
                  </select>
                </div>

                {addError && <div className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg border border-rose-100">{addError}</div>}
              </div>

              <div className="mt-6 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={addLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors">
                  {addLoading ? "Saving..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

