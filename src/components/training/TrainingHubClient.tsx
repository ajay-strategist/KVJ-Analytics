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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { CTASection } from "@/components/ui/CTASection";
import { FALLBACK_TRAINING_HUB } from "@/lib/constants";

// Map CMS icon-name strings → lucide components (for admin-editable journey/tools).
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertCircle, Database, Settings, BarChart3, Gauge, FileSpreadsheet, TrendingUp,
  CheckSquare, Clock, Target, GraduationCap, Play, Sparkles, BookOpen, Cpu, Laptop, Users, FileText, Code, Compass,
};
const iconOf = (name?: string) => ICONS[name || ""] || Sparkles;
 
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
    journey?: {
      eyebrow?: string;
      heading?: string;
      subtext?: string;
      stages?: { step: string; name: string; desc: string; icon: string }[];
    };
    tools?: {
      eyebrow?: string;
      heading?: string;
      subtext?: string;
      items?: { label: string; desc: string; icon: string }[];
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
      className={`perspective-container relative rounded-[32px] overflow-hidden border border-line bg-[#0B2A22]/85 backdrop-blur-xl transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        hovered ? "border-brand/40 shadow-[0_24px_60px_rgba(16,185,129,0.06)]" : "shadow-soft"
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
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.065), transparent 80%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
 
      {/* Hover lighting highlight border glow */}
      <div 
        className="absolute inset-[-1px] rounded-[32px] border border-transparent z-25 pointer-events-none transition-colors duration-500" 
        style={{
          borderColor: hovered ? "rgba(16, 185, 129, 0.25)" : "transparent"
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
              hovered ? "bg-brand border-brand text-black scale-110" : "bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]"
            }`}>
              <Icon className={`w-5 h-5 ${hovered ? "rotate-12 duration-300" : ""}`} />
            </div>
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#10B981] uppercase px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/15">
              {category.type === "inquiry" ? "B2B / Program" : "Self-Serve"}
            </span>
          </div>
 
          {/* Text content */}
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold font-display text-white group-hover:text-[#10B981] transition-colors flex items-center gap-2">
              {category.name}
              <ArrowRight className={`w-5 h-5 transition-all duration-300 text-brand ${
                hovered ? "opacity-100 translate-x-1" : "opacity-0 -translate-x-1"
              }`} />
            </h3>
            <p className={`text-sm font-light leading-relaxed max-w-md transition-colors duration-300 ${
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
      <div className={`bg-[#0B2A22]/65 border border-line hover:border-[#10B981]/30 p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft text-left group h-full relative overflow-hidden ${floatClass}`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-brand/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 text-[#10B981] group-hover:rotate-12 duration-300" />
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
    <div className="w-full hero-emerald text-zinc-200 relative min-h-screen pt-28 overflow-hidden">
      {/* Custom keyframes for dashboard connections */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}} />

      {/* 1. HERO SECTION — editorial, professional, text-forward (no mock UI) */}
      <section className="relative flex items-center py-24 md:py-32 overflow-hidden border-b border-line">
        {/* Restrained ambient field: one soft aurora, a masked hairline grid */}
        <div className="absolute -top-[12%] left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-[#10B981]/[0.05] rounded-full blur-[170px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_35%,black,transparent)] pointer-events-none" />

        <Container className="relative z-10 w-full">
          <div className="max-w-4xl">
            {/* Calm eyebrow */}
            <div className="flex items-center gap-3 animate-[fade-up_1s_cubic-bezier(0.16,1,0.3,1)]">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#10B981]/70" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-[#10B981]">
                {hub.eyebrow}
              </span>
            </div>

            <h1 className="mt-7 font-display font-bold text-[13vw] sm:text-7xl lg:text-[92px] leading-[0.95] tracking-[-0.025em] text-white">
              <span className="block animate-[fade-up_1.1s_cubic-bezier(0.16,1,0.3,1)_80ms_both]">
                {hub.headingLead || "Training"}
              </span>
              <span className="block pb-1 text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#0D9488] to-[#34D399] animate-[fade-up_1.1s_cubic-bezier(0.16,1,0.3,1)_180ms_both]">
                {hub.headingAccent || "Programs"}
              </span>
            </h1>

            <p className="mt-7 text-slate font-light text-lg md:text-2xl leading-relaxed max-w-2xl animate-[fade-up_1.1s_cubic-bezier(0.16,1,0.3,1)_300ms_both]">
              {hub.intro}
            </p>

            {/* Dual CTA */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 animate-[fade-up_1.1s_cubic-bezier(0.16,1,0.3,1)_420ms_both]">
              <Button
                variant="accent"
                onClick={() => router.push("/training/online-courses")}
                className="py-3.5 px-8 text-[15px] flex items-center justify-center gap-2 rounded-full shadow-[0_8px_28px_rgba(16,185,129,0.28)] w-full sm:w-auto hover:scale-[1.03] active:scale-95 transition-transform duration-300 font-semibold group/explore"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4 group-hover/explore:translate-x-0.5 transition-transform duration-300" />
              </Button>
              <button
                type="button"
                onClick={() => router.push(user ? "/account" : "/signin?redirect=/training")}
                className="py-3.5 px-7 text-[15px] flex items-center justify-center gap-2 rounded-full w-full sm:w-auto border border-line text-white/90 hover:text-white hover:border-brand/45 hover:bg-white/[0.03] transition-colors duration-300 font-semibold group/login"
              >
                {user ? <User className="w-4 h-4 text-brand" /> : <LogIn className="w-4 h-4 text-brand group-hover/login:rotate-12 transition-transform duration-300" />}
                <span>{user ? "Student Dashboard" : "Student Portal Login"}</span>
              </button>
            </div>

            {/* Curriculum strip — the real disciplines KVJ teaches (no fabricated data) */}
            <div className="mt-14 pt-8 border-t border-line animate-[fade-up_1.1s_cubic-bezier(0.16,1,0.3,1)_560ms_both]">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-zinc-500">
                Core disciplines
              </span>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {["Advanced Excel", "Power BI", "Data Analytics", "Dashboards", "Report Automation", "Business Intelligence"].map((d, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-line bg-white/[0.03] px-4 py-2 text-[13.5px] font-medium text-zinc-300 hover:border-brand/40 hover:text-white transition-colors duration-300"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
 
      {/* 2. PROGRAM SHOWCASE (BENTO GRID) */}
      <section className="py-24 relative bg-[#07130E]/40 border-b border-line overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.035),transparent)] pointer-events-none" />
        
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#10B981]">Showcase</span>
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
        <div className="beam absolute top-[30%] left-[-4%] h-[30rem] w-[22rem] bg-[#10B981]/8 rounded-full blur-[100px] pointer-events-none" />
        
        <Container className="relative z-10 max-w-[960px]">
          <div className="max-w-2xl mb-20 text-left">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#10B981]">{hub?.journey?.eyebrow || "Curriculum Flow"}</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 leading-tight tracking-tight">
              {hub?.journey?.heading || "The Learning Journey"}
            </h2>
            <p className="text-zinc-400 font-light mt-3 text-sm md:text-base leading-relaxed">
              {hub?.journey?.subtext || "Our structured approach translates absolute beginners into industry-ready data specialists."}
            </p>
          </div>
 
          {/* Scroll-tracked interactive vertical timeline */}
          <div className="relative pl-0 text-left mt-16 max-w-xl mx-auto">
            {/* Base line track */}
            <div className="absolute left-[23px] sm:left-[27px] top-6 bottom-6 w-[2px] bg-slate-850/60" />
            {/* Growing indicator track tied to scroll progress */}
            <div 
              className="absolute left-[23px] sm:left-[27px] top-6 w-[2px] bg-gradient-to-b from-[#10B981] via-cyan-500 to-[#0D9488] transition-all duration-300 ease-out"
              style={{ height: `${Math.min(journeyProgress * 100, 94)}%` }}
            />
 
            <div className="space-y-12 md:space-y-16">
              {(((hub?.journey?.stages as { step: string; name: string; desc: string; icon: string }[]) || FALLBACK_TRAINING_HUB.journey.stages)).map((item, idx, arr) => {
                // Determine active state based on scroll progress percentage
                const nodeThreshold = (idx + 0.5) / (arr.length || 7);
                const active = journeyProgress >= nodeThreshold;
                const Icon = iconOf(item.icon);
                
                return (
                  <div key={idx} className="relative flex items-start pl-16 sm:pl-24 transition-all duration-500">
                    {/* Circle Node */}
                    <div 
                      className={`absolute left-0 top-0.5 flex h-12 w-12 sm:h-[56px] sm:w-[56px] items-center justify-center rounded-full border-2 transition-all duration-500 z-10 ${
                        active 
                          ? "border-[#10B981] bg-[#0B2A22]/95 text-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-100" 
                          : "border-slate-800 bg-[#07130E] text-slate-700 scale-90"
                      }`}
                    >
                      <div className={`absolute -inset-1.5 rounded-full border border-dashed transition-all duration-500 ${
                        active ? "border-[#10B981]/30 scale-100" : "border-transparent scale-90"
                      }`} />
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-500" />
                    </div>
 
                    <div className="flex flex-col justify-center select-none pt-1">
                      <span className={`text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${
                        active ? "text-[#10B981]" : "text-slate-600"
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
      <section className="py-24 relative bg-[#07130E]/40 border-b border-line overflow-hidden">
        <div className="absolute top-[10%] right-[-15%] w-[450px] h-[450px] bg-corporate/5 rounded-full blur-[120px] pointer-events-none" />
 
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#10B981]">{hub?.tools?.eyebrow || "Ecosystem"}</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-3 tracking-tight leading-tight">
              {hub?.tools?.heading || "Integrated Learning Tools"}
            </h2>
            <p className="text-zinc-400 font-light mt-4 text-base leading-relaxed">
              {hub?.tools?.subtext || "Every course is backed by a robust suite of digital learning tools."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {(((hub?.tools?.items as { label: string; desc: string; icon: string }[]) || FALLBACK_TRAINING_HUB.tools.items)).map((t, i) => (
              <FloatingFeatureCard
                key={i}
                icon={iconOf(t.icon)}
                label={t.label}
                desc={t.desc}
                delay={i * 50}
                floatClass={["float-a", "float-b", "float-c"][i % 3]}
              />
            ))}
          </div>
        </Container>
      </section>
      {/* FOOTER CTA SECTION */}
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
