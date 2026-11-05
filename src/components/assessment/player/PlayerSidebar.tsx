"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { Lesson, EnrichedModule } from "./types";

interface PlayerSidebarProps {
  course: {
    id: string;
    title: string;
    slug: string;
  };
  enrichedModules: EnrichedModule[];
  sidebarOpen: boolean;
  isAssessmentActive: boolean;
  expandedModuleIds: Set<string>;
  activeLesson: Lesson | null;
  completedLessonIds: Set<string>;
  totalLessons: number;
  completedLessonsCount: number;
  percentComplete: number;
  onSelectLesson: (lesson: Lesson) => void;
  onToggleModule: (moduleId: string) => void;
  onCloseSidebar: () => void;
}

export function PlayerSidebar({
  course,
  enrichedModules,
  sidebarOpen,
  isAssessmentActive,
  expandedModuleIds,
  activeLesson,
  completedLessonIds,
  totalLessons,
  completedLessonsCount,
  percentComplete,
  onSelectLesson,
  onToggleModule,
  onCloseSidebar,
}: PlayerSidebarProps) {
  return (
    <div
      className={`fixed top-0 bottom-0 left-0 z-40 w-[320px] lg:w-[22%] lg:min-w-[280px] lg:max-w-[360px] flex flex-col transition-all duration-300 transform ${
        isAssessmentActive
          ? "-translate-x-full lg:-ml-[22%] lg:hidden"
          : sidebarOpen
          ? "translate-x-0 lg:relative lg:translate-x-0"
          : "-translate-x-full lg:-ml-[22%]"
      } bg-white border-r border-slate-200/60 shadow-[1px_0_10px_rgba(0,0,0,0.01)]`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
        <div>
          <Link
            href={`/training/${course.slug}`}
            className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors group text-zinc-400 hover:text-[#10B981]"
          >
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to detail
          </Link>
          <h2 className="text-base font-extrabold font-display mt-2 line-clamp-1 tracking-tight text-slate-900">
            {course.title}
          </h2>
        </div>
        <button
          onClick={onCloseSidebar}
          className="lg:hidden p-2 rounded-xl transition-colors text-zinc-500 hover:bg-slate-100"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Tracker */}
      <div className="p-6 border-b shrink-0 border-slate-105 bg-white">
        <div className="p-4 rounded-2xl border bg-[#F4F9FD]/40 border-slate-200/50 shadow-[0_4px_15px_rgba(16,35,63,0.01)]">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider mb-2.5 text-[#7B8A99]">
            <span>Course Progress</span>
            <span className="text-[#08A88A] font-mono font-bold">
              {percentComplete}% ({completedLessonsCount}/{totalLessons})
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-[#DCE5E8]">
            <div
              className="h-full bg-gradient-to-r from-[#08A88A] to-[#0E7490] rounded-full transition-all duration-550 shadow-[0_0_8px_rgba(8,168,138,0.2)]"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Curriculum list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {enrichedModules.map((mod, modIdx) => {
          const isOpen = expandedModuleIds.has(mod.id);
          return (
            <div
              key={mod.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen
                  ? "border-brand/20 bg-[#F0FBF7]/30 shadow-[0_4px_15px_rgba(8,168,138,0.02)]"
                  : "border-slate-200 bg-transparent"
              }`}
            >
              {/* Module Accordion Header Trigger */}
              <button
                onClick={() => onToggleModule(mod.id)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono border shrink-0 bg-[#F0FBF7] text-[#08A88A] border-[#DDF8F0]">
                    Mod {modIdx + 1}
                  </span>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider truncate font-sans text-[#10233F]">
                    {mod.title}
                  </h3>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                )}
              </button>

              {/* Module Accordion Lessons Panel */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-[1000px] border-t border-line/60 p-3 space-y-2" : "max-h-0"
                }`}
              >
                {mod.lessons.map((les) => {
                  const isActive = activeLesson?.id === les.id;
                  const isCompleted = completedLessonIds.has(les.id);

                  return (
                    <button
                      key={les.id}
                      id={`lesson-nav-${les.id}`}
                      onClick={() => onSelectLesson(les)}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 text-xs transition-all duration-200 border transform hover:translate-x-0.5 group ${
                        isActive
                          ? "bg-white text-[#10233F] font-bold border-[#08A88A]/60 shadow-[0_4px_12px_rgba(8,168,138,0.08)] scale-[1.01]"
                          : "hover:bg-[#F4F9FD] border-transparent text-[#526477] hover:text-[#10233F]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#08A88A] shrink-0" />
                        ) : (
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? "border-[#08A88A]"
                                : "border-[#DCE5E8] group-hover:border-[#08A88A]/40"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full transition-transform ${
                                isActive ? "bg-[#08A88A] scale-100" : "bg-transparent scale-0"
                              }`}
                            />
                          </div>
                        )}
                        <span
                          className={`truncate tracking-tight font-sans ${
                            isActive
                              ? "font-bold text-[#10233F]"
                              : "font-semibold text-[#526477] group-hover:text-[#10233F]"
                          }`}
                        >
                          {les.title}
                        </span>
                      </div>
                      {les.video_url && (
                        <PlayCircle className={`w-3.5 h-3.5 shrink-0 ${
                          isActive
                            ? "text-[#08A88A]"
                            : "text-[#7B8A99] group-hover:text-[#08A88A]"
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

