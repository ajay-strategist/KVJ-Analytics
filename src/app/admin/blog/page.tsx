"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, AlertCircle, Newspaper, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  body_html: string;
  cover_url: string;
  author_name: string;
  author_slug: string;
  author_bio: string;
  category_title: string;
  category_slug: string;
  published_at: string;
  featured: boolean;
  is_published: boolean;
  display_order: number;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM: Omit<Post, "id"> = {
  slug: "",
  title: "",
  description: "",
  body_html: "",
  cover_url: "",
  author_name: "KVJ Analytics",
  author_slug: "kvj-analytics",
  author_bio: "",
  category_title: "Insights",
  category_slug: "insights",
  published_at: todayISO(),
  featured: false,
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
  { label: "Blog",                 href: "/admin/blog" },
  { label: "Inquiries",            href: "/admin/inquiries" },
  { label: "Applications",         href: "/admin/applications" },
];

export default function AdminBlogPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Post, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/blog");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load posts");
      setPosts(data.posts || []);
    } catch (e: any) {
      setError(e.message || "Failed to fetch posts.");
    } finally { setLoading(false); }
  };

  const set = (k: keyof Omit<Post, "id">, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      set("cover_url", data.url);
    } catch (err: any) {
      alert(err.message || "Upload failed.");
    } finally { setUploading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) { alert("Title and slug are required."); return; }
    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setShowForm(false); setEditingId(null); setForm(EMPTY_FORM);
      fetchPosts();
    } catch (e: any) {
      alert(e.message || "Failed to save post.");
    } finally { setSaving(false); }
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setForm({
      slug: post.slug, title: post.title, description: post.description || "",
      body_html: post.body_html || "", cover_url: post.cover_url || "",
      author_name: post.author_name || "KVJ Analytics", author_slug: post.author_slug || "kvj-analytics",
      author_bio: post.author_bio || "",
      category_title: post.category_title || "Insights", category_slug: post.category_slug || "insights",
      published_at: (post.published_at || todayISO()).slice(0, 10),
      featured: !!post.featured, is_published: !!post.is_published,
      display_order: post.display_order || 1,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post permanently?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert(e.message || "Failed to delete post.");
    } finally { setDeletingId(null); }
  };

  const inputCls = "w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm";

  return (
    <div className="min-h-screen bg-surface p-8 text-ink">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-ink">Admin Dashboard</h1>
            <p className="text-xs text-slate mt-1.5 font-medium">Write and manage blog articles.</p>
          </div>
          <Button href="/" className="px-4 py-2 border border-line text-slate hover:text-ink text-xs font-bold">Launch Main Website</Button>
        </div>

        <div className="flex flex-wrap gap-1 border-b border-line">
          {NAV_TABS.map((tab) => (
            <Link key={tab.href} href={tab.href}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                pathname === tab.href ? "border-brand text-brand font-bold" : "border-transparent text-slate hover:text-ink"
              }`}>
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-brand" /> Blog Posts ({posts.length})
          </h2>
          <Button
            onClick={() => {
              setForm({ ...EMPTY_FORM, display_order: posts.length > 0 ? Math.max(...posts.map((p) => p.display_order || 0)) + 1 : 1 });
              setEditingId(null); setShowForm(true);
            }}
            className="px-4 py-2 bg-brand text-white text-xs font-bold flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
        ) : posts.length === 0 ? (
          <div className="p-16 border-dashed border-2 border-line text-center text-slate">No blog posts yet. Click “New Post”.</div>
        ) : (
          <div className="bg-white border border-line rounded-card overflow-hidden shadow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-sm">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-surface/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-ink flex items-center gap-2">
                        {post.featured && <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand/10 text-brand border border-brand/20">Featured</span>}
                        {post.title}
                      </div>
                      <div className="text-xs text-slate font-mono mt-0.5">/{post.slug}</div>
                    </td>
                    <td className="p-4 text-slate font-medium">{post.category_title}</td>
                    <td className="p-4 text-slate font-medium">{post.author_name}</td>
                    <td className="p-4 text-slate font-medium">{(post.published_at || "").slice(0, 10)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        post.is_published ? "bg-success/10 text-success border-success/30" : "bg-slate/10 text-slate border-line"
                      }`}>
                        {post.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(post)} className="p-1.5 border border-line rounded hover:bg-surface text-slate hover:text-brand"><Pencil className="w-4 h-4" /></button>
                        <button disabled={deletingId === post.id} onClick={() => handleDelete(post.id)} className="p-1.5 border border-line rounded hover:bg-surface text-error disabled:opacity-30">
                          {deletingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-line rounded-card max-w-2xl w-full p-8 shadow-2xl relative overflow-y-auto max-h-[92vh]">
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate hover:text-ink font-bold">✕</button>
              <h3 className="text-xl font-bold font-display text-ink mb-6">{editingId ? "Edit Post" : "New Post"}</h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Title *</label>
                  <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Post title" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">URL Slug *</label>
                  <input type="text" required value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))} className={`${inputCls} font-mono`} placeholder="post-url-slug" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Short Description (card excerpt)</label>
                  <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} placeholder="1–2 line summary shown on cards" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Body (HTML)</label>
                  <textarea rows={10} value={form.body_html} onChange={(e) => set("body_html", e.target.value)} className={`${inputCls} font-mono`} placeholder="<p>Article content…</p>" />
                  <p className="text-[11px] text-slate mt-1">Paste article HTML. Use &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt; etc.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Cover Image</label>
                  <div className="flex items-center gap-3">
                    {form.cover_url ? (
                      <img src={form.cover_url} alt="cover" className="w-20 h-14 object-cover rounded border border-line" />
                    ) : (
                      <div className="w-20 h-14 rounded border border-dashed border-line flex items-center justify-center text-slate"><ImageIcon className="w-5 h-5" /></div>
                    )}
                    <div className="flex flex-col gap-1">
                      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="px-3 py-1.5 border border-line rounded text-xs font-bold hover:bg-surface flex items-center gap-1.5">
                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Upload
                      </button>
                      {form.cover_url && <button type="button" onClick={() => set("cover_url", "")} className="text-[11px] text-error font-bold">Remove</button>}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Author name</label>
                    <input type="text" value={form.author_name} onChange={(e) => set("author_name", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Author slug</label>
                    <input type="text" value={form.author_slug} onChange={(e) => set("author_slug", e.target.value)} className={`${inputCls} font-mono`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Author bio</label>
                  <textarea rows={2} value={form.author_bio} onChange={(e) => set("author_bio", e.target.value)} className={inputCls} placeholder="Short author bio shown at the end of the article" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Category title</label>
                    <input type="text" value={form.category_title} onChange={(e) => set("category_title", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Category slug</label>
                    <input type="text" value={form.category_slug} onChange={(e) => set("category_slug", e.target.value)} className={`${inputCls} font-mono`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Publish date</label>
                    <input type="date" value={form.published_at} onChange={(e) => set("published_at", e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Display order</label>
                    <input type="number" value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value))} className={inputCls} />
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate">
                    <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 rounded text-brand border-line" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-brand border-line" />
                    Published
                  </label>
                </div>
                <Button type="submit" disabled={saving} className="w-full py-3 bg-brand text-white font-bold flex items-center justify-center">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Post"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
