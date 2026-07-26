import React from "react";

/** Reusable table cell renderers + formatters. */

const TONES: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  cyan: "bg-brand/10 text-brand border-brand/30",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
};

export function StatusBadge({ label, tone = "slate" }: { label: string; tone?: keyof typeof TONES }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TONES[tone] ?? TONES.slate}`}>{label}</span>;
}

export function AvatarCell({ name, src, sub }: { name: string; src?: string; sub?: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="flex items-center gap-2.5">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-8 w-8 rounded-full object-cover" />
      ) : (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">{initials || "?"}</span>
      )}
      <div className="min-w-0">
        <div className="truncate text-[13px] font-semibold text-slate-800">{name}</div>
        {sub && <div className="truncate text-[12px] text-slate-400">{sub}</div>}
      </div>
    </div>
  );
}

export function formatDate(v: string | number | Date | null | undefined): string {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
export function formatDateTime(v: string | number | Date | null | undefined): string {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
export function formatNumber(n: number | null | undefined): string {
  return typeof n === "number" ? n.toLocaleString("en-IN") : "—";
}
export function formatCurrency(n: number | null | undefined, symbol = "₹"): string {
  return typeof n === "number" ? `${symbol}${n.toLocaleString("en-IN")}` : "—";
}
