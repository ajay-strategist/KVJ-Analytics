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
import { generateCustomBlock, type BlockStyleOptions } from "@/lib/admin/customBlockGenerator";

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

  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [blockOptions, setBlockOptions] = useState<BlockStyleOptions>({
    bgType: 'default',
    customBgColor: '',
    alignment: 'left',
    borderStyle: 'default',
    headingStyle: 'standard',
    headingColor: 'white',
    customHeadingColor: '',
    headingFont: 'default',
    bodyFont: 'default',
    headingFontSizeNum: 22,
    bodyFontSizeNum: 15,
  });

  const defaultBlockOptions = (blockId: string): BlockStyleOptions => {
    const defaults: BlockStyleOptions = {
      bgType: 'default',
      customBgColor: '',
      alignment: 'left',
      borderStyle: 'default',
      headingStyle: 'standard',
      headingColor: 'white',
      customHeadingColor: '',
      headingFont: 'default',
      bodyFont: 'default',
      headingFontSizeNum: 22,
      bodyFontSizeNum: 15,
    };

    switch (blockId) {
      case 'callout_info':
        defaults.headingText = 'Important Information';
        defaults.subheadingText = 'Here is key background details to keep in mind regarding this methodology.';
        defaults.calloutTheme = 'blue';
        break;
      case 'callout_warning':
        defaults.headingText = 'Attention Required';
        defaults.subheadingText = 'Be careful when applying these settings, as it may break backward compatibility.';
        defaults.calloutTheme = 'amber';
        break;
      case 'callout_success':
        defaults.headingText = 'Pro Tip / Best Practice';
        defaults.subheadingText = 'Successfully applying this flow will reduce execution times by up to 90%.';
        defaults.calloutTheme = 'emerald';
        break;
      case 'callout_tip':
        defaults.headingText = 'Interactive Spotlight';
        defaults.subheadingText = 'You can customize this template snippet in the editor. Perfect for key takeaways.';
        defaults.calloutTheme = 'purple';
        break;
      case 'layout_2col':
        defaults.col1Heading = 'Left Column Heading';
        defaults.col1Text = 'Add content here. This column is fully responsive and adjusts automatically.';
        defaults.col2Heading = 'Right Column Heading';
        defaults.col2Text = 'Add content here. Ideal for text + image pairing or side-by-side metrics.';
        break;
      case 'layout_3col':
        defaults.col1Heading = 'Column 1';
        defaults.col1Text = 'Description or detail text goes here.';
        defaults.col2Heading = 'Column 2';
        defaults.col2Text = 'Description or detail text goes here.';
        defaults.col3Heading = 'Column 3';
        defaults.col3Text = 'Description or detail text goes here.';
        break;
      case 'accordion_faq':
        defaults.faqQuestion = 'How does this automated script consolidate multiple excel folders?';
        defaults.faqAnswer = 'It reads all spreadsheets placed in the designated input folder, parses their schemas, verifies their integrity, aggregates the records, and writes the output workbook.';
        break;
      case 'tabs_interactive':
        defaults.col1Heading = 'Tab Title 1';
        defaults.col1Text = 'This is the content of the first tab. Great for explaining different approaches, tools or setups side-by-side.';
        defaults.col2Heading = 'Tab Title 2';
        defaults.col2Text = 'This is the content of the second tab. Fully isolated and behaves as a pure interactive element.';
        break;
      case 'timeline_vertical':
        defaults.col1Heading = 'Phase 1 — Discovery';
        defaults.headingText = 'Audit Existing Operations';
        defaults.col1Text = 'Identify Excel spreadsheets, manual copy-paste points, and formula dependencies.';
        defaults.col2Heading = 'Phase 2 — Implementation';
        defaults.subheadingText = 'Deploy Python/VBA Macro Scripts';
        defaults.col2Text = 'Build automatic folder ingestion pipelines and configure live API databases.';
        defaults.col3Heading = 'Phase 3 — Review';
        defaults.buttonText = 'Handover & Testing';
        defaults.col3Text = 'Verify automated PDF scorecard outputs and train team users on dashboard utilities.';
        break;
      case 'media_video':
        defaults.mediaUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        break;
      case 'media_pdf':
        defaults.mediaUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        break;
      case 'media_gallery':
        defaults.col1Text = 'https://picsum.photos/400/400?random=1';
        defaults.col2Text = 'https://picsum.photos/400/400?random=2';
        defaults.col3Text = 'https://picsum.photos/400/400?random=3';
        break;
      case 'text_paragraph_image':
        defaults.col1Text = 'First paragraph of content goes here. Write introductory text before the visual asset.';
        defaults.col2Text = 'Second paragraph of content goes here. Write follow-up explanation or conclusions.';
        defaults.mediaUrl = 'https://picsum.photos/800/400?random=4';
        defaults.headingText = 'Embedded Image';
        break;
      case 'snippet_cta':
        defaults.headingText = 'Automate Your Operations Today';
        defaults.subheadingText = 'Talk to the KVJ Analytics experts and find out how we can save your team hours of report pipelines.';
        defaults.buttonText = 'Schedule Free Audit';
        defaults.buttonUrl = '/contact';
        break;
      case 'snippet_newsletter':
        defaults.headingText = 'Get Weekly Excel & Analytics Tips';
        defaults.subheadingText = 'Join 2,000+ business leaders receiving spreadsheet formulas, dashboards and automation guides.';
        defaults.buttonText = 'Subscribe';
        break;
      case 'snippet_training':
        defaults.headingText = 'Master Excel & MIS Report Automation';
        defaults.subheadingText = 'Advance your career. Gain live certification with hands-on labs, 3D equations, Power BI dashboards and macros evaluation.';
        defaults.buttonText = 'Explore Courses';
        defaults.buttonUrl = '/training';
        break;
    }
    return defaults;
  };

  const insertCustomBlock = () => {
    if (!selectedBlock) return;
    const customHtml = generateCustomBlock(selectedBlock.id, blockOptions);
    insertContent(`\n${customHtml}\n`);
  };

  // Image insertion modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
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

  const renderBlockCustomizer = () => {
    if (!selectedBlock) return null;

    const isCallout = ['callout_info', 'callout_warning', 'callout_success', 'callout_tip'].includes(selectedBlock.id);
    const isParagraphWithImage = selectedBlock.id === 'text_paragraph_image';

    const hasHeading = ['callout_info', 'callout_warning', 'callout_success', 'callout_tip', 'snippet_cta', 'snippet_newsletter', 'snippet_training'].includes(selectedBlock.id);
    const hasSubheading = ['callout_info', 'callout_warning', 'callout_success', 'callout_tip', 'snippet_cta', 'snippet_newsletter', 'snippet_training'].includes(selectedBlock.id);
    const hasColumns2 = ['layout_2col', 'tabs_interactive'].includes(selectedBlock.id);
    const hasColumns3 = ['layout_3col', 'timeline_vertical', 'media_gallery'].includes(selectedBlock.id);
    const hasMedia = ['media_video', 'media_pdf'].includes(selectedBlock.id);
    const hasFaq = selectedBlock.id === 'accordion_faq';
    const hasStats = selectedBlock.id === 'statistics_grid';
    const hasButtons = ['snippet_cta', 'snippet_training'].includes(selectedBlock.id);

    return (
      <div className="space-y-4 animate-fade-in text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <button
            type="button"
            onClick={() => setSelectedBlock(null)}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            ← Back to blocks
          </button>
          <span className="text-[10px] font-extrabold text-brand bg-brand/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {selectedBlock.category}
          </span>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-slate-800">{selectedBlock.name}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">{selectedBlock.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => {
              insertBlock(selectedBlock);
              setSelectedBlock(null);
            }}
            className="px-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
            title="Insert the standard template directly into the post"
          >
            Default
          </button>
          <button
            type="button"
            onClick={() => {
              insertCustomBlock();
              setSelectedBlock(null);
            }}
            className="px-1 py-2 bg-brand text-black text-[10px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#16E6D8] transition-all cursor-pointer text-center"
            title="Insert customized styled block into the post"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-1 py-2 bg-slate-800 hover:bg-slate-750 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
            title="Preview block rendering"
          >
            👁️ Preview
          </button>
        </div>

        <div className="border-t border-slate-100 my-2"></div>

        {/* Scrollable Customize Area */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {/* Section 1: Content Fields */}
          <div className="space-y-2">
            <h6 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">1. Content Customization</h6>
            
            {isCallout && (
              <div className="space-y-3 border border-slate-100 p-2.5 rounded-xl bg-slate-50/50 mb-3 text-left">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Callout Styling Theme</span>
                
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Color Theme</label>
                  <select
                    value={blockOptions.calloutTheme || 'blue'}
                    onChange={(e) => setBlockOptions({ ...blockOptions, calloutTheme: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="blue">Blue Info Style</option>
                    <option value="amber">Amber Warning Style</option>
                    <option value="emerald">Emerald Success Style</option>
                    <option value="purple">Purple Tip Style</option>
                    <option value="red">Red Danger Style</option>
                    <option value="custom">Custom Color Scheme</option>
                  </select>
                </div>

                {blockOptions.calloutTheme === 'custom' && (
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Theme Color (Hex)</label>
                    <input
                      type="text"
                      placeholder="#08A88A"
                      value={blockOptions.customCalloutColor || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, customCalloutColor: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand/40"
                    />
                  </div>
                )}
              </div>
            )}

            {isParagraphWithImage && (
              <div className="space-y-3 border border-slate-100 p-2.5 rounded-xl bg-slate-50/50 mb-3 text-left">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Paragraph with Image Settings</span>
                
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Paragraph 1 Text</label>
                  <textarea
                    rows={3}
                    value={blockOptions.col1Text || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, col1Text: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none resize-y"
                    placeholder="Write introductory text..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Image Source</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={blockOptions.mediaUrl || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, mediaUrl: e.target.value })}
                      placeholder="Paste image URL here..."
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                    <label className="cursor-pointer px-2 py-1 bg-white border border-slate-200 hover:border-slate-350 text-slate-650 hover:text-slate-905 text-[10px] font-bold rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const fd = new FormData();
                            fd.append("file", file);
                            const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                            const data = await res.json();
                            if (res.ok && data.url) {
                              setBlockOptions(prev => ({ ...prev, mediaUrl: data.url }));
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="hidden"
                      />
                      <span>Upload</span>
                    </label>
                  </div>
                  
                  {/* Image Preview Panel */}
                  {blockOptions.mediaUrl && (
                    <div className="relative mt-2 h-28 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1 flex items-center justify-center group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blockOptions.mediaUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain animate-fade-in"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setBlockOptions(prev => ({ ...prev, mediaUrl: '' }))}
                        className="absolute top-1.5 right-1.5 p-1 bg-slate-800/80 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Image Alt Text / Caption</label>
                  <input
                    type="text"
                    value={blockOptions.headingText || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, headingText: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                    placeholder="Describe the image..."
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Paragraph 2 Text</label>
                  <textarea
                    rows={3}
                    value={blockOptions.col2Text || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, col2Text: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none resize-y"
                    placeholder="Write explanation text..."
                  />
                </div>
              </div>
            )}
            
            {hasHeading && (
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Heading Text</label>
                <input
                  type="text"
                  value={blockOptions.headingText || ''}
                  onChange={(e) => setBlockOptions({ ...blockOptions, headingText: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand/40"
                />
              </div>
            )}

            {hasSubheading && (
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subheading / Description</label>
                <textarea
                  rows={3}
                  value={blockOptions.subheadingText || ''}
                  onChange={(e) => setBlockOptions({ ...blockOptions, subheadingText: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand/40 resize-y"
                />
              </div>
            )}

            {hasButtons && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Button Text</label>
                  <input
                    type="text"
                    value={blockOptions.buttonText || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, buttonText: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Button URL</label>
                  <input
                    type="text"
                    value={blockOptions.buttonUrl || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, buttonUrl: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
            )}

            {hasFaq && (
              <>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Accordion Question</label>
                  <input
                    type="text"
                    value={blockOptions.faqQuestion || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, faqQuestion: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand/40"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Accordion Answer</label>
                  <textarea
                    rows={3}
                    value={blockOptions.faqAnswer || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, faqAnswer: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none resize-y"
                  />
                </div>
              </>
            )}

            {hasMedia && (
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Media / File URL</label>
                <input
                  type="text"
                  value={blockOptions.mediaUrl || ''}
                  onChange={(e) => setBlockOptions({ ...blockOptions, mediaUrl: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                />
              </div>
            )}

            {hasColumns2 && (
              <div className="space-y-2 border border-slate-100 p-2.5 rounded-xl bg-slate-50/50">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Column Elements</span>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Col 1 Heading</label>
                  <input
                    type="text"
                    value={blockOptions.col1Heading || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, col1Heading: e.target.value })}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Col 1 Content</label>
                  <textarea
                    rows={2}
                    value={blockOptions.col1Text || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, col1Text: e.target.value })}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-y"
                  />
                </div>
                <div className="border-t border-slate-200 my-1"></div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Col 2 Heading</label>
                  <input
                    type="text"
                    value={blockOptions.col2Heading || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, col2Heading: e.target.value })}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Col 2 Content</label>
                  <textarea
                    rows={2}
                    value={blockOptions.col2Text || ''}
                    onChange={(e) => setBlockOptions({ ...blockOptions, col2Text: e.target.value })}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-y"
                  />
                </div>
              </div>
            )}

            {hasColumns3 && (
              <div className="space-y-2 border border-slate-100 p-2.5 rounded-xl bg-slate-50/50">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  {selectedBlock.id === 'media_gallery' ? 'Gallery Image URLs' : 'Section Items'}
                </span>
                
                {selectedBlock.id === 'timeline_vertical' && (
                  <div className="grid grid-cols-3 gap-1">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase">Phase 1</label>
                      <input
                        type="text"
                        value={blockOptions.col1Heading || ''}
                        onChange={(e) => setBlockOptions({ ...blockOptions, col1Heading: e.target.value })}
                        className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase">Phase 2</label>
                      <input
                        type="text"
                        value={blockOptions.col2Heading || ''}
                        onChange={(e) => setBlockOptions({ ...blockOptions, col2Heading: e.target.value })}
                        className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-500 uppercase">Phase 3</label>
                      <input
                        type="text"
                        value={blockOptions.col3Heading || ''}
                        onChange={(e) => setBlockOptions({ ...blockOptions, col3Heading: e.target.value })}
                        className="w-full px-1.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                    {selectedBlock.id === 'media_gallery' ? 'Image 1 URL' : 'Item 1 Heading'}
                  </label>
                  <input
                    type="text"
                    value={selectedBlock.id === 'media_gallery' ? (blockOptions.col1Text || '') : (selectedBlock.id === 'timeline_vertical' ? (blockOptions.headingText || '') : (blockOptions.col1Heading || ''))}
                    onChange={(e) => {
                      if (selectedBlock.id === 'media_gallery') setBlockOptions({ ...blockOptions, col1Text: e.target.value });
                      else if (selectedBlock.id === 'timeline_vertical') setBlockOptions({ ...blockOptions, headingText: e.target.value });
                      else setBlockOptions({ ...blockOptions, col1Heading: e.target.value });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                {selectedBlock.id !== 'media_gallery' && (
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Item 1 Content</label>
                    <textarea
                      rows={2}
                      value={blockOptions.col1Text || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col1Text: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-y"
                    />
                  </div>
                )}
                <div className="border-t border-slate-200 my-1"></div>
                
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                    {selectedBlock.id === 'media_gallery' ? 'Image 2 URL' : 'Item 2 Heading'}
                  </label>
                  <input
                    type="text"
                    value={selectedBlock.id === 'media_gallery' ? (blockOptions.col2Text || '') : (selectedBlock.id === 'timeline_vertical' ? (blockOptions.subheadingText || '') : (blockOptions.col2Heading || ''))}
                    onChange={(e) => {
                      if (selectedBlock.id === 'media_gallery') setBlockOptions({ ...blockOptions, col2Text: e.target.value });
                      else if (selectedBlock.id === 'timeline_vertical') setBlockOptions({ ...blockOptions, subheadingText: e.target.value });
                      else setBlockOptions({ ...blockOptions, col2Heading: e.target.value });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                {selectedBlock.id !== 'media_gallery' && (
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Item 2 Content</label>
                    <textarea
                      rows={2}
                      value={blockOptions.col2Text || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col2Text: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-y"
                    />
                  </div>
                )}
                <div className="border-t border-slate-200 my-1"></div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">
                    {selectedBlock.id === 'media_gallery' ? 'Image 3 URL' : 'Item 3 Heading'}
                  </label>
                  <input
                    type="text"
                    value={selectedBlock.id === 'media_gallery' ? (blockOptions.col3Text || '') : (selectedBlock.id === 'timeline_vertical' ? (blockOptions.buttonText || '') : (blockOptions.col3Heading || ''))}
                    onChange={(e) => {
                      if (selectedBlock.id === 'media_gallery') setBlockOptions({ ...blockOptions, col3Text: e.target.value });
                      else if (selectedBlock.id === 'timeline_vertical') setBlockOptions({ ...blockOptions, buttonText: e.target.value });
                      else setBlockOptions({ ...blockOptions, col3Heading: e.target.value });
                    }}
                    className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                {selectedBlock.id !== 'media_gallery' && (
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-0.5">Item 3 Content</label>
                    <textarea
                      rows={2}
                      value={blockOptions.col3Text || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col3Text: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs resize-y"
                    />
                  </div>
                )}
              </div>
            )}

            {hasStats && (
              <div className="space-y-2 border border-slate-100 p-2.5 rounded-xl bg-slate-50/50">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Metrics Grid</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase">Stat 1 Value</label>
                    <input
                      type="text"
                      value={blockOptions.col1Heading || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col1Heading: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase">Stat 1 Label</label>
                    <input
                      type="text"
                      value={blockOptions.col1Text || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col1Text: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase">Stat 2 Value</label>
                    <input
                      type="text"
                      value={blockOptions.col2Heading || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col2Heading: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase">Stat 2 Label</label>
                    <input
                      type="text"
                      value={blockOptions.col2Text || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col2Text: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase">Stat 3 Value</label>
                    <input
                      type="text"
                      value={blockOptions.col3Heading || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col3Heading: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase">Stat 3 Label</label>
                    <input
                      type="text"
                      value={blockOptions.col3Text || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, col3Text: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase">Stat 4 Value</label>
                    <input
                      type="text"
                      value={blockOptions.headingText || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, headingText: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-500 uppercase">Stat 4 Label</label>
                    <input
                      type="text"
                      value={blockOptions.subheadingText || ''}
                      onChange={(e) => setBlockOptions({ ...blockOptions, subheadingText: e.target.value })}
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: General Block Styling */}
          <div className="space-y-2">
            <h6 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">2. Block Level Styling</h6>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Background Style</label>
                <select
                  value={blockOptions.bgType}
                  onChange={(e) => setBlockOptions({ ...blockOptions, bgType: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="default">Default Template Style</option>
                  <option value="transparent">Glass / Transparent</option>
                  <option value="slate">Sleek Slate</option>
                  <option value="blue">Electric Blue Shade</option>
                  <option value="emerald">Cyber Emerald Shade</option>
                  <option value="amber">Amber Glow Shade</option>
                  <option value="rose">Crimson Rose Shade</option>
                  <option value="brand">Brand Cyan Shade</option>
                  <option value="custom">Custom Color (HEX)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Text Alignment</label>
                <select
                  value={blockOptions.alignment}
                  onChange={(e) => setBlockOptions({ ...blockOptions, alignment: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  <option value="left">Left Align</option>
                  <option value="center">Center Align</option>
                  <option value="right">Right Align</option>
                  <option value="justify">Justify Text</option>
                </select>
              </div>
            </div>

            {blockOptions.bgType === 'custom' && (
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Background Hex Color</label>
                <input
                  type="text"
                  placeholder="#0F172A"
                  value={blockOptions.customBgColor || ''}
                  onChange={(e) => setBlockOptions({ ...blockOptions, customBgColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Body Font Family</label>
                <select
                  value={blockOptions.bodyFont || 'default'}
                  onChange={(e) => setBlockOptions({ ...blockOptions, bodyFont: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="default">Default Sans-serif</option>
                  <option value="times-new-roman">Times New Roman</option>
                  <option value="arial">Arial</option>
                  <option value="georgia">Georgia</option>
                  <option value="courier-new">Courier New</option>
                  <option value="garamond">Garamond</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Body Size (px)</label>
                <input
                  type="number"
                  min={8}
                  max={72}
                  value={blockOptions.bodyFontSizeNum || 15}
                  onChange={(e) => setBlockOptions({ ...blockOptions, bodyFontSizeNum: parseInt(e.target.value) || 15 })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Outer Border</label>
                <select
                  value={blockOptions.borderStyle}
                  onChange={(e) => setBlockOptions({ ...blockOptions, borderStyle: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="default">Default Border</option>
                  <option value="left-accent">Left Accent Bar</option>
                  <option value="full">Full Thin Border</option>
                  <option value="dashed">Dashed Border</option>
                  <option value="none">No Border</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Inner Typography Styling */}
          <div className="space-y-2">
            <h6 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">3. Heading Styles (Block/Accent)</h6>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Heading Style</label>
                <select
                  value={blockOptions.headingStyle}
                  onChange={(e) => setBlockOptions({ ...blockOptions, headingStyle: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="standard">Standard Inline</option>
                  <option value="block-shaded">Block Shaded (Filled box + accent bar)</option>
                  <option value="underlined">Underlined (Bottom accent line)</option>
                  <option value="bordered">Bordered (Outline box)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Heading Font</label>
                <select
                  value={blockOptions.headingFont || 'default'}
                  onChange={(e) => setBlockOptions({ ...blockOptions, headingFont: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="default">Default Sans-serif</option>
                  <option value="times-new-roman">Times New Roman</option>
                  <option value="arial">Arial</option>
                  <option value="georgia">Georgia</option>
                  <option value="courier-new">Courier New</option>
                  <option value="garamond">Garamond</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Heading Size (px)</label>
                <input
                  type="number"
                  min={8}
                  max={120}
                  value={blockOptions.headingFontSizeNum || 22}
                  onChange={(e) => setBlockOptions({ ...blockOptions, headingFontSizeNum: parseInt(e.target.value) || 22 })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Heading Text Color</label>
                <select
                  value={blockOptions.headingColor}
                  onChange={(e) => setBlockOptions({ ...blockOptions, headingColor: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="white">Contrast White / Ink</option>
                  <option value="brand">Brand Cyan Accent</option>
                  <option value="blue">Corporate Blue</option>
                  <option value="emerald">Emerald Success</option>
                  <option value="amber">Amber Alert/Tip</option>
                  <option value="rose">Crimson Danger</option>
                  <option value="custom">Custom Color (HEX)</option>
                </select>
              </div>
            </div>

            {blockOptions.headingColor === 'custom' && (
              <div className="w-full">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Heading Hex</label>
                <input
                  type="text"
                  placeholder="#10B981"
                  value={blockOptions.customHeadingColor || ''}
                  onChange={(e) => setBlockOptions({ ...blockOptions, customHeadingColor: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand/40"
                />
              </div>
            )}
          </div>
        </div>

        {/* Insert Customized Trigger */}
        <div className="pt-2 border-t border-slate-100 flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedBlock(null)}
            className="px-3 py-1.5 bg-slate-105 hover:bg-slate-200 text-slate-650 text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              👁️ Preview
            </button>
            <button
              type="button"
              onClick={() => {
                insertCustomBlock();
                setSelectedBlock(null);
              }}
              className="px-4 py-1.5 bg-brand text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#16E6D8] transition-colors cursor-pointer"
            >
              Insert Block
            </button>
          </div>
        </div>
      </div>
    );
  };

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
                  {selectedBlock ? (
                    renderBlockCustomizer()
                  ) : (
                    <>
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

                      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                        {filteredBlocks.map(block => (
                          <button
                            key={block.id}
                            type="button"
                            onClick={() => {
                              setSelectedBlock(block);
                              setBlockOptions(defaultBlockOptions(block.id));
                            }}
                            className="w-full text-left p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col transition-all group cursor-pointer"
                          >
                            <span className="text-xs font-bold text-slate-800 group-hover:text-brand transition-colors">{block.name}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{block.description}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
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
    {showPreviewModal && selectedBlock && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left">
        <div className="bg-[#0B0F19] border border-white/10 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0e1423]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>👁️ Web Rendering Preview</span>
                <span className="text-[10px] text-slate-400 font-normal">({selectedBlock.name})</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">This showcases exactly how your customized block will look inside a blog post on the website.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="p-1.5 text-slate-450 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body: Styled Iframe */}
          <div className="flex-1 bg-[#05070c] p-6 overflow-hidden">
            <iframe
              title="Block Live Preview"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <!-- Tailwind CSS v2 CDN -->
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
                    <!-- Google Fonts -->
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
                    
                    <style>
                      body {
                        background-color: #0B0F19 !important;
                        color: #cbd5e1 !important;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        padding: 2rem;
                        margin: 0;
                      }
                      /* Theme specifics to emulate website container */
                      .bg-card {
                        background-color: #131B2E !important;
                      }
                      .bg-base {
                        background-color: #0B0F19 !important;
                      }
                      .text-brand {
                        color: #08A88A !important;
                      }
                      .bg-brand {
                        background-color: #08A88A !important;
                      }
                      .signature-gradient {
                        background: linear-gradient(120deg, #10B981 0%, #0D9488 35%, #34D399 60%, #10B981 100%) !important;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="max-w-2xl mx-auto">
                      <div class="text-[10px] text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">--- Post Content Body ---</div>
                      
                      ${generateCustomBlock(selectedBlock.id, blockOptions)}
                      
                      <div class="text-[10px] text-slate-500 uppercase tracking-widest mt-6 border-t border-white/5 pt-2">-------------------------</div>
                    </div>
                  </body>
                </html>
              `}
              className="w-full h-full border-none rounded-xl bg-[#0B0F19] shadow-inner"
            />
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-white/5 bg-[#0e1423] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="px-4 py-2 border border-white/10 text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-all text-xs font-bold cursor-pointer"
            >
              Close Preview
            </button>
            <button
              type="button"
              onClick={() => {
                insertCustomBlock();
                setShowPreviewModal(false);
                setSelectedBlock(null);
              }}
              className="px-5 py-2 bg-brand text-black hover:bg-[#16E6D8] rounded-xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
            >
              Insert Block
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}
