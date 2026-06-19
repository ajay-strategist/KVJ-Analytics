"use client";

/**
 * /admin/content — Page Content Editor
 * Left sidebar: page list. Right canvas: structured form for selected page.
 * Saves full JSON via PUT /api/admin/content/[slug].
 * Image uploads via POST /api/admin/upload.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle, ArrowDown, ArrowUp, Check, ChevronRight,
  FileText, ImageIcon, Loader2, LogOut, Plus, Save, Trash2, X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FALLBACK_HOME_PAGE, FALLBACK_SITE_SETTINGS } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardItem { title: string; href: string }
interface CtaItem  { label: string; href: string }

interface HomeData {
  hero: {
    eyebrow?: string;
    headline: string;
    subhead: string;
    intro: string;
    supportingLine: string;
    heroImage?: string;
    primaryCta: CtaItem;
  };
  keyHighlights: string[];
  corporateSolutions: CardItem[];
  educationalSolutions: CardItem[];
  whyUs: { strapline: string; body: string };
  cta?: {
    title: string;
    description: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
  };
  regionsServed?: string[];
}

type PageSlug = "home" | "about" | "corporate" | "education" | "products" | "contact";

interface PageMeta { slug: PageSlug; label: string; icon: React.ReactNode }

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGES: PageMeta[] = [
  { slug: "home",      label: "Home",               icon: <FileText className="w-4 h-4" /> },
  { slug: "about",     label: "About Us",            icon: <FileText className="w-4 h-4" /> },
  { slug: "corporate", label: "Corporate Solutions", icon: <FileText className="w-4 h-4" /> },
  { slug: "education", label: "Educational Solutions",icon: <FileText className="w-4 h-4" /> },
  { slug: "products",  label: "Products",            icon: <FileText className="w-4 h-4" /> },
  { slug: "contact",   label: "Contact",             icon: <FileText className="w-4 h-4" /> },
];

const NAV_TABS = [
  { label: "Leads Inbox",    href: "/admin/leads" },
  { label: "College Batches",href: "/admin/batches" },
  { label: "Enrollments",    href: "/admin/enrollments" },
  { label: "Clients",        href: "/admin/clients" },
  { label: "Testimonials",   href: "/admin/testimonials" },
  { label: "Case Studies",   href: "/admin/case-studies" },
  { label: "Team",           href: "/admin/team" },
  { label: "Website Content",href: "/admin/content" },
];

const DEFAULT_HOME: HomeData = {
  hero: {
    eyebrow: "",
    headline: FALLBACK_HOME_PAGE.hero.headline,
    subhead:  FALLBACK_HOME_PAGE.hero.subhead,
    intro:    FALLBACK_HOME_PAGE.hero.intro,
    supportingLine: FALLBACK_HOME_PAGE.hero.supportingLine,
    heroImage: "",
    primaryCta: { ...FALLBACK_HOME_PAGE.hero.primaryCta },
  },
  keyHighlights:       [...FALLBACK_HOME_PAGE.keyHighlights],
  corporateSolutions:  FALLBACK_HOME_PAGE.corporateSolutions.map(c => ({ ...c })),
  educationalSolutions:FALLBACK_HOME_PAGE.educationalSolutions.map(c => ({ ...c })),
  whyUs: { ...FALLBACK_HOME_PAGE.whyUs },
  cta: {
    title: "Let's Build Smarter Systems Together",
    description: "Whether you are a corporate organization or an educational institution, KVJ Analytics is ready to support your transformation journey.",
    primaryCtaText: "Contact Our Team",
    primaryCtaHref: "/contact",
    secondaryCtaText: "Request a Demo",
    secondaryCtaHref: "/contact",
  },
  regionsServed: [...FALLBACK_SITE_SETTINGS.regionsServed],
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder = "", rows,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; rows?: number;
}) {
  const base = "w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm transition-all";
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate mb-1">{label}</label>
      {rows ? (
        <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className={`${base} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className={base} />
      )}
    </div>
  );
}

function ImageField({
  label, value, onChange,
}: { label: string; value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err: unknown) {
      setUploadErr(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate mb-1">{label}</label>
      <div className="space-y-2">
        {value && (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="h-24 rounded-lg border border-line object-cover max-w-xs" />
            <button onClick={() => onChange("")}
              className="absolute -top-2 -right-2 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input type="text" value={value} onChange={e => onChange(e.target.value)}
            placeholder="https://... (or upload below)"
            className="flex-1 px-3 py-2 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
          <button type="button" onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-2 rounded-btn border border-brand text-brand text-xs font-bold flex items-center gap-1.5 hover:bg-brand/5 transition-colors disabled:opacity-50">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
        {uploadErr && <p className="text-xs text-error font-semibold">{uploadErr}</p>}
      </div>
    </div>
  );
}

function StringList({
  label, items, onChange, placeholder = "Add item…",
}: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const move = (i: number, dir: -1 | 1) => {
    const n = [...items]; const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; onChange(n);
  };
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={val}
              onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
              className="flex-1 px-3 py-2 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
            <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 border border-line rounded hover:bg-surface disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5 text-slate" /></button>
            <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1.5 border border-line rounded hover:bg-surface disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5 text-slate" /></button>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1.5 border border-error/20 rounded hover:bg-error/5 text-error"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        <button onClick={() => onChange([...items, ""])}
          className="flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors">
          <Plus className="w-4 h-4" /> {placeholder}
        </button>
      </div>
    </div>
  );
}

function CardList({
  label, items, onChange,
}: { label: string; items: CardItem[]; onChange: (v: CardItem[]) => void }) {
  const move = (i: number, dir: -1 | 1) => {
    const n = [...items]; const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; onChange(n);
  };
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((card, i) => (
          <div key={i} className="flex items-center gap-2 p-3 bg-surface rounded-lg border border-line">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input type="text" value={card.title}
                onChange={e => { const n = items.map((c,j) => j===i ? {...c, title: e.target.value} : c); onChange(n); }}
                placeholder="Title" className="px-3 py-2 rounded-input border border-line bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
              <input type="text" value={card.href}
                onChange={e => { const n = items.map((c,j) => j===i ? {...c, href: e.target.value} : c); onChange(n); }}
                placeholder="/path or URL" className="px-3 py-2 rounded-input border border-line bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => move(i, -1)} disabled={i===0} className="p-1 border border-line rounded hover:bg-surface disabled:opacity-30"><ArrowUp className="w-3 h-3 text-slate" /></button>
              <button onClick={() => move(i, 1)} disabled={i===items.length-1} className="p-1 border border-line rounded hover:bg-surface disabled:opacity-30"><ArrowDown className="w-3 h-3 text-slate" /></button>
            </div>
            <button onClick={() => onChange(items.filter((_,j) => j!==i))} className="p-1.5 border border-error/20 rounded hover:bg-error/5 text-error"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        <button onClick={() => onChange([...items, { title: "", href: "" }])}
          className="flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors">
          <Plus className="w-4 h-4" /> Add card
        </button>
      </div>
    </div>
  );
}

// ─── Home Editor ─────────────────────────────────────────────────────────────

function HomeEditor({
  data, onChange,
}: { data: HomeData; onChange: (d: HomeData) => void }) {
  const set = useCallback(
    <K extends keyof HomeData>(key: K, value: HomeData[K]) =>
      onChange({ ...data, [key]: value }),
    [data, onChange]
  );

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <SectionCard title="Hero Section">
        <Field label="Eyebrow (optional small tag)" value={data.hero.eyebrow ?? ""}
          onChange={v => set("hero", { ...data.hero, eyebrow: v })} placeholder="e.g. Trusted by 500+ companies" />
        <Field label="Headline *" value={data.hero.headline}
          onChange={v => set("hero", { ...data.hero, headline: v })} placeholder={FALLBACK_HOME_PAGE.hero.headline} />
        <Field label="Subhead / Tagline (use • as separator)" value={data.hero.subhead}
          onChange={v => set("hero", { ...data.hero, subhead: v })}
          placeholder="Analytics • Automation • Training" />
        <Field label="Intro paragraph" value={data.hero.intro} rows={3}
          onChange={v => set("hero", { ...data.hero, intro: v })} />
        <Field label="Supporting line (blockquote)" value={data.hero.supportingLine} rows={2}
          onChange={v => set("hero", { ...data.hero, supportingLine: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary CTA label" value={data.hero.primaryCta.label}
            onChange={v => set("hero", { ...data.hero, primaryCta: { ...data.hero.primaryCta, label: v } })}
            placeholder="Get Started" />
          <Field label="Primary CTA link" value={data.hero.primaryCta.href}
            onChange={v => set("hero", { ...data.hero, primaryCta: { ...data.hero.primaryCta, href: v } })}
            placeholder="/contact" />
        </div>
        <ImageField label="Hero background / feature image (optional)"
          value={data.hero.heroImage ?? ""}
          onChange={v => set("hero", { ...data.hero, heroImage: v })} />
      </SectionCard>

      {/* ── Key Highlights ── */}
      <SectionCard title="Key Highlights (metrics band)">
        <StringList label="Highlight items" items={data.keyHighlights}
          onChange={v => set("keyHighlights", v)}
          placeholder="Add highlight…" />
      </SectionCard>

      {/* ── Corporate Solutions ── */}
      <SectionCard title="Corporate Solutions (card grid)">
        <CardList label="Solution cards (Title + Link)"
          items={data.corporateSolutions}
          onChange={v => set("corporateSolutions", v)} />
      </SectionCard>

      {/* ── Educational Solutions ── */}
      <SectionCard title="Educational Solutions (card grid)">
        <CardList label="Solution cards (Title + Link)"
          items={data.educationalSolutions}
          onChange={v => set("educationalSolutions", v)} />
      </SectionCard>

      {/* ── Why Us ── */}
      <SectionCard title="Why KVJ Analytics Section">
        <Field label="Strapline (bold heading)" value={data.whyUs.strapline}
          onChange={v => set("whyUs", { ...data.whyUs, strapline: v })}
          placeholder={FALLBACK_HOME_PAGE.whyUs.strapline} />
        <Field label="Body paragraph" value={data.whyUs.body} rows={3}
          onChange={v => set("whyUs", { ...data.whyUs, body: v })} />
      </SectionCard>

      {/* ── CTA Section ── */}
      <SectionCard title="Closing CTA Section">
        <Field label="CTA title" value={data.cta?.title ?? ""}
          onChange={v => set("cta", { ...(data.cta!), title: v })} />
        <Field label="CTA description" value={data.cta?.description ?? ""} rows={2}
          onChange={v => set("cta", { ...(data.cta!), description: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary button text" value={data.cta?.primaryCtaText ?? ""}
            onChange={v => set("cta", { ...(data.cta!), primaryCtaText: v })} />
          <Field label="Primary button link" value={data.cta?.primaryCtaHref ?? ""}
            onChange={v => set("cta", { ...(data.cta!), primaryCtaHref: v })} />
          <Field label="Secondary button text" value={data.cta?.secondaryCtaText ?? ""}
            onChange={v => set("cta", { ...(data.cta!), secondaryCtaText: v })} />
          <Field label="Secondary button link" value={data.cta?.secondaryCtaHref ?? ""}
            onChange={v => set("cta", { ...(data.cta!), secondaryCtaHref: v })} />
        </div>
      </SectionCard>

      {/* ── Regions Served ── */}
      <SectionCard title="Regions Served (marquee strip)">
        <StringList label="Region / country names"
          items={data.regionsServed ?? []}
          onChange={v => set("regionsServed", v)}
          placeholder="Add region…" />
      </SectionCard>
    </div>
  );
}

// ─── Generic editor for other pages ──────────────────────────────────────────

function GenericEditor({
  slug, data, onChange,
}: { slug: string; data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const [raw, setRaw] = useState(JSON.stringify(data, null, 2));
  const [parseErr, setParseErr] = useState("");

  useEffect(() => { setRaw(JSON.stringify(data, null, 2)); }, [data]);

  const handleChange = (v: string) => {
    setRaw(v);
    try { onChange(JSON.parse(v)); setParseErr(""); }
    catch { setParseErr("Invalid JSON — fix before saving."); }
  };

  return (
    <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">
        Raw JSON editor — {slug}
      </h3>
      <p className="text-xs text-slate">
        For this page, paste the full content JSON. Structured editors will be added in a future phase.
      </p>
      <textarea rows={20} value={raw} onChange={e => handleChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-xs font-mono transition-all resize-y" />
      {parseErr && <p className="text-xs font-semibold text-error">{parseErr}</p>}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function AdminContentPage() {
  const router  = useRouter();
  const pathname = usePathname();

  const [selectedSlug, setSelectedSlug] = useState<PageSlug>("home");
  const [homeData,     setHomeData]     = useState<HomeData>(DEFAULT_HOME);
  const [genericData,  setGenericData]  = useState<Record<string, unknown>>({});
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [saveOk,   setSaveOk]   = useState(false);
  const [error,    setError]    = useState("");

  // Load content whenever slug changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(""); setSaveOk(false);

    fetch(`/api/admin/content/${selectedSlug}`)
      .then(r => {
        if (r.status === 401) { router.push("/admin"); return null; }
        return r.json();
      })
      .then(data => {
        if (!data || cancelled) return;
        if (selectedSlug === "home") {
          // Deep merge stored over defaults
          const stored = data.stored as Partial<HomeData>;
          setHomeData(prev => ({
            hero: { ...DEFAULT_HOME.hero, ...(stored.hero ?? {}) },
            keyHighlights:        stored.keyHighlights?.length        ? stored.keyHighlights        : DEFAULT_HOME.keyHighlights,
            corporateSolutions:   stored.corporateSolutions?.length   ? stored.corporateSolutions   : DEFAULT_HOME.corporateSolutions,
            educationalSolutions: stored.educationalSolutions?.length ? stored.educationalSolutions : DEFAULT_HOME.educationalSolutions,
            whyUs: { ...DEFAULT_HOME.whyUs, ...(stored.whyUs ?? {}) },
            cta:   stored.cta   ?? DEFAULT_HOME.cta,
            regionsServed: stored.regionsServed?.length ? stored.regionsServed : DEFAULT_HOME.regionsServed,
          }));
        } else {
          setGenericData(data.stored ?? {});
        }
      })
      .catch(() => setError("Failed to load content."))
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [selectedSlug, router]);

  const handleSave = async () => {
    setSaving(true); setError(""); setSaveOk(false);
    const payload = selectedSlug === "home" ? homeData : genericData;
    try {
      const res = await fetch(`/api/admin/content/${selectedSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-surface font-body">

      {/* ── Top Header ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-line shadow-soft px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
            <span className="text-xs font-bold text-slate uppercase tracking-wider">Content Editor</span>
          </div>
          <h1 className="text-xl font-bold font-display text-ink mt-0.5">
            KVJ Analytics — Website Content
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {saveOk && (
            <span className="flex items-center gap-1.5 text-sm font-bold text-success bg-success/10 border border-success/30 px-3 py-1.5 rounded-lg">
              <Check className="w-4 h-4" /> Saved!
            </span>
          )}
          <Button onClick={handleSave} disabled={saving || loading}
            className="px-5 py-2.5 bg-brand text-white font-bold text-sm flex items-center gap-2 rounded-btn">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Page"}
          </Button>
          <Button onClick={handleLogout} variant="ghost"
            className="px-3 py-2 text-sm text-error hover:bg-error/5 flex items-center gap-1.5">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* ── Nav tabs ── */}
      <div className="bg-white border-b border-line px-6">
        <div className="flex flex-wrap gap-1">
          {NAV_TABS.map(tab => (
            <Link key={tab.href} href={tab.href}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                pathname === tab.href || (tab.href === "/admin/content" && pathname.startsWith("/admin/content"))
                  ? "border-brand text-brand font-bold"
                  : "border-transparent text-slate hover:text-ink"
              }`}>
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mx-6 mt-4 bg-error/5 border border-error/20 p-4 rounded-lg flex items-start gap-3 text-error">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="flex" style={{ minHeight: "calc(100vh - 132px)" }}>

        {/* Left sidebar — page list */}
        <aside className="w-60 shrink-0 border-r border-line bg-white p-4 space-y-1 sticky top-[132px] self-start h-[calc(100vh-132px)] overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate px-3 pb-2 border-b border-line mb-2">
            Pages
          </p>
          {PAGES.map(p => (
            <button key={p.slug} onClick={() => setSelectedSlug(p.slug)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                selectedSlug === p.slug
                  ? "bg-brand/10 text-brand border border-brand/20"
                  : "text-slate hover:bg-surface hover:text-ink"
              }`}>
              {p.icon}
              <span className="flex-1">{p.label}</span>
              {selectedSlug === p.slug && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </button>
          ))}

          <div className="pt-4 border-t border-line mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate px-3 mb-2">Live site</p>
            {PAGES.map(p => (
              <a key={p.slug} href={p.slug === "home" ? "/" : `/${p.slug}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate hover:text-brand transition-colors">
                ↗ View {p.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Right canvas — editor */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand" />
              <span className="text-sm font-semibold text-slate">Loading content…</span>
            </div>
          ) : selectedSlug === "home" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">Home Page</h2>
                  <p className="text-xs text-slate mt-0.5">
                    Empty fields fall back to the CEO-approved copy automatically.
                  </p>
                </div>
                <a href="/" target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  ↗ Preview live page
                </a>
              </div>
              <HomeEditor data={homeData} onChange={setHomeData} />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink capitalize">
                    {PAGES.find(p => p.slug === selectedSlug)?.label} Page
                  </h2>
                  <p className="text-xs text-slate mt-0.5">
                    Structured editor for this page is coming in a future phase. Use the JSON editor below.
                  </p>
                </div>
              </div>
              <GenericEditor slug={selectedSlug} data={genericData} onChange={setGenericData} />
            </>
          )}

          {/* Save button also at bottom for convenience */}
          <div className="sticky bottom-6 mt-8 flex justify-end">
            <Button onClick={handleSave} disabled={saving || loading}
              className="px-6 py-3 bg-brand text-white font-bold text-sm flex items-center gap-2 rounded-btn shadow-lg">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : "Save Page"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
