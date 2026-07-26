import React from "react";

interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  segment?: "corporate" | "education" | "neutral";
}

export function Eyebrow({
  children,
  segment = "neutral",
  className = "",
  ...props
}: EyebrowProps) {
  const colorClasses = {
    neutral: "text-brand",
    corporate: "text-corporate",
    education: "text-education",
  };

  return (
    <span
      className={`text-[12px] font-extrabold uppercase tracking-[0.15em] ${colorClasses[segment]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
