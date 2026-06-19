"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle, Star, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  client_company: string;
  quote: string;
  avatar_url: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

const EMPTY: Omit<Testimonial, "id" | "created_at"> = {
  client_name: "", client_title: "", client_company: "", quote: "", avatar_url: "", rating: 5, is_active: true,
};

const NAV_TABS = [
  { label: "Leads Inbox", href: "/admin/leads" },
  { label: "College Batches", href: "/admin/batches" },
  { label: "Enrollments", href: "/admin/enrollments" },
  { label: "Clients", href: "/admin/clients" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Case Studies", href: "/admin/case-studies" },
  { label: "Team", href: "/admin/team" },
];

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Testimonial, "id" | "created_at">>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.testimonials || []);
    } catch (e: any) { setError(e.message || "Failed to load."); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin"); };
  const openAdd = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit = (t: Testimonial) => { const { id, created_at, ...rest } = t; setForm(rest); setEditingId(id); setShowForm(true); };

  const handleSave = async () => {
    if (!form.client_name.trim() || !form.quote.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
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
    if (!confirm("Delete this testimonial?")) return;
    setDeletingId(id);
    await fetch("/api/admin/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((t) => t.id !== id));
    setDeletingId(null);
  };

  const toggleActive = async (t: Testimonial) => {
    await fetch("/api/admin/testimonials", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: t.id, is_active: !t.is_active }) });
    setItems((prev) => prev.map((x) => x.id === t.id ? { ...x, is_active: !x.is_active } : x));
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
          <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2"><MessageSquare className="w-5 h-5 text-brand" /> Testimonials ({items.length})</h2>
          <Button onClick={openAdd} className="px-4 py-2 bg-brand text-white text-sm font-bold flex items-center gap-1.5 rounded-lg"><Plus className="w-4 h-4" /> Add Testimonial</Button>
        </div>

        {error && <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error"><AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><span className="text-sm font-semibold">{error}</span></div>}

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-brand/30 rounded-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold font-display text-ink">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate hover:text-ink" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Client Name *", key: "client_name", placeholder: "John Smith" },
                { label: "Job Title", key: "client_title", placeholder: "CFO, Director..." },
                { label: "Company", key: "client_company", placeholder: "Acme Corp" },
                { label: "Avatar / Photo URL", key: "avatar_url", placeholder: "https://..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">{label}</label>
                  <input type="text" placeholder={placeholder} value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Testimonial Quote *</label>
                <textarea rows={4} placeholder="What the client said..."
                  value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Rating (1–5)</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setForm((f) => ({ ...f, rating: star }))}>
                      <Star className={`w-6 h-6 transition-colors ${form.rating >= star ? "fill-amber-400 text-amber-400" : "text-line"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
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
                {saving ? "Saving..." : "Save Testimonial"}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="secondary" className="px-6 py-2.5 text-sm">Cancel</Button>
            </div>
          </div>
        )}

        {/* Cards */}
        {items.length === 0 ? (
          <div className="bg-white border border-line rounded-card p-16 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20 text-slate" />
            <p className="font-semibold text-slate">No testimonials yet. Add your first client review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((t) => (
              <div key={t.id} className={`bg-white border rounded-card p-5 shadow-soft space-y-3 ${t.is_active ? "border-line" : "border-dashed border-line opacity-60"}`}>
                <div className="flex items-start gap-3">
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover border border-line" /> : <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">{t.client_name[0]}</div>}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink">{t.client_name}</div>
                    <div className="text-xs text-slate">{t.client_title}{t.client_company ? ` — ${t.client_company}` : ""}</div>
                    <div className="flex gap-0.5 mt-0.5">{[1,2,3,4,5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${t.rating >= s ? "fill-amber-400 text-amber-400" : "text-line"}`} />)}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.is_active ? "bg-success/10 text-success border-success/30" : "bg-surface text-slate border-line"}`}>{t.is_active ? "Live" : "Hidden"}</span>
                </div>
                <p className="text-sm text-ink italic leading-relaxed line-clamp-3">"{t.quote}"</p>
                <div className="flex gap-2 pt-1">
                  <Button onClick={() => openEdit(t)} variant="ghost" className="flex-1 py-1.5 text-xs border border-line text-slate hover:text-ink flex items-center justify-center gap-1"><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                  <Button onClick={() => toggleActive(t)} variant="ghost" className="flex-1 py-1.5 text-xs border border-line text-slate hover:text-ink flex items-center justify-center gap-1">{t.is_active ? "Hide" : "Show"}</Button>
                  <Button onClick={() => handleDelete(t.id)} variant="ghost" disabled={deletingId === t.id} className="py-1.5 px-2 text-xs border border-error/20 text-error hover:bg-error/5 flex items-center justify-center">
                    {deletingId === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
