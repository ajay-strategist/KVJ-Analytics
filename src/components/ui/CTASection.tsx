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
    <div className="relative overflow-hidden border-t border-line bg-base py-24 md:py-32">
      {/* ambient accent glows */}
      <div className="bg-radial-glow pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[44rem] -translate-x-1/2 -translate-y-1/3" />
      <div className="bg-radial-glow-teal pointer-events-none absolute -bottom-32 right-[8%] h-[24rem] w-[24rem]" />
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
