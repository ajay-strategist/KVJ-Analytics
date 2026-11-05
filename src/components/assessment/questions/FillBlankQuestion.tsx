"use client";

import React from "react";
import { QuestionProps } from "./types";

export function FillBlankQuestion({
  question,
  answer,
  colors,
  onAnswerChange,
}: QuestionProps) {
  const template = question.config?.template || "";
  const blanks = question.config?.blanks || [];
  const currentVal = Array.isArray(answer) ? answer : [];
  const parts = template.split(/(\{\{\d+\}\})/g);

  return (
    <div className={`leading-loose text-sm font-medium border rounded-xl p-5 ${colors.card}`}>
      {parts.map((part: string, index: number) => {
        const match = part.match(/\{\{(\d+)\}\}/);
        if (match) {
          const blankIdx = parseInt(match[1], 10) - 1;
          const blank = blanks[blankIdx];
          if (!blank) return null;
          const val = currentVal[blankIdx] || "";

          if (blank.mode === "dropdown") {
            return (
              <select
                key={index}
                value={val}
                onChange={(e) => {
                  const next = [...currentVal];
                  next[blankIdx] = e.target.value;
                  onAnswerChange(next);
                }}
                className={`inline-block mx-1.5 px-2.5 py-1 rounded border text-xs font-semibold focus:outline-none focus:border-brand ${colors.card}`}
              >
                <option value="">-- select --</option>
                {(blank.options || []).map((o: string) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            );
          } else {
            return (
              <input
                key={index}
                type="text"
                placeholder={`blank #${blankIdx + 1}`}
                value={val}
                onChange={(e) => {
                  const next = [...currentVal];
                  next[blankIdx] = e.target.value;
                  onAnswerChange(next);
                }}
                className={`inline-block mx-1.5 px-2.5 py-1 rounded border text-xs font-semibold w-32 focus:outline-none focus:border-brand ${colors.card}`}
              />
            );
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}

