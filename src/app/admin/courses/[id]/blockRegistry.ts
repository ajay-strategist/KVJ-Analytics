/**
 * KVJ Analytics — Block-Based Content Authoring Registry
 *
 * Contains:
 * - BlockType union
 * - BlockData interface (discriminated union–style, using `any` for flexibility)
 * - BLOCK_REGISTRY: metadata for the picker UI (icon, label, category, description)
 * - createBlock(): default data factory for each type
 * - generateHtmlFromBlocks(): serialises a block array → renderable HTML string
 * - convertYoutubeUrl(): normalises YouTube/Vimeo share URLs to embed URLs
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type BlockType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "image"
  | "video"
  | "divider"
  | "callout"
  | "list"
  | "infographics"
  | "smartarts"
  | "table"
  | "html"
  | "borderedtext"
  | "activity"
  | "assessment";

export interface BlockData {
  id: string;
  type: BlockType;
  [key: string]: any;
}

export interface BlockConfig {
  type: BlockType;
  label: string;
  description: string;
  category: "text" | "media" | "layout" | "visual" | "data" | "interactive";
  icon: string; // emoji / character for the picker
}

// ─── Registry (Picker Metadata) ──────────────────────────────────────────────

export const BLOCK_REGISTRY: BlockConfig[] = [
  // Text
  { type: "heading",     label: "Heading",      description: "Large section title (H2)",       category: "text",        icon: "H1" },
  { type: "subheading",  label: "Subheading",   description: "Sub-section title (H3)",         category: "text",        icon: "H2" },
  { type: "paragraph",   label: "Paragraph",    description: "Body text paragraph",            category: "text",        icon: "¶"  },
  // Media
  { type: "image",       label: "Image",        description: "Upload or embed an image",       category: "media",       icon: "🖼" },
  { type: "video",       label: "Video",        description: "YouTube / Vimeo / Loom embed",   category: "media",       icon: "▶" },
  // Layout
  { type: "callout",     label: "Callout Box",  description: "Highlighted info block w/ list", category: "layout",      icon: "💡" },
  { type: "list",        label: "Diamond List", description: "Bulleted list with diamond icons",category: "layout",      icon: "◆" },
  { type: "divider",     label: "Divider",      description: "Visual section separator",       category: "layout",      icon: "—"  },
  // Visual
  { type: "infographics",label: "Infographics", description: "3-column numbered cards grid",   category: "visual",      icon: "📊" },
  { type: "smartarts",   label: "Smart Art",    description: "Pillars / Timeline / Comparison",category: "visual",      icon: "🎨" },
  // Data
  { type: "table",       label: "Table",        description: "Structured data grid (≤5×5)",    category: "data",        icon: "⊞"  },
  // Interactive
  { type: "html",        label: "HTML Block",   description: "Raw HTML / CSS code block",      category: "interactive", icon: "<>" },
  { type: "borderedtext",label: "Bordered Text", description: "Bordered box with title & text",category: "layout",      icon: "▎"  },
  { type: "activity",    label: "Activity",     description: "Embedded interactive iframe",    category: "interactive", icon: "⚡" },
  { type: "assessment",  label: "Quiz (MCQ)",   description: "Inline multiple-choice quiz",    category: "interactive", icon: "✅" },
];

export const BLOCK_CATEGORIES = [
  { key: "text",        label: "Text"        },
  { key: "media",       label: "Media"       },
  { key: "layout",      label: "Layout"      },
  { key: "visual",      label: "Visual"      },
  { key: "data",        label: "Data"        },
  { key: "interactive", label: "Interactive" },
] as const;

// ─── Default Data Factory ─────────────────────────────────────────────────────

export function createBlock(type: BlockType): BlockData {
  const id = Math.random().toString(36).substring(2, 9);
  switch (type) {
    case "heading":
      return { id, type, text: "" };
    case "subheading":
      return { id, type, text: "" };
    case "paragraph":
      return { id, type, text: "" };
    case "image":
      return { id, type, url: "", caption: "" };
    case "video":
      return { id, type, url: "", caption: "", height: "medium" };
    case "divider":
      return { id, type, label: "" };
    case "callout":
      return { id, type, title: "", points: [""] };
    case "list":
      return { id, type, title: "", points: [""] };
    case "infographics":
      return {
        id, type,
        cards: [
          { number: "01", title: "", desc: "" },
          { number: "02", title: "", desc: "" },
          { number: "03", title: "", desc: "" },
        ],
      };
    case "smartarts":
      return {
        id, type,
        layout: "pillars",
        pillars: [
          { badge: "Pillar 01", title: "", desc: "" },
          { badge: "Pillar 02", title: "", desc: "" },
          { badge: "Pillar 03", title: "", desc: "" },
        ],
        steps: [
          { step: "01", title: "", desc: "" },
        ],
        comparison: [
          { category: "Option A", title: "", points: [""] },
          { category: "Option B", title: "", points: [""] },
        ],
      };
    case "table":
      return {
        id, type,
        headers: ["Column A", "Column B", "Column C"],
        rows: [
          ["", "", ""],
          ["", "", ""],
        ],
      };
    case "html":
      return { id, type, html: "" };
    case "activity":
      return { id, type, title: "Interactive Activity", desc: "Complete this interactive activity below.", url: "" };
    case "assessment":
      return {
        id, type,
        title: "Pop Quiz",
        questions: [
          { text: "", options: ["", "", "", ""], correct: "0" },
        ],
      };
    case "borderedtext":
      return { id, type, title: "", text: "" };
  }
}

// ─── YouTube / Vimeo URL Converter ────────────────────────────────────────────

export function convertToEmbedUrl(url: string): string {
  if (!url) return "";

  // Already an embed URL
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) return url;

  // YouTube standard: https://www.youtube.com/watch?v=VIDEO_ID
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;

  // YouTube shorts: https://youtube.com/shorts/VIDEO_ID
  const ytShorts = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (ytShorts) return `https://www.youtube.com/embed/${ytShorts[1]}?rel=0`;

  // Vimeo: https://vimeo.com/VIDEO_ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Loom: https://www.loom.com/share/VIDEO_ID
  const loomMatch = url.match(/loom\.com\/share\/([A-Za-z0-9]+)/);
  if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;

  // Fallback: return as-is (custom embed URL)
  return url;
}

// ─── HTML Generator ───────────────────────────────────────────────────────────

/**
 * Converts an array of BlockData into a complete HTML string for storage in
 * lessons.content_html. Produces a metadata comment header for round-trip
 * parsing, followed by rendered HTML for each block.
 */
export function generateHtmlFromBlocks(blocks: BlockData[]): string {
  const metaStr = `<!-- KVJ_MATERIAL_METADATA: ${JSON.stringify({ type: "document", blocks })} -->\n`;
  const blocksHtml = blocks.map(renderBlock).join("\n");
  return metaStr + blocksHtml;
}

function renderBlock(b: BlockData): string {
  switch (b.type) {
    case "heading":
      return `<h2 class="text-white text-2xl font-extrabold tracking-tight border-b border-white/10 pb-3 mb-6">${escHtml(b.text)}</h2>`;

    case "subheading":
      return `<h3 class="text-brand text-lg font-bold tracking-tight mb-3">${escHtml(b.text)}</h3>`;

    case "paragraph":
      return `<p class="text-slate-355 text-base leading-relaxed mb-6">${escHtml(b.text)}</p>`;

    case "image":
      return `<figure class="my-8 text-center bg-card border border-white/5 p-4 rounded-2xl">
  <img src="${b.url}" alt="${escAttr(b.caption || "Image")}" class="rounded-xl border border-white/10 shadow-xl max-w-full mx-auto" />
  ${b.caption ? `<figcaption class="text-xs text-slate-400 mt-3 font-medium">${escHtml(b.caption)}</figcaption>` : ""}
</figure>`;

    case "video": {
      const embedUrl = convertToEmbedUrl(b.url || "");
      const heights: Record<string, string> = { small: "250px", medium: "400px", large: "560px" };
      const h = heights[b.height || "medium"] || "400px";
      return embedUrl
        ? `<figure class="my-8">
  <div class="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black" style="height:${h}">
    <iframe src="${embedUrl}" class="absolute inset-0 w-full h-full" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture"></iframe>
  </div>
  ${b.caption ? `<figcaption class="text-xs text-center text-slate-400 mt-3 font-medium">${escHtml(b.caption)}</figcaption>` : ""}
</figure>`
        : `<div class="my-8 p-6 border border-dashed border-white/10 rounded-2xl text-center text-slate-500 text-sm">No video URL configured.</div>`;
    }

    case "divider":
      return b.label
        ? `<div class="my-8 flex items-center gap-4">
  <div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  <span class="text-xs text-slate-500 font-bold uppercase tracking-widest">${escHtml(b.label)}</span>
  <div class="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
</div>`
        : `<div class="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>`;

    case "callout": {
      const pts = (b.points || [])
        .map((p: string) => `    <li class="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>${escHtml(p)}</span>
    </li>`)
        .join("\n");
      return `<div class="my-6 border-l-4 border-brand bg-brand/5 p-6 rounded-r-2xl text-left">
  ${b.title ? `<h4 class="text-white font-bold text-sm mb-3">${escHtml(b.title)}</h4>` : ""}
  <ul class="space-y-3">
${pts}
  </ul>
</div>`;
    }

    case "list": {
      const pts = (b.points || [])
        .map((p: string) => `    <li class="flex items-start gap-2.5 text-slate-300 text-sm leading-relaxed">
      <svg class="w-2.5 h-2.5 text-brand fill-current shrink-0 mt-1.5" viewBox="0 0 24 24"><path d="M12 2L22 12L12 22L2 12Z" /></svg>
      <span>${escHtml(p)}</span>
    </li>`)
        .join("\n");
      return `<div class="my-6 text-left space-y-4">
  ${b.title ? `<h4 class="text-white font-bold text-base mb-3">${escHtml(b.title)}</h4>` : ""}
  <ul class="space-y-3">
${pts}
  </ul>
</div>`;
    }

    case "infographics": {
      const cards = (b.cards || [])
        .map((c: any) => `  <div class="relative bg-card border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-brand/30 transition-all duration-300">
    <div class="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-xl group-hover:bg-brand/15 transition-all duration-300"></div>
    <div class="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 text-brand text-lg font-extrabold shadow-sm">${escHtml(c.number)}</div>
    <h4 class="text-white font-bold text-base mb-2 group-hover:text-brand transition-colors">${escHtml(c.title)}</h4>
    <p class="text-slate-400 text-xs leading-relaxed mb-0">${escHtml(c.desc)}</p>
  </div>`)
        .join("\n");
      return `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
${cards}
</div>`;
    }

    case "smartarts": {
      if (b.layout === "pillars") {
        const pillars = (b.pillars || [])
          .map((p: any) => `    <div class="p-6 space-y-3">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-brand animate-pulse"></div>
        <span class="text-xs uppercase tracking-wider text-slate-400 font-bold">${escHtml(p.badge)}</span>
      </div>
      <h4 class="text-white font-bold text-base mt-0">${escHtml(p.title)}</h4>
      <p class="text-slate-400 text-xs leading-relaxed mb-0">${escHtml(p.desc)}</p>
    </div>`)
          .join("\n");
        return `<div class="my-8 border border-white/10 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm">
  <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
${pillars}
  </div>
</div>`;
      }
      if (b.layout === "timeline") {
        const steps = (b.steps || [])
          .map((s: any, idx: number) => `  <div class="flex items-start gap-4">
    <div class="flex flex-col items-center shrink-0">
      <div class="w-8 h-8 rounded-full bg-brand text-black font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)]">${escHtml(s.step)}</div>
      ${idx < (b.steps || []).length - 1 ? `<div class="w-0.5 h-16 bg-gradient-to-b from-brand to-transparent"></div>` : ""}
    </div>
    <div>
      <h4 class="text-white font-bold text-base mb-1">${escHtml(s.title)}</h4>
      <p class="text-slate-400 text-xs leading-relaxed">${escHtml(s.desc)}</p>
    </div>
  </div>`)
          .join("\n");
        return `<div class="space-y-6 my-8 bg-card/30 border border-white/5 p-6 rounded-2xl text-left">
${steps}
</div>`;
      }
      if (b.layout === "comparison") {
        const left = (b.comparison || [])[0] || { category: "", title: "", points: [] };
        const right = (b.comparison || [])[1] || { category: "", title: "", points: [] };
        const lPts = (left.points || []).map((p: string) => `      <li>${escHtml(p)}</li>`).join("\n");
        const rPts = (right.points || []).map((p: string) => `      <li>${escHtml(p)}</li>`).join("\n");
        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 text-left">
  <div class="border border-red-500/20 bg-red-950/5 p-6 rounded-2xl space-y-3">
    <div class="px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider w-fit">${escHtml(left.category)}</div>
    <h4 class="text-white font-bold text-base mt-0">${escHtml(left.title)}</h4>
    <ul class="text-xs text-slate-400 space-y-2 pl-4 list-disc">
${lPts}
    </ul>
  </div>
  <div class="border border-brand/20 bg-brand/5 p-6 rounded-2xl space-y-3">
    <div class="px-2 py-1 rounded bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider w-fit">${escHtml(right.category)}</div>
    <h4 class="text-white font-bold text-base mt-0">${escHtml(right.title)}</h4>
    <ul class="text-xs text-slate-400 space-y-2 pl-4 list-disc">
${rPts}
    </ul>
  </div>
</div>`;
      }
      return "";
    }

    case "table": {
      const headers: string[] = b.headers || [];
      const rows: string[][] = b.rows || [];
      const thCells = headers
        .map((h: string) => `      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-brand border-r border-white/10 last:border-r-0">${escHtml(h)}</th>`)
        .join("\n");
      const trRows = rows
        .map((row: string[]) => {
          const tds = row
            .map((cell: string) => `      <td class="px-4 py-3 text-sm text-slate-300 border-r border-white/5 last:border-r-0">${escHtml(cell)}</td>`)
            .join("\n");
          return `    <tr class="border-b border-white/5 hover:bg-white/3 transition-colors">\n${tds}\n    </tr>`;
        })
        .join("\n");
      return `<div class="my-8 overflow-x-auto rounded-2xl border border-white/10 shadow-soft">
  <table class="w-full text-sm text-left">
    <thead class="bg-white/5 border-b border-white/10">
      <tr>
${thCells}
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5">
${trRows}
    </tbody>
  </table>
</div>`;
    }

    case "html":
      return b.html || "";

    case "activity":
      return `<div class="my-6 p-6 border border-brand/20 bg-brand/5 rounded-2xl text-center space-y-4">
  <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand/10 text-brand">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M14.7 15.3a1 1 0 011.4 0l3 3a1 1 0 01-1.4 1.4l-3-3a1 1 0 010-1.4zM4 9a5 5 0 1110 0A5 5 0 014 9z"/>
    </svg>
  </div>
  <h4 class="text-white font-bold text-lg">${escHtml(b.title || "Interactive Activity")}</h4>
  <p class="text-slate-400 text-sm max-w-md mx-auto">${escHtml(b.desc || "Complete this interactive activity below.")}</p>
  ${b.url ? `<iframe src="${b.url}" class="w-full h-96 rounded-xl border border-white/10 shadow-lg bg-black" allow="autoplay; fullscreen"></iframe>` : `<div class="p-8 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm">No activity source URL configured.</div>`}
</div>`;

    case "assessment": {
      const questionsJson = JSON.stringify(b.questions || []).replace(/"/g, "&quot;");
      const blockId = `quiz-${Math.random().toString(36).substring(2, 9)}`;
      const qHtml = (b.questions || [])
        .map((q: any, qIdx: number) => {
          const optHtml = (q.options || [])
            .map((opt: string, optIdx: number) => `        <button type="button" class="w-full text-left px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-all flex items-center justify-between group" data-optidx="${optIdx}" onclick="
          const parent = this.closest('[data-qidx]');
          parent.querySelectorAll('button').forEach(btn => btn.className = btn.className.replace(' border-brand bg-brand/10 text-white', ' border-white/5 bg-white/5 text-slate-300'));
          this.className += ' border-brand bg-brand/10 text-white';
          parent.setAttribute('data-selected', '${optIdx}');
        ">
          <span>${escHtml(opt)}</span>
          <span class="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-brand/40">✓</span>
        </button>`)
            .join("\n");
          return `    <div class="space-y-3" data-qidx="${qIdx}">
      <p class="text-slate-200 text-sm font-medium">${qIdx + 1}. ${escHtml(q.text)}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
${optHtml}
      </div>
    </div>`;
        })
        .join("\n");
      return `<div class="my-8 p-6 bg-card border border-white/5 rounded-2xl text-left space-y-6" id="${blockId}">
  <div class="flex items-center justify-between border-b border-white/10 pb-3">
    <h4 class="text-white font-bold text-base flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-brand animate-pulse"></span>
      ${escHtml(b.title || "Quick Knowledge Check")}
    </h4>
    <span class="text-xs text-slate-400 font-mono">${(b.questions || []).length} Questions</span>
  </div>
  <div class="space-y-6">
${qHtml}
  </div>
  <div class="pt-4 border-t border-white/10 flex items-center justify-between">
    <button type="button" class="px-5 py-2 bg-brand text-black hover:bg-brand/90 rounded-xl text-xs font-bold transition-all shadow-md" onclick="
      const quiz = this.closest('#${blockId}');
      const questions = JSON.parse(quiz.dataset.questions || '[]');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll('[data-qidx]').forEach((qEl, idx) => {
        const selected = qEl.getAttribute('data-selected');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : '0';
        const buttons = qEl.querySelectorAll('button');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          if (bIdx === Number(correctOpt)) btn.className = btn.className.replace('bg-white/5','bg-green-500/10').replace('border-white/5','border-green-500/30').replace('text-slate-300','text-green-400');
          else if (bIdx === Number(selected)) btn.className = btn.className.replace('bg-white/5','bg-red-500/10').replace('border-white/5','border-red-500/30').replace('text-slate-300','text-red-400');
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert('Please answer all questions before submitting.'); return; }
      this.style.display = 'none';
      const result = document.createElement('div');
      result.className = 'text-sm font-bold text-brand mt-2';
      result.textContent = 'Score: ' + correct + ' / ' + questions.length + ' correct answers!';
      this.parentNode.appendChild(result);
      try {
        window.parent.postMessage({ type: 'KVJ_ACTIVITY_RESULT', score: correct, maxScore: questions.length }, '*');
      } catch (e) {
        console.error('Failed to post activity result:', e);
      }
    ">Submit Answers</button>
  </div>
</div>`;
    }

    case "borderedtext":
      return `<div class="my-6 p-6 rounded-r-2xl text-left borderedtext-block">${b.title ? `<h4 class="font-bold text-sm mb-1.5 borderedtext-title">${escHtml(b.title.trim())}</h4>` : ""}<p class="text-sm leading-relaxed mb-0 borderedtext-content">${escHtml((b.text || "").trim())}</p></div>`;

    default:
      return "";
  }
}

// ─── Escape helpers ───────────────────────────────────────────────────────────

function escHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escAttr(str: string): string {
  return escHtml(str);
}
