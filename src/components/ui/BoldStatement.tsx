import React from "react";

interface BoldStatementProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  variant?: "hero" | "h1" | "h2" | "h3";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function BoldStatement({
  children,
  variant = "h2",
  as,
  className = "",
  ...props
}: BoldStatementProps) {
  const Tag = as || (variant === "hero" ? "h1" : variant);

  const variantClasses = {
    hero: "text-[40px] sm:text-[52px] lg:text-[68px] font-extrabold tracking-[-0.03em] leading-[1.02] font-display text-ink",
    h1: "text-[32px] lg:text-[46px] font-extrabold tracking-[-0.025em] leading-[1.1] font-display text-ink",
    h2: "text-[26px] lg:text-[36px] font-bold tracking-[-0.02em] leading-[1.15] font-display text-ink",
    h3: "text-[20px] lg:text-[25px] font-bold tracking-[-0.015em] leading-[1.25] font-display text-ink",
  };

  return (
    <Tag className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
