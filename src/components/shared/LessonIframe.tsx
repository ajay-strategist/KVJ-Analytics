"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface LessonIframeProps {
  html: string;
  darkMode?: boolean;
  hideSidebar?: boolean;
  onLightDetected?: (isLight: boolean) => void;
  onContentWindow?: (win: Window | null) => void;
}

export const DARK_MODE_CSS = `
html, body {
  background-color: transparent !important;
  color: #cbd5e1 !important;
}
h1, h2, h3, h4, h5, h6,
[class*="heading"], [class*="title"] {
  color: #ffffff !important;
}
p, li, td, th, dt, dd, figcaption, label {
  color: #cbd5e1 !important;
}
strong, b {
  color: #f8fafc !important;
}
a {
  color: #38bdf8 !important;
}
a:hover {
  color: #10B981 !important;
}
blockquote {
  background: rgba(16, 185, 129, 0.05) !important;
  border-left: 4px solid #10B981 !important;
  color: #f1f5f9 !important;
  font-style: italic !important;
  padding: 1rem 1.5rem !important;
  margin: 1.5rem 0 !important;
  border-radius: 0 12px 12px 0 !important;
}
blockquote p {
  color: #f8fafc !important;
}

/* Override any elements with hardcoded dark inline text colors, but EXEMPT admin-styled blocks */
[style*="color: #0"]:not([data-kvj-styled]), [style*="color:#0"]:not([data-kvj-styled]),
[style*="color: #1"]:not([data-kvj-styled]), [style*="color:#1"]:not([data-kvj-styled]),
[style*="color: #2"]:not([data-kvj-styled]), [style*="color:#2"]:not([data-kvj-styled]),
[style*="color: #3"]:not([data-kvj-styled]), [style*="color:#3"]:not([data-kvj-styled]),
[style*="color: #4"]:not([data-kvj-styled]), [style*="color:#4"]:not([data-kvj-styled]),
[style*="color: #5"]:not([data-kvj-styled]), [style*="color:#5"]:not([data-kvj-styled]),
[style*="color: black"]:not([data-kvj-styled]), [style*="color:black"]:not([data-kvj-styled]),
[style*="color: rgb(0,"]:not([data-kvj-styled]), [style*="color: rgb(1"]:not([data-kvj-styled]), [style*="color: rgb(2"]:not([data-kvj-styled]), [style*="color: rgb(3"]:not([data-kvj-styled]), [style*="color: rgb(4"]:not([data-kvj-styled]), [style*="color: rgb(5"]:not([data-kvj-styled]), [style*="color: rgb(6"]:not([data-kvj-styled]) {
  color: #cbd5e1 !important;
}

/* Strip hardcoded light background colors from imported HTML containers, but EXEMPT admin-styled blocks */
[style*="background-color: white"]:not([data-kvj-styled]), [style*="background-color:#fff"]:not([data-kvj-styled]), [style*="background-color: #fff"]:not([data-kvj-styled]), [style*="background-color:#ffffff"]:not([data-kvj-styled]), [style*="background-color: #ffffff"]:not([data-kvj-styled]),
[style*="background-color: rgb(255"]:not([data-kvj-styled]), [style*="background-color: rgb(24"]:not([data-kvj-styled]), [style*="background-color: rgb(25"]:not([data-kvj-styled]),
[style*="background: white"]:not([data-kvj-styled]), [style*="background: #fff"]:not([data-kvj-styled]), [style*="background: #ffffff"]:not([data-kvj-styled]),
.bg-white:not([data-kvj-styled]),
.bg-surface:not([data-kvj-styled]), .bg-base-2:not([data-kvj-styled]), .bg-slate-200:not([data-kvj-styled]),
.bg-gray-50:not([data-kvj-styled]), .bg-gray-100:not([data-kvj-styled]), .bg-gray-200:not([data-kvj-styled]),
.bg-zinc-50:not([data-kvj-styled]), .bg-zinc-100:not([data-kvj-styled]), .bg-zinc-200:not([data-kvj-styled]),
.bg-neutral-50:not([data-kvj-styled]), .bg-neutral-100:not([data-kvj-styled]), .bg-neutral-200:not([data-kvj-styled]),
[class*="bg-white"]:not([data-kvj-styled]),
[class*="bg-surface"]:not([data-kvj-styled]), [class*="bg-base-2"]:not([data-kvj-styled]),
[class*="bg-gray-50"]:not([data-kvj-styled]), [class*="bg-gray-100"]:not([data-kvj-styled]),
[class*="bg-zinc-50"]:not([data-kvj-styled]), [class*="bg-zinc-100"]:not([data-kvj-styled]) {
  background-color: transparent !important;
}

.text-black, .text-slate-800, .text-slate-900, .text-zinc-800, .text-zinc-900, .text-neutral-800, .text-neutral-900,
[class*="text-slate-8"], [class*="text-slate-9"], [class*="text-zinc-8"], [class*="text-zinc-9"], [class*="text-neutral-8"], [class*="text-neutral-9"] {
  color: #cbd5e1 !important;
}

/* Tables in dark mode */
table {
  border-color: rgba(255, 255, 255, 0.08) !important;
}
th {
  background-color: rgba(255, 255, 255, 0.03) !important;
  color: #ffffff !important;
  border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}
td {
  border-bottom-color: rgba(255, 255, 255, 0.04) !important;
  color: #cbd5e1 !important;
}
.borderedtext-block {
  background-color: rgba(139, 92, 246, 0.08) !important;
  border-left: 4px solid #a78bfa !important;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.borderedtext-title {
  color: #f5f3ff !important;
}
.borderedtext-content {
  color: #cbd5e1 !important;
}
`;

export const LIGHT_MODE_CSS = `
:root {
  --color-base: #ffffff !important;
  --color-base-2: #F7FAF9 !important;
  --color-surface: #ffffff !important;
  --color-card: #ffffff !important;
  --color-line: #DCE5E8 !important;
  --color-ink: #132238 !important;
  --color-slate: #526477 !important;
  --color-brand: #08A88A !important;
  --color-brand-secondary: #0E7490 !important;
}
html, body {
  background-color: #ffffff !important;
  color: #132238 !important;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}
h1, h2, h3, h4, h5, h6 {
  color: #10233F !important;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}
h1[data-kvj-styled], h2[data-kvj-styled], h3[data-kvj-styled], h4[data-kvj-styled], h5[data-kvj-styled], h6[data-kvj-styled],
[data-kvj-styled] h1, [data-kvj-styled] h2, [data-kvj-styled] h3, [data-kvj-styled] h4, [data-kvj-styled] h5, [data-kvj-styled] h6 {
  color: unset;
}
p, li, td, th, dt, dd, label {
  color: #132238 !important;
}
[data-kvj-styled] p, [data-kvj-styled] li {
  color: unset;
}
strong, b {
  color: #10233F !important;
}
a {
  color: #08A88A !important;
  border-bottom-color: rgba(8, 168, 138, 0.2) !important;
}
a:hover {
  color: #0E7490 !important;
  border-bottom-color: #0E7490 !important;
}
blockquote {
  background: #F0FBF7 !important;
  border-left: 4px solid #08A88A !important;
  color: #132238 !important;
  font-style: italic !important;
  padding: 1rem 1.5rem !important;
  margin: 1.5rem 0 !important;
  border-radius: 0 12px 12px 0 !important;
}
blockquote p {
  color: #132238 !important;
}
pre {
  background-color: #10233F !important;
  color: #F4F9FD !important;
}
pre code {
  color: #F4F9FD !important;
}
:not(pre) > code {
  background-color: #F4F9FD !important;
  border-color: #DCE5E8 !important;
  color: #0E7490 !important;
}
table {
  border-color: #DCE5E8 !important;
}
th {
  background-color: #F4F9FD !important;
  color: #10233F !important;
  border-bottom-color: #DCE5E8 !important;
}
td {
  border-bottom-color: #DCE5E8 !important;
  color: #132238 !important;
}
.text-slate-355 {
  color: #526477 !important;
}
[data-qidx] button {
  background-color: #ffffff !important;
  border-color: #DCE5E8 !important;
  color: #132238 !important;
}
[data-qidx] button:hover {
  background-color: #f8fafc !important;
  border-color: #cbd5e1 !important;
}
[data-qidx] button.border-brand.bg-brand\/10 {
  background-color: #F0FBF7 !important;
  border-color: #08A88A !important;
  color: #10233F !important;
}
[data-qidx] button[disabled] {
  opacity: 1 !important;
  cursor: not-allowed !important;
}
[data-qidx] button[disabled].border-green-500\/30,
[data-qidx] button[disabled].text-green-400,
[data-qidx] button[disabled].bg-green-500\/10 {
  background-color: #E8F8F0 !important;
  border-color: #22c55e !important;
  color: #15803d !important;
}
[data-qidx] button[disabled].border-red-500\/30,
[data-qidx] button[disabled].text-red-400,
[data-qidx] button[disabled].bg-red-500\/10 {
  background-color: #FFF2F4 !important;
  border-color: #ef4444 !important;
  color: #b91c1c !important;
}
.borderedtext-block {
  background-color: #F4F9FD !important;
  border: 1px solid #DCE5E8 !important;
  border-left: 4px solid #0E7490 !important;
  border-radius: 0 12px 12px 0 !important;
  padding: 1.25rem 1.5rem !important;
  margin: 1.5rem 0 !important;
}
.borderedtext-title {
  color: #10233F !important;
}
.borderedtext-content {
  color: #526477 !important;
}
`;

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

main,
[role="main"],
[class*="content" i]:not([class*="table-of-contents" i]),
[class*="main" i],
[id*="content" i],
[id*="main" i] {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  padding-left: 1.5rem !important;
}
`;

export function LessonIframe({
  html,
  darkMode = false,
  hideSidebar = false,
  onLightDetected,
  onContentWindow,
}: LessonIframeProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const lightDetectedRef = useRef(false);

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
    --color-base: #050608;
    --color-base-2: #07130E;
    --color-surface: #07130E;
    --color-card: #0B2A22;
    --color-line: rgba(16, 185, 129, 0.12);
    --color-brand: #10B981;
    --color-brand-secondary: #34D399;
    --color-ink: #FFFFFF;
    --color-slate: #CBD5E1;
  }
  html,body{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size:16px;
    line-height:1.8;
    color: var(--color-slate);
    background-color:transparent;
    margin:0;
    padding:0;
  }
  body{overflow:hidden}

  [align="left"] { text-align: left !important; }
  [align="center"] { text-align: center !important; }
  [align="right"] { text-align: right !important; }
  [align="justify"] { text-align: justify !important; }

  button, select, input, textarea, .callout, table, code, pre {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  }
  
  /* Modern Editorial Typography */
  h1, h2, h3, h4, h5, h6 {
    color: var(--color-ink);
    font-weight: 800;
    line-height: 1.35;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    letter-spacing: -0.02em;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  h1 { font-size: 2.25rem; }
  h2 { font-size: 1.75rem; border-b: 1px solid var(--color-line); padding-bottom: 0.5rem; }
  h3 { font-size: 1.35rem; }
  h4 { font-size: 1.15rem; }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 1.75rem;
    color: #cbd5e1;
    font-weight: 400;
    letter-spacing: -0.005em;
  }
  
  /* Bold links */
  a {
    color: var(--color-brand);
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid rgba(16, 185, 129, 0.2);
    transition: all 0.2s ease;
  }
  a:hover {
    color: var(--color-brand-secondary);
    border-bottom-color: var(--color-brand-secondary);
  }
  
  /* Lists */
  ul, ol {
    margin-bottom: 1.75rem;
    padding-left: 1.5rem;
  }
  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }
  li {
    margin-bottom: 0.5rem;
    color: #cbd5e1;
    font-size: 1.05rem;
  }
  li::marker {
    color: var(--color-brand);
  }
  
  /* Blockquotes */
  blockquote {
    border-left: 4px solid var(--color-brand);
    background: rgba(16, 185, 129, 0.02);
    padding: 1.25rem 1.75rem;
    margin: 2.5rem 0;
    border-radius: 0 1rem 1rem 0;
    font-style: italic;
    color: #f1f5f9;
  }
  blockquote p {
    margin-bottom: 0;
    font-size: 1.15rem;
    color: #f8fafc;
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
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 2rem 0;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    overflow: hidden;
  }
  th {
    background-color: rgba(255, 255, 255, 0.02);
    color: var(--color-ink);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  td {
    padding: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    color: #cbd5e1;
    font-size: 0.9rem;
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:hover td {
    background-color: rgba(255, 255, 255, 0.01);
  }
  
  /* Images styling */
  img {
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
  img:hover {
    transform: scale(1.005);
    box-shadow: 0 15px 40px -15px rgba(16, 185, 129, 0.15);
  }
  
  /* Code Blocks */
  pre {
    background-color: #07130E !important;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 1.25rem;
    margin: 2rem 0;
    overflow-x: auto;
  }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.9em;
    color: #e2e8f0;
  }
  pre code {
    background: transparent;
    padding: 0;
    color: #cbd5e1;
    display: block;
    line-height: 1.6;
  }
  :not(pre) > code {
    background-color: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.375rem;
    padding: 0.2rem 0.4rem;
    color: #22d3ee;
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
</style>
</head>
<body class="px-6 py-8 sm:px-10 sm:py-12 md:px-14 md:py-16">
<div class="max-w-3xl mx-auto">
${html}
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

  // Smart Theme Contrast Enhancer
  const applySmartTheme = () => {
    // Dynamically protect elements that have inline styles containing '!important' (legacy content)
    document.querySelectorAll('*').forEach(el => {
      const styleAttr = el.getAttribute('style') || '';
      if (styleAttr.includes('!important')) {
        el.setAttribute('data-kvj-styled', 'true');
        el.querySelectorAll('*').forEach(child => {
          child.setAttribute('data-kvj-styled', 'true');
        });
      }
    });

    const isDark = document.body.classList.contains('dark');
    document.querySelectorAll('*').forEach(el => {
      if (['HTML', 'HEAD', 'SCRIPT', 'STYLE', 'BODY'].includes(el.tagName)) return;
      if (el.hasAttribute('data-kvj-styled') || el.closest('[data-kvj-styled]')) return;
      if (isDark) {
        if (!el.hasAttribute('data-org-bg')) {
          el.setAttribute('data-org-bg', el.style.backgroundColor || 'NONE');
        }
        if (!el.hasAttribute('data-org-color')) {
          el.setAttribute('data-org-color', el.style.color || 'NONE');
        }
        if (!el.hasAttribute('data-org-border')) {
          el.setAttribute('data-org-border', el.style.borderColor || 'NONE');
        }
        
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        const m = bg.match(/[\\d.]+/g);
        if (m && m.length >= 3) {
          const r = Number(m[0]);
          const g = Number(m[1]);
          const b = Number(m[2]);
          const a = m[3] !== undefined ? Number(m[3]) : 1;
          if (a > 0.1) {
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            if (lum > 0.5) {
              const isLarge = el.offsetWidth > 300 || el.offsetHeight > 300;
              el.style.setProperty('background-color', isLarge ? 'transparent' : 'rgba(255,255,255,0.03)', 'important');
              el.style.setProperty('border-color', 'rgba(255,255,255,0.08)', 'important');
            }
          }
        }
        const color = style.color;
        const cm = color.match(/[\\d.]+/g);
        if (cm && cm.length >= 3) {
          const cr = Number(cm[0]);
          const cg = Number(cm[1]);
          const cb = Number(cm[2]);
          const ca = cm[3] !== undefined ? Number(cm[3]) : 1;
          if (ca > 0.1) {
            const clum = (0.299 * cr + 0.587 * cg + 0.114 * cb) / 255;
            if (clum < 0.45) {
              el.style.setProperty('color', '#cbd5e1', 'important');
            }
          }
        }
      } else {
        const orgBg = el.getAttribute('data-org-bg');
        const orgColor = el.getAttribute('data-org-color');
        const orgBorder = el.getAttribute('data-org-border');
        if (orgBg && orgBg !== 'NONE') el.style.setProperty('background-color', orgBg);
        else el.style.removeProperty('background-color');
        if (orgColor && orgColor !== 'NONE') el.style.setProperty('color', orgColor);
        else el.style.removeProperty('color');
        if (orgBorder && orgBorder !== 'NONE') el.style.setProperty('border-color', orgBorder);
        else el.style.removeProperty('border-color');
      }
    });
  };

  const themeObserver = new MutationObserver(applySmartTheme);
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  applySmartTheme();
  setTimeout(applySmartTheme, 100);
  setTimeout(applySmartTheme, 300);
  setTimeout(applySmartTheme, 600);
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
      const body = frame.contentDocument?.body;
      if (body) {
        frame.style.height = "0px";
        frame.style.height = `${body.scrollHeight + 16}px`;
      }
    } catch (e) {
      // Cross-origin safety
    }
  }, []);

  const detectLightBackground = useCallback((doc: Document) => {
    if (lightDetectedRef.current) return;
    try {
      // Use the iframe's OWN window for computed styles (not the parent).
      const win = doc.defaultView || window;
      const parse = (bg: string) => {
        const m = bg.match(/[\d.]+/g);
        if (!m || m.length < 3) return null;
        const [r, g, b, a = 1] = m.map(Number);
        return { lum: (0.299 * r + 0.587 * g + 0.114 * b) / 255, a };
      };
      // The wrapper forces body{background:transparent}, so reading only <body> always looks
      // dark. Instead sample the largest painted surfaces (inner wrappers, sections, cells) and
      // pick the dominant background by AREA. If light surfaces win, the lesson is light-themed
      // and should auto-convert to dark for readability.
      const els: Element[] = [doc.body, ...Array.from(doc.querySelectorAll("div,section,main,article,header,td,th"))].slice(0, 100);
      let lightArea = 0;
      let darkArea = 0;
      for (const el of els) {
        const c = parse(win.getComputedStyle(el).backgroundColor);
        if (!c || c.a < 0.5) continue; // ignore transparent surfaces
        const r = (el as HTMLElement).getBoundingClientRect();
        const area = Math.max(0, r.width) * Math.max(0, r.height);
        if (area <= 0) continue;
        if (c.lum > 0.6) lightArea += area;
        else darkArea += area;
      }
      lightDetectedRef.current = true;
      onLightDetected?.(lightArea > darkArea && lightArea > 0);
    } catch {
      // ignore
    }
  }, [onLightDetected]);

  const applyOverlays = useCallback(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!doc || !doc.head) return;

    if (darkMode) {
      removeStyle(doc, "kvj-light");
      injectStyle(doc, "kvj-dark", DARK_MODE_CSS);
      doc.body.classList.add("dark");
      doc.body.classList.remove("light");
    } else {
      removeStyle(doc, "kvj-dark");
      injectStyle(doc, "kvj-light", LIGHT_MODE_CSS);
      doc.body.classList.add("light");
      doc.body.classList.remove("dark");
    }

    if (hideSidebar) {
      injectStyle(doc, "kvj-hide-sidebar", HIDE_SIDEBAR_CSS);
    } else {
      removeStyle(doc, "kvj-hide-sidebar");
    }

    autoResize();
  }, [darkMode, hideSidebar, injectStyle, removeStyle, autoResize]);

  // Initial load handler
  const handleLoad = () => {
    const frame = frameRef.current;
    if (!frame) return;
    try {
      const doc = frame.contentDocument;
      if (doc) {
        detectLightBackground(doc);
        applyOverlays();
        onContentWindow?.(frame.contentWindow);

        // Attach mutation observer to dynamically resize on content updates
        const observer = new MutationObserver(autoResize);
        observer.observe(doc.body, { subtree: true, childList: true, attributes: true });
        
        // Poll resize for images loading or external files
        let count = 0;
        const interval = setInterval(() => {
          autoResize();
          if (++count > 5) clearInterval(interval);
        }, 300);

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
    lightDetectedRef.current = false;
    // Re-trigger load setup if html changes (since srcDoc forces iframe reload)
    const timer = setTimeout(handleLoad, 50);
    return () => clearTimeout(timer);
  }, [html]);

  useEffect(() => {
    applyOverlays();
  }, [darkMode, hideSidebar, applyOverlays]);

  return (
    <iframe
      ref={frameRef}
      srcDoc={srcDoc}
      onLoad={handleLoad}
      className="w-full border-none bg-transparent transition-all duration-200"
      style={{ minHeight: "150px" }}
      sandbox="allow-scripts allow-same-origin allow-popups"
      scrolling="no"
    />
  );
}
