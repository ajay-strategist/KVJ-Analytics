export interface BlockStyleOptions {
  // General styles
  bgType: 'default' | 'transparent' | 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'brand' | 'custom';
  customBgColor?: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  borderStyle: 'default' | 'left-accent' | 'full' | 'dashed' | 'none';

  // Typography styling
  headingFont?: 'default' | 'times-new-roman' | 'arial' | 'georgia' | 'courier-new' | 'garamond';
  bodyFont?: 'default' | 'times-new-roman' | 'arial' | 'georgia' | 'courier-new' | 'garamond';
  headingFontSizeNum?: number;
  bodyFontSizeNum?: number;

  // Heading styles
  headingStyle: 'standard' | 'block-shaded' | 'underlined' | 'bordered';
  headingColor: 'white' | 'brand' | 'blue' | 'emerald' | 'amber' | 'rose' | 'custom';
  customHeadingColor?: string;

  // Custom text content
  headingText?: string;
  subheadingText?: string;

  // Multi-column or complex structures
  col1Heading?: string;
  col1Text?: string;
  col2Heading?: string;
  col2Text?: string;
  col3Heading?: string;
  col3Text?: string;

  // Buttons/CTAs
  buttonText?: string;
  buttonUrl?: string;

  // YouTube / Media / Accordion
  mediaUrl?: string;
  faqQuestion?: string;
  faqAnswer?: string;

  // Callout styles color theme
  calloutTheme?: 'blue' | 'amber' | 'emerald' | 'red' | 'purple' | 'custom';
  customCalloutColor?: string;
}

export function getBgStyle(options: BlockStyleOptions): string {
  switch (options.bgType) {
    case 'transparent':
      return 'background-color: transparent !important; border-color: rgba(255,255,255,0.08) !important;';
    case 'slate':
      return 'background-color: #0F172A !important; border-color: rgba(255,255,255,0.1) !important;';
    case 'blue':
      return 'background-color: rgba(59, 130, 246, 0.08) !important; border-color: rgba(59, 130, 246, 0.25) !important;';
    case 'emerald':
      return 'background-color: rgba(16, 185, 129, 0.08) !important; border-color: rgba(16, 185, 129, 0.25) !important;';
    case 'amber':
      return 'background-color: rgba(245, 158, 11, 0.08) !important; border-color: rgba(245, 158, 11, 0.25) !important;';
    case 'rose':
      return 'background-color: rgba(244, 63, 94, 0.08) !important; border-color: rgba(244, 63, 94, 0.25) !important;';
    case 'brand':
      return 'background-color: rgba(8, 168, 138, 0.08) !important; border-color: rgba(8, 168, 138, 0.25) !important;';
    case 'custom':
      return options.customBgColor ? `background-color: ${options.customBgColor} !important; border-color: rgba(255,255,255,0.15) !important;` : '';
    default:
      return '';
  }
}

export function getBgClass(options: BlockStyleOptions, defaultClass: string): string {
  if (options.bgType === 'default') return defaultClass;
  return '';
}

export function getHeadingFontStyle(options: BlockStyleOptions): string {
  switch (options.headingFont) {
    case 'times-new-roman':
      return 'font-family: "Times New Roman", Times, serif !important;';
    case 'arial':
      return 'font-family: Arial, Helvetica, sans-serif !important;';
    case 'georgia':
      return 'font-family: Georgia, serif !important;';
    case 'courier-new':
      return 'font-family: "Courier New", Courier, monospace !important;';
    case 'garamond':
      return 'font-family: Garamond, Baskerville, serif !important;';
    case 'default':
    default:
      return 'font-family: Plus Jakarta Sans, Inter, sans-serif !important;';
  }
}

export function getBodyFontStyle(options: BlockStyleOptions): string {
  switch (options.bodyFont) {
    case 'times-new-roman':
      return 'font-family: "Times New Roman", Times, serif !important;';
    case 'arial':
      return 'font-family: Arial, Helvetica, sans-serif !important;';
    case 'georgia':
      return 'font-family: Georgia, serif !important;';
    case 'courier-new':
      return 'font-family: "Courier New", Courier, monospace !important;';
    case 'garamond':
      return 'font-family: Garamond, Baskerville, serif !important;';
    case 'default':
    default:
      return 'font-family: Plus Jakarta Sans, Inter, sans-serif !important;';
  }
}

export function getBodySizeStyle(options: BlockStyleOptions): string {
  const size = options.bodyFontSizeNum || 15;
  return `font-size: ${size}px !important; line-height: 1.5 !important;`;
}

export function getFontStyle(options: BlockStyleOptions): string {
  return `${getBodyFontStyle(options)} ${getBodySizeStyle(options)}`;
}

export function getAlignStyle(options: BlockStyleOptions): string {
  switch (options.alignment) {
    case 'center':
      return 'text-align: center !important;';
    case 'right':
      return 'text-align: right !important;';
    case 'justify':
      return 'text-align: justify !important;';
    default:
      return 'text-align: left !important;';
  }
}

export function getHeadingColorStyle(options: BlockStyleOptions): string {
  switch (options.headingColor) {
    case 'brand':
      return 'color: #08A88A !important;';
    case 'blue':
      return 'color: #3b82f6 !important;';
    case 'emerald':
      return 'color: #10b981 !important;';
    case 'amber':
      return 'color: #f59e0b !important;';
    case 'rose':
      return 'color: #ef4444 !important;';
    case 'custom':
      return options.customHeadingColor ? `color: ${options.customHeadingColor} !important;` : '';
    default:
      return 'color: #ffffff !important;';
  }
}

export function getHeadingSizeStyle(options: BlockStyleOptions): string {
  const size = options.headingFontSizeNum || 20;
  return `font-size: ${size}px !important; line-height: 1.4 !important;`;
}

export function getHeadingStyle(options: BlockStyleOptions): string {
  let style = `${getHeadingColorStyle(options)} ${getHeadingSizeStyle(options)} ${getHeadingFontStyle(options)}`;
  const accentColor = options.headingColor === 'custom' && options.customHeadingColor ? options.customHeadingColor :
    options.headingColor === 'brand' ? '#08A88A' :
    options.headingColor === 'blue' ? '#3b82f6' :
    options.headingColor === 'emerald' ? '#10b981' :
    options.headingColor === 'amber' ? '#f59e0b' :
    options.headingColor === 'rose' ? '#ef4444' : '#10B981';

  if (options.headingStyle === 'block-shaded') {
    style += ` background-color: rgba(255, 255, 255, 0.05) !important; padding: 0.6rem 1rem !important; border-radius: 8px !important; border-left: 4px solid ${accentColor} !important; display: block !important; margin-bottom: 0.75rem !important;`;
  } else if (options.headingStyle === 'underlined') {
    style += ` border-bottom: 2px solid ${accentColor} !important; padding-bottom: 0.35rem !important; display: inline-block !important; margin-bottom: 0.75rem !important;`;
  } else if (options.headingStyle === 'bordered') {
    style += ` border: 1px solid rgba(255,255,255,0.15) !important; padding: 0.5rem 1rem !important; border-radius: 8px !important; display: inline-block !important; margin-bottom: 0.75rem !important;`;
  }
  return style;
}

export function getBorderStyle(options: BlockStyleOptions): string {
  const accentColor = options.headingColor === 'custom' && options.customHeadingColor ? options.customHeadingColor :
    options.headingColor === 'brand' ? '#08A88A' :
    options.headingColor === 'blue' ? '#3b82f6' :
    options.headingColor === 'emerald' ? '#10b981' :
    options.headingColor === 'amber' ? '#f59e0b' :
    options.headingColor === 'rose' ? '#ef4444' : '#10B981';

  switch (options.borderStyle) {
    case 'left-accent':
      return `border-left: 4px solid ${accentColor} !important;`;
    case 'full':
      return 'border: 1px solid rgba(255,255,255,0.1) !important;';
    case 'dashed':
      return 'border: 2px dashed rgba(255,255,255,0.15) !important;';
    case 'none':
      return 'border: none !important;';
    default:
      return '';
  }
}

export function generateCustomBlock(blockId: string, options: BlockStyleOptions): string {
  const customBg = getBgStyle(options);
  const customFont = getFontStyle(options);
  const customAlign = getAlignStyle(options);
  const customBorder = getBorderStyle(options);
  const customHeading = getHeadingStyle(options);

  const wrapperStyle = `data-kvj-styled="true" style="${customBg} ${customFont} ${customAlign} ${customBorder} transition-all duration-300;"`;

  switch (blockId) {
    case 'callout_info':
    case 'callout_warning':
    case 'callout_success':
    case 'callout_tip': {
      // Determine the theme
      const theme = options.calloutTheme || 
                    (blockId === 'callout_warning' ? 'amber' : 
                     blockId === 'callout_success' ? 'emerald' : 
                     blockId === 'callout_tip' ? 'purple' : 'blue');

      let iconSvg = '';
      let colorClass = 'text-blue-400';
      let iconBg = 'bg-blue-500/20';
      let defaultBgClass = 'bg-blue-500/10 border border-blue-500/20';
      let accentBorderLeft = 'border-left: 4px solid #3b82f6 !important;';

      switch (theme) {
        case 'amber':
          colorClass = 'text-amber-400';
          iconBg = 'bg-amber-500/20';
          defaultBgClass = 'bg-amber-500/10 border border-amber-500/20';
          accentBorderLeft = 'border-left: 4px solid #f59e0b !important;';
          iconSvg = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
          break;
        case 'emerald':
          colorClass = 'text-emerald-400';
          iconBg = 'bg-emerald-500/20';
          defaultBgClass = 'bg-emerald-500/10 border border-emerald-500/20';
          accentBorderLeft = 'border-left: 4px solid #10b981 !important;';
          iconSvg = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
          break;
        case 'red':
          colorClass = 'text-rose-400';
          iconBg = 'bg-rose-500/20';
          defaultBgClass = 'bg-rose-500/10 border border-rose-500/20';
          accentBorderLeft = 'border-left: 4px solid #ef4444 !important;';
          iconSvg = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
          break;
        case 'purple':
          colorClass = 'text-purple-400';
          iconBg = 'bg-purple-500/20';
          defaultBgClass = 'bg-purple-500/10 border border-purple-500/20';
          accentBorderLeft = 'border-left: 4px solid #8b5cf6 !important;';
          iconSvg = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>`;
          break;
        case 'custom': {
          const customColor = options.customCalloutColor || '#08A88A';
          colorClass = '';
          iconBg = '';
          accentBorderLeft = `border-left: 4px solid ${customColor} !important;`;
          defaultBgClass = '';
          iconSvg = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color: ${customColor} !important;"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
          break;
        }
        case 'blue':
        default:
          colorClass = 'text-blue-400';
          iconBg = 'bg-blue-500/20';
          defaultBgClass = 'bg-blue-500/10 border border-blue-500/20';
          accentBorderLeft = 'border-left: 4px solid #3b82f6 !important;';
          iconSvg = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
          break;
      }

      let calloutBgStyle = '';
      if (theme === 'custom' && options.customCalloutColor) {
        const c = options.customCalloutColor;
        calloutBgStyle = `background-color: ${c}15 !important; border: 1px solid ${c}30 !important; ${accentBorderLeft}`;
      } else if (options.bgType === 'default') {
        calloutBgStyle = accentBorderLeft;
      }

      const bgClass = options.bgType === 'default' ? defaultBgClass : '';
      const borderClass = options.borderStyle === 'default' ? '' : '';

      const headingText = options.headingText || 'Callout Title';
      const bodyText = options.subheadingText || 'Callout text details go here.';

      const finalWrapperStyle = `data-kvj-styled="true" style="${customBg ? customBg : calloutBgStyle} ${customFont} ${customAlign} ${customBorder} transition-all duration-300;"`;

      let iconInlineStyle = '';
      if (theme === 'custom' && options.customCalloutColor) {
        iconInlineStyle = `style="background-color: ${options.customCalloutColor}20 !important; color: ${options.customCalloutColor} !important;"`;
      }

      return `<div ${finalWrapperStyle} class="flex items-start gap-4 p-5 rounded-2xl my-6 ${bgClass} ${borderClass}">
  <div class="p-2 rounded-xl shrink-0 ${iconBg} ${colorClass}" ${iconInlineStyle} style="height: fit-content;">
    ${iconSvg}
  </div>
  <div class="flex-1">
    <h4 data-kvj-styled="true" style="${customHeading}">${headingText}</h4>
    <p data-kvj-styled="true" class="text-sm text-slate-350 leading-relaxed m-0" style="margin: 0 !important; color: #cbd5e1 !important; ${customFont}">${bodyText}</p>
  </div>
</div>`;
    }

    case 'layout_2col': {
      const col1H = options.col1Heading || 'Left Column Heading';
      const col1P = options.col1Text || 'Left column text details go here.';
      const col2H = options.col2Heading || 'Right Column Heading';
      const col2P = options.col2Text || 'Right column text details go here.';

      const cardStyle = options.bgType !== 'default' ? `style="${customBg} ${customBorder}"` : 'class="p-5 bg-card border border-white/5 rounded-2xl"';

      return `<div data-kvj-styled="true" style="${customFont} ${customAlign}" class="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
  <div ${cardStyle} class="space-y-4">
    <h3 data-kvj-styled="true" style="${customHeading}">${col1H}</h3>
    <p data-kvj-styled="true" class="text-slate-350 m-0" style="color: #cbd5e1 !important; ${customFont}">${col1P}</p>
  </div>
  <div ${cardStyle} class="space-y-4">
    <h3 data-kvj-styled="true" style="${customHeading}">${col2H}</h3>
    <p data-kvj-styled="true" class="text-slate-350 m-0" style="color: #cbd5e1 !important; ${customFont}">${col2P}</p>
  </div>
</div>`;
    }

    case 'layout_3col': {
      const col1H = options.col1Heading || 'Column 1';
      const col1P = options.col1Text || 'Description or detail text goes here.';
      const col2H = options.col2Heading || 'Column 2';
      const col2P = options.col2Text || 'Description or detail text goes here.';
      const col3H = options.col3Heading || 'Column 3';
      const col3P = options.col3Text || 'Description or detail text goes here.';

      const cardStyle = options.bgType !== 'default' ? `style="${customBg} ${customBorder}"` : 'class="p-5 bg-card border border-white/5 rounded-2xl"';

      return `<div data-kvj-styled="true" style="${customFont} ${customAlign}" class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
  <div ${cardStyle}>
    <h4 data-kvj-styled="true" style="${customHeading}">${col1H}</h4>
    <p data-kvj-styled="true" class="text-sm text-slate-350 m-0" style="color: #cbd5e1 !important; ${customFont}">${col1P}</p>
  </div>
  <div ${cardStyle}>
    <h4 data-kvj-styled="true" style="${customHeading}">${col2H}</h4>
    <p data-kvj-styled="true" class="text-sm text-slate-350 m-0" style="color: #cbd5e1 !important; ${customFont}">${col2P}</p>
  </div>
  <div ${cardStyle}>
    <h4 data-kvj-styled="true" style="${customHeading}">${col3H}</h4>
    <p data-kvj-styled="true" class="text-sm text-slate-350 m-0" style="color: #cbd5e1 !important; ${customFont}">${col3P}</p>
  </div>
</div>`;
    }

    case 'accordion_faq': {
      const q = options.faqQuestion || 'How does this automated script consolidate multiple excel folders?';
      const a = options.faqAnswer || 'It reads all spreadsheets placed in the designated input folder, parses their schemas, verifies their integrity, aggregates the records, and writes the output workbook.';
      
      const bgClass = options.bgType === 'default' ? 'bg-card border border-white/5' : '';

      return `<details ${wrapperStyle} class="group rounded-2xl p-4 my-4 [&_summary::-webkit-details-marker]:hidden ${bgClass}">
  <summary class="flex items-center justify-between cursor-pointer focus:outline-none">
    <span data-kvj-styled="true" style="${customHeading} margin: 0 !important;">${q}</span>
    <span class="p-1 bg-white/5 group-open:rotate-180 transition-transform rounded-lg text-slate-350">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  </summary>
  <div data-kvj-styled="true" class="mt-3 text-sm text-slate-350 leading-relaxed border-t border-white/5 pt-3" style="color: #cbd5e1 !important; ${customFont}">
    ${a}
  </div>
</details>`;
    }

    case 'tabs_interactive': {
      const col1H = options.col1Heading || 'Tab Title 1';
      const col1P = options.col1Text || 'This is the content of the first tab. Great for explaining different approaches.';
      const col2H = options.col2Heading || 'Tab Title 2';
      const col2P = options.col2Text || 'This is the content of the second tab. Fully isolated and behaves as a pure interactive element.';
      const tab1Btn = options.col1Heading ? options.col1Heading.substring(0, 12) : 'Tab 1';
      const tab2Btn = options.col2Heading ? options.col2Heading.substring(0, 12) : 'Tab 2';

      const uniqueId = `tabs-${Math.random().toString(36).substring(2, 9)}`;
      const bgClass = options.bgType === 'default' ? 'bg-card border border-white/5' : '';

      return `<div ${wrapperStyle} id="${uniqueId}" class="rounded-2xl overflow-hidden my-6 ${bgClass}">
  <div class="flex border-b border-white/5 bg-base/50 p-2 gap-2">
    <button onclick="switchTab_${uniqueId}(event, 'tab1_${uniqueId}')" class="tab-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-brand text-black font-semibold transition-all">
      ${tab1Btn}
    </button>
    <button onclick="switchTab_${uniqueId}(event, 'tab2_${uniqueId}')" class="tab-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-slate-350 hover:bg-white/5 transition-all">
      ${tab2Btn}
    </button>
  </div>
  <div id="tab1_${uniqueId}" class="tab-content p-6 text-sm text-slate-350 leading-relaxed">
    <h4 data-kvj-styled="true" style="${customHeading}">${col1H}</h4>
    <p data-kvj-styled="true" style="color: #cbd5e1 !important; margin: 0; ${customFont}">${col1P}</p>
  </div>
  <div id="tab2_${uniqueId}" class="tab-content p-6 text-sm text-slate-350 leading-relaxed hidden">
    <h4 data-kvj-styled="true" style="${customHeading}">${col2H}</h4>
    <p data-kvj-styled="true" style="color: #cbd5e1 !important; margin: 0; ${customFont}">${col2P}</p>
  </div>
  <script>
    function switchTab_${uniqueId}(evt, tabId) {
      const container = evt.currentTarget.closest('#${uniqueId}');
      container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl text-slate-350 hover:bg-white/5 transition-all";
      });
      evt.currentTarget.className = "tab-btn px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-brand text-black font-semibold transition-all";
      
      container.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      container.querySelector('#' + tabId).classList.remove('hidden');
    }
  </script>
</div>`;
    }

    case 'timeline_vertical': {
      const col1H = options.col1Heading || 'Phase 1 — Discovery';
      const col1Sub = options.headingText || 'Audit Existing Operations';
      const col1P = options.col1Text || 'Identify Excel spreadsheets, manual copy-paste points, and formula dependencies.';
      
      const col2H = options.col2Heading || 'Phase 2 — Implementation';
      const col2Sub = options.subheadingText || 'Deploy Python/VBA Macro Scripts';
      const col2P = options.col2Text || 'Build automatic folder ingestion pipelines and configure live API databases.';

      const col3H = options.col3Heading || 'Phase 3 — Review';
      const col3Sub = options.buttonText || 'Handover & Testing';
      const col3P = options.col3Text || 'Verify automated PDF scorecard outputs and train team users on dashboard utilities.';

      const cardStyle = options.bgType !== 'default' ? `style="${customBg} ${customBorder}"` : 'class="bg-card border border-white/5 p-4 rounded-xl"';

      return `<div data-kvj-styled="true" style="${customFont} ${customAlign}" class="space-y-6 my-8 pl-4 relative border-l border-white/10 text-left">
  <div class="relative">
    <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-brand rounded-full ring-4 ring-brand/10"></div>
    <div ${cardStyle}>
      <span class="text-[10px] font-bold text-brand uppercase tracking-wider" style="${customFont}">${col1H}</span>
      <h4 data-kvj-styled="true" style="${customHeading} margin-top: 0.25rem !important;">${col1Sub}</h4>
      <p data-kvj-styled="true" class="text-xs text-slate-350 mt-1 m-0" style="color: #cbd5e1 !important; ${customFont}">${col1P}</p>
    </div>
  </div>
  <div class="relative">
    <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-brand rounded-full ring-4 ring-brand/10"></div>
    <div ${cardStyle}>
      <span class="text-[10px] font-bold text-brand uppercase tracking-wider" style="${customFont}">${col2H}</span>
      <h4 data-kvj-styled="true" style="${customHeading} margin-top: 0.25rem !important;">${col2Sub}</h4>
      <p data-kvj-styled="true" class="text-xs text-slate-350 mt-1 m-0" style="color: #cbd5e1 !important; ${customFont}">${col2P}</p>
    </div>
  </div>
  <div class="relative">
    <div class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-brand rounded-full ring-4 ring-brand/10"></div>
    <div ${cardStyle}>
      <span class="text-[10px] font-bold text-brand uppercase tracking-wider" style="${customFont}">${col3H}</span>
      <h4 data-kvj-styled="true" style="${customHeading} margin-top: 0.25rem !important;">${col3Sub}</h4>
      <p data-kvj-styled="true" class="text-xs text-slate-350 mt-1 m-0" style="color: #cbd5e1 !important; ${customFont}">${col3P}</p>
    </div>
  </div>
</div>`;
    }

    case 'comparison_table': {
      const bgClass = options.bgType === 'default' ? 'bg-card border border-white/5' : '';

      return `<div ${wrapperStyle} class="overflow-x-auto rounded-2xl my-6 ${bgClass}">
  <table class="w-full text-left text-sm border-collapse" style="margin: 0 !important; border: none !important;">
    <thead>
      <tr class="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-slate-350">
        <th class="p-4 font-bold" style="color: #ffffff !important; ${customFont}">Feature</th>
        <th class="p-4 font-bold" style="color: #ffffff !important; ${customFont}">Manual Process</th>
        <th class="p-4 font-bold text-brand" style="color: #08A88A !important; ${customFont}">Automated Solution</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/5 text-slate-350" style="${customFont}">
      <tr>
        <td class="p-4 text-white font-semibold" style="color: #ffffff !important; ${customFont}">Processing Speed</td>
        <td class="p-4" style="color: #cbd5e1 !important; ${customFont}">2 Hours / Day</td>
        <td class="p-4 text-brand font-semibold" style="color: #08A88A !important; ${customFont}">Instant (Under 5s)</td>
      </tr>
      <tr>
        <td class="p-4 text-white font-semibold" style="color: #ffffff !important; ${customFont}">Human Errors</td>
        <td class="p-4" style="color: #cbd5e1 !important; ${customFont}">Frequent (Broken formulas)</td>
        <td class="p-4 text-emerald-400 font-semibold" style="color: #10b981 !important; ${customFont}">0% (Strict checks)</td>
      </tr>
      <tr>
        <td class="p-4 text-white font-semibold" style="color: #ffffff !important; ${customFont}">Live Dashboards</td>
        <td class="p-4" style="color: #cbd5e1 !important; ${customFont}">No (Only via email)</td>
        <td class="p-4 text-emerald-400 font-semibold" style="color: #10b981 !important; ${customFont}">Yes (Real-time Power BI)</td>
      </tr>
    </tbody>
  </table>
</div>`;
    }

    case 'statistics_grid': {
      const col1H = options.col1Heading || '95%';
      const col1P = options.col1Text || 'Time Saved';
      const col2H = options.col2Heading || '20+';
      const col2P = options.col2Text || 'Clients Served';
      const col3H = options.col3Heading || '0%';
      const col3P = options.col3Text || 'Error Rate';
      const col4H = options.headingText || '5+';
      const col4P = options.subheadingText || 'Global Regions';

      const cardStyle = options.bgType !== 'default' ? `style="${customBg} ${customBorder}"` : 'class="p-5 bg-card border border-white/5 rounded-2xl text-center"';

      return `<div data-kvj-styled="true" style="${customFont}" class="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
  <div ${cardStyle} class="text-center">
    <div class="text-3xl font-extrabold text-brand font-display" style="color: #08A88A !important; ${customFont}">${col1H}</div>
    <div class="text-[10px] font-bold text-slate uppercase mt-1 tracking-wider" style="color: #cbd5e1 !important; ${customFont}">${col1P}</div>
  </div>
  <div ${cardStyle} class="text-center">
    <div class="text-3xl font-extrabold text-brand font-display" style="color: #08A88A !important; ${customFont}">${col2H}</div>
    <div class="text-[10px] font-bold text-slate uppercase mt-1 tracking-wider" style="color: #cbd5e1 !important; ${customFont}">${col2P}</div>
  </div>
  <div ${cardStyle} class="text-center">
    <div class="text-3xl font-extrabold text-brand font-display" style="color: #08A88A !important; ${customFont}">${col3H}</div>
    <div class="text-[10px] font-bold text-slate uppercase mt-1 tracking-wider" style="color: #cbd5e1 !important; ${customFont}">${col3P}</div>
  </div>
  <div ${cardStyle} class="text-center">
    <div class="text-3xl font-extrabold text-brand font-display" style="color: #08A88A !important; ${customFont}">${col4H}</div>
    <div class="text-[10px] font-bold text-slate uppercase mt-1 tracking-wider" style="color: #cbd5e1 !important; ${customFont}">${col4P}</div>
  </div>
</div>`;
    }

    case 'media_video': {
      const url = options.mediaUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      return `<div data-kvj-styled="true" class="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 my-6 bg-black shadow-md">
  <iframe class="w-full h-full" src="${url}" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;
    }

    case 'media_pdf': {
      const url = options.mediaUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      return `<div data-kvj-styled="true" class="w-full rounded-2xl overflow-hidden border border-white/10 my-6 bg-card shadow-md">
  <object data="${url}" type="application/pdf" class="w-full h-[500px]">
    <div class="p-6 text-center text-slate-350 text-sm">
      It seems your browser does not support embedded PDFs. 
      <a href="${url}" class="text-brand hover:underline font-bold" target="_blank" style="color: #08A88A !important;">Download the PDF instead</a>
    </div>
  </object>
</div>`;
    }

    case 'media_gallery': {
      const col1P = options.col1Text || 'https://picsum.photos/400/400?random=1';
      const col2P = options.col2Text || 'https://picsum.photos/400/400?random=2';
      const col3P = options.col3Text || 'https://picsum.photos/400/400?random=3';

      return `<div data-kvj-styled="true" class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
  <div class="overflow-hidden rounded-xl border border-white/5 bg-white/5 aspect-square">
    <img src="${col1P}" alt="Gallery item" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" style="margin: 0 !important;" />
  </div>
  <div class="overflow-hidden rounded-xl border border-white/5 bg-white/5 aspect-square">
    <img src="${col2P}" alt="Gallery item" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" style="margin: 0 !important;" />
  </div>
  <div class="overflow-hidden rounded-xl border border-white/5 bg-white/5 aspect-square">
    <img src="${col3P}" alt="Gallery item" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" style="margin: 0 !important;" />
  </div>
</div>`;
    }

    case 'snippet_cta': {
      const h = options.headingText || 'Automate Your Operations Today';
      const p = options.subheadingText || 'Talk to the KVJ Analytics experts and find out how we can save your team hours of report pipelines.';
      const btnT = options.buttonText || 'Schedule Free Audit';
      const btnU = options.buttonUrl || '/contact';

      const bgStyle = options.bgType === 'default'
        ? 'background: linear-gradient(120deg, rgba(16,185,129,0.07) 0%, rgba(58,123,255,0.07) 100%) !important; border: 1px solid rgba(16, 185, 129, 0.2) !important;'
        : `${customBg} ${customBorder}`;

      return `<div data-kvj-styled="true" style="${bgStyle} ${customFont} ${customAlign}" class="p-8 rounded-2xl text-center my-8 shadow-sm">
  <h4 data-kvj-styled="true" style="${customHeading}">${h}</h4>
  <p data-kvj-styled="true" class="text-sm text-slate-350 max-w-xl mx-auto mb-6" style="color: #cbd5e1 !important; ${customFont}">${p}</p>
  <a href="${btnU}" class="inline-flex items-center px-6 py-2.5 bg-brand hover:bg-[#16E6D8] text-black font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all" style="background-color: #08A88A !important; color: #000000 !important; font-weight: 700 !important; border: none !important; ${customFont}">${btnT}</a>
</div>`;
    }

    case 'snippet_newsletter': {
      const h = options.headingText || 'Get Weekly Excel & Analytics Tips';
      const p = options.subheadingText || 'Join 2,000+ business leaders receiving spreadsheet formulas, dashboards and automation guides.';
      const btnT = options.buttonText || 'Subscribe';

      const bgClass = options.bgType === 'default' ? 'bg-card border border-white/5' : '';

      return `<div ${wrapperStyle} class="p-6 rounded-2xl my-6 text-left relative overflow-hidden ${bgClass}">
  <div class="absolute top-0 left-0 right-0 h-1 signature-gradient" style="background: linear-gradient(120deg, #10B981 0%, #0D9488 35%, #34D399 60%, #10B981 100%) !important;"></div>
  <h4 data-kvj-styled="true" style="${customHeading}">${h}</h4>
  <p data-kvj-styled="true" class="text-xs text-slate mt-1 mb-4" style="color: #cbd5e1 !important; ${customFont}">${p}</p>
  <form onsubmit="event.preventDefault(); alert('Subscribed!');" class="flex gap-2">
    <input type="email" placeholder="you@company.com" required class="flex-1 px-3 py-2 text-xs bg-[#050608] border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand/40" style="background-color: #050608 !important; color: #ffffff !important; ${customFont}" />
    <button type="submit" class="px-4 py-2 bg-brand text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#16E6D8] transition-colors shrink-0" style="background-color: #08A88A !important; color: #000000 !important; border: none !important; font-weight: 700 !important; ${customFont}">${btnT}</button>
  </form>
</div>`;
    }

    case 'snippet_training': {
      const h = options.headingText || 'Master Excel & MIS Report Automation';
      const p = options.subheadingText || 'Advance your career. Gain live certification with hands-on labs, 3D equations, Power BI dashboards and macros evaluation.';
      const btnT = options.buttonText || 'Explore Courses';
      const btnU = options.buttonUrl || '/training';

      const bgStyle = options.bgType === 'default'
        ? 'background: linear-gradient(135deg, var(--color-card) 0%, var(--color-base) 100%) !important; border: 1px solid rgba(255, 255, 255, 0.05) !important;'
        : `${customBg} ${customBorder}`;

      return `<div data-kvj-styled="true" style="${bgStyle} ${customFont} ${customAlign}" class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl items-center my-8 text-left">
  <div class="md:col-span-2">
    <span class="text-[10px] font-bold text-brand uppercase tracking-wider" style="color: #08A88A !important; ${customFont}">KVJ Analytics Academy</span>
    <h4 data-kvj-styled="true" style="${customHeading} margin-top: 0.25rem !important;">${h}</h4>
    <p data-kvj-styled="true" class="text-xs text-slate-350 mt-2 leading-relaxed m-0" style="color: #cbd5e1 !important; ${customFont}">${p}</p>
  </div>
  <div class="text-center md:text-right shrink-0">
    <a href="${btnU}" class="inline-block px-5 py-2.5 bg-white/5 border border-white/10 hover:border-brand/40 hover:bg-brand hover:text-black text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all" style="color: #ffffff !important; font-weight: 700 !important; ${customFont}">${btnT}</a>
  </div>
</div>`;
    }

    case 'text_paragraph_image': {
      const p1 = options.col1Text || 'First paragraph of content goes here. Write introductory text before the visual asset.';
      const p2 = options.col2Text || 'Second paragraph of content goes here. Write follow-up explanation or conclusions.';
      const imgUrl = options.mediaUrl || 'https://picsum.photos/800/400?random=4';
      const altText = options.headingText || 'Paragraph Image';

      const bgClass = options.bgType === 'default' ? '' : '';
      const borderClass = options.borderStyle === 'default' ? '' : '';

      return `<div ${wrapperStyle} class="my-6 p-6 rounded-2xl ${bgClass} ${borderClass}">
  <p data-kvj-styled="true" style="margin-bottom: 1.5rem !important; color: #cbd5e1 !important; ${customFont}">${p1}</p>
  <div class="my-6 text-center">
    <img src="${imgUrl}" alt="${altText}" class="rounded-2xl mx-auto shadow-md max-w-full" style="margin: 0 auto !important;" />
    ${options.headingText ? `<span class="block text-center text-xs text-slate-400 mt-2 italic" style="${customFont}">${options.headingText}</span>` : ''}
  </div>
  <p data-kvj-styled="true" style="margin-top: 1.5rem !important; margin-bottom: 0 !important; color: #cbd5e1 !important; ${customFont}">${p2}</p>
</div>`;
    }

    default:
      return '';
  }
}
