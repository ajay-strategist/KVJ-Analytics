"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutGrid, Target, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RevealText } from "@/components/ui/RevealText";

const TRAINING_AREAS = [
  "Advanced Excel",
  "Power BI",
  "Data Analytics",
  "Dashboard Development",
  "Financial Analytics",
  "Automation Tools",
  "Business Intelligence",
];

const OUR_APPROACH = [
  "Hands-On Learning",
  "Real Business Scenarios",
  "Industry-Oriented Curriculum",
  "Assignment-Based Practice",
  "Placement-Focused Skill Development",
];

type Course = {
  title: string;
  slug: string;
  segment?: string;
  summary?: string;
  priceINR?: number;
  isPaid?: boolean;
  thumbnail?: string | null;
};

// ────────────────────────────────────────────────────────
// Scroll Drawing Checkmark Component
// ────────────────────────────────────────────────────────
const ScrollDrawCheckmark = ({ delay }: { delay: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <span 
      ref={ref} 
      className="grid place-items-center h-6 w-6 rounded-full bg-[#0072FF]/10 shrink-0 relative overflow-visible"
    >
      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 overflow-visible">
        <path
          d="M 5 12 L 10 17 L 19 7"
          fill="none"
          stroke="#0072FF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 30,
            strokeDashoffset: inView ? 0 : 30,
            transition: `stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
            transitionDelay: `${delay}ms`,
            filter: "drop-shadow(0 0 5px rgba(0, 114, 255, 0.85))"
          }}
        />
      </svg>
    </span>
  );
};

// ────────────────────────────────────────────────────────
// Course Holograms
// ────────────────────────────────────────────────────────

// Python Course: Matrix code rain + rotating Python logo
function PythonCourseHologram() {
  return (
    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#08080A]/60 border border-white/5 mb-5 flex items-center justify-center">
      {/* Matrix rain background */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 160 100">
          <g fontSize="6" fontFamily="monospace" fill="#00F0FF" className="animate-[fade-up-data_3s_linear_infinite]">
            <text x="10" y="20">010101</text>
            <text x="10" y="40">110010</text>
            <text x="10" y="60">001101</text>
          </g>
          <g fontSize="6" fontFamily="monospace" fill="#D4AF37" className="animate-[fade-up-data_4s_linear_infinite_1s]">
            <text x="70" y="10">PYTHON</text>
            <text x="70" y="30">IMPORT</text>
            <text x="70" y="50">DEF</text>
          </g>
          <g fontSize="6" fontFamily="monospace" fill="#0072FF" className="animate-[fade-up-data_2.5s_linear_infinite_0.5s]">
            <text x="130" y="25">EXEC</text>
            <text x="130" y="45">VAR</text>
            <text x="130" y="65">LOOP</text>
          </g>
        </svg>
      </div>

      {/* 3D Glowing Python Logo */}
      <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 animate-[spin-slow_15s_linear_infinite]">
        <defs>
          <filter id="pyGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#pyGlow)" style={{ transformOrigin: "50px 50px" }}>
          {/* Upper Snake (Blue) */}
          <path d="M50,15 C30,15 32,28 32,28 L32,38 L51,38 C56,38 60,42 60,47 L60,65 C60,65 75,63 75,48 C75,32 70,15 50,15 Z" fill="#0072FF" />
          {/* Lower Snake (Gold) */}
          <path d="M50,85 C70,85 68,72 68,72 L68,62 L49,62 C44,62 40,58 40,53 L40,35 C40,35 25,37 25,52 C25,68 30,85 50,85 Z" fill="#D4AF37" />
          {/* Eyes */}
          <circle cx="42" cy="24" r="1.5" fill="#FFFFFF" />
          <circle cx="58" cy="76" r="1.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}

// Power BI Course: Rising 3D Columns
function PowerBICourseHologram() {
  return (
    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#08080A]/60 border border-white/5 mb-5 flex items-center justify-center">
      <svg viewBox="0 0 120 80" className="w-20 h-20 overflow-visible">
        <g transform="translate(60, 45) rotate(-20) skewX(20) scale(0.9)">
          {/* Base Plate */}
          <polygon points="-30,-20 30,-20 30,20 -30,20" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
          
          {/* Rising Bars */}
          <g className="animate-[bar-grow_3s_ease-in-out_infinite_0.1s]" style={{ transformOrigin: "-17px 0px" }}>
            <rect x="-20" y="-12" width="6" height="12" fill="#F2C811" />
          </g>
          <g className="animate-[bar-grow_3s_ease-in-out_infinite_0.6s]" style={{ transformOrigin: "-5px 0px" }}>
            <rect x="-8" y="-22" width="6" height="22" fill="#F29F05" />
          </g>
          <g className="animate-[bar-grow_3s_ease-in-out_infinite_1.2s]" style={{ transformOrigin: "7px 0px" }}>
            <rect x="4" y="-32" width="6" height="32" fill="#E27602" />
          </g>
          
          {/* Trend line */}
          <path d="M -17 -10 Q -5 -20 7 -30" fill="none" stroke="#00F0FF" strokeWidth="1.5" />
          <circle cx="7" cy="-30" r="1.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}

// Excel Course: Pulsing grid sheet
function ExcelCourseHologram() {
  return (
    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#08080A]/60 border border-white/5 mb-5 flex items-center justify-center">
      <svg viewBox="0 0 100 80" className="w-16 h-16 overflow-visible">
        {/* Grid body */}
        <rect x="10" y="10" width="80" height="60" rx="4" fill="none" stroke="#10B981" strokeWidth="1.5" />
        {/* Grid lines */}
        <line x1="30" y1="10" x2="30" y2="70" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
        <line x1="55" y1="10" x2="55" y2="70" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
        <line x1="80" y1="10" x2="80" y2="70" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
        
        <line x1="10" y1="25" x2="90" y2="25" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
        <line x1="10" y1="40" x2="90" y2="40" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
        <line x1="10" y1="55" x2="90" y2="55" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />

        {/* Pulsing active nodes */}
        <circle cx="42.5" cy="32.5" r="2.5" fill="#D4AF37" className="animate-ping" />
        <circle cx="42.5" cy="32.5" r="2" fill="#D4AF37" />
        
        <circle cx="67.5" cy="47.5" r="2.5" fill="#00F0FF" className="animate-pulse" />
        <circle cx="67.5" cy="47.5" r="2" fill="#00F0FF" />
      </svg>
    </div>
  );
}

// Generic fallback course hologram
function DefaultCourseHologram() {
  return (
    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#08080A]/60 border border-white/5 mb-5 flex items-center justify-center">
      <svg viewBox="0 0 100 80" className="w-16 h-16 overflow-visible">
        <circle cx="50" cy="40" r="25" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.2" strokeDasharray="3, 3" />
        <g className="animate-[spin_12s_linear_infinite]" style={{ transformOrigin: "50px 40px" }}>
          <line x1="50" y1="40" x2="25" y2="25" stroke="rgba(0, 114, 255, 0.3)" strokeWidth="1" />
          <line x1="50" y1="40" x2="75" y2="25" stroke="rgba(0, 114, 255, 0.3)" strokeWidth="1" />
          <line x1="50" y1="40" x2="50" y2="65" stroke="rgba(0, 114, 255, 0.3)" strokeWidth="1" />
          
          <circle cx="25" cy="25" r="4.5" fill="#050505" stroke="#0072FF" strokeWidth="1.5" />
          <circle cx="75" cy="25" r="4.5" fill="#050505" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="50" cy="65" r="4.5" fill="#050505" stroke="#00F0FF" strokeWidth="1.5" />
        </g>
        <circle cx="50" cy="40" r="5" fill="#00F0FF" className="animate-pulse" />
      </svg>
    </div>
  );
}

const FLOATING_CLASSES = [
  "animate-[float-tag-1_6s_ease-in-out_infinite]",
  "animate-[float-tag-2_8s_ease-in-out_infinite_0.5s]",
  "animate-[float-tag-3_7s_ease-in-out_infinite_1s]",
  "animate-[float-tag-1_9s_ease-in-out_infinite_1.5s]",
  "animate-[float-tag-2_6s_ease-in-out_infinite_2s]",
  "animate-[float-tag-3_8s_ease-in-out_infinite_2.5s]",
  "animate-[float-tag-1_7s_ease-in-out_infinite_3s]",
];

export function TrainingClientContent({ courses }: { courses: Course[] }) {
  return (
    <div className="w-full bg-[#050505] text-slate-100 relative min-h-screen">
      {/* Page-wide training keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-tag-1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes float-tag-2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes float-tag-3 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        .btn-magnetic-gold {
          border-color: rgba(255, 255, 255, 0.08) !important;
          transition: all 0.3s ease !important;
        }
        .btn-magnetic-gold:hover {
          border-color: #D4AF37 !important;
          color: #D4AF37 !important;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.25) !important;
          background: rgba(212, 175, 55, 0.05) !important;
        }
      `}} />

      {/* ───── HERO + INFO ───── */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pb-28 border-b border-white/5">
        <div className="blob animate-blob absolute -top-24 right-[-4rem] w-[30rem] h-[30rem] bg-brand/10 pointer-events-none blur-[100px]" />
        <div className="blob animate-blob absolute bottom-[-6rem] left-[-4rem] w-[24rem] h-[24rem] bg-corporate/8 pointer-events-none blur-[90px]" style={{ animationDelay: "4s" }} />

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Reveal>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand px-3.5 py-1.5 bg-brand/10 rounded-full w-fit border border-brand/20 mx-auto block mb-6">
                Training &amp; Academy
              </span>
            </Reveal>
            <RevealText
              as="h1"
              text="Training & Skill Development"
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-white mb-5"
            />
            <Reveal delay={150}>
              <p className="text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-brand via-corporate to-brand animate-[signature-flow_6s_linear_infinite] bg-[size:200%_auto] mb-5">
                Practical Learning With Industry Relevance
              </p>
              <p className="text-lg text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
                Our programs are designed to build real-world skills through hands-on learning, live
                datasets, and practical assignments.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="#courses" variant="accent">
                  Explore Our Courses
                  <ChevronDown className="w-4 h-4 ml-1.5 inline-block" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* 3D Tag Cloud & Approach */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
            
            {/* Left: Floating 3D Tag Cloud */}
            <Reveal className="bg-[#0A0A0C]/70 border border-white/5 rounded-[32px] p-8 sm:p-10 backdrop-blur-xl min-h-[340px]">
              <div className="flex items-center gap-3 mb-8">
                <span className="grid place-items-center h-12 w-12 rounded-2xl bg-brand/10 border border-brand/20 text-brand">
                  <LayoutGrid className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-bold text-white">Training Areas</h2>
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-start relative py-4">
                {TRAINING_AREAS.map((area, idx) => (
                  <span
                    key={area}
                    className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#0A0A0C] text-brand border border-brand/25 cursor-default hover:border-brand hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:scale-105 transition-all duration-300 ${
                      FLOATING_CLASSES[idx % FLOATING_CLASSES.length]
                    }`}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Right: Sequential Scroll checklist */}
            <Reveal delay={120} className="bg-[#0A0A0C]/70 border border-white/5 rounded-[32px] p-8 sm:p-10 backdrop-blur-xl min-h-[340px]">
              <div className="flex items-center gap-3 mb-8">
                <span className="grid place-items-center h-12 w-12 rounded-2xl bg-corporate/10 border border-corporate/20 text-corporate">
                  <Target className="w-6 h-6" />
                </span>
                <h2 className="text-2xl font-bold text-white">Our Approach</h2>
              </div>
              <ul className="space-y-4">
                {OUR_APPROACH.map((item, idx) => (
                  <li key={item} className="flex items-center gap-4">
                    <ScrollDrawCheckmark delay={idx * 150} />
                    <span className="text-sm font-mono text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

          </div>
        </Container>
      </section>

      {/* ───── COURSES CATALOG ───── */}
      <section id="courses" className="py-24 relative bg-[#050505] scroll-mt-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand px-3 py-1 bg-brand/10 rounded-full border border-brand/20">
              Active Programs
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-5">
              Explore Our Courses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <Reveal key={idx} delay={(idx % 3) * 100} className="h-full">
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const isExcel = course.slug.toLowerCase().includes("excel");
  const isPowerBI = course.slug.toLowerCase().includes("power");
  const isPython = course.slug.toLowerCase().includes("python");

  return (
    <div className="bg-[#0A0A0C]/75 border border-white/5 rounded-[32px] p-6 backdrop-blur-[24px] hover:border-brand/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col h-full group transition-all duration-500 hover:-translate-y-2">
      {/* 3D Hologram graphic header inside card */}
      {isPython ? (
        <PythonCourseHologram />
      ) : isPowerBI ? (
        <PowerBICourseHologram />
      ) : isExcel ? (
        <ExcelCourseHologram />
      ) : (
        <DefaultCourseHologram />
      )}

      <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-brand transition-colors duration-300">
        {course.title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed font-light mb-6 flex-grow">{course.summary}</p>

      <div className="border-t border-white/10 pt-4 flex items-center justify-between mt-auto">
        <div>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.12em] block leading-none">
            {course.isPaid ? "Investment" : "Program Code"}
          </span>
          <span className="text-base font-bold text-white font-mono mt-1.5 block">
            {course.isPaid ? `₹${course.priceINR}` : "Campus Access"}
          </span>
        </div>
        
        {/* Magnetic view details button with gold hover accent border */}
        <Button href={`/training/${course.slug}`} variant="secondary" className="px-4 py-2 text-xs btn-magnetic-gold">
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
