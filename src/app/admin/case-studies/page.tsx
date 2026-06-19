"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CaseStudy {
  id: string;
  title: string;
  client_name: string;
  industry: string;
  challenge: string;
  solution: string;
  result: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
}

const EMPTY: Omit<CaseStudy, "id" | "created_at"> = {
  title: "", client_name: "", industry: "", challenge: "", solution: "", result: "", image_url: "", is_active: true,
};

const NAV_TABS = [
  { label: "Leads Inbox", href: "/admin/leads" },
  { label: "College Batches", href: "/admin/batches" },
  { label: "Enrollments", href: "/admin/enrollments" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Case Studies", href: "/admin/case-studies" },
  { label: "Team", href: "/admin/team" },
  { label: "Website Content", href: "/admin/content" },
  { label: "Courses", href: "/admin/courses" },
];

export default function AdminCaseStudiesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<CaseStudy, "id" | "created_at">>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/case-studies");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.caseStudies || []);
    } catch (e: any) { setError(e.message || "Failed to load."); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin"); };
  const openAdd = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit = (c: CaseStudy) => { const { id, created_at, ...rest } = c; setForm(rest); setEditingId(id); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/case-studies", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowForm(false); fetchItems();
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this case study?")) return;
    setDeletingId(id);
    await fetch("/api/admin/case-studies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  };

  const toggleActive = async (c: CaseStudy) => {
    await fetch("/api/admin/case-studies", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id, is_active: !c.is_active }) });
    setItems((prev) => prev.map((x) => x.id === c.id ? { ...x, is_active: !x.is_active } : x));
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand" /></div>;

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-card border border-line shadow-soft">
          <div>
            <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" /><span className="text-xs font-bold text-slate uppercase tracking-wider">operator panel</span></div>
            <h1 className="text-2xl font-bold font-display text-ink mt-1">KVJ Analytics — Admin Console</h1>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="px-4 py-2 text-sm text-error hover:bg-error/5 flex items-center space-x-1.5"><LogOut className="w-4 h-4" /><span>Sign Out</span></Button>
        </div>

        {/* Nav */}
        <div className="flex flex-wrap gap-1 border-b border-line">
          {NAV_TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${pathname === tab.href ? "border-brand text-brand font-bold" : "border-transparent text-slate hover:text-ink"}`}>{tab.label}</Link>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2"><BookOpen className="w-5 h-5 text-brand" /> Case Studies ({items.length})</h2>
          <Button onClick={openAdd} className="px-4 py-2 bg-brand text-white text-sm font-bold flex items-center gap-1.5 rounded-lg"><Plus className="w-4 h-4" /> Add Case Study</Button>
        </div>

        {error && <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error"><AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><span className="text-sm font-semibold">{error}</span></div>}

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-brand/30 rounded-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold font-display text-ink">{editingId ? "Edit Case Study" : "Add New Case Study"}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate hover:text-ink" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Title *", key: "title", placeholder: "Power BI Dashboard for XYZ Corp" },
                { label: "Client Name", key: "client_name", placeholder: "Acme Corp" },
                { label: "Industry", key: "industry", placeholder: "Manufacturing, FMCG..." },
                { label: "Cover Image URL", key: "image_url", placeholder: "https://..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">{label}</label>
                  <input type="text" placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
                </div>
              ))}
              {[
                { label: "Challenge", key: "challenge", placeholder: "What problem did the client face?" },
                { label: "Solution", key: "solution", placeholder: "What did KVJ Analytics deliver?" },
                { label: "Result / Impact", key: "result", placeholder: "Quantified outcomes..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">{label}</label>
                  <textarea rows={3} placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
                </div>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate">Show on Website</label>
                <button type="button" onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className={`w-10 h-6 rounded-full transition-colors ${form.is_active ? "bg-brand" : "bg-line"}`}>
                  <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.is_active ? "translate-x-4" : ""}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-brand text-white font-bold text-sm flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? "Saving..." : "Save Case Study"}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="secondary" className="px-6 py-2.5 text-sm">Cancel</Button>
            </div>
          </div>
        )}

        {/* List */}
        {items.length === 0 ? (
          <div className="bg-white border border-line rounded-card p-16 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20 text-slate" />
            <p className="font-semibold text-slate">No case studies yet. Add your first success story.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((c) => (
              <div key={c.id} className={`bg-white border rounded-card p-5 shadow-soft ${c.is_active ? "border-line" : "border-dashed border-line opacity-60"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-ink">{c.title}</h3>
                      {c.industry && <span className="text-xs text-slate bg-surface px-2 py-0.5 rounded border border-line">{c.industry}</span>}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.is_active ? "bg-success/10 text-success border-success/30" : "bg-surface text-slate border-line"}`}>{c.is_active ? "Live" : "Hidden"}</span>
                    </div>
                    {c.client_name && <p className="text-sm text-slate mt-0.5">Client: {c.client_name}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      {c.challenge && <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate/70 mb-0.5">Challenge</p><p className="text-xs text-ink line-clamp-2">{c.challenge}</p></div>}
                      {c.solution && <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate/70 mb-0.5">Solution</p><p className="text-xs text-ink line-clamp-2">{c.solution}</p></div>}
                      {c.result && <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate/70 mb-0.5">Result</p><p className="text-xs text-ink line-clamp-2">{c.result}</p></div>}
                    </div>
                  </div>
                  {c.image_url && <img src={c.image_url} alt={c.title} className="w-20 h-16 object-cover rounded-lg border border-line shrink-0" />}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => openEdit(c)} variant="ghost" className="py-1.5 px-4 text-xs border border-line text-slate hover:text-ink flex items-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                  <Button onClick={() => toggleActive(c)} variant="ghost" className="py-1.5 px-4 text-xs border border-line text-slate hover:text-ink">{c.is_active ? "Hide" : "Show"}</Button>
                  <Button onClick={() => handleDelete(c.id)} variant="ghost" disabled={deletingId === c.id} className="py-1.5 px-3 text-xs border border-error/20 text-error hover:bg-error/5 flex items-center gap-1">
                    {deletingId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
