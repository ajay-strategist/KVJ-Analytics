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
    // Space Grotesk display — medium weight, tight tracking, on dark.
    hero: "text-[40px] sm:text-[50px] lg:text-[62px] font-medium tracking-[-0.025em] leading-[1.08] font-display text-ink",
    h1: "text-[34px] lg:text-[54px] font-medium tracking-[-0.025em] leading-[1.1] font-display text-ink",
    h2: "text-[28px] lg:text-[44px] font-medium tracking-[-0.02em] leading-[1.12] font-display text-ink",
    h3: "text-[20px] lg:text-[27px] font-medium tracking-[-0.015em] leading-[1.3] font-display text-ink",
  };

  return (
    <Tag className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
