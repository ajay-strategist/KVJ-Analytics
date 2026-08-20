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
  { type: "assessment",  label: "Inline Assessment", description: "Inline multiple-choice quiz",    category: "interactive", icon: "✅" },
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
      return { id, type, text: "", textColor: "", bgColor: "", fontSize: "normal", align: "left" };
    case "subheading":
      return { id, type, text: "", textColor: "", bgColor: "", fontSize: "normal", align: "left" };
    case "paragraph":
      return { id, type, text: "", textColor: "", bgColor: "", fontSize: "normal", align: "left" };
    case "image":
      return { id, type, url: "", caption: "" };
    case "video":
      return { id, type, url: "", caption: "", height: "medium" };
    case "divider":
      return { id, type, label: "" };
    case "callout":
      return { id, type, title: "", points: [""] };
    case "list":
      return { id, type, title: "", points: [""], textColor: "", bgColor: "", fontSize: "normal", align: "left" };
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
        title: "Knowledge Check",
        testId: "",
        showAnswers: false,
        isInline: true,
      };
    case "borderedtext":
      return { id, type, title: "", text: "", bgColor: "#F4F9FD", accentColor: "#0E7490", label: "KEY CONCEPT" };
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

// ─── Shared Block Style Helper ────────────────────────────────────────────────

const FONT_SIZE_MAP: Record<string, string> = {
  xs:     "0.75rem",
  sm:     "0.875rem",
  normal: "",
  lg:     "1.125rem",
  xl:     "1.25rem",
  "2xl":  "1.5rem",
};

/**
 * Builds an inline style string for a block's shared style fields.
 * All values use !important to ensure they override Tailwind utility classes.
 */
function buildBlockStyle(b: BlockData, extra: string[] = []): string {
  const parts: string[] = [];
  if (b.bgColor)    parts.push(`background-color: ${b.bgColor} !important;`);
  if (b.textColor)  parts.push(`color: ${b.textColor} !important;`);
  if (b.fontSize && FONT_SIZE_MAP[b.fontSize]) {
    parts.push(`font-size: ${FONT_SIZE_MAP[b.fontSize]} !important;`);
  }
  if (b.align && b.align !== "left") parts.push(`text-align: ${b.align} !important;`);
  return [...parts, ...extra].filter(Boolean).join(" ");
}

function renderBlock(b: BlockData): string {
  switch (b.type) {
    case "heading": {
      const hStyle = buildBlockStyle(b, [
        b.textColor ? "" : `color: #10233F !important;`,
      ]);
      const hWrapStyle = b.bgColor ? `background-color: ${b.bgColor} !important; padding: 1rem 1.5rem; border-radius: 0.75rem;` : "";
      return `<div class="mt-12 mb-6" data-kvj-styled="true" style="text-align: ${b.align || 'left'}; ${hWrapStyle}">
  <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight m-0 leading-tight" data-kvj-styled="true" style="${hStyle}">${escHtml(b.text)}</h2>
</div>`;
    }

    case "subheading": {
      const shStyle = buildBlockStyle(b, [
        b.textColor ? "" : `color: #10233F !important;`,
      ]);
      const shWrapStyle = b.bgColor ? `background-color: ${b.bgColor} !important; padding: 0.75rem 1rem; border-radius: 0.5rem;` : "";
      return `<div class="mt-8 mb-4" data-kvj-styled="true" style="text-align: ${b.align || 'left'}; ${shWrapStyle}">
  <h3 class="text-lg md:text-xl font-bold m-0 tracking-tight" data-kvj-styled="true" style="${shStyle}">${escHtml(b.text)}</h3>
</div>`;
    }

    case "paragraph": {
      const pStyle = buildBlockStyle(b, [
        b.textColor ? "" : `color: #132238 !important;`,
      ]);
      return `<div class="leading-[1.8] font-light mb-6 tracking-wide max-w-none" data-kvj-styled="true" style="${pStyle}; text-align: ${b.align || 'left'};">${b.text || ""}</div>`;
    }

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
      const bgColor = b.bgColor || "#F4F9FD";
      const borderColor = b.borderColor || "#DCE5E8";
      const accentColor = b.accentColor || "#526477";
      const textColor = b.textColor || "#132238";
      const leftAccent = b.leftAccent !== false; // Default true
      
      const borderThickness = b.borderThickness || "1px";
      const borderRadius = b.borderRadius || "16px";
      const borderStyle = b.borderStyle || "solid";

      const align = b.align || "left";
      
      const wrapperStyle = [
        `background-color: ${bgColor} !important;`,
        `border: ${borderThickness} ${borderStyle} ${borderColor} !important;`,
        leftAccent ? `border-left: 4px solid ${accentColor} !important;` : '',
        `border-radius: ${borderRadius} !important;`,
        `text-align: ${align} !important;`,
      ].filter(Boolean).join(' ');

      const titleStyle = [
        `color: ${accentColor} !important;`,
        b.fontSize === 'sm' ? 'font-size: 0.875rem !important;' : b.fontSize === 'lg' ? 'font-size: 1.125rem !important;' : '',
        b.bold ? 'font-weight: bold !important;' : '',
        b.italic ? 'font-style: italic !important;' : '',
        b.underline ? 'text-decoration: underline !important;' : '',
      ].filter(Boolean).join(' ');

      const pts = (b.points || [])
        .map((p: string) => {
          const itemStyle = [
            `color: ${textColor} !important;`,
            b.fontSize === 'sm' ? 'font-size: 0.75rem !important;' : b.fontSize === 'lg' ? 'font-size: 0.95rem !important;' : 'font-size: 0.875rem !important;',
            b.bold ? 'font-weight: bold !important;' : '',
            b.italic ? 'font-style: italic !important;' : '',
            b.underline ? 'text-decoration: underline !important;' : '',
          ].filter(Boolean).join(' ');
          
          return `    <li class="flex items-start gap-2.5 text-sm leading-relaxed" data-kvj-styled="true" style="${itemStyle}">
      <span class="w-1.5 h-1.5 rounded-full shrink-0 mt-2" data-kvj-styled="true" style="background-color: ${accentColor}"></span>
      <span data-kvj-styled="true">${escHtml(p)}</span>
    </li>`;
        })
        .join("\n");

      return `<div class="my-6 p-6 text-left shadow-[0_4px_15px_rgba(16,35,63,0.01)]" data-kvj-styled="true" style="${wrapperStyle}">
  ${b.title ? `<h4 class="font-bold text-sm mb-3 mt-0" data-kvj-styled="true" style="${titleStyle}">${escHtml(b.title)}</h4>` : ''}
  <ul class="space-y-2.5" data-kvj-styled="true">
${pts}
  </ul>
</div>`;
    }

    case "list": {
      const listTextColor  = b.textColor  || "#132238";
      const listBgColor    = b.bgColor    || "";
      const listAlign      = b.align      || "left";
      const listFontSize   = FONT_SIZE_MAP[b.fontSize || "normal"] || "1rem";
      const listWrapStyle  = [
        listBgColor ? `background-color: ${listBgColor} !important;` : "",
        `text-align: ${listAlign} !important;`,
      ].filter(Boolean).join(" ");
      const pts = (b.points || [])
        .map((p: string) => `    <li class="flex items-start gap-3 leading-relaxed" data-kvj-styled="true" style="color: ${listTextColor} !important; font-size: ${listFontSize} !important;">
      <span class="text-[#08A88A] shrink-0 mt-1.5 text-[10px] select-none">◆</span>
      <span>${escHtml(p)}</span>
    </li>`)
        .join("\n");
      return `<div class="my-6 ${listBgColor ? 'p-5 rounded-xl' : ''} space-y-4" data-kvj-styled="true" style="${listWrapStyle}">
  ${b.title ? `<h4 class="font-bold text-base tracking-tight mb-3 mt-0" data-kvj-styled="true" style="color: ${listTextColor} !important;">${escHtml(b.title)}</h4>` : ""}
  <ul class="space-y-3 pl-1">
${pts}
  </ul>
</div>`;
    }

    case "infographics": {
      const cards = (b.cards || [])
        .map((c: any) => {
          const cardStyle = [
            c.bgColor ? `background-color: ${c.bgColor} !important;` : '',
            c.borderColor ? `border-color: ${c.borderColor} !important;` : '',
            c.align ? `text-align: ${c.align} !important;` : '',
          ].filter(Boolean).join(' ');

          const numStyle = [
            c.numberColor ? `color: ${c.numberColor} !important;` : '',
            c.accentColor ? `background-color: ${c.accentColor}22 !important; border-color: ${c.accentColor}44 !important; color: ${c.accentColor} !important;` : '',
          ].filter(Boolean).join(' ');

          const titleStyle = [
            c.titleColor ? `color: ${c.titleColor} !important;` : '',
            c.fontSize === 'sm' ? 'font-size: 0.875rem !important;' : c.fontSize === 'lg' ? 'font-size: 1.125rem !important;' : '',
            c.bold ? 'font-weight: bold !important;' : '',
            c.italic ? 'font-style: italic !important;' : '',
            c.underline ? 'text-decoration: underline !important;' : '',
          ].filter(Boolean).join(' ');

          const descStyle = [
            c.textColor ? `color: ${c.textColor} !important;` : '',
            c.fontSize === 'sm' ? 'font-size: 0.75rem !important;' : c.fontSize === 'lg' ? 'font-size: 0.95rem !important;' : '',
            c.italic ? 'font-style: italic !important;' : '',
          ].filter(Boolean).join(' ');

          return `  <div class="relative bg-white border border-[#DCE5E8] rounded-2xl p-6 overflow-hidden transition-all duration-300 shadow-[0_4px_15px_rgba(16,35,63,0.01)] text-left" data-kvj-styled="true" style="${cardStyle}">
    <div class="absolute top-0 right-0 w-24 h-24 bg-[#F0FBF7] rounded-full blur-xl transition-all duration-300"></div>
    <div class="w-10 h-10 rounded-xl bg-[#F0FBF7] border border-[#DDF8F0] flex items-center justify-center mb-4 text-[#08A88A] text-sm font-extrabold shadow-sm" data-kvj-styled="true" style="${numStyle}">${escHtml(c.number)}</div>
    <h4 class="text-[#10233F] font-bold text-sm mb-2 transition-colors leading-snug mt-0" data-kvj-styled="true" style="${titleStyle}">${escHtml(c.title)}</h4>
    <p class="text-[#526477] text-xs leading-relaxed mb-0" data-kvj-styled="true" style="${descStyle}">${escHtml(c.desc)}</p>
  </div>`;
        })
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

      // Admin-configurable colors with sensible defaults
      const headerBg    = b.headerBgColor   || "#F4F9FD";
      const headerText  = b.headerTextColor || "#10233F";
      const tableBorder = b.borderColor     || "#DCE5E8";
      const evenRowBg   = b.evenRowBgColor  || "";

      const thCells = headers
        .map((h: string) => `      <th data-kvj-styled="true" style="background-color:${headerBg};color:${headerText};border-right:1px solid ${tableBorder};" class="px-4 py-3 text-xs font-bold uppercase tracking-wider last:border-r-0">${escHtml(h)}</th>`)
        .join("\n");
      const trRows = rows
        .map((row: string[], rIdx: number) => {
          const rowBg = evenRowBg && rIdx % 2 === 1 ? `background-color:${evenRowBg};` : "";
          const tds = row
            .map((cell: string) => `      <td data-kvj-styled="true" style="border-right:1px solid ${tableBorder}60;" class="px-4 py-3 text-sm text-[#132238] last:border-r-0">${escHtml(cell)}</td>`)
            .join("\n");
          return `    <tr data-kvj-styled="true" style="border-bottom:1px solid ${tableBorder}65;${rowBg}" class="hover:bg-slate-50/50 transition-colors">\n${tds}\n    </tr>`;
        })
        .join("\n");
      return `<div class="mt-4 mb-8 overflow-x-auto rounded-xl shadow-[0_4px_15px_rgba(16,35,63,0.01)] bg-white" data-kvj-styled="true" style="border:1px solid ${tableBorder};">
  <table class="w-full text-sm text-left border-collapse" data-kvj-styled="true">
    <thead style="border-bottom:1px solid ${tableBorder};" data-kvj-styled="true">
      <tr data-kvj-styled="true">
${thCells}
      </tr>
    </thead>
    <tbody data-kvj-styled="true">
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
      return `<div class="kvj-assessment-placeholder my-8" data-test-id="${b.testId || ""}" data-title="${escAttr(b.title || "Assessment")}" data-show-answers="${b.showAnswers ? "true" : "false"}" data-is-inline="${b.isInline ? "true" : "false"}"></div>`;
    }

    case "borderedtext": {
      const btBg     = b.bgColor      || "#F4F9FD";
      const btBorder = b.accentColor  || "#0E7490";
      const btLabel  = b.label        || "KEY CONCEPT";
      const btTextColor = b.textColor || "#526477";
      const btAlign  = b.align        || "left";
      const btFontSz = FONT_SIZE_MAP[b.fontSize || "normal"] || "0.875rem";
      // Preserve line breaks
      const btLines  = (b.text || "").split("\n");
      const btHtml   = btLines
        .map((line: string) =>
          line.trim() === ""
            ? `<p class="mb-2">&nbsp;</p>`
            : `<p class="leading-relaxed mb-2" style="color: ${btTextColor} !important; font-size: ${btFontSz} !important;">${escHtml(line)}</p>`
        )
        .join("");
      // Use all-inline styles to avoid Tailwind specificity overrides
      const btWrapStyle = [
        `background-color: ${btBg} !important;`,
        `border: 1px solid #DCE5E8 !important;`,
        `border-left: 4px solid ${btBorder} !important;`,
        `border-radius: 0 1rem 1rem 0 !important;`,
        `padding: 1.5rem !important;`,
        `text-align: ${btAlign} !important;`,
        `box-shadow: 0 4px 15px rgba(16,35,63,0.03) !important;`,
      ].join(" ");
      return `<div class="my-6" data-kvj-styled="true" style="${btWrapStyle}">
  <div class="text-[10px] font-extrabold uppercase tracking-widest mb-2" data-kvj-styled="true" style="color: ${btBorder} !important;">${escHtml(btLabel)}</div>
  ${b.title ? `<h4 class="font-bold mb-1.5 mt-0 leading-tight" data-kvj-styled="true" style="color: #10233F; font-size: ${btFontSz};">${escHtml(b.title.trim())}</h4>` : ""}
  <div data-kvj-styled="true">${btHtml}</div>
</div>`;
    }

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
