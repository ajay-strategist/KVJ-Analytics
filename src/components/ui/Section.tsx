import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  background?: "default" | "surface" | "navy" | "gradient";
}

export function Section({
  children,
  className = "",
  background = "default",
  ...props
}: SectionProps) {
  const bgClasses = {
    default: "bg-transparent",
    surface: "bg-surface",
    navy: "bg-navy text-white",
    gradient: "signature-gradient text-white",
  };

  return (
    <section
      className={`py-14 md:py-24 lg:py-[112px] ${bgClasses[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
