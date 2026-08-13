"use client";

import React, { useEffect, useState } from "react";
import {
  Database, ShieldCheck, Boxes, Server, Cpu, TrendingUp, FileBarChart, Mail,
  CalendarClock, CheckCircle2, LayoutDashboard, AlertTriangle, Sparkles, Target, Rocket,
} from "lucide-react";

/**
 * Living Enterprise Analytics console — the looping data→decision story (Data Sources → ETL →
 * AI Intelligence → Executive Dashboard → Report Automation → Business Decisions). A single ~1.6s
 * tick sequences the stages; charts nudge smoothly. Compact single-column layout for the hero.
 * No fabricated figures. Reduced-motion → coherent static platform. GPU-friendly.
 */
const PIPE = [
  { name: "Collect", Icon: Database }, { name: "Validate", Icon: ShieldCheck },
  { name: "Transform", Icon: Boxes }, { name: "Warehouse", Icon: Server },
];
const AI = ["Pattern Detection", "Forecast", "Recommendation", "Alert"];
const REPORT = [
  { name: "Dashboard", Icon: LayoutDashboard }, { name: "Generate", Icon: FileBarChart },
  { name: "PDF", Icon: FileBarChart }, { name: "Excel", Icon: Boxes },
  { name: "Email", Icon: Mail }, { name: "Scheduled", Icon: CalendarClock }, { name: "Delivered", Icon: CheckCircle2 },
];
const DECISION = [
  { name: "Alerts", Icon: AlertTriangle }, { name: "Recommend", Icon: Sparkles },
  { name: "Action", Icon: Target }, { name: "Decision", Icon: CheckCircle2 }, { name: "Growth", Icon: Rocket },
];

export function LivingAnalyticsConsole() {
  const [tick, setTick] = useState(0);
  const [vals, setVals] = useState<number[]>([58, 74, 46, 88, 63]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTick(999); return; }
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setVals((v) => v.map((x) => Math.max(30, Math.min(96, x + Math.round(Math.sin(Date.now() / 900 + x) * 8)))));
    }, 1600);
    return () => clearInterval(id);
  }, []);

  const reduce = tick === 999;
  const pipe = reduce ? PIPE.length : tick % PIPE.length;
  const ai = reduce ? AI.length : tick % AI.length;
  const rep = reduce ? REPORT.length : tick % REPORT.length;
  const dec = reduce ? DECISION.length : tick % DECISION.length;
  const warehouse = reduce ? 100 : (((tick % 4) + 1) / 4) * 100;

  return (
    <div className="glow-ring relative overflow-hidden rounded-3xl card-glass p-4 shadow-[0_30px_90px_-30px_rgba(0,0,0,.8)] lg:p-5">
      <span className="scan-line pointer-events-none absolute left-0 right-0 h-14 bg-gradient-to-b from-brand/10 to-transparent" />
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand/80" /><span className="text-[13px] font-semibold text-ink">KVJ Analytics Platform</span></div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand animate-glow-pulse" />Processing</span>
      </div>

      {/* ETL pipeline */}
      <Panel label="ETL Pipeline">
        <div className="flex items-stretch gap-1.5">
          {PIPE.map((p, i) => {
            const done = i < pipe, on = i === pipe;
            return (
              <React.Fragment key={i}>
                <div className={`flex flex-1 flex-col items-center gap-1 rounded-lg border p-2 transition-all duration-500 ${on ? "border-brand/60 bg-brand/10 shadow-[0_0_16px_-6px_rgba(16,185,129,0.7)]" : "border-line bg-white/[0.02]"}`}>
                  <span className={`grid h-6 w-6 place-items-center rounded-md ${on || done ? "bg-brand/15 text-brand" : "bg-white/[0.03] text-slate"}`}>
                    {p.name === "Validate" && (on || done) ? <CheckCircle2 className="h-3.5 w-3.5" /> : <p.Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span className="text-[9px] font-semibold text-slate">{p.name}</span>
                  {p.name === "Warehouse" && <span className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]"><span className="block h-full rounded-full bg-gradient-to-r from-brand to-corporate transition-[width] duration-700" style={{ width: `${warehouse}%` }} /></span>}
                </div>
                {i < PIPE.length - 1 && <span className="self-center text-[10px] text-brand/40">›</span>}
              </React.Fragment>
            );
          })}
        </div>
      </Panel>

      {/* executive dashboard */}
      <Panel label="Executive Dashboard">
        <div className="grid grid-cols-3 gap-2">
          <Mini title="Revenue"><Line /></Mini>
          <Mini title="Operational"><Bars vals={vals} /></Mini>
          <Mini title="Health"><Donut /></Mini>
        </div>
      </Panel>

      {/* AI intelligence */}
      <Panel label="AI Intelligence">
        <div className="grid grid-cols-2 gap-1.5">
          {AI.map((c, i) => {
            const on = i === ai, done = i < ai;
            return (
              <div key={i} className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 transition-all duration-500 ${on ? "border-brand/60 bg-brand/10" : done ? "border-brand/20 bg-white/[0.02]" : "border-line bg-white/[0.01] opacity-70"}`}>
                <Cpu className={`h-3 w-3 ${on || done ? "text-brand" : "text-slate"}`} />
                <span className="text-[10px] font-semibold text-ink">{c}</span>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* report automation */}
      <Panel label="Report Automation">
        <div className="flex flex-wrap items-center gap-1">
          {REPORT.map((r, i) => {
            const done = i < rep, on = i === rep;
            return (
              <div key={i} className={`flex items-center gap-1 rounded-full border px-2 py-1 transition-all duration-500 ${on ? "border-brand/60 bg-brand/12 text-brand" : done ? "border-brand/25 bg-white/[0.02] text-slate" : "border-line bg-white/[0.02] text-muted"}`}>
                {done ? <CheckCircle2 className="h-3 w-3 text-brand" /> : <r.Icon className="h-3 w-3" />}
                <span className="text-[9px] font-semibold">{r.name}</span>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* business decisions */}
      <Panel label="Business Decisions" last>
        <div className="flex flex-wrap items-center gap-1">
          {DECISION.map((d, i) => {
            const on = i <= dec;
            return (
              <React.Fragment key={i}>
                <div className={`flex items-center gap-1 rounded-lg border px-2 py-1 transition-all duration-500 ${on ? "border-brand/50 bg-brand/10 text-ink" : "border-line bg-white/[0.02] text-muted"}`}>
                  <d.Icon className={`h-3 w-3 ${on ? "text-brand" : "text-slate"}`} />
                  <span className="text-[9px] font-semibold">{d.name}</span>
                </div>
                {i < DECISION.length - 1 && <TrendingUp className="h-3 w-3 text-brand/40" />}
              </React.Fragment>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function Panel({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`rounded-2xl border border-line bg-white/[0.015] p-2.5 ${last ? "" : "mb-2.5"}`}>
      <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate">{label}</div>
      {children}
    </div>
  );
}
function Mini({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white/[0.02] p-2">
      <div className="mb-1 text-[8px] uppercase tracking-wider text-muted">{title}</div>
      {children}
    </div>
  );
}
function Bars({ vals }: { vals: number[] }) {
  return <div className="flex h-10 items-end gap-0.5">{vals.map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-corporate/40 to-brand/80 transition-[height] duration-700" style={{ height: `${h}%` }} />)}</div>;
}
function Line() {
  return <svg viewBox="0 0 100 40" className="h-10 w-full" preserveAspectRatio="none"><defs><linearGradient id="lac-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity="0.4" /><stop offset="100%" stopColor="#10B981" stopOpacity="0" /></linearGradient></defs><path d="M0 32 C14 28 20 12 32 16 S56 4 70 10 S92 5 100 7 L100 40 L0 40 Z" fill="url(#lac-l)" /><path d="M0 32 C14 28 20 12 32 16 S56 4 70 10 S92 5 100 7" fill="none" stroke="#10B981" strokeWidth="2" /></svg>;
}
function Donut() {
  return <div className="grid place-items-center"><svg viewBox="0 0 42 42" className="h-10 w-10 -rotate-90"><circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(167,177,196,0.15)" strokeWidth="6" /><circle cx="21" cy="21" r="15.9" fill="none" stroke="#10B981" strokeWidth="6" strokeDasharray="66 100" strokeLinecap="round" /></svg></div>;
}
