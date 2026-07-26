import React from "react";
import Image from "next/image";
import { Button } from "./Button";
import { Eyebrow } from "./Eyebrow";
import { BoldStatement } from "./BoldStatement";

interface OfferingRowProps {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  reverse?: boolean;
  segment?: "corporate" | "education" | "neutral";
  ctaText?: string;
}

export function OfferingRow({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  href,
  reverse = false,
  segment = "neutral",
  ctaText = "Learn More",
}: OfferingRowProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center my-16 md:my-24">
      {/* Image Block */}
      <div
        className={`lg:col-span-6 overflow-hidden rounded-card shadow-soft border border-line aspect-[4/3] relative group ${
          reverse ? "lg:order-last" : ""
        }`}
      >
        <Image
          src={imageSrc || "/api/placeholder/600/450"}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent pointer-events-none" />
      </div>

      {/* Content Block */}
      <div className="lg:col-span-6 flex flex-col items-start relative z-10">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-radial-glow opacity-40 pointer-events-none -z-10" />
        <Eyebrow segment={segment} className="mb-3">
          {eyebrow}
        </Eyebrow>
        <BoldStatement variant="h2" className="mb-4">
          {title}
        </BoldStatement>
        <p className="text-lg text-slate leading-relaxed mb-8 font-medium">
          {description}
        </p>
        <Button variant="secondary" href={href} className="group/btn">
          <span>{ctaText}</span>
          <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1 ml-1.5">→</span>
        </Button>
      </div>
    </div>
  );
}
