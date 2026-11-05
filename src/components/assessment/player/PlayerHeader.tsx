"use client";

import React from "react";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Lesson } from "./types";

interface PlayerHeaderProps {
  sidebarOpen: boolean;
  activeLesson: Lesson | null;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  isAssessmentActive: boolean;
  hasHtmlContent: boolean;
  viewerReady: boolean;
  completedLessonIds: Set<string>;
  onToggleSidebar: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onMarkCompleteAndNext: () => void;
}

export function PlayerHeader({
  sidebarOpen,
  activeLesson,
  prevLesson,
  nextLesson,
  isAssessmentActive,
  hasHtmlContent,
  viewerReady,
  completedLessonIds,
  onToggleSidebar,
  onSelectLesson,
  onMarkCompleteAndNext,
}: PlayerHeaderProps) {
  return (
    <header className="h-16 border-b px-4 md:px-6 flex items-center justify-between shrink-0 backdrop-blur-md relative z-30 transition-colors duration-300 border-line bg-white/75">
      <div className="flex items-center gap-3 min-w-0">
        {!sidebarOpen && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
            className="p-2 rounded-lg border shrink-0 transition-colors bg-white border-zinc-200 text-zinc-650 hover:text-zinc-800"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {activeLesson && (
          <span className="text-xs font-mono font-bold uppercase truncate text-slate/60">
            {activeLesson.kind === "activity" ? "Lesson Activity" : "Study Material"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        {/* ── Viewer controls (only shown when lesson has HTML content) ── */}
        {hasHtmlContent && viewerReady && (
          <>
            <button
              type="button"
              onClick={onToggleSidebar}
              title={!sidebarOpen ? "Show navigation sidebar" : "Hide navigation sidebar"}
              className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 ${
                !sidebarOpen
                  ? "bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]"
                  : "bg-zinc-100 border-zinc-200 text-zinc-650 hover:text-zinc-800 hover:bg-zinc-200/50"
              }`}
            >
              {!sidebarOpen ? (
                <PanelLeftOpen className="w-3.5 h-3.5" />
              ) : (
                <PanelLeftClose className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline text-[10px] font-semibold leading-none">
                {!sidebarOpen ? "Show Nav" : "Hide Nav"}
              </span>
            </button>

            {/* Separator */}
            <span className="w-px h-5 bg-zinc-200 hidden sm:block" />
          </>
        )}

        {/* Prev / Next mini buttons in header */}
        {activeLesson && !isAssessmentActive && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!prevLesson}
              onClick={() => onSelectLesson(prevLesson!)}
              className="py-1.5 px-3 text-xs border flex items-center gap-1 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            {nextLesson ? (
              <button
                type="button"
                onClick={onMarkCompleteAndNext}
                className={`py-1.5 px-3 text-xs border flex items-center gap-1.5 rounded-lg transition-all font-semibold ${
                  completedLessonIds.has(activeLesson.id)
                    ? "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
                    : "bg-[#08A88A] hover:bg-[#068A72] text-white border-transparent shadow-sm"
                }`}
              >
                <span>{completedLessonIds.has(activeLesson.id) ? "Next" : "Complete & Next"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onMarkCompleteAndNext}
                className="py-1.5 px-3 text-xs border flex items-center gap-1.5 rounded-lg transition-all font-semibold bg-emerald-50 hover:bg-emerald-100 text-brand border-brand/20"
              >
                Finish <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

