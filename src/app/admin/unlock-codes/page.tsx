"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle, Key, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Course {
  id: string;
  title: string;
}

interface UnlockCode {
  id: string;
  code: string;
  course_id: string | null;
  courses?: { title: string } | null;
  batch_label: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
}

const EMPTY_FORM = {
  code: "",
  course_id: "",
  batch_label: "",
  max_uses: 10,
  expires_at: "",
  is_active: true,
};

const NAV_TABS = [
  { label: "Leads Inbox",          href: "/admin/leads" },
  { label: "College Batches",      href: "/admin/batches" },
  { label: "Enrollments",          href: "/admin/enrollments" },
  { label: "Clients",              href: "/admin/clients" },
  { label: "Testimonials",         href: "/admin/testimonials" },
  { label: "Case Studies",         href: "/admin/case-studies" },
  { label: "Team",                 href: "/admin/team" },
  { label: "Website Content",      href: "/admin/content" },
  { label: "Courses",              href: "/admin/courses" },
  { label: "Categories",           href: "/admin/categories" },
  { label: "Unlock Codes",         href: "/admin/unlock-codes" },
  { label: "Internships",          href: "/admin/internships" },
  { label: "Jobs",                 href: "/admin/jobs" },
  { label: "Blog", href: "/admin/blog" },
  { label: "Inquiries",            href: "/admin/inquiries" },
  { label: "Applications",         href: "/admin/applications" },
];

export default function AdminUnlockCodesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [codes, setCodes] = useState<UnlockCode[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCodesAndCourses();
  }, []);

  const fetchCodesAndCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const [codesRes, coursesRes] = await Promise.all([
        fetch("/api/admin/unlock-codes"),
        fetch("/api/admin/courses")
      ]);

      if (codesRes.status === 401 || coursesRes.status === 401) {
        router.push("/admin");
        return;
      }

      const codesData = await codesRes.json();
      const coursesData = await coursesRes.json();

      if (!codesRes.ok) throw new Error(codesData.error || "Failed to load unlock codes");
      if (!coursesRes.ok) throw new Error(coursesData.error || "Failed to load courses");

      setCodes(codesData.codes || []);
      setCourses(coursesData.courses || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch unlock codes.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || form.code.length !== 6 || !form.batch_label.trim()) {
      alert("Unlock code must be exactly 6 digits, and batch label is required.");
      return;
    }
    setSaving(true);

    // Map empty course_id string to null
    const submitBody = {
      ...form,
      course_id: form.course_id === "" ? null : form.course_id,
      expires_at: form.expires_at === "" ? null : new Date(form.expires_at).toISOString(),
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/unlock-codes/${editingId}` : "/api/admin/unlock-codes";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitBody),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchCodesAndCourses();
    } catch (e: any) {
      alert(e.message || "Failed to save unlock code.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (code: UnlockCode) => {
    setEditingId(code.id);
    setForm({
      code: code.code,
      course_id: code.course_id || "",
      batch_label: code.batch_label,
      max_uses: code.max_uses,
      expires_at: code.expires_at ? new Date(code.expires_at).toISOString().slice(0, 16) : "",
      is_active: code.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this unlock code? Enrolled students will not be impacted, but new students cannot use this passcode.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/unlock-codes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete unlock code.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-8 text-ink">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-ink">Admin Dashboard</h1>
            <p className="text-xs text-slate mt-1.5 font-medium">Manage batch passcodes and training access unlocks.</p>
          </div>
          <Button
            href="/"
            className="px-4 py-2 border border-line text-slate hover:text-ink text-xs font-bold"
          >
            Launch Main Website
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-line">
          {NAV_TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                pathname === tab.href
                  ? "border-brand text-brand font-bold"
                  : "border-transparent text-slate hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2">
            <Key className="w-5 h-5 text-brand" />
            Unlock Passcodes ({codes.length})
          </h2>
          <Button
            onClick={() => {
              setForm(EMPTY_FORM);
              setEditingId(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-brand text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Passcode
          </Button>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Loading / List Grid */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : codes.length === 0 ? (
          <div className="p-16 border-dashed border-2 border-line text-center text-slate">
            No unlock passcodes found in the database.
          </div>
        ) : (
          <div className="bg-white border border-line rounded-card overflow-hidden shadow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                  <th className="p-4">Passcode</th>
                  <th className="p-4">Cohort Batch / Label</th>
                  <th className="p-4">Linked Program / Course</th>
                  <th className="p-4">Usage Tracker</th>
                  <th className="p-4">Expiration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {codes.map((c) => {
                  const hasExpired = c.expires_at && new Date(c.expires_at) < new Date();
                  const formatExpiry = c.expires_at ? new Date(c.expires_at).toLocaleDateString("en-IN") : "Never";

                  return (
                    <tr key={c.id} className="hover:bg-surface/20 transition-colors">
                      {/* Code */}
                      <td className="p-4 font-mono font-bold text-brand tracking-wider text-base">{c.code}</td>
                      
                      {/* Batch label */}
                      <td className="p-4 font-semibold text-ink">{c.batch_label}</td>

                      {/* Course */}
                      <td className="p-4 text-slate font-medium">{c.courses?.title || "Universal / Site-wide"}</td>

                      {/* Uses */}
                      <td className="p-4">
                        <div className="text-ink font-semibold">{c.used_count} / {c.max_uses}</div>
                        <div className="w-20 bg-slate/10 h-1 mt-1 rounded overflow-hidden">
                          <div className="bg-brand h-full" style={{ width: `${Math.min((c.used_count / c.max_uses) * 100, 100)}%` }} />
                        </div>
                      </td>

                      {/* Expiration */}
                      <td className={`p-4 font-medium ${hasExpired ? "text-error" : "text-slate"}`}>
                        {formatExpiry}
                        {hasExpired && <span className="text-[9px] block uppercase font-bold text-error">Expired</span>}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          c.is_active && !hasExpired ? "bg-success/10 text-success border-success/30" : "bg-slate/10 text-slate border-line"
                        }`}>
                          {c.is_active && !hasExpired ? "Active" : "Disabled"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1.5 border border-line rounded hover:bg-surface text-slate hover:text-brand"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            disabled={deletingId === c.id}
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 border border-line rounded hover:bg-surface text-error disabled:opacity-30"
                          >
                            {deletingId === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-line rounded-card max-w-lg w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-slate hover:text-ink font-bold"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold font-display text-ink mb-6">
                {editingId ? "Modify Unlock Passcode" : "Create Unlock Passcode"}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Passcode (6 Digits) *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={form.code}
                      onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.replace(/\D/g, "") }))}
                      placeholder="e.g. 981240"
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm font-mono tracking-widest text-center font-bold text-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Max Allowed Uses *
                    </label>
                    <input
                      type="number"
                      required
                      value={form.max_uses}
                      onChange={(e) => setForm((prev) => ({ ...prev, max_uses: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Batch Label / College Cohort *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.batch_label}
                    onChange={(e) => setForm((prev) => ({ ...prev, batch_label: e.target.value }))}
                    placeholder="e.g. Cochin IT - CSE A - 2026"
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Linked Course / Syllabus
                  </label>
                  <select
                    value={form.course_id}
                    onChange={(e) => setForm((prev) => ({ ...prev, course_id: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                  >
                    <option value="">Universal / Unlocks Any course (Site-wide)</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Passcode Expiration (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm((prev) => ({ ...prev, expires_at: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded text-brand border-line"
                  />
                  <label htmlFor="is_active" className="text-xs font-bold uppercase tracking-wider text-slate">
                    Passcode Enabled
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-brand text-white font-bold flex items-center justify-center"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Passcode"}
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
