import React from "react";
import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowUpRight } from "lucide-react";

/** Reusable admin dashboard widgets (light, colorful enterprise theme). Presentational. */

/** Colorful accent tones. Full static class strings (Tailwind can't see interpolated names). */
export type Tone = "cyan" | "violet" | "blue" | "emerald" | "amber" | "rose" | "indigo" | "teal" | "fuchsia";

const TONE_SOLID: Record<Tone, string> = {
  cyan: "bg-cyan-600", violet: "bg-violet-600", blue: "bg-blue-600", emerald: "bg-emerald-600",
  amber: "bg-amber-500", rose: "bg-rose-500", indigo: "bg-indigo-600", teal: "bg-teal-600", fuchsia: "bg-fuchsia-600",
};
const TONE_SOFT: Record<Tone, string> = {
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200/70", violet: "bg-violet-50 text-violet-700 ring-violet-200/70",
  blue: "bg-blue-50 text-blue-700 ring-blue-200/70", emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
  amber: "bg-amber-50 text-amber-700 ring-amber-200/70", rose: "bg-rose-50 text-rose-700 ring-rose-200/70",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200/70", teal: "bg-teal-50 text-teal-700 ring-teal-200/70",
  fuchsia: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200/70",
};
const TONE_HOVER: Record<Tone, string> = {
  cyan: "hover:border-cyan-300", violet: "hover:border-violet-300", blue: "hover:border-blue-300",
  emerald: "hover:border-emerald-300", amber: "hover:border-amber-300", rose: "hover:border-rose-300",
  indigo: "hover:border-indigo-300", teal: "hover:border-teal-300", fuchsia: "hover:border-fuchsia-300",
};

export function StatWidget({
  label, value, icon: Icon, hint, href, loading, tone = "cyan",
}: { label: string; value: string; icon: ComponentType<{ className?: string }>; hint?: string; href?: string; loading?: boolean; tone?: Tone }) {
  const body = (
    <div className={`group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${TONE_HOVER[tone]}`}>
      <div className="flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-xl text-white shadow-sm ${TONE_SOLID[tone]}`}><Icon className="h-5 w-5" /></span>
        {href && <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600" />}
      </div>
      {loading ? <div className="skeleton mt-4 h-8 w-16" /> : <div className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>}
      <div className="mt-1 text-[13px] font-semibold text-slate-600">{label}</div>
      {hint && !loading && <div className="mt-1 text-[11px] text-slate-500">{hint}</div>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function WidgetPanel({
  title, action, children,
}: { title: string; action?: { label: string; href: string }; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {action && (
          <Link href={action.href} className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
            {action.label}<ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function QuickAction({
  label, href, icon: Icon, tone = "cyan",
}: { label: string; href: string; icon: ComponentType<{ className?: string }>; tone?: Tone }) {
  return (
    <Link href={href}
      className={`flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${TONE_HOVER[tone]}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${TONE_SOFT[tone]}`}><Icon className="h-4 w-4" /></span>
      {label}
    </Link>
  );
}

export function ListRow({
  primary, secondary, badge,
}: { primary: string; secondary?: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0">
      <div className="min-w-0">
        <div className="truncate text-[13px] font-semibold text-slate-800">{primary}</div>
        {secondary && <div className="truncate text-[12px] text-slate-400">{secondary}</div>}
      </div>
      {badge && <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">{badge}</span>}
    </div>
  );
}

/** Lightweight horizontal bar list — no charting dependency, CSS-only. Bars cycle accent colors. */
const BAR_FILL = ["bg-cyan-500", "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-indigo-500", "bg-teal-500"];
export function BarList({
  data, valueFormat, emptyLabel = "No data yet",
}: { data: { label: string; value: number }[]; valueFormat?: (n: number) => string; emptyLabel?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const fmt = valueFormat ?? ((n: number) => n.toLocaleString("en-IN"));
  if (data.length === 0) return <p className="py-6 text-center text-[13px] text-slate-400">{emptyLabel}</p>;
  return (
    <div className="space-y-2.5">
      {data.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-[12px] font-medium text-slate-600" title={d.label}>{d.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${BAR_FILL[i % BAR_FILL.length]}`} style={{ width: `${Math.max(3, (d.value / max) * 100)}%` }} />
          </div>
          <span className="w-16 shrink-0 text-right text-[12px] font-bold text-slate-800">{fmt(d.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function HealthRow({ label, ok, note }: { label: string; ok: boolean; note: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-[13px] font-medium text-slate-700">{label}</span>
      <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${ok ? "text-emerald-600" : "text-amber-600"}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`} />{note}
      </span>
    </div>
  );
}
