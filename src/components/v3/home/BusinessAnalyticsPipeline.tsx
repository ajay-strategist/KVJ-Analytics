"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle, Database, Cog, BarChart3, Gauge, FileBarChart, TrendingUp,
} from "lucide-react";

/**
 * Business Analytics Pipeline — scroll-driven enterprise journey where the data flow is *routed
 * around* each node: as scroll progress reaches a stage, the stream splits into two synchronized
 * SVG arcs (left + right of the circle), merges just below, fills the node with a glow and fires a
 * ripple, then continues to the next stage. Fully tied to scroll progress (reverses identically on
 * scroll-up). Vector paths + normalized dash reveal; node glow/ripple use transform/opacity (GPU).
 * Mobile / reduced-motion get a clean static sequence.
 */
const STAGES: { name: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { name: "Business Challenge", Icon: AlertTriangle },
  { name: "Data Collection", Icon: Database },
  { name: "Data Engineering", Icon: Cog },
  { name: "Analytics", Icon: BarChart3 },
  { name: "Visualization", Icon: Gauge },
  { name: "Report Automation", Icon: FileBarChart },
  { name: "Business Decisions", Icon: TrendingUp },
];

// ── geometry (px) ──
const R = 18, GAP = 7, ARC = R + GAP, STEP = 84, TOP = 34, CX = 44, SVGW = 88;
const yOf = (i: number) => TOP + i * STEP;
const HTOTAL = yOf(STAGES.length - 1) + 46;
const P_LEAD = `M${CX},0 L${CX},${yOf(0) - ARC}`;
const arcL = (i: number) => `M${CX},${yOf(i) - ARC} A${ARC},${ARC} 0 0 0 ${CX},${yOf(i) + ARC}`;
const arcR = (i: number) => `M${CX},${yOf(i) - ARC} A${ARC},${ARC} 0 0 1 ${CX},${yOf(i) + ARC}`;
const conn = (i: number) => `M${CX},${yOf(i) + ARC} L${CX},${yOf(i + 1) - ARC}`;
const P_TAIL = `M${CX},${yOf(STAGES.length - 1) + ARC} L${CX},${HTOTAL}`;

export function BusinessAnalyticsPipeline({
  eyebrow = "Our Approach", heading, stageNames,
}: { eyebrow?: string; heading: string; stageNames?: string[] }) {
  // Stage labels are CMS-editable (by position); fall back to the approved default
  // name when a CMS title is empty. Icons + geometry stay fixed for the animation.
  const nameAt = (i: number) => (stageNames?.[i]?.trim() || STAGES[i].name);
  const outer = useRef<HTMLDivElement>(null);
  const leadRef = useRef<SVGPathElement>(null);
  const arcLRefs = useRef<(SVGPathElement | null)[]>([]);
  const arcRRefs = useRef<(SVGPathElement | null)[]>([]);
  const connRefs = useRef<(SVGPathElement | null)[]>([]);
  const tailRef = useRef<SVGPathElement>(null);
  const beats = useRef<{ els: SVGPathElement[]; len: number; start: number; threshold?: number }[]>([]);
  const [active, setActive] = useState(0);

  // Build ordered beats (lead → [nodeArcs, conn]* → tail) with real lengths for sequencing.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const list: typeof beats.current = [];
    let cum = 0;
    const push = (els: (SVGPathElement | null)[], isNode?: boolean) => {
      const valid = els.filter(Boolean) as SVGPathElement[];
      if (!valid.length) return;
      const len = valid[0].getTotalLength() || 1;
      valid.forEach((el) => { el.style.strokeDasharray = "1"; el.style.strokeDashoffset = reduce ? "0" : "1"; });
      const beat = { els: valid, len, start: cum, threshold: isNode ? cum + len / 2 : undefined };
      list.push(beat); cum += len;
    };
    if (leadRef.current) push([leadRef.current]);
    for (let i = 0; i < STAGES.length; i++) {
      push([arcLRefs.current[i], arcRRefs.current[i]], true);
      if (i < STAGES.length - 1) push([connRefs.current[i]]);
    }
    if (tailRef.current) push([tailRef.current]);
    beats.current = list;
    if (reduce) { setActive(STAGES.length); return; }

    let raf = 0, last = -1;
    const tick = () => {
      const el = outer.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
        const dist = p * cum;
        let done = 0;
        for (const b of beats.current) {
          const local = Math.min(1, Math.max(0, (dist - b.start) / b.len));
          const off = String(1 - local);
          for (const e of b.els) e.style.strokeDashoffset = off;
          if (b.threshold !== undefined && dist >= b.threshold) done++;
        }
        if (done !== last) { last = done; setActive(done); }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const current = Math.min(STAGES.length - 1, Math.max(0, active === 0 ? 0 : active - 1));

  return (
    <section className="relative bg-base perspective-container">
      {/* Desktop: sticky routed-flow journey */}
      <div ref={outer} className="relative hidden md:block h-[340vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden grid-fade">
          <div className="beam absolute top-[12%] right-[8%] h-[26rem] w-[20rem] bg-corporate/12" />
          <div className="relative z-10 mx-auto w-full max-w-[1080px] px-6">
            <div className="mb-10 max-w-2xl">
              <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span>
              <h2 className="font-display font-bold text-3xl lg:text-5xl text-ink leading-tight tracking-tight text-glow-hero">{heading}</h2>
            </div>

            <div className="flex items-start gap-8 lg:gap-14">
              {/* routed pipeline */}
              <div className="relative shrink-0" style={{ height: HTOTAL, width: 300 }}>
                <svg className="absolute left-0 top-0" width={SVGW} height={HTOTAL} viewBox={`0 0 ${SVGW} ${HTOTAL}`} fill="none">
                  {/* base track */}
                  {[P_LEAD, P_TAIL, ...STAGES.map((_, i) => arcL(i)), ...STAGES.map((_, i) => arcR(i)),
                    ...STAGES.slice(0, -1).map((_, i) => conn(i))].map((d, i) => (
                    <path key={i} d={d} stroke="rgba(16,185,129,0.12)" strokeWidth="2" strokeLinecap="round" />
                  ))}
                  {/* animated flow (normalized dash) */}
                  <path ref={leadRef} d={P_LEAD} pathLength={1} stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                  {STAGES.map((_, i) => (
                    <path key={`al${i}`} ref={(el) => { arcLRefs.current[i] = el; }} d={arcL(i)} pathLength={1} stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                  ))}
                  {STAGES.map((_, i) => (
                    <path key={`ar${i}`} ref={(el) => { arcRRefs.current[i] = el; }} d={arcR(i)} pathLength={1} stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                  ))}
                  {STAGES.slice(0, -1).map((_, i) => (
                    <path key={`c${i}`} ref={(el) => { connRefs.current[i] = el; }} d={conn(i)} pathLength={1} stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
                  ))}
                  <path ref={tailRef} d={P_TAIL} pathLength={1} stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
                </svg>

                {/* nodes + labels */}
                {STAGES.map((s, i) => {
                  const on = i < active;
                  return (
                    <div key={i}>
                      <div className="absolute" style={{ top: yOf(i) - R, left: CX - R, width: 2 * R, height: 2 * R }}>
                        {on && <span className="node-ripple absolute inset-0 rounded-full border border-brand/60" />}
                        <span className={`relative grid h-full w-full place-items-center rounded-full border transition-all duration-500 ${
                          on ? "border-brand bg-brand/20 text-brand shadow-[0_0_18px_-2px_rgba(16,185,129,0.8)]" : "border-line bg-base text-muted"}`}>
                          <s.Icon className="h-4 w-4" />
                        </span>
                      </div>
                      <div className="absolute" style={{ top: yOf(i) - 16, left: CX + ARC + 18, width: 220 }}>
                        <span className={`font-mono text-[10px] font-bold ${on ? "text-brand" : "text-muted"}`}>STAGE {String(i + 1).padStart(2, "0")}</span>
                        <div className={`text-[15px] font-semibold leading-tight transition-colors ${on ? "text-ink" : "text-slate/70"}`}>{nameAt(i)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* active-stage dashboard card (High Contrast Slate Navy & Cyan Glow Theme) */}
              <div className="glow-ring relative hidden flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] border border-cyan-500/30 p-8 lg:block min-h-[280px] shadow-2xl">
                <div className="absolute -top-16 -right-12 h-52 w-52 rounded-full bg-cyan-500/20 blur-[80px] pointer-events-none" />
                <div key={current} className="animate-fade-up relative z-10 space-y-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
                      STAGE {String(current + 1).padStart(2, "0")} / {STAGES.length}
                    </span>
                    <h3 className="mt-1 font-display text-2xl lg:text-3xl font-bold text-white tracking-tight">
                      {nameAt(current)}
                    </h3>
                  </div>

                  {/* 7 Stage Indicator Dots */}
                  <div className="flex items-center gap-2 pt-1 pb-2">
                    {STAGES.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                          idx === current
                            ? "bg-cyan-400 ring-4 ring-cyan-400/30 scale-110 shadow-[0_0_12px_#22d3ee]"
                            : idx < active
                            ? "bg-cyan-500/60"
                            : "bg-slate-900 border border-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <StageViz variant={current} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: clean vertical sequence */}
      <div className="md:hidden py-20 px-5">
        <div className="mb-10">
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{eyebrow}</span>
          <h2 className="font-display font-bold text-3xl text-ink leading-tight tracking-tight">{heading}</h2>
        </div>
        <div className="relative pl-14">
          <div className="absolute left-[22px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-brand to-corporate" />
          <div className="space-y-6">
            {STAGES.map((s, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-14 top-0 grid h-11 w-11 place-items-center rounded-full border border-brand/50 bg-brand/12 text-brand">
                  <s.Icon className="h-5 w-5" />
                </span>
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 text-white shadow-lg">
                  <span className="font-mono text-[11px] font-bold text-cyan-400">STAGE {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-lg font-bold text-white">{nameAt(i)}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Abstract per-stage dashboard (High Visibility Slate/Cyan Theme) */
function StageViz({ variant }: { variant: number }) {
  const cls = "h-[70px] w-full max-w-sm";
  if (variant === 0)
    return <div className="flex max-w-sm flex-wrap gap-2.5">{[...Array(9)].map((_, i) => <span key={i} className="h-3.5 w-3.5 rounded-full border border-cyan-400/40 bg-cyan-400/20 shadow-sm" style={{ opacity: 0.5 + (i % 3) * 0.25 }} />)}</div>;
  if (variant === 1)
    return <div className="relative h-8 w-full max-w-sm overflow-hidden">{[0, 1, 2, 3].map((i) => <span key={i} className="stream-dot absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" style={{ animationDelay: `${i * 0.5}s` }} />)}</div>;
  if (variant === 2)
    return <div className="flex w-full max-w-sm items-end gap-1.5 h-[70px]">{[40, 62, 50, 78, 56, 84, 66].map((h, i) => <div key={i} className="build-line flex-1 rounded-t bg-gradient-to-t from-slate-900 to-cyan-400" style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }} />)}</div>;
  if (variant === 3)
    return <svg viewBox="0 0 240 70" className={cls} preserveAspectRatio="none"><path d="M0 56 C30 50 46 26 70 32 S120 8 150 18 S210 6 240 12" fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" /></svg>;
  if (variant === 4)
    return (
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 42 42" className="h-16 w-16 -rotate-90"><circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" /><circle cx="21" cy="21" r="15.9" fill="none" stroke="#22d3ee" strokeWidth="6" strokeDasharray="64 100" strokeLinecap="round" /></svg>
        <div className="space-y-2">{[70, 48, 32].map((w, i) => <div key={i} className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300" style={{ width: `${w * 1.6}px` }} />)}</div>
      </div>
    );
  if (variant === 5)
    return <div className="w-full max-w-xs space-y-2">{[92, 76, 84, 62].map((w, i) => <div key={i} className="h-2.5 rounded-full bg-slate-900 border border-slate-700"><div className="build-line h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-300" style={{ width: `${w}%`, animationDelay: `${i * 0.4}s` }} /></div>)}</div>;
  return <div className="flex items-end gap-1.5 h-[70px]">{[40, 52, 60, 72, 88, 100].map((h, i) => <div key={i} className="w-6 rounded-t bg-gradient-to-t from-slate-900 to-cyan-400" style={{ height: `${h}%` }} />)}</div>;
}
