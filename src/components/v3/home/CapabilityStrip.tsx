"use client";

import React, { useState } from "react";
import { BarChart3, Database, Cpu, Layers } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Interactive capability presentation (replaces the old rounded pill banner). The approved hero
 * capabilities become live tiles: each carries a small animated motif that intensifies on hover/
 * focus. No fabricated copy — the motif is the "content". Keyboard-accessible.
 */
const MOTIFS: Record<string, React.ComponentType<{ on: boolean }>> = {
  bars: BarsMotif, nodes: NodesMotif, flow: FlowMotif, layers: LayersMotif,
};
const ICONS = [BarChart3, Database, Cpu, Layers];
const KEYS = ["bars", "nodes", "flow", "layers"];

export function CapabilityStrip({ items }: { items: string[] }) {
  const [on, setOn] = useState<number | null>(null);
  if (!items?.length) return null;
  const caps = items.slice(0, 4);

  return (
    <section className="relative -mt-2 border-y border-line/50 bg-white/[0.015]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-line/40">
          {caps.map((label, i) => {
            const Icon = ICONS[i % ICONS.length];
            const Motif = MOTIFS[KEYS[i % KEYS.length]];
            const active = on === i;
            return (
              <Reveal key={i} delay={i * 70}>
                <button
                  onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)}
                  onFocus={() => setOn(i)} onBlur={() => setOn(null)}
                  className="group relative flex w-full items-center gap-3 overflow-hidden px-5 py-6 text-left transition-colors hover:bg-brand/[0.03] focus:outline-none focus-visible:bg-brand/[0.05]"
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300 ${
                    active ? "border-brand/40 bg-brand/15 text-brand" : "border-line bg-white/[0.03] text-slate"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[13px] font-semibold leading-tight transition-colors ${active ? "text-brand" : "text-ink"}`}>
                      {label}
                    </span>
                    <span className="mt-2 block h-5"><Motif on={active} /></span>
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-brand to-corporate transition-all duration-500 ${active ? "w-full" : "w-0"}`} />
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── micro-motifs (SVG, animate on hover) ── */
function BarsMotif({ on }: { on: boolean }) {
  const hs = [40, 70, 50, 90, 60];
  return (
    <svg viewBox="0 0 80 20" className="h-full w-24"><g>
      {hs.map((h, i) => (
        <rect key={i} x={i * 16} y={20 - (on ? h : h * 0.5) / 5} width="9" height={(on ? h : h * 0.5) / 5}
          rx="1.5" className="transition-all duration-500" fill={on ? "#43F5FF" : "rgba(167,177,196,0.4)"} />
      ))}
    </g></svg>
  );
}
function NodesMotif({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 80 20" className="h-full w-24">
      <line x1="8" y1="10" x2="40" y2="4" stroke={on ? "#43F5FF" : "rgba(167,177,196,0.35)"} strokeWidth="1" className="transition-all duration-500" />
      <line x1="8" y1="10" x2="40" y2="16" stroke={on ? "#43F5FF" : "rgba(167,177,196,0.35)"} strokeWidth="1" className="transition-all duration-500" />
      <line x1="40" y1="4" x2="72" y2="10" stroke={on ? "#43F5FF" : "rgba(167,177,196,0.35)"} strokeWidth="1" className="transition-all duration-500" />
      {[[8,10],[40,4],[40,16],[72,10]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={on ? 3 : 2} fill={on ? "#43F5FF" : "rgba(167,177,196,0.5)"} className="transition-all duration-500" />
      ))}
    </svg>
  );
}
function FlowMotif({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 80 20" className="h-full w-24">
      <path d="M4 10 H76" stroke="rgba(167,177,196,0.3)" strokeWidth="1" />
      {[0,1,2,3].map((i)=>(
        <circle key={i} cx={10 + i * 20} cy="10" r={on ? 2.6 : 1.8}
          fill={on ? "#43F5FF" : "rgba(167,177,196,0.5)"}
          className={on ? "animate-glow-pulse" : ""} style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </svg>
  );
}
function LayersMotif({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 80 20" className="h-full w-24">
      {[0,1,2].map((i)=>(
        <rect key={i} x={20 - i * 4} y={4 + i * 5} width="40" height="5" rx="1.5"
          className="transition-all duration-500"
          fill={on ? ["#43F5FF","#3A7BFF","#16E6D8"][i] : "rgba(167,177,196,0.4)"}
          opacity={on ? 0.9 - i * 0.2 : 0.5} />
      ))}
    </svg>
  );
}
