"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Eye, Pencil, Copy, CheckCircle2, EyeOff, Trash2 } from "lucide-react";
import { DataTable, StatusBadge, RowActions, formatDate, type Column } from "@/components/admin/DataTable";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface BlogPost {
  id: string; slug: string; title: string; category_title?: string; author_name?: string;
  is_published?: boolean; featured?: boolean; published_at?: string; created_at?: string;
}
interface BlogList { posts: BlogPost[]; total: number }

const PAGE_SIZE = 10;

/**
 * Blog list — reference CRUD list. Pure configuration of the generic DataTable in server (`manual`)
 * mode against the extended `/api/admin/blog`. Search/sort/pagination/bulk are all server-driven.
 */
export default function AdminBlogListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [status, setStatus] = useState<"" | "published" | "draft">("");

  const url = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (query) p.set("q", query);
    if (status) p.set("status", status);
    if (sort) { p.set("sort", sort.key); p.set("dir", sort.dir); }
    return `/api/admin/blog?${p.toString()}`;
  }, [page, query, status, sort]);

  const { data, loading, error, reload } = useAdminFetch<BlogList>(url, { onUnauthorized: () => router.push("/admin") });

  const single = async (id: string, action: "publish" | "unpublish" | "delete", slug?: string) => {
    if (action === "delete" && !window.confirm("Delete this post? This cannot be undone.")) return;
    if (action === "delete") await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    else await fetch(`/api/admin/blog/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_published: action === "publish", slug }) });
    reload();
  };
  const bulk = async (action: "publish" | "unpublish" | "delete", ids: string[]) => {
    if (action === "delete" && !window.confirm(`Delete ${ids.length} post(s)?`)) return;
    await fetch("/api/admin/blog/bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ids }) });
    reload();
  };

  const columns: Column<BlogPost>[] = [
    {
      key: "title", header: "Title", sortable: true, sortValue: (r) => r.title, searchText: (r) => r.title,
      cell: (r) => (
        <div className="min-w-0">
          <div className="truncate font-semibold text-slate-800">{r.title}{r.featured && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">Featured</span>}</div>
          <div className="truncate text-[12px] text-slate-400">/{r.slug}</div>
        </div>
      ),
    },
    { key: "category_title", header: "Category", sortable: true, cell: (r) => r.category_title || "—" },
    { key: "author_name", header: "Author", sortable: true, cell: (r) => r.author_name || "—" },
    { key: "is_published", header: "Status", sortable: true, cell: (r) => <StatusBadge label={r.is_published ? "Published" : "Draft"} tone={r.is_published ? "green" : "slate"} /> },
    { key: "published_at", header: "Published", sortable: true, cell: (r) => formatDate(r.published_at) },
    { key: "created_at", header: "Created", sortable: true, defaultHidden: true, cell: (r) => formatDate(r.created_at) },
  ];

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Blog</h2>
          <p className="text-sm text-slate-500">Manage articles, categories and publishing.</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500">
          <Plus className="h-4 w-4" />New post
        </Link>
      </div>

      <DataTable<BlogPost>
        columns={columns}
        data={data?.posts ?? []}
        getRowId={(r) => r.id}
        loading={loading}
        error={error}
        onRetry={reload}
        manual
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onQueryChange={(q) => { setQuery(q); setPage(1); }}
        onSortChange={(s) => { setSort(s); setPage(1); }}
        searchPlaceholder="Search title, slug, category, author…"
        selectable
        bulkActions={[
          { label: "Publish", onClick: (ids) => bulk("publish", ids) },
          { label: "Unpublish", onClick: (ids) => bulk("unpublish", ids) },
          { label: "Delete", danger: true, onClick: (ids) => bulk("delete", ids) },
        ]}
        emptyTitle="No blog posts yet"
        emptyDescription="Create your first article to see it here."
        toolbar={
          <select value={status} onChange={(e) => { setStatus(e.target.value as "" | "published" | "draft"); setPage(1); }}
            aria-label="Filter by status" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand/30">
            <option value="">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        }
        rowActions={(r) => (
          <RowActions actions={[
            { label: "View", icon: Eye, onClick: () => window.open(`/blog/${r.slug}`, "_blank") },
            { label: "Edit", icon: Pencil, onClick: () => router.push(`/admin/blog/${r.id}`) },
            { label: "Duplicate", icon: Copy, disabled: true, onClick: () => {} },
            r.is_published
              ? { label: "Unpublish", icon: EyeOff, onClick: () => single(r.id, "unpublish", r.slug) }
              : { label: "Publish", icon: CheckCircle2, onClick: () => single(r.id, "publish", r.slug) },
            { label: "Delete", icon: Trash2, danger: true, onClick: () => single(r.id, "delete") },
          ]} />
        )}
      />
    </div>
  );
}
