"use client";

import React, { useRef, useState } from "react";
import { ArrowRight, Layers, Cpu, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  name: string;
  tagline: string;
  description: string;
  slug: string;
  keyFeatures: string[];
  isGradeScope: boolean;
  delay?: number;
}

export function ProductCard({
  name,
  tagline,
  description,
  slug,
  keyFeatures,
  isGradeScope,
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
    const maxTilt = 8; // gentle tilt
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
  const accentColor = isGradeScope ? "cyan" : "blue";

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
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.015 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative h-full flex flex-col overflow-hidden p-8 md:p-9 rounded-[24px] bg-[#12121A]/70 backdrop-blur-[24px] border border-white/5 transition-all duration-500"
          style={{
            borderColor: isHovered
              ? (accentColor === "cyan" ? "rgba(0, 240, 255, 0.4)" : "rgba(0, 114, 255, 0.4)")
              : "rgba(255, 255, 255, 0.05)",
            boxShadow: isHovered
              ? (accentColor === "cyan" ? "0 15px 40px rgba(0, 240, 255, 0.12)" : "0 15px 40px rgba(0, 114, 255, 0.12)")
              : "none",
          }}
        >
          {/* Top accent line */}
          <div className={`absolute inset-x-0 top-0 h-[3px] ${isGradeScope ? "bg-brand" : "bg-corporate"}`} />

          {/* Cursor following glow */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${
                  accentColor === "cyan" ? "rgba(0, 240, 255, 0.14)" : "rgba(0, 114, 255, 0.14)"
                }, transparent 80%)`,
              }}
            />
          )}

          <div 
            className="relative flex items-center gap-4 mb-6"
            style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0)", transition: "transform 0.3s ease" }}
          >
            <span className={`grid h-14 w-14 place-items-center rounded-2xl border ${isGradeScope ? "bg-brand/10 border-brand/20 text-brand" : "bg-corporate/10 border-corporate/20 text-corporate"}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 
                className="text-2xl font-bold leading-tight transition-colors duration-300"
                style={{
                  color: isHovered ? (accentColor === "cyan" ? "#00F0FF" : "#80B8FF") : "#FFFFFF",
                }}
              >
                {name}
              </h3>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.18em]">Software Platform</span>
            </div>
          </div>

          <div style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)", transition: "transform 0.3s ease" }} className="flex-grow flex flex-col">
            <p className="relative text-sm font-semibold text-slate-300 mb-4 italic">{tagline}</p>
            <p className="relative text-[15px] text-slate-400 font-light leading-relaxed mb-7">{description}</p>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {keyFeatures.map((feat: string, fIdx: number) => (
                <div key={fIdx} className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] px-3.5 py-3 transition-colors duration-250">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isGradeScope ? "text-brand" : "text-corporate"}`} />
                  <span className="text-[12.5px] font-medium text-slate-200 leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            href={`/products/${slug}`} 
            variant="accent" 
            className="relative mt-auto w-full group"
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
