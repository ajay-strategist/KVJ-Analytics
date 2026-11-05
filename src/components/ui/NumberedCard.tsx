import React from "react";
import { Card } from "./Card";

interface NumberedCardProps {
  number?: string; // optional — kept for backwards compatibility
  title: string;
  description: string;
  className?: string;
}

export function NumberedCard({ title, description, className = "" }: NumberedCardProps) {
  return (
    <Card
      hoverLift
      tone="neutral"
      className={`relative overflow-hidden p-8 flex flex-col justify-between h-full group border-line/80 ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 signature-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div>
        {/* Brand accent */}
        <div className="h-1 w-10 rounded-full signature-gradient mb-6 transition-all duration-300 group-hover:w-14" />
        <h3 className="text-xl font-bold font-display text-ink mb-3 group-hover:text-brand transition-colors duration-200">
          {title}
        </h3>
        <p className="text-base text-slate leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </Card>
  );
}
