"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { QuestionBuilder } from "@/components/admin/QuestionBuilder";
import { ColorPicker } from "@/components/admin/ColorPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Layers,
  FileCode,
  Sparkles,
  BookOpen,
  Clock,
  HelpCircle,
  Code2,
  ListOrdered,
  GripVertical,
  Eye,
  EyeOff,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LessonIframe } from "@/components/shared/LessonIframe";
import { ImageField } from "@/components/admin/ImageField";
import dynamic from "next/dynamic";
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";
import {
  BLOCK_REGISTRY,
  BLOCK_CATEGORIES,
  createBlock,
  generateHtmlFromBlocks,
  convertToEmbedUrl,
  type BlockData,
  type BlockType,
} from "./blockRegistry";

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  kind: "theory" | "activity" | "assessment";
  content_html: string;
  max_score: number | null;
  display_order: number;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  display_order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  slug: string;
  title: string;
  segment: "corporate" | "college";
  summary: string;
  introduction: string;
  thumbnail_url: string;
  price_inr: number;
  is_paid: boolean;
  display_order: number;
  hide_pricing?: boolean;
}

type LessonValues = {
  id?: string;
  module_id?: string;
  title: string;
  kind: "theory" | "activity" | "assessment";
  content_html: string;
  max_score: number | null;
  assessment_settings?: {
    duration_mins: number;
    pass_mark: number;
    attempts_allowed: number;
    negative_marking: number;
    randomize: boolean;
    publish_results: boolean;
    is_inline?: boolean;
  };
};

/**
 * Self-contained lesson editor. Holds its OWN local state so typing in the
 * HTML field does NOT re-render the (very large) course builder on every
 * keystroke. Commits to the parent only when "Save Lesson" is clicked.
 */
// All supported question types (Google-Forms-style picker in the test builder)
const QUESTION_TYPES: { value: string; label: string; hint: string }[] = [
  { value: "single", label: "Single Choice", hint: "One correct (radio)" },
  { value: "multiple", label: "Multiple Choice", hint: "Many correct (checkboxes)" },
  { value: "truefalse", label: "True / False", hint: "Boolean" },
  { value: "fillblank", label: "Fill in the Blank", hint: "Text / dropdown" },
  { value: "dragdrop", label: "Drag & Drop", hint: "Matching pairs" },
  { value: "sequence", label: "Sequence", hint: "Reorder steps" },
  { value: "matrix", label: "Matrix / Grid", hint: "Rows × columns" },
  { value: "code", label: "Code", hint: "Sandbox execution" },
];

const LessonEditor = React.memo(function LessonEditor({
  initial,
  onSave,
  onCancel,
  fetchMockTests,
}: {
  initial: LessonValues;
  onSave: (values: LessonValues) => void;
  onCancel: () => void;
  fetchMockTests?: (courseId: string) => void;
}) {
  const routeParams = useParams<{ id: string }>();
  const courseId = routeParams?.id as string;

  const [title, setTitle] = React.useState(initial.title || "");
  const [kind, setKind] = React.useState<"theory" | "activity" | "assessment">(initial.kind || "theory");
  const [contentHtml, setContentHtml] = React.useState(initial.content_html || "");
  const [maxScore, setMaxScore] = React.useState<number>(initial.max_score ?? 100);
  const [importing, setImporting] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [importStatus, setImportStatus] = React.useState<string | null>(null);
  const [editorTab, setEditorTab] = React.useState<"code" | "preview">("code");
  const [guidelinesOpen, setGuidelinesOpen] = React.useState(true);
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);
  const fileId = React.useId();
  const standaloneImageId = React.useId();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [editorKind, setEditorKind] = React.useState<string>("document");

  const [documentBlocks, setDocumentBlocks] = React.useState<BlockData[]>([]);
  const [expandedBlockId, setExpandedBlockId] = React.useState<string | null>(null);
  const [showBlockPicker, setShowBlockPicker] = React.useState(false);

  const [durationMins, setDurationMins] = React.useState<number>(30);
  const [passMark, setPassMark] = React.useState<number>(0);
  const [attemptsAllowed, setAttemptsAllowed] = React.useState<number>(0);
  const [negativeMarking, setNegativeMarking] = React.useState<number>(0);
  const [randomize, setRandomize] = React.useState<boolean>(false);
  const [publishResults, setPublishResults] = React.useState<boolean>(true);
  const [linkedTest, setLinkedTest] = React.useState<any>(null);
  const [loadingTest, setLoadingTest] = React.useState(false);

  const [uploadedImages, setUploadedImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (initial.id && initial.kind === "assessment") {
      const loadTestDetails = async () => {
        setLoadingTest(true);
        try {
          const { data, error } = await supabase
            .from("mock_tests")
            .select("*")
            .eq("lesson_id", initial.id)
            .maybeSingle();
          if (error) throw error;
          if (data) {
            setLinkedTest(data);
            setDurationMins(data.duration_mins ?? 30);
            setPassMark(data.pass_mark ?? 0);
            setAttemptsAllowed(data.attempts_allowed ?? 0);
            setNegativeMarking(data.negative_marking ?? 0);
            setRandomize(data.randomize ?? false);
            setPublishResults(data.publish_results ?? true);
            if (data.is_inline) {
              setEditorKind("inline_assessment");
            } else {
              setEditorKind("assessment");
            }
          }
        } catch (err) {
          console.error("Error loading linked test:", err);
        } finally {
          setLoadingTest(false);
        }
      };
      loadTestDetails();
    }
  }, [initial.id, initial.kind]);

  React.useEffect(() => {
    let parseKind: string = "document";
    let parsedMeta: any = null;

    if (initial.content_html && initial.content_html.startsWith("<!-- KVJ_MATERIAL_METADATA:")) {
      try {
        const match = initial.content_html.match(/^<!-- KVJ_MATERIAL_METADATA: (\{.*?\}) -->/);
        if (match) {
          parsedMeta = JSON.parse(match[1]);
          parseKind = parsedMeta.type;
        }
      } catch (err) {
        console.error("Failed to parse material metadata:", err);
      }
    } else if (initial.content_html && initial.content_html.trim() !== "") {
      parseKind = "theory";
    } else if (initial.kind) {
      if (initial.kind === "assessment") {
        parseKind = "assessment";
      } else {
        parseKind = initial.kind === "theory" ? "document" : initial.kind;
      }
    }

    if (parsedMeta) {
      if (parseKind === "document") {
        setDocumentBlocks(parsedMeta.blocks || []);
      } else {
        const migratedBlock: any = { id: Math.random().toString(36).substring(2, 9), type: parseKind };
        if (parseKind === "heading" || parseKind === "subheading" || parseKind === "paragraph") {
          migratedBlock.text = parsedMeta.text || "";
        } else if (parseKind === "image") {
          migratedBlock.url = parsedMeta.url || "";
          migratedBlock.caption = parsedMeta.caption || "";
        } else if (parseKind === "infographics") {
          migratedBlock.cards = parsedMeta.cards || [];
        } else if (parseKind === "callout" || parseKind === "list") {
          migratedBlock.title = parsedMeta.title || "";
          migratedBlock.points = parsedMeta.points || [""];
        } else if (parseKind === "smartarts") {
          migratedBlock.layout = parsedMeta.layout || "pillars";
          migratedBlock.pillars = parsedMeta.pillars || [];
          migratedBlock.steps = parsedMeta.steps || [];
          migratedBlock.comparison = parsedMeta.comparison || [];
        }
        setDocumentBlocks([migratedBlock]);
        parseKind = "document";
      }
    } else if (!parsedMeta && parseKind === "document") {
      setDocumentBlocks([
        { id: "1", type: "heading", text: "" },
        { id: "2", type: "subheading", text: "" },
        { id: "3", type: "paragraph", text: "" },
      ]);
    }

    // If it is assessment kind, let the test loader useEffect handle editorKind asynchronously
    if (initial.kind !== "assessment") {
      setEditorKind(parseKind);
    }
  }, [initial]);

  const addDocumentBlock = (type: BlockType) => {
    const nb = createBlock(type);
    setDocumentBlocks(prev => [...prev, nb]);
    setExpandedBlockId(nb.id);
    setShowBlockPicker(false);
  };

  const updateDocumentBlock = (id: string, fields: Partial<BlockData>) => {
    setDocumentBlocks(prev => prev.map(b => (b.id === id ? { ...b, ...fields } : b)));
  };

  const deleteDocumentBlock = (id: string) => {
    setDocumentBlocks(prev => prev.filter(b => b.id !== id));
    if (expandedBlockId === id) setExpandedBlockId(null);
  };

  const moveDocumentBlock = (index: number, direction: "up" | "down") => {
    setDocumentBlocks(prev => {
      const copy = [...prev];
      const ti = direction === "up" ? index - 1 : index + 1;
      if (ti < 0 || ti >= copy.length) return prev;
      [copy[index], copy[ti]] = [copy[ti], copy[index]];
      return copy;
    });
  };

  const previewHtml = React.useMemo(() => {
    if (editorKind === "document") return generateHtmlFromBlocks(documentBlocks);
    return contentHtml;
  }, [editorKind, documentBlocks, contentHtml]);

  const insertSnippet = React.useCallback((snippet: string) => {
    const el = textareaRef.current;
    if (el) {
      const s = el.selectionStart, e = el.selectionEnd;
      const t = el.value;
      const nv = t.substring(0, s) + snippet + t.substring(e);
      setContentHtml(nv);
      setTimeout(() => { el.focus(); el.selectionStart = el.selectionEnd = s + snippet.length; }, 0);
    } else {
      setContentHtml(prev => prev + snippet);
    }
  }, []);

  const lessonImages = React.useMemo(() => {
    const urls: string[] = [];
    const re = /<img[^>]+src=["']([^"']+)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(contentHtml || "")) !== null) {
      if (!urls.includes(m[1])) urls.push(m[1]);
    }
    return urls;
  }, [contentHtml]);

  const handleStandaloneImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const newUrls: string[] = [];
      let imageTags = "";
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        newUrls.push(data.url);
        imageTags += `\n<img src="${data.url}" alt="${file.name.replace(/\.[^/.]+$/, "")}" class="my-4 rounded-xl max-w-full border border-white/10 shadow-lg" />\n`;
      }
      setUploadedImages(prev => [...prev, ...newUrls]);
      insertSnippet(imageTags);
      setImportStatus(`✓ ${newUrls.length} image(s) uploaded and inserted into HTML!`);
    } catch (err: any) {
      alert("Image upload failed: " + (err.message || String(err)));
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const insertImageTag = (url: string) => {
    const tag = `\n<img src="${url}" alt="Lesson image" class="my-4 rounded-xl max-w-full border border-white/10 shadow-lg" />\n`;
    insertSnippet(tag);
    setImportStatus("✓ Image tag inserted into HTML!");
  };

  const importHtml = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const htmlFile = Array.from(files).find(f => f.name.toLowerCase().endsWith(".html") || f.name.toLowerCase().endsWith(".htm"));
    if (!htmlFile) { alert("No .html or .htm file found in selection."); return; }
    setImporting(true); setImportStatus(null);
    let uploaded = 0, missing = 0;
    try {
      const text = await htmlFile.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const images = Array.from(doc.querySelectorAll("img[src]"));
      const fileMap = new Map<string, File>();
      const fileEntries: [string, File][] = [];
      Array.from(files).forEach(f => {
        if (f !== htmlFile) {
          const basename = f.name.split(/[\\\/]/).pop()!;
          fileMap.set(basename, f); fileMap.set(f.name, f);
          fileEntries.push([f.name.toLowerCase(), f], [basename.toLowerCase(), f]);
        }
      });
      for (const img of images) {
        const src = img.getAttribute("src") || "";
        if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) continue;
        const srcBasename = src.split(/[\\\/]/).pop()!;
        const decodedBasename = decodeURIComponent(srcBasename);
        let matchedFile = fileMap.get(src) || fileMap.get(srcBasename) || fileMap.get(decodeURIComponent(src)) || fileMap.get(decodedBasename);
        if (!matchedFile) {
          const entry = fileEntries.find(([name]) => name === decodedBasename.toLowerCase() || name === srcBasename.toLowerCase());
          if (entry) matchedFile = entry[1];
        }
        if (!matchedFile) { missing++; continue; }
        try {
          const fd = new FormData(); fd.append("file", matchedFile);
          const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          img.setAttribute("src", data.url); uploaded++;
          setUploadedImages(prev => [...prev, data.url]);
        } catch { missing++; }
      }
      setContentHtml(doc.body.innerHTML);
      setImportStatus(images.length === 0 ? `✓ Imported successfully (no images found).` : `✓ Imported — ${uploaded} image${uploaded !== 1 ? "s" : ""} uploaded & re-linked${missing > 0 ? `, ${missing} not found.` : "."}`);
    } catch (err: any) {
      alert("Import failed: " + (err.message || String(err)));
    } finally {
      setImporting(false); e.target.value = "";
    }
  };

  const getBlockMeta = (type: string) => BLOCK_REGISTRY.find(b => b.type === type) || { label: type, icon: "·", description: "" };

  const blockBorderColors: Record<string, string> = {
    heading: "border-l-brand", subheading: "border-l-cyan-400", paragraph: "border-l-slate-500",
    image: "border-l-violet-400", video: "border-l-purple-400", divider: "border-l-slate-600",
    callout: "border-l-amber-400", list: "border-l-emerald-400",
    infographics: "border-l-blue-400", smartarts: "border-l-pink-400",
    table: "border-l-teal-400", html: "border-l-orange-400",
    borderedtext: "border-l-white",
    activity: "border-l-brand", assessment: "border-l-green-400",
  };

  const handleSave = () => {
    if (!title.trim()) { alert("Lesson title is required."); return; }
    let finalKind = kind;
    let finalContentHtml = contentHtml;

    if (editorKind === "document") {
      finalKind = "theory";
      finalContentHtml = generateHtmlFromBlocks(documentBlocks);
    } else if (editorKind === "inline_assessment") {
      finalKind = "assessment";
    }

    onSave({
      id: initial.id,
      module_id: initial.module_id,
      title: title.trim(),
      kind: finalKind,
      content_html: (finalKind === "assessment" || editorKind === "inline_assessment") ? "" : finalContentHtml,
      max_score: finalKind === "activity" ? maxScore : null,
      assessment_settings: (finalKind === "assessment" || editorKind === "inline_assessment") ? {
        duration_mins: durationMins, pass_mark: passMark,
        attempts_allowed: attemptsAllowed, negative_marking: negativeMarking,
        randomize, publish_results: publishResults,
        is_inline: editorKind === "inline_assessment",
      } : undefined,
    });
  };

  return (
    <div className="space-y-5 pt-1">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-brand inline-block"></span>
          {initial.id ? "Edit Lesson" : "New Lesson"}
        </h4>
        <button type="button" onClick={onCancel} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <X className="w-4 h-4 text-slate hover:text-ink" />
        </button>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Lesson Title *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Introduction to Data Analytics"
          className="w-full px-3 py-2.5 rounded-lg border border-line bg-white dark:bg-slate-900 text-ink text-sm focus:ring-1 focus:ring-brand focus:border-brand outline-none transition"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-2">Content Type</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "document", label: "📄 Block Editor", hint: "Visual no-code builder" },
            { value: "theory",   label: "⌨️ Raw HTML",     hint: "Paste / import HTML" },
            { value: "activity", label: "⚡ Activity",     hint: "Interactive iframe" },
            { value: "assessment", label: "📝 Timed Exam", hint: "MCQ exam" },
            { value: "inline_assessment", label: "📝 Inline Assessment", hint: "Practice test" },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setEditorKind(opt.value);
                if (opt.value === "assessment" || opt.value === "inline_assessment") { setKind("assessment"); }
                else if (opt.value === "activity") { setKind("activity"); }
                else { setKind("theory"); }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                editorKind === opt.value
                  ? "bg-brand text-black border-brand shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate border-line hover:border-brand/50 hover:text-ink"
              }`}
            >
              {opt.label}
              <span className={`text-[10px] font-medium ${editorKind === opt.value ? "text-black/60" : "text-slate/60"} hidden sm:inline`}>
                {opt.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      {editorKind === "activity" && (
        <>
          <div className="w-48">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Max Score *</label>
            <input
              type="number"
              value={maxScore}
              onChange={e => setMaxScore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-line bg-white dark:bg-slate-900 text-sm"
            />
          </div>

        {kind === "activity" && (
          <div className="md:col-span-2">
            {/* ── Collapsible guidelines panel ── */}
            <div className="border border-amber-200 rounded-xl overflow-hidden">

              {/* Header / toggle row */}
              <button
                type="button"
                onClick={() => setGuidelinesOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 transition-colors text-left"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  📡 How to record the student&apos;s mark (kvjSubmit contract)
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-amber-600 shrink-0 transition-transform ${guidelinesOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </button>

              {/* Collapsible body */}
              {guidelinesOpen && (
                <div className="bg-amber-50 border-t border-amber-200 p-4 space-y-3">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Include this script in your HTML and call{" "}
                    <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">kvjSubmit(earned, total)</code>{" "}
                    exactly once when the student clicks <strong>Submit / Finish</strong>.
                  </p>

                  <pre className="bg-white border border-amber-200 rounded-lg p-3 text-[11px] font-mono text-slate overflow-x-auto whitespace-pre leading-relaxed">{`<script>
  function kvjSubmit(score, maxScore) {
    window.parent.postMessage(
      { type: "KVJ_ACTIVITY_RESULT", score: Number(score), maxScore: Number(maxScore) },
      "*"
    );
  }
</script>`}</pre>

                  <ul className="text-[11px] text-amber-800 space-y-1 pl-4 list-disc">
                    <li>Call <code className="bg-amber-100 px-1 rounded font-mono">kvjSubmit(earned, total)</code> <strong>once</strong>, when the student clicks Submit/Finish.</li>
                    <li><code className="bg-amber-100 px-1 rounded font-mono">earned</code> = points scored; <code className="bg-amber-100 px-1 rounded font-mono">total</code> = max points (must match the Max Score field above).</li>
                    <li>One self-contained HTML file — inline all CSS &amp; JS. No external files. Images as full <code className="bg-amber-100 px-1 rounded font-mono">https://</code> URLs or <code className="bg-amber-100 px-1 rounded font-mono">data:</code> URIs.</li>
                    <li>Do <strong>not</strong> add your own header, sidebar, login, or Exit button — the player provides those.</li>
                    <li>Use a transparent background: <code className="bg-amber-100 px-1 rounded font-mono">{`body { background: transparent; }`}</code></li>
                  </ul>

                  {/* Copy AI prompt button */}
                  <div className="pt-1 border-t border-amber-200">
                    <button
                      type="button"
                      onClick={() => {
                        const prompt = `Create a self-contained interactive HTML activity for a KVJ Analytics course lesson. Requirements:

• Inline ALL CSS and JavaScript — no external files, no CDN links.
• Set body { background: transparent; } so it blends with the dark course player.
• Do NOT include a header, sidebar, navigation bar, login form, or Exit button. The KVJ platform provides those.
• When the student clicks Submit / Finish, call kvjSubmit(earned, total) exactly once:

<script>
  function kvjSubmit(score, maxScore) {
    window.parent.postMessage(
      { type: "KVJ_ACTIVITY_RESULT", score: Number(score), maxScore: Number(maxScore) },
      "*"
    );
  }
</script>

  – earned = integer points the student scored.
  – total  = maximum possible points (must equal the lesson's Max Score: ${maxScore}).

• Images must be full https:// URLs or data: URIs — no relative paths.
• The activity should test: [DESCRIBE THE TOPIC / LEARNING OBJECTIVE HERE].
• Total max score: ${maxScore} points.
• [Add any other specific requirements, question types, difficulty level, etc.]`;
                        navigator.clipboard.writeText(prompt).then(() => {
                          setCopiedPrompt(true);
                          setTimeout(() => setCopiedPrompt(false), 2500);
                        }).catch(() => alert("Copy failed — please copy the prompt manually."));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        copiedPrompt
                          ? "bg-emerald-100 border border-emerald-300 text-emerald-700"
                          : "bg-white border border-amber-300 hover:border-amber-400 text-amber-700 hover:text-amber-900"
                      }`}
                    >
                      {copiedPrompt ? (
                        <>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy AI prompt
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-amber-600 mt-1.5">
                      Paste into ChatGPT / Gemini, fill in the topic, and import the generated HTML above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </>
      )}

      {kind !== "assessment" && (
          <div className="md:col-span-2 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate">Lesson Content</span>
                <div className="flex items-center bg-surface p-0.5 rounded-lg border border-line">
                  <button
                    type="button"
                    onClick={() => setEditorTab("code")}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                      editorTab === "code" ? "bg-white text-ink shadow-sm" : "text-slate hover:text-ink"
                    }`}
                  >
                    {editorKind === "theory" || editorKind === "activity" ? "HTML Source" : "Edit Content"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab("preview")}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md flex items-center gap-1 transition-all ${
                      editorTab === "preview" ? "bg-brand text-black shadow-sm" : "text-slate hover:text-ink"
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    Live Preview
                  </button>
                </div>
              </div>

              {(editorKind === "theory" || editorKind === "activity") && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Standalone Image Upload */}
                  <input
                    type="file"
                    id={standaloneImageId}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleStandaloneImageUpload}
                  />
                  <label
                    htmlFor={standaloneImageId}
                    className="cursor-pointer px-2.5 py-1 bg-white border border-line hover:border-brand/40 text-slate hover:text-brand text-[10px] font-bold rounded-md flex items-center gap-1 shadow-sm shrink-0"
                    title="Upload image files and insert <img> tags into HTML source"
                  >
                    {uploadingImage ? <Loader2 className="w-3 h-3 animate-spin text-brand" /> : <ImageIcon className="w-3 h-3 text-brand" />}
                    <span>+ Upload Image</span>
                  </label>

                  {/* Multi-file HTML + Images import */}
                  <input
                    type="file"
                    id={fileId}
                    accept=".html,.htm,image/*"
                    multiple
                    className="hidden"
                    onChange={importHtml}
                  />
                  <label
                    htmlFor={fileId}
                    className="cursor-pointer px-2.5 py-1 bg-white border border-line hover:border-brand/40 text-brand text-[10px] font-bold rounded-md flex items-center gap-1 shadow-sm shrink-0"
                    title="Import an .html file with its referenced relative image files together"
                  >
                    {importing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    <span>Import HTML + images</span>
                  </label>
                </div>
              )}
            </div>

            {editorTab === "code" ? (
              editorKind === "theory" || editorKind === "activity" ? (
                <div className="space-y-2">
                  {/* Quick Insert Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-line">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate mr-1.5 select-none">Quick Insert:</span>
                    
                    <button
                      type="button"
                      onClick={() => insertSnippet(`<h2 class="text-white text-2xl font-extrabold tracking-tight border-b border-white/10 pb-3 mb-6">Heading Title</h2>`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-line text-slate-800 hover:text-black text-[10px] font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                    >
                      Heading
                    </button>

                    <button
                      type="button"
                      onClick={() => insertSnippet(`<h3 class="text-brand text-lg font-bold tracking-tight mb-3">Subheading Title</h3>`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-line text-slate-800 hover:text-black text-[10px] font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                    >
                      Subheading
                    </button>

                    <button
                      type="button"
                      onClick={() => insertSnippet(`<p class="text-slate-350 text-base leading-relaxed mb-6">Write your paragraph content here.</p>`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-line text-slate-800 hover:text-black text-[10px] font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                    >
                      Paragraph
                    </button>

                    <button
                      type="button"
                      onClick={() => insertSnippet(`<figure class="my-8 text-center bg-card border border-white/5 p-4 rounded-2xl">
  <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" alt="Visual Description" class="rounded-xl border border-white/10 shadow-lg mx-auto" />
  <figcaption class="text-xs text-slate-400 mt-3 font-medium">Figure description caption</figcaption>
</figure>`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-line text-slate-800 hover:text-black text-[10px] font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                    >
                      Image
                    </button>

                    <button
                      type="button"
                      onClick={() => insertSnippet(`<!-- Infographic: Key Insights Grid -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
  <div class="relative bg-card border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-brand/30 transition-all duration-300">
    <div class="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-xl group-hover:bg-brand/15 transition-all duration-300"></div>
    <div class="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 text-brand text-lg font-extrabold shadow-sm">01</div>
    <h4 class="text-white font-bold text-base mb-2 group-hover:text-brand transition-colors">Key Point One</h4>
    <p class="text-slate-400 text-xs leading-relaxed mb-0">Describe the first key insight or value proposition here.</p>
  </div>
  <div class="relative bg-card border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-brand/30 transition-all duration-300">
    <div class="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-xl group-hover:bg-brand/15 transition-all duration-300"></div>
    <div class="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 text-brand text-lg font-extrabold shadow-sm">02</div>
    <h4 class="text-white font-bold text-base mb-2 group-hover:text-brand transition-colors">Key Point Two</h4>
    <p class="text-slate-400 text-xs leading-relaxed mb-0">Describe the second key insight or value proposition here.</p>
  </div>
  <div class="relative bg-card border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-brand/30 transition-all duration-300">
    <div class="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-xl group-hover:bg-brand/15 transition-all duration-300"></div>
    <div class="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 text-brand text-lg font-extrabold shadow-sm">03</div>
    <h4 class="text-white font-bold text-base mb-2 group-hover:text-brand transition-colors">Key Point Three</h4>
    <p class="text-slate-400 text-xs leading-relaxed mb-0">Describe the third key insight or value proposition here.</p>
  </div>
</div>`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-line text-slate-800 hover:text-black text-[10px] font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                    >
                      Infographics
                    </button>

                    <button
                      type="button"
                      onClick={() => insertSnippet(`<div class="my-6 border-l-4 border-brand bg-brand/5 p-6 rounded-r-2xl text-left">
  <h4 class="text-white font-bold text-sm mb-3">Examples of Data:</h4>
  <ul class="space-y-3">
    <li class="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z"/></svg>
      <span>The number 42.</span>
    </li>
    <li class="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z"/></svg>
      <span>A list of dates: 12/05, 14/05, 19/05.</span>
    </li>
  </ul>
</div>`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-line text-slate-800 hover:text-black text-[10px] font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                    >
                      Callout Box
                    </button>

                    <button
                      type="button"
                      onClick={() => insertSnippet(`<ul class="space-y-3 my-6">
  <li class="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
    <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z"/></svg>
    <span>Numbers</span>
  </li>
  <li class="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
    <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z"/></svg>
    <span>Text</span>
  </li>
</ul>`)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-line text-slate-800 hover:text-black text-[10px] font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                    >
                      Diamond List
                    </button>

                    <div className="relative group/smartart">
                      <button
                        type="button"
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-line text-slate-800 hover:text-black text-[10px] font-bold rounded-md shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Smart Arts</span>
                        <span className="text-[8px] opacity-60">▼</span>
                      </button>
                      <div className="absolute left-0 mt-1 hidden group-hover/smartart:block bg-white border border-line rounded-lg shadow-xl py-1 z-50 min-w-[180px]">
                        <button
                          type="button"
                          onClick={() => insertSnippet(`<!-- Smart Art: Pillars Grid -->
<div class="my-8 border border-white/10 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm">
  <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
    <div class="p-6 space-y-3">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-brand animate-pulse"></div>
        <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">Pillar 01</span>
      </div>
      <h4 class="text-white font-bold text-base mt-0">Pillar Title</h4>
      <p class="text-slate-400 text-xs leading-relaxed mb-0">Core concept description goes here.</p>
    </div>
    <div class="p-6 space-y-3">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-brand animate-pulse"></div>
        <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">Pillar 02</span>
      </div>
      <h4 class="text-white font-bold text-base mt-0">Pillar Title</h4>
      <p class="text-slate-400 text-xs leading-relaxed mb-0">Core concept description goes here.</p>
    </div>
    <div class="p-6 space-y-3">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-brand animate-pulse"></div>
        <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">Pillar 03</span>
      </div>
      <h4 class="text-white font-bold text-base mt-0">Pillar Title</h4>
      <p class="text-slate-400 text-xs leading-relaxed mb-0">Core concept description goes here.</p>
    </div>
  </div>
</div>`)}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[10px] text-slate-800 font-bold cursor-pointer"
                        >
                          Pillars Layout
                        </button>
                        <button
                          type="button"
                          onClick={() => insertSnippet(`<!-- Smart Art: Process Flow -->
<div class="space-y-6 my-8 bg-card/30 border border-white/5 p-6 rounded-2xl text-left">
  <div class="flex items-start gap-4">
    <div class="flex flex-col items-center shrink-0">
      <div class="w-8 h-8 rounded-full bg-brand text-black font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)]">01</div>
      <div class="w-0.5 h-16 bg-gradient-to-b from-brand to-transparent"></div>
    </div>
    <div>
      <h4 class="text-white font-bold text-base mb-1">Step One Title</h4>
      <p class="text-slate-400 text-xs leading-relaxed">Establish clear goals and initial inputs.</p>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="flex flex-col items-center shrink-0">
      <div class="w-8 h-8 rounded-full bg-brand text-black font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)]">02</div>
      <div class="w-0.5 h-16 bg-gradient-to-b from-brand to-transparent"></div>
    </div>
    <div>
      <h4 class="text-white font-bold text-base mb-1">Step Two Title</h4>
      <p class="text-slate-400 text-xs leading-relaxed">Process and transform inputs.</p>
    </div>
  </div>
  <div class="flex items-start gap-4">
    <div class="flex flex-col items-center shrink-0">
      <div class="w-8 h-8 rounded-full bg-brand text-black font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)]">03</div>
    </div>
    <div>
      <h4 class="text-white font-bold text-base mb-1">Step Three Title</h4>
      <p class="text-slate-400 text-xs leading-relaxed">Deliver final results and output insights.</p>
    </div>
  </div>
</div>`)}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[10px] text-slate-800 font-bold border-t border-slate-100 cursor-pointer"
                        >
                          Process Timeline
                        </button>
                        <button
                          type="button"
                          onClick={() => insertSnippet(`<!-- Smart Art: Comparison Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 text-left">
  <div class="border border-red-500/20 bg-red-950/5 p-6 rounded-2xl space-y-3">
    <div class="px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider w-fit">Option A</div>
    <h4 class="text-white font-bold text-base mt-0">Title A</h4>
    <ul class="text-xs text-slate-400 space-y-2 pl-4 list-disc">
      <li>Point number one</li>
      <li>Point number two</li>
    </ul>
  </div>
  <div class="border border-brand/20 bg-brand/5 p-6 rounded-2xl space-y-3">
    <div class="px-2 py-1 rounded bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider w-fit">Option B</div>
    <h4 class="text-white font-bold text-base mt-0">Title B</h4>
    <ul class="text-xs text-slate-400 space-y-2 pl-4 list-disc">
      <li>Point number one</li>
      <li>Point number two</li>
    </ul>
  </div>
</div>`)}
                          className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-[10px] text-slate-800 font-bold border-t border-slate-100 cursor-pointer"
                        >
                          Comparison Columns
                        </button>
                      </div>
                    </div>
                  </div>

                  <textarea
                    ref={textareaRef}
                    rows={12}
                    placeholder="<div>Paste or write lesson HTML markup here...</div>"
                    value={contentHtml}
                    onChange={(e) => setContentHtml(e.target.value)}
                    className="w-full px-3 py-2 border border-line bg-white text-slate-800 rounded-lg text-xs font-mono resize-y"
                  />
                </div>
              ) : (
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-line">
                  {editorKind === "document" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-line pb-2 mb-4">
                        <div>
                          <h4 className="text-slate-800 dark:text-slate-200 font-bold text-sm">Document Builder Blocks</h4>
                          <p className="text-xs text-slate-500">Construct your lesson by combining multiple styled blocks sequentially.</p>
                        </div>
                        <span className="text-xs font-mono bg-brand/10 text-brand px-2 py-0.5 rounded-full">{documentBlocks.length} blocks</span>
                      </div>

                      {documentBlocks.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-line rounded-xl bg-white dark:bg-slate-900">
                          <p className="text-sm text-slate-400 italic">No blocks added yet. Click one of the buttons below to add blocks!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {documentBlocks.map((b, idx) => (
                            <div key={b.id} className="p-4 border border-line rounded-xl bg-white dark:bg-slate-950 shadow-sm space-y-4">
                              {/* Block Header */}
                              <div className="flex items-center justify-between border-b border-line pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-400 font-mono">#{idx + 1}</span>
                                  <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                                    {b.type}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => moveDocumentBlock(idx, "up")}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 text-slate-500"
                                    title="Move Up"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === documentBlocks.length - 1}
                                    onClick={() => moveDocumentBlock(idx, "down")}
                                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 text-slate-500"
                                    title="Move Down"
                                  >
                                    ↓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteDocumentBlock(b.id)}
                                    className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 rounded text-slate-400 transition-colors"
                                    title="Delete Block"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>

                              {/* Block Inputs */}
                              {b.type === "heading" && (
                                <div className="space-y-3">
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Heading Text</label>
                                    <input
                                      type="text"
                                      value={b.text || ""}
                                      onChange={(e) => updateDocumentBlock(b.id, { text: e.target.value })}
                                      placeholder="Enter heading text..."
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                    />
                                  </div>
                                  <details className="cursor-pointer">
                                    <summary className="text-[9px] font-bold text-slate uppercase tracking-wider select-none hover:text-brand transition-colors">Block Style</summary>
                                    <div className="pt-2 space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <ColorPicker label="Background" color={b.bgColor || ""} onChange={(col) => updateDocumentBlock(b.id, { bgColor: col })} />
                                        <ColorPicker label="Text Color" color={b.textColor || ""} onChange={(col) => updateDocumentBlock(b.id, { textColor: col })} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Font Size</label>
                                          <select value={b.fontSize || "normal"} onChange={(e) => updateDocumentBlock(b.id, { fontSize: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="sm">Small</option>
                                            <option value="normal">Normal</option>
                                            <option value="lg">Large</option>
                                            <option value="xl">XL</option>
                                            <option value="2xl">2XL</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Alignment</label>
                                          <select value={b.align || "left"} onChange={(e) => updateDocumentBlock(b.id, { align: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </details>
                                </div>
                              )}

                              {b.type === "subheading" && (
                                <div className="space-y-3">
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Subheading Text</label>
                                    <input
                                      type="text"
                                      value={b.text || ""}
                                      onChange={(e) => updateDocumentBlock(b.id, { text: e.target.value })}
                                      placeholder="Enter subheading text..."
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                    />
                                  </div>
                                  <details className="cursor-pointer">
                                    <summary className="text-[9px] font-bold text-slate uppercase tracking-wider select-none hover:text-brand transition-colors">Block Style</summary>
                                    <div className="pt-2 space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <ColorPicker label="Background" color={b.bgColor || ""} onChange={(col) => updateDocumentBlock(b.id, { bgColor: col })} />
                                        <ColorPicker label="Text Color" color={b.textColor || ""} onChange={(col) => updateDocumentBlock(b.id, { textColor: col })} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Font Size</label>
                                          <select value={b.fontSize || "normal"} onChange={(e) => updateDocumentBlock(b.id, { fontSize: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="sm">Small</option>
                                            <option value="normal">Normal</option>
                                            <option value="lg">Large</option>
                                            <option value="xl">XL</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Alignment</label>
                                          <select value={b.align || "left"} onChange={(e) => updateDocumentBlock(b.id, { align: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </details>
                                </div>
                              )}

                              {b.type === "paragraph" && (
                                <div className="space-y-3">
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Paragraph Body Text</label>
                                    <RichTextEditor
                                      value={b.text || ""}
                                      onChange={(val) => updateDocumentBlock(b.id, { text: val })}
                                      placeholder="Enter paragraph description text..."
                                    />
                                  </div>
                                  <details className="cursor-pointer">
                                    <summary className="text-[9px] font-bold text-slate uppercase tracking-wider select-none hover:text-brand transition-colors">Block Style</summary>
                                    <div className="pt-2 space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <ColorPicker label="Background" color={b.bgColor || ""} onChange={(col) => updateDocumentBlock(b.id, { bgColor: col })} />
                                        <ColorPicker label="Text Color" color={b.textColor || ""} onChange={(col) => updateDocumentBlock(b.id, { textColor: col })} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Font Size</label>
                                          <select value={b.fontSize || "normal"} onChange={(e) => updateDocumentBlock(b.id, { fontSize: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="xs">XS</option>
                                            <option value="sm">Small</option>
                                            <option value="normal">Normal</option>
                                            <option value="lg">Large</option>
                                            <option value="xl">XL</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Alignment</label>
                                          <select value={b.align || "left"} onChange={(e) => updateDocumentBlock(b.id, { align: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                            <option value="justify">Justify</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </details>
                                </div>
                              )}

                              {b.type === "image" && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Image URL</label>
                                      <input
                                        type="text"
                                        value={b.url || ""}
                                        onChange={(e) => updateDocumentBlock(b.id, { url: e.target.value })}
                                        placeholder="Paste image URL..."
                                        className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Caption</label>
                                      <input
                                        type="text"
                                        value={b.caption || ""}
                                        onChange={(e) => updateDocumentBlock(b.id, { caption: e.target.value })}
                                        placeholder="Caption text (optional)..."
                                        className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Direct Image Upload Block Integration */}
                                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-line flex items-center justify-between gap-4">
                                    <div className="text-xs text-slate-500">
                                      {b.url ? (
                                        <div className="flex items-center gap-2">
                                          <img src={b.url} className="w-8 h-8 rounded object-cover border border-line" alt="Preview" />
                                          <span className="truncate max-w-[200px] font-mono">{b.url}</span>
                                        </div>
                                      ) : "No file uploaded. Choose a file to upload directly."}
                                    </div>
                                    <label className="shrink-0 bg-brand text-black hover:bg-brand/90 px-3 py-1 rounded text-xs font-bold cursor-pointer transition-colors">
                                      Upload Image
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            try {
                                              const fileExt = file.name.split('.').pop();
                                              const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                                              const filePath = `curriculum-images/${fileName}`;

                                              const { data, error } = await supabase.storage
                                                .from("course-materials")
                                                .upload(filePath, file);

                                              if (error) throw error;
                                              const { data: { publicUrl } } = supabase.storage
                                                .from("course-materials")
                                                .getPublicUrl(filePath);

                                              updateDocumentBlock(b.id, { url: publicUrl });
                                              setUploadedImages((prev) => [...prev, publicUrl]);
                                            } catch (err: any) {
                                              alert("Upload failed: " + err.message);
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              )}

                              {b.type === "list" && (
                                <div className="space-y-3">
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">
                                      List Header Title
                                    </label>
                                    <input
                                      type="text"
                                      value={b.title || ""}
                                      onChange={(e) => updateDocumentBlock(b.id, { title: e.target.value })}
                                      placeholder="Header Title (optional)..."
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Bullet Points</label>
                                    <div className="space-y-2">
                                      {(b.points || []).map((pt: string, ptIdx: number) => (
                                        <div key={ptIdx} className="flex items-center gap-2">
                                          <span className="text-brand shrink-0 text-xs">◆</span>
                                          <input
                                            type="text"
                                            value={pt}
                                            onChange={(e) => {
                                              const pts = [...(b.points || [])];
                                              pts[ptIdx] = e.target.value;
                                              updateDocumentBlock(b.id, { points: pts });
                                            }}
                                            placeholder="Enter point..."
                                            className="w-full px-3 py-1.5 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-xs"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const pts = (b.points || []).filter((_: any, pIdx: number) => pIdx !== ptIdx);
                                              updateDocumentBlock(b.id, { points: pts });
                                            }}
                                            className="text-red-500 hover:text-red-650 font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateDocumentBlock(b.id, { points: [...(b.points || []), ""] });
                                        }}
                                        className="text-xs text-brand hover:underline font-bold"
                                      >
                                        + Add Bullet Point
                                      </button>
                                    </div>
                                  </div>
                                  <details className="cursor-pointer">
                                    <summary className="text-[9px] font-bold text-slate uppercase tracking-wider select-none hover:text-brand transition-colors">Block Style</summary>
                                    <div className="pt-2 space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <ColorPicker label="Background" color={b.bgColor || ""} onChange={(col) => updateDocumentBlock(b.id, { bgColor: col })} />
                                        <ColorPicker label="Text Color" color={b.textColor || ""} onChange={(col) => updateDocumentBlock(b.id, { textColor: col })} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Font Size</label>
                                          <select value={b.fontSize || "normal"} onChange={(e) => updateDocumentBlock(b.id, { fontSize: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="xs">XS</option>
                                            <option value="sm">Small</option>
                                            <option value="normal">Normal</option>
                                            <option value="lg">Large</option>
                                            <option value="xl">XL</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Alignment</label>
                                          <select value={b.align || "left"} onChange={(e) => updateDocumentBlock(b.id, { align: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </details>
                                </div>
                              )}

                              {b.type === "callout" && (
                                <div className="space-y-4 border border-line rounded-xl p-4 bg-slate-50/30 dark:bg-slate-900/30">
                                  {/* Callout Presets */}
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Callout Presets</label>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        { key: "note", label: "Note", color: "bg-slate-500" },
                                        { key: "tip", label: "Tip", color: "bg-brand" },
                                        { key: "warning", label: "Warning", color: "bg-rose-500" },
                                        { key: "important", label: "Important", color: "bg-amber-500" },
                                        { key: "success", label: "Success", color: "bg-green-500" },
                                        { key: "info", label: "Info", color: "bg-cyan-600" },
                                        { key: "danger", label: "Danger", color: "bg-red-600" }
                                      ].map((preset) => (
                                        <button
                                          key={preset.key}
                                          type="button"
                                          onClick={() => {
                                            const presets: Record<string, any> = {
                                              note: { bgColor: "#F4F9FD", borderColor: "#DCE5E8", accentColor: "#526477", textColor: "#132238", leftAccent: true },
                                              tip: { bgColor: "#F0FBF7", borderColor: "#DDF8F0", accentColor: "#08A88A", textColor: "#132238", leftAccent: true },
                                              warning: { bgColor: "#FFF2F4", borderColor: "#FFE0E5", accentColor: "#E11D48", textColor: "#132238", leftAccent: true },
                                              important: { bgColor: "#FFF7E6", borderColor: "#FFE3A8", accentColor: "#D97706", textColor: "#132238", leftAccent: true },
                                              success: { bgColor: "#F0FBF7", borderColor: "#DDF8F0", accentColor: "#08A88A", textColor: "#132238", leftAccent: true },
                                              info: { bgColor: "#EAF6FF", borderColor: "#D2ECFF", accentColor: "#0E7490", textColor: "#132238", leftAccent: true },
                                              danger: { bgColor: "#FFF2F4", borderColor: "#FFE0E5", accentColor: "#E11D48", textColor: "#132238", leftAccent: true },
                                            };
                                            updateDocumentBlock(b.id, presets[preset.key]);
                                          }}
                                          className={`px-2.5 py-1 text-xxs font-bold text-white rounded-md cursor-pointer hover:opacity-90 transition-opacity ${preset.color}`}
                                        >
                                          {preset.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">
                                      Callout Header Title
                                    </label>
                                    <input
                                      type="text"
                                      value={b.title || ""}
                                      onChange={(e) => updateDocumentBlock(b.id, { title: e.target.value })}
                                      placeholder="Header Title (optional)..."
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                    />
                                  </div>

                                  {/* Visual Customization Overrides */}
                                  <details className="cursor-pointer border-t border-line/60 pt-3">
                                    <summary className="text-[10px] font-bold text-slate uppercase tracking-wider select-none hover:text-brand transition-colors">
                                      Visual Style Customizations
                                    </summary>
                                    <div className="pt-3 space-y-3 cursor-default">
                                      {/* Colors */}
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <ColorPicker
                                          label="Background"
                                          color={b.bgColor}
                                          onChange={(color) => updateDocumentBlock(b.id, { bgColor: color })}
                                        />
                                        <ColorPicker
                                          label="Border Color"
                                          color={b.borderColor}
                                          onChange={(color) => updateDocumentBlock(b.id, { borderColor: color })}
                                        />
                                        <ColorPicker
                                          label="Accent Color"
                                          color={b.accentColor}
                                          onChange={(color) => updateDocumentBlock(b.id, { accentColor: color })}
                                        />
                                        <ColorPicker
                                          label="Text Color"
                                          color={b.textColor}
                                          onChange={(color) => updateDocumentBlock(b.id, { textColor: color })}
                                        />
                                      </div>

                                      {/* Border specs */}
                                      <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate uppercase mb-1">Thickness</label>
                                          <select
                                            value={b.borderThickness || "1px"}
                                            onChange={(e) => updateDocumentBlock(b.id, { borderThickness: e.target.value })}
                                            className="w-full px-2 py-1.5 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded-md text-xs"
                                          >
                                            <option value="1px">Thin (1px)</option>
                                            <option value="2px">Medium (2px)</option>
                                            <option value="4px">Thick (4px)</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate uppercase mb-1">Border Radius</label>
                                          <select
                                            value={b.borderRadius || "16px"}
                                            onChange={(e) => updateDocumentBlock(b.id, { borderRadius: e.target.value })}
                                            className="w-full px-2 py-1.5 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded-md text-xs"
                                          >
                                            <option value="4px">Small (4px)</option>
                                            <option value="8px">Medium (8px)</option>
                                            <option value="12px">Large (12px)</option>
                                            <option value="16px">Extra Large (16px)</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate uppercase mb-1">Border Style</label>
                                          <select
                                            value={b.borderStyle || "solid"}
                                            onChange={(e) => updateDocumentBlock(b.id, { borderStyle: e.target.value })}
                                            className="w-full px-2 py-1.5 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded-md text-xs"
                                          >
                                            <option value="solid">Solid</option>
                                            <option value="dashed">Dashed</option>
                                            <option value="dotted">Dotted</option>
                                          </select>
                                        </div>
                                      </div>

                                      {/* Font sizes & alignments */}
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate uppercase mb-1">Font Size</label>
                                          <select
                                            value={b.fontSize || "normal"}
                                            onChange={(e) => updateDocumentBlock(b.id, { fontSize: e.target.value })}
                                            className="w-full px-2 py-1.5 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded-md text-xs"
                                          >
                                            <option value="sm">Small</option>
                                            <option value="normal">Normal</option>
                                            <option value="lg">Large</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[9px] font-bold text-slate uppercase mb-1">Alignment</label>
                                          <select
                                            value={b.align || "left"}
                                            onChange={(e) => updateDocumentBlock(b.id, { align: e.target.value })}
                                            className="w-full px-2 py-1.5 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded-md text-xs"
                                          >
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                          </select>
                                        </div>
                                      </div>

                                      {/* Formatting toggles */}
                                      <div className="flex gap-4 items-center pt-1 text-xs font-semibold">
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={!!b.bold}
                                            onChange={(e) => updateDocumentBlock(b.id, { bold: e.target.checked })}
                                            className="w-4 h-4 text-brand border-line rounded"
                                          />
                                          <span>Bold</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={!!b.italic}
                                            onChange={(e) => updateDocumentBlock(b.id, { italic: e.target.checked })}
                                            className="w-4 h-4 text-brand border-line rounded"
                                          />
                                          <span>Italic</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={!!b.underline}
                                            onChange={(e) => updateDocumentBlock(b.id, { underline: e.target.checked })}
                                            className="w-4 h-4 text-brand border-line rounded"
                                          />
                                          <span>Underline</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={b.leftAccent !== false}
                                            onChange={(e) => updateDocumentBlock(b.id, { leftAccent: e.target.checked })}
                                            className="w-4 h-4 text-brand border-line rounded"
                                          />
                                          <span>Left Accent Border</span>
                                        </label>
                                      </div>
                                    </div>
                                  </details>

                                  {/* Callout Points */}
                                  <div className="space-y-2 pt-2 border-t border-line/60">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Bullet Points</label>
                                    <div className="space-y-2">
                                      {(b.points || []).map((pt: string, ptIdx: number) => (
                                        <div key={ptIdx} className="flex items-center gap-2">
                                          <span className="text-brand shrink-0 text-xs">◆</span>
                                          <input
                                            type="text"
                                            value={pt}
                                            onChange={(e) => {
                                              const pts = [...(b.points || [])];
                                              pts[ptIdx] = e.target.value;
                                              updateDocumentBlock(b.id, { points: pts });
                                            }}
                                            placeholder="Enter point..."
                                            className="w-full px-3 py-1.5 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-xs"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const pts = (b.points || []).filter((_: any, pIdx: number) => pIdx !== ptIdx);
                                              updateDocumentBlock(b.id, { points: pts });
                                            }}
                                            className="text-red-500 hover:text-red-650 font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateDocumentBlock(b.id, { points: [...(b.points || []), ""] });
                                        }}
                                        className="text-xs text-brand hover:underline font-bold"
                                      >
                                        + Add Bullet Point
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {b.type === "infographics" && (
                                <div className="space-y-4">
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Infographic Grid Cards (Max 3)</label>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {(b.cards || []).map((c: any, cIdx: number) => (
                                      <div key={cIdx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-line space-y-3">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[10px] font-bold text-slate-400 uppercase">Card {cIdx + 1}</span>
                                          <input
                                            type="text"
                                            value={c.number || ""}
                                            onChange={(e) => {
                                              const cards = [...(b.cards || [])];
                                              cards[cIdx] = { ...c, number: e.target.value };
                                              updateDocumentBlock(b.id, { cards });
                                            }}
                                            className="w-10 px-1 py-0.5 text-center text-xs border border-line bg-white rounded font-mono text-brand font-bold"
                                            placeholder="01"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <input
                                            type="text"
                                            value={c.title || ""}
                                            onChange={(e) => {
                                              const cards = [...(b.cards || [])];
                                              cards[cIdx] = { ...c, title: e.target.value };
                                              updateDocumentBlock(b.id, { cards });
                                            }}
                                            className="w-full px-2 py-1 text-xs border border-line bg-white rounded font-bold"
                                            placeholder="Card Title"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <textarea
                                            rows={3}
                                            value={c.desc || ""}
                                            onChange={(e) => {
                                              const cards = [...(b.cards || [])];
                                              cards[cIdx] = { ...c, desc: e.target.value };
                                              updateDocumentBlock(b.id, { cards });
                                            }}
                                            className="w-full px-2 py-1 text-xs border border-line bg-white rounded resize-none"
                                            placeholder="Card Description"
                                          />
                                        </div>

                                        {/* Expandable Custom Styling */}
                                        <div className="pt-2 border-t border-line/60 space-y-2">
                                          <details className="cursor-pointer">
                                            <summary className="text-[9px] font-bold text-slate uppercase tracking-wider select-none hover:text-brand transition-colors">
                                              Card Style
                                            </summary>
                                            <div className="pt-2 space-y-2 text-xxs font-medium cursor-default">
                                              <div className="grid grid-cols-2 gap-1.5">
                                                <ColorPicker
                                                  label="Card BG"
                                                  color={c.bgColor}
                                                  onChange={(col) => {
                                                    const cards = [...(b.cards || [])];
                                                    cards[cIdx] = { ...c, bgColor: col };
                                                    updateDocumentBlock(b.id, { cards });
                                                  }}
                                                />
                                                <ColorPicker
                                                  label="Border"
                                                  color={c.borderColor}
                                                  onChange={(col) => {
                                                    const cards = [...(b.cards || [])];
                                                    cards[cIdx] = { ...c, borderColor: col };
                                                    updateDocumentBlock(b.id, { cards });
                                                  }}
                                                />
                                                <ColorPicker
                                                  label="Number"
                                                  color={c.numberColor}
                                                  onChange={(col) => {
                                                    const cards = [...(b.cards || [])];
                                                    cards[cIdx] = { ...c, numberColor: col };
                                                    updateDocumentBlock(b.id, { cards });
                                                  }}
                                                />
                                                <ColorPicker
                                                  label="Title"
                                                  color={c.titleColor}
                                                  onChange={(col) => {
                                                    const cards = [...(b.cards || [])];
                                                    cards[cIdx] = { ...c, titleColor: col };
                                                    updateDocumentBlock(b.id, { cards });
                                                  }}
                                                />
                                                <ColorPicker
                                                  label="Body Text"
                                                  color={c.textColor}
                                                  onChange={(col) => {
                                                    const cards = [...(b.cards || [])];
                                                    cards[cIdx] = { ...c, textColor: col };
                                                    updateDocumentBlock(b.id, { cards });
                                                  }}
                                                />
                                                <ColorPicker
                                                  label="Accent BG"
                                                  color={c.accentColor}
                                                  onChange={(col) => {
                                                    const cards = [...(b.cards || [])];
                                                    cards[cIdx] = { ...c, accentColor: col };
                                                    updateDocumentBlock(b.id, { cards });
                                                  }}
                                                />
                                              </div>

                                              <div className="grid grid-cols-2 gap-1.5 pt-1">
                                                <div>
                                                  <label className="block text-[8px] font-bold text-slate uppercase">Font Size</label>
                                                  <select
                                                    value={c.fontSize || "normal"}
                                                    onChange={(e) => {
                                                      const cards = [...(b.cards || [])];
                                                      cards[cIdx] = { ...c, fontSize: e.target.value };
                                                      updateDocumentBlock(b.id, { cards });
                                                    }}
                                                    className="w-full mt-0.5 px-1 py-0.5 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xxs"
                                                  >
                                                    <option value="sm">Small</option>
                                                    <option value="normal">Normal</option>
                                                    <option value="lg">Large</option>
                                                  </select>
                                                </div>
                                                <div>
                                                  <label className="block text-[8px] font-bold text-slate uppercase">Align</label>
                                                  <select
                                                    value={c.align || "left"}
                                                    onChange={(e) => {
                                                      const cards = [...(b.cards || [])];
                                                      cards[cIdx] = { ...c, align: e.target.value };
                                                      updateDocumentBlock(b.id, { cards });
                                                    }}
                                                    className="w-full mt-0.5 px-1 py-0.5 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xxs"
                                                  >
                                                    <option value="left">Left</option>
                                                    <option value="center">Center</option>
                                                    <option value="right">Right</option>
                                                    <option value="justify">Justify</option>
                                                  </select>
                                                </div>
                                              </div>

                                              <div className="flex gap-2 pt-1 font-semibold">
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={!!c.bold}
                                                    onChange={(e) => {
                                                      const cards = [...(b.cards || [])];
                                                      cards[cIdx] = { ...c, bold: e.target.checked };
                                                      updateDocumentBlock(b.id, { cards });
                                                    }}
                                                    className="w-3 h-3 text-brand border-line rounded"
                                                  />
                                                  <span>B</span>
                                                </label>
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={!!c.italic}
                                                    onChange={(e) => {
                                                      const cards = [...(b.cards || [])];
                                                      cards[cIdx] = { ...c, italic: e.target.checked };
                                                      updateDocumentBlock(b.id, { cards });
                                                    }}
                                                    className="w-3 h-3 text-brand border-line rounded"
                                                  />
                                                  <span>I</span>
                                                </label>
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={!!c.underline}
                                                    onChange={(e) => {
                                                      const cards = [...(b.cards || [])];
                                                      cards[cIdx] = { ...c, underline: e.target.checked };
                                                      updateDocumentBlock(b.id, { cards });
                                                    }}
                                                    className="w-3 h-3 text-brand border-line rounded"
                                                  />
                                                  <span>U</span>
                                                </label>
                                              </div>
                                            </div>
                                          </details>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {b.type === "smartarts" && (
                                <div className="space-y-4">
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Smart Art Layout Template</label>
                                    <select
                                      value={b.layout || "pillars"}
                                      onChange={(e) => updateDocumentBlock(b.id, { layout: e.target.value })}
                                      className="w-full px-3 py-1.5 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-xs font-medium"
                                    >
                                      <option value="pillars">Three Pillars Column Layout</option>
                                      <option value="timeline">Step-by-Step Process Timeline</option>
                                      <option value="comparison">Pro vs Con Comparison Columns</option>
                                    </select>
                                  </div>

                                  {/* Pillars Form */}
                                  {b.layout === "pillars" && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {(b.pillars || []).map((pl: any, plIdx: number) => (
                                        <div key={plIdx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-line space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400">PILLAR {plIdx + 1}</span>
                                            <input
                                              type="text"
                                              value={pl.badge || ""}
                                              onChange={(e) => {
                                                const pillars = [...(b.pillars || [])];
                                                pillars[plIdx] = { ...pl, badge: e.target.value };
                                                updateDocumentBlock(b.id, { pillars });
                                              }}
                                              className="w-20 px-1 py-0.5 text-xs border border-line bg-white rounded uppercase font-mono"
                                              placeholder="Badge"
                                            />
                                          </div>
                                          <input
                                            type="text"
                                            value={pl.title || ""}
                                            onChange={(e) => {
                                              const pillars = [...(b.pillars || [])];
                                              pillars[plIdx] = { ...pl, title: e.target.value };
                                              updateDocumentBlock(b.id, { pillars });
                                            }}
                                            className="w-full px-2 py-1 text-xs border border-line bg-white rounded font-bold"
                                            placeholder="Pillar Title"
                                          />
                                          <textarea
                                            rows={3}
                                            value={pl.desc || ""}
                                            onChange={(e) => {
                                              const pillars = [...(b.pillars || [])];
                                              pillars[plIdx] = { ...pl, desc: e.target.value };
                                              updateDocumentBlock(b.id, { pillars });
                                            }}
                                            className="w-full px-2 py-1 text-xs border border-line bg-white rounded resize-none"
                                            placeholder="Pillar description..."
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Timeline Steps Form */}
                                  {b.layout === "timeline" && (
                                    <div className="space-y-3">
                                      <div className="space-y-3">
                                        {(b.steps || []).map((st: any, stIdx: number) => (
                                          <div key={stIdx} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-line">
                                            <div className="flex flex-col items-center shrink-0 gap-1.5">
                                              <span className="text-[10px] font-bold text-slate-400">STEP</span>
                                              <input
                                                type="text"
                                                value={st.step || ""}
                                                onChange={(e) => {
                                                  const steps = [...(b.steps || [])];
                                                  steps[stIdx] = { ...st, step: e.target.value };
                                                  updateDocumentBlock(b.id, { steps });
                                                }}
                                                className="w-8 px-1 py-0.5 text-center text-xs border border-line bg-white rounded font-bold font-mono"
                                                placeholder="01"
                                              />
                                            </div>
                                            <div className="grow grid grid-cols-1 md:grid-cols-2 gap-3">
                                              <input
                                                type="text"
                                                value={st.title || ""}
                                                onChange={(e) => {
                                                  const steps = [...(b.steps || [])];
                                                  steps[stIdx] = { ...st, title: e.target.value };
                                                  updateDocumentBlock(b.id, { steps });
                                                }}
                                                className="w-full px-2 py-1 text-xs border border-line bg-white rounded font-bold"
                                                placeholder="Step Title"
                                              />
                                              <input
                                                type="text"
                                                value={st.desc || ""}
                                                onChange={(e) => {
                                                  const steps = [...(b.steps || [])];
                                                  steps[stIdx] = { ...st, desc: e.target.value };
                                                  updateDocumentBlock(b.id, { steps });
                                                }}
                                                className="w-full px-2 py-1 text-xs border border-line bg-white rounded"
                                                placeholder="Step description..."
                                              />
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const steps = (b.steps || []).filter((_: any, sIdx: number) => sIdx !== stIdx);
                                                updateDocumentBlock(b.id, { steps });
                                              }}
                                              className="text-red-500 hover:text-red-650 font-bold px-1.5 py-0.5 rounded hover:bg-slate-100 text-sm"
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const defaultStep = String((b.steps || []).length + 1).padStart(2, "0");
                                          updateDocumentBlock(b.id, { steps: [...(b.steps || []), { step: defaultStep, title: "", desc: "" }] });
                                        }}
                                        className="text-xs text-brand hover:underline font-bold"
                                      >
                                        + Add Timeline Step
                                      </button>
                                    </div>
                                  )}

                                  {/* Comparison Form */}
                                  {b.layout === "comparison" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* Left vs Right */}
                                      {[(b.comparison || [])[0], (b.comparison || [])[1]].map((col: any, colIdx: number) => (
                                        <div key={colIdx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-line space-y-3">
                                          <div className="flex gap-2 items-center">
                                            <input
                                              type="text"
                                              value={col.category || ""}
                                              onChange={(e) => {
                                                const comp = [...(b.comparison || [])];
                                                comp[colIdx] = { ...col, category: e.target.value };
                                                updateDocumentBlock(b.id, { comparison: comp });
                                              }}
                                              className="w-fit text-[10px] font-bold border border-line bg-white px-2 py-0.5 uppercase tracking-wider rounded text-slate"
                                              placeholder={colIdx === 0 ? "Option A" : "Option B"}
                                            />
                                          </div>
                                          <input
                                            type="text"
                                            value={col.title || ""}
                                            onChange={(e) => {
                                              const comp = [...(b.comparison || [])];
                                              comp[colIdx] = { ...col, title: e.target.value };
                                              updateDocumentBlock(b.id, { comparison: comp });
                                            }}
                                            className="w-full px-2 py-1 text-xs border border-line bg-white rounded font-bold"
                                            placeholder="Column Title"
                                          />
                                          <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-400">Bullet Points</span>
                                            {(col.points || []).map((cp: string, cpIdx: number) => (
                                              <div key={cpIdx} className="flex gap-1.5 items-center">
                                                <input
                                                  type="text"
                                                  value={cp}
                                                  onChange={(e) => {
                                                    const comp = [...(b.comparison || [])];
                                                    const pts = [...(col.points || [])];
                                                    pts[cpIdx] = e.target.value;
                                                    comp[colIdx] = { ...col, points: pts };
                                                    updateDocumentBlock(b.id, { comparison: comp });
                                                  }}
                                                  className="w-full px-2 py-1 text-xs border border-line bg-white rounded"
                                                  placeholder="Bullet Point"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const comp = [...(b.comparison || [])];
                                                    const pts = (col.points || []).filter((_: any, pIdx: number) => pIdx !== cpIdx);
                                                    comp[colIdx] = { ...col, points: pts };
                                                    updateDocumentBlock(b.id, { comparison: comp });
                                                  }}
                                                  className="text-red-500 hover:text-red-650 font-bold px-1.5 py-0.5 rounded text-xs"
                                                >
                                                  ✕
                                                </button>
                                              </div>
                                            ))}
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const comp = [...(b.comparison || [])];
                                                comp[colIdx] = { ...col, points: [...(col.points || []), ""] };
                                                updateDocumentBlock(b.id, { comparison: comp });
                                              }}
                                              className="text-[10px] text-brand hover:underline font-bold"
                                            >
                                              + Add Compare Point
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {b.type === "html" && (
                                <div className="space-y-1.5">
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Raw HTML Code Block</label>
                                  <textarea
                                    rows={6}
                                    value={b.html || ""}
                                    onChange={(e) => updateDocumentBlock(b.id, { html: e.target.value })}
                                    placeholder="<div>Write your custom HTML/CSS here...</div>"
                                    className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-xs font-mono resize-y"
                                  />
                                </div>
                              )}

                              {b.type === "borderedtext" && (
                                <div className="space-y-3">
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">
                                      Block Label
                                    </label>
                                    <input
                                      type="text"
                                      value={b.label || "KEY CONCEPT"}
                                      onChange={(e) => updateDocumentBlock(b.id, { label: e.target.value })}
                                      placeholder="KEY CONCEPT"
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">
                                      Bordered Block Header Title
                                    </label>
                                    <input
                                      type="text"
                                      value={b.title || ""}
                                      onChange={(e) => updateDocumentBlock(b.id, { title: e.target.value })}
                                      placeholder="Header Title (optional)..."
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                    />
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Bordered Block Content</label>
                                    <textarea
                                      rows={4}
                                      value={b.text || ""}
                                      onChange={(e) => updateDocumentBlock(b.id, { text: e.target.value })}
                                      placeholder="Write content here... (each new line will be preserved)"
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-xs"
                                    />
                                  </div>
                                  <details className="cursor-pointer">
                                    <summary className="text-[9px] font-bold text-slate uppercase tracking-wider select-none hover:text-brand transition-colors">Block Style &amp; Colors</summary>
                                    <div className="pt-2 space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <ColorPicker
                                          label="Background"
                                          color={b.bgColor || "#F4F9FD"}
                                          onChange={(col) => updateDocumentBlock(b.id, { bgColor: col })}
                                        />
                                        <ColorPicker
                                          label="Accent / Border"
                                          color={b.accentColor || "#0E7490"}
                                          onChange={(col) => updateDocumentBlock(b.id, { accentColor: col })}
                                        />
                                        <ColorPicker
                                          label="Text Color"
                                          color={b.textColor || "#526477"}
                                          onChange={(col) => updateDocumentBlock(b.id, { textColor: col })}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Font Size</label>
                                          <select value={b.fontSize || "normal"} onChange={(e) => updateDocumentBlock(b.id, { fontSize: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="xs">XS</option>
                                            <option value="sm">Small</option>
                                            <option value="normal">Normal</option>
                                            <option value="lg">Large</option>
                                            <option value="xl">XL</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-[8px] font-bold text-slate uppercase mb-0.5">Alignment</label>
                                          <select value={b.align || "left"} onChange={(e) => updateDocumentBlock(b.id, { align: e.target.value })} className="w-full px-2 py-1 border border-line bg-white text-slate-800 dark:bg-slate-900 rounded text-xs">
                                            <option value="left">Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Right</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </details>
                                </div>
                              )}

                              {b.type === "table" && (
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center pb-2 border-b border-line">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Table Data Editor</label>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const colsCount = (b.headers || []).length;
                                          if (colsCount >= 6) {
                                            alert("Maximum 6 columns allowed.");
                                            return;
                                          }
                                          const nextColLetter = String.fromCharCode(65 + colsCount);
                                          const headers = [...(b.headers || []), `Column ${nextColLetter}`];
                                          const rows = (b.rows || []).map((row: string[]) => [...row, ""]);
                                          updateDocumentBlock(b.id, { headers, rows });
                                        }}
                                        className="px-2 py-1 bg-white hover:bg-slate-50 border border-line text-slate-700 hover:text-black text-[10px] font-bold rounded shadow-sm cursor-pointer"
                                      >
                                        + Add Column
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const colsCount = (b.headers || []).length;
                                          if (colsCount <= 1) {
                                            alert("Minimum 1 column required.");
                                            return;
                                          }
                                          const headers = (b.headers || []).slice(0, -1);
                                          const rows = (b.rows || []).map((row: string[]) => row.slice(0, -1));
                                          updateDocumentBlock(b.id, { headers, rows });
                                        }}
                                        className="px-2 py-1 bg-white hover:bg-slate-50 border border-line text-red-500 hover:text-red-700 text-[10px] font-bold rounded shadow-sm cursor-pointer"
                                      >
                                        ✕ Delete Column
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const colsCount = (b.headers || []).length;
                                          const rows = [...(b.rows || []), Array(colsCount).fill("")];
                                          updateDocumentBlock(b.id, { rows });
                                        }}
                                        className="px-2 py-1 bg-white hover:bg-slate-50 border border-line text-slate-700 hover:text-black text-[10px] font-bold rounded shadow-sm cursor-pointer"
                                      >
                                        + Add Row
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const rowsCount = (b.rows || []).length;
                                          if (rowsCount <= 1) {
                                            alert("Minimum 1 row required.");
                                            return;
                                          }
                                          const rows = (b.rows || []).slice(0, -1);
                                          updateDocumentBlock(b.id, { rows });
                                        }}
                                        className="px-2 py-1 bg-white hover:bg-slate-50 border border-line text-red-500 hover:text-red-700 text-[10px] font-bold rounded shadow-sm cursor-pointer"
                                      >
                                        ✕ Delete Row
                                      </button>
                                    </div>
                                  </div>

                                  <div className="overflow-x-auto rounded-lg border border-line bg-white/40">
                                    <table className="w-full border-collapse text-left">
                                      <thead>
                                        <tr className="bg-slate-50 border-b border-line">
                                          {(b.headers || []).map((h: string, colIdx: number) => (
                                            <th key={colIdx} className="p-2 border-r border-line last:border-r-0">
                                              <input
                                                type="text"
                                                value={h}
                                                onChange={(e) => {
                                                  const headers = [...(b.headers || [])];
                                                  headers[colIdx] = e.target.value;
                                                  updateDocumentBlock(b.id, { headers });
                                                }}
                                                className="w-full bg-transparent px-1 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
                                                placeholder="Header Name"
                                              />
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(b.rows || []).map((row: string[], rowIdx: number) => (
                                          <tr key={rowIdx} className="border-b border-line last:border-b-0 hover:bg-slate-50/20">
                                            {row.map((cell: string, colIdx: number) => (
                                              <td key={colIdx} className="p-2 border-r border-line last:border-r-0">
                                                <input
                                                  type="text"
                                                  value={cell}
                                                  onChange={(e) => {
                                                    const rows = [...(b.rows || [])];
                                                    const newRow = [...row];
                                                    newRow[colIdx] = e.target.value;
                                                    rows[rowIdx] = newRow;
                                                    updateDocumentBlock(b.id, { rows });
                                                  }}
                                                  className="w-full bg-transparent px-1 py-0.5 text-xs text-slate-700 focus:outline-none focus:bg-white"
                                                  placeholder="..."
                                                />
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  {/* Table Color Customization */}
                                  <details className="cursor-pointer pt-2 border-t border-line/60">
                                    <summary className="text-[9px] font-bold text-slate uppercase tracking-wider select-none hover:text-brand transition-colors">
                                      Table Style &amp; Colors
                                    </summary>
                                    <div className="pt-2 space-y-2">
                                      <div className="grid grid-cols-2 gap-2">
                                        <ColorPicker
                                          label="Header BG"
                                          color={b.headerBgColor || "#F4F9FD"}
                                          onChange={(col) => updateDocumentBlock(b.id, { headerBgColor: col })}
                                        />
                                        <ColorPicker
                                          label="Header Text"
                                          color={b.headerTextColor || "#10233F"}
                                          onChange={(col) => updateDocumentBlock(b.id, { headerTextColor: col })}
                                        />
                                        <ColorPicker
                                          label="Border"
                                          color={b.borderColor || "#DCE5E8"}
                                          onChange={(col) => updateDocumentBlock(b.id, { borderColor: col })}
                                        />
                                        <ColorPicker
                                          label="Alt Row BG"
                                          color={b.evenRowBgColor || ""}
                                          onChange={(col) => updateDocumentBlock(b.id, { evenRowBgColor: col })}
                                        />
                                      </div>
                                    </div>
                                  </details>
                                </div>
                              )}

                              {b.type === "activity" && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Activity Title</label>
                                      <input
                                        type="text"
                                        value={b.title || ""}
                                        onChange={(e) => updateDocumentBlock(b.id, { title: e.target.value })}
                                        className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                        placeholder="Interactive Activity"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Activity URL</label>
                                      <input
                                        type="text"
                                        value={b.url || ""}
                                        onChange={(e) => updateDocumentBlock(b.id, { url: e.target.value })}
                                        className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                        placeholder="https://example.com/activity"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Description</label>
                                    <textarea
                                      rows={2}
                                      value={b.desc || ""}
                                      onChange={(e) => updateDocumentBlock(b.id, { desc: e.target.value })}
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-xs"
                                      placeholder="Complete this interactive activity below..."
                                    />
                                  </div>
                                </div>
                              )}

                              {b.type === "assessment" && (
                                <div className="space-y-4 border border-line rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
                                  <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Quiz Title</label>
                                    <input
                                      type="text"
                                      value={b.title || ""}
                                      onChange={(e) => updateDocumentBlock(b.id, { title: e.target.value })}
                                      className="w-full px-3 py-2 border border-line bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-900 rounded-lg text-sm"
                                      placeholder="Knowledge Check"
                                    />
                                  </div>
                                  
                                  <div className="flex items-center gap-2 pt-1">
                                    <input
                                      type="checkbox"
                                      id={`show-answers-${b.id}`}
                                      checked={b.showAnswers || false}
                                      onChange={(e) => updateDocumentBlock(b.id, { showAnswers: e.target.checked })}
                                      className="rounded border-line text-[#08A88A] focus:ring-[#08A88A] w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor={`show-answers-${b.id}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                      Show questions and selected answers directly
                                    </label>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 pt-1">
                                    <input
                                      type="checkbox"
                                      id={`is-inline-${b.id}`}
                                      checked={b.isInline || false}
                                      onChange={(e) => updateDocumentBlock(b.id, { isInline: e.target.checked })}
                                      className="rounded border-line text-[#08A88A] focus:ring-[#08A88A] w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor={`is-inline-${b.id}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                                      Inline assessment (Check answer for each question immediately)
                                    </label>
                                  </div>
                                  
                                  {b.testId ? (
                                    <div className="border-t border-line/60 pt-4 mt-2">
                                      <h4 className="text-xs font-bold text-[#10233F] dark:text-white mb-3">Assessment Questions</h4>
                                      <QuestionBuilder testId={b.testId} />
                                    </div>
                                  ) : (
                                    <div className="text-center py-6 border border-dashed border-line rounded-lg bg-white dark:bg-slate-950">
                                      <p className="text-xs text-slate font-semibold mb-3">No assessment database record is linked to this block yet.</p>
                                      {initial.id ? (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            try {
                                              const newTestBody = {
                                                course_id: courseId,
                                                module_id: initial.module_id || null,
                                                lesson_id: initial.id,
                                                title: b.title || "Embedded Assessment",
                                                duration_mins: 30,
                                                pass_mark: 84,
                                                attempts_allowed: 0,
                                                negative_marking: 0,
                                                randomize: false,
                                                publish_results: true,
                                              };
                                              const res = await fetch("/api/admin/tests", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify(newTestBody),
                                              });
                                              const data = await res.json();
                                              if (!res.ok) throw new Error(data.error);
                                              updateDocumentBlock(b.id, { testId: data.mock_test.id });
                                            } catch (err: any) {
                                              alert("Failed to initialize test: " + err.message);
                                            }
                                          }}
                                          className="py-1.5 px-4 bg-brand hover:bg-brand/90 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                                        >
                                          Create Embedded Assessment Test
                                        </button>
                                      ) : (
                                        <p className="text-xs text-slate-400">💡 Save the lesson details first to begin configuring questions.</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Block Toolbar */}
                      <div className="space-y-4 border-t border-line pt-4">
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#7B8A99] mb-1">Add Content Block</label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Content Category */}
                          <div className="p-4 rounded-xl border border-slate-100 bg-[#F4F9FD]/50 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">📝</span>
                              <div>
                                <h4 className="text-xs font-bold text-[#10233F]">CONTENT</h4>
                                <p className="text-[10px] text-slate-500 leading-tight">Basic layout and text blocks</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("heading")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>➕</span> Heading
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("subheading")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>➕</span> Subheading
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("paragraph")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>➕</span> Paragraph
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("image")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>📷</span> Image
                              </button>
                            </div>
                          </div>

                          {/* Visual Category */}
                          <div className="p-4 rounded-xl border border-slate-100 bg-[#F4F9FD]/50 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">🎨</span>
                              <div>
                                <h4 className="text-xs font-bold text-[#10233F]">VISUAL</h4>
                                <p className="text-[10px] text-slate-500 leading-tight">Visual components and aids</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("callout")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>💡</span> Callout
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("list")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>◆</span> List
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("borderedtext")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>🔳</span> Bordered
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("infographics")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>📊</span> Infographic
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("smartarts")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>Timeline</span> Smart Art
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("table")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-1 cursor-pointer"
                              >
                                <span>📅</span> Table
                              </button>
                            </div>
                          </div>

                          {/* Learning Category */}
                          <div className="p-4 rounded-xl border border-slate-100 bg-[#F4F9FD]/50 space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">🎓</span>
                              <div>
                                <h4 className="text-xs font-bold text-[#10233F]">LEARNING</h4>
                                <p className="text-[10px] text-slate-500 leading-tight">Theory and interactive items</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("html")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-2 cursor-pointer"
                              >
                                <span>📖</span> Theory (HTML)
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("activity")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-2 cursor-pointer"
                              >
                                <span>⚡</span> Interactive Activity
                              </button>
                              <button
                                type="button"
                                onClick={() => addDocumentBlock("assessment")}
                                className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-all hover:border-[#08A88A] hover:text-[#08A88A] text-left flex items-center gap-2 cursor-pointer"
                              >
                                <span>❓</span> Inline Assessment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="w-full min-h-[340px] max-h-[500px] overflow-y-auto border border-[#DCE5E8] rounded-xl bg-white p-4">
                {kind === "assessment" && linkedTest ? (
                  <div className="p-4 bg-slate-50/50 rounded-xl">
                    <TestTakingWidget
                      testId={linkedTest.id}
                      courseSlug={course.slug}
                      adminPreview={true}
                      darkMode={false}
                      isInline={editorKind === "inline_assessment" || (linkedTest.is_inline || false)}
                      showAnswers={editorKind === "inline_assessment" || (linkedTest.is_inline || false)}
                      onStart={() => {}}
                      onExit={() => {}}
                    />
                  </div>
                ) : previewHtml ? (
                  <LessonIframe html={previewHtml} darkMode={false} />
                ) : (
                  <div className="py-16 text-center space-y-2">
                    <ImageIcon className="w-10 h-10 text-slate/30 mx-auto" />
                    <p className="text-xs text-slate/60">No content added yet. Fill in the fields or add blocks to preview.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Images embedded in this lesson (parsed from the saved HTML — persists across sessions) */}
        {kind !== "assessment" && lessonImages.length > 0 && (
          <div className="md:col-span-2 border border-line bg-white p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">
                Images in this lesson ({lessonImages.length})
              </label>
              <span className="text-[10px] text-slate/60">Click thumbnail to insert into HTML or copy URL</span>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              {lessonImages.map((url, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg border border-line overflow-hidden shrink-0 bg-surface/25 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 p-1 transition-opacity">
                    <button
                      type="button"
                      onClick={() => insertImageTag(url)}
                      className="w-full py-0.5 text-[9px] font-bold bg-brand text-black rounded hover:bg-brand-secondary transition-colors"
                    >
                      + Insert Tag
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        alert("Copied image URL to clipboard!");
                      }}
                      className="w-full py-0.5 text-[9px] font-bold bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded images thumbnail strip */}
        {kind !== "assessment" && uploadedImages.length > 0 && (
          <div className="md:col-span-2 border border-line bg-surface/25 p-3 rounded-lg space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Session Uploaded Images</label>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {uploadedImages.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg border border-line overflow-hidden shrink-0 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 p-1 transition-opacity">
                    <button
                      type="button"
                      onClick={() => insertImageTag(url)}
                      className="w-full py-0.5 text-[9px] font-bold bg-brand text-black rounded hover:bg-brand-secondary transition-colors"
                    >
                      + Insert Tag
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(url);
                        alert("Copied URL to clipboard!");
                      }}
                      className="w-full py-0.5 text-[9px] font-bold bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import status message */}
        {kind !== "assessment" && importStatus && (
          <div className="md:col-span-2 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center justify-between">
            <span>{importStatus}</span>
            <button type="button" onClick={() => setImportStatus(null)} className="text-emerald-600 hover:text-emerald-900 text-xs font-bold">×</button>
          </div>
        )}

        {/* Assessment Settings + QuestionBuilder */}
        {kind === "assessment" && (
          <div className="md:col-span-2 border-t border-line/60 pt-4 mt-2 space-y-4">
            <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider">Assessment Settings</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Time Limit (Mins) *</label>
                <input
                  type="number"
                  min={1}
                  value={durationMins}
                  onChange={(e) => setDurationMins(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded border border-line bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Pass % *</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  step="any"
                  value={passMark ?? 84}
                  onChange={(e) => setPassMark(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded border border-line bg-white text-xs"
                  placeholder="84"
                />
                <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Passing percentage required (Default: 84%)</span>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Attempts Allowed (0 = unlimited)</label>
                <input
                  type="number"
                  min={0}
                  value={attemptsAllowed}
                  onChange={(e) => setAttemptsAllowed(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded border border-line bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Negative Marking (e.g. 0.25)</label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={negativeMarking}
                  onChange={(e) => setNegativeMarking(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded border border-line bg-white text-xs"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="randomize-toggle"
                  checked={randomize}
                  onChange={(e) => setRandomize(e.target.checked)}
                  className="w-4 h-4 rounded text-brand border-line"
                />
                <label htmlFor="randomize-toggle" className="text-[10px] font-bold uppercase tracking-wider text-slate cursor-pointer">
                  Randomize Questions
                </label>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="publish-results-toggle"
                  checked={publishResults}
                  onChange={(e) => setPublishResults(e.target.checked)}
                  className="w-4 h-4 rounded text-brand border-line"
                />
                <label htmlFor="publish-results-toggle" className="text-[10px] font-bold uppercase tracking-wider text-slate cursor-pointer">
                  Publish Results Instantly
                </label>
              </div>
            </div>

            {initial.id ? (
              linkedTest ? (
                <div className="border-t border-line/60 pt-4 mt-4">
                  <QuestionBuilder testId={linkedTest.id} />
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-line rounded-lg">
                  {loadingTest ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-brand" />
                  ) : (
                    <>
                      <p className="text-xs text-slate font-semibold mb-2">No linked assessment test found in database.</p>
                      <Button
                        type="button"
                        onClick={async () => {
                          setLoadingTest(true);
                          try {
                            const newTestBody = {
                              course_id: courseId,
                              module_id: initial.module_id || null,
                              lesson_id: initial.id,
                              title: title,
                              duration_mins: durationMins,
                              pass_mark: passMark,
                              attempts_allowed: attemptsAllowed,
                              negative_marking: negativeMarking,
                              randomize: randomize,
                              publish_results: publishResults,
                            };
                            const res = await fetch("/api/admin/tests", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(newTestBody),
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error);
                            setLinkedTest(data.mock_test);
                            if (courseId && fetchMockTests) fetchMockTests(courseId);
                          } catch (err: any) {
                            alert("Failed to initialize test: " + err.message);
                          } finally {
                            setLoadingTest(false);
                          }
                        }}
                        className="py-1 px-3 bg-brand text-white text-xs font-bold"
                      >
                        Create Assessment Test Row
                      </Button>
                    </>
                  )}
                </div>
              )
            ) : (
              <div className="text-center py-6 border border-dashed border-line rounded-lg text-xs text-slate font-medium">
                💡 Save the lesson details first to begin configuring questions.
              </div>
            )}
          </div>
        )}

      <div className="flex gap-2 justify-end">
        <Button
          onClick={handleSave}
          className="px-4 py-2 bg-brand text-white text-xs font-bold flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          Save Lesson
        </Button>
        <Button onClick={onCancel} variant="secondary" className="px-3 py-2 text-xs">Cancel</Button>
      </div>
    </div>
  );
});

export default function AdminCourseDetailsPage() {
  const routeParams = useParams<{ id: string }>();
  const courseId = routeParams?.id as string;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingCourse, setSavingCourse] = useState(false);
  const [showSettings, setShowSettings] = useState(true);


  // Form states for modules
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // Form states for lessons (mapping of moduleId -> LessonForm)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({});
  const [uploadingHtml, setUploadingHtml] = useState(false);

  // Phase 3 - Mock Tests States
  const [activeTab, setActiveTab] = useState<"curriculum" | "mock-tests">("curriculum");

  // Registration Form States
  const [regFormHtml, setRegFormHtml] = useState("");
  const [savingRegForm, setSavingRegForm] = useState(false);
  const [regFormSaved, setRegFormSaved] = useState(false);
  const [regFormPreview, setRegFormPreview] = useState(false);
  const [copiedRegPrompt, setCopiedRegPrompt] = useState(false);
  const [mockTests, setMockTests] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [testForm, setTestForm] = useState<{ title: string; duration_mins: number; pass_mark: number; module_id: string | null }>({ title: "", duration_mins: 30, pass_mark: 0, module_id: null });

  const fetchMockTests = async (courseId: string) => {
    setLoadingTests(true);
    try {
      const res = await fetch(`/api/admin/tests?course_id=${courseId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMockTests(data.mock_tests || []);
    } catch (err: any) {
      console.error("Failed to load mock tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load course details");
      setCourse(data.course);
      setCurriculum(data.curriculum || []);
      if (data.course) {
        fetchMockTests(data.course.id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch details.");
    } finally {
      setLoading(false);
    }
  };



  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    const isNew = editingTestId === "new";
    const method = isNew ? "POST" : "PATCH";
    const body = isNew
      ? { ...testForm, module_id: testForm.module_id || null, course_id: course.id, display_order: mockTests.length + 1 }
      : { ...testForm, module_id: testForm.module_id || null, id: editingTestId };

    try {
      const res = await fetch("/api/admin/tests", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingTestId(null);
      fetchMockTests(course.id);
    } catch (err: any) {
      alert(err.message || "Failed to save mock test");
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm("Are you sure you want to delete this mock test? This will permanently delete all questions and student attempts.")) return;
    try {
      const res = await fetch("/api/admin/tests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (selectedTestId === testId) {
        setSelectedTestId(null);
      }
      if (course) fetchMockTests(course.id);
    } catch (err: any) {
      alert(err.message || "Failed to delete test");
    }
  };

  const handleMoveTest = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= mockTests.length) return;
    const listCopy = [...mockTests];
    const temp = listCopy[index].display_order;
    listCopy[index].display_order = listCopy[targetIdx].display_order;
    listCopy[targetIdx].display_order = temp;

    setMockTests(listCopy);
    try {
      await Promise.all([
        fetch("/api/admin/tests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: listCopy[index].id, display_order: listCopy[index].display_order }),
        }),
        fetch("/api/admin/tests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: listCopy[targetIdx].id, display_order: listCopy[targetIdx].display_order }),
        }),
      ]);
      if (course) fetchMockTests(course.id);
    } catch (err) {
      console.error("Failed to move test:", err);
    }
  };



  // Course updates
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setSavingCourse(true);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Course settings saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update course.");
    } finally {
      setSavingCourse(false);
    }
  };



  // Module actions
  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !course) return;
    const order = curriculum.length > 0 ? Math.max(...curriculum.map((m) => m.display_order)) + 1 : 1;

    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: course.id,
          title: newModuleTitle,
          display_order: order,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewModuleTitle("");
      setAddingModule(false);
      fetchCourseDetails(); // Reload curriculum
    } catch (err: any) {
      alert(err.message || "Failed to create module.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module and all lessons inside it?")) return;
    try {
      const res = await fetch("/api/admin/modules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: moduleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCourseDetails();
    } catch (err: any) {
      alert(err.message || "Module delete failed.");
    }
  };

  const handleRenameModule = async (moduleId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/admin/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: moduleId, title: newTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCurriculum((prev) =>
        prev.map((mod) => (mod.id === moduleId ? { ...mod, title: newTitle } : mod))
      );
    } catch (err: any) {
      alert(err.message || "Rename failed.");
    }
  };

  const handleMoveModule = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= curriculum.length) return;

    const newCurriculum = [...curriculum];
    const temp = newCurriculum[index].display_order;
    newCurriculum[index].display_order = newCurriculum[targetIndex].display_order;
    newCurriculum[targetIndex].display_order = temp;

    // Swap locally
    setCurriculum(newCurriculum);

    try {
      await Promise.all([
        fetch("/api/admin/modules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newCurriculum[index].id, display_order: newCurriculum[index].display_order }),
        }),
        fetch("/api/admin/modules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newCurriculum[targetIndex].id, display_order: newCurriculum[targetIndex].display_order }),
        }),
      ]);
      fetchCourseDetails(); // Reload ordering
    } catch (err) {
      console.error("Move module failed:", err);
    }
  };

  // Lesson actions
  const openAddLesson = (moduleId: string) => {
    const mod = curriculum.find((m) => m.id === moduleId);
    const order = mod && mod.lessons.length > 0 ? Math.max(...mod.lessons.map((l) => l.display_order)) + 1 : 1;
    setEditingLessonId(`new-${moduleId}`);
    setLessonForm({
      module_id: moduleId,
      title: "",
      kind: "theory",
      content_html: "",
      max_score: 100,
      display_order: order,
    });
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonForm(lesson);
  };

  const handleSaveLesson = async (values: LessonValues) => {
    if (!values.title?.trim()) {
      alert("Lesson title is required.");
      return;
    }
    const isNew = editingLessonId?.startsWith("new-");
    let body: any;
    let moduleId = "";
    if (isNew) {
      moduleId = editingLessonId!.replace("new-", "");
      const mod = curriculum.find((m) => m.id === moduleId);
      const order = mod && mod.lessons.length > 0 ? Math.max(...mod.lessons.map((l) => l.display_order)) + 1 : 1;
      body = { module_id: moduleId, display_order: order, ...values };
    } else {
      body = { id: editingLessonId, ...values };
      const currentLesson = curriculum.flatMap(m => m.lessons).find(l => l.id === editingLessonId);
      if (currentLesson) {
        moduleId = currentLesson.module_id;
      }
    }

    const { assessment_settings, ...lessonPayload } = body;

    try {
      const res = await fetch("/api/admin/lessons", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonPayload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      const savedLesson = data.lesson;

      if (values.kind === "assessment" && savedLesson) {
        // Upsert mock test
        const { data: existingTest } = await supabase
          .from("mock_tests")
          .select("id")
          .eq("lesson_id", savedLesson.id)
          .maybeSingle();

        const testBody = {
          id: existingTest?.id,
          course_id: course!.id,
          module_id: moduleId || null,
          lesson_id: savedLesson.id,
          title: savedLesson.title,
          duration_mins: assessment_settings?.duration_mins ?? 30,
          pass_mark: assessment_settings?.pass_mark ?? 0,
          attempts_allowed: assessment_settings?.attempts_allowed ?? 0,
          negative_marking: assessment_settings?.negative_marking ?? 0,
          randomize: assessment_settings?.randomize ?? false,
          publish_results: assessment_settings?.publish_results ?? true,
          is_inline: assessment_settings?.is_inline ?? false,
        };

        const testRes = await fetch("/api/admin/tests", {
          method: existingTest ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testBody),
        });

        if (!testRes.ok) {
          const testData = await testRes.json();
          throw new Error(testData.error || "Failed to save mock test details.");
        }
      }

      setEditingLessonId(null);
      setLessonForm({});
      fetchCourseDetails();
      if (course) fetchMockTests(course.id);
    } catch (err: any) {
      alert(err.message || "Failed to save lesson.");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lessonId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCourseDetails();
    } catch (err: any) {
      alert(err.message || "Failed to delete lesson.");
    }
  };

  const handleMoveLesson = async (modIndex: number, lessonIndex: number, direction: -1 | 1) => {
    const mod = curriculum[modIndex];
    const targetIndex = lessonIndex + direction;
    if (targetIndex < 0 || targetIndex >= mod.lessons.length) return;

    const lessonsCopy = [...mod.lessons];
    const temp = lessonsCopy[lessonIndex].display_order;
    lessonsCopy[lessonIndex].display_order = lessonsCopy[targetIndex].display_order;
    lessonsCopy[targetIndex].display_order = temp;

    try {
      await Promise.all([
        fetch("/api/admin/lessons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: lessonsCopy[lessonIndex].id, display_order: lessonsCopy[lessonIndex].display_order }),
        }),
        fetch("/api/admin/lessons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: lessonsCopy[targetIndex].id, display_order: lessonsCopy[targetIndex].display_order }),
        }),
      ]);
      fetchCourseDetails();
    } catch (err) {
      console.error("Failed to move lesson:", err);
    }
  };

  const handleHtmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHtml(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setLessonForm((prev) => ({ ...prev, content_html: text }));
      setUploadingHtml(false);
    };
    reader.onerror = () => {
      alert("Failed to read HTML file.");
      setUploadingHtml(false);
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
        <div className="text-center bg-white border border-line p-8 rounded-card max-w-sm">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-3" />
          <h3 className="font-bold text-ink">Course Not Found</h3>
          <p className="text-xs text-slate mt-2">The selected program details could not be resolved.</p>
          <Link href="/admin/courses" className="mt-6 inline-block">
            <Button variant="secondary" className="px-4 py-2 text-xs">Return to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-line shadow-soft">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/courses"
              className="p-2 border border-line rounded-lg text-slate hover:text-brand hover:border-brand/30 transition-all shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                program builder
              </span>
              <h1 className="text-xl font-bold font-display text-ink leading-tight mt-0.5">
                {course.title}
              </h1>
            </div>
          </div>
          {course.slug && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                onClick={() => setShowSettings(!showSettings)}
                className="py-2 px-4 text-sm border border-line text-slate hover:text-brand flex items-center gap-1.5"
              >
                {showSettings ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide Settings
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4" />
                    Show Settings
                  </>
                )}
              </Button>
              <a href={`/training/${course.slug}`} target="_blank" rel="noreferrer" title="Preview the course landing page students see">
                <Button
                  variant="ghost"
                  className="py-2 px-4 text-sm border border-line text-slate hover:text-brand flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  Preview page
                </Button>
              </a>
              <a href={`/training/${course.slug}/learn?preview=1`} target="_blank" rel="noreferrer" title="Open the course materials exactly as an enrolled student sees them — no payment needed">
                <Button
                  className="py-2 px-4 text-sm bg-brand text-white flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  Take course (preview)
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Two Columns: Course Info & Curriculum Outline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Course Details */}
          {showSettings && (
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-6">
                <h2 className="text-base font-bold font-display text-ink border-b border-line pb-2.5">
                  Course Settings
                </h2>

                <form onSubmit={handleUpdateCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={course.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={course.slug}
                      onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                        Segment
                      </label>
                      <select
                        value={course.segment}
                        onChange={(e: any) => setCourse({ ...course, segment: e.target.value })}
                        className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm"
                      >
                        <option value="college">College</option>
                        <option value="corporate">Corporate</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-5 pl-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={course.is_paid}
                          onChange={(e) => setCourse({ ...course, is_paid: e.target.checked })}
                          className="w-4 h-4 rounded text-brand border-line"
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate">Paid</span>
                      </label>
                    </div>
                  </div>

                  {course.is_paid && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                        Price (INR)
                      </label>
                      <input
                        type="number"
                        required
                        value={course.price_inr}
                        onChange={(e) => setCourse({ ...course, price_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm focus:bg-white"
                      />
                    </div>
                  )}

                  <div className="flex items-center pl-1 py-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={course.hide_pricing || false}
                        onChange={(e) => setCourse({ ...course, hide_pricing: e.target.checked })}
                        className="w-4 h-4 rounded text-brand border-line"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate">Hide Pricing / Details</span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <ImageField
                      label="Thumbnail Image"
                      value={course.thumbnail_url}
                      onChange={(url) => setCourse({ ...course, thumbnail_url: url })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Introduction (Markdown / Rich HTML)
                    </label>
                    <textarea
                      rows={8}
                      value={course.introduction}
                      onChange={(e) => setCourse({ ...course, introduction: e.target.value })}
                      placeholder="Provide HTML content explaining what students learn in this program..."
                      className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-xs font-mono resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Summary Text
                    </label>
                    <textarea
                      rows={3}
                      value={course.summary}
                      onChange={(e) => setCourse({ ...course, summary: e.target.value })}
                      className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm focus:bg-white resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={savingCourse}
                    className="w-full py-3 justify-center text-sm font-bold bg-brand text-white"
                  >
                    {savingCourse ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Save Program Settings
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Right Column: Curriculum & Mock Tests Tabs */}
          <div className={`${showSettings ? "lg:col-span-8" : "lg:col-span-12"} space-y-6 transition-all duration-300`}>
            <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-6">
              {/* Tab Selector */}
              <div className="flex border-b border-line -mx-6 -mt-6 px-6 bg-surface/20 rounded-t-card overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("curriculum");
                    setSelectedTestId(null);
                  }}
                  className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "curriculum"
                      ? "border-brand text-brand bg-white"
                      : "border-transparent text-slate hover:text-ink"
                  }`}
                >
                  Curriculum Outline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("mock-tests");
                    setSelectedTestId(null);
                  }}
                  className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "mock-tests"
                      ? "border-brand text-brand bg-white"
                      : "border-transparent text-slate hover:text-ink"
                  }`}
                >
                  Mock Tests ({mockTests.length})
                </button>
              </div>

              {activeTab === "curriculum" ? (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <h2 className="text-base font-bold font-display text-ink">Course Curriculum Outline</h2>
                    {!addingModule && (
                      <Button
                        onClick={() => setAddingModule(true)}
                        className="px-3.5 py-1.5 bg-education text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Module
                      </Button>
                    )}
                  </div>

                  {/* Add Module inline form */}
                  {addingModule && (
                    <div className="bg-surface/50 border border-line p-4 rounded-xl flex items-center gap-3 animate-fade-up">
                      <input
                        type="text"
                        placeholder="Enter module title..."
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-sm"
                      />
                      <Button
                        onClick={handleAddModule}
                        disabled={!newModuleTitle.trim()}
                        className="px-4 py-2 bg-education text-white text-xs font-bold shrink-0"
                      >
                        Create
                      </Button>
                      <Button
                        onClick={() => {
                          setAddingModule(false);
                          setNewModuleTitle("");
                        }}
                        variant="secondary"
                        className="px-3 py-2 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Modules List */}
                  {curriculum.length === 0 ? (
                    <div className="text-center py-12 border-dashed border-2 border-line rounded-xl">
                      <Layers className="w-12 h-12 text-slate/30 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate">No modules defined yet.</p>
                      <p className="text-xs text-slate mt-1">Start by creating a module, then populate it with lessons.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {curriculum.map((mod, modIdx) => (
                        <div key={mod.id} className="border border-line rounded-xl shadow-sm overflow-hidden">
                          {/* Module Title Row */}
                          <div className="bg-surface/55 px-5 py-4 border-b border-line flex items-center justify-between gap-3">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand/10 text-brand text-xs font-bold shrink-0">
                                M{modIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => handleRenameModule(mod.id, e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate/30 focus:border-brand focus:outline-none font-bold text-ink text-sm flex-1 min-w-0 py-0.5"
                              />
                            </div>

                            {/* Module Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMoveModule(modIdx, -1)}
                                disabled={modIdx === 0}
                                className="p-1 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                title="Move Module Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5 text-slate" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveModule(modIdx, 1)}
                                disabled={modIdx === curriculum.length - 1}
                                className="p-1 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                title="Move Module Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5 text-slate" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openAddLesson(mod.id)}
                                className="p-1.5 bg-education/10 border border-education/20 hover:bg-education/20 text-education rounded-md text-xs font-bold flex items-center gap-0.5 ml-1 cursor-pointer"
                                title="Add Lesson inside Module"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Add Lesson</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteModule(mod.id)}
                                className="p-1.5 border border-error/25 hover:bg-error/5 text-error rounded-md ml-1 cursor-pointer"
                                title="Delete Module"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Module structure checklist — guides editors to complete each module */}
                          {(() => {
                            const hasTheory = mod.lessons.some((l) => l.kind === "theory");
                            const hasActivity = mod.lessons.some((l) => l.kind === "activity");
                            const hasTest = mockTests.some((t: any) => t.module_id === mod.id);
                            const chip = (ok: boolean, label: string) => (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  ok
                                    ? "bg-success/10 text-success border-success/30"
                                    : "bg-amber-50 text-amber-600 border-amber-300"
                                }`}
                              >
                                <span>{ok ? "✓" : "•"}</span>
                                {label}
                              </span>
                            );
                            return (
                              <div className="px-5 py-2.5 bg-surface/30 border-b border-line flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate mr-1">
                                  Module should have:
                                </span>
                                {chip(hasTheory, "HTML Content")}
                                {chip(hasActivity, "HTML Activity")}
                                {chip(hasTest, "Module Test")}
                              </div>
                            );
                          })()}

                          {/* Lessons List inside Module */}
                          <div className="p-4 space-y-2 bg-white">
                            {mod.lessons.length === 0 ? (
                              <div className="text-center py-5 text-xs text-slate italic">
                                No lessons added to this module yet.
                              </div>
                            ) : (
                              mod.lessons.map((les, lesIdx) => {
                                const isEditing = editingLessonId === les.id;
                                const isActivity = les.kind === "activity";
                                const badgeColor = isActivity
                                  ? "bg-corporate/10 text-corporate border-corporate/30"
                                  : "bg-education/10 text-education border-education/30";

                                return (
                                  <div
                                    key={les.id}
                                    className={`border rounded-lg p-3 transition-all ${
                                      isEditing
                                        ? "border-brand/40 bg-brand/5 shadow-soft"
                                        : "border-line bg-surface/10 hover:border-line-hover"
                                    }`}
                                  >
                                    {!isEditing ? (
                                      /* Display Mode */
                                      <div className="flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                          <span className="font-semibold text-slate">L{lesIdx + 1}</span>
                                          <span
                                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 border ${badgeColor}`}
                                          >
                                            {les.kind}
                                          </span>
                                          <span className="font-semibold text-ink truncate text-sm">
                                            {les.title}
                                          </span>
                                          {isActivity && les.max_score && (
                                            <span className="text-[10px] text-slate font-semibold shrink-0">
                                              (Max Score: {les.max_score})
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => handleMoveLesson(modIdx, lesIdx, -1)}
                                            disabled={lesIdx === 0}
                                            className="p-0.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                          >
                                            <ArrowUp className="w-3 h-3 text-slate" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleMoveLesson(modIdx, lesIdx, 1)}
                                            disabled={lesIdx === mod.lessons.length - 1}
                                            className="p-0.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                          >
                                            <ArrowDown className="w-3 h-3 text-slate" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => openEditLesson(les)}
                                            className="p-1 text-slate hover:text-brand cursor-pointer"
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteLesson(les.id)}
                                            className="p-1 text-slate hover:text-error cursor-pointer"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <LessonEditor
                                        initial={{ id: les.id, module_id: les.module_id, title: les.title, kind: les.kind, content_html: les.content_html, max_score: les.max_score }}
                                        onSave={handleSaveLesson}
                                        onCancel={() => { setEditingLessonId(null); setLessonForm({}); }}
                                        fetchMockTests={fetchMockTests}
                                      />
                                    )}
                                  </div>
                                );
                              })
                            )}
                            {editingLessonId === `new-${mod.id}` && (
                              <div className="border border-brand/40 bg-brand/5 rounded-lg p-3 mt-2">
                                <LessonEditor
                                  initial={{ module_id: mod.id, title: "", kind: "theory", content_html: "", max_score: 100 }}
                                  onSave={handleSaveLesson}
                                  onCancel={() => { setEditingLessonId(null); setLessonForm({}); }}
                                  fetchMockTests={fetchMockTests}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Phase 3 Mock Tests Builder Tab */
                <div className="space-y-6 pt-2">
                  {!selectedTestId ? (
                    /* Mock Tests Listing view */
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-line pb-3">
                        <h2 className="text-base font-bold font-display text-ink">Programs Mock Tests</h2>
                        {!editingTestId && (
                          <Button
                            onClick={() => {
                              setEditingTestId("new");
                              setTestForm({ title: "", duration_mins: 30, pass_mark: 0, module_id: null });
                            }}
                            className="px-3.5 py-1.5 bg-brand text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Test
                          </Button>
                        )}
                      </div>

                      {/* Add/Edit Mock Test Form */}
                      {editingTestId && (
                        <form onSubmit={handleSaveTest} className="bg-surface/50 border border-line p-4 rounded-xl space-y-4 animate-fade-up">
                          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                            {editingTestId === "new" ? "Create Mock Test" : "Edit Mock Test Settings"}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Test Title *</label>
                              <input
                                type="text"
                                required
                                value={testForm.title}
                                onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                                className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                                placeholder="e.g. SQL Basics Practice Exam"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Duration (Minutes)</label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={testForm.duration_mins}
                                onChange={(e) => setTestForm({ ...testForm, duration_mins: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Minimum Passing Mark</label>
                              <input
                                type="number"
                                required
                                min={0}
                                step="any"
                                value={testForm.pass_mark}
                                onChange={(e) => setTestForm({ ...testForm, pass_mark: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Attach To</label>
                            <select
                              value={testForm.module_id || ""}
                              onChange={(e) => setTestForm({ ...testForm, module_id: e.target.value || null })}
                              className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                            >
                              <option value="">Course-level Mock Test (final exam)</option>
                              {curriculum.map((m) => (
                                <option key={m.id} value={m.id}>Module Assessment — {m.title}</option>
                              ))}
                            </select>
                            <p className="text-[10px] text-slate mt-1">Leave as &quot;Course-level&quot; for a final Mock Test, or pick a module to make this that module&apos;s assessment.</p>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button type="submit" className="px-4 py-2 bg-brand text-white text-xs font-bold">
                              {editingTestId === "new" ? "Create Test" : "Save Test Settings"}
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setEditingTestId(null)}
                              variant="secondary"
                              className="px-3 py-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}

                      {loadingTests ? (
                        <div className="py-12 flex justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-brand" />
                        </div>
                      ) : mockTests.length === 0 ? (
                        <div className="text-center py-12 border-dashed border-2 border-line rounded-xl">
                          <Clock className="w-12 h-12 text-slate/30 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-slate">No mock tests designed yet.</p>
                          <p className="text-xs text-slate mt-1">Start by adding a timed test, then build out its questions.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {mockTests.map((test, index) => (
                            <div key={test.id} className="border border-line rounded-xl p-4 bg-white hover:border-line-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="font-bold text-ink text-sm flex items-center gap-2">
                                  <span className="w-5 h-5 rounded bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center">
                                    T{index + 1}
                                  </span>
                                  {test.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-slate">
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.duration_mins} mins</span>
                                  <span>•</span>
                                  <span>Pass score: {test.pass_mark}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleMoveTest(index, -1)}
                                  disabled={index === 0}
                                  className="p-1.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5 text-slate" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveTest(index, 1)}
                                  disabled={index === mockTests.length - 1}
                                  className="p-1.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5 text-slate" />
                                </button>
                                <Button
                                  onClick={() => setSelectedTestId(test.id)}
                                  className="py-1 px-3 bg-brand/10 hover:bg-brand/20 text-brand border border-brand/20 text-xs font-bold"
                                >
                                  Manage Questions
                                </Button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTestId(test.id);
                                    setTestForm({ title: test.title, duration_mins: test.duration_mins, pass_mark: test.pass_mark, module_id: test.module_id ?? null });
                                  }}
                                  className="p-1.5 border border-line rounded hover:bg-surface cursor-pointer text-slate hover:text-ink"
                                  title="Edit Test Settings"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTest(test.id)}
                                  className="p-1.5 border border-error/30 hover:bg-error/5 text-error rounded cursor-pointer"
                                  title="Delete Test"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Questions list/builder for selected test */
                    <div className="space-y-6">
                      {(() => {
                        const selectedTest = mockTests.find(t => t.id === selectedTestId);
                        return (
                          <>
                            <div className="flex items-center justify-between border-b border-line pb-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => setSelectedTestId(null)}
                                  variant="secondary"
                                  className="py-1 px-2 text-xs"
                                >
                                  ← Back
                                </Button>
                                <div>
                                  <h2 className="text-sm font-bold text-ink leading-tight">{selectedTest?.title}</h2>
                                  <p className="text-[10px] text-slate mt-0.5">{selectedTest?.duration_mins} mins • Passing: {selectedTest?.pass_mark} marks</p>
                                </div>
                              </div>
                            </div>
                            <div className="pt-4">
                              <QuestionBuilder testId={selectedTestId} />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
