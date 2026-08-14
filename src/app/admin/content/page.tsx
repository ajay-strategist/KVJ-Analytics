"use client";

/**
 * /admin/content — Page Content Editor
 * Left sidebar: page list. Right canvas: structured form for selected page.
 * Saves full JSON via PUT /api/admin/content/[slug].
 * Image uploads via POST /api/admin/upload.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle, ArrowDown, ArrowUp, Check, ChevronRight,
  FileText, ImageIcon, Loader2, Plus, Save, Trash2, X,
  Settings, ExternalLink, Building2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageField } from "@/components/admin/ImageField";
import {
  FALLBACK_HOME_PAGE,
  FALLBACK_SITE_SETTINGS,
  FALLBACK_ABOUT,
  FALLBACK_CORPORATE,
  FALLBACK_EDUCATION,
  FALLBACK_PRODUCTS_PAGE,
  FALLBACK_CONTACT,
  FALLBACK_TRAINING_HUB
} from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardItem { title: string; href: string }
interface CtaItem  { label: string; href: string }

interface SolutionCardV3 { title: string; points: string[] }
interface WhyCardV3 { title: string; body: string }
interface ApproachStepV3 { no: string; title: string; body: string }

interface HomeData {
  hero: {
    badge: string;
    headline: string;
    supporting: string;
    description: string;
    primaryCta: CtaItem;
    secondaryCta: CtaItem;
  };
  trustedBy: { heading: string; logos: string[] };
  solutions: { heading: string; description: string; cards: SolutionCardV3[]; cta: CtaItem };
  whyUs: { heading: string; cards: WhyCardV3[] };
  industries: { heading: string; items: string[] };
  approach: { heading: string; steps: ApproachStepV3[] };
  successStories: { heading: string; items: string[]; cta: CtaItem };
  insights: { heading: string; cta: CtaItem };
  finalCta: { title: string; description: string; primaryCta: CtaItem; secondaryCta: CtaItem };
}

/** Reusable bottom call-to-action block shared by About / Corporate / Education. */
interface CtaData {
  title: string;
  description: string;
  primaryText: string;
  primaryHref: string;
  secondaryText?: string;
  secondaryHref?: string;
}

/** Side "request/partner" card on Product & Education detail pages. */
interface SideCardData {
  title: string;
  description: string;
  bullets: string[];
  buttonText: string;
}

interface AboutData {
  title: string;
  intro: string;
  specializations: any[];
  reachLine: string;
  impact: string[];
  vision: { heading: string; body: string };
  cta?: CtaData;
}

interface ServiceItem {
  title: string;
  slug: string;
  shortDescription: string;
  details: string[];
}

interface CorporateData {
  heading: string;
  strapline: string;
  intro: string;
  services: ServiceItem[];
  cta?: CtaData;
}

interface EducationData {
  heading: string;
  strapline: string;
  intro: string;
  services: ServiceItem[];
  cta?: CtaData;
  partnerCard?: SideCardData;
}

interface ProductItem {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  keyFeatures: string[];
  animationStyle?: string;       // preset key from the built-in library
  customAnimationHtml?: string;  // optional pasted HTML/SVG (rendered sandboxed)
}

/** Built-in animation presets available to pick per card (matches HOLOGRAM_MAP). */
const ANIMATION_PRESETS: { value: string; label: string }[] = [
  { value: "", label: "Default (auto)" },
  { value: "protrix", label: "Microchip / Protrix" },
  { value: "grade-scope", label: "Bar Chart / GradeScope" },
  { value: "globe-database", label: "Globe + Database" },
  { value: "secure-shield", label: "Security Shield" },
  { value: "data-pipeline", label: "Data Pipeline" },
  { value: "ai-brain", label: "AI Brain" },
  { value: "executive-radar", label: "Executive Radar" },
  { value: "financial-donut", label: "Financial Donut" },
  { value: "performance-gauge", label: "Performance Gauge" },
  { value: "predictive-forecast", label: "Predictive Forecast" },
  { value: "tech-ecosystem", label: "Tech Ecosystem" },
  { value: "time-scheduler", label: "Time Scheduler" },
  { value: "custom", label: "Custom (paste HTML below)" },
];

interface ProductsPageData {
  heading: string;
  intro: string;
  products: ProductItem[];
  demoCard?: SideCardData;
}

interface ContactData {
  heading: string;
  strapline: string;
  intro: string;
  inquiryAreas: string[];
}

type PageSlug = string;

interface PageMeta { slug: PageSlug; label: string; icon: React.ReactNode; href?: string }

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGES: PageMeta[] = [
  { slug: "home",          label: "Home",                  icon: <FileText className="w-4 h-4" /> },
  { slug: "about",         label: "About Us",              icon: <FileText className="w-4 h-4" /> },
  { slug: "corporate",     label: "Corporate Solutions",   icon: <FileText className="w-4 h-4" /> },
  { slug: "education",     label: "Educational Solutions", icon: <FileText className="w-4 h-4" /> },
  { slug: "products",      label: "Products",              icon: <FileText className="w-4 h-4" /> },
  { slug: "contact",       label: "Contact",               icon: <FileText className="w-4 h-4" /> },
  { slug: "training",      label: "Training Hub",          icon: <FileText className="w-4 h-4" />, href: "/training" },
  { slug: "online-courses", label: "Online Courses",       icon: <FileText className="w-4 h-4" />, href: "/training/online-courses" },
  { slug: "internships",   label: "Internships",           icon: <FileText className="w-4 h-4" />, href: "/training/internships" },
  { slug: "training-corporate", label: "Training · Corporate", icon: <FileText className="w-4 h-4" />, href: "/training/corporate" },
  { slug: "training-colleges",  label: "Training · Colleges",  icon: <FileText className="w-4 h-4" />, href: "/training/colleges" },
  { slug: "training-one-to-one", label: "Training · One-to-One", icon: <FileText className="w-4 h-4" />, href: "/training/one-to-one" },
  { slug: "careers",       label: "Careers",               icon: <FileText className="w-4 h-4" />, href: "/careers" },
  { slug: "blog",          label: "Blog (header)",         icon: <FileText className="w-4 h-4" />, href: "/blog" },
  { slug: "impact",        label: "Impact",                icon: <FileText className="w-4 h-4" />, href: "/impact" },
  { slug: "privacy",       label: "Privacy Policy",        icon: <FileText className="w-4 h-4" />, href: "/privacy" },
  { slug: "terms",         label: "Terms & Conditions",    icon: <FileText className="w-4 h-4" />, href: "/terms" },
  { slug: "site-settings", label: "Global Settings",       icon: <Settings className="w-4 h-4" /> },
];

const DEFAULT_HOME: HomeData = JSON.parse(JSON.stringify(FALLBACK_HOME_PAGE)) as HomeData;

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
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 border border-line rounded hover:bg-surface disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5 text-slate" /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1.5 border border-line rounded hover:bg-surface disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5 text-slate" /></button>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1.5 border border-error/20 rounded hover:bg-error/5 text-error"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ""])}
          className="flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors">
          <Plus className="w-4 h-4" /> {placeholder}
        </button>
      </div>
    </div>
  );
}

function SpecializationsList({
  label, items, onChange, placeholder = "Add specialization…",
}: {
  label: string;
  items: any[];
  onChange: (v: any[]) => void;
  placeholder?: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const n = [...items];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };

  const icons = [
    { value: "report", label: "Report (FileText)" },
    { value: "dashboard", label: "Dashboard (BarChart)" },
    { value: "visualization", label: "Visualization (PieChart)" },
    { value: "spreadsheet", label: "Spreadsheet (Table)" },
    { value: "process", label: "Process (Settings)" },
    { value: "training", label: "Training (GraduationCap)" },
    { value: "education", label: "Education (Laptop)" },
    { value: "cpu", label: "Tech (Cpu)" },
    { value: "chart", label: "Line Chart" },
    { value: "activity", label: "Activity" },
    { value: "workflow", label: "Workflow" },
    { value: "database", label: "Database" },
    { value: "layers", label: "Layers" },
    { value: "sliders", label: "Sliders" },
  ];

  const normalizeItem = (item: any) => {
    if (!item) return { label: "", icon: "chart" };
    if (typeof item === "string") {
      let icon = "chart";
      const text = item.toLowerCase();
      if (text.includes("report")) icon = "report";
      else if (text.includes("dashboard")) icon = "dashboard";
      else if (text.includes("visual")) icon = "visualization";
      else if (text.includes("sheet") || text.includes("excel")) icon = "spreadsheet";
      else if (text.includes("process") || text.includes("automation")) icon = "process";
      else if (text.includes("train") || text.includes("consult")) icon = "training";
      else if (text.includes("edu") || text.includes("technology")) icon = "education";
      return { label: item, icon };
    }
    return {
      label: item.label || item.name || item.title || "",
      icon: item.icon || "chart",
    };
  };

  const normalizedItems = (items || []).map(normalizeItem);

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate mb-2">{label}</label>
      <div className="space-y-3">
        {normalizedItems.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={val.label}
              onChange={e => {
                const n = [...normalizedItems];
                n[i] = { ...n[i], label: e.target.value };
                onChange(n);
              }}
              placeholder="Name / Label"
              className="flex-1 px-3 py-2 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
            <select
              value={val.icon}
              onChange={e => {
                const n = [...normalizedItems];
                n[i] = { ...n[i], icon: e.target.value };
                onChange(n);
              }}
              className="px-3 py-2 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            >
              {icons.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              className="p-1.5 border border-line rounded hover:bg-surface disabled:opacity-30 shrink-0"
            >
              <ArrowUp className="w-3.5 h-3.5 text-slate" />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === normalizedItems.length - 1}
              className="p-1.5 border border-line rounded hover:bg-surface disabled:opacity-30 shrink-0"
            >
              <ArrowDown className="w-3.5 h-3.5 text-slate" />
            </button>
            <button
              type="button"
              onClick={() => onChange(normalizedItems.filter((_, j) => j !== i))}
              className="p-1.5 border border-error/20 rounded hover:bg-error/5 text-error shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...normalizedItems, { label: "", icon: "chart" }])}
          className="flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors"
        >
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
              <button type="button" onClick={() => move(i, -1)} disabled={i===0} className="p-1 border border-line rounded hover:bg-surface disabled:opacity-30"><ArrowUp className="w-3 h-3 text-slate" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i===items.length-1} className="p-1 border border-line rounded hover:bg-surface disabled:opacity-30"><ArrowDown className="w-3 h-3 text-slate" /></button>
            </div>
            <button type="button" onClick={() => onChange(items.filter((_,j) => j!==i))} className="p-1.5 border border-error/20 rounded hover:bg-error/5 text-error"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { title: "", href: "" }])}
          className="flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors">
          <Plus className="w-4 h-4" /> Add card
        </button>
      </div>
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")          // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start of text
    .replace(/-+$/, "");            // Trim - from end of text
}

function ServiceList({
  label, items, onChange,
}: { label: string; items: ServiceItem[]; onChange: (v: ServiceItem[]) => void }) {
  const move = (i: number, dir: -1 | 1) => {
    const n = [...items]; const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; onChange(n);
  };
  return (
    <div className="space-y-4">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate">{label}</label>
      <div className="space-y-4">
        {items.map((srv, i) => (
          <div key={i} className="bg-surface p-4 rounded-xl border border-line space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate uppercase tracking-wider">Service Card #{i+1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 border border-line rounded bg-white hover:bg-surface disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5 text-slate" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 border border-line rounded bg-white hover:bg-surface disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5 text-slate" /></button>
                <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1 border border-error/20 rounded bg-white hover:bg-error/5 text-error"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Service Title" value={srv.title} onChange={v => {
                const n = [...items];
                const oldTitle = srv.title;
                const oldSlug = srv.slug;
                const isAutoSlug = !oldSlug || oldSlug === slugify(oldTitle);
                n[i] = {
                  ...n[i],
                  title: v,
                  slug: isAutoSlug ? slugify(v) : oldSlug
                };
                onChange(n);
              }} />
              <Field label="Slug (e.g. report-automation)" value={srv.slug} onChange={v => {
                const n = [...items]; n[i] = { ...n[i], slug: v }; onChange(n);
              }} />
            </div>
            <Field label="Short Description" value={srv.shortDescription} rows={2} onChange={v => {
              const n = [...items]; n[i] = { ...n[i], shortDescription: v }; onChange(n);
            }} />
            <StringList label="Detail Capabilities & Outcomes" items={srv.details || []} onChange={v => {
              const n = [...items]; n[i] = { ...n[i], details: v }; onChange(n);
            }} placeholder="Add capability bullet…" />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { title: "", slug: "", shortDescription: "", details: [] }])}
          className="flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors">
          <Plus className="w-4 h-4" /> Add service card
        </button>
      </div>
    </div>
  );
}

function ProductList({
  label, items, onChange,
}: { label: string; items: ProductItem[]; onChange: (v: ProductItem[]) => void }) {
  const move = (i: number, dir: -1 | 1) => {
    const n = [...items]; const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]]; onChange(n);
  };
  return (
    <div className="space-y-4">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate">{label}</label>
      <div className="space-y-4">
        {items.map((prod, i) => (
          <div key={i} className="bg-surface p-4 rounded-xl border border-line space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate uppercase tracking-wider">Product #{i+1}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 border border-line rounded bg-white hover:bg-surface disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5 text-slate" /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 border border-line rounded bg-white hover:bg-surface disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5 text-slate" /></button>
                <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1 border border-error/20 rounded bg-white hover:bg-error/5 text-error"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Product Name" value={prod.name} onChange={v => {
                const n = [...items];
                const oldName = prod.name;
                const oldSlug = prod.slug;
                const isAutoSlug = !oldSlug || oldSlug === slugify(oldName);
                n[i] = {
                  ...n[i],
                  name: v,
                  slug: isAutoSlug ? slugify(v) : oldSlug
                };
                onChange(n);
              }} />
              <Field label="Slug (e.g. grade-scope)" value={prod.slug} onChange={v => {
                const n = [...items]; n[i] = { ...n[i], slug: v }; onChange(n);
              }} />
            </div>
            <Field label="Tagline" value={prod.tagline} onChange={v => {
              const n = [...items]; n[i] = { ...n[i], tagline: v }; onChange(n);
            }} />
            <Field label="Description" value={prod.description} rows={3} onChange={v => {
              const n = [...items]; n[i] = { ...n[i], description: v }; onChange(n);
            }} />
            <StringList label="Key Platform Features" items={prod.keyFeatures || []} onChange={v => {
              const n = [...items]; n[i] = { ...n[i], keyFeatures: v }; onChange(n);
            }} placeholder="Add platform feature…" />

            {/* Animation slot — pick a preset from the library, or paste custom HTML */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate mb-1">Card Animation</label>
              <select
                value={prod.animationStyle || ""}
                onChange={e => { const n = [...items]; n[i] = { ...n[i], animationStyle: e.target.value }; onChange(n); }}
                className="w-full px-3 py-2 rounded-input border border-line bg-white focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              >
                {ANIMATION_PRESETS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {prod.animationStyle === "custom" && (
                <>
                  <textarea
                    value={prod.customAnimationHtml || ""}
                    onChange={e => { const n = [...items]; n[i] = { ...n[i], customAnimationHtml: e.target.value }; onChange(n); }}
                    rows={5}
                    placeholder="Paste HTML/SVG animation (e.g. generated with Gemini). It renders in a sandboxed frame."
                    className="mt-2 w-full px-3 py-2 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand text-xs font-mono resize-y"
                  />
                  <p className="mt-1 text-[11px] text-slate">Runs isolated in a sandboxed frame — it can&apos;t affect the rest of the site.</p>
                </>
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { name: "", slug: "", tagline: "", description: "", keyFeatures: [] }])}
          className="flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors">
          <Plus className="w-4 h-4" /> Add product platform
        </button>
      </div>
    </div>
  );
}

// ─── Clients Preview (auto-sourced logos) ─────────────────────────────────────

/**
 * Read-only widget shown inside the "Trusted By" section of the Home CMS editor.
 * Logos are pulled automatically from the admin-managed Clients module — no manual
 * entry needed. Shows a live preview of active clients (logo if available, name
 * otherwise) and a link to manage them.
 */
function ClientsPreview() {
  const [clients, setClients] = useState<{ id: string; name: string; logo_url: string | null; is_active: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/admin/clients")
      .then(r => r.json())
      .then(data => {
        setClients(
          (data.clients ?? []).filter((c: any) => c.is_active)
        );
      })
      .catch(() => setErr("Could not load clients."))
      .finally(() => setLoading(false));
  }, []);

  const isDirectImage = (u?: string | null) =>
    !!u && typeof u === "string" && u.trim().length > 0 &&
    (/^https?:\/\//i.test(u) || u.startsWith("/"));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate">
          Logos (from Clients module)
        </label>
        <a
          href="/admin/clients"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
        >
          Manage clients <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="rounded-xl border border-line bg-surface/40 p-4">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading clients…
          </div>
        )}
        {!loading && err && (
          <p className="text-xs text-red-500">{err}</p>
        )}
        {!loading && !err && clients.length === 0 && (
          <p className="text-xs text-slate">
            No active clients yet.{" "}
            <a href="/admin/clients" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">
              Add clients →
            </a>
          </p>
        )}
        {!loading && !err && clients.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {clients.map(c => (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 shadow-sm"
              >
                {isDirectImage(c.logo_url) ? (
                  <img
                    src={c.logo_url!}
                    alt={c.name}
                    className="h-6 max-w-[80px] object-contain"
                  />
                ) : (
                  <Building2 className="w-4 h-4 text-slate/60 shrink-0" />
                )}
                <span className="text-xs font-medium text-ink leading-tight max-w-[120px] truncate">{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate leading-snug">
        ✦ Logos are automatically sourced from the{" "}
        <a href="/admin/clients" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline font-semibold">
          Clients
        </a>{" "}
        module. To add or remove a logo from this section, edit the client there.
      </p>
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

  const setSolCard = (i: number, patch: Partial<SolutionCardV3>) => {
    const cards = data.solutions.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    set("solutions", { ...data.solutions, cards });
  };
  const setWhyCard = (i: number, patch: Partial<WhyCardV3>) => {
    const cards = data.whyUs.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    set("whyUs", { ...data.whyUs, cards });
  };
  const setStep = (i: number, patch: Partial<ApproachStepV3>) => {
    const steps = data.approach.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    set("approach", { ...data.approach, steps });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Hero">
        <Field label="Badge (use • as separator)" value={data.hero.badge}
          onChange={v => set("hero", { ...data.hero, badge: v })} />
        <Field label="Headline *" value={data.hero.headline}
          onChange={v => set("hero", { ...data.hero, headline: v })} />
        <Field label="Supporting heading" value={data.hero.supporting} rows={2}
          onChange={v => set("hero", { ...data.hero, supporting: v })} />
        <Field label="Description" value={data.hero.description} rows={3}
          onChange={v => set("hero", { ...data.hero, description: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary CTA label" value={data.hero.primaryCta.label}
            onChange={v => set("hero", { ...data.hero, primaryCta: { ...data.hero.primaryCta, label: v } })} />
          <Field label="Primary CTA link" value={data.hero.primaryCta.href}
            onChange={v => set("hero", { ...data.hero, primaryCta: { ...data.hero.primaryCta, href: v } })} />
          <Field label="Secondary CTA label" value={data.hero.secondaryCta.label}
            onChange={v => set("hero", { ...data.hero, secondaryCta: { ...data.hero.secondaryCta, label: v } })} />
          <Field label="Secondary CTA link" value={data.hero.secondaryCta.href}
            onChange={v => set("hero", { ...data.hero, secondaryCta: { ...data.hero.secondaryCta, href: v } })} />
        </div>
      </SectionCard>

      <SectionCard title="Trusted By (logos only)">
        <Field label="Heading" value={data.trustedBy.heading}
          onChange={v => set("trustedBy", { ...data.trustedBy, heading: v })} />
        <ClientsPreview />
      </SectionCard>

      <SectionCard title="Our Solutions">
        <Field label="Heading" value={data.solutions.heading}
          onChange={v => set("solutions", { ...data.solutions, heading: v })} />
        <Field label="Description" value={data.solutions.description} rows={2}
          onChange={v => set("solutions", { ...data.solutions, description: v })} />
        {data.solutions.cards.map((card, i) => (
          <div key={i} className="rounded-xl border border-line p-4 space-y-3">
            <Field label={`Card ${i + 1} title`} value={card.title} onChange={v => setSolCard(i, { title: v })} />
            <StringList label="Points" items={card.points} onChange={v => setSolCard(i, { points: v })} placeholder="Add point…" />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA label" value={data.solutions.cta.label}
            onChange={v => set("solutions", { ...data.solutions, cta: { ...data.solutions.cta, label: v } })} />
          <Field label="CTA link" value={data.solutions.cta.href}
            onChange={v => set("solutions", { ...data.solutions, cta: { ...data.solutions.cta, href: v } })} />
        </div>
      </SectionCard>

      <SectionCard title="Why KVJ Analytics">
        <Field label="Heading" value={data.whyUs.heading}
          onChange={v => set("whyUs", { ...data.whyUs, heading: v })} />
        {data.whyUs.cards.map((card, i) => (
          <div key={i} className="grid grid-cols-2 gap-4">
            <Field label={`Card ${i + 1} title`} value={card.title} onChange={v => setWhyCard(i, { title: v })} />
            <Field label="One-line body" value={card.body} onChange={v => setWhyCard(i, { body: v })} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Industries">
        <Field label="Heading" value={data.industries.heading}
          onChange={v => set("industries", { ...data.industries, heading: v })} />
        <StringList label="Industry names" items={data.industries.items}
          onChange={v => set("industries", { ...data.industries, items: v })} placeholder="Add industry…" />
      </SectionCard>

      <SectionCard title="Our Approach">
        <Field label="Heading" value={data.approach.heading}
          onChange={v => set("approach", { ...data.approach, heading: v })} />
        {data.approach.steps.map((step, i) => (
          <div key={i} className="grid grid-cols-[70px_1fr] gap-4">
            <Field label="No." value={step.no} onChange={v => setStep(i, { no: v })} />
            <Field label="Title" value={step.title} onChange={v => setStep(i, { title: v })} />
            <div className="col-span-2">
              <Field label="One-line body" value={step.body} onChange={v => setStep(i, { body: v })} />
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Success Stories (outcomes)">
        <Field label="Heading" value={data.successStories.heading}
          onChange={v => set("successStories", { ...data.successStories, heading: v })} />
        <StringList label="Outcome statements" items={data.successStories.items}
          onChange={v => set("successStories", { ...data.successStories, items: v })} placeholder="Add outcome…" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA label" value={data.successStories.cta.label}
            onChange={v => set("successStories", { ...data.successStories, cta: { ...data.successStories.cta, label: v } })} />
          <Field label="CTA link" value={data.successStories.cta.href}
            onChange={v => set("successStories", { ...data.successStories, cta: { ...data.successStories.cta, href: v } })} />
        </div>
      </SectionCard>

      <SectionCard title="Insights">
        <Field label="Heading" value={data.insights.heading}
          onChange={v => set("insights", { ...data.insights, heading: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA label" value={data.insights.cta.label}
            onChange={v => set("insights", { ...data.insights, cta: { ...data.insights.cta, label: v } })} />
          <Field label="CTA link" value={data.insights.cta.href}
            onChange={v => set("insights", { ...data.insights, cta: { ...data.insights.cta, href: v } })} />
        </div>
      </SectionCard>

      <SectionCard title="Final CTA">
        <Field label="Title" value={data.finalCta.title}
          onChange={v => set("finalCta", { ...data.finalCta, title: v })} />
        <Field label="Description" value={data.finalCta.description} rows={2}
          onChange={v => set("finalCta", { ...data.finalCta, description: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary button text" value={data.finalCta.primaryCta.label}
            onChange={v => set("finalCta", { ...data.finalCta, primaryCta: { ...data.finalCta.primaryCta, label: v } })} />
          <Field label="Primary button link" value={data.finalCta.primaryCta.href}
            onChange={v => set("finalCta", { ...data.finalCta, primaryCta: { ...data.finalCta.primaryCta, href: v } })} />
          <Field label="Secondary button text" value={data.finalCta.secondaryCta.label}
            onChange={v => set("finalCta", { ...data.finalCta, secondaryCta: { ...data.finalCta.secondaryCta, label: v } })} />
          <Field label="Secondary button link" value={data.finalCta.secondaryCta.href}
            onChange={v => set("finalCta", { ...data.finalCta, secondaryCta: { ...data.finalCta.secondaryCta, href: v } })} />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── About Editor ────────────────────────────────────────────────────────────

const DEFAULT_CTA: CtaData = {
  title: "", description: "", primaryText: "", primaryHref: "/contact", secondaryText: "", secondaryHref: "",
};

/** Editor for the shared bottom call-to-action block. */
function CtaEditor({ cta, onChange }: { cta?: CtaData; onChange: (c: CtaData) => void }) {
  const c = { ...DEFAULT_CTA, ...(cta || {}) };
  const set = <K extends keyof CtaData>(k: K, v: CtaData[K]) => onChange({ ...c, [k]: v });
  return (
    <SectionCard title="Bottom Call-to-Action">
      <Field label="CTA Heading" value={c.title} onChange={v => set("title", v)} />
      <Field label="CTA Description" value={c.description} rows={2} onChange={v => set("description", v)} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary Button Label" value={c.primaryText} onChange={v => set("primaryText", v)} />
        <Field label="Primary Button Link" value={c.primaryHref} onChange={v => set("primaryHref", v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Secondary Button Label (optional)" value={c.secondaryText ?? ""} onChange={v => set("secondaryText", v)} />
        <Field label="Secondary Button Link (optional)" value={c.secondaryHref ?? ""} onChange={v => set("secondaryHref", v)} />
      </div>
    </SectionCard>
  );
}

const DEFAULT_SIDE_CARD: SideCardData = { title: "", description: "", bullets: [], buttonText: "" };

/** Editor for a Product/Education detail-page side card. */
function SideCardEditor({ title, card, onChange }: { title: string; card?: SideCardData; onChange: (c: SideCardData) => void }) {
  const c = { ...DEFAULT_SIDE_CARD, ...(card || {}) };
  const set = <K extends keyof SideCardData>(k: K, v: SideCardData[K]) => onChange({ ...c, [k]: v });
  return (
    <SectionCard title={title}>
      <Field label="Card Heading" value={c.title} onChange={v => set("title", v)} />
      <Field label="Card Description" value={c.description} rows={3} onChange={v => set("description", v)} />
      <StringList label="Bullet points" items={c.bullets} onChange={v => set("bullets", v)} placeholder="Add a bullet…" />
      <Field label="Button Label" value={c.buttonText} onChange={v => set("buttonText", v)} />
    </SectionCard>
  );
}

function AboutEditor({
  data, onChange,
}: { data: AboutData; onChange: (d: AboutData) => void }) {
  const set = useCallback(
    <K extends keyof AboutData>(key: K, value: AboutData[K]) =>
      onChange({ ...data, [key]: value }),
    [data, onChange]
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Header Info">
        <Field label="About Page Title" value={data.title} onChange={v => set("title", v)} />
        <Field label="Intro Paragraph" value={data.intro} rows={4} onChange={v => set("intro", v)} />
      </SectionCard>
      <SectionCard title="Core Skills & Focus Areas">
        <SpecializationsList label="Specializations" items={data.specializations} onChange={v => set("specializations", v)} placeholder="Add specialization…" />
      </SectionCard>
      <SectionCard title="Track Record (Metrics Band)">
        <Field label="Reach Description" value={data.reachLine} rows={2} onChange={v => set("reachLine", v)} />
        <StringList label="Impact Metrics Labels" items={data.impact} onChange={v => set("impact", v)} placeholder="Add metric label…" />
      </SectionCard>
      <SectionCard title="Company Vision">
        <Field label="Vision Heading" value={data.vision.heading} onChange={v => set("vision", { ...data.vision, heading: v })} />
        <Field label="Vision Description" value={data.vision.body} rows={3} onChange={v => set("vision", { ...data.vision, body: v })} />
      </SectionCard>
      <CtaEditor cta={data.cta} onChange={v => set("cta", v)} />
    </div>
  );
}

// ─── Corporate Editor ──────────────────────────────────────────────────────────

function CorporateEditor({
  data, onChange,
}: { data: CorporateData; onChange: (d: CorporateData) => void }) {
  const set = useCallback(
    <K extends keyof CorporateData>(key: K, value: CorporateData[K]) =>
      onChange({ ...data, [key]: value }),
    [data, onChange]
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Header Section">
        <Field label="Page Heading" value={data.heading} onChange={v => set("heading", v)} />
        <Field label="Strapline (Subheading)" value={data.strapline} onChange={v => set("strapline", v)} />
        <Field label="Introduction" value={data.intro} rows={3} onChange={v => set("intro", v)} />
      </SectionCard>
      <SectionCard title="Corporate Services list">
        <ServiceList label="Edit service card contents" items={data.services || []} onChange={v => set("services", v)} />
      </SectionCard>
      <CtaEditor cta={data.cta} onChange={v => set("cta", v)} />
    </div>
  );
}

// ─── Education Editor ──────────────────────────────────────────────────────────

function EducationEditor({
  data, onChange,
}: { data: EducationData; onChange: (d: EducationData) => void }) {
  const set = useCallback(
    <K extends keyof EducationData>(key: K, value: EducationData[K]) =>
      onChange({ ...data, [key]: value }),
    [data, onChange]
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Header Section">
        <Field label="Page Heading" value={data.heading} onChange={v => set("heading", v)} />
        <Field label="Strapline (Subheading)" value={data.strapline} onChange={v => set("strapline", v)} />
        <Field label="Introduction" value={data.intro} rows={3} onChange={v => set("intro", v)} />
      </SectionCard>
      <SectionCard title="Educational Solutions list">
        <ServiceList label="Edit solution cards" items={data.services || []} onChange={v => set("services", v)} />
      </SectionCard>
      <SideCardEditor title="Detail-page “Partner With Us” card" card={data.partnerCard} onChange={v => set("partnerCard", v)} />
      <CtaEditor cta={data.cta} onChange={v => set("cta", v)} />
    </div>
  );
}

// ─── Products Editor ──────────────────────────────────────────────────────────

function ProductsEditor({
  data, onChange,
}: { data: ProductsPageData; onChange: (d: ProductsPageData) => void }) {
  const set = useCallback(
    <K extends keyof ProductsPageData>(key: K, value: ProductsPageData[K]) =>
      onChange({ ...data, [key]: value }),
    [data, onChange]
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Header Section">
        <Field label="Page Heading" value={data.heading} onChange={v => set("heading", v)} />
        <Field label="Introduction Line" value={data.intro} onChange={v => set("intro", v)} />
      </SectionCard>
      <SectionCard title="Software Products list">
        <ProductList label="Edit software products" items={data.products || []} onChange={v => set("products", v)} />
      </SectionCard>
      <SideCardEditor title="Detail-page “Request a Demo” card" card={data.demoCard} onChange={v => set("demoCard", v)} />
    </div>
  );
}

// ─── Contact Editor ───────────────────────────────────────────────────────────

function ContactEditor({
  data, onChange,
}: { data: ContactData; onChange: (d: ContactData) => void }) {
  const set = useCallback(
    <K extends keyof ContactData>(key: K, value: ContactData[K]) =>
      onChange({ ...data, [key]: value }),
    [data, onChange]
  );

  return (
    <div className="space-y-6">
      <SectionCard title="Contact Header Section">
        <Field label="Page Heading" value={data.heading} onChange={v => set("heading", v)} />
        <Field label="Strapline (Subheading)" value={data.strapline} onChange={v => set("strapline", v)} />
        <Field label="Introduction text" value={data.intro} rows={3} onChange={v => set("intro", v)} />
      </SectionCard>
      <SectionCard title="Inquiry Dropdown Areas">
        <StringList label="Selectable areas" items={data.inquiryAreas || []} onChange={v => set("inquiryAreas", v)} placeholder="Add inquiry area…" />
      </SectionCard>
    </div>
  );
}

// ─── Site Settings Editor ──────────────────────────────────────────────────

function SiteSettingsEditor({
  data, onChange,
}: { data: any; onChange: (d: any) => void }) {
  const setContact = useCallback((key: string, value: any) => {
    onChange({
      ...data,
      contactInfo: {
        ...(data.contactInfo || {}),
        [key]: value
      }
    });
  }, [data, onChange]);

  const setPhones = useCallback((value: string) => {
    const arr = value.split(",").map(x => x.trim()).filter(Boolean);
    setContact("phones", arr);
  }, [setContact]);

  return (
    <div className="space-y-6">
      <SectionCard title="Contact Information">
        <Field label="Office Address" value={data.contactInfo?.address || ""} rows={3} onChange={v => setContact("address", v)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Contact Email" value={data.contactInfo?.email || ""} onChange={v => setContact("email", v)} />
          <Field label="GST Number" value={data.contactInfo?.gstNumber || ""} onChange={v => setContact("gstNumber", v)} />
        </div>
        <div>
          <Field label="Phone Numbers (comma separated)" value={(data.contactInfo?.phones || []).join(", ")} onChange={v => setPhones(v)} placeholder="e.g. 9961813730, 0484-4059310" />
          <span className="text-[10px] text-slate mt-1 block">Enter multiple phone numbers separated by commas.</span>
        </div>
      </SectionCard>

      <SectionCard title="Company Identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company Name" value={data.companyName || ""} onChange={v => onChange({ ...data, companyName: v })} />
          <Field label="Tagline / Subhead" value={data.tagline || ""} onChange={v => onChange({ ...data, tagline: v })} />
        </div>
      </SectionCard>

      <SectionCard title="Footer Configuration">
        <Field label="Footer Description" value={data.footerDescription || ""} rows={3} onChange={v => onChange({ ...data, footerDescription: v })} />
        <Field label="Footer Tagline" value={data.footerTagline || ""} onChange={v => onChange({ ...data, footerTagline: v })} />
      </SectionCard>

      <SectionCard title="Page Visibility (turn tabs on / off)">
        <p className="text-xs text-slate">Turn a page OFF to instantly hide it from the menu &amp; footer and block its link. Home can&apos;t be turned off. Changes apply on save.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { href: "/about", label: "About Us" },
            { href: "/corporate", label: "Corporate Solutions" },
            { href: "/education", label: "Educational Solutions" },
            { href: "/products", label: "Products" },
            { href: "/training", label: "Training" },
            { href: "/blog", label: "Blog" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => {
            const on = (data.pageVisibility?.[href] ?? true) !== false;
            return (
              <div key={href} className="flex items-center justify-between rounded-lg border border-line bg-surface/40 px-3.5 py-2.5">
                <span className="text-sm font-semibold text-ink">{label}</span>
                <button
                  type="button"
                  aria-label={`Toggle ${label}`}
                  onClick={() => onChange({ ...data, pageVisibility: { ...(data.pageVisibility || {}), [href]: !on } })}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-brand" : "bg-slate/40"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Training Hub editor ──────────────────────────────────────────────────────

function TrainingHubEditor({
  data, onChange,
}: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  const setCta = (k: string, v: string) => onChange({ ...data, cta: { ...(data.cta ?? {}), [k]: v } });
  const cta = data.cta ?? {};

  // Journey (curriculum-flow) + Tools (ecosystem) — arrays of small objects.
  const journey = data.journey ?? FALLBACK_TRAINING_HUB.journey;
  const tools = data.tools ?? FALLBACK_TRAINING_HUB.tools;
  const setJourney = (patch: any) => onChange({ ...data, journey: { ...journey, ...patch } });
  const setTools = (patch: any) => onChange({ ...data, tools: { ...tools, ...patch } });
  const setStage = (i: number, patch: any) =>
    setJourney({ stages: journey.stages.map((s: any, j: number) => (j === i ? { ...s, ...patch } : s)) });
  const setItem = (i: number, patch: any) =>
    setTools({ items: tools.items.map((s: any, j: number) => (j === i ? { ...s, ...patch } : s)) });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Header</h3>
        <Field label="Eyebrow (small label above the title)" value={data.eyebrow || ""} onChange={v => set("eyebrow", v)} placeholder={FALLBACK_TRAINING_HUB.eyebrow} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Heading — first part" value={data.headingLead || ""} onChange={v => set("headingLead", v)} placeholder={FALLBACK_TRAINING_HUB.headingLead} />
          <Field label="Heading — highlighted part" value={data.headingAccent || ""} onChange={v => set("headingAccent", v)} placeholder={FALLBACK_TRAINING_HUB.headingAccent} />
        </div>
        <Field label="Intro paragraph" value={data.intro || ""} onChange={v => set("intro", v)} rows={3} placeholder={FALLBACK_TRAINING_HUB.intro} />
      </div>

      <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Closing Call-to-Action</h3>
        <Field label="CTA title" value={cta.title || ""} onChange={v => setCta("title", v)} placeholder={FALLBACK_TRAINING_HUB.cta.title} />
        <Field label="CTA description" value={cta.description || ""} onChange={v => setCta("description", v)} rows={2} placeholder={FALLBACK_TRAINING_HUB.cta.description} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Primary button text" value={cta.primaryCtaText || ""} onChange={v => setCta("primaryCtaText", v)} placeholder={FALLBACK_TRAINING_HUB.cta.primaryCtaText} />
          <Field label="Primary button link" value={cta.primaryCtaHref || ""} onChange={v => setCta("primaryCtaHref", v)} placeholder={FALLBACK_TRAINING_HUB.cta.primaryCtaHref} />
          <Field label="Secondary button text" value={cta.secondaryCtaText || ""} onChange={v => setCta("secondaryCtaText", v)} placeholder={FALLBACK_TRAINING_HUB.cta.secondaryCtaText} />
          <Field label="Secondary button link" value={cta.secondaryCtaHref || ""} onChange={v => setCta("secondaryCtaHref", v)} placeholder={FALLBACK_TRAINING_HUB.cta.secondaryCtaHref} />
        </div>
      </div>

      {/* The Learning Journey (curriculum flow) */}
      <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">The Learning Journey</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Eyebrow" value={journey.eyebrow || ""} onChange={v => setJourney({ eyebrow: v })} />
          <Field label="Heading" value={journey.heading || ""} onChange={v => setJourney({ heading: v })} />
          <Field label="Subtext" value={journey.subtext || ""} onChange={v => setJourney({ subtext: v })} />
        </div>
        <div className="space-y-3">
          {(journey.stages || []).map((s: any, i: number) => (
            <div key={i} className="rounded-xl border border-line bg-surface/40 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate">Stage #{i + 1}</span>
                <button type="button" onClick={() => setJourney({ stages: journey.stages.filter((_: any, j: number) => j !== i) })}
                  className="text-slate hover:text-error"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Field label="Step no." value={s.step || ""} onChange={v => setStage(i, { step: v })} />
                <Field label="Name" value={s.name || ""} onChange={v => setStage(i, { name: v })} />
                <Field label="Icon (lucide name)" value={s.icon || ""} onChange={v => setStage(i, { icon: v })} />
              </div>
              <Field label="Description" value={s.desc || ""} onChange={v => setStage(i, { desc: v })} rows={2} />
            </div>
          ))}
          <button type="button" onClick={() => setJourney({ stages: [...(journey.stages || []), { step: String((journey.stages?.length || 0) + 1).padStart(2, "0"), name: "", desc: "", icon: "Sparkles" }] })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-[13px] font-semibold text-slate hover:text-brand hover:border-brand/40"><Plus className="w-4 h-4" />Add stage</button>
        </div>
      </div>

      {/* Integrated Learning Tools (ecosystem) */}
      <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Integrated Learning Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Eyebrow" value={tools.eyebrow || ""} onChange={v => setTools({ eyebrow: v })} />
          <Field label="Heading" value={tools.heading || ""} onChange={v => setTools({ heading: v })} />
          <Field label="Subtext" value={tools.subtext || ""} onChange={v => setTools({ subtext: v })} />
        </div>
        <div className="space-y-3">
          {(tools.items || []).map((t: any, i: number) => (
            <div key={i} className="rounded-xl border border-line bg-surface/40 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate">Tool #{i + 1}</span>
                <button type="button" onClick={() => setTools({ items: tools.items.filter((_: any, j: number) => j !== i) })}
                  className="text-slate hover:text-error"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Label" value={t.label || ""} onChange={v => setItem(i, { label: v })} />
                <Field label="Icon (lucide name)" value={t.icon || ""} onChange={v => setItem(i, { icon: v })} />
              </div>
              <Field label="Description" value={t.desc || ""} onChange={v => setItem(i, { desc: v })} rows={2} />
            </div>
          ))}
          <button type="button" onClick={() => setTools({ items: [...(tools.items || []), { label: "", desc: "", icon: "Sparkles" }] })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-2 text-[13px] font-semibold text-slate hover:text-brand hover:border-brand/40"><Plus className="w-4 h-4" />Add tool</button>
        </div>
        <p className="text-xs text-slate">Icon names use the lucide-react set (e.g. <code>CheckSquare</code>, <code>Clock</code>, <code>Target</code>, <code>GraduationCap</code>, <code>Play</code>, <code>Sparkles</code>).</p>
      </div>
    </div>
  );
}

// ─── Impact page editor ───────────────────────────────────────────────────────

function ImpactEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-6">
      <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Header</h3>
        <Field label="Eyebrow" value={data.eyebrow || ""} onChange={v => set("eyebrow", v)} placeholder="Clients & Milestones" />
        <Field label="Heading" value={data.heading || ""} onChange={v => set("heading", v)} placeholder="Our Impact" />
        <Field label="Intro" value={data.intro || ""} onChange={v => set("intro", v)} rows={3} placeholder="Short intro paragraph" />
      </div>
      <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Highlights</h3>
        <StringList label="Key highlights" items={data.highlights || []} onChange={v => set("highlights", v)} placeholder="Add highlight…" />
      </div>
      <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Industries Served</h3>
        <StringList label="Industries" items={data.industriesServed || []} onChange={v => set("industriesServed", v)} placeholder="Add industry…" />
      </div>
    </div>
  );
}

// ─── Legal page editor (privacy / terms) ──────────────────────────────────────

function LegalEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Legal Document</h3>
      <Field label="Eyebrow" value={data.eyebrow || ""} onChange={v => set("eyebrow", v)} placeholder="Legal Information" />
      <Field label="Heading" value={data.heading || ""} onChange={v => set("heading", v)} placeholder="Privacy Policy" />
      <Field label="Last updated line" value={data.lastUpdated || ""} onChange={v => set("lastUpdated", v)} placeholder="Last Updated: June 18, 2026" />
      <Field label="Full document body (HTML) — leave empty to keep the built-in default text" value={data.bodyHtml || ""} onChange={v => set("bodyHtml", v)} rows={16} placeholder="<h4>1. Section</h4><p>Paragraph…</p>" />
      <p className="text-xs text-slate">Paste the complete policy as HTML. Use &lt;h4&gt; for section titles and &lt;p&gt; for paragraphs. If empty, the current built-in text is shown.</p>
    </div>
  );
}

// ─── Simple header editor (heading + intro pages) ─────────────────────────────

function SimpleHeaderEditor({
  data, onChange, showEyebrow = false,
}: { data: any; onChange: (d: any) => void; showEyebrow?: boolean }) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Page Header</h3>
      {showEyebrow && (
        <Field label="Eyebrow (small label above the title)" value={data.eyebrow || ""} onChange={v => set("eyebrow", v)} placeholder="e.g. Careers Board" />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Heading — first part" value={data.headingLead || ""} onChange={v => set("headingLead", v)} placeholder="e.g. Online" />
        <Field label="Heading — highlighted part" value={data.headingAccent || ""} onChange={v => set("headingAccent", v)} placeholder="e.g. Courses" />
      </div>
      <Field label="Intro paragraph" value={data.intro || ""} onChange={v => set("intro", v)} rows={3} placeholder="Short description shown under the heading" />
      <p className="text-xs text-slate">Leave a field empty to keep the current default text.</p>
    </div>
  );
}

// ─── Category landing editor (corporate / colleges / one-to-one) ──────────────

function CategoryLandingEditor({
  data, onChange,
}: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate border-b border-line pb-2">Category Landing</h3>
      <Field label="Category name (heading)" value={data.name || ""} onChange={v => set("name", v)} placeholder="e.g. Corporate" />
      <Field label="Description" value={data.description || ""} onChange={v => set("description", v)} rows={3} placeholder="Short description shown under the heading" />
      <p className="text-xs text-slate">Leave a field empty to keep the current default text.</p>
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

  const [selectedSlug, setSelectedSlug] = useState<PageSlug>("home");
  const [homeData,     setHomeData]     = useState<HomeData>(DEFAULT_HOME);
  const [aboutData,    setAboutData]    = useState<AboutData>(FALLBACK_ABOUT);
  const [corporateData,setCorporateData]= useState<CorporateData>(FALLBACK_CORPORATE);
  const [educationData,setEducationData]= useState<EducationData>(FALLBACK_EDUCATION);
  const [productsData, setProductsData] = useState<ProductsPageData>(FALLBACK_PRODUCTS_PAGE);
  const [contactData,  setContactData]  = useState<ContactData>(FALLBACK_CONTACT);
  const [trainingData, setTrainingData] = useState<any>(FALLBACK_TRAINING_HUB);
  const [siteSettingsData, setSiteSettingsData] = useState<any>(FALLBACK_SITE_SETTINGS);

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
        const stored = data.stored ?? {};
        if (selectedSlug === "home") {
          setHomeData({
            hero:           { ...DEFAULT_HOME.hero,           ...(stored.hero ?? {}) },
            trustedBy:      { ...DEFAULT_HOME.trustedBy,      ...(stored.trustedBy ?? {}) },
            solutions:      { ...DEFAULT_HOME.solutions,      ...(stored.solutions ?? {}) },
            whyUs:          { ...DEFAULT_HOME.whyUs,          ...(stored.whyUs ?? {}) },
            industries:     { ...DEFAULT_HOME.industries,     ...(stored.industries ?? {}) },
            approach:       { ...DEFAULT_HOME.approach,       ...(stored.approach ?? {}) },
            successStories: { ...DEFAULT_HOME.successStories, ...(stored.successStories ?? {}) },
            insights:       { ...DEFAULT_HOME.insights,       ...(stored.insights ?? {}) },
            finalCta:       { ...DEFAULT_HOME.finalCta,       ...(stored.finalCta ?? {}) },
          });
        } else if (selectedSlug === "about") {
          setAboutData({
            title: stored.title || FALLBACK_ABOUT.title,
            intro: stored.intro || FALLBACK_ABOUT.intro,
            specializations: stored.specializations?.length ? stored.specializations : FALLBACK_ABOUT.specializations,
            reachLine: stored.reachLine || FALLBACK_ABOUT.reachLine,
            impact: stored.impact?.length ? stored.impact : FALLBACK_ABOUT.impact,
            vision: {
              heading: stored.vision?.heading || FALLBACK_ABOUT.vision.heading,
              body: stored.vision?.body || FALLBACK_ABOUT.vision.body,
            },
            cta: { ...FALLBACK_ABOUT.cta, ...(stored.cta ?? {}) },
          });
        } else if (selectedSlug === "corporate") {
          setCorporateData({
            heading: stored.heading || FALLBACK_CORPORATE.heading,
            strapline: stored.strapline || FALLBACK_CORPORATE.strapline,
            intro: stored.intro || FALLBACK_CORPORATE.intro,
            services: stored.services?.length ? stored.services : FALLBACK_CORPORATE.services,
            cta: { ...FALLBACK_CORPORATE.cta, ...(stored.cta ?? {}) },
          });
        } else if (selectedSlug === "education") {
          setEducationData({
            heading: stored.heading || FALLBACK_EDUCATION.heading,
            strapline: stored.strapline || FALLBACK_EDUCATION.strapline,
            intro: stored.intro || FALLBACK_EDUCATION.intro,
            services: stored.services?.length ? stored.services : FALLBACK_EDUCATION.services,
            cta: { ...FALLBACK_EDUCATION.cta, ...(stored.cta ?? {}) },
            partnerCard: { ...FALLBACK_EDUCATION.partnerCard, ...(stored.partnerCard ?? {}) },
          });
        } else if (selectedSlug === "products") {
          setProductsData({
            heading: stored.heading || FALLBACK_PRODUCTS_PAGE.heading,
            intro: stored.intro || FALLBACK_PRODUCTS_PAGE.intro,
            products: stored.products?.length ? stored.products : FALLBACK_PRODUCTS_PAGE.products,
            demoCard: { ...FALLBACK_PRODUCTS_PAGE.demoCard, ...(stored.demoCard ?? {}) },
          });
        } else if (selectedSlug === "contact") {
          setContactData({
            heading: stored.heading || FALLBACK_CONTACT.heading,
            strapline: stored.strapline || FALLBACK_CONTACT.strapline,
            intro: stored.intro || FALLBACK_CONTACT.intro,
            inquiryAreas: stored.inquiryAreas?.length ? stored.inquiryAreas : FALLBACK_CONTACT.inquiryAreas,
          });
        } else if (selectedSlug === "training") {
          setTrainingData({
            eyebrow: stored.eyebrow || FALLBACK_TRAINING_HUB.eyebrow,
            headingLead: stored.headingLead || FALLBACK_TRAINING_HUB.headingLead,
            headingAccent: stored.headingAccent || FALLBACK_TRAINING_HUB.headingAccent,
            intro: stored.intro || FALLBACK_TRAINING_HUB.intro,
            cta: { ...FALLBACK_TRAINING_HUB.cta, ...(stored.cta ?? {}) },
            journey: stored.journey?.stages?.length ? stored.journey : FALLBACK_TRAINING_HUB.journey,
            tools: stored.tools?.items?.length ? stored.tools : FALLBACK_TRAINING_HUB.tools,
          });
        } else if (selectedSlug === "site-settings") {
          setSiteSettingsData({
            companyName: stored.companyName || FALLBACK_SITE_SETTINGS.companyName,
            tagline: stored.tagline || FALLBACK_SITE_SETTINGS.tagline,
            regionsServed: stored.regionsServed?.length ? stored.regionsServed : FALLBACK_SITE_SETTINGS.regionsServed,
            contactInfo: {
              email: stored.contactInfo?.email || FALLBACK_SITE_SETTINGS.contactInfo.email,
              phones: stored.contactInfo?.phones?.length ? stored.contactInfo.phones : FALLBACK_SITE_SETTINGS.contactInfo.phones,
              address: stored.contactInfo?.address || FALLBACK_SITE_SETTINGS.contactInfo.address,
              gstNumber: stored.contactInfo?.gstNumber || FALLBACK_SITE_SETTINGS.contactInfo.gstNumber,
            },
            footerDescription: stored.footerDescription || FALLBACK_SITE_SETTINGS.footerDescription,
            footerTagline: stored.footerTagline || FALLBACK_SITE_SETTINGS.footerTagline,
            navItems: stored.navItems || FALLBACK_SITE_SETTINGS.navItems,
            footerColumns: stored.footerColumns || FALLBACK_SITE_SETTINGS.footerColumns,
            quickLinks: stored.quickLinks || FALLBACK_SITE_SETTINGS.quickLinks,
            socialLinks: stored.socialLinks || FALLBACK_SITE_SETTINGS.socialLinks,
            pageVisibility: { ...FALLBACK_SITE_SETTINGS.pageVisibility, ...(stored.pageVisibility ?? {}) },
          });
        } else {
          setGenericData(stored);
        }
      })
      .catch(() => setError("Failed to load content."))
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [selectedSlug, router]);

  const handleSave = async () => {
    setSaving(true); setError(""); setSaveOk(false);
    let payload: any;
    if (selectedSlug === "home") payload = homeData;
    else if (selectedSlug === "about") payload = aboutData;
    else if (selectedSlug === "corporate") payload = corporateData;
    else if (selectedSlug === "education") payload = educationData;
    else if (selectedSlug === "products") payload = productsData;
    else if (selectedSlug === "contact") payload = contactData;
    else if (selectedSlug === "training") payload = trainingData;
    else if (selectedSlug === "site-settings") payload = siteSettingsData;
    else payload = genericData;

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

  return (
    <div className="font-body">

      {/* ── Slim action bar (title + Logout come from the AdminShell) ── */}
      <div className="sticky top-[57px] z-20 flex items-center justify-end gap-3 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
        <span className="mr-auto text-sm font-semibold text-slate-500">
          Website content — empty fields fall back to approved copy.
        </span>
        {saveOk && (
          <span className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-600">
            <Check className="w-4 h-4" /> Saved!
          </span>
        )}
        <Button onClick={handleSave} disabled={saving || loading}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:from-cyan-500 hover:to-blue-500">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Page"}
        </Button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mx-6 mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="flex" style={{ minHeight: "calc(100vh - 110px)" }}>

        {/* Left sidebar — page list */}
        <aside className="w-60 shrink-0 border-r border-slate-200 bg-white p-4 space-y-1 sticky top-[110px] self-start h-[calc(100vh-110px)] overflow-y-auto">
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
              <a key={p.slug} href={p.href ?? (p.slug === "home" ? "/" : `/${p.slug}`)} target="_blank" rel="noreferrer"
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
          ) : selectedSlug === "about" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">About Us Page</h2>
                  <p className="text-xs text-slate mt-0.5">
                    Configure company history, skills, track record, and core values.
                  </p>
                </div>
                <a href="/about" target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  ↗ Preview live page
                </a>
              </div>
              <AboutEditor data={aboutData} onChange={setAboutData} />
            </>
          ) : selectedSlug === "corporate" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">Corporate Solutions Page</h2>
                  <p className="text-xs text-slate mt-0.5">
                    Configure corporate landing headings and service offerings.
                  </p>
                </div>
                <a href="/corporate" target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  ↗ Preview live page
                </a>
              </div>
              <CorporateEditor data={corporateData} onChange={setCorporateData} />
            </>
          ) : selectedSlug === "education" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">Educational Solutions Page</h2>
                  <p className="text-xs text-slate mt-0.5">
                    Configure educational offerings, skill labs, and academic collaboration programs.
                  </p>
                </div>
                <a href="/education" target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  ↗ Preview live page
                </a>
              </div>
              <EducationEditor data={educationData} onChange={setEducationData} />
            </>
          ) : selectedSlug === "products" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">Products Page</h2>
                  <p className="text-xs text-slate mt-0.5">
                    Configure proprietary software products, descriptions, and feature lists.
                  </p>
                </div>
                <a href="/products" target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  ↗ Preview live page
                </a>
              </div>
              <ProductsEditor data={productsData} onChange={setProductsData} />
            </>
          ) : selectedSlug === "contact" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">Contact Page</h2>
                  <p className="text-xs text-slate mt-0.5">
                    Configure inquiry areas and contact section headers.
                  </p>
                </div>
                <a href="/contact" target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  ↗ Preview live page
                </a>
              </div>
              <ContactEditor data={contactData} onChange={setContactData} />
            </>
          ) : selectedSlug === "training" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">Training Hub Page</h2>
                  <p className="text-xs text-slate mt-0.5">
                    Edit the Training hub heading, intro, and closing call-to-action. Category cards are managed under Courses → Categories.
                  </p>
                </div>
                <a href="/training" target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">
                  ↗ Preview live page
                </a>
              </div>
              <TrainingHubEditor data={trainingData} onChange={setTrainingData} />
            </>
          ) : selectedSlug === "site-settings" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">Global Settings</h2>
                  <p className="text-xs text-slate mt-0.5">
                    Configure company identity, contact details, and global footer text.
                  </p>
                </div>
              </div>
              <SiteSettingsEditor data={siteSettingsData} onChange={setSiteSettingsData} />
            </>
          ) : (selectedSlug === "online-courses" || selectedSlug === "internships") ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">
                    {PAGES.find(p => p.slug === selectedSlug)?.label} Page
                  </h2>
                  <p className="text-xs text-slate mt-0.5">
                    Edit the page heading and intro. Courses/internships are managed in their own admin sections.
                  </p>
                </div>
                <a href={PAGES.find(p => p.slug === selectedSlug)?.href} target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">↗ Preview live page</a>
              </div>
              <SimpleHeaderEditor data={genericData} onChange={setGenericData} />
            </>
          ) : selectedSlug === "impact" ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">Impact Page</h2>
                  <p className="text-xs text-slate mt-0.5">Edit the impact heading, intro, highlights and industries served.</p>
                </div>
                <a href="/impact" target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">↗ Preview live page</a>
              </div>
              <ImpactEditor data={genericData} onChange={setGenericData} />
            </>
          ) : (selectedSlug === "privacy" || selectedSlug === "terms") ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">{PAGES.find(p => p.slug === selectedSlug)?.label}</h2>
                  <p className="text-xs text-slate mt-0.5">Edit the header, and optionally paste full HTML to replace the whole document body.</p>
                </div>
                <a href={PAGES.find(p => p.slug === selectedSlug)?.href} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">↗ Preview live page</a>
              </div>
              <LegalEditor data={genericData} onChange={setGenericData} />
            </>
          ) : (selectedSlug === "careers" || selectedSlug === "blog") ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">
                    {PAGES.find(p => p.slug === selectedSlug)?.label} Page
                  </h2>
                  <p className="text-xs text-slate mt-0.5">
                    Edit the page eyebrow, heading and intro. {selectedSlug === "careers" ? "Job openings are managed under Jobs." : "Blog posts are managed under Blog."}
                  </p>
                </div>
                <a href={PAGES.find(p => p.slug === selectedSlug)?.href} target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">↗ Preview live page</a>
              </div>
              <SimpleHeaderEditor data={genericData} onChange={setGenericData} showEyebrow />
            </>
          ) : (selectedSlug === "training-corporate" || selectedSlug === "training-colleges" || selectedSlug === "training-one-to-one") ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-ink">
                    {PAGES.find(p => p.slug === selectedSlug)?.label} Page
                  </h2>
                  <p className="text-xs text-slate mt-0.5">
                    Edit this category landing page's name and description. Courses shown are managed under Courses.
                  </p>
                </div>
                <a href={PAGES.find(p => p.slug === selectedSlug)?.href} target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-brand hover:underline flex items-center gap-1">↗ Preview live page</a>
              </div>
              <CategoryLandingEditor data={genericData} onChange={setGenericData} />
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
