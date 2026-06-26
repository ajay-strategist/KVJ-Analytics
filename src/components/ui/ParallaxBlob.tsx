"use client";

import React, { useEffect, useState } from "react";

interface ParallaxBlobProps {
  className?: string;
  speed?: number; // Speed factor (e.g., 0.1 to 0.3)
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function ParallaxBlob({ className = "", speed = 0.15, style = {}, children }: ParallaxBlobProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      className={className}
      style={{
        ...style,
        transform: `translateY(${offset}px) translateZ(0)`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
