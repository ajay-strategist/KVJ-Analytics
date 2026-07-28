"use client";
 
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Cpu,
  Laptop,
  Users,
  Sparkles,
  Smartphone,
  Tablet,
  Play,
  CheckSquare,
  FileText,
  Clock,
  Compass,
  ArrowUpRight,
  LogIn,
  User,
  Code,
  Target,
  AlertCircle,
  Database,
  Settings,
  BarChart3,
  Gauge,
  FileSpreadsheet,
  TrendingUp
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { CTASection } from "@/components/ui/CTASection";
 
interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  type: "self_serve" | "inquiry";
}
 
interface TrainingHubClientProps {
  categories: Category[];
  hub: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    intro: string;
    cta: {
      title: string;
      description: string;
      primaryCtaText: string;
      primaryCtaHref: string;
      secondaryCtaText: string;
      secondaryCtaHref: string;
    };
  };
}
 
// Icon map matching slugs
const CATEGORY_ICONS: Record<string, any> = {
  "one-to-one": Users,
  corporate: Cpu,
  colleges: GraduationCap,
  "online-courses": Laptop,
  internships: BookOpen,
};
 
// ────────────────────────────────────────────────────────
// Interactive Tilt Bento Card
// ────────────────────────────────────────────────────────
interface BentoCardProps {
  category: Category;
  className?: string;
  icon: any;
  delay?: number;
  variant?: "large" | "medium" | "wide";
}
 
function BentoCard({ category, className = "", icon: Icon, delay = 0, variant = "medium" }: BentoCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
 
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    
    // Spotlight position
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
 
    // Tilt calculations (-0.5 to 0.5 normalized)
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -normY * 10, y: normX * 10 });
  };
 
  const handleMouseLeave = () => {
    setHovered(false);
    setRotate({ x: 0, y: 0 });
  };
 
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`perspective-container relative rounded-[32px] overflow-hidden border border-line bg-[#0E1117]/85 backdrop-blur-xl transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hovered ? "border-brand/40 shadow-[0_24px_60px_rgba(67,245,255,0.06)]" : "shadow-soft"
      } ${className}`}
      style={{
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${hovered ? 1.012 : 1})`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background Image with zoom & overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
        style={{
          backgroundImage: `url(${category.image_url})`,
          transform: hovered ? "scale(1.05) translateZ(10px)" : "scale(1) translateZ(0)",
        }}
      />
      {/* Cinematic dark mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/75 to-[#050608]/20 z-10 pointer-events-none" />
 
      {/* Custom spotlight glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-15"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(67, 245, 255, 0.065), transparent 80%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
 
      {/* Hover lighting highlight border glow */}
      <div 
        className="absolute inset-[-1px] rounded-[32px] border border-transparent z-25 pointer-events-none transition-colors duration-500" 
        style={{
          borderColor: hovered ? "rgba(67, 245, 255, 0.25)" : "transparent"
        }}
      />
 
      {/* Card Content wrapper */}
      <Link
        href={`/training/${category.slug}`}
        className="relative z-20 h-full w-full p-8 md:p-10 flex flex-col justify-end min-h-[360px] lg:min-h-full text-left"
        style={{ transform: hovered ? "translateZ(20px)" : "translateZ(0)", transition: "transform 0.4s ease" }}
      >
        <div className="mt-auto space-y-4">
          {/* Badge & Icon header */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
              hovered ? "bg-brand border-brand text-black scale-110" : "bg-[#43F5FF]/10 border-[#43F5FF]/20 text-[#43F5FF]"
            }`}>
              <Icon className={`w-5 h-5 ${hovered ? "rotate-12 duration-300" : ""}`} />
            </div>
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#43F5FF] uppercase px-2.5 py-1 rounded-full bg-[#43F5FF]/10 border border-[#43F5FF]/15">
              {category.type === "inquiry" ? "B2B / Program" : "Self-Serve"}
            </span>
          </div>
 
          {/* Text content */}
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold font-display text-white group-hover:text-[#43F5FF] transition-colors flex items-center gap-2">
              {category.name}
              <ArrowRight className={`w-5 h-5 transition-all duration-300 text-brand ${
                hovered ? "opacity-100 translate-x-1" : "opacity-0 -translate-x-1"
              }`} />
            </h3>
            <p className={`text-slate text-sm font-light leading-relaxed max-w-md transition-colors duration-300 ${
              hovered ? "text-zinc-200" : "text-zinc-400"
            }`}>
              {category.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
 
// ────────────────────────────────────────────────────────
// Floating Feature Outline Card
// ────────────────────────────────────────────────────────
function FloatingFeatureCard({ icon: Icon, label, desc, delay = 0, floatClass = "float-a" }: any) {
  return (
    <Reveal delay={delay} variant="scale" className="h-full">
      <div className={`bg-[#0E1117]/65 border border-line hover:border-[#43F5FF]/30 p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft text-left group h-full relative overflow-hidden ${floatClass}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 text-[#43F5FF] group-hover:rotate-12 duration-300" />
        </div>
        <div className="space-y-1">
          <h4 className="text-white text-base font-semibold tracking-wide font-display group-hover:text-brand transition-colors">{label}</h4>
          <p className="text-zinc-400 text-xs leading-relaxed font-light">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}
 
export function TrainingHubClient({ categories, hub }: TrainingHubClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [journeyProgress, setJourneyProgress] = useState(0);
 
  // Timeline viewport scroll progress tracking
  const journeySectionRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    const handleScroll = () => {
      if (!journeySectionRef.current) return;
      const rect = journeySectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the timeline container
      const start = rect.top - windowHeight * 0.2;
      const total = rect.height;
      const p = Math.min(1, Math.max(0, -start / total));
      setJourneyProgress(p);
    };
 
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });
 
    return () => subscription.unsubscribe();
  }, []);
 
  // Map categories to designating Bento structure
  const oneToOne = categories.find((c) => c.slug === "one-to-one") || categories[0];
  const corporate = categories.find((c) => c.slug === "corporate") || categories[1];
  const colleges = categories.find((c) => c.slug === "colleges") || categories[2];
  const onlineCourses = categories.find((c) => c.slug === "online-courses") || categories[3];
  const internships = categories.find((c) => c.slug === "internships") || categories[4];
 
 
  return (
    <div className="w-full bg-base text-zinc-200 relative min-h-screen pt-28 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center py-16 overflow-hidden border-b border-line">
        {/* Living background mesh & glow */}
        <div className="absolute top-[10%] left-[-15%] w-[600px] h-[600px] bg-[#00F0FF]/6 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[10s]" />
        <div className="absolute bottom-[10%] right-[-15%] w-[600px] h-[600px] bg-[#0072FF]/8 rounded-full blur-[160px] pointer-events-none animate-pulse duration-[12s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
 
        <Container className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col (7/12 Width): Text block & CTA */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-left">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#43F5FF] px-4 py-2 bg-[#43F5FF]/10 rounded-full w-fit border border-[#43F5FF]/20 animate-pulse">
                {hub.eyebrow}
              </span>
              
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[70px] leading-[1.05] tracking-tight text-white">
                <span className="block overflow-hidden">
                  <span className="inline-block animate-[fade-up_1.2s_cubic-bezier(0.16,1,0.3,1)]">
                    {hub.headingLead || "Training"}
                  </span>
                </span>
                <span className="block overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-brand via-corporate to-brand animate-[signature-flow_6s_linear_infinite] bg-[size:200%_auto] pb-1">
                  <span className="inline-block animate-[fade-up_1.2s_cubic-bezier(0.16,1,0.3,1)_150ms_both]">
                    {hub.headingAccent || "Programs"}
                  </span>
                </span>
              </h1>
 
              <p className="text-slate font-light text-lg md:text-xl leading-relaxed max-w-xl animate-[fade-up_1.2s_cubic-bezier(0.16,1,0.3,1)_300ms_both]">
                {hub.intro}
              </p>
 
              {/* Premium Student Portal CTA block */}
              <div className="animate-[fade-up_1.2s_cubic-bezier(0.16,1,0.3,1)_450ms_both]">
                {user ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
                    <Button
                      variant="accent"
                      onClick={() => router.push("/account")}
                      className="py-3 px-8 text-[15px] flex items-center gap-2.5 rounded-full shadow-[0_8px_25px_rgba(67,245,255,0.3)] w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
                    >
                      <User className="w-4 h-4 text-white" />
                      <span>Access Student Dashboard</span>
                    </Button>
                    <span className="text-xs text-zinc-400 font-mono">
                      Logged in as: <span className="text-white font-bold">{user.email}</span>
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
                    <Button
                      variant="accent"
                      onClick={() => router.push("/signin?redirect=/training")}
                      className="py-3 px-8 text-[15px] flex items-center gap-2.5 rounded-full shadow-[0_8px_25px_rgba(67,245,255,0.35)] w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-300 font-semibold group/login-btn"
                    >
                      <LogIn className="w-4 h-4 text-white group-hover/login-btn:rotate-12 transition-transform duration-300" />
                      <span>Student Portal Login</span>
                    </Button>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xs">
                      Already enrolled? Log in to launch your course player, assessments, and grades.
                    </p>
                  </div>
                )}
              </div>
            </div>
 
            {/* Right Col (5/12 Width): Premium Floating Glassmorphic UI Mockup */}
            <div className="lg:col-span-5 flex items-center justify-center relative select-none">
              <div className="relative w-full max-w-[400px] h-[380px] animate-float">
                {/* Spotlight background spotlight */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Floating Widget 1: Student Analytics Progress Card */}
                <div className="absolute top-4 left-0 w-64 glass-panel rounded-2xl p-5 shadow-lg border border-line z-20 float-a">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#43F5FF] uppercase">Course Telemetry</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#43F5FF" strokeWidth="3" strokeDasharray="78 100" strokeLinecap="round" className="animate-pulse" />
                      </svg>
                      <span className="absolute text-[11px] font-bold text-white font-mono">78%</span>
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-bold font-display leading-tight">Advanced Excel</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 font-light leading-none">Modules completed: 8 / 11</p>
                    </div>
                  </div>
                </div>
 
                {/* Floating Widget 2: Certificate preview badge */}
                <div className="absolute bottom-6 right-0 w-56 glass-panel rounded-2xl p-4 shadow-lg border border-line z-20 float-b">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-corporate/15 border border-corporate/30 flex items-center justify-center text-corporate">
                      <GraduationCap className="w-5 h-5 text-brand" />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">Credential Generated</span>
                      <h4 className="text-white text-xs font-bold font-display mt-0.5 leading-none">Verified Badge</h4>
                    </div>
                  </div>
                </div>
 
                {/* Floating Widget 3: Live stats scoreboard */}
                <div className="absolute top-36 right-0 w-48 glass-panel rounded-2xl p-4 shadow-lg border border-line z-10 float-c">
                  <div className="text-left">
                    <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-wider">Assignments Solved</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-2xl font-bold text-white font-mono">18</span>
                      <span className="text-[10px] text-zinc-400 font-mono">/ 20</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full mt-2.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand to-corporate rounded-full" style={{ width: "90%" }} />
                    </div>
                  </div>
                </div>
 
                {/* Central orbital rings overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#43F5FF]/8 rounded-full pointer-events-none z-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#3A7BFF]/5 rounded-full pointer-events-none z-0 animate-spin-slow" />
              </div>
            </div>
          </div>
        </Container>
      </section>
 
      {/* 2. PROGRAM SHOWCASE (BENTO GRID) */}
      <section className="py-24 relative bg-[#0A0D13]/40 border-b border-line overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(67,245,255,0.035),transparent)] pointer-events-none" />
        
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#43F5FF]">Showcase</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 tracking-tight leading-tight">
              Learning Pathways
            </h2>
            <p className="text-zinc-400 font-light mt-4 text-base leading-relaxed">
              Explore custom-tailored tracks built for professionals, students, and companies.
            </p>
          </div>
 
          {/* Asymmetric Bento Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
            {/* Bento Card 1: Online Courses (Large 2 cols x 2 rows span) */}
            {onlineCourses && (
              <BentoCard
                category={onlineCourses}
                variant="large"
                icon={CATEGORY_ICONS["online-courses"]}
                className="lg:col-span-2 lg:row-span-2 lg:min-h-[460px]"
              />
            )}
 
            {/* Bento Card 2: Corporate Solutions (1 col x 1 row) */}
            {corporate && (
              <BentoCard
                category={corporate}
                variant="medium"
                icon={CATEGORY_ICONS["corporate"]}
                className="lg:col-span-1 lg:row-span-1 lg:min-h-[220px]"
              />
            )}
 
            {/* Bento Card 3: One-to-One (1 col x 1 row) */}
            {oneToOne && (
              <BentoCard
                category={oneToOne}
                variant="medium"
                icon={CATEGORY_ICONS["one-to-one"]}
                className="lg:col-span-1 lg:row-span-1 lg:min-h-[220px]"
              />
            )}
 
            {/* Bento Card 4: Internships Placement Path (Wide 2 cols x 1 row) */}
            {internships && (
              <BentoCard
                category={internships}
                variant="wide"
                icon={CATEGORY_ICONS["internships"]}
                className="lg:col-span-2 lg:row-span-1 lg:min-h-[220px]"
              />
            )}
 
            {/* Bento Card 5: College Partnerships (1 col x 1 row) */}
            {colleges && (
              <BentoCard
                category={colleges}
                variant="medium"
                icon={CATEGORY_ICONS["colleges"]}
                className="lg:col-span-1 lg:row-span-1 lg:min-h-[220px]"
              />
            )}
          </div>
        </Container>
      </section>
 
      {/* 3. LEARNING JOURNEY (SCROLL-ANIMATED STORYTELLING TIMELINE) */}
      <section ref={journeySectionRef} className="py-24 md:py-32 relative bg-base overflow-hidden border-b border-line">
        <div className="beam absolute top-[30%] left-[-4%] h-[30rem] w-[22rem] bg-[#00F0FF]/8 rounded-full blur-[100px] pointer-events-none" />
        
        <Container className="relative z-10 max-w-[960px]">
          <div className="max-w-2xl mb-20 text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#43F5FF]">Curriculum Flow</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 leading-tight tracking-tight">
              The Learning Journey
            </h2>
            <p className="text-zinc-400 font-light mt-3 text-sm md:text-base leading-relaxed">
              Our structured approach translates absolute beginners into industry-ready data specialists.
            </p>
          </div>
 
          {/* Scroll-tracked interactive vertical timeline */}
          <div className="relative pl-0 text-left mt-16 max-w-xl mx-auto">
            {/* Base line track */}
            <div className="absolute left-[23px] sm:left-[27px] top-6 bottom-6 w-[2px] bg-slate-850/60" />
            {/* Growing indicator track tied to scroll progress */}
            <div 
              className="absolute left-[23px] sm:left-[27px] top-6 w-[2px] bg-gradient-to-b from-[#00F0FF] via-cyan-500 to-[#3A7BFF] transition-all duration-300 ease-out"
              style={{ height: `${Math.min(journeyProgress * 100, 94)}%` }}
            />
 
            <div className="space-y-12 md:space-y-16">
              {[
                { 
                  step: "01", 
                  name: "Business Challenge", 
                  desc: "Translate complex corporate problems into structured analytical frameworks.",
                  icon: AlertCircle
                },
                { 
                  step: "02", 
                  name: "Data Collection", 
                  desc: "Aggregate ERP database outputs, CRM tables, and live transactional streams.",
                  icon: Database
                },
                { 
                  step: "03", 
                  name: "Data Engineering", 
                  desc: "Build query views, clean null anomalies, and consolidate reporting directories.",
                  icon: Settings
                },
                { 
                  step: "04", 
                  name: "Analytics", 
                  desc: "Apply nesting, calculation tables, and advanced DAX loops.",
                  icon: BarChart3
                },
                { 
                  step: "05", 
                  name: "Visualization", 
                  desc: "Design high-density interactive dashboards with real-time KPI thresholds.",
                  icon: Gauge
                },
                { 
                  step: "06", 
                  name: "Report Automation", 
                  desc: "Eliminate copy-paste loops via robust macro schedules.",
                  icon: FileSpreadsheet
                },
                { 
                  step: "07", 
                  name: "Business Decisions", 
                  desc: "Empower decision-makers with confident, automated data intelligence.",
                  icon: TrendingUp
                }
              ].map((item, idx) => {
                // Determine active state based on scroll progress percentage
                const nodeThreshold = (idx + 0.5) / 7;
                const active = journeyProgress >= nodeThreshold;
                const Icon = item.icon;
                
                return (
                  <div key={idx} className="relative flex items-start pl-16 sm:pl-24 transition-all duration-500">
                    {/* Circle Node */}
                    <div 
                      className={`absolute left-0 top-0.5 flex h-12 w-12 sm:h-[56px] sm:w-[56px] items-center justify-center rounded-full border-2 transition-all duration-500 z-10 ${
                        active 
                          ? "border-[#00F0FF] bg-[#0E1117]/95 text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.35)] scale-100" 
                          : "border-slate-800 bg-[#0A0D13] text-slate-700 scale-90"
                      }`}
                    >
                      <div className={`absolute -inset-1.5 rounded-full border border-dashed transition-all duration-500 ${
                        active ? "border-[#00F0FF]/30 scale-100" : "border-transparent scale-90"
                      }`} />
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-500" />
                    </div>
 
                    <div className="flex flex-col justify-center select-none pt-1">
                      <span className={`text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${
                        active ? "text-[#00F0FF]" : "text-slate-600"
                      }`}>
                        Stage {item.step}
                      </span>
                      <h3 className={`text-base sm:text-xl font-bold font-display mt-0.5 transition-colors duration-500 ${
                        active ? "text-white" : "text-slate-500"
                      }`}>
                        {item.name}
                      </h3>
                      <p className={`mt-1.5 text-xs sm:text-sm font-light leading-relaxed max-w-md transition-colors duration-500 ${
                        active ? "text-zinc-400" : "text-slate-655"
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>
 
      {/* 4. PLATFORM FEATURES SECTION */}
      <section className="py-24 relative bg-[#0A0D13]/40 border-b border-line overflow-hidden">
        <div className="absolute top-[10%] right-[-15%] w-[450px] h-[450px] bg-corporate/5 rounded-full blur-[120px] pointer-events-none" />
 
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#43F5FF]">Ecosystem</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 tracking-tight leading-tight">
              Integrated Learning Tools
            </h2>
            <p className="text-zinc-400 font-light mt-4 text-base leading-relaxed">
              Every course is backed by a robust suite of digital learning tools.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FloatingFeatureCard 
              icon={CheckSquare} 
              label="Assignments" 
              desc="Project-focused work solving real corporate models." 
              delay={0}
              floatClass="float-b"
            />
            <FloatingFeatureCard 
              icon={Clock} 
              label="Mock Tests" 
              desc="Time-bound simulation of actual placement tests." 
              delay={50}
              floatClass="float-c"
            />
            <FloatingFeatureCard 
              icon={Target} 
              label="Assessments" 
              desc="Automatic test checking and granular output evaluation." 
              delay={100}
              floatClass="float-a"
            />
            <FloatingFeatureCard 
              icon={GraduationCap} 
              label="Certificates" 
              desc="Verified downloadable credential credentials with unique IDs." 
              delay={150}
              floatClass="float-b"
            />
            <FloatingFeatureCard 
              icon={Play} 
              label="Video Lessons" 
              desc="Step-by-step video instructions mapping analytical loops." 
              delay={200}
              floatClass="float-a"
            />
            <FloatingFeatureCard 
              icon={Sparkles} 
              label="Progress Tracking" 
              desc="Interactive visual scoring of your modular checklist." 
              delay={250}
              floatClass="float-b"
            />
          </div>
        </Container>
      </section>
 
      {/* 5. STUDENT DASHBOARD SHOWCASE (DEVICE MOCKUPS) */}
      <section className="py-24 md:py-32 relative bg-base border-b border-line overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(58,123,255,0.04),transparent)] pointer-events-none" />
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col (5/12 width): text and statistics */}
            <div className="lg:col-span-5 text-left space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#43F5FF]">Student Portal</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight leading-tight">
                Designed for Interactive Excellence
              </h2>
              <p className="text-zinc-400 font-light text-[15px] leading-relaxed">
                Log in as a student to access a premium personalized portal containing your course pipeline, assignments, tests, and certificates.
              </p>
              
              {/* Dynamic stats */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-line">
                <div className="space-y-1">
                  <h4 className="text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate leading-none">
                    <CountUp value={50000} suffix="+" />
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Students Trained</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate leading-none">
                    <CountUp value={15} suffix="+" />
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Programs Active</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate leading-none">
                    <CountUp value={20} suffix="+" />
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Corporate Clients</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-brand to-corporate leading-none">
                    <CountUp value={98} suffix="%" />
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Completion Rate</p>
                </div>
              </div>
            </div>
 
            {/* Right Col (7/12 width): CSS premium device mockups */}
            <div className="lg:col-span-7 flex justify-center relative select-none">
              <div className="relative w-full max-w-[550px] aspect-[16/10] bg-[#0E1117]/85 border border-[#43F5FF]/15 rounded-2xl shadow-2xl p-3 backdrop-blur-xl group hover:border-[#43F5FF]/45 transition-colors duration-500 text-left">
                {/* Window header controls */}
                <div className="flex items-center gap-1.5 mb-2.5 pb-2.5 border-b border-white/5 px-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] text-zinc-500 font-mono ml-4 select-none">training-portal.kvjanalytics.com</span>
                </div>
                
                {/* Dashboard mock layout */}
                <div className="grid grid-cols-12 gap-3 h-[calc(100%-35px)] overflow-hidden">
                  {/* Mock Sidebar */}
                  <div className="col-span-3 border-r border-white/5 pr-2.5 space-y-4 pt-1">
                    <div className="h-6 w-full bg-white/5 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-brand/10 border-l-2 border-brand rounded" />
                      <div className="h-4 w-4/5 bg-white/5 rounded" />
                      <div className="h-4 w-5/6 bg-white/5 rounded" />
                    </div>
                  </div>
 
                  {/* Mock Main content */}
                  <div className="col-span-9 pl-1 space-y-3.5 pt-1 overflow-y-auto pr-1">
                    {/* Banner widget */}
                    <div className="p-3 bg-gradient-to-r from-brand/10 to-corporate/10 border border-brand/20 rounded-xl">
                      <h4 className="text-white text-xs font-bold leading-tight font-display">Welcome Back, Student!</h4>
                      <p className="text-[9px] text-zinc-400 mt-1 font-light">Launch your active Excel MIS Automation program below.</p>
                    </div>
 
                    {/* Small grid widgets */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Widget 1 */}
                      <div className="p-2.5 bg-white/[0.02] border border-line rounded-lg">
                        <span className="text-[8px] font-mono text-zinc-400 font-bold block uppercase">Overall Grade</span>
                        <span className="text-base font-bold text-[#43F5FF] font-mono mt-1 block">A+ // 94.6%</span>
                      </div>
                      {/* Widget 2 */}
                      <div className="p-2.5 bg-white/[0.02] border border-line rounded-lg">
                        <span className="text-[8px] font-mono text-zinc-400 font-bold block uppercase">Active Leaderboard</span>
                        <span className="text-base font-bold text-white font-mono mt-1 block">Rank 3rd</span>
                      </div>
                    </div>
 
                    {/* Lesson tracking block */}
                    <div className="border border-line rounded-xl p-3 bg-white/[0.01]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-mono font-bold text-brand uppercase">Topic Progression</span>
                        <span className="text-[8px] text-zinc-500 font-mono">14 / 20 Solved</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { title: "Power Query Data Consolidation", status: "completed" },
                          { title: "Nested Formula Logical Testing", status: "completed" },
                          { title: "VBA Macro Loop Scripting", status: "in-progress" }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] py-1 border-b border-white/5 last:border-0">
                            <span className="text-zinc-300 font-light truncate max-w-[200px]">{item.title}</span>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              item.status === "completed" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" 
                                : "bg-[#43F5FF]/10 text-brand border border-brand/20 animate-pulse"
                            }`}>{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Overlapping mobile mockup floating slightly to the bottom-right on lg screen */}
              <div className="absolute -bottom-8 -right-4 hidden lg:block w-36 aspect-[9/18] bg-[#050608] border-2 border-line rounded-3xl p-1.5 shadow-2xl z-20 float-b hover:border-[#43F5FF]/40 transition-colors duration-300">
                <div className="w-full h-full bg-[#0E1117]/90 rounded-[18px] p-2 text-left overflow-hidden">
                  <div className="w-6 h-1 mx-auto bg-zinc-700 rounded-full mb-3" />
                  <span className="text-[8px] font-mono font-bold tracking-widest text-[#43F5FF] uppercase block">Mobile Portal</span>
                  <div className="h-6 w-full bg-white/5 rounded-md mt-2" />
                  <div className="h-10 w-full bg-white/[0.02] border border-line rounded-md mt-3 p-1">
                    <div className="h-1.5 w-full bg-white/5 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: "70%" }} />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-400 mt-1 block leading-none">Modules: 70%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
 
 
 
      {/* 8. FOOTER CTA SECTION */}
      <section className="relative z-10">
        <CTASection
          title={hub.cta.title}
          description={hub.cta.description}
          primaryCtaText={hub.cta.primaryCtaText}
          primaryCtaHref={hub.cta.primaryCtaHref}
          secondaryCtaText={hub.cta.secondaryCtaText}
          secondaryCtaHref={hub.cta.secondaryCtaHref}
        />
      </section>
    </div>
  );
}
