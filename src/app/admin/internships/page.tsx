"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Internship {
  id: string;
  slug: string;
  title: string;
  description: string;
  banner_url: string;
  duration: string;
  stipend: string;
  is_published: boolean;
  display_order: number;
}

const EMPTY_FORM: Omit<Internship, "id"> = {
  slug: "",
  title: "",
  description: "",
  banner_url: "",
  duration: "3 Months",
  stipend: "₹5,000 / Month",
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

export default function AdminInternshipsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Internship, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/internships");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load internships");
      setInternships(data.internships || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch internships.");
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
      const url = editingId ? `/api/admin/internships/${editingId}` : "/api/admin/internships";
      
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
      fetchInternships();
    } catch (e: any) {
      alert(e.message || "Failed to save internship.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (intern: Internship) => {
    setEditingId(intern.id);
    setForm({
      slug: intern.slug,
      title: intern.title,
      description: intern.description,
      banner_url: intern.banner_url || "",
      duration: intern.duration,
      stipend: intern.stipend,
      is_published: intern.is_published,
      display_order: intern.display_order,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship? All matching internship applications in the database will be permanently deleted!")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/internships/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setInternships((prev) => prev.filter((item) => item.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete internship.");
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
            <p className="text-xs text-slate mt-1.5 font-medium">Manage student internship offerings and timelines.</p>
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
            <Award className="w-5 h-5 text-brand" />
            Internships ({internships.length})
          </h2>
          <Button
            onClick={() => {
              setForm({
                ...EMPTY_FORM,
                display_order: internships.length > 0 ? Math.max(...internships.map((i) => i.display_order)) + 1 : 1,
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-brand text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Internship
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
        ) : internships.length === 0 ? (
          <div className="p-16 border-dashed border-2 border-line text-center text-slate">
            No internships listed in the database.
          </div>
        ) : (
          <div className="bg-white border border-line rounded-card overflow-hidden shadow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                  <th className="p-4">Title</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Stipend</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {internships.map((intern) => (
                  <tr key={intern.id} className="hover:bg-surface/20 transition-colors">
                    
                    {/* Title */}
                    <td className="p-4">
                      <div className="font-bold text-ink">{intern.title}</div>
                      <div className="text-xs text-slate font-mono mt-0.5">Slug: {intern.slug}</div>
                    </td>

                    {/* Duration */}
                    <td className="p-4 text-slate font-medium">{intern.duration}</td>

                    {/* Stipend */}
                    <td className="p-4 text-slate font-semibold">{intern.stipend}</td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        intern.is_published ? "bg-success/10 text-success border-success/30" : "bg-slate/10 text-slate border-line"
                      }`}>
                        {intern.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(intern)}
                          className="p-1.5 border border-line rounded hover:bg-surface text-slate hover:text-brand"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          disabled={deletingId === intern.id}
                          onClick={() => handleDelete(intern.id)}
                          className="p-1.5 border border-line rounded hover:bg-surface text-error disabled:opacity-30"
                        >
                          {deletingId === intern.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                {editingId ? "Modify Internship" : "Add Internship listing"}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Internship Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Data Analytics Consulting Intern"
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
                    placeholder="e.g. data-analytics-intern"
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Stipend / Comp *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.stipend}
                    onChange={(e) => setForm((prev) => ({ ...prev, stipend: e.target.value }))}
                    placeholder="e.g. ₹5,000 / Month"
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={form.duration}
                      onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g. 3 Months"
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                    />
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
                    Banner Image URL
                  </label>
                  <input
                    type="text"
                    value={form.banner_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, banner_url: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Description &amp; Deliverables
                  </label>
                  <textarea
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Detail core tasks, expectations, and educational requirements..."
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
                    Publish Internship listing
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
