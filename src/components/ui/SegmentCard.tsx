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
      border: "border-corporate",
      text: "text-corporate",
      bgHover: "hover:border-corporate/40",
      accent: "bg-corporate/10 text-corporate",
      btn: "text-corporate group-hover:translate-x-1.5",
      shadowHover: "hover:shadow-[0_12px_32px_rgba(26,86,219,0.16)]",
    },
    education: {
      border: "border-education",
      text: "text-education",
      bgHover: "hover:border-education/40",
      accent: "bg-education/10 text-education",
      btn: "text-education group-hover:translate-x-1.5",
      shadowHover: "hover:shadow-[0_12px_32px_rgba(8,145,178,0.16)]",
    },
  };

  const c = colors[segment];

  return (
    <Link
      href={href}
      className={`group block bg-card rounded-card border border-line p-8 shadow-soft transition-all duration-300 ${c.shadowHover} hover:-translate-y-1.5 ${c.bgHover} border-l-4 ${c.border} offering-card offeringCard`}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className={`inline-flex p-3 rounded-xl mb-6 ${c.accent} icon`}>
            {IconComponent && <IconComponent className="w-8 h-8" />}
          </div>
          <span className={`block text-xs font-bold uppercase tracking-widest mb-2 ${c.text} category`}>
            {segment}
          </span>
          <h3 className="text-2xl font-bold font-display text-ink mb-3 group-hover:text-brand transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm font-semibold text-slate mb-4 subtitle tagline">
            {tagline}
          </p>
          <p className="text-base text-slate leading-relaxed mb-6">
            {description}
          </p>
        </div>
        <div className={`inline-flex items-center font-bold text-sm font-body ${c.text} link explore`}>
          <span className="mr-2">Explore Solutions</span>
          <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${c.btn}`} />
        </div>
      </div>
    </Link>
  );
}
