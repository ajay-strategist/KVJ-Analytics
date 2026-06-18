import React from "react";
import { Container } from "./Container";
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
    <div
      className="py-24 md:py-32 text-white relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0B1635 0%, #16284f 50%, #1A56DB 100%)" }}
    >
      {/* Animated glow blobs */}
      <div
        className="absolute -top-40 -left-32 w-[460px] h-[460px] rounded-full blur-3xl pointer-events-none animate-blob"
        style={{ background: "rgba(26,86,219,0.30)" }}
      />
      <div
        className="absolute -bottom-40 -right-32 w-[460px] h-[460px] rounded-full blur-3xl pointer-events-none animate-blob"
        style={{ background: "rgba(249,115,22,0.18)", animationDelay: "4s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full blur-3xl pointer-events-none animate-blob"
        style={{ background: "rgba(8,145,178,0.16)", animationDelay: "2s" }}
      />

      <Container className="relative z-10 text-center flex flex-col items-center">
        <BoldStatement
          variant="h2"
          className="mb-6 max-w-3xl leading-tight text-3xl md:text-4xl"
          style={{ color: "#FFFFFF", WebkitTextFillColor: "#FFFFFF" }}
        >
          {title}
        </BoldStatement>
        <p
          className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
          style={{ color: "rgba(255,255,255,0.88)" }}
        >
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          {/* Orange primary CTA */}
          <a
            href={primaryCtaHref}
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-btn font-bold text-[15px] text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #F97316 0%, #EA6C00 100%)",
              boxShadow: "0 4px 20px rgba(249,115,22,0.42)",
            }}
          >
            {primaryCtaText}
          </a>
          {/* White ghost secondary */}
          {secondaryCtaText && secondaryCtaHref && (
            <a
              href={secondaryCtaHref}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-btn font-bold text-[15px] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
              style={{ border: "2px solid rgba(255,255,255,0.55)" }}
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </Container>
    </div>
  );
}
