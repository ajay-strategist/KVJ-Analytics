"use client";

import React from "react";

/**
 * Renders admin-pasted HTML/SVG animation inside a sandboxed iframe.
 *
 * `sandbox="allow-scripts"` WITHOUT `allow-same-origin` gives the pasted markup
 * its own opaque origin: it can animate and run its own scripts, but cannot reach
 * the parent page, read cookies/localStorage, or navigate the top window. This is
 * what makes "paste any animation you generated" safe.
 */
export function SandboxedAnimation({ html, className }: { html: string; className?: string }) {
  const srcDoc =
    `<!doctype html><html><head><meta charset="utf-8">` +
    `<style>html,body{margin:0;padding:0;height:100%;width:100%;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center}</style>` +
    `</head><body>${html}</body></html>`;

  return (
    <iframe
      title="Card animation"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      loading="lazy"
      className={className}
      style={{ width: "100%", height: "100%", border: 0, background: "transparent" }}
    />
  );
}
