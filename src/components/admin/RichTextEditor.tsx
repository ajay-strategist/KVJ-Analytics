"use client";

import React, { useEffect, useRef, useState } from "react";
import { ColorPicker } from "./ColorPicker";
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent, Link, Image, Code, FileCode, Undo, Redo, Trash2
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Write rich text content here..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTargetNew, setLinkTargetNew] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [isUnorderedList, setIsUnorderedList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [alignment, setAlignment] = useState("left");
  const [formatBlock, setFormatBlock] = useState("p");

  // Keep track of internal content to avoid cursor jumping
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const updateToolbarStates = () => {
    if (typeof document === "undefined") return;
    setIsBold(document.queryCommandState("bold"));
    setIsItalic(document.queryCommandState("italic"));
    setIsUnderline(document.queryCommandState("underline"));
    setIsStrike(document.queryCommandState("strikeThrough"));
    setIsUnorderedList(document.queryCommandState("insertUnorderedList"));
    setIsOrderedList(document.queryCommandState("insertOrderedList"));

    if (document.queryCommandState("justifyCenter")) {
      setAlignment("center");
    } else if (document.queryCommandState("justifyRight")) {
      setAlignment("right");
    } else if (document.queryCommandState("justifyFull")) {
      setAlignment("justify");
    } else {
      setAlignment("left");
    }

    try {
      const block = document.queryCommandValue("formatBlock");
      if (block) {
        const cleanBlock = block.toLowerCase().replace(/[<>]/g, "");
        setFormatBlock(cleanBlock);
      } else {
        setFormatBlock("p");
      }
    } catch (e) {
      setFormatBlock("p");
    }
  };

  useEffect(() => {
    // Enable styleWithCSS so the browser uses styles (text-align) instead of presentational tags
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch (e) {}

    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        updateToolbarStates();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const execCmd = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    triggerChange();
    updateToolbarStates();
  };

  const triggerChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    triggerChange();
    updateToolbarStates();
  };

  const insertHtmlAtCursor = (html: string) => {
    const sel = window.getSelection();
    if (sel && sel.getRangeAt && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const el = document.createElement("div");
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      let node;
      while ((node = el.firstChild)) {
        frag.appendChild(node);
      }
      range.insertNode(frag);
    }
    triggerChange();
    updateToolbarStates();
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    
    // Restore selection/focus before applying command
    editorRef.current?.focus();

    // Check if target = new tab is requested
    if (linkTargetNew) {
      const html = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${window.getSelection()?.toString() || linkUrl}</a>`;
      insertHtmlAtCursor(html);
    } else {
      execCmd("createLink", linkUrl);
    }

    setLinkUrl("");
    setLinkTargetNew(false);
    setShowLinkModal(false);
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgUrl) return;

    editorRef.current?.focus();
    execCmd("insertImage", imgUrl);
    
    setImgUrl("");
    setShowImgModal(false);
  };

  const handleInlineCode = () => {
    const selection = window.getSelection()?.toString() || "code";
    const html = `<code class="bg-[#F4F9FD] border border-[#DCE5E8] px-1.5 py-0.5 rounded text-sm text-[#0E7490] font-mono">${selection}</code>`;
    insertHtmlAtCursor(html);
  };

  const handleCodeBlock = () => {
    const selection = window.getSelection()?.toString() || "Code block content";
    const html = `<pre class="bg-[#10233F] text-[#F4F9FD] p-4 rounded-xl font-mono text-sm leading-relaxed overflow-x-auto my-4"><code>${selection}</code></pre>`;
    insertHtmlAtCursor(html);
  };

  const blockOptions = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];

  return (
    <div className="border border-line rounded-xl overflow-hidden bg-white dark:bg-slate-950 flex flex-col focus-within:ring-2 focus-within:ring-brand/20 transition-all">
      <style>{`
        .rte-content ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
        .rte-content ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
        .rte-content li { margin-bottom: 0.25rem !important; display: list-item !important; }
        .rte-content [align="left"] { text-align: left !important; }
        .rte-content [align="center"] { text-align: center !important; }
        .rte-content [align="right"] { text-align: right !important; }
        .rte-content [align="justify"] { text-align: justify !important; }
      `}</style>
      
      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-900 border-b border-line items-center select-none">
        {/* Headings */}
        <select
          value={blockOptions.includes(formatBlock) ? formatBlock : "p"}
          onChange={(e) => execCmd("formatBlock", `<${e.target.value}>`)}
          className="px-2 py-1 text-xs border border-line rounded bg-white text-slate-800 dark:bg-slate-850 dark:text-slate-200 font-semibold cursor-pointer outline-none"
        >
          <option value="p">Paragraph</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>

        <div className="h-4 w-px bg-line" />

        {/* Text style formatting */}
        <button
          type="button"
          onClick={() => execCmd("bold")}
          title="Bold"
          className={`p-1 rounded cursor-pointer transition-all ${
            isBold
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("italic")}
          title="Italic"
          className={`p-1 rounded cursor-pointer transition-all ${
            isItalic
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("underline")}
          title="Underline"
          className={`p-1 rounded cursor-pointer transition-all ${
            isUnderline
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("strikeThrough")}
          title="Strikethrough"
          className={`p-1 rounded cursor-pointer transition-all ${
            isStrike
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-line" />

        {/* Font sizes */}
        <select
          onChange={(e) => execCmd("fontSize", e.target.value)}
          className="px-2 py-1 text-xs border border-line rounded bg-white text-slate-800 dark:bg-slate-850 dark:text-slate-200 font-semibold cursor-pointer outline-none"
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Extra Large</option>
        </select>

        <div className="h-4 w-px bg-line" />

        {/* Colors Picker */}
        <div className="flex items-center gap-1">
          <ColorPicker
            onChange={(color) => execCmd("foreColor", color || "#132238")}
            defaultLabel="Default text color"
          />
          <ColorPicker
            onChange={(color) => execCmd("hiliteColor", color || "transparent")}
            defaultLabel="No highlight"
          />
        </div>

        <div className="h-4 w-px bg-line" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCmd("justifyLeft")}
          title="Align Left"
          className={`p-1 rounded cursor-pointer transition-all ${
            alignment === "left"
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("justifyCenter")}
          title="Align Center"
          className={`p-1 rounded cursor-pointer transition-all ${
            alignment === "center"
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("justifyRight")}
          title="Align Right"
          className={`p-1 rounded cursor-pointer transition-all ${
            alignment === "right"
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("justifyFull")}
          title="Justify"
          className={`p-1 rounded cursor-pointer transition-all ${
            alignment === "justify"
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-line" />

        {/* Lists & Indenting */}
        <button
          type="button"
          onClick={() => execCmd("insertUnorderedList")}
          title="Bulleted List"
          className={`p-1 rounded cursor-pointer transition-all ${
            isUnorderedList
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("insertOrderedList")}
          title="Numbered List"
          className={`p-1 rounded cursor-pointer transition-all ${
            isOrderedList
              ? "bg-[#08A88A]/20 text-[#08A88A] ring-1 ring-[#08A88A]/40"
              : "hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300"
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("indent")}
          title="Indent"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Indent className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("outdent")}
          title="Outdent"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Outdent className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-line" />

        {/* Insert items */}
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          title="Insert Hyperlink"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Link className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowImgModal(true)}
          title="Insert Image"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Image className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleInlineCode}
          title="Inline Code"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleCodeBlock}
          title="Code Block"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <FileCode className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-line animate-pulse" />

        {/* Operations */}
        <button
          type="button"
          onClick={() => execCmd("undo")}
          title="Undo"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("redo")}
          title="Redo"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Redo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("removeFormat")}
          title="Clear formatting"
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Body */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        placeholder={placeholder}
        className="w-full min-h-[160px] p-4 bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100 rounded-b-xl text-sm leading-relaxed overflow-y-auto focus:outline-none list-inside prose max-w-none rte-content"
        style={{ outline: "none" }}
      />

      {/* Link Dialog Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAddLink}
            className="bg-white dark:bg-slate-900 border border-line p-5 rounded-2xl w-full max-w-sm space-y-4 shadow-xl"
          >
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Insert Link</h4>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white dark:bg-slate-950 text-sm rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="link-target-chk"
                checked={linkTargetNew}
                onChange={(e) => setLinkTargetNew(e.target.checked)}
                className="w-4 h-4 rounded text-brand border-line"
              />
              <label htmlFor="link-target-chk" className="text-xs text-slate font-medium cursor-pointer">
                Open in new tab
              </label>
            </div>
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl("");
                  setLinkTargetNew(false);
                }}
                className="px-3 py-2 border border-line rounded-lg text-slate"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
              >
                Insert link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Dialog Modal */}
      {showImgModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleAddImage}
            className="bg-white dark:bg-slate-900 border border-line p-5 rounded-2xl w-full max-w-sm space-y-4 shadow-xl"
          >
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Insert Image URL</h4>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Image URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com/image.png"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                className="w-full px-3 py-2 border border-line bg-white dark:bg-slate-950 text-sm rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setShowImgModal(false);
                  setImgUrl("");
                }}
                className="px-3 py-2 border border-line rounded-lg text-slate"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
              >
                Insert image
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
