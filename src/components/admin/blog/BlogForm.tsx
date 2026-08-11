"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  AlertCircle, CheckCircle2, Upload, Loader2, BookOpen, Plus, Sparkles, 
  Eye, Edit2, History, RotateCcw, Link2, HelpCircle, Image as ImageIcon, X
} from "lucide-react";
import {
  useForm, FormSection, FormRow, CollapsiblePanel, FormActions,
  TextField, TextArea, SlugField, SelectField, SwitchField, NumberField, DateField,
  ImageUploadField, TagInput, ArrayField, FieldShell
} from "@/components/admin/FormKit";
import { required, maxLen, slug as slugRule, type FieldSchema } from "@/lib/admin/validators";
import { LessonIframe } from "@/components/shared/LessonIframe";
import { BLOG_BLOCKS, ContentBlock } from "@/lib/admin/blogBlocks";
import { toDirectImageUrl, isShareLink } from "@/lib/mediaUrl";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const schema: FieldSchema = {
  title: [required("Title is required"), maxLen(160)],
  slug: [required("Slug is required"), slugRule(), maxLen(160)],
  description: [maxLen(300)],
  category_title: [required("Category is required")],
  author_name: [required("Author is required")],
  seo_title: [maxLen(70)],
  seo_description: [maxLen(160)],
};

function toPayload(v: Record<string, unknown>, status: string) {
  const s = (v.slug as string) || "";
  const authors = (v.authors_json as any[]) || [];
  
  const firstAuthorName = authors.length > 0 ? authors[0].name : (v.author_name as string) || "KVJ Analytics";
  const firstAuthorSlug = authors.length > 0 ? authors[0].slug : (v.author_slug as string) || "kvj-analytics";
  const firstAuthorBio = authors.length > 0 ? authors[0].bio : (v.author_bio as string) || "";
  
  const categoryTitle = (v.category_title as string) || "Insights";
  const categorySlug = (v.category_slug as string) || "insights";

  // Build category JSON
  const categoryJson = {
    title: categoryTitle,
    slug: categorySlug,
    icon: (v.category_icon as string) || "BookOpen",
    color: (v.category_color as string) || "brand",
    description: (v.category_description as string) || "",
    featured: !!v.category_featured,
    order: Number(v.category_order) || 1,
    visibility: v.category_visibility !== false,
    seo: {
      title: (v.category_seo_title as string) || "",
      description: (v.category_seo_description as string) || "",
    }
  };

  // Build history entry if body changed
  const historyEntries = (v.version_history as any[]) || [];
  const latestHistory = historyEntries[0];
  let finalHistory = historyEntries;
  if (!latestHistory || latestHistory.body_html !== v.body_html || latestHistory.title !== v.title) {
    finalHistory = [
      {
        id: `ver-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString(),
        title: v.title,
        body_html: v.body_html,
        description: v.description,
      },
      ...historyEntries
    ].slice(0, 10);
  }

  return {
    title: v.title,
    slug: s,
    description: v.description,
    body_html: v.body_html,
    cover_url: v.cover_url,
    
    // Legacy fields for backward compatibility
    author_name: firstAuthorName,
    author_slug: firstAuthorSlug,
    author_bio: firstAuthorBio,
    category_title: categoryTitle,
    category_slug: categorySlug,
    
    published_at: (v.published_at as string) || new Date().toISOString(),
    featured: !!v.featured,
    is_published: status === "published",
    display_order: Number(v.display_order) || 1,

    // Upgraded enhanced columns
    status: status,
    featured_flags: v.featured_flags || [],
    tags: v.tags || [],
    seo_title: v.seo_title || "",
    seo_description: v.seo_description || "",
    seo_keywords: v.seo_keywords || "",
    authors_json: authors,
    category_json: categoryJson,
    related_ids: v.related_ids || [],
    version_history: finalHistory,
  };
}

export interface BlogInitial { [k: string]: unknown }

export function BlogForm({ id, initial }: { id?: string; initial?: BlogInitial }) {
  const router = useRouter();
  const pending = useRef<string | null>(null);
  const [banner, setBanner] = useState<{ ok: boolean; msg: string } | null>(null);
  
  // Editor and Block picker state
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [importing, setImporting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedBlockCat, setSelectedBlockCat] = useState<string>(BLOG_BLOCKS[0].category);
  const [otherPosts, setOtherPosts] = useState<any[]>([]);

  // Image insertion modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalTab, setModalTab] = useState<"upload" | "link">("upload");
  const [modalLink, setModalLink] = useState("");
  const [modalAlt, setModalAlt] = useState("");
  const [modalUploading, setModalUploading] = useState(false);
  const [modalErr, setModalErr] = useState("");
  const [modalConverted, setModalConverted] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputId = React.useId();

  // Load other posts for related suggestions
  useEffect(() => {
    const fetchOther = async () => {
      try {
        const res = await fetch("/api/admin/blog?pageSize=100");
        const json = await res.json();
        if (json && json.posts) {
          setOtherPosts(json.posts.filter((p: any) => p.id !== id));
        }
      } catch (err) {
        console.error("Failed to fetch other posts:", err);
      }
    };
    fetchOther();
  }, [id]);

  // Compute initial category_json values
  const categoryJson = (initial?.category_json as Record<string, any>) || {};
  const initialAuthors = (initial?.authors_json as any[]) || [
    {
      name: (initial?.author_name as string) || "KVJ Analytics",
      slug: (initial?.author_slug as string) || "kvj-analytics",
      bio: (initial?.author_bio as string) || "",
      avatar_url: "",
      designation: "Consultant",
      company: "KVJ Analytics",
      is_featured: true,
      is_guest: false,
      social_links: {}
    }
  ];

  const form = useForm<Record<string, unknown>>({
    initial: {
      title: "", slug: "", description: "", body_html: "", cover_url: "",
      author_name: "KVJ Analytics", author_slug: "", author_bio: "",
      category_title: "Insights", category_slug: "", published_at: "", featured: false,
      status: "published", display_order: 1, tags: [], seo_title: "", seo_description: "", seo_keywords: "",
      
      // Upgraded default fields
      featured_flags: (initial?.featured ? ["featured"] : []),
      authors_json: initialAuthors,
      category_icon: categoryJson.icon || "BookOpen",
      category_color: categoryJson.color || "brand",
      category_description: categoryJson.description || "",
      category_featured: !!categoryJson.featured,
      category_order: categoryJson.order ?? 1,
      category_visibility: categoryJson.visibility !== false,
      category_seo_title: categoryJson.seo?.title || "",
      category_seo_description: categoryJson.seo?.description || "",
      related_ids: initial?.related_ids || [],
      version_history: initial?.version_history || [],
      
      ...(initial ?? {}),
    },
    schema,
    onSubmit: async (values) => {
      const status = pending.current ?? (values.status as string);
      pending.current = null;
      setBanner(null);
      
      // Generate version snapshot and map payload
      const payload = toPayload(values, status);
      
      try {
        const res = await fetch(id ? `/api/admin/blog/${id}` : "/api/admin/blog", {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.status === 401) { router.push("/admin"); return; }
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Save failed");
        setBanner({ ok: true, msg: "Saved successfully." });
        
        // Remove local autosave on successful submit
        localStorage.removeItem(`kvj_autosave_${id || "new"}`);
        
        setTimeout(() => router.push("/admin/blog"), 600);
      } catch (e) {
        setBanner({ ok: false, msg: e instanceof Error ? e.message : "Save failed" });
      }
    },
  });

  // Local Autosave feature
  useEffect(() => {
    if (!form.isDirty) return;
    const timer = setTimeout(() => {
      localStorage.setItem(
        `kvj_autosave_${id || "new"}`,
        JSON.stringify({
          values: form.values,
          timestamp: new Date().toISOString()
        })
      );
    }, 2000); // Autosave 2s after typing stops
    return () => clearTimeout(timer);
  }, [form.values, form.isDirty, id]);

  // Load Autosave if available
  const [hasAutosave, setHasAutosave] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(`kvj_autosave_${id || "new"}`);
    if (saved) {
      setHasAutosave(true);
    }
  }, [id]);

  const restoreAutosave = () => {
    const saved = localStorage.getItem(`kvj_autosave_${id || "new"}`);
    if (saved) {
      try {
        const { values } = JSON.parse(saved);
        Object.keys(values).forEach(k => {
          form.setValue(k, values[k]);
        });
        setHasAutosave(false);
        setBanner({ ok: true, msg: "Restored from autosaved local draft." });
      } catch {}
    }
  };

  const submit = (override?: string) => { 
    pending.current = override ?? null; 
    form.handleSubmit(); 
  };
  
  const cancel = () => { 
    if (!form.isDirty || window.confirm("Discard unsaved changes?")) router.push("/admin/blog"); 
  };

  const insertContent = (content: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      const current = (form.values.body_html as string) || "";
      form.setValue("body_html", current + content);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const updated = text.substring(0, start) + content + text.substring(end);
    
    form.setValue("body_html", updated);
    
    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + content.length;
    }, 50);
  };

  // HTML content block insertion helper
  const insertBlock = (block: ContentBlock) => {
    insertContent(`\n${block.template}\n`);
  };

  const handleModalLinkChange = (raw: string) => {
    setModalErr("");
    const direct = toDirectImageUrl(raw);
    setModalConverted(direct !== raw && isShareLink(raw));
    setModalLink(direct);
  };

  const handleModalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setModalUploading(true);
    setModalErr("");
    setModalConverted(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      // Auto-insert image tag and close modal
      const imgTag = `\n<img src="${data.url}" alt="${modalAlt || file.name.split(".")[0]}" class="rounded-2xl my-6 w-full object-cover shadow-md" />\n`;
      insertContent(imgTag);
      setShowImageModal(false);
      setModalLink("");
      setModalAlt("");
    } catch (err: any) {
      setModalErr(err.message || "Failed to upload file");
    } finally {
      setModalUploading(false);
      e.target.value = "";
    }
  };

  const insertLinkImage = () => {
    if (!modalLink) {
      setModalErr("Please enter a valid image URL.");
      return;
    }
    const imgTag = `\n<img src="${modalLink}" alt="${modalAlt || "Article Image"}" class="rounded-2xl my-6 w-full object-cover shadow-md" />\n`;
    insertContent(imgTag);
    setShowImageModal(false);
    setModalLink("");
    setModalAlt("");
  };

  // Dynamic HTML import and relative image uploads
  const handleImportHtml = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const htmlFile = Array.from(files).find(f => 
      f.name.toLowerCase().endsWith(".html") || f.name.toLowerCase().endsWith(".htm")
    );
    if (!htmlFile) {
      alert("Please select a .html or .htm file to import.");
      return;
    }

    setImporting(true);
    try {
      const text = await htmlFile.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const images = Array.from(doc.querySelectorAll("img[src]"));

      const fileMap = new Map<string, File>();
      Array.from(files).forEach(f => {
        if (f !== htmlFile) {
          const name = f.name.split(/[\\/]/).pop()!;
          fileMap.set(name, f);
          fileMap.set(f.name, f);
        }
      });

      for (const img of images) {
        const src = img.getAttribute("src") || "";
        if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) continue;

        const base = src.split(/[\\/]/).pop()!;
        const file = fileMap.get(src) || fileMap.get(base);
        if (!file) continue;

        try {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (res.ok && data.url) {
            img.setAttribute("src", data.url);
            setUploadedImages(prev => [...prev, data.url]);
          }
        } catch {}
      }

      form.setValue("body_html", doc.body.innerHTML);
      setBanner({ ok: true, msg: "HTML document imported and relative assets uploaded." });
    } catch (err: any) {
      alert("Failed to import HTML: " + err.message);
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const blockCategories = Array.from(new Set(BLOG_BLOCKS.map(b => b.category)));
  const filteredBlocks = BLOG_BLOCKS.filter(b => b.category === selectedBlockCat);

  const featuredFlagsList = [
    { label: "Featured", value: "featured" },
    { label: "Trending", value: "trending" },
    { label: "Editor's Pick", value: "editors_pick" },
    { label: "Popular", value: "popular" },
    { label: "Latest", value: "latest" },
    { label: "Pinned", value: "pinned" },
  ];

  return (
    <>
      <div className="mx-auto max-w-[1100px] p-4 pb-24 md:p-6 lg:p-8">
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{id ? "Edit blog article" : "Create blog article"}</h2>
          <p className="text-sm text-slate-500">
            {form.isDirty ? "Unsaved changes" : "No unsaved changes"}
          </p>
        </div>
        
        {hasAutosave && (
          <button 
            type="button" 
            onClick={restoreAutosave}
            className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore local autosave
          </button>
        )}
      </div>

      {banner && (
        <div className={`mb-5 flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold ${banner.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {banner.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{banner.msg}
        </div>
      )}

      <div className="space-y-5">
        <FormSection title="General Information" description="Article core metadata, slug, and descriptions.">
          <TextField form={form} name="title" label="Title" required maxLength={160}
            placeholder="Post title" description="Featured as the main article headline." />
          <div>
            <SlugField form={form} name="slug" label="Slug" required maxLength={160} />
            <button type="button" onClick={() => form.setValue("slug", slugify((form.values.title as string) || ""))}
              className="mt-1 text-[12px] font-semibold text-brand hover:underline">Generate slug from title</button>
          </div>
          <TextArea form={form} name="description" label="Excerpt" rows={3} maxLength={300} description="Short article summary displayed in grid listings." />
          <ImageUploadField form={form} name="cover_url" label="Featured Cover Image" />
        </FormSection>

        {/* Dynamic HTML Content Editor Component */}
        <FormSection title="Article content body" description="Composed using the shared premium block templates library.">
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 bg-slate-50/70 p-3 gap-2">
              <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit self-start gap-1">
                <button
                  type="button"
                  onClick={() => setEditorTab("write")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${editorTab === "write" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Write (HTML)
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${editorTab === "preview" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Live Preview
                </button>
              </div>

              {editorTab === "write" && (
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id={fileInputId}
                    accept=".html,.htm,image/*"
                    multiple
                    className="hidden"
                    onChange={handleImportHtml}
                  />
                  <label htmlFor={fileInputId} className="cursor-pointer px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm shrink-0">
                    {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>Import HTML file</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => { setShowImageModal(true); setModalLink(""); setModalAlt(""); setModalErr(""); }}
                    className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-[#43F5FF]/30 text-slate-650 hover:text-slate-905 text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm shrink-0 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-brand" />
                    <span>Insert Image</span>
                  </button>
                </div>
              )}
            </div>

            {/* Split Writing Area */}
            {editorTab === "write" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-8 border-b lg:border-b-0 lg:border-r border-slate-100">
                  <textarea
                    ref={textareaRef}
                    rows={18}
                    placeholder="<div>Paste article HTML here or use the block templates library...</div>"
                    value={(form.values.body_html as string) || ""}
                    onChange={(e) => form.setValue("body_html", e.target.value)}
                    className="w-full p-4 border-none focus:outline-none text-xs font-mono resize-y"
                  />
                </div>
                
                {/* Block Picker Panel */}
                <div className="lg:col-span-4 bg-slate-50/20 p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-brand" /> Block library
                    </h5>
                  </div>
                  
                  <select
                    value={selectedBlockCat}
                    onChange={(e) => setSelectedBlockCat(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    {blockCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredBlocks.map(block => (
                      <button
                        key={block.id}
                        type="button"
                        onClick={() => insertBlock(block)}
                        className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col transition-all group"
                      >
                        <span className="text-xs font-bold text-slate-800 group-hover:text-brand transition-colors">{block.name}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{block.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Live sandboxed rendering panel */
              <div className="p-6 bg-slate-900 min-h-[400px] max-h-[500px] overflow-y-auto">
                <LessonIframe html={(form.values.body_html as string) || ""} />
              </div>
            )}
          </div>
        </FormSection>

        {/* Categories Enhancements Panel */}
        <FormSection title="Category Configurations" description="Manage details for categories.">
          <FormRow cols={2}>
            <TextField form={form} name="category_title" label="Category name" required />
            <SlugField form={form} name="category_slug" label="Category slug" placeholder="auto-generated from name" />
          </FormRow>
          <FormRow cols={2}>
            <TextField form={form} name="category_icon" label="Category Icon" placeholder="BookOpen, Sparkles, Layout, etc." />
            <SelectField form={form} name="category_color" label="Theme Color" 
              options={[
                { label: "Cyan Accent", value: "brand" },
                { label: "Blue Corporate", value: "corporate" },
                { label: "Emerald Success", value: "emerald" },
                { label: "Amber Warning", value: "amber" },
              ]} 
            />
          </FormRow>
          <TextArea form={form} name="category_description" label="Category Description" rows={2} />
          <FormRow cols={3}>
            <SwitchField form={form} name="category_featured" label="Featured category" />
            <NumberField form={form} name="category_order" label="Sort Order" />
            <SwitchField form={form} name="category_visibility" label="Publicly visible" />
          </FormRow>
          <CollapsiblePanel title="Category SEO Metadata">
            <TextField form={form} name="category_seo_title" label="Category SEO Title" />
            <TextArea form={form} name="category_seo_description" label="Category SEO Description" rows={2} />
          </CollapsiblePanel>
        </FormSection>

        {/* Enhanced Multi-Author Profiles Section */}
        <FormSection title="Author Profiles" description="Support for multiple author credentials per article.">
          <ArrayField
            form={form}
            name="authors_json"
            newItem={() => ({
              name: "", slug: "", bio: "", avatar_url: "",
              designation: "Consultant", company: "KVJ Analytics",
              is_featured: false, is_guest: false, social_links: {}
            })}
            addLabel="Add Co-Author"
            render={(item: any, index: number, setItem: (patch: any) => void) => (
              <div className="space-y-3">
                <FormRow cols={2}>
                  <FieldShell label="Author Name *" required>
                    <input
                      type="text"
                      value={item.name || ""}
                      onChange={(e) => {
                        setItem({ name: e.target.value, slug: slugify(e.target.value) });
                        if (index === 0) {
                          form.setValue("author_name", e.target.value);
                          form.setValue("author_slug", slugify(e.target.value));
                        }
                      }}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 border-slate-200 focus:border-brand/40 transition-colors"
                      placeholder="e.g. John Doe"
                    />
                  </FieldShell>
                  <FieldShell label="Author Slug">
                    <input
                      type="text"
                      value={item.slug || ""}
                      onChange={(e) => {
                        setItem({ slug: e.target.value });
                        if (index === 0) form.setValue("author_slug", e.target.value);
                      }}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 border-slate-200 focus:border-brand/40 transition-colors"
                      placeholder="john-doe"
                    />
                  </FieldShell>
                </FormRow>
                <FormRow cols={2}>
                  <FieldShell label="Designation / Role">
                    <input
                      type="text"
                      value={item.designation || ""}
                      onChange={(e) => setItem({ designation: e.target.value })}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 border-slate-200 focus:border-brand/40 transition-colors"
                      placeholder="e.g. Consultant"
                    />
                  </FieldShell>
                  <FieldShell label="Company / Affiliation">
                    <input
                      type="text"
                      value={item.company || ""}
                      onChange={(e) => setItem({ company: e.target.value })}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 border-slate-200 focus:border-brand/40 transition-colors"
                      placeholder="e.g. KVJ Analytics"
                    />
                  </FieldShell>
                </FormRow>
                <FieldShell label="Avatar Photo URL">
                  <input
                    type="text"
                    value={item.avatar_url || ""}
                    onChange={(e) => setItem({ avatar_url: toDirectImageUrl(e.target.value) })}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 border-slate-200 focus:border-brand/40 transition-colors"
                    placeholder="https://images.unsplash.com/..."
                  />
                </FieldShell>
                <FieldShell label="Short Bio">
                  <textarea
                    value={item.bio || ""}
                    onChange={(e) => {
                      setItem({ bio: e.target.value });
                      if (index === 0) form.setValue("author_bio", e.target.value);
                    }}
                    rows={2}
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 border-slate-200 focus:border-brand/40 transition-colors"
                    placeholder="Brief description of the author..."
                  />
                </FieldShell>
                <FormRow cols={2}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700">Featured Author</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!item.is_featured}
                      onClick={() => setItem({ is_featured: !item.is_featured })}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${!!item.is_featured ? "bg-brand" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${!!item.is_featured ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[13px] font-semibold text-slate-700">Guest Writer</div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!item.is_guest}
                      onClick={() => setItem({ is_guest: !item.is_guest })}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${!!item.is_guest ? "bg-brand" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${!!item.is_guest ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                </FormRow>
              </div>
            )}
          />
        </FormSection>

        {/* Enhanced Tags & Featured Flags Panel */}
        <FormSection title="Filters & Flags" description="Configure category taxonomy and homepage placement widgets.">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Featured Placement Flags</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featuredFlagsList.map(flag => {
                  const currentFlags = (form.values.featured_flags as string[]) || [];
                  const checked = currentFlags.includes(flag.value);
                  return (
                    <label key={flag.value} className="flex items-center gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const nextFlags = checked
                            ? currentFlags.filter(f => f !== flag.value)
                            : [...currentFlags, flag.value];
                          form.setValue("featured_flags", nextFlags);
                          if (flag.value === "featured") {
                            form.setValue("featured", !checked);
                          }
                        }}
                        className="rounded border-slate-300 text-brand focus:ring-brand h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-700">{flag.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <TagInput form={form} name="tags" label="Article Tags" help="Press Enter to add tag keys (e.g. power-bi, excel-macros)." />
          </div>
        </FormSection>

        {/* Related Content & Category Links */}
        <FormSection title="Relations & Connections" description="Link this article to other posts, products or certifications.">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Related Articles</label>
            {otherPosts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No other published posts available to link.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/20">
                {otherPosts.map(post => {
                  const currentRelated = (form.values.related_ids as string[]) || [];
                  const isRelated = currentRelated.includes(post.id);
                  return (
                    <label key={post.id} className="flex items-center gap-2 p-2 border border-slate-100 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-all">
                      <input
                        type="checkbox"
                        checked={isRelated}
                        onChange={() => {
                          const nextRelated = isRelated
                            ? currentRelated.filter(id => id !== post.id)
                            : [...currentRelated, post.id];
                          form.setValue("related_ids", nextRelated);
                        }}
                        className="rounded border-slate-300 text-brand focus:ring-brand h-3.5 w-3.5"
                      />
                      <span className="text-xs font-semibold text-slate-700 line-clamp-1">{post.title}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </FormSection>

        {/* SEO Management */}
        <CollapsiblePanel title="SEO Meta Adjustments">
          <TextField form={form} name="seo_title" label="Meta SEO Title" maxLength={70} placeholder="Override title tag..." />
          <TextArea form={form} name="seo_description" label="Meta SEO Description" rows={2} maxLength={160} placeholder="Override description tag..." />
          <TagInput form={form} name="seo_keywords" label="SEO Keywords" />
        </CollapsiblePanel>

        {/* Version History Restoration Section */}
        {id && (form.values.version_history as any[] || []).length > 0 && (
          <CollapsiblePanel title="Version Backup History">
            <div className="space-y-2">
              {(form.values.version_history as any[]).map((v) => (
                <div key={v.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{v.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <History className="w-3 h-3" />
                      {new Date(v.timestamp).toLocaleString("en-IN", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Restore this version? Unsaved changes will be replaced.")) {
                        form.setValue("title", v.title);
                        form.setValue("body_html", v.body_html);
                        if (v.description) form.setValue("description", v.description);
                        setBanner({ ok: true, msg: "Restored content version successfully." });
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-brand bg-white border border-slate-200 hover:border-brand/40 px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore
                  </button>
                </div>
              ))}
            </div>
          </CollapsiblePanel>
        )}

        <FormSection title="Publishing Status">
          <FormRow cols={2}>
            <SelectField 
              form={form} 
              name="status" 
              label="Article Status" 
              options={[
                { label: "Draft / Private", value: "draft" },
                { label: "Ready for Review", value: "review" },
                { label: "Published / Live", value: "published" },
                { label: "Scheduled (Future Date)", value: "scheduled" },
                { label: "Archived", value: "archived" },
              ]} 
            />
            <DateField form={form} name="published_at" label="Publish Date / Schedule Time" />
          </FormRow>
          <FormRow cols={2}>
            <NumberField form={form} name="display_order" label="Display Priority Order" />
            <SwitchField form={form} name="featured" label="Homepage Featured" description="Display in primary hero spot on main blog feed." />
          </FormRow>
        </FormSection>
      </div>

      <FormActions
        saving={form.isSubmitting}
        saveLabel={id ? "Save changes" : "Create post"}
        onSave={() => submit()}
        onSaveDraft={() => submit("draft")}
        onPublish={() => submit("published")}
        onCancel={cancel}
      />
    </div>
    {/* Insert Image Modal Dialog Overlay */}
    {showImageModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white border border-slate-200 rounded-[24px] max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-brand" /> Insert Image Component
            </h3>
            <button 
              type="button" 
              onClick={() => { setShowImageModal(false); setModalLink(""); setModalAlt(""); setModalErr(""); }}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full gap-1">
            <button
              type="button"
              onClick={() => { setModalTab("upload"); setModalErr(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${modalTab === "upload" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Upload Local File
            </button>
            <button
              type="button"
              onClick={() => { setModalTab("link"); setModalErr(""); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${modalTab === "link" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              Paste Share Link
            </button>
          </div>

          <div className="space-y-4">
            {modalTab === "upload" ? (
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Choose Image File</label>
                <div className="border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-6 text-center cursor-pointer relative transition-all group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleModalFileUpload}
                    disabled={modalUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    {modalUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-brand" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand transition-colors" />
                    )}
                    <span className="text-xs font-bold text-slate-700">
                      {modalUploading ? "Uploading image..." : "Drag image here or click to browse"}
                    </span>
                    <span className="text-[10px] text-slate-400">Supports PNG, JPG, WEBP</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Image URL / Share Link (OneDrive / Google Drive)</label>
                  <input
                    type="text"
                    value={modalLink}
                    onChange={(e) => handleModalLinkChange(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or https://..."
                    className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 border-slate-200 focus:border-brand/40 transition-colors"
                  />
                  {modalConverted && (
                    <p className="mt-1 text-[11px] font-semibold text-emerald-600">✓ Share link converted to a direct embed link.</p>
                  )}
                </div>

                {modalLink && !modalErr && (
                  <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Preview</span>
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={modalLink} 
                        alt="Preview" 
                        onError={() => setModalErr("Invalid image link. Make sure the file sharing settings are set to 'Anyone with the link'.")}
                        className="h-full w-full object-contain" 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Image Alt Caption Text (Recommended)</label>
              <input
                type="text"
                value={modalAlt}
                onChange={(e) => setModalAlt(e.target.value)}
                placeholder="Describe this image for screen readers and SEO..."
                className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 border-slate-200 focus:border-brand/40 transition-colors"
              />
            </div>

            {modalErr && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">{modalErr}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => { setShowImageModal(false); setModalLink(""); setModalAlt(""); setModalErr(""); }}
              className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {modalTab === "link" && (
              <button
                type="button"
                onClick={insertLinkImage}
                disabled={!modalLink}
                className="px-4 py-2 bg-brand text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#16E6D8] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Insert Image
              </button>
            )}
          </div>
        </div>
      </div>
    )}
  </>
);
}
