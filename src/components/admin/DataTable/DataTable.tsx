"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, SlidersHorizontal,
  Inbox, AlertCircle, RefreshCw, ChevronDown,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  searchText?: (row: T) => string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  width?: string;
  defaultHidden?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  selectable?: boolean;
  bulkActions?: { label: string; onClick: (ids: string[]) => void; danger?: boolean }[];
  rowActions?: (row: T) => React.ReactNode;
  expandable?: (row: T) => React.ReactNode;
  toolbar?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  /** manual/server mode: parent controls data+total; table emits query/sort/page. */
  manual?: boolean;
  total?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onQueryChange?: (q: string) => void;
  onSortChange?: (sort: { key: string; dir: "asc" | "desc" } | null) => void;
}

export function DataTable<T>(props: DataTableProps<T>) {
  const {
    columns, data, getRowId, loading, error, onRetry, searchable = true,
    searchPlaceholder = "Search…", pageSize = 10, selectable, bulkActions, rowActions,
    expandable, toolbar, emptyTitle = "Nothing here yet", emptyDescription = "Records will appear here once added.",
    manual, total, page: pageProp, onPageChange, onQueryChange, onSortChange,
  } = props;

  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [pageState, setPageState] = useState(1);
  const [hidden, setHidden] = useState<Set<string>>(new Set(columns.filter((c) => c.defaultHidden).map((c) => c.key)));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [colsOpen, setColsOpen] = useState(false);

  const page = manual ? (pageProp ?? 1) : pageState;

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => { setQuery(rawQuery); onQueryChange?.(rawQuery); if (!manual) setPageState(1); }, 250);
    return () => clearTimeout(t);
  }, [rawQuery, manual, onQueryChange]);

  const visibleCols = columns.filter((c) => !hidden.has(c.key));

  const processed = useMemo(() => {
    if (manual) return data;
    let rows = data;
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => visibleCols.some((c) => {
        const t = c.searchText ? c.searchText(r) : String(c.sortValue ? c.sortValue(r) : (r as Record<string, unknown>)[c.key] ?? "");
        return t.toLowerCase().includes(q);
      }));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        rows = [...rows].sort((a, b) => {
          const av = col.sortValue!(a) as number | string;
          const bv = col.sortValue!(b) as number | string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const r = (av as any) < (bv as any) ? -1 : (av as any) > (bv as any) ? 1 : 0;
          return sort.dir === "asc" ? r : -r;
        });
      }
    }
    return rows;
  }, [data, query, sort, manual, columns, visibleCols]);

  const totalRows = manual ? (total ?? data.length) : processed.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const pageRows = manual ? data : processed.slice((page - 1) * pageSize, page * pageSize);

  const goPage = (p: number) => { const np = Math.min(totalPages, Math.max(1, p)); if (manual) onPageChange?.(np); else setPageState(np); };
  const toggleSort = (key: string) => {
    const next = !sort || sort.key !== key ? { key, dir: "asc" as const } : sort.dir === "asc" ? { key, dir: "desc" as const } : null;
    setSort(next); onSortChange?.(next);
  };
  const pageIds = pageRows.map(getRowId);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const toggleAll = () => setSelected((s) => { const n = new Set(s); allChecked ? pageIds.forEach((id) => n.delete(id)) : pageIds.forEach((id) => n.add(id)); return n; });
  const toggleOne = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const colSpan = visibleCols.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0) + (expandable ? 1 : 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
        {searchable && (
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={rawQuery} onChange={(e) => setRawQuery(e.target.value)} placeholder={searchPlaceholder}
              aria-label="Search" className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30" />
          </div>
        )}
        <div className="relative">
          <button type="button" onClick={() => setColsOpen((o) => !o)} aria-expanded={colsOpen}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            <SlidersHorizontal className="h-4 w-4" />Columns<ChevronDown className="h-3.5 w-3.5" />
          </button>
          {colsOpen && (
            <div className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {columns.map((c) => (
                <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50">
                  <input type="checkbox" checked={!hidden.has(c.key)} onChange={() => setHidden((h) => { const n = new Set(h); n.has(c.key) ? n.delete(c.key) : n.add(c.key); return n; })}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-brand" />{c.header}
                </label>
              ))}
            </div>
          )}
        </div>
        {toolbar}
      </div>

      {/* bulk actions bar */}
      {selectable && selected.size > 0 && (
        <div className="flex items-center gap-3 border-b border-brand/20 bg-brand/[0.04] px-4 py-2.5">
          <span className="text-[13px] font-semibold text-slate-700">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            {(bulkActions ?? []).map((a, i) => (
              <button key={i} type="button" onClick={() => a.onClick([...selected])}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold ${a.danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-white"}`}>{a.label}</button>
            ))}
            <button type="button" onClick={() => setSelected(new Set())} className="rounded-lg px-3 py-1.5 text-[13px] font-semibold text-slate-500 hover:bg-white">Clear</button>
          </div>
        </div>
      )}

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-gradient-to-b from-slate-50 to-slate-100/60">
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              {selectable && <th className="w-10 px-4 py-3"><input type="checkbox" checked={allChecked} onChange={toggleAll} aria-label="Select all" className="h-4 w-4 rounded border-slate-300 text-brand" /></th>}
              {expandable && <th className="w-8 px-2" />}
              {visibleCols.map((c) => (
                <th key={c.key} style={{ width: c.width }} className={`px-4 py-3 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}>
                  {c.sortable ? (
                    <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-slate-600">
                      {c.header}
                      {sort?.key === c.key && (sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                    </button>
                  ) : c.header}
                </th>
              ))}
              {rowActions && <th className="w-16 px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: colSpan }).map((__, j) => <td key={j} className="px-4 py-3.5"><div className="skeleton h-4 w-full max-w-[160px]" /></td>)}</tr>
              ))
            ) : error ? (
              <tr><td colSpan={colSpan} className="px-4 py-16 text-center">
                <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
                <p className="text-sm font-semibold text-slate-700">{error}</p>
                {onRetry && <button onClick={onRetry} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50"><RefreshCw className="h-3.5 w-3.5" />Retry</button>}
              </td></tr>
            ) : pageRows.length === 0 ? (
              <tr><td colSpan={colSpan} className="px-4 py-16 text-center">
                <Inbox className="mx-auto mb-3 h-9 w-9 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">{emptyTitle}</p>
                <p className="mt-1 text-[13px] text-slate-400">{emptyDescription}</p>
              </td></tr>
            ) : (
              pageRows.map((row) => {
                const id = getRowId(row); const open = expanded.has(id);
                return (
                  <React.Fragment key={id}>
                    <tr className="transition-colors hover:bg-cyan-50/40">
                      {selectable && <td className="px-4 py-3"><input type="checkbox" checked={selected.has(id)} onChange={() => toggleOne(id)} aria-label="Select row" className="h-4 w-4 rounded border-slate-300 text-brand" /></td>}
                      {expandable && <td className="px-2"><button type="button" onClick={() => setExpanded((e) => { const n = new Set(e); n.has(id) ? n.delete(id) : n.add(id); return n; })} aria-label="Expand row" className="text-slate-400 hover:text-slate-700"><ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} /></button></td>}
                      {visibleCols.map((c) => (
                        <td key={c.key} className={`px-4 py-3 text-slate-700 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : ""}`}>
                          {c.cell ? c.cell(row) : String((row as Record<string, unknown>)[c.key] ?? "—")}
                        </td>
                      ))}
                      {rowActions && <td className="px-4 py-3 text-right">{rowActions(row)}</td>}
                    </tr>
                    {expandable && open && <tr className="bg-slate-50/40"><td colSpan={colSpan} className="px-6 py-4">{expandable(row)}</td></tr>}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* footer / pagination */}
      {!loading && !error && totalRows > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-[13px] text-slate-500">
          <span>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalRows)} of {totalRows}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => goPage(page - 1)} disabled={page <= 1} aria-label="Previous page" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft className="h-4 w-4" /></button>
            <span className="px-2 font-semibold text-slate-600">{page} / {totalPages}</span>
            <button onClick={() => goPage(page + 1)} disabled={page >= totalPages} aria-label="Next page" className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
