"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
  BookOpen,
  LogOut,
  FolderOpen,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Course {
  id: string;
  slug: string;
  title: string;
  segment: "corporate" | "college";
  summary: string;
  introduction: string;
  thumbnail_url: string;
  price_inr: number;
  is_paid: boolean;
  display_order: number;
  created_at: string;
}

const EMPTY: Omit<Course, "id" | "created_at"> = {
  slug: "",
  title: "",
  segment: "college",
  summary: "",
  introduction: "",
  thumbnail_url: "",
  price_inr: 0,
  is_paid: false,
  display_order: 0,
};

const NAV_TABS = [
  { label: "Leads Inbox",     href: "/admin/leads" },
  { label: "College Batches", href: "/admin/batches" },
  { label: "Enrollments",     href: "/admin/enrollments" },
  { label: "Clients",         href: "/admin/clients" },
  { label: "Testimonials",    href: "/admin/testimonials" },
  { label: "Case Studies",    href: "/admin/case-studies" },
  { label: "Team",            href: "/admin/team" },
  { label: "Website Content", href: "/admin/content" },
  { label: "Courses",         href: "/admin/courses" },
];

export default function AdminCoursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Course, "id" | "created_at">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/courses");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load courses");
      setCourses(data.courses || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      alert("Title and slug are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setShowForm(false);
      setForm(EMPTY);
      fetchCourses();
    } catch (e: any) {
      alert(e.message || "Course creation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? All modules, lessons, and student results inside it will be permanently deleted!")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((prev) => ({ ...prev, thumbnail_url: data.url }));
    } catch (err: any) {
      alert(err.message || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Reordering helpers
  const handleMove = async (index: number, direction: -1 | 1) => {
    const newCourses = [...courses];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= courses.length) return;

    // Swap display order
    const temp = newCourses[index].display_order;
    newCourses[index].display_order = newCourses[targetIndex].display_order;
    newCourses[targetIndex].display_order = temp;

    // Swap in state instantly
    setCourses(newCourses);

    try {
      // Save swap to db
      await Promise.all([
        fetch(`/api/admin/courses/${newCourses[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newCourses[index].display_order }),
        }),
        fetch(`/api/admin/courses/${newCourses[targetIndex].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newCourses[targetIndex].display_order }),
        }),
      ]);
    } catch (err) {
      console.error("Reorder failed to save:", err);
    }
  };

  // Auto populate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-");
    setForm((prev) => ({ ...prev, title, slug }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-card border border-line shadow-soft">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <span className="text-xs font-bold text-slate uppercase tracking-wider">
                operator panel
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-ink mt-1">
              KVJ Analytics — Course Builder
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="px-4 py-2 text-sm text-error hover:bg-error/5 flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
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

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand" />
            Courses ({courses.length})
          </h2>
          <Button
            onClick={() => {
              setForm({
                ...EMPTY,
                display_order: courses.length > 0 ? Math.max(...courses.map((c) => c.display_order)) + 1 : 1,
              });
              setShowForm(true);
            }}
            className="px-4 py-2 bg-brand text-white text-sm font-bold flex items-center gap-1.5 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Create Course Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-line rounded-card max-w-2xl w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh] space-y-6">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-xl font-bold font-display text-ink">Create New Program</h3>
                <button onClick={() => setShowForm(false)}>
                  <X className="w-5 h-5 text-slate hover:text-ink" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Financial Analytics Masterclass"
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="financial-analytics-masterclass"
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Client Segment
                    </label>
                    <select
                      value={form.segment}
                      onChange={(e: any) =>
                        setForm((prev) => ({ ...prev, segment: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                    >
                      <option value="college">College Students</option>
                      <option value="corporate">Corporate Professionals</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-6 pt-5 pl-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_paid"
                        checked={form.is_paid}
                        onChange={(e) => setForm((prev) => ({ ...prev, is_paid: e.target.checked }))}
                        className="w-4 h-4 rounded text-brand border-line"
                      />
                      <label htmlFor="is_paid" className="text-xs font-bold uppercase tracking-wider text-slate">
                        Paid Program
                      </label>
                    </div>
                  </div>

                  {form.is_paid && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                        Price (INR) *
                      </label>
                      <input
                        type="number"
                        required
                        value={form.price_inr}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, price_inr: Number(e.target.value) }))
                        }
                        className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Thumbnail Image
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={form.thumbnail_url}
                        onChange={(e) => setForm((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                        placeholder="https://... or upload image"
                        className="flex-1 px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-slate text-white text-xs font-bold flex items-center gap-1 hover:bg-slate-700 rounded-btn shrink-0"
                      >
                        {uploading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        Upload
                      </Button>
                    </div>
                    {form.thumbnail_url && (
                      <div className="mt-2 text-xs text-brand truncate">
                        Loaded: {form.thumbnail_url}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Program Summary
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={form.summary}
                      placeholder="Short description shown on course card..."
                      onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-line justify-end">
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="secondary"
                    className="px-5 py-2.5 text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-brand text-white font-bold text-sm flex items-center gap-2"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Create Program
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Courses Listing Table */}
        {courses.length === 0 ? (
          <div className="bg-white border border-line rounded-card p-16 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20 text-slate" />
            <p className="font-semibold text-slate">
              No courses created yet. Click &quot;Add Course&quot; to define your first program.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-line rounded-card shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                    <th className="p-4 pl-6">Display</th>
                    <th className="p-4">Program Details</th>
                    <th className="p-4">Pricing</th>
                    <th className="p-4">Target Segment</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-[14px]">
                  {courses.map((c, index) => (
                    <tr key={c.id} className="hover:bg-surface/30 transition-colors">
                      {/* Sorting Column */}
                      <td className="p-4 pl-6">
                        <div className="flex flex-col gap-1 w-6">
                          <button
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0}
                            className="p-0.5 border border-line rounded hover:bg-surface disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-slate" />
                          </button>
                          <button
                            onClick={() => handleMove(index, 1)}
                            disabled={index === courses.length - 1}
                            className="p-0.5 border border-line rounded hover:bg-surface disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-slate" />
                          </button>
                        </div>
                      </td>

                      {/* Course Identity */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {c.thumbnail_url ? (
                            <img
                              src={c.thumbnail_url}
                              alt={c.title}
                              className="w-14 h-10 object-cover rounded-lg border border-line shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-10 bg-brand/10 text-brand flex items-center justify-center rounded-lg border border-brand/20 shrink-0 font-bold">
                              KVJ
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-ink leading-snug">{c.title}</h3>
                            <span className="text-[10px] font-bold text-slate uppercase tracking-wider block mt-0.5">
                              Slug: {c.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Pricing Model */}
                      <td className="p-4 text-slate">
                        {c.is_paid ? (
                          <span className="font-bold text-ink">₹{c.price_inr}</span>
                        ) : (
                          <span className="text-xs font-semibold text-slate uppercase">Free / Campus</span>
                        )}
                      </td>

                      {/* Segment */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                            c.segment === "corporate"
                              ? "bg-corporate/10 text-corporate border-corporate/30"
                              : "bg-education/10 text-education border-education/30"
                          }`}
                        >
                          {c.segment}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/courses/${c.id}`}>
                            <Button
                              variant="ghost"
                              className="py-1.5 px-3 text-xs border border-line text-slate hover:text-brand flex items-center gap-1"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                              Curriculum
                            </Button>
                          </Link>
                          <Button
                            onClick={() => handleDelete(c.id)}
                            variant="ghost"
                            disabled={deletingId === c.id}
                            className="py-1.5 px-2.5 text-xs border border-error/20 text-error hover:bg-error/5 flex items-center justify-center"
                          >
                            {deletingId === c.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
