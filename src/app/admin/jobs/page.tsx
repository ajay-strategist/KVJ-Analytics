"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle, Briefcase, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Job {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: "full_time" | "part_time" | "internship";
  department: string;
  description: string;
  is_published: boolean;
  display_order: number;
}

const EMPTY_FORM: Omit<Job, "id"> = {
  slug: "",
  title: "",
  location: "Cochin, India",
  type: "full_time",
  department: "Consulting",
  description: "",
  is_published: true,
  display_order: 1,
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

export default function AdminJobsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Job, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load jobs");
      setJobs(data.jobs || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      alert("Title and slug are required.");
      return;
    }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/jobs/${editingId}` : "/api/admin/jobs";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchJobs();
    } catch (e: any) {
      alert(e.message || "Failed to save job.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      slug: job.slug,
      title: job.title,
      location: job.location,
      type: job.type,
      department: job.department,
      description: job.description,
      is_published: job.is_published,
      display_order: job.display_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job vacancy? All matching job applications in the database will be permanently deleted!")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setJobs((prev) => prev.filter((item) => item.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete job.");
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
            <p className="text-xs text-slate mt-1.5 font-medium">Manage corporate career listings and roles.</p>
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
            <Briefcase className="w-5 h-5 text-brand" />
            Job Board Roles ({jobs.length})
          </h2>
          <Button
            onClick={() => {
              setForm({
                ...EMPTY_FORM,
                display_order: jobs.length > 0 ? Math.max(...jobs.map((j) => j.display_order)) + 1 : 1,
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-brand text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Job Role
          </Button>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 border-dashed border-2 border-line text-center text-slate">
            No job vacancies found in the database.
          </div>
        ) : (
          <div className="bg-white border border-line rounded-card overflow-hidden shadow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface/20 transition-colors">
                    
                    {/* Title */}
                    <td className="p-4">
                      <div className="font-bold text-ink">{job.title}</div>
                      <div className="text-xs text-slate font-mono mt-0.5">Slug: {job.slug}</div>
                    </td>

                    {/* Department */}
                    <td className="p-4 text-slate font-medium">{job.department}</td>

                    {/* Location */}
                    <td className="p-4 text-slate font-medium">{job.location}</td>

                    {/* Type */}
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border bg-zinc-100 text-zinc-700 border-zinc-200`}>
                        {job.type.replace("_", " ")}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        job.is_published ? "bg-success/10 text-success border-success/30" : "bg-slate/10 text-slate border-line"
                      }`}>
                        {job.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-1.5 border border-line rounded hover:bg-surface text-slate hover:text-brand"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          disabled={deletingId === job.id}
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 border border-line rounded hover:bg-surface text-error disabled:opacity-30"
                        >
                          {deletingId === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-line rounded-card max-w-xl w-full p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-slate hover:text-ink font-bold"
              >
                ✕
              </button>

              <h3 className="text-xl font-bold font-display text-ink mb-6">
                {editingId ? "Modify Job Role" : "Add Job vacancy"}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Lead BI Developer"
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm"
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
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                    placeholder="e.g. lead-bi-developer"
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      required
                      value={form.department}
                      onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                      placeholder="e.g. Analytics / Consulting"
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Cochin / Remote"
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Employment Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="internship">Internship Role</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.display_order}
                      onChange={(e) => setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Role Description &amp; Requirements (Markdown)
                  </label>
                  <textarea
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Detail tasks, skills, and qualifications..."
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={form.is_published}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded text-brand border-line"
                  />
                  <label htmlFor="is_published" className="text-xs font-bold uppercase tracking-wider text-slate">
                    Publish vacancy listing
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-brand text-white font-bold flex items-center justify-center"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Listing"}
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
