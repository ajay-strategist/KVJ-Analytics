"use client";

import React from "react";
import { QuestionProps } from "./types";

export function MatrixQuestion({
  question,
  answer,
  colors,
  onAnswerChange,
}: QuestionProps) {
  const rows: string[] = question.config?.rows || [];
  const columns: string[] = question.config?.columns || [];
  const isMultiple = Boolean(question.config?.multiple);

  const updateMatrix = (rIdx: number, cIdx: number) => {
    const grid: number[][] = (Array.isArray(answer) ? answer : []).map((r) => [
      ...(Array.isArray(r) ? r : []),
    ]);
    while (grid.length <= rIdx) grid.push([]);

    if (isMultiple) {
      const set = new Set<number>(grid[rIdx]);
      if (set.has(cIdx)) set.delete(cIdx);
      else set.add(cIdx);
      grid[rIdx] = Array.from(set).sort((a, b) => a - b);
    } else {
      grid[rIdx] = [cIdx];
    }
    onAnswerChange(grid);
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className={`w-full text-sm border rounded-xl overflow-hidden ${colors.line}`}>
          <thead>
            <tr className="bg-surface/50">
              <th className={`p-3 border text-left ${colors.line}`}></th>
              {columns.map((col: string, cIdx: number) => (
                <th
                  key={cIdx}
                  className={`p-3 border text-xs font-bold text-center whitespace-nowrap ${colors.line}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: string, rIdx: number) => (
              <tr key={rIdx}>
                <td className={`p-3 border text-sm font-semibold ${colors.line}`}>{row}</td>
                {columns.map((_col: string, cIdx: number) => {
                  const rowAns: number[] = (answer?.[rIdx] || []) as number[];
                  const checked = rowAns.includes(cIdx);
                  return (
                    <td key={cIdx} className={`p-3 border text-center ${colors.line}`}>
                      <input
                        type={isMultiple ? "checkbox" : "radio"}
                        name={`matrix-${question.id}-row-${rIdx}`}
                        checked={checked}
                        onChange={() => updateMatrix(rIdx, cIdx)}
                        className="w-4 h-4 accent-brand cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="block md:hidden space-y-4">
        {rows.map((row: string, rIdx: number) => (
          <div key={rIdx} className={`p-4 border rounded-xl space-y-3 ${colors.card}`}>
            <h5 className="text-xs font-bold uppercase tracking-wider text-brand">{row}</h5>
            <div className="flex flex-wrap gap-2">
              {columns.map((col: string, cIdx: number) => {
                const rowAns: number[] = (answer?.[rIdx] || []) as number[];
                const checked = rowAns.includes(cIdx);
                return (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => updateMatrix(rIdx, cIdx)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      checked
                        ? "border-brand bg-brand/10 text-brand"
                        : `${colors.card} hover:border-slate/40`
                    }`}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

