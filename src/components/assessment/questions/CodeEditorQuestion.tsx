"use client";

import React from "react";
import dynamic from "next/dynamic";
import { FileCode } from "lucide-react";
import { QuestionProps } from "./types";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

export function CodeEditorQuestion({
  question,
  answer,
  colors,
  onAnswerChange,
}: QuestionProps) {
  const language = question.config?.language || "python";

  const getExtensions = (lang: string) => {
    try {
      if (lang === "python" && typeof python === "function") return [python()];
      if ((lang === "javascript" || lang === "js") && typeof javascript === "function")
        return [javascript()];
      if (lang === "sql" && typeof sql === "function") return [sql()];
    } catch (e) {
      console.error("CodeMirror extension error:", e);
    }
    return [];
  };

  return (
    <div className="space-y-2">
      <div
        className={`flex justify-between items-center px-4 py-2 border-t border-x rounded-t-xl ${colors.line}`}
      >
        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <FileCode className="w-4 h-4 text-brand" />
          {language} Sandbox compiler
        </span>
      </div>
      <div className={`border rounded-b-xl overflow-hidden ${colors.line}`}>
        <CodeMirror
          value={typeof answer === "string" ? answer : ""}
          height="320px"
          theme="light"
          extensions={getExtensions(language)}
          onChange={(val: string) => onAnswerChange(val)}
        />
      </div>
    </div>
  );
}

