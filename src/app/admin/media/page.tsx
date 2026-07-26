"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon, Upload, Trash2, Search, Loader2, AlertCircle,
  Copy, Check, FileText, Video, File as FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "document" | "other";
  mime_type: string | null;
  size_bytes: number;
  folder: string;
  tags: string[];
  created_at: string;
}

function inferType(mime: string): MediaItem["type"] {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf" || mime.includes("document") || mime.includes("word")) return "document";
  return "other";
}

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0, n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function AdminMediaPage() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaItem["type"]>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/media");
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.media || []);
    } catch (e: any) { setError(e.message || "Failed to load media library."); }
    finally { setLoading(false); }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true); setError("");
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: form });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

        const metaRes = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            url: uploadData.url,
            type: inferType(file.type),
            mime_type: file.type,
            size_bytes: file.size,
            folder: "uploads",
          }),
        });
        if (!metaRes.ok) { const d = await metaRes.json(); throw new Error(d.error || "Failed to save media record"); }
      }
      fetchItems();
    } catch (e: any) { setError(e.message || "Upload failed."); }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = ""; }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file? This removes it from the media library.")) return;
    setDeletingId(id);
    await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems((prev) => prev.filter((m) => m.id !== id));
    setDeletingId(null);
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filtered = items.filter((m) => {
    if (typeFilter !== "all" && m.type !== typeFilter) return false;
    if (query && !m.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-brand" /> Media Library ({items.length})</h2>
          <p className="text-sm text-slate-500 mt-0.5">Images, videos and documents uploaded across the admin panel.</p>
        </div>
        <div>
          <input ref={fileInput} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <Button onClick={() => fileInput.current?.click()} disabled={uploading} className="px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg flex items-center gap-1.5">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3 text-red-700"><AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /><span className="text-sm font-semibold">{error}</span></div>}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by filename..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "image", "video", "document", "other"] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${typeFilter === t ? "bg-brand text-white border-brand" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20 text-slate-400" />
          <p className="font-semibold text-slate-500">No files yet. Upload images, videos or documents to reuse across the site.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
              <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                {item.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : item.type === "video" ? (
                  <Video className="w-8 h-8 text-slate-300" />
                ) : item.type === "document" ? (
                  <FileText className="w-8 h-8 text-slate-300" />
                ) : (
                  <FileIcon className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="p-2.5">
                <div className="truncate text-xs font-semibold text-slate-800" title={item.name}>{item.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{formatBytes(item.size_bytes)}</div>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => copyUrl(item)} className="flex-1 py-1 rounded-md border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1">
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedId === item.id ? "Copied" : "Copy URL"}
                  </button>
                  <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}
                    className="py-1 px-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center">
                    {deletingId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
