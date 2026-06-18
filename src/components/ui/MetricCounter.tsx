"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface MetricCounterProps {
  label: string; // e.g. "50,000+ Young Professionals Trained"
}

type Parsed =
  | { numeric: false; initial: string; subText: string }
  | { numeric: true; target: number; hasCommas: boolean; suffix: string; subText: string };

function parseLabel(label: string): Parsed {
  const match = label.match(/^([0-9,]+)(\+)?\s*(.*)$/);
  if (!match) {
    const words = label.trim().split(/\s+/);
    if (words.length > 1) {
      return { numeric: false, initial: words[0], subText: words.slice(1).join(" ") };
    }
    return { numeric: false, initial: label, subText: "" };
  }
  const [, numberStr, plus, rest] = match;
  const targetNum = parseInt(numberStr.replace(/,/g, ""), 10);
  const subText = rest;
  if (isNaN(targetNum)) {
    return { numeric: false, initial: numberStr + (plus || ""), subText };
  }
  return {
    numeric: true,
    target: targetNum,
    hasCommas: numberStr.includes(","),
    suffix: plus || "",
    subText,
  };
}

export function MetricCounter({ label }: MetricCounterProps) {
  // Parse during render (no setState-in-effect) — see parseLabel above.
  const parsed = useMemo(() => parseLabel(label), [label]);

  const [displayValue, setDisplayValue] = useState(parsed.numeric ? "0" : parsed.initial);
  const elementRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!parsed.numeric) return;

    const { target, hasCommas, suffix } = parsed;
    const formatNumber = (num: number) =>
      hasCommas ? num.toLocaleString("en-IN") : num.toString();

    const animateCount = () => {
      const duration = 1500;
      const startTime = performance.now();
      const update = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress * (2 - progress); // ease-out quad
        setDisplayValue(formatNumber(Math.floor(eased * target)) + suffix);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          setDisplayValue(formatNumber(target) + suffix);
        }
      };
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 }
    );

    const el = elementRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [parsed]);

  return (
    <div ref={elementRef} className="flex flex-col items-center text-center px-3 py-6 sm:p-6 w-full">
      <h3 className="text-[1.6rem] sm:text-3xl lg:text-[2rem] font-extrabold font-display signature-gradient-text tracking-tight mb-2 min-h-[40px] lg:min-h-[44px] flex items-center justify-center whitespace-nowrap">
        {displayValue || "0"}
      </h3>
      <p className="text-[10px] sm:text-xs font-bold text-slate uppercase tracking-[0.08em] max-w-[180px] leading-snug">
        {parsed.subText}
      </p>
    </div>
  );
}
