import React from "react";
import { Container } from "./Container";
import { Button } from "./Button";
import { BoldStatement } from "./BoldStatement";

interface CTASectionProps {
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function CTASection({
  title,
  description,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: CTASectionProps) {
  return (
    <div className="relative overflow-hidden border-t border-line bg-[#050505] py-24 md:py-32">
      {/* Self-contained CSS for looping background wave */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes wave-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}} />

      {/* Abstract slow-moving wave background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] z-0 overflow-hidden">
        <svg viewBox="0 0 1440 320" className="absolute w-[200%] h-full top-0 left-0 animate-[wave-scroll_30s_linear_infinite]" preserveAspectRatio="none">
          <path 
            d="M0 160 C360 80, 720 240, 1080 160 C1440 80, 1800 240, 2160 160 C2520 80, 2880 240, 3240 160 L3240 320 L0 320 Z" 
            fill="url(#waveGrad)" 
          />
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#0072FF" />
            </linearGradient>
          </defs>
        </svg>
        <svg viewBox="0 0 1440 320" className="absolute w-[200%] h-full top-0 left-0 animate-[wave-scroll_45s_linear_infinite_reverse] opacity-70" preserveAspectRatio="none">
          <path 
            d="M0 120 C360 200, 720 80, 1080 120 C1440 200, 1800 80, 2160 120 C2520 200, 2880 80, 3240 120" 
            fill="none" 
            stroke="#00F0FF" 
            strokeWidth="2.5" 
          />
        </svg>
      </div>

      {/* ambient accent glows */}
      <div className="bg-radial-glow pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[44rem] -translate-x-1/2 -translate-y-1/3 opacity-30" />
      <div className="bg-radial-glow-teal pointer-events-none absolute -bottom-32 right-[8%] h-[24rem] w-[24rem] opacity-30" />
      <Container className="relative z-10 text-center flex flex-col items-center">
        <BoldStatement variant="h2" className="mb-6 max-w-3xl">
          {title}
        </BoldStatement>
        <p className="text-[17px] md:text-[19px] font-light text-slate max-w-2xl leading-relaxed mb-10">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button href={primaryCtaHref} variant="accent" className="w-full sm:w-auto">
            {primaryCtaText}
          </Button>
          {secondaryCtaText && secondaryCtaHref && (
            <Button href={secondaryCtaHref} variant="secondary" className="w-full sm:w-auto">
              {secondaryCtaText} →
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}
