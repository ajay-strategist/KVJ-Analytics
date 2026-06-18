import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
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
    "group/btn relative inline-flex items-center justify-center gap-2 font-body text-[15px] font-bold tracking-tight transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer will-change-transform";

  const variantClasses = {
    // Orange primary — premium gradient + animated sheen + layered shadow
    primary:
      "sheen text-white rounded-btn px-7 py-3.5 hover:-translate-y-0.5 active:translate-y-0 border-none [background:var(--gradient-orange)] [box-shadow:0_8px_22px_rgba(249,115,22,0.32)] hover:[box-shadow:0_14px_34px_rgba(249,115,22,0.42)]",
    // Royal blue outline secondary — refined
    secondary:
      "bg-white/60 text-brand border border-brand/25 hover:border-brand/50 hover:bg-brand/5 rounded-btn px-7 py-3 shadow-soft hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 backdrop-blur-sm",
    // Ghost — inline link-style
    ghost:
      "bg-transparent text-brand hover:text-brand-700 px-4 py-2 hover:translate-x-1",
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
