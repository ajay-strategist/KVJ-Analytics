"use client";

import React, { useRef, useState } from "react";
import { X, Plus, UploadCloud, Trash2, Loader2 } from "lucide-react";
import type { FormApi } from "./useForm";
import { toDirectImageUrl, isShareLink } from "@/lib/mediaUrl";

/** FormKit field primitives — reusable, accessible, shared error/help styling. Dependency-free. */

interface Base {
  form: FormApi<Record<string, unknown>>;
  name: string;
  label?: string;
  required?: boolean;
  description?: string;
  help?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const inputCls = (err?: boolean) =>
  `w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:cursor-not-allowed disabled:bg-slate-50 transition-colors ${
    err ? "border-red-300 focus:ring-red-200" : "border-slate-200 focus:border-brand/40"
  }`;

export function FieldShell({
  id, label, required, description, error, help, counter, children,
}: {
  id?: string; label?: string; required?: boolean; description?: string; error?: string;
  help?: string; counter?: string; children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-slate-700">
          {label}{required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {description && <p className="mb-1.5 text-[12px] text-slate-400">{description}</p>}
      {children}
      <div className="mt-1 flex items-start justify-between gap-2">
        <p className={`text-[12px] ${error ? "text-red-600" : "text-slate-400"}`} role={error ? "alert" : undefined}>
          {error || help || ""}
        </p>
        {counter && <span className="shrink-0 text-[11px] text-slate-300">{counter}</span>}
      </div>
    </div>
  );
}

export function TextField({ form, name, type = "text", maxLength, ...b }: Base & { type?: "text" | "email" | "password" | "tel" | "url"; maxLength?: number }) {
  const f = form.field(name);
  const val = (f.value as string) ?? "";
  return (
    <FieldShell id={name} label={b.label} required={b.required} description={b.description} error={f.error} help={b.help}
      counter={maxLength ? `${val.length}/${maxLength}` : undefined}>
      <input id={name} name={name} type={type} value={val} disabled={b.disabled} placeholder={b.placeholder}
        maxLength={maxLength} aria-invalid={!!f.error} aria-describedby={f.error ? `${name}-err` : undefined}
        onChange={(e) => f.onChange(e.target.value)} onBlur={f.onBlur} className={inputCls(!!f.error)} />
    </FieldShell>
  );
}

export function TextArea({ form, name, rows = 4, maxLength, ...b }: Base & { rows?: number; maxLength?: number }) {
  const f = form.field(name);
  const val = (f.value as string) ?? "";
  return (
    <FieldShell id={name} label={b.label} required={b.required} description={b.description} error={f.error} help={b.help}
      counter={maxLength ? `${val.length}/${maxLength}` : undefined}>
      <textarea id={name} name={name} rows={rows} value={val} disabled={b.disabled} placeholder={b.placeholder} maxLength={maxLength}
        aria-invalid={!!f.error} onChange={(e) => f.onChange(e.target.value)} onBlur={f.onBlur} className={inputCls(!!f.error)} />
    </FieldShell>
  );
}

export function NumberField({ form, name, currency, ...b }: Base & { currency?: boolean }) {
  const f = form.field(name);
  return (
    <FieldShell id={name} label={b.label} required={b.required} description={b.description} error={f.error} help={b.help}>
      <div className="relative">
        {currency && <span className="pointer-events-none absolute left-3 top-2 text-sm text-slate-400">₹</span>}
        <input id={name} name={name} type="number" inputMode="decimal" value={(f.value as number | string) ?? ""} disabled={b.disabled}
          placeholder={b.placeholder} aria-invalid={!!f.error} onChange={(e) => f.onChange(e.target.value === "" ? "" : Number(e.target.value))}
          onBlur={f.onBlur} className={`${inputCls(!!f.error)} ${currency ? "pl-7" : ""}`} />
      </div>
    </FieldShell>
  );
}

export function SelectField({ form, name, options, ...b }: Base & { options: { label: string; value: string }[] }) {
  const f = form.field(name);
  return (
    <FieldShell id={name} label={b.label} required={b.required} description={b.description} error={f.error} help={b.help}>
      <select id={name} name={name} value={(f.value as string) ?? ""} disabled={b.disabled} aria-invalid={!!f.error}
        onChange={(e) => f.onChange(e.target.value)} onBlur={f.onBlur} className={inputCls(!!f.error)}>
        {b.placeholder && <option value="">{b.placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({ form, name, ...b }: Base) {
  const f = form.field(name);
  return (
    <div>
      <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={!!f.value} disabled={b.disabled} onChange={(e) => f.onChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand/40" />
        {b.label}{b.required && <span className="text-red-500">*</span>}
      </label>
      {(f.error || b.help) && <p className={`mt-1 text-[12px] ${f.error ? "text-red-600" : "text-slate-400"}`}>{f.error || b.help}</p>}
    </div>
  );
}

export function SwitchField({ form, name, ...b }: Base) {
  const f = form.field(name);
  const on = !!f.value;
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {b.label && <div className="text-[13px] font-semibold text-slate-700">{b.label}</div>}
        {b.description && <div className="text-[12px] text-slate-400">{b.description}</div>}
      </div>
      <button type="button" role="switch" aria-checked={on} disabled={b.disabled} onClick={() => f.onChange(!on)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-brand" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export function SlugField(props: Base & { maxLength?: number }) {
  return <TextField {...props} type="text" placeholder={props.placeholder ?? "example-slug"} />;
}
export function DateField({ form, name, ...b }: Base) {
  const f = form.field(name);
  return (
    <FieldShell id={name} label={b.label} required={b.required} description={b.description} error={f.error} help={b.help}>
      <input id={name} type="date" value={(f.value as string) ?? ""} disabled={b.disabled} aria-invalid={!!f.error}
        onChange={(e) => f.onChange(e.target.value)} onBlur={f.onBlur} className={inputCls(!!f.error)} />
    </FieldShell>
  );
}
export function ColorField({ form, name, ...b }: Base) {
  const f = form.field(name);
  const val = (f.value as string) || "#43F5FF";
  return (
    <FieldShell id={name} label={b.label} required={b.required} description={b.description} error={f.error} help={b.help}>
      <div className="flex items-center gap-2">
        <input type="color" value={val} disabled={b.disabled} onChange={(e) => f.onChange(e.target.value)} className="h-9 w-12 rounded border border-slate-200" />
        <input type="text" value={val} onChange={(e) => f.onChange(e.target.value)} className={inputCls(!!f.error)} />
      </div>
    </FieldShell>
  );
}

export function TagInput({ form, name, ...b }: Base) {
  const f = form.field(name);
  const tags = Array.isArray(f.value) ? (f.value as string[]) : [];
  const [draft, setDraft] = useState("");
  const add = () => { const t = draft.trim(); if (t && !tags.includes(t)) f.onChange([...tags, t]); setDraft(""); };
  return (
    <FieldShell id={name} label={b.label} required={b.required} description={b.description} error={f.error} help={b.help}>
      <div className={`flex flex-wrap items-center gap-1.5 rounded-lg border bg-white p-2 ${f.error ? "border-red-300" : "border-slate-200"}`}>
        {tags.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[12px] font-medium text-brand">
            {t}<button type="button" onClick={() => f.onChange(tags.filter((_, j) => j !== i))} aria-label={`Remove ${t}`}><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input value={draft} placeholder={b.placeholder ?? "Add…"} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} onBlur={f.onBlur}
          className="min-w-[100px] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none" />
      </div>
    </FieldShell>
  );
}

/**
 * Image field: upload a file (→ Supabase via /api/admin/upload) OR paste a link.
 * OneDrive / Google Drive share links are auto-converted to a direct image URL.
 */
export function ImageUploadField({ form, name, accept = "image/*", ...b }: Base & { accept?: string }) {
  const f = form.field(name);
  const value = (f.value as string) ?? "";
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [converted, setConverted] = useState(false);
  const [broken, setBroken] = useState(false);

  const handleLink = (raw: string) => {
    setBroken(false); setErr("");
    const direct = toDirectImageUrl(raw);
    setConverted(direct !== raw && isShareLink(raw));
    f.onChange(direct);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr(""); setConverted(false); setBroken(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      f.onChange(data.url);
    } catch (e2: unknown) {
      setErr(e2 instanceof Error ? e2.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <FieldShell id={name} label={b.label} required={b.required} description={b.description} error={f.error}
      help={b.help ?? "Paste an image link (OneDrive / Google Drive OK) or upload a file."}>
      <div className="flex items-start gap-3">
        <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400">
          {value && !broken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" onError={() => setBroken(true)} onLoad={() => setBroken(false)} className="h-full w-full object-cover" />
          ) : (
            <UploadCloud className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <input type="text" value={value} placeholder="https://…" onChange={(e) => handleLink(e.target.value)}
              className={inputCls(!!f.error)} />
            <button type="button" onClick={() => inputRef.current?.click()} disabled={b.disabled || uploading}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-brand px-3 py-2 text-xs font-bold text-brand hover:bg-brand/5 disabled:opacity-50">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
          </div>
          {converted && !broken && <p className="mt-1 text-[12px] font-semibold text-brand">✓ Share link converted to a direct image link.</p>}
          {broken && value && <p className="mt-1 text-[12px] font-semibold text-red-600">Link isn’t loading as an image — set sharing to “Anyone with the link”, or upload the file.</p>}
          {err && <p className="mt-1 text-[12px] font-semibold text-red-600">{err}</p>}
        </div>
      </div>
    </FieldShell>
  );
}
export function FileUploadField(props: Base) { return <ImageUploadField {...props} />; }
export function RichTextField(props: Base & { rows?: number }) {
  return <TextArea {...props} rows={props.rows ?? 8} help={props.help ?? "Rich text editor (TipTap) — coming soon; HTML/markdown accepted."} />;
}
export function IconPickerField(props: Base) {
  return <TextField {...props} placeholder={props.placeholder ?? "lucide icon name (e.g. BookOpen)"} help={props.help ?? "Icon picker — coming soon."} />;
}

/** Dynamic repeatable array. `render` receives the row index + item helpers. */
export function ArrayField<Item = Record<string, unknown>>({
  form, name, label, description, newItem, render, addLabel = "Add item",
}: {
  form: FormApi<Record<string, unknown>>; name: string; label?: string; description?: string;
  newItem: () => Item; addLabel?: string;
  render: (item: Item, index: number, setItem: (patch: Partial<Item>) => void) => React.ReactNode;
}) {
  const arr = (Array.isArray(form.values[name]) ? form.values[name] : []) as Item[];
  const setArr = (next: Item[]) => form.setValue(name, next as unknown);
  const setItem = (i: number) => (patch: Partial<Item>) => setArr(arr.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  return (
    <div>
      {label && <div className="mb-1 text-[13px] font-semibold text-slate-700">{label}</div>}
      {description && <p className="mb-2 text-[12px] text-slate-400">{description}</p>}
      <div className="space-y-3">
        {arr.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">#{i + 1}</span>
              <button type="button" onClick={() => setArr(arr.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
            </div>
            {render(item, i, setItem(i))}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setArr([...arr, newItem()])}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[13px] font-semibold text-slate-600 hover:border-brand/40 hover:text-brand">
        <Plus className="h-4 w-4" />{addLabel}
      </button>
    </div>
  );
}
