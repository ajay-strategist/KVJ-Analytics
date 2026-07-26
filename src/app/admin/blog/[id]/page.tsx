"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";
import { BlogForm } from "@/components/admin/blog/BlogForm";

interface Post {
  id: string; title?: string; slug?: string; description?: string; body_html?: string; cover_url?: string;
  author_name?: string; author_slug?: string; author_bio?: string; category_title?: string; category_slug?: string;
  published_at?: string; featured?: boolean; is_published?: boolean; display_order?: number;
}

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error, reload } = useAdminFetch<{ post: Post }>(`/api/admin/blog/${id}`, { onUnauthorized: () => router.push("/admin") });

  if (loading) {
    return (
      <div className="mx-auto max-w-[1000px] space-y-5 p-4 md:p-6 lg:p-8">
        <div className="skeleton h-8 w-40" />
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          {[0, 1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-10 w-full" />)}
        </div>
      </div>
    );
  }
  if (error || !data?.post) {
    return (
      <div className="mx-auto max-w-[1000px] p-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-sm font-semibold text-slate-700">{error || "Post not found."}</p>
          <button onClick={reload} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50"><RefreshCw className="h-3.5 w-3.5" />Retry</button>
        </div>
      </div>
    );
  }

  const p = data.post as any;
  return (
    <BlogForm
      id={id}
      initial={{
        title: p.title ?? "", slug: p.slug ?? "", description: p.description ?? "", body_html: p.body_html ?? "",
        cover_url: p.cover_url ?? "", author_name: p.author_name ?? "", author_slug: p.author_slug ?? "",
        author_bio: p.author_bio ?? "", category_title: p.category_title ?? "", category_slug: p.category_slug ?? "",
        published_at: p.published_at ? String(p.published_at).slice(0, 10) : "",
        featured: !!p.featured, display_order: p.display_order ?? 1,
        status: p.status ?? (p.is_published ? "published" : "draft"),
        featured_flags: p.featured_flags ?? [],
        tags: p.tags ?? [],
        seo_title: p.seo_title ?? "",
        seo_description: p.seo_description ?? "",
        seo_keywords: p.seo_keywords ?? "",
        authors_json: p.authors_json ?? [],
        category_json: p.category_json ?? {},
        related_ids: p.related_ids ?? [],
        version_history: p.version_history ?? [],
      }}
    />
  );
}
