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
    // Primary: filled gold metallic gradient pill with navy text (main CTA on light pages)
    primary:
      "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-navy rounded-full px-7 py-3.5 shadow-[0_8px_24px_rgba(191,149,63,0.25)] hover:shadow-[0_16px_36px_rgba(191,149,63,0.40)] hover:-translate-y-0.5 sheen transition-all duration-300 font-bold border border-navy/10",
    // Secondary: glass/outline card that has sheen
    secondary:
      "border border-navy/20 bg-white/50 text-navy rounded-full px-7 py-3.5 hover:border-brand hover:text-[#B8860B] hover:-translate-y-0.5 sheen shadow-sm transition-all duration-300",
    // Text link + arrow nudge (accent)
    ghost:
      "bg-transparent text-brand hover:text-brand-700 px-0 py-2 transition-colors font-semibold",
    // White glass pill for hero overlays (dark text)
    light:
      "bg-white/70 backdrop-blur-md text-navy border border-navy/15 rounded-full px-7 py-3.5 shadow-[0_8px_24px_rgba(10,17,40,0.04)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(191,149,63,0.15)] hover:border-brand sheen transition-all duration-300",
    // Accent: filled gold gradient with glow
    accent:
      "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-navy rounded-full px-7 py-3.5 shadow-[0_10px_30px_rgba(191,149,63,0.30)] hover:shadow-[0_16px_42px_rgba(191,149,63,0.45)] hover:-translate-y-0.5 sheen transition-all duration-300 font-bold border border-navy/10",
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
