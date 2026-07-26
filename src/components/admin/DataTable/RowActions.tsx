"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { MoreHorizontal } from "lucide-react";

export interface RowAction {
  label: string;
  onClick: () => void;
  icon?: ComponentType<{ className?: string }>;
  danger?: boolean;
  disabled?: boolean;
}

/** Generic row-actions kebab menu (accessible). Reused by every admin module's action column. */
export function RowActions({ actions }: { actions: RowAction[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Row actions" aria-haspopup="menu" aria-expanded={open}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-30 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          {actions.map((a, i) => (
            <button key={i} role="menuitem" disabled={a.disabled} onClick={() => { setOpen(false); a.onClick(); }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
                a.danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"}`}>
              {a.icon && <a.icon className="h-3.5 w-3.5" />}{a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
