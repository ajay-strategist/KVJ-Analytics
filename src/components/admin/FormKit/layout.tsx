"use client";

import React, { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";

/** FormKit layout primitives — sections, columns, collapsible panels, sticky action bar. */

export function FormSection({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>}
          {description && <p className="mt-0.5 text-[13px] text-slate-400">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function FormRow({ cols = 2, children }: { cols?: 1 | 2 | 3; children: React.ReactNode }) {
  const c = cols === 3 ? "sm:grid-cols-3" : cols === 2 ? "sm:grid-cols-2" : "";
  return <div className={`grid grid-cols-1 gap-4 ${c}`}>{children}</div>;
}

export function CollapsiblePanel({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-4 text-left">
        <span className="text-[15px] font-bold text-slate-900">{title}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-4 border-t border-slate-100 p-5">{children}</div>}
    </div>
  );
}

export function FormActions({
  onSave, onSaveDraft, onPublish, onCancel, saving, saveLabel = "Save changes",
}: {
  onSave?: () => void; onSaveDraft?: () => void; onPublish?: () => void; onCancel?: () => void;
  saving?: boolean; saveLabel?: string;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
      {onCancel && <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">Cancel</button>}
      {onSaveDraft && <button type="button" onClick={onSaveDraft} disabled={saving} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Save draft</button>}
      {onPublish && <button type="button" onClick={onPublish} disabled={saving} className="rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/15 disabled:opacity-60">Publish</button>}
      {onSave && (
        <button type="submit" onClick={onSave} disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}{saveLabel}
        </button>
      )}
    </div>
  );
}
