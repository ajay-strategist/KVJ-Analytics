"use client";

import React, { useRef, useState } from "react";
import { ArrowRight, Layers, Cpu, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { renderHologram } from "./ProductHolograms";
import { SandboxedAnimation } from "./SandboxedAnimation";

interface ProductCardProps {
  name: string;
  tagline: string;
  description: string;
  slug: string;
  keyFeatures: string[];
  isGradeScope: boolean;
  animationStyle?: string;
  customAnimationHtml?: string;
  delay?: number;
}

export function ProductCard({
  name,
  tagline,
  description,
  slug,
  keyFeatures,
  isGradeScope,
  animationStyle,
  customAnimationHtml,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // 3D Parallax Tilt Calculation
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const maxTilt = 10;
    const rotateX = -((y - yc) / yc) * maxTilt;
    const rotateY = ((x - xc) / xc) * maxTilt;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setMousePos({ x: -1000, y: -1000 });
  };

  const Icon = isGradeScope ? Layers : Cpu;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full"
      style={{
        perspective: "1000px",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bar-grow {
          0%, 100% {
            transform: scaleY(0.35);
          }
          50% {
            transform: scaleY(1);
          }
        }
        @keyframes fade-up-data {
          0% {
            transform: translateY(12px);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-24px);
            opacity: 0;
          }
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes rotate-sweep {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .btn-liquid-glow-sweep {
          position: relative;
          overflow: hidden;
          background: #0E1117 !important;
          border: 1px solid rgba(67, 245, 255, 0.25) !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 15px rgba(67, 245, 255, 0.1) !important;
          transition: all 0.3s ease !important;
        }
        .btn-liquid-glow-sweep::before {
          content: "";
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: conic-gradient(from 0deg, transparent 40%, #43F5FF 50%, transparent 60%);
          animation: rotate-sweep 4s linear infinite;
          pointer-events: none;
          z-index: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .btn-liquid-glow-sweep:hover {
          border-color: #43F5FF !important;
          box-shadow: 0 0 25px rgba(67, 245, 255, 0.3) !important;
        }
        .btn-liquid-glow-sweep:hover::before {
          opacity: 1;
        }
        .btn-liquid-glow-sweep > span {
          position: relative;
          z-index: 10;
        }
      `}} />

      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative h-full flex flex-col overflow-hidden p-8 md:p-9 rounded-[24px] bg-glass-card backdrop-blur-[18px] border border-line transition-all duration-500 shadow-soft"
          style={{
            borderColor: isHovered
              ? isGradeScope ? "rgba(67, 245, 255, 0.55)" : "rgba(58, 123, 255, 0.55)"
              : "rgba(60, 255, 255, 0.15)",
            boxShadow: isHovered
              ? isGradeScope 
                ? "0 24px 60px rgba(67, 245, 255, 0.22)" 
                : "0 24px 60px rgba(58, 123, 255, 0.22)"
              : "none",
          }}
        >
          {/* Top accent line */}
          <div className={`absolute inset-x-0 top-0 h-[3px] ${isGradeScope ? "bg-[#43F5FF]" : "bg-[#3A7BFF]"}`} />

          {/* Cursor following glow */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(67, 245, 255, 0.05), transparent 80%)`,
              }}
            />
          )}

          {/* 3D Hologram Projection at the top */}
          {animationStyle === "custom" && customAnimationHtml
            ? <SandboxedAnimation html={customAnimationHtml} className="h-full w-full" />
            : renderHologram(animationStyle, isGradeScope)}

          <div 
            className="relative flex items-center gap-4 mb-6 text-left"
            style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0)", transition: "transform 0.3s ease" }}
          >
            <span className={`grid h-14 w-14 place-items-center rounded-2xl border ${isGradeScope ? "bg-brand/10 border-brand/20 text-brand" : "bg-corporate/10 border-corporate/20 text-corporate"}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 
                className="text-2xl font-bold leading-tight transition-colors duration-300"
                style={{
                  color: isHovered ? (isGradeScope ? "#43F5FF" : "#3A7BFF") : "#FFFFFF",
                }}
              >
                {name}
              </h3>
              <span className="text-[10px] font-semibold text-slate uppercase tracking-[0.18em]">Software Platform</span>
            </div>
          </div>

          <div style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)", transition: "transform 0.3s ease" }} className="flex-grow flex flex-col text-left">
            <p className="relative text-sm font-semibold text-brand mb-4 italic">{tagline}</p>
            <p className="relative text-[15px] text-slate font-light leading-relaxed mb-7">{description}</p>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {keyFeatures.map((feat: string, fIdx: number) => (
                <div key={fIdx} className="flex items-start gap-2.5 rounded-xl border border-line bg-white/5 px-3.5 py-3 transition-colors duration-250 hover:bg-white/10">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isGradeScope ? "text-[#43F5FF]" : "text-[#3A7BFF]"}`} />
                  <span className="text-[12.5px] font-medium text-white leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            href={`/products/${slug}`} 
            variant={isGradeScope ? "education" : "corporate"} 
            className="relative mt-auto w-full group btn-liquid-glow-sweep"
            style={{ transform: isHovered ? "translateZ(25px)" : "translateZ(0)", transition: "transform 0.3s ease" }}
          >
            <span>Request Demo &amp; Details</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
