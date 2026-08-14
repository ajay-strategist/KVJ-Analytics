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
      return `<div class="mt-12 mb-6 text-left">
  <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#08A88A] block mb-1">MODULE SECTION</span>
  <h2 class="text-2xl md:text-3xl font-extrabold text-[#10233F] tracking-tight m-0 leading-tight">${escHtml(b.text)}</h2>
</div>`;

    case "subheading":
      return `<div class="mt-8 mb-4 flex items-center gap-2.5 text-left">
  <div class="w-1.5 h-5 bg-[#08A88A] rounded-full shrink-0"></div>
  <h3 class="text-lg md:text-xl font-bold text-[#10233F] m-0 tracking-tight">${escHtml(b.text)}</h3>
</div>`;

    case "paragraph":
      return `<p class="text-[#132238] text-[17px] md:text-[18px] leading-[1.8] font-light mb-6 tracking-wide text-left max-w-none">${escHtml(b.text)}</p>`;

    case "image":
      return `<figure class="my-8 text-center max-w-full">
  <div class="rounded-2xl overflow-hidden border border-[#DCE5E8] shadow-[0_8px_30px_rgba(16,35,63,0.03)] bg-white p-2">
    <img src="${b.url}" alt="${escAttr(b.caption || "Image")}" class="rounded-xl max-w-full mx-auto object-contain" />
  </div>
  ${b.caption ? `<figcaption class="text-xs text-[#7B8A99] mt-3 font-semibold font-sans tracking-wide uppercase">${escHtml(b.caption)}</figcaption>` : ""}
</figure>`;

    case "video": {
      const embedUrl = convertToEmbedUrl(b.url || "");
      const heights: Record<string, string> = { small: "250px", medium: "400px", large: "560px" };
      const h = heights[b.height || "medium"] || "400px";
      return embedUrl
        ? `<figure class="my-8">
  <div class="relative w-full rounded-2xl overflow-hidden border border-[#DCE5E8] shadow-[0_8px_30px_rgba(16,35,63,0.03)] bg-black" style="height:${h}">
    <iframe src="${embedUrl}" class="absolute inset-0 w-full h-full" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture"></iframe>
  </div>
  ${b.caption ? `<figcaption class="text-xs text-center text-[#7B8A99] mt-3 font-semibold tracking-wide uppercase">${escHtml(b.caption)}</figcaption>` : ""}
</figure>`
        : `<div class="my-8 p-6 border border-dashed border-[#DCE5E8] rounded-2xl text-center text-slate-400 text-sm">No video URL configured.</div>`;
    }

    case "divider":
      return b.label
        ? `<div class="my-8 flex items-center gap-4">
  <div class="flex-1 h-px bg-[#DCE5E8]"></div>
  <span class="text-[10px] text-[#7B8A99] font-extrabold uppercase tracking-widest">${escHtml(b.label)}</span>
  <div class="flex-1 h-px bg-[#DCE5E8]"></div>
</div>`
        : `<div class="my-8 h-px bg-[#DCE5E8]"></div>`;

    case "callout": {
      let bgColor = "#F4F9FD";
      let borderColor = "#DCE5E8";
      let accentColor = "#526477";
      let icon = "📝";
      let label = "Note";

      const lowerTitle = (b.title || "").toLowerCase();
      if (lowerTitle.includes("tip")) {
        bgColor = "#F0FBF7";
        borderColor = "#DDF8F0";
        accentColor = "#08A88A";
        icon = "💡";
        label = "Tip";
      } else if (lowerTitle.includes("important") || lowerTitle.includes("remember") || lowerTitle.includes("key")) {
        bgColor = "#FFF7E6";
        borderColor = "#FFE3A8";
        accentColor = "#D97706";
        icon = "⚠️";
        label = "Important";
      } else if (lowerTitle.includes("info")) {
        bgColor = "#EAF6FF";
        borderColor = "#D2ECFF";
        accentColor = "#0E7490";
        icon = "ℹ️";
        label = "Information";
      } else if (lowerTitle.includes("warning") || lowerTitle.includes("danger") || lowerTitle.includes("caution")) {
        bgColor = "#FFF2F4";
        borderColor = "#FFE0E5";
        accentColor = "#E11D48";
        icon = "🚨";
        label = "Warning";
      } else if (lowerTitle.includes("success") || lowerTitle.includes("solved")) {
        bgColor = "#F0FBF7";
        borderColor = "#DDF8F0";
        accentColor = "#08A88A";
        icon = "✓";
        label = "Success";
      }

      const pts = (b.points || [])
        .map((p: string) => `    <li class="flex items-start gap-2.5 text-[#132238] text-sm leading-relaxed">
      <span class="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style="background-color: ${accentColor}"></span>
      <span>${escHtml(p)}</span>
    </li>`)
        .join("\n");
      return `<div class="my-6 border-l-4 p-6 rounded-r-2xl text-left shadow-[0_4px_15px_rgba(16,35,63,0.01)]" style="background-color: ${bgColor}; border-color: ${accentColor}">
  ${b.title ? `<h4 class="font-bold text-sm mb-3 mt-0" style="color: ${accentColor}">${escHtml(b.title)}</h4>` : `<div class="flex items-center gap-2 mb-3"><span class="text-sm">${icon}</span><span class="text-[10px] font-extrabold uppercase tracking-widest" style="color: ${accentColor}">${label}</span></div>`}
  <ul class="space-y-2.5">
${pts}
  </ul>
</div>`;
    }

    case "list": {
      const pts = (b.points || [])
        .map((p: string) => `    <li class="flex items-start gap-3 text-[#132238] text-base leading-relaxed">
      <span class="text-[#08A88A] shrink-0 mt-1.5 text-[10px] select-none">◆</span>
      <span>${escHtml(p)}</span>
    </li>`)
        .join("\n");
      return `<div class="my-6 text-left space-y-4">
  ${b.title ? `<h4 class="text-[#10233F] font-bold text-base tracking-tight mb-3 mt-0">${escHtml(b.title)}</h4>` : ""}
  <ul class="space-y-3 pl-1">
${pts}
  </ul>
</div>`;
    }

    case "infographics": {
      const cards = (b.cards || [])
        .map((c: any) => `  <div class="relative bg-white border border-[#DCE5E8] rounded-2xl p-6 overflow-hidden group hover:border-[#08A88A]/50 transition-all duration-300 shadow-[0_4px_15px_rgba(16,35,63,0.01)] hover:shadow-[0_8px_30px_rgba(16,35,63,0.03)] text-left">
    <div class="absolute top-0 right-0 w-24 h-24 bg-[#F0FBF7] rounded-full blur-xl group-hover:bg-[#DDF8F0] transition-all duration-300"></div>
    <div class="w-10 h-10 rounded-xl bg-[#F0FBF7] border border-[#DDF8F0] flex items-center justify-center mb-4 text-[#08A88A] text-sm font-extrabold shadow-sm">${escHtml(c.number)}</div>
    <h4 class="text-[#10233F] font-bold text-sm mb-2 group-hover:text-[#08A88A] transition-colors leading-snug mt-0">${escHtml(c.title)}</h4>
    <p class="text-[#526477] text-xs leading-relaxed mb-0">${escHtml(c.desc)}</p>
  </div>`)
        .join("\n");
      return `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
${cards}
</div>`;
    }

    case "smartarts": {
      if (b.layout === "pillars") {
        const pillars = (b.pillars || [])
          .map((p: any) => `    <div class="p-6 space-y-2 text-left">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-[#08A88A]"></div>
        <span class="text-[10px] uppercase tracking-wider text-[#7B8A99] font-bold">${escHtml(p.badge)}</span>
      </div>
      <h4 class="text-[#10233F] font-bold text-sm mt-0 leading-tight">${escHtml(p.title)}</h4>
      <p class="text-[#526477] text-xs leading-relaxed mb-0">${escHtml(p.desc)}</p>
    </div>`)
          .join("\n");
        return `<div class="my-8 border border-[#DCE5E8] rounded-2xl overflow-hidden bg-white shadow-[0_4px_15px_rgba(16,35,63,0.01)]">
  <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#DCE5E8]">
${pillars}
  </div>
</div>`;
      }
      if (b.layout === "timeline") {
        const steps = (b.steps || [])
          .map((s: any, idx: number) => `  <div class="flex items-start gap-4 text-left">
    <div class="flex flex-col items-center shrink-0">
      <div class="w-7 h-7 rounded-full bg-[#08A88A] text-white font-bold flex items-center justify-center text-xs shadow-sm">${escHtml(s.step)}</div>
      ${idx < (b.steps || []).length - 1 ? `<div class="w-0.5 h-16 bg-[#DDF8F0]"></div>` : ""}
    </div>
    <div>
      <h4 class="text-[#10233F] font-bold text-sm mb-1 mt-0.5 leading-tight">${escHtml(s.title)}</h4>
      <p class="text-[#526477] text-xs leading-relaxed mb-0">${escHtml(s.desc)}</p>
    </div>
  </div>`)
          .join("\n");
        return `<div class="space-y-6 my-8 bg-white border border-[#DCE5E8] p-6 rounded-2xl shadow-[0_4px_15px_rgba(16,35,63,0.01)]">
${steps}
</div>`;
      }
      if (b.layout === "comparison") {
        const left = (b.comparison || [])[0] || { category: "Option A", title: "", points: [] };
        const right = (b.comparison || [])[1] || { category: "Option B", title: "", points: [] };
        const lPts = (left.points || []).map((p: string) => `      <li class="flex items-start gap-2"><span class="text-[#E11D48] select-none">•</span><span>${escHtml(p)}</span></li>`).join("\n");
        const rPts = (right.points || []).map((p: string) => `      <li class="flex items-start gap-2"><span class="text-[#08A88A] select-none">•</span><span>${escHtml(p)}</span></li>`).join("\n");
        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 text-left">
  <div class="border border-[#FFE0E5] bg-[#FFF2F4]/30 p-6 rounded-2xl space-y-3">
    <div class="px-2.5 py-0.5 rounded bg-[#FFF2F4] text-[#E11D48] text-[9px] font-extrabold uppercase tracking-widest w-fit">${escHtml(left.category)}</div>
    <h4 class="text-[#10233F] font-bold text-sm mt-0 leading-tight">${escHtml(left.title)}</h4>
    <ul class="text-xs text-[#526477] space-y-2 pl-1">
${lPts}
    </ul>
  </div>
  <div class="border border-[#DDF8F0] bg-[#F0FBF7]/30 p-6 rounded-2xl space-y-3">
    <div class="px-2.5 py-0.5 rounded bg-[#DDF8F0] text-[#08A88A] text-[9px] font-extrabold uppercase tracking-widest w-fit">${escHtml(right.category)}</div>
    <h4 class="text-[#10233F] font-bold text-sm mt-0 leading-tight">${escHtml(right.title)}</h4>
    <ul class="text-xs text-[#526477] space-y-2 pl-1">
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
        .map((h: string) => `      <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#10233F] border-r border-[#DCE5E8] last:border-r-0">${escHtml(h)}</th>`)
        .join("\n");
      const trRows = rows
        .map((row: string[]) => {
          const tds = row
            .map((cell: string) => `      <td class="px-4 py-3 text-sm text-[#132238] border-r border-[#DCE5E8]/60 last:border-r-0">${escHtml(cell)}</td>`)
            .join("\n");
          return `    <tr class="border-b border-[#DCE5E8]/65 hover:bg-slate-50/50 transition-colors">\n${tds}\n    </tr>`;
        })
        .join("\n");
      return `<div class="my-8 overflow-x-auto rounded-xl border border-[#DCE5E8] shadow-[0_4px_15px_rgba(16,35,63,0.01)] bg-white">
  <table class="w-full text-sm text-left border-collapse">
    <thead class="bg-[#F4F9FD] border-b border-[#DCE5E8]">
      <tr>
${thCells}
      </tr>
    </thead>
    <tbody class="divide-y divide-[#DCE5E8]/65">
${trRows}
    </tbody>
  </table>
</div>`;
    }

    case "html":
      return `<div class="my-6 text-left leading-[1.8] text-[#132238] font-body">${b.html || ""}</div>`;

    case "activity":
      return `<div class="my-8 p-6 border border-[#DCE5E8] border-t-4 border-t-[#0E7490] bg-[#F4F9FD] rounded-2xl text-left space-y-4 shadow-[0_4px_15px_rgba(16,35,63,0.01)]">
  <div class="flex items-center gap-2">
    <span class="text-sm">⚡</span>
    <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#0E7490]">INTERACTIVE ACTIVITY</span>
  </div>
  <h4 class="text-[#10233F] font-bold text-base m-0 leading-tight">${escHtml(b.title || "Try It Yourself")}</h4>
  <p class="text-[#526477] text-sm leading-relaxed max-w-none">${escHtml(b.desc || "Complete this interactive activity below.")}</p>
  ${b.url ? `<div class="rounded-xl overflow-hidden border border-[#DCE5E8] shadow-sm bg-white"><iframe src="${b.url}" class="w-full h-[450px] bg-white border-0" allow="autoplay; fullscreen"></iframe></div>` : `<div class="p-8 border border-dashed border-[#DCE5E8] rounded-xl text-center text-slate-400 text-sm">No activity source URL configured.</div>`}
</div>`;

    case "assessment": {
      const questionsJson = JSON.stringify(b.questions || []).replace(/"/g, "&quot;");
      const blockId = `quiz-${Math.random().toString(36).substring(2, 9)}`;
      const qHtml = (b.questions || [])
        .map((q: any, qIdx: number) => {
          const optHtml = (q.options || [])
            .map((opt: string, optIdx: number) => `        <button type="button" class="w-full text-left px-4 py-3 rounded-xl border border-[#DCE5E8] bg-white hover:bg-slate-50 text-[#132238] text-xs font-semibold transition-all flex items-center justify-between group cursor-pointer" data-optidx="${optIdx}" onclick="
          const parent = this.closest('[data-qidx]');
          parent.querySelectorAll('button').forEach(btn => {
            btn.className = btn.className.replace(' border-[#08A88A] bg-[#F0FBF7] text-[#10233F]', ' border-[#DCE5E8] bg-white text-[#132238]');
            btn.querySelector('.check-indicator').className = 'check-indicator w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-bold text-transparent';
          });
          this.className = this.className.replace(' border-[#DCE5E8] bg-white text-[#132238]', ' border-[#08A88A] bg-[#F0FBF7] text-[#10233F]');
          this.querySelector('.check-indicator').className = 'check-indicator w-4 h-4 rounded-full border border-[#08A88A] bg-[#08A88A] flex items-center justify-center text-[10px] font-bold text-white';
          parent.setAttribute('data-selected', '${optIdx}');
        ">
          <span>${escHtml(opt)}</span>
          <span class="check-indicator w-4 h-4 rounded-full border border-slate-200 flex items-center justify-center text-[10px] font-bold text-transparent group-hover:border-[#08A88A]/40 transition-colors">✓</span>
        </button>`)
            .join("\n");
          return `    <div class="space-y-3" data-qidx="${qIdx}">
      <p class="text-[#10233F] text-sm font-bold leading-normal m-0">${qIdx + 1}. ${escHtml(q.text)}</p>
      <div class="grid grid-cols-1 gap-3">
${optHtml}
      </div>
    </div>`;
        })
        .join("\n");
      return `<div class="my-8 p-6 bg-white border border-[#DCE5E8] rounded-2xl text-left space-y-6 shadow-[0_4px_15px_rgba(16,35,63,0.01)]" id="${blockId}" data-questions="${questionsJson}">
  <div class="flex items-center justify-between border-b border-[#DCE5E8] pb-3">
    <h4 class="text-[#10233F] font-bold text-base flex items-center gap-2 m-0 leading-none">
      <span class="w-2.5 h-2.5 rounded-full bg-[#08A88A]"></span>
      ${escHtml(b.title || "Quick Knowledge Check")}
    </h4>
    <span class="text-xs text-[#7B8A99] font-mono">${(b.questions || []).length} Questions</span>
  </div>
  <div class="space-y-6">
${qHtml}
  </div>
  <div class="pt-4 border-t border-[#DCE5E8] flex items-center justify-between">
    <button type="button" class="px-5 py-2.5 bg-[#08A88A] hover:bg-[#06957A] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer" onclick="
      const quiz = this.closest('#${blockId}');
      const questions = JSON.parse(quiz.getAttribute('data-questions') || '[]');
      let correct = 0; let answeredAll = true;
      quiz.querySelectorAll('[data-qidx]').forEach((qEl, idx) => {
        const selected = qEl.getAttribute('data-selected');
        if (selected === null) { answeredAll = false; return; }
        const correctOpt = questions[idx] ? questions[idx].correct : '0';
        const buttons = qEl.querySelectorAll('button');
        buttons.forEach((btn, bIdx) => {
          btn.disabled = true;
          btn.className = btn.className.replace('cursor-pointer', 'cursor-not-allowed');
          if (bIdx === Number(correctOpt)) {
            btn.className = btn.className.replace('border-[#DCE5E8] bg-white','border-[#08A88A] bg-[#F0FBF7]').replace('border-[#08A88A] bg-[#F0FBF7]','border-green-500 bg-[#E8F8F0]');
            btn.querySelector('.check-indicator').className = 'check-indicator w-4 h-4 rounded-full border border-green-500 bg-green-500 flex items-center justify-center text-[10px] font-bold text-white';
          } else if (bIdx === Number(selected)) {
            btn.className = btn.className.replace('border-[#DCE5E8] bg-white','border-red-500 bg-[#FFF2F4]').replace('border-[#08A88A] bg-[#F0FBF7]','border-red-500 bg-[#FFF2F4]');
            btn.querySelector('.check-indicator').className = 'check-indicator w-4 h-4 rounded-full border border-red-500 bg-red-500 flex items-center justify-center text-[10px] font-bold text-white';
          }
        });
        if (Number(selected) === Number(correctOpt)) correct++;
      });
      if (!answeredAll) { alert('Please answer all questions before submitting.'); return; }
      this.style.display = 'none';
      const result = document.createElement('div');
      result.className = 'text-sm font-bold text-[#08A88A] mt-2 flex items-center gap-1.5';
      result.innerHTML = '<span>🎉</span><span>Quiz Submitted. Score: ' + correct + ' / ' + questions.length + ' correct answers!</span>';
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
      return `<div class="my-6 border border-[#DCE5E8] border-l-4 border-l-[#0E7490] bg-[#F4F9FD] p-6 rounded-r-2xl text-left shadow-[0_4px_15px_rgba(16,35,63,0.01)]">
  <div class="text-[10px] font-extrabold uppercase tracking-widest text-[#0E7490] mb-2">KEY CONCEPT</div>
  ${b.title ? `<h4 class="font-bold text-sm text-[#10233F] mb-1.5 mt-0 leading-tight">${escHtml(b.title.trim())}</h4>` : ""}
  <p class="text-sm text-[#526477] leading-relaxed mb-0">${escHtml((b.text || "").trim())}</p>
</div>`;

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
