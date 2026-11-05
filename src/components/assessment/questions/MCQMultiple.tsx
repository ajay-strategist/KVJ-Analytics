"use client";

import React from "react";
import { QuestionProps } from "./types";
import { isImageUrl, getDirectImageUrl } from "../TestTakingWidget";

export function MCQMultiple({
  question,
  answer,
  checkedAnswer,
  isInline,
  colors,
  onAnswerChange,
  onClearChecked,
}: QuestionProps) {
  if (!question.config?.options) return null;

  const currentVal = Array.isArray(answer) ? answer : [];
  const isChecked = checkedAnswer?.checked;
  const correctIndexes = checkedAnswer?.correctIndexes || [];

  const handleGoogleDriveImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.src.includes("drive.google.com/thumbnail")) {
      const idMatch = img.src.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        img.src = `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1000`;
      }
    }
  };

  return (
    <div className="space-y-3">
      {question.config.options.map((opt: string, oIdx: number) => {
        const isSelected = currentVal.includes(oIdx);
        const isThisCorrectOption =
          isChecked &&
          Array.isArray(correctIndexes) &&
          correctIndexes.map(Number).includes(oIdx);

        const optImage =
          question.config?.optionImages?.[oIdx] || (isImageUrl(opt) ? opt : "");
        const hasImage = Boolean(optImage);
        const optLabel = question.config?.optionImages?.[oIdx]
          ? opt
          : isImageUrl(opt)
          ? ""
          : opt;

        let borderStyle = isSelected
          ? "border-brand bg-brand/5 shadow-sm"
          : `${colors.card} ${colors.hover}`;
        if (isChecked) {
          if (isThisCorrectOption) {
            borderStyle =
              "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]";
          } else if (isSelected) {
            borderStyle =
              "border-red-500 bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400 font-bold";
          }
        }

        return (
          <div
            key={oIdx}
            onClick={() => {
              if (isChecked) return;
              let next = [...currentVal];
              if (isSelected) next = next.filter((x) => x !== oIdx);
              else next.push(oIdx);
              onAnswerChange(next);
              onClearChecked();
            }}
            className={`p-4 border rounded-xl cursor-pointer transition-all flex ${
              hasImage ? "items-start gap-3.5" : "items-center gap-3"
            } ${borderStyle}`}
          >
            {isInline ? (
              <span
                className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                  hasImage ? "mt-0.5" : ""
                } ${
                  isChecked
                    ? isThisCorrectOption
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isSelected
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-[#DCE5E8] text-zinc-500 dark:border-white/10"
                    : isSelected
                    ? "border-brand bg-brand text-black font-black"
                    : "border-[#DCE5E8] text-zinc-500 dark:border-white/10"
                }`}
              >
                {String.fromCharCode(65 + oIdx)}
              </span>
            ) : (
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className={`w-4 h-4 text-brand rounded ${hasImage ? "mt-1" : ""}`}
              />
            )}
            {hasImage ? (
              <div className="flex-1 flex flex-col gap-2 min-w-0">
                {optLabel ? (
                  <span className="text-sm font-semibold">{optLabel}</span>
                ) : (
                  <span className="text-xs font-semibold text-slate">
                    Option {String.fromCharCode(65 + oIdx)}
                  </span>
                )}
                <div className="rounded-xl border border-line/80 bg-white p-2.5 shadow-sm max-w-md w-full overflow-hidden">
                  <img
                    src={getDirectImageUrl(optImage)}
                    alt={optLabel || `Option ${String.fromCharCode(65 + oIdx)}`}
                    className="max-h-52 w-auto object-contain mx-auto rounded"
                    referrerPolicy="no-referrer"
                    onError={handleGoogleDriveImageError}
                  />
                </div>
              </div>
            ) : (
              <span className="text-sm font-semibold">{opt}</span>
            )}
            {isChecked && isThisCorrectOption && (
              <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">
                ✓ Correct
              </span>
            )}
            {isChecked && isSelected && !isThisCorrectOption && (
              <span className="ml-auto text-[9px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-full shrink-0">
                Your Choice
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

