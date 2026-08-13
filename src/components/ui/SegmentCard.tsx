import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";

interface SegmentCardProps {
  segment: "corporate" | "education";
  title: string;
  tagline: string;
  description: string;
  href: string;
  iconName: keyof typeof Icons;
}

export function SegmentCard({
  segment,
  title,
  tagline,
  description,
  href,
  iconName,
}: SegmentCardProps) {
  const IconComponent = Icons[iconName] as React.ComponentType<{ className?: string }>;

  const colors = {
    corporate: {
      border: "border-[#0D9488]",
      text: "text-[#0D9488]",
      bgHover: "hover:border-[#0D9488]/55",
      accent: "bg-[#0D9488]/10 text-[#0D9488]",
      btn: "text-[#0D9488] group-hover:translate-x-1.5",
      shadowHover: "hover:shadow-[0_12px_32px_rgba(13,148,136,0.22)]",
    },
    education: {
      border: "border-[#10B981]",
      text: "text-[#10B981]",
      bgHover: "hover:border-[#10B981]/55",
      accent: "bg-[#10B981]/10 text-[#10B981]",
      btn: "text-[#10B981] group-hover:translate-x-1.5",
      shadowHover: "hover:shadow-[0_12px_32px_rgba(16,185,129,0.22)]",
    },
  };

  const c = colors[segment];

  return (
    <Link
      href={href}
      className={`group block rounded-[24px] bg-glass-card backdrop-blur-[18px] border border-line p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${c.shadowHover} ${c.bgHover} border-l-4 ${c.border} hover:-translate-y-1.5`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className={`inline-flex p-3 rounded-xl mb-6 ${c.accent}`}>
            {IconComponent && <IconComponent className="w-8 h-8" />}
          </div>
          <span className={`block text-xs font-bold uppercase tracking-[0.25em] mb-2 ${c.text}`}>
            {segment}
          </span>
          <h3 className="text-2xl font-bold font-display text-ink mb-3 group-hover:text-brand transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm font-semibold text-slate mb-4">
            {tagline}
          </p>
          <p className="text-base text-slate/85 leading-relaxed mb-6 font-light">
            {description}
          </p>
        </div>
        <div className={`inline-flex items-center font-bold text-sm font-body ${c.text}`}>
          <span className="mr-2">Explore Solutions</span>
          <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${c.btn}`} />
        </div>
      </div>
    </Link>
  );
}
