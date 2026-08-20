export interface ContentBlock {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
}

export const BLOG_BLOCKS: ContentBlock[] = [
  {
    id: "layout_2col",
    name: "2-Column Layout",
    category: "Layouts",
    description: "Responsive 2-column side-by-side layout grid.",
    template: `<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
  <div class="space-y-4">
    <h3 class="text-xl font-bold text-white">Left Column Heading</h3>
    <p class="text-slate-350">Add content here. This column is fully responsive and adjusts automatically.</p>
  </div>
  <div class="space-y-4">
    <h3 class="text-xl font-bold text-white">Right Column Heading</h3>
    <p class="text-slate-350">Add content here. Ideal for text + image pairing or side-by-side metrics.</p>
  </div>
</div>`
  },
  {
    id: "layout_3col",
    name: "3-Column Layout",
    category: "Layouts",
    description: "Responsive 3-column feature grid.",
    template: `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
  <div class="p-5 bg-card border border-white/5 rounded-2xl">
    <h4 class="text-lg font-bold text-white mb-2">Column 1</h4>
    <p class="text-sm text-slate-350">Description or detail text goes here.</p>
  </div>
  <div class="p-5 bg-card border border-white/5 rounded-2xl">
    <h4 class="text-lg font-bold text-white mb-2">Column 2</h4>
    <p class="text-sm text-slate-350">Description or detail text goes here.</p>
  </div>
  <div class="p-5 bg-card border border-white/5 rounded-2xl">
    <h4 class="text-lg font-bold text-white mb-2">Column 3</h4>
    <p class="text-sm text-slate-350">Description or detail text goes here.</p>
  </div>
</div>`
  },
  {
    id: "callout_info",
    name: "Info Callout",
    category: "Alerts & Callouts",
    description: "Informational callout box with blue styling.",
    template: `<div class="flex items-start gap-4 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl my-6 text-left">
  <div class="p-2 bg-blue-500/20 rounded-xl text-blue-400 shrink-0">
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
  <div>
    <h4 class="font-bold text-white text-sm mb-1">Important Information</h4>
    <p class="text-sm text-blue-100/80 leading-relaxed">Here is key background details to keep in mind regarding this methodology.</p>
  </div>
</div>`
  },
  {
    id: "callout_warning",
    name: "Warning Callout",
    category: "Alerts & Callouts",
    description: "Warning callout box with amber styling.",
    template: `<div class="flex items-start gap-4 p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl my-6 text-left">
  <div class="p-2 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  </div>
  <div>
    <h4 class="font-bold text-white text-sm mb-1">Attention Required</h4>
    <p class="text-sm text-amber-100/80 leading-relaxed">Be careful when applying these settings, as it may break backward compatibility.</p>
  </div>
</div>`
  },
  {
    id: "callout_success",
    name: "Success Callout",
    category: "Alerts & Callouts",
    description: "Success callout box with emerald styling.",
    template: `<div class="flex items-start gap-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl my-6 text-left">
  <div class="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
  <div>
    <h4 class="font-bold text-white text-sm mb-1">Pro Tip / Best Practice</h4>
    <p class="text-sm text-emerald-100/80 leading-relaxed">Successfully applying this flow will reduce execution times by up to 90%.</p>
  </div>
</div>`
  },
  {
    id: "callout_tip",
    name: "Highlight Tip Box",
    category: "Alerts & Callouts",
    description: "Special neon cyan brand styled tip box.",
    template: `<div class="flex items-start gap-4 p-5 bg-brand/5 border border-brand/20 rounded-2xl my-6 text-left relative overflow-hidden">
  <div class="absolute top-0 left-0 w-1 h-full bg-brand"></div>
  <div class="p-2 bg-brand/10 rounded-xl text-brand shrink-0">
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  </div>
  <div>
    <h4 class="font-bold text-white text-sm mb-1">Interactive Spotlight</h4>
    <p class="text-sm text-[#E5E7EB] leading-relaxed">You can customize this template snippet in the editor. Perfect for key takeaways.</p>
  </div>
</div>`
  },
  {
    id: "accordion_faq",
    name: "Interactive Accordion",
    category: "Interactive Blocks",
    description: "Collapsible details panel for FAQs and secondary content.",
    template: `<details class="group bg-card border border-white/5 rounded-2xl p-4 my-4 [&_summary::-webkit-details-marker]:hidden">
  <summary class="flex items-center justify-between cursor-pointer focus:outline-none">
    <span class="text-sm font-bold text-white">How does this automated script consolidate multiple excel folders?</span>
    <span class="p-1 bg-white/5 group-open:rotate-180 transition-transform rounded-lg text-slate-350">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </summary>
  <div class="mt-3 text-sm text-slate-350 leading-relaxed border-t border-white/5 pt-3">
    It reads all spreadsheets placed in the designated input folder, parses their schemas, verifies their integrity, aggregates the records, and writes the output workbook.
  </div>
</details>`
  },
  {
    id: "tabs_interactive",
    name: "Interactive Tabs",
    category: "Interactive Blocks",
    description: "Tab container switcher (HTML/JS sandboxed).",
    template: `<div class="bg-card border border-white/5 rounded-2xl overflow-hidden my-6">
  <div class="flex border-b border-white/5 bg-base/50 p-2 gap-2">
    <button onclick="switchTab(event, 'tab1')" class="tab-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-brand text-black font-semibold transition-all">Tab 1</button>
    <button onclick="switchTab(event, 'tab2')" class="tab-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-slate-350 hover:bg-white/5 transition-all">Tab 2</button>
  </div>
  <div id="tab1" class="tab-content p-6 text-sm text-slate-350 leading-relaxed">
    <h4 class="text-lg font-bold text-white mb-2">Tab Title 1</h4>
    <p>This is the content of the first tab. Great for explaining different approaches, tools or setups side-by-side.</p>
  </div>
  <div id="tab2" class="tab-content p-6 text-sm text-slate-350 leading-relaxed hidden">
    <h4 class="text-lg font-bold text-white mb-2">Tab Title 2</h4>
    <p>This is the content of the second tab. Fully isolated and behaves as a pure interactive element.</p>
  </div>
  <script>
    function switchTab(evt, tabId) {
      const container = evt.currentTarget.closest('.bg-card');
      container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-slate-350 hover:bg-white/5 transition-all";
      });
      evt.currentTarget.className = "tab-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-brand text-black font-semibold transition-all";
      
      container.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      container.querySelector('#' + tabId).classList.remove('hidden');
    }
  </script>
</div>`
  },
  {
    id: "timeline_vertical",
    name: "Interactive Timeline",
    category: "Interactive Blocks",
    description: "Vertical timeline tracing phases or workflow steps.",
    template: `<div class="space-y-6 my-8 pl-4 relative border-l border-white/10 text-left">
  <div class="relative">
    <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-brand rounded-full ring-4 ring-brand/10"></div>
    <div class="bg-card border border-white/5 p-4 rounded-xl">
      <span class="text-[10px] font-bold text-brand uppercase tracking-wider">Phase 1 — Discovery</span>
      <h4 class="text-sm font-bold text-white mt-1">Audit Existing Operations</h4>
      <p class="text-xs text-slate-350 mt-1">Identify Excel spreadsheets, manual copy-paste points, and formula dependencies.</p>
    </div>
  </div>
  <div class="relative">
    <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-brand rounded-full ring-4 ring-brand/10"></div>
    <div class="bg-card border border-white/5 p-4 rounded-xl">
      <span class="text-[10px] font-bold text-brand uppercase tracking-wider">Phase 2 — Implementation</span>
      <h4 class="text-sm font-bold text-white mt-1">Deploy Python/VBA Macro Scripts</h4>
      <p class="text-xs text-slate-350 mt-1">Build automatic folder ingestion pipelines and configure live API databases.</p>
    </div>
  </div>
  <div class="relative">
    <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-brand rounded-full ring-4 ring-brand/10"></div>
    <div class="bg-card border border-white/5 p-4 rounded-xl">
      <span class="text-[10px] font-bold text-brand uppercase tracking-wider">Phase 3 — Review</span>
      <h4 class="text-sm font-bold text-white mt-1">Handover & Testing</h4>
      <p class="text-xs text-slate-350 mt-1">Verify automated PDF scorecard outputs and train team users on dashboard utilities.</p>
    </div>
  </div>
</div>`
  },
  {
    id: "comparison_table",
    name: "Comparison Table",
    category: "Structured Data",
    description: "Premium formatted table comparing features/options.",
    template: `<div class="overflow-x-auto border border-white/5 rounded-2xl my-6 bg-card">
  <table class="w-full text-left text-sm border-collapse">
    <thead>
      <tr class="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-350">
        <th class="p-4 font-bold">Feature</th>
        <th class="p-4 font-bold">Manual Sheet Ingestion</th>
        <th class="p-4 font-bold text-brand">Automated Ingestion</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5 text-slate-350">
      <tr>
        <td class="p-4 text-white font-semibold">Processing Speed</td>
        <td class="p-4">2 Hours / Day</td>
        <td class="p-4 text-brand font-semibold">Instant (Under 5s)</td>
      </tr>
      <tr>
        <td class="p-4 text-white font-semibold">Human Errors</td>
        <td class="p-4">Frequent (Broken formulas)</td>
        <td class="p-4 text-emerald-400 font-semibold">0% (Strict schema checks)</td>
      </tr>
      <tr>
        <td class="p-4 text-white font-semibold">Live Dashboards</td>
        <td class="p-4">No (Only via email)</td>
        <td class="p-4 text-emerald-400 font-semibold">Yes (Real-time Power BI)</td>
      </tr>
    </tbody>
  </table>
</div>`
  },
  {
    id: "statistics_grid",
    name: "Statistic/Highlight Grid",
    category: "Structured Data",
    description: "Grid of metrics and key statistics.",
    template: `<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
  <div class="p-5 bg-card border border-white/5 rounded-2xl text-center">
    <div class="text-3xl font-extrabold text-brand font-display">95%</div>
    <div class="text-[10px] font-bold text-slate uppercase mt-1 tracking-wider">Time Saved</div>
  </div>
  <div class="p-5 bg-card border border-white/5 rounded-2xl text-center">
    <div class="text-3xl font-extrabold text-brand font-display">20+</div>
    <div class="text-[10px] font-bold text-slate uppercase mt-1 tracking-wider">Clients Served</div>
  </div>
  <div class="p-5 bg-card border border-white/5 rounded-2xl text-center">
    <div class="text-3xl font-extrabold text-brand font-display">0%</div>
    <div class="text-[10px] font-bold text-slate uppercase mt-1 tracking-wider">Error Rate</div>
  </div>
  <div class="p-5 bg-card border border-white/5 rounded-2xl text-center">
    <div class="text-3xl font-extrabold text-brand font-display">5+</div>
    <div class="text-[10px] font-bold text-slate uppercase mt-1 tracking-wider">Global Regions</div>
  </div>
</div>`
  },
  {
    id: "media_video",
    name: "YouTube Embed",
    category: "Media",
    description: "Responsive 16:9 embedded YouTube video frame.",
    template: `<div class="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 my-6 bg-black shadow-md">
  <iframe class="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`
  },
  {
    id: "media_pdf",
    name: "PDF Embed",
    category: "Media",
    description: "Responsive PDF reader/viewer embed block.",
    template: `<div class="w-full rounded-2xl overflow-hidden border border-white/10 my-6 bg-card shadow-md">
  <object data="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" type="application/pdf" class="w-full h-[500px]">
    <div class="p-6 text-center text-slate-350 text-sm">
      It seems your browser does not support embedded PDFs. 
      <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" class="text-brand hover:underline font-bold" target="_blank">Download the PDF instead</a>
    </div>
  </object>
</div>`
  },
  {
    id: "media_gallery",
    name: "Image Gallery",
    category: "Media",
    description: "Multi-image responsive grid layout gallery.",
    template: `<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
  <div class="overflow-hidden rounded-xl border border-white/5 bg-white/5 aspect-square">
    <img src="https://picsum.photos/400/400?random=1" alt="Gallery item" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
  </div>
  <div class="overflow-hidden rounded-xl border border-white/5 bg-white/5 aspect-square">
    <img src="https://picsum.photos/400/400?random=2" alt="Gallery item" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
  </div>
  <div class="overflow-hidden rounded-xl border border-white/5 bg-white/5 aspect-square">
    <img src="https://picsum.photos/400/400?random=3" alt="Gallery item" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
  </div>
</div>`
  },
  {
    id: "snippet_cta",
    name: "CTA Banner",
    category: "Promotional Snippets",
    description: "Call-to-action banner promoting consultations.",
    template: `<div class="bg-gradient-to-r from-brand/10 to-[#3A7BFF]/10 border border-brand/20 p-8 rounded-2xl text-center my-8 shadow-sm">
  <h4 class="text-xl font-bold text-white mb-2">Automate Your Operations Today</h4>
  <p class="text-sm text-slate-350 max-w-xl mx-auto mb-6">Talk to the KVJ Analytics experts and find out how we can save your team hours of report pipelines.</p>
  <a href="/contact" class="inline-flex items-center px-6 py-2.5 bg-brand hover:bg-[#16E6D8] text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all">Schedule Free Audit</a>
</div>`
  },
  {
    id: "snippet_newsletter",
    name: "Newsletter Signup",
    category: "Promotional Snippets",
    description: "Inline email newsletter subscription block.",
    template: `<div class="bg-card border border-white/5 p-6 rounded-2xl my-6 text-left relative overflow-hidden">
  <div class="absolute top-0 left-0 right-0 h-1 signature-gradient"></div>
  <h4 class="text-md font-bold text-white mb-1">Get Weekly Excel & Analytics Tips</h4>
  <p class="text-xs text-slate mt-1 mb-4">Join 2,000+ business leaders receiving spreadsheet formulas, dashboards and automation guides.</p>
  <form onsubmit="event.preventDefault(); alert('Subscribed!');" class="flex gap-2">
    <input type="email" placeholder="you@company.com" required class="flex-1 px-3 py-2 text-xs bg-[#050608] border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand/40" />
    <button type="submit" class="px-4 py-2 bg-brand text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#16E6D8] transition-colors shrink-0">Subscribe</button>
  </form>
</div>`
  },
  {
    id: "snippet_training",
    name: "LMS Course Promo",
    category: "Promotional Snippets",
    description: "Promote online certification classes and bootcamps.",
    template: `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-br from-card to-base border border-white/5 rounded-2xl items-center my-8 text-left">
  <div class="md:col-span-2">
    <span class="text-[10px] font-bold text-brand uppercase tracking-wider">KVJ Analytics Academy</span>
    <h4 class="text-lg font-bold text-white mt-1">Master Excel & MIS Report Automation</h4>
    <p class="text-xs text-slate-350 mt-2 leading-relaxed">Advance your career. Gain live certification with hands-on labs, 3D equations, Power BI dashboards and macros evaluation.</p>
  </div>
  <div class="text-center md:text-right shrink-0">
    <a href="/training" class="inline-block px-5 py-2.5 bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-brand hover:text-black text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all">Explore Courses</a>
  </div>
</div>`
  },
  {
    id: "text_paragraph_image",
    name: "Paragraph with Image",
    category: "Structured Data",
    description: "Paragraph block with an image embedded in the middle.",
    template: `<div class="my-6">
  <p>First paragraph of content goes here. Write introductory text before the visual asset.</p>
  <div class="my-6 text-center">
    <img src="https://picsum.photos/800/400?random=4" alt="Embedded Image" class="rounded-2xl mx-auto shadow-md" />
  </div>
  <p>Second paragraph of content goes here. Write follow-up explanation or conclusions.</p>
</div>`
  }
];

export function getBlockById(id: string): ContentBlock | undefined {
  return BLOG_BLOCKS.find(b => b.id === id);
}

export function getCategories(): string[] {
  return Array.from(new Set(BLOG_BLOCKS.map(b => b.category)));
}
