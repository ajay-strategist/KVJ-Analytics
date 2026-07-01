"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle, FolderOpen, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: "self_serve" | "inquiry";
  display_order: number;
  is_published: boolean;
}

const EMPTY_FORM: Omit<Category, "id"> = {
  slug: "",
  name: "",
  description: "",
  type: "self_serve",
  display_order: 1,
  is_published: true,
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

export default function AdminCategoriesPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Category, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/categories");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load categories");
      setCategories(data.categories || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      alert("Name and slug are required.");
      return;
    }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      
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
      fetchCategories();
    } catch (e: any) {
      alert(e.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      type: cat.type,
      display_order: cat.display_order,
      is_published: cat.is_published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Any course linked to it will lose its reference.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const newCats = [...categories];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    // Swap display order values
    const temp = newCats[index].display_order;
    newCats[index].display_order = newCats[targetIdx].display_order;
    newCats[targetIdx].display_order = temp;

    setCategories(newCats);

    try {
      await Promise.all([
        fetch(`/api/admin/categories/${newCats[index].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newCats[index].display_order }),
        }),
        fetch(`/api/admin/categories/${newCats[targetIdx].id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_order: newCats[targetIdx].display_order }),
        }),
      ]);
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-surface p-8 text-ink">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-ink">Admin Dashboard</h1>
            <p className="text-xs text-slate mt-1.5 font-medium">Manage training platform tracks and course categories.</p>
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
            <FolderOpen className="w-5 h-5 text-brand" />
            Course Categories ({categories.length})
          </h2>
          <Button
            onClick={() => {
              setForm({
                ...EMPTY_FORM,
                display_order: categories.length > 0 ? Math.max(...categories.map((c) => c.display_order)) + 1 : 1,
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-brand text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Category
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
        ) : categories.length === 0 ? (
          <div className="p-16 border-dashed border-2 border-line text-center text-slate">
            No course categories found in the database.
          </div>
        ) : (
          <div className="bg-white border border-line rounded-card overflow-hidden shadow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                  <th className="p-4">Sort</th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {categories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-surface/20 transition-colors">
                    
                    {/* Sort controls */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, -1)}
                          className="p-1 border border-line rounded hover:bg-surface text-slate disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === categories.length - 1}
                          onClick={() => handleMove(idx, 1)}
                          className="p-1 border border-line rounded hover:bg-surface text-slate disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Name & Desc */}
                    <td className="p-4">
                      <div className="font-bold text-ink">{cat.name}</div>
                      <div className="text-xs text-slate line-clamp-1 mt-0.5">{cat.description}</div>
                    </td>

                    {/* Slug */}
                    <td className="p-4 font-mono text-xs text-slate">{cat.slug}</td>

                    {/* Type */}
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        cat.type === "inquiry" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-teal-100 text-teal-700 border-teal-200"
                      }`}>
                        {cat.type}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        cat.is_published ? "bg-success/10 text-success border-success/30" : "bg-slate/10 text-slate border-line"
                      }`}>
                        {cat.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 border border-line rounded hover:bg-surface text-slate hover:text-brand"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          disabled={deletingId === cat.id}
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 border border-line rounded hover:bg-surface text-error disabled:opacity-30"
                        >
                          {deletingId === cat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Dialog */}
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
                {editingId ? "Modify Category" : "Add Course Category"}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Corporate Training"
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Category Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                    placeholder="e.g. corporate"
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Description / Intro
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="1-line sub-label summary"
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Enrollment Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 text-sm"
                    >
                      <option value="self_serve">Self-Serve (Unlock/Buy)</option>
                      <option value="inquiry">B2B (Inquiry Forms)</option>
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

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={form.is_published}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
                    className="w-4 h-4 rounded text-brand border-line"
                  />
                  <label htmlFor="is_published" className="text-xs font-bold uppercase tracking-wider text-slate">
                    Publish Category (Visible on Hub)
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-brand text-white font-bold flex items-center justify-center"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
