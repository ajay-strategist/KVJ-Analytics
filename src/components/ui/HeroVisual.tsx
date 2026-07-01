"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  TrendingUp, Activity
} from "lucide-react";

interface LogEntry {
  id: number;
  date: string;
  text: string;
}

export function HeroVisual() {
  const [logs, setLogs] = useState<LogEntry[]>(() => [
    { id: 1, date: "Mar 26", text: "Marketing ROI: Europe campaign verified at 3.8x" },
    { id: 2, date: "Apr 26", text: "System Pulse: Data integration node synced successfully" },
    { id: 3, date: "May 26", text: "Model Alert: USA region Q2 sales variance detected -4.2%" },
  ]);
  const spacing = 71.42;

  // Unified scroll state for line chart
  const [scrollState, setScrollState] = useState<{
    offset: number;
    vals: number[];
    dates: string[];
  }>(() => {
    const initialVals = [50, 52, 49, 54, 51, 56, 59, 55, 62, 64];
    const initialDates = [
      "Jul 25", "Sep 25", "Nov 25", "Jan 26", "Mar 26", "May 26", "Jul 26", "Sep 26", "Nov 26", "Jan 27"
    ];
    return {
      offset: 0,
      vals: initialVals,
      dates: initialDates
    };
  });

  const [barValues, setBarValues] = useState<number[]>([65, 82, 45, 78]);
  const [radialPercent, setRadialPercent] = useState<number>(94.8);

  const currentDateRef = useRef(new Date(2027, 0, 1)); 

  // Step-morphing animation loop (every 2.2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollState((prev) => {
        const lastVal = prev.vals[prev.vals.length - 1];
        const change = (Math.random() - 0.5) * 35;
        const nextVal = Math.max(15, Math.min(92, lastVal + change));
        const nextVals = [...prev.vals.slice(1), nextVal];

        const curDate = currentDateRef.current;
        const nextDate = new Date(curDate);
        nextDate.setMonth(curDate.getMonth() + 2);
        currentDateRef.current = nextDate;

        const monthName = nextDate.toLocaleString("en-US", { month: "short" });
        const yearTwoDigit = nextDate.toLocaleString("en-US", { year: "2-digit" });
        const nextDateLabel = `${monthName} ${yearTwoDigit}`;
        const nextDates = [...prev.dates.slice(1), nextDateLabel];

        const activeMonth = prev.dates[9];
        const changePercent = parseFloat(((nextVal - lastVal) / (lastVal || 1) * 100).toFixed(1));
        
        const logTemplates = [
          `Stream Feed: Data processing optimized (+${changePercent}%)`,
          `Insight Engine: Target classification matching at 98.4%`,
          `API Broadcast: Sync dispatch completed in 1.4ms`,
          `Database Node: Transformed transactional records successfully`,
        ];
        const logMsg = logTemplates[Math.floor(Math.random() * logTemplates.length)];

        setLogs((prevLogs) => [
          ...prevLogs.slice(-2),
          { id: Date.now(), date: activeMonth, text: logMsg }
        ]);

        // Animate bar values
        setBarValues((prevBars) =>
          prevBars.map((val) => {
            const delta = (Math.random() - 0.5) * 20;
            return Math.max(15, Math.min(98, val + delta));
          })
        );

        // Animate radial optimization percentage
        setRadialPercent((prevRad) => {
          const delta = (Math.random() - 0.5) * 2.2;
          return Math.max(88.5, Math.min(99.4, prevRad + delta));
        });

        return {
          offset: 0,
          vals: nextVals,
          dates: nextDates
        };
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const { vals: chartVals, dates } = scrollState;

  const svgWidth = 320;
  const svgHeight = 110;
  const totalSvgHeight = 130; 

  const points = chartVals.map((val, idx) => {
    const x = idx * (svgWidth / (chartVals.length - 1));
    const y = svgHeight - (val / 100) * (svgHeight - 20) - 10;
    return { x, y };
  });

  const linePath = points.reduce((acc, p, idx) => {
    return acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }, "");

  const areaPath = linePath + ` L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  const lastIdx = chartVals.length - 1;
  const activeVal = chartVals[lastIdx] || 50;
  const prevActiveVal = chartVals[lastIdx - 1] || activeVal;
  const isUpTrend = activeVal >= prevActiveVal;

  const themeColor = isUpTrend ? "#00F0FF" : "#0072FF";
  const strokeGradId = `chartDynamicStrokeGrad-${isUpTrend ? "up" : "down"}`;
  const fillGradId = `chartDynamicFillGrad-${isUpTrend ? "up" : "down"}`;
  
  const liveCoord = points[lastIdx];

  // Radial Gauge Math
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * radialPercent) / 100;

  return (
    <div className="relative w-full max-w-none flex items-center justify-center py-6 select-none font-body">
      {/* Background ambient neon cyan/blue glowing backlights */}
      <div 
        className="absolute top-[10%] left-[10%] w-80 h-80 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[7s]" 
        style={{ backgroundColor: `${themeColor}08` }}
      />
      <div 
        className="absolute bottom-[10%] right-[10%] w-[340px] h-[340px] rounded-full blur-[130px] pointer-events-none animate-pulse duration-[9s]" 
        style={{ backgroundColor: `${themeColor}0c` }}
      />

      {/* Main Glass Dashboard Shell */}
      <div className="relative w-full p-5 rounded-[24px] bg-[#0A0A0E]/70 backdrop-blur-[24px] border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.5)] flex flex-col gap-5 overflow-hidden">
        
        {/* Sleek Futuristic Header Status Bar (Removed KVJ Engine Core as requested) */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-200">
              [ REAL-TIME METRICS BROADCAST ]
            </span>
          </div>
          <div className="text-[8px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase tracking-wider">
            STABLE // LATENCY 12ms
          </div>
        </div>

        {/* Main Columns Grid: Line Chart on the left, auxiliary widgets on the right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Main Line Chart (spans 8 columns) */}
          <div className="md:col-span-8 rounded-xl border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-between group hover:border-brand/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-200 font-bold">
                REVENUE FLOW & CONVERSIONS
              </span>
              <div className="flex items-center gap-1 text-[8px] font-mono text-brand font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                <span className="uppercase">SALES PULSE</span>
              </div>
            </div>

            {/* Glowing Line Chart Area */}
            <div className="relative w-full h-[125px] overflow-hidden">
              <svg viewBox={`0 0 ${svgWidth} ${totalSvgHeight}`} width="100%" height="100%" preserveAspectRatio="none" className="overflow-hidden">
                <style dangerouslySetInnerHTML={{ __html: `
                  .chart-path-line {
                    stroke-dasharray: 600;
                    stroke-dashoffset: 600;
                    animation: draw-chart-line 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                  }
                  @keyframes draw-chart-line {
                    to { stroke-dashoffset: 0; }
                  }
                `}} />
                <defs>
                  <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={themeColor} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={themeColor} stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id={strokeGradId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={themeColor} />
                    <stop offset="100%" stopColor={themeColor} stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1={svgHeight * 0.25} x2={svgWidth} y2={svgHeight * 0.25} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1={svgHeight * 0.5} x2={svgWidth} y2={svgHeight * 0.5} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1={svgHeight * 0.75} x2={svgWidth} y2={svgHeight * 0.75} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Static Morphing Group */}
                <g className="will-change-transform">
                  <path
                    d={areaPath}
                    fill={`url(#${fillGradId})`}
                    style={{
                      transition: "d 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />

                  <path
                    d={linePath}
                    fill="none"
                    stroke={`url(#${strokeGradId})`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="chart-path-line"
                    style={{
                      transition: "d 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />

                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#050507"
                        stroke={idx === lastIdx ? themeColor : "rgba(255,255,255,0.15)"}
                        strokeWidth="1.2"
                        style={{
                          transition: "cy 0.8s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.8s ease",
                        }}
                      />
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="1"
                        fill={idx === lastIdx ? themeColor : "rgba(255,255,255,0.1)"}
                        style={{
                          transition: "cy 0.8s cubic-bezier(0.22, 1, 0.36, 1), fill 0.8s ease",
                        }}
                      />
                    </g>
                  ))}

                  {/* Dates */}
                  {points.map((p, idx) => {
                    const label = dates[idx];
                    if (!label) return null;
                    return (
                      <text
                        key={`date-${idx}`}
                        x={p.x}
                        y={svgHeight + 15}
                        textAnchor="middle"
                        fill={idx === lastIdx ? "#ffffff" : "#9ca3af"}
                        className={`text-[8px] font-mono transition-all duration-300 ${idx === lastIdx ? "font-bold animate-pulse" : "font-semibold"}`}
                        style={{
                          transition: "x 0.8s cubic-bezier(0.22, 1, 0.36, 1), fill 0.8s ease",
                        }}
                      >
                        {label}
                      </text>
                    );
                  })}

                  {/* Live pulsing dot */}
                  {liveCoord && (
                    <g
                      style={{
                        transform: `translate(${liveCoord.x}px, ${liveCoord.y}px)`,
                        transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r="9"
                        fill={themeColor}
                        opacity="0.32"
                        className="animate-ping"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="4"
                        fill={themeColor}
                      />
                    </g>
                  )}
                </g>
              </svg>
            </div>
          </div>

          {/* Right auxiliary widget panel: Radial Gauge + Regional Bar Chart (spans 4 columns) */}
          <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-4">
            
            {/* 1. Animated Radial Progress Gauge */}
            <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand/20 transition-all duration-300">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-300 mb-3 block text-center font-bold">
                SYSTEM EFFICIENCY
              </span>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
                  {/* Background Track */}
                  <circle cx="30" cy="30" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                  {/* Glowing active circle */}
                  <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    fill="none"
                    stroke={themeColor}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 0.3s ease-out, stroke 0.8s ease",
                      filter: `drop-shadow(0 0 3px ${themeColor})`,
                    }}
                  />
                  {/* Inner technical ring */}
                  <circle cx="30" cy="30" r={16} fill="none" stroke="rgba(0, 240, 255, 0.08)" strokeWidth="1" strokeDasharray="4 2" className="animate-[spin_20s_linear_infinite]" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-sm font-mono font-bold text-white leading-none">
                    {radialPercent.toFixed(1)}%
                  </span>
                  <span className="text-[6px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                    OPTIMIZED
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Live regional bar chart */}
            <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] p-4 flex flex-col justify-between group hover:border-brand/20 transition-all duration-300">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-300 mb-2 block text-center font-bold">
                LOAD DISTRIBUTION
              </span>
              <div className="flex justify-between items-end h-[64px] px-2 pt-2">
                {barValues.map((val, idx) => {
                  const labels = ["US", "EU", "IN", "AE"];
                  const colors = ["#00F0FF", "#0072FF", "#00F0FF", "#0072FF"];
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1">
                      <div className="relative w-2 h-11 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="absolute bottom-0 w-full rounded-full transition-all duration-300"
                          style={{
                            height: `${val}%`,
                            backgroundColor: colors[idx],
                            boxShadow: `0 0 8px ${colors[idx]}70`,
                          }}
                        />
                      </div>
                      <span className="text-[7.5px] font-mono text-slate-200 font-bold mt-1.5">{labels[idx]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Live Terminal Console (scrolling logs) */}
        <div className="rounded-xl border border-white/5 bg-[#050507]/90 p-4 font-mono text-[9px] relative overflow-hidden group">
          <div className="absolute top-3.5 right-4 text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-brand" />
            <span className="text-[8px] tracking-widest font-bold">STATUS FEED</span>
          </div>
          <div className="space-y-2 max-h-[85px] overflow-hidden">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 transition-all duration-300 ease-out">
                <span className="text-brand/90 font-bold">[{log.date}]</span>
                <span className="text-slate-400 font-bold">&gt;</span>
                <span className="text-slate-200 flex-1 break-all font-medium">{log.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Floating Badges overlapping the edges */}
      <div className="absolute top-[2%] right-[-15px] rounded-2xl border border-brand/30 bg-[#0A0A0F]/95 p-3.5 shadow-[0_15px_30px_rgba(0,0,0,0.6)] max-w-[145px] z-10 transition-transform duration-300 hover:scale-105 backdrop-blur-xl">
        <div className="flex items-center gap-1.5 mb-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-brand" />
          <span className="text-[8px] font-bold text-white uppercase tracking-wider">Growth rate</span>
        </div>
        <div
          className="text-base font-bold font-mono leading-none mb-1 transition-colors duration-[800ms]"
          style={{ color: themeColor }}
        >
          {isUpTrend ? "+142.8%" : "-15.4%"}
        </div>
        <p className="text-[8px] text-slate-300 leading-normal font-mono font-medium">
          {isUpTrend ? "Automation saves 12x time" : "Downside correction period"}
        </p>
      </div>
    </div>
  );
}
