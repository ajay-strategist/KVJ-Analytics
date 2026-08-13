import React from "react";

export type CardTone = "neutral" | "emerald" | "teal" | "amber" | "violet" | "blue";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  /** Soft category color. Defaults to neutral (white). */
  tone?: CardTone;
}

export function Card({
  children,
  className = "",
  hoverLift = true,
  tone = "neutral",
  ...props
}: CardProps) {
  return (
    <div
      className={`card-tone-${tone} rounded-card border p-6 shadow-md transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hoverLift ? "hover:shadow-xl hover:-translate-y-1.5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
