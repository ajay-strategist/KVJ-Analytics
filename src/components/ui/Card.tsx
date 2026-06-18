import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
}

export function Card({
  children,
  className = "",
  hoverLift = true,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-card rounded-card border border-line p-6 shadow-md transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hoverLift
          ? "hover:shadow-xl hover:-translate-y-1.5"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
