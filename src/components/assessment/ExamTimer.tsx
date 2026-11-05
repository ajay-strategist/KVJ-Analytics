"use client";

import React from "react";
import { Clock } from "lucide-react";

interface ExamTimerProps {
  timeRemaining: number;
  className?: string;
}

export function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

export function ExamTimer({ timeRemaining, className = "" }: ExamTimerProps) {
  const isUrgent = timeRemaining < 120;

  return (
    <div
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-mono text-sm font-bold transition-all ${
        isUrgent
          ? "text-red-500 border-red-500/70 bg-red-500/10"
          : "border-slate-200/80 bg-white dark:bg-zinc-900/60 text-slate-800 dark:text-zinc-200"
      } ${className}`}
    >
      <Clock
        className={`w-4 h-4 ${
          isUrgent
            ? "text-red-500 animate-[pulse_0.6s_infinite]"
            : "text-brand animate-pulse"
        }`}
      />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
}

