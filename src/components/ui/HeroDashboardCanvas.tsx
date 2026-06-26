"use client";

import React, { useEffect, useState, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

export function HeroDashboardCanvas() {
  const [progress, setProgress] = useState(0);
  const [trail, setTrail] = useState<{ x: number; y: number; z: number }[]>([]);
  const [isImpacted, setIsImpacted] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Flight path configuration coordinates (in relative px inside our 520x340 viewport)
  const alertLocalX = 185;
  const alertLocalY = 110;

  // Alert point (peak of purple line relative to container)
  const startX = 189; // 4px (left offset) + 185px (local alert x)
  const startY = 186; // 32px (top offset) + 36px (header) + 8px (padding) + 110px (local alert y)
  const startZ = 10;

  // Inbox folder entry slot
  const endX = 442; // 386px (folder left) + 56px (entry offset)
  const endY = 160;
  const endZ = -10;

  // Control point for a 3D curved trajectory (arches up and forward)
  const cpX = (startX + endX) / 2;
  const cpY = Math.min(startY, endY) - 80;
  const cpZ = 60; // moves forward in 3D space

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    
    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      
      const delta = time - lastTimeRef.current;
      
      // We animate the progress from 0 to 1 over 2.2 seconds (speed = 1 / 2200 ms)
      setProgress((prev) => {
        const next = prev + delta / 2200;
        
        if (next >= 1) {
          // Envelope enters the folder
          setIsImpacted(true);
          setTrail([]);
          
          // Trigger folder bounce animation, wait before resetting for the next flight
          delayTimer = setTimeout(() => {
            setIsImpacted(false);
            setProgress(0);
            lastTimeRef.current = null;
            // Trigger animation frame request
            requestRef.current = requestAnimationFrame(animate);
          }, 1500); // 1.5s delay between email notifications
          
          return 1;
        }
        
        // Calculate current envelope position on quadratic Bezier curve
        const u = 1 - next;
        const tt = next * next;
        const uu = u * u;
        
        const curX = uu * startX + 2 * u * next * cpX + tt * endX;
        const curY = uu * startY + 2 * u * next * cpY + tt * endY;
        const curZ = uu * startZ + 2 * u * next * cpZ + endZ;
        
        // Update trail
        setTrail((prevTrail) => {
          const newTrail = [...prevTrail, { x: curX, y: curY, z: curZ }];
          if (newTrail.length > 12) {
            newTrail.shift();
          }
          return newTrail;
        });

        // Request next frame
        requestRef.current = requestAnimationFrame(animate);
        return next;
      });
      
      lastTimeRef.current = time;
    };

    // Start animation loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      clearTimeout(delayTimer);
    };
  }, []);

  // Compute current envelope coordinates for rendering
  const u = 1 - progress;
  const tt = progress * progress;
  const uu = u * u;
  const envelopeX = uu * startX + 2 * u * progress * cpX + tt * endX;
  const envelopeY = uu * startY + 2 * u * progress * cpY + tt * endY;
  const envelopeZ = uu * startZ + 2 * u * progress * cpZ + endZ;

  // Render chart lines
  // Purple/Violet line points (contains the peak alert point at index 5)
  const purplePoints: Point[] = [
    { x: 30, y: 190 },
    { x: 60, y: 175 },
    { x: 90, y: 180 },
    { x: 120, y: 140 },
    { x: 150, y: 155 },
    { x: 185, y: 110 }, // Alert Peak
    { x: 210, y: 160 },
    { x: 240, y: 180 },
  ];

  const bluePoints: Point[] = [
    { x: 30, y: 160 },
    { x: 60, y: 150 },
    { x: 90, y: 120 },
    { x: 120, y: 130 },
    { x: 150, y: 115 },
    { x: 185, y: 145 },
    { x: 210, y: 135 },
    { x: 240, y: 150 },
  ];

  const greenPoints: Point[] = [
    { x: 30, y: 220 },
    { x: 60, y: 200 },
    { x: 90, y: 205 },
    { x: 120, y: 185 },
    { x: 150, y: 190 },
    { x: 185, y: 170 },
    { x: 210, y: 195 },
    { x: 240, y: 185 },
  ];

  const makePathD = (pts: Point[]) => {
    return pts.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      // Cubic bezier smoothing
      const prev = pts[i - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, "");
  };

  return (
    <div className="relative w-full max-w-[550px] mx-auto aspect-[4/3] flex items-center justify-center select-none py-4">
      
      {/* Holographic deep glow backdrop */}
      <div className="absolute inset-0 bg-radial-glow-teal opacity-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow opacity-30 rounded-full blur-[90px] pointer-events-none" />

      {/* 3D Transform Container */}
      <div 
        className="relative w-[540px] h-[340px] transition-transform duration-500 ease-out"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: "rotateX(20deg) rotateY(-22deg) rotateZ(4deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* ════════════ 1. LEFT SIDE: DATA DASHBOARD GLASS CARD ════════════ */}
          <div 
            className="absolute left-1 top-8 w-[270px] h-[240px] rounded-2xl bg-white/75 border border-slate-200/50 shadow-[0_16px_36px_rgba(11,31,58,0.06)] backdrop-blur-xl transition-all duration-300"
            style={{
              transform: "translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Header: Title and Legend */}
            <div className="flex justify-between items-center px-5 pt-4 pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold tracking-tight text-[#0B1F3A]">Data Dashboard</span>
              <div className="flex items-center gap-1.5 text-[8px] font-semibold text-slate-400">
                <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />Data</span>
                <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />Data</span>
                <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />Data</span>
              </div>
            </div>

            {/* Grid Area */}
            <div className="relative w-full h-[180px] px-3 pt-2">
              
              {/* Y Axis Labels and Horizontal Grid Lines */}
              <div className="absolute left-2 top-2 bottom-6 w-full flex flex-col justify-between text-[7px] font-mono text-slate-400">
                {["100", "80", "60", "40", "20", "0"].map((label, idx) => (
                  <div key={idx} className="flex items-center w-full gap-2">
                    <span className="w-5 text-right leading-none">{label}</span>
                    <div className="w-[215px] h-[1px] bg-slate-100/60" />
                  </div>
                ))}
              </div>

              {/* Chart Lines SVGs */}
              <svg className="absolute left-7 top-[7px] w-[215px] h-[145px] overflow-visible" viewBox="20 90 230 140">
                {/* Green Line */}
                <path 
                  d={makePathD(greenPoints)}
                  fill="none" 
                  stroke="#10B981" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  opacity="0.75"
                />
                {/* Blue Line */}
                <path 
                  d={makePathD(bluePoints)} 
                  fill="none" 
                  stroke="#06B6D4" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  opacity="0.8"
                />
                {/* Purple Line (Alert Line) */}
                <path 
                  d={makePathD(purplePoints)} 
                  fill="none" 
                  stroke="#8B5CF6" 
                  strokeWidth="3.2" 
                  strokeLinecap="round" 
                />

                {/* Draw small dots on points */}
                {purplePoints.map((p, idx) => {
                  if (idx === 5) return null; // Peak alert rendered separately with glow
                  return (
                    <circle key={`p-${idx}`} cx={p.x} cy={p.y} r="2.5" fill="#8B5CF6" />
                  );
                })}
              </svg>

              {/* Monthly Ticks (Bottom X Axis) */}
              <div className="absolute left-9 bottom-1.5 right-4 flex justify-between text-[8px] font-mono text-slate-400">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((m, idx) => (
                  <span key={idx}>{m}</span>
                ))}
              </div>

              {/* Neon Orange Pulse Alert Node at Peak Point */}
              <div 
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  left: `${alertLocalX}px`,
                  top: `${alertLocalY}px`,
                  transform: "translateZ(8px)",
                }}
              >
                {/* Outer flashing glow ring */}
                <span className="absolute w-6 h-6 rounded-full bg-[#FF6B00]/30 animate-ping" />
                {/* Inner pulsing ring */}
                <span className="absolute w-4 h-4 rounded-full bg-[#FF6B00]/40 border border-[#FF6B00] animate-[pulse_1s_infinite]" />
                {/* Core alert dot */}
                <span className="relative w-2.5 h-2.5 rounded-full bg-[#FF6B00] shadow-[0_0_10px_#FF6B00]" />
              </div>

            </div>
          </div>

          {/* ════════════ 2. FLYING ENVELOPE WITH MOTION TRAIL ════════════ */}
          {/* Motion Trail Dots */}
          {progress > 0 && progress < 1 && trail.map((pt, idx) => {
            const ratio = idx / trail.length;
            const opacity = ratio * 0.45;
            const scale = 0.3 + ratio * 0.7;
            return (
              <div
                key={idx}
                className="absolute pointer-events-none rounded-full bg-gradient-to-r from-[#FF6B00] to-[#D4AF37] shadow-[0_0_8px_#FF6B00]"
                style={{
                  left: `${pt.x}px`,
                  top: `${pt.y}px`,
                  width: "6px",
                  height: "6px",
                  transform: `translate3d(-50%, -50%, ${pt.z}px) scale(${scale})`,
                  opacity: opacity,
                  transition: "opacity 0.15s ease",
                }}
              />
            );
          })}

          {/* Curved Light Beam motion trail path (SVG outline) */}
          {progress > 0 && progress < 1 && (
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              style={{ transform: "translateZ(2px)" }}
            >
              <path
                d={`M ${startX} ${startY} Q ${cpX} ${cpY}, ${envelopeX} ${envelopeY}`}
                fill="none"
                stroke="url(#trailGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <defs>
                <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* The Flying Envelope (Navy Blue with Gold trim) */}
          {progress > 0 && progress < 1 && (
            <div
              className="absolute w-8 h-[22px] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[#0B1F3A] border-1.5 border-[#D4AF37] flex flex-col justify-between shadow-[0_4px_16px_rgba(212,175,55,0.4)] overflow-hidden"
              style={{
                left: `${envelopeX}px`,
                top: `${envelopeY}px`,
                transform: `translate3d(-50%, -50%, ${envelopeZ}px) rotateY(${-15 + progress * 10}deg) rotateZ(${-5 + progress * 15}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Back Flap representation */}
              <div className="w-full h-full relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 22">
                  <path d="M 0 0 L 16 11 L 32 0" fill="none" stroke="#D4AF37" strokeWidth="1" />
                  <path d="M 0 22 L 12 11" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.7" />
                  <path d="M 32 22 L 20 11" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.7" />
                </svg>
              </div>
            </div>
          )}

          {/* ════════════ 3. RIGHT SIDE: 3D GLASS FOLDER "INBOX" ════════════ */}
          <div 
            className="absolute right-1 top-12 w-[150px] h-[190px] flex flex-col justify-end"
            style={{
              transform: `translate3d(0px, 0px, 20px) scale(${isImpacted ? 1.06 : 1.0})`,
              transition: isImpacted ? "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)" : "transform 0.5s ease",
              transformStyle: "preserve-3d",
            }}
          >
            {/* "Inbox" Title label floating above folder */}
            <div 
              className="absolute -top-12 left-1/2 -translate-x-1/2 text-center animate-[float-slow_6s_ease-in-out_infinite]"
              style={{ transform: "translateZ(15px)" }}
            >
              <h4 className="text-[22px] font-bold font-display text-[#06B6D4] tracking-wider drop-shadow-[0_0_12px_rgba(6,182,212,0.45)] uppercase leading-none">
                Inbox
              </h4>
            </div>

            {/* Folder Body Container */}
            <div 
              className="relative w-full h-[155px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              
              {/* BACK PANEL OF FOLDER (Slightly larger, darker background) */}
              <div 
                className="absolute inset-0 rounded-2xl bg-slate-300/40 border border-slate-300/50 shadow-inner"
                style={{ transform: "translateZ(-8px)" }}
              >
                {/* Folder Top Tab */}
                <div className="absolute -top-3 left-4 w-14 h-4 bg-slate-300/40 border-t border-x border-slate-300/50 rounded-t-lg" />
              </div>

              {/* DOCS INSIDE FOLDER SLOT (Slides behind front cover) */}
              <div 
                className="absolute left-3 right-3 top-2 h-[125px] rounded-lg bg-white border border-slate-200 shadow-sm p-3 flex flex-col justify-between"
                style={{ 
                  transform: `translateZ(-2px) translateY(${isImpacted ? "10px" : "0px"})`,
                  transition: "transform 0.25s ease",
                }}
              >
                <div className="space-y-1.5">
                  <div className="w-8 h-1.5 bg-[#06B6D4]/30 rounded-full" />
                  <div className="w-16 h-1 bg-slate-200 rounded-full" />
                  <div className="w-12 h-1 bg-slate-200 rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-5 h-5 rounded-full bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 flex items-center justify-center text-[7px] font-bold text-[#0B1F3A]">K</div>
                  <div className="w-8 h-1 bg-[#D4AF37]/55 rounded-full" />
                </div>
              </div>

              {/* FRONT COVER FLAP OF FOLDER (Tilted forward in 3D, Glassmorphic) */}
              <div 
                className="absolute inset-x-0 bottom-0 h-[130px] rounded-2xl bg-white/40 border border-white/60 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center"
                style={{ 
                  transform: "rotateX(-6deg) translateZ(10px)",
                  transformOrigin: "bottom center",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)"
                }}
              >
                {/* Envelope Outline on Folder Flap */}
                <div className="w-12 h-8 rounded border-2 border-white/80 flex items-center justify-center shadow-inner relative overflow-hidden bg-white/10">
                  <svg className="w-full h-full" viewBox="0 0 24 16">
                    <path d="M 2 2 L 12 9 L 22 2" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
