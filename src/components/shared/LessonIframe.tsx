"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { toDirectImageUrl } from "@/lib/mediaUrl";

interface LessonIframeProps {
  html: string;
  darkMode?: boolean;
  hideSidebar?: boolean;
  onLightDetected?: (isLight: boolean) => void;
  onContentWindow?: (win: Window | null) => void;
}

export const DARK_MODE_CSS = ``;

export const LIGHT_MODE_CSS = ``;

export const HIDE_SIDEBAR_CSS = `
aside,
nav,
[class*="sidebar" i],
[id*="sidebar" i],
[class*="side-bar" i],
[class*="sidenav" i],
[id*="sidenav" i],
[class*="left-panel" i],
[id*="left-panel" i],
header:first-of-type,
[class*="header" i]:first-of-type,
[class*="top-bar" i]:first-of-type,
[class*="navbar" i]:first-of-type,
[class*="exit" i] { display: none !important; }

/* Only target top-level layout main/article containers, preserving card & component paddings */
body > main,
body > [role="main"],
body > article,
body > div > main,
body > div > [role="main"],
body > div > article,
.notion-page-content {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
`;

export function cleanLessonHtml(html: string): string {
  if (!html) return "";
  let cleaned = html;
  // 1. Remove metadata comment using a JSON-aware parser.
  //    A simple lazy regex ([\s\S]*?-->) breaks when the lesson HTML embedded
  //    inside the JSON string contains its own HTML comments (with -->), causing
  //    premature truncation and leftover JSON junk rendered as plain text.
  const META_START = "<!-- KVJ_MATERIAL_METADATA:";
  const metaIdx = cleaned.indexOf(META_START);
  if (metaIdx !== -1) {
    const jsonStart = cleaned.indexOf("{", metaIdx);
    if (jsonStart !== -1) {
      // Walk the JSON to find the matching closing brace, respecting strings
      let depth = 0, inString = false, escape = false, jsonEnd = -1;
      for (let i = jsonStart; i < cleaned.length; i++) {
        const c = cleaned[i];
        if (escape) { escape = false; continue; }
        if (c === "\\") { escape = true; continue; }
        if (c === '"') { inString = !inString; continue; }
        if (!inString) {
          if (c === "{" || c === "[") depth++;
          else if (c === "}" || c === "]") {
            depth--;
            if (depth === 0) { jsonEnd = i; break; }
          }
        }
      }
      if (jsonEnd !== -1) {
        const closeIdx = cleaned.indexOf("-->", jsonEnd);
        cleaned = closeIdx !== -1 ? cleaned.slice(closeIdx + 3) : cleaned.slice(jsonEnd + 1);
      }
    } else {
      // No JSON object found — strip up to the first --> after META_START
      const closeIdx = cleaned.indexOf("-->", metaIdx + META_START.length);
      if (closeIdx !== -1) cleaned = cleaned.slice(closeIdx + 3);
    }
  }
  // 1b. If the HTML is a full HTML document, extract inner body and any head styles/scripts
  if (/<!DOCTYPE\s+html/i.test(cleaned) || /<html[\s>]/i.test(cleaned)) {
    const headMatch = cleaned.match(/<head[\s\S]*?>([\s\S]*?)<\/head>/i);
    const bodyMatch = cleaned.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      let extractedHead = "";
      if (headMatch) {
        const headTags = headMatch[1].match(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<link[\s\S]*?>/gi) || [];
        extractedHead = headTags.join("\n");
      }
      cleaned = extractedHead + "\n" + bodyMatch[1];
    } else {
      cleaned = cleaned.replace(/<!DOCTYPE\s+html[^>]*>/gi, "").replace(/<\/?(html|head|body)[^>]*>/gi, "");
    }
  }

  // 2. Trim outer newlines and spaces, and remove trailing empty tags/breaks
  cleaned = cleaned.replace(/^(\s|\\n)+|(\s|\\n)+$/g, "");
  cleaned = cleaned.replace(/(?:<p[^>]*>\s*(?:<br\s*\/?>|&nbsp;|\s)*<\/p>|<br\s*\/?>|\s)+$/gi, "");

  // 3. Replace literal \n with <br/> and \" with " only outside of style/script tags
  const regex = /(<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<[^>]+>)|(\\n)|(\\\")/g;
  cleaned = cleaned.replace(regex, (match, tagOrHtml, literalNL, literalQuote) => {
    if (tagOrHtml) {
      if (tagOrHtml.startsWith("<style") || tagOrHtml.startsWith("<script")) {
        return tagOrHtml.replace(/\\n/g, "\n");
      }
      return tagOrHtml.replace(/\\n/g, " ").replace(/\\"/g, '"');
    }
    if (literalNL) {
      return "<br/>";
    }
    if (literalQuote) {
      return '"';
    }
    return match;
  });

  // 4. Transform <img> tags to convert Google Drive / OneDrive share links into direct renderable image URLs
  cleaned = cleaned.replace(/<img\s+([^>]*?)src=["']?([^"'\s>]+)["']?([^>]*?)>/gi, (match, prefix, rawSrc, suffix) => {
    const src = rawSrc.replace(/^\\?["']|\\?["']$/g, "").trim();
    const directSrc = toDirectImageUrl(src);
    const hasReferrer = /referrerpolicy/i.test(match);
    const hasOnError = /onerror/i.test(match);
    const referrerAttr = hasReferrer ? '' : ' referrerpolicy="no-referrer"';
    
    // Multi-tier cascade onError fallback:
    // Tier 1 (initial directSrc): https://lh3.googleusercontent.com/d/<id>
    // Tier 2: https://drive.google.com/thumbnail?id=<id>&sz=w1600
    // Tier 3: /api/media-proxy?id=<id> (server-side streaming proxy)
    const onErrorAttr = hasOnError
      ? ''
      : ' onerror="var s=this.src;if(s.indexOf(\'lh3.googleusercontent.com/d/\')!==-1){var id=s.split(\'/d/\')[1].split(\'?\')[0].split(\'=\')[0];this.src=\'https://drive.google.com/thumbnail?id=\'+id+\'&sz=w1600\';}else if(s.indexOf(\'drive.google.com/thumbnail\')!==-1){var m=s.match(/id=([a-zA-Z0-9_-]+)/);if(m){this.src=\'/api/media-proxy?id=\'+m[1];}}else if(s.indexOf(\'/api/media-proxy\')===-1){var m2=s.match(/([a-zA-Z0-9_-]{15,})/);if(m2){this.src=\'/api/media-proxy?id=\'+m2[1];}};"';

    return `<img ${prefix}src="${directSrc}"${referrerAttr}${onErrorAttr}${suffix}>`;
  });

  return cleaned;
}

export function LessonIframe({
  html,
  darkMode = false,
  hideSidebar = false,
  onLightDetected,
  onContentWindow,
}: LessonIframeProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const cleanHtml = cleanLessonHtml(html);

  // Build a self-contained HTML document wrapping the content.
  // Tailwind CDN is linked so that all our pre-designed premium blocks render beautifully.
  const srcDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<base target="_blank" />
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box}
  :root {
    --color-base: #FFFFFF;
    --color-base-2: #F8FAFC;
    --color-surface: #FFFFFF;
    --color-card: #F8FAFC;
    --color-line: #E2E8F0;
    --color-brand: #0D9488;
    --color-brand-secondary: #0F766E;
    --color-ink: #0F172A;
    --color-slate: #475569;
  }
  html,body{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size:16px;
    line-height:1.8;
    color: var(--color-slate);
    background-color:transparent;
    margin:0 !important;
    padding:0 !important;
    height:auto !important;
    min-height:auto !important;
    max-height:none !important;
  }
  body{overflow:hidden}

  /* Prevent lesson styles from locking the iframe to full viewport height or centering inside void */
  body [style*="100vh"], body [style*="90vh"], body [style*="95vh"] {
    min-height: auto !important;
  }

  [align="left"] { text-align: left !important; }
  [align="center"] { text-align: center !important; }
  [align="right"] { text-align: right !important; }
  [align="justify"] { text-align: justify !important; }

  button:not(.kvj-custom-html-block *), select:not(.kvj-custom-html-block *), input:not(.kvj-custom-html-block *), textarea:not(.kvj-custom-html-block *), table:not(.kvj-custom-html-block *), code:not(.kvj-custom-html-block *), pre:not(.kvj-custom-html-block *) {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  }
  
  /* Modern Editorial Typography */
  h1:not(.kvj-custom-html-block *), h2:not(.kvj-custom-html-block *), h3:not(.kvj-custom-html-block *), h4:not(.kvj-custom-html-block *), h5:not(.kvj-custom-html-block *), h6:not(.kvj-custom-html-block *) {
    color: var(--color-ink);
    font-weight: 800;
    line-height: 1.35;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    letter-spacing: -0.02em;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  h1:not(.kvj-custom-html-block *) { font-size: 2.25rem; }
  h2:not(.kvj-custom-html-block *) { font-size: 1.75rem; border-b: 1px solid var(--color-line); padding-bottom: 0.5rem; }
  h3:not(.kvj-custom-html-block *) { font-size: 1.35rem; }
  h4:not(.kvj-custom-html-block *) { font-size: 1.15rem; }
  
  p:not(.kvj-custom-html-block *) {
    font-size: 1.1rem;
    margin-bottom: 1.75rem;
    color: var(--color-slate);
    font-weight: 400;
    letter-spacing: -0.005em;
  }
  
  /* Bold links */
  a:not(.kvj-custom-html-block *) {
    color: var(--color-brand);
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid rgba(16, 185, 129, 0.2);
    transition: all 0.2s ease;
  }
  a:not(.kvj-custom-html-block *):hover {
    color: var(--color-brand-secondary);
    border-bottom-color: var(--color-brand-secondary);
  }
  
  /* Lists */
  ul:not(.kvj-custom-html-block *), ol:not(.kvj-custom-html-block *) {
    margin-bottom: 1.75rem;
    padding-left: 1.5rem;
  }
  ul:not(.kvj-custom-html-block *) { list-style-type: disc; }
  ol:not(.kvj-custom-html-block *) { list-style-type: decimal; }
  li:not(.kvj-custom-html-block *) {
    margin-bottom: 0.5rem;
    color: var(--color-slate);
    font-size: 1.05rem;
  }
  li:not(.kvj-custom-html-block *)::marker {
    color: var(--color-brand);
  }
  
  /* Blockquotes */
  blockquote:not(.kvj-custom-html-block *) {
    border-left: 4px solid var(--color-brand);
    background: rgba(16, 185, 129, 0.02);
    padding: 1.25rem 1.75rem;
    margin: 2.5rem 0;
    border-radius: 0 1rem 1rem 0;
    font-style: italic;
    color: var(--color-slate);
  }
  blockquote:not(.kvj-custom-html-block *) p {
    margin-bottom: 0;
    font-size: 1.15rem;
    color: var(--color-ink);
  }
  
  /* Premium Callout Blocks */
  .callout, .callout-info, .callout-success, .callout-warning, .callout-danger, .callout-tip, .callout-important, .callout-example {
    padding: 1.25rem 1.5rem;
    margin: 2rem 0;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(8px);
    position: relative;
    padding-left: 3rem;
  }
  .callout::before {
    position: absolute;
    left: 1.25rem;
    top: 1.35rem;
    font-size: 1.1rem;
    line-height: 1;
  }
  .callout-info, .callout-note {
    border-left: 4px solid #3b82f6;
    background: rgba(59, 130, 246, 0.03);
  }
  .callout-info::before, .callout-note::before { content: "ℹ️"; }
  
  .callout-success {
    border-left: 4px solid #10b981;
    background: rgba(16, 185, 129, 0.03);
  }
  .callout-success::before { content: "✅"; }
  
  .callout-warning {
    border-left: 4px solid #f59e0b;
    background: rgba(245, 158, 11, 0.03);
  }
  .callout-warning::before { content: "⚠️"; }
  
  .callout-tip {
    border-left: 4px solid #8b5cf6;
    background: rgba(139, 92, 246, 0.03);
  }
  .callout-tip::before { content: "💡"; }
  
  .callout-important {
    border-left: 4px solid #ef4444;
    background: rgba(239, 68, 68, 0.03);
  }
  .callout-important::before { content: "🔥"; }
  
  .callout-example {
    border-left: 4px solid #14b8a6;
    background: rgba(20, 184, 166, 0.03);
  }
  .callout-example::before { content: "📝"; }
  
  /* Tables styling */
  table:not(.kvj-custom-html-block *) {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 2rem 0;
    border: 1px solid var(--color-line);
    border-radius: 0.75rem;
    overflow: hidden;
  }
  th:not(.kvj-custom-html-block *) {
    background-color: rgba(255, 255, 255, 0.02);
    color: var(--color-ink);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    padding: 1rem;
    border-bottom: 1px solid var(--color-line);
  }
  td:not(.kvj-custom-html-block *) {
    padding: 1rem;
    border-bottom: 1px solid var(--color-line);
    color: var(--color-slate);
    font-size: 0.9rem;
  }
  tr:last-child td:not(.kvj-custom-html-block *) {
    border-bottom: none;
  }
  tr:hover td:not(.kvj-custom-html-block *) {
    background-color: rgba(255, 255, 255, 0.01);
  }
  
  /* Images styling */
  img:not(.kvj-custom-html-block *) {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: zoom-in;
    margin: 2rem auto;
  }
  img:not(.kvj-custom-html-block *):hover {
    transform: scale(1.005);
    box-shadow: 0 15px 40px -15px rgba(16, 185, 129, 0.15);
  }
  
  /* Code Blocks */
  pre:not(.kvj-custom-html-block *) {
    background-color: #F8FAFC;
    border: 1px solid #E2E8F0;
    border-radius: 1rem;
    padding: 1.25rem;
    margin: 2rem 0;
    overflow-x: auto;
  }
  code:not(.kvj-custom-html-block *) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9em;
    color: #0F172A;
  }
  pre:not(.kvj-custom-html-block *) code:not(.kvj-custom-html-block *) {
    background: transparent;
    padding: 0;
    color: #475569;
    display: block;
    line-height: 1.6;
  }
  :not(pre):not(.kvj-custom-html-block *) > code:not(.kvj-custom-html-block *) {
    background-color: #F1F5F9;
    border: 1px solid #E2E8F0;
    border-radius: 0.375rem;
    padding: 0.2rem 0.4rem;
    color: #0D9488;
  }
  
  /* Theme utilities mapping */
  .bg-card { background-color: var(--color-card) !important; }
  .border-white\\/5 { border-color: rgba(255, 255, 255, 0.05) !important; }
  .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1) !important; }
  .border-brand\\/20 { border-color: rgba(16, 185, 129, 0.2) !important; }
  .border-brand { border-color: var(--color-brand) !important; }
  .bg-brand\\/5 { background-color: rgba(16, 185, 129, 0.05) !important; }
  .bg-brand\\/10 { background-color: rgba(16, 185, 129, 0.1) !important; }
  .text-brand { color: var(--color-brand) !important; }
  .text-white { color: var(--color-ink) !important; }
  .text-slate-350 { color: var(--color-slate) !important; }
  .signature-gradient {
    background: linear-gradient(120deg, #10B981 0%, #0D9488 35%, #34D399 60%, #10B981 100%) !important;
  }
  
  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
  }
  [data-qidx] button {
    background-color: rgba(255, 255, 255, 0.02) !important;
    border-color: rgba(255, 255, 255, 0.05) !important;
    color: #cbd5e1 !important;
  }
  [data-qidx] button:hover {
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
  }
  [data-qidx] button.border-brand.bg-brand\/10 {
    background-color: rgba(16, 185, 129, 0.08) !important;
    border-color: #10b981 !important;
    color: #10b981 !important;
  }
  [data-qidx] button[disabled] {
    opacity: 1 !important;
    cursor: not-allowed !important;
  }
  [data-qidx] button[disabled].border-green-500\/30,
  [data-qidx] button[disabled].text-green-400,
  [data-qidx] button[disabled].bg-green-500\/10 {
    background-color: rgba(16, 185, 129, 0.12) !important;
    border-color: #10b981 !important;
    color: #34d399 !important;
  }
  [data-qidx] button[disabled].border-red-500\/30,
  [data-qidx] button[disabled].text-red-400,
  [data-qidx] button[disabled].bg-red-500\/10 {
    background-color: rgba(239, 68, 68, 0.12) !important;
    border-color: #ef4444 !important;
    color: #f87171 !important;
  }
  
  /* Reset top and bottom margins on outer elements to eliminate excessive blank spaces */
  #kvj-content-root > *:first-child,
  #kvj-content-root .kvj-custom-html-block > *:first-child,
  .kvj-custom-html-block > *:first-child {
    margin-top: 0 !important;
  }
  #kvj-content-root > *:last-child,
  #kvj-content-root .kvj-custom-html-block > *:last-child,
  .kvj-custom-html-block > *:last-child {
    margin-bottom: 0 !important;
  }
</style>
</head>
<body class="m-0 p-0 overflow-hidden">
<div id="kvj-content-root" class="w-full max-w-none px-5 py-6 sm:px-8 sm:py-8">
${cleanHtml.includes("kvj-custom-html-block") ? cleanHtml : `<div class="kvj-custom-html-block">${cleanHtml}</div>`}
</div>
<script>
  // Copy Code Button & Language Label
  document.querySelectorAll('pre').forEach(pre => {
    pre.className = (pre.className || '') + ' relative group';
    
    // Add language label
    const codeEl = pre.querySelector('code');
    let lang = 'code';
    if (codeEl && codeEl.className) {
      const match = codeEl.className.match(/language-(\\w+)/);
      if (match) lang = match[1];
    }
    const label = document.createElement('span');
    label.className = 'absolute top-2 left-3 text-[10px] text-slate-500 font-mono uppercase select-none';
    label.textContent = lang;
    pre.appendChild(label);
    
    const btn = document.createElement('button');
    btn.className = 'absolute top-2 right-2 px-2 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none border border-white/10';
    btn.textContent = 'Copy';
    btn.onclick = () => {
      let codeText = '';
      pre.childNodes.forEach(node => {
        if (node !== btn && node !== label) codeText += node.textContent;
      });
      navigator.clipboard.writeText(codeText.trim());
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 2000);
    };
    pre.appendChild(btn);
  });

  // Image Zoom Lightbox
  document.querySelectorAll('img').forEach(img => {
    img.onclick = () => {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = 'rgba(5, 6, 8, 0.95)';
      overlay.style.zIndex = '99999';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.cursor = 'zoom-out';
      overlay.style.transition = 'all 0.25s ease';
      
      const clone = img.cloneNode();
      clone.style.maxWidth = '90%';
      clone.style.maxHeight = '90%';
      clone.style.objectFit = 'contain';
      clone.style.border = 'none';
      clone.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.8)';
      clone.style.transform = 'none';
      
      overlay.appendChild(clone);
      overlay.onclick = () => overlay.remove();
      document.body.appendChild(overlay);
    };
  });

  // Heading anchor links
  document.querySelectorAll('h2, h3').forEach(h => {
    h.className = (h.className || '') + ' relative group cursor-pointer';
    if (!h.id) {
      h.id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const anchor = document.createElement('span');
    anchor.className = 'absolute -left-5 text-brand opacity-0 group-hover:opacity-100 transition-opacity select-none';
    anchor.textContent = '#';
    anchor.style.paddingRight = '5px';
    anchor.onclick = (e) => {
      e.stopPropagation();
      window.parent.postMessage({ type: 'COPY_LINK', id: h.id }, '*');
    };
    h.insertBefore(anchor, h.firstChild);
  });

  // Scroll spy Intersection Observer inside iframe
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        window.parent.postMessage({ type: 'ACTIVE_HEADING', id: entry.target.id }, '*');
      }
    });
  }, { rootMargin: '0px 0px -75% 0px' });
  document.querySelectorAll('h2, h3').forEach(h => observer.observe(h));

  // Listen for scroll commands
  window.addEventListener('message', (e) => {
    if (e.data.type === 'SCROLL_TO_HEADING') {
      const el = document.getElementById(e.data.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        window.parent.postMessage({ type: 'SCROLL_PARENT', top: absoluteTop }, '*');
      }
    }
  });

  // Dynamic content height measurement & reporting via ResizeObserver
  function notifyHeight() {
    const root = document.getElementById('kvj-content-root') || document.body;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    let maxBottom = rect.height;
    const children = Array.from(root.children);
    for (const child of children) {
      if (child.tagName === 'SCRIPT' || child.tagName === 'STYLE') continue;
      const cr = child.getBoundingClientRect();
      if (cr.bottom > maxBottom) maxBottom = cr.bottom;
    }
    const h = Math.ceil(Math.max(maxBottom, root.offsetHeight));
    if (h > 0) {
      window.parent.postMessage({ type: 'KVJ_IFRAME_RESIZE', height: h }, '*');
    }
  }

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      notifyHeight();
    });
    const root = document.getElementById('kvj-content-root');
    if (root) ro.observe(root);
    ro.observe(document.body);
    ro.observe(document.documentElement);
  }

  window.addEventListener('load', notifyHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(notifyHeight);
  }
  notifyHeight();
  setTimeout(notifyHeight, 100);
  setTimeout(notifyHeight, 350);
  setTimeout(notifyHeight, 750);

</script>
</body>
</html>`;

  const injectStyle = useCallback((doc: Document, id: string, css: string) => {
    const existing = doc.querySelector(`style[data-kvj-id="${id}"]`);
    if (existing) {
      existing.textContent = css;
    } else {
      const tag = doc.createElement("style");
      tag.setAttribute("data-kvj-id", id);
      tag.textContent = css;
      doc.head.appendChild(tag);
    }
  }, []);

  const removeStyle = useCallback((doc: Document, id: string) => {
    doc.querySelector(`style[data-kvj-id="${id}"]`)?.remove();
  }, []);

  const autoResize = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    try {
      const doc = frame.contentDocument;
      if (!doc) return;
      const root = doc.getElementById("kvj-content-root") || doc.body;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      let maxBottom = rect.height;
      const children = Array.from(root.children);
      for (const child of children) {
        if (child.tagName === "SCRIPT" || child.tagName === "STYLE") continue;
        const cr = child.getBoundingClientRect();
        if (cr.bottom > maxBottom) maxBottom = cr.bottom;
      }
      const h = Math.ceil(Math.max(maxBottom, root.offsetHeight));
      if (h > 0) {
        frame.style.height = `${h}px`;
      }
    } catch (e) {
      // Cross-origin safety
    }
  }, []);

  const applyOverlays = useCallback(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!doc || !doc.head) return;

    // The entire website is light-themed. Make body use light class.
    doc.body.classList.add("light");
    doc.body.classList.remove("dark");

    if (hideSidebar) {
      injectStyle(doc, "kvj-hide-sidebar", HIDE_SIDEBAR_CSS);
    } else {
      removeStyle(doc, "kvj-hide-sidebar");
    }

    autoResize();
  }, [hideSidebar, injectStyle, removeStyle, autoResize]);

  // Initial load handler
  const handleLoad = () => {
    const frame = frameRef.current;
    if (!frame) return;
    try {
      const doc = frame.contentDocument;
      if (doc) {
        applyOverlays();
        onContentWindow?.(frame.contentWindow);

        // Attach mutation observer to dynamically resize on content updates
        const observer = new MutationObserver(autoResize);
        observer.observe(doc.body, { subtree: true, childList: true, attributes: true });
        
        // Poll resize for images loading or external files
        let count = 0;
        const interval = setInterval(() => {
          autoResize();
          if (++count > 6) clearInterval(interval);
        }, 250);

        return () => {
          observer.disconnect();
          clearInterval(interval);
        };
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Re-trigger load setup if html changes (since srcDoc forces iframe reload)
    const timer = setTimeout(handleLoad, 50);
    return () => clearTimeout(timer);
  }, [html]);

  useEffect(() => {
    applyOverlays();
  }, [hideSidebar, applyOverlays]);

  // Listen for iframe self-reported resize messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const frame = frameRef.current;
      if (!frame || e.source !== frame.contentWindow) return;
      if (e.data?.type === "KVJ_IFRAME_RESIZE" && typeof e.data.height === "number") {
        frame.style.height = `${Math.ceil(e.data.height)}px`;
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // ResizeObserver on the iframe element so width changes (e.g. sidebar open/close) trigger height recalibration
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === "undefined") return;

    let lastWidth = frame.clientWidth;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width !== lastWidth) {
          lastWidth = entry.contentRect.width;
          autoResize();
        }
      }
    });
    ro.observe(frame);
    return () => ro.disconnect();
  }, [autoResize]);

  // Window resize fallback
  useEffect(() => {
    window.addEventListener("resize", autoResize);
    return () => window.removeEventListener("resize", autoResize);
  }, [autoResize]);

  return (
    <iframe
      ref={frameRef}
      srcDoc={srcDoc}
      onLoad={handleLoad}
      className="w-full border-none bg-transparent block"
      style={{ minHeight: "150px" }}
      sandbox="allow-scripts allow-same-origin allow-popups"
      scrolling="no"
    />
  );
}
