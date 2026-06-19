"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle, Building2, LogOut, Users, Calendar, Layers, Star, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Client {
  id: string;
  name: string;
  industry: string;
  logo_url: string;
  website_url: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const EMPTY: Omit<Client, "id" | "created_at"> = {
  name: "", industry: "", logo_url: "", website_url: "", description: "", sort_order: 0, is_active: true,
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

export default function AdminClientsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Client, "id" | "created_at">>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { fetchClients(); }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/clients");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setClients(data.clients || []);
    } catch (e: any) {
      setError(e.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setShowForm(true); };
  const openEdit = (c: Client) => {
    const { id, created_at, ...rest } = c;
    setForm(rest); setEditingId(id); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowForm(false);
      fetchClients();
    } catch (e: any) {
      alert(e.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    setDeletingId(id);
    try {
      await fetch("/api/admin/clients", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch { alert("Delete failed."); }
    finally { setDeletingId(null); }
  };

  const toggleActive = async (c: Client) => {
    await fetch("/api/admin/clients", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, is_active: !c.is_active }),
    });
    setClients((prev) => prev.map((x) => x.id === c.id ? { ...x, is_active: !x.is_active } : x));
  };

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-brand" />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-card border border-line shadow-soft">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <span className="text-xs font-bold text-slate uppercase tracking-wider">operator panel</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-ink mt-1">KVJ Analytics — Admin Console</h1>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="px-4 py-2 text-sm text-error hover:bg-error/5 flex items-center space-x-1.5">
            <LogOut className="w-4 h-4" /><span>Sign Out</span>
          </Button>
        </div>

        {/* Nav Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-line pb-0">
          {NAV_TABS.map((tab) => (
            <Link key={tab.href} href={tab.href}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${pathname === tab.href ? "border-brand text-brand font-bold" : "border-transparent text-slate hover:text-ink"}`}>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-ink flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand" /> Clients ({clients.length})
          </h2>
          <Button onClick={openAdd} className="px-4 py-2 bg-brand text-white text-sm font-bold flex items-center gap-1.5 rounded-lg">
            <Plus className="w-4 h-4" /> Add Client
          </Button>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white border border-brand/30 rounded-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold font-display text-ink">{editingId ? "Edit Client" : "Add New Client"}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate hover:text-ink" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Client / Company Name *", key: "name", placeholder: "Acme Corp" },
                { label: "Industry", key: "industry", placeholder: "e.g. Manufacturing, EdTech" },
                { label: "Logo URL", key: "logo_url", placeholder: "https://..." },
                { label: "Website URL", key: "website_url", placeholder: "https://..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">{label}</label>
                  <input
                    type="text" placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm transition-all"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Description / Notes</label>
                <textarea
                  rows={3} placeholder="Brief description of work done..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">Sort Order</label>
                <input type="number" value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm transition-all"
                />
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
                {saving ? "Saving..." : "Save Client"}
              </Button>
              <Button onClick={() => setShowForm(false)} variant="secondary" className="px-6 py-2.5 text-sm">Cancel</Button>
            </div>
          </div>
        )}

        {/* Clients Grid */}
        {clients.length === 0 ? (
          <div className="bg-white border border-line rounded-card p-16 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20 text-slate" />
            <p className="font-semibold text-slate">No clients added yet. Click "Add Client" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((c) => (
              <div key={c.id} className={`bg-white border rounded-card p-5 shadow-soft space-y-3 transition-all ${c.is_active ? "border-line" : "border-dashed border-line opacity-60"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {c.logo_url && <img src={c.logo_url} alt={c.name} className="h-8 object-contain mb-2 max-w-[120px]" />}
                    <h3 className="font-bold text-ink truncate">{c.name}</h3>
                    {c.industry && <span className="text-xs text-slate bg-surface px-2 py-0.5 rounded border border-line">{c.industry}</span>}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.is_active ? "bg-success/10 text-success border-success/30" : "bg-surface text-slate border-line"}`}>
                    {c.is_active ? "Live" : "Hidden"}
                  </span>
                </div>
                {c.description && <p className="text-xs text-slate line-clamp-2">{c.description}</p>}
                {c.website_url && <a href={c.website_url} target="_blank" rel="noreferrer" className="text-xs text-brand hover:underline truncate block">{c.website_url}</a>}
                <div className="flex items-center gap-2 pt-1">
                  <Button onClick={() => openEdit(c)} variant="ghost" className="flex-1 py-1.5 text-xs border border-line text-slate hover:text-ink flex items-center justify-center gap-1">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button onClick={() => toggleActive(c)} variant="ghost" className="flex-1 py-1.5 text-xs border border-line text-slate hover:text-ink flex items-center justify-center gap-1">
                    {c.is_active ? "Hide" : "Show"}
                  </Button>
                  <Button onClick={() => handleDelete(c.id)} variant="ghost" disabled={deletingId === c.id}
                    className="py-1.5 px-2 text-xs border border-error/20 text-error hover:bg-error/5 flex items-center justify-center">
                    {deletingId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
