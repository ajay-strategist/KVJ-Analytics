import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light" | "accent";
  href?: string;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "group/btn relative inline-flex items-center justify-center gap-2.5 font-body text-[15px] font-medium transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variantClasses = {
    // Primary: filled brand gradient pill (main CTA on light pages)
    primary:
      "bg-gradient-to-r from-brand to-brand-700 text-white rounded-full px-7 py-3.5 shadow-[0_8px_24px_rgba(123,97,255,0.22)] hover:shadow-[0_16px_36px_rgba(123,97,255,0.35)] hover:-translate-y-0.5 sheen transition-all duration-300",
    // Secondary: glass/outline card that has sheen
    secondary:
      "border border-line bg-white/50 text-ink rounded-full px-7 py-3.5 hover:border-brand/40 hover:text-brand hover:-translate-y-0.5 sheen shadow-sm transition-all duration-300",
    // Text link + arrow nudge (accent)
    ghost:
      "bg-transparent text-brand hover:text-accent-bright px-0 py-2 transition-colors",
    // White glass pill for hero overlays (dark text)
    light:
      "bg-white/70 backdrop-blur-md text-ink border border-white/90 rounded-full px-7 py-3.5 shadow-[0_8px_24px_rgba(123,97,255,0.06)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(123,97,255,0.12)] hover:border-brand/40 sheen transition-all duration-300",
    // Accent: filled brand gradient with glow (same as primary, kept for emphasis)
    accent:
      "bg-gradient-to-r from-brand to-brand-700 text-white rounded-full px-7 py-3.5 shadow-[0_10px_30px_rgba(123,97,255,0.26)] hover:shadow-[0_16px_42px_rgba(123,97,255,0.40)] hover:-translate-y-0.5 sheen transition-all duration-300",
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    // Hash anchors and external links use a plain <a> for reliable
    // native scrolling / new-tab behaviour; internal routes use next/link.
    const isPlainAnchor = href.startsWith("#") || /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

    if (isPlainAnchor) {
      return (
        <a href={href} className={finalClasses}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={finalClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={finalClasses} {...props}>
      {children}
    </button>
  );
}
