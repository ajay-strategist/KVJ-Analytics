import React from "react";

/**
 * Decorative, abstract analytics-dashboard illustration for the home hero.
 * Pure SVG + brand tokens — no textual claims or figures.
 */
export function HeroVisual() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      {/* Soft glow behind the card */}
      <div className="absolute inset-0 -m-8 bg-radial-glow rounded-[40px] pointer-events-none" />

      {/* Main dashboard card */}
      <div className="relative glass-panel rounded-card shadow-lg p-5 md:p-6 border border-line">
        {/* Window chrome */}
        <div className="flex items-center gap-2 mb-5">
          <span className="h-2.5 w-2.5 rounded-full bg-cta" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-education/40" />
        </div>

        {/* Abstract summary tiles (no figures) */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {["bg-brand", "bg-education", "bg-cta"].map((tone) => (
            <div key={tone} className="rounded-xl border border-line bg-white/70 px-3 py-3">
              <div className={`h-2.5 w-10 rounded-full ${tone} mb-2 opacity-80`} />
              <div className="h-1.5 w-14 rounded-full bg-line" />
            </div>
          ))}
        </div>

        {/* Bar + line chart */}
        <div className="rounded-xl border border-line bg-white/70 p-4">
          <svg viewBox="0 0 320 150" className="w-full h-auto" role="img" aria-label="Analytics illustration">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A56DB" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(249,115,22,0.28)" />
                <stop offset="100%" stopColor="rgba(249,115,22,0)" />
              </linearGradient>
            </defs>

            {/* bars */}
            {[
              [20, 70],
              [70, 50],
              [120, 85],
              [170, 40],
              [220, 95],
              [270, 60],
            ].map(([x, h], i) => (
              <rect
                key={i}
                x={x}
                y={135 - h}
                width="26"
                height={h}
                rx="5"
                fill="url(#barGrad)"
                opacity={0.9}
              />
            ))}

            {/* trend area + line (orange accent) */}
            <path
              d="M10 110 L60 95 L110 100 L160 60 L210 70 L260 35 L310 45 L310 135 L10 135 Z"
              fill="url(#areaGrad)"
            />
            <path
              d="M10 110 L60 95 L110 100 L160 60 L210 70 L260 35 L310 45"
              fill="none"
              stroke="#F97316"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              [10, 110],
              [60, 95],
              [110, 100],
              [160, 60],
              [210, 70],
              [260, 35],
              [310, 45],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke="#F97316" strokeWidth="2" />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
