"use client";

import React from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trophy,
  AlertTriangle,
  HelpCircle,
  X,
} from "lucide-react";
import { Lesson, ActivityResult } from "./types";
import { TestTakingWidget } from "@/components/assessment/TestTakingWidget";
import { LessonIframe, cleanLessonHtml } from "@/components/shared/LessonIframe";

interface LessonViewerProps {
  course: {
    id: string;
    title: string;
    slug: string;
  };
  activeLesson: Lesson;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
  isAssessmentActive: boolean;
  sidebarOpen: boolean;
  completedLessonIds: Set<string>;
  activityResult: ActivityResult | null;
  adminPreview: boolean;
  activeTest: any;
  loadingTest: boolean;
  attemptsCount: number;
  highestAttempt: any;
  loadingLessonContent: boolean;
  lessonContent: string | null;
  mainScrollRef: React.RefObject<HTMLDivElement | null>;
  totalLessons: number;
  activeIndex: number;
  viewerReady: boolean;
  onDismissActivityResult: () => void;
  onRetryLessonFetch: () => void;
  onStartAssessment: () => void;
  onExitAssessment: () => void;
  onCompleteAssessment: (score: number, maxScore: number, passed: boolean) => Promise<void>;
  onSelectLesson: (lesson: Lesson) => void;
  onMarkCompleteAndNext: () => void;
  onIframeContentWindow: (win: Window | null) => void;
}

export function LessonViewer({
  course,
  activeLesson,
  prevLesson,
  nextLesson,
  isAssessmentActive,
  sidebarOpen,
  completedLessonIds,
  activityResult,
  adminPreview,
  activeTest,
  loadingTest,
  attemptsCount,
  highestAttempt,
  loadingLessonContent,
  lessonContent,
  mainScrollRef,
  totalLessons,
  activeIndex,
  viewerReady,
  onDismissActivityResult,
  onRetryLessonFetch,
  onStartAssessment,
  onExitAssessment,
  onCompleteAssessment,
  onSelectLesson,
  onMarkCompleteAndNext,
  onIframeContentWindow,
}: LessonViewerProps) {
  if (isAssessmentActive && activeTest) {
    return (
      <div ref={mainScrollRef} className="flex-1 overflow-y-auto p-0 relative bg-[#F8FAFC]">
        <TestTakingWidget
          testId={activeTest.id}
          courseSlug={course.slug}
          adminPreview={adminPreview}
          darkMode={false}
          autoStart={true}
          onStart={onStartAssessment}
          onExit={onExitAssessment}
          onNext={nextLesson ? () => onMarkCompleteAndNext() : undefined}
          onComplete={onCompleteAssessment}
        />
      </div>
    );
  }

  return (
    <div
      ref={mainScrollRef}
      className={`flex-1 overflow-y-auto relative transition-all duration-300 ${
        !sidebarOpen ? "p-2 sm:p-4 md:p-6 lg:p-8" : "p-4 sm:p-6 md:p-8"
      }`}
    >
      <div
        className={`mx-auto space-y-8 transition-all duration-300 ${
          !sidebarOpen ? "w-full max-w-[98%]" : "max-w-5xl"
        }`}
      >
        {/* Lesson Title & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-line">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-slate-900">
              {activeLesson.moduleTitle || activeLesson.title}
            </h1>
          </div>

          {completedLessonIds.has(activeLesson.id) && (
            <span className="py-1.5 px-4 font-semibold text-xs flex items-center gap-1.5 border rounded-full bg-emerald-50 text-[#08A88A] border-[#08A88A]/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          )}
        </div>

        {/* Video Player Box */}
        {activeLesson.video_url && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden border bg-black shadow-2xl relative border-zinc-200">
            <video
              src={activeLesson.video_url}
              controls
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Activity score banner */}
        {activityResult && (
          <div className="flex items-center justify-between gap-4 border rounded-2xl px-5 py-4 bg-emerald-50 border-brand/20 text-brand">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 shrink-0 text-[#059669]" />
              <div>
                <p className="text-sm font-bold text-[#059669]">
                  Activity complete!
                  {adminPreview && (
                    <span className="ml-2 text-[10px] font-normal opacity-70">
                      (admin preview — not saved)
                    </span>
                  )}
                </p>
                <p className="text-xs font-mono mt-0.5 text-brand/80">
                  Score: {activityResult.score} / {activityResult.maxScore}
                  {activityResult.maxScore > 0 && (
                    <span className="ml-2 opacity-80">
                      ({Math.round((activityResult.score / activityResult.maxScore) * 100)}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onDismissActivityResult}
              className="shrink-0 transition-colors text-brand/60 hover:text-brand"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Text Description Box / Assessment Workspace */}
        {activeLesson.kind === "assessment" ? (
          loadingTest ? (
            <div className="py-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
          ) : !activeTest ? (
            <div className="text-center py-12 rounded-3xl p-8 border bg-white border-line shadow-soft">
              <HelpCircle className="w-12 h-12 text-zinc-550 mx-auto mb-3" />
              <p className="text-sm font-semibold text-ink">Assessment Under Construction</p>
              <p className="text-xs mt-1 text-slate">This module assessment has not been configured yet.</p>
            </div>
          ) : activeTest.attempts_allowed > 0 && attemptsCount >= activeTest.attempts_allowed ? (
            <div className="text-center py-12 rounded-3xl p-8 space-y-4 border bg-white border-line shadow-soft">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-ink">Attempt Limit Reached</h3>
              <p className="text-xs leading-relaxed max-w-md mx-auto text-slate">
                You have used all {activeTest.attempts_allowed} of your allowed attempts for this module assessment.
              </p>
              {highestAttempt && (
                <div className="border p-4 rounded-xl max-w-xs mx-auto text-xs bg-zinc-50 border-zinc-200 text-zinc-650">
                  <span className="block uppercase tracking-wider font-bold text-[9px] mb-1 opacity-70">
                    Your Best Score
                  </span>
                  <span className="text-sm font-bold block text-ink">
                    {highestAttempt.score} / {highestAttempt.max_score} Marks (
                    {highestAttempt.max_score > 0
                      ? Math.round((highestAttempt.score / highestAttempt.max_score) * 100)
                      : 0}
                    %)
                  </span>
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      highestAttempt.passed
                        ? "bg-emerald-500/10 text-emerald-450"
                        : "bg-red-500/10 text-red-450"
                    }`}
                  >
                    {highestAttempt.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center gap-3">
                {nextLesson ? (
                  <button
                    type="button"
                    onClick={onMarkCompleteAndNext}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-[#08A88A] hover:bg-[#068A72] text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  >
                    Continue to Next Session
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onMarkCompleteAndNext}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                  >
                    Finish Course
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="border rounded-3xl overflow-hidden bg-white border-line shadow-soft">
              <TestTakingWidget
                testId={activeTest.id}
                courseSlug={course.slug}
                adminPreview={adminPreview}
                darkMode={false}
                isInline={activeTest.is_inline}
                showAnswers={Boolean(activeTest.is_inline)}
                onStart={() => {
                  if (!activeTest.is_inline) {
                    onStartAssessment();
                  }
                }}
                onExit={() => {
                  if (!activeTest.is_inline) {
                    onExitAssessment();
                  }
                }}
                onNext={nextLesson ? () => onMarkCompleteAndNext() : undefined}
                onComplete={onCompleteAssessment}
              />
            </div>
          )
        ) : (
          <div className="border rounded-3xl overflow-hidden bg-white border-line shadow-soft">
            {loadingLessonContent ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#08A88A]" />
                <p className="text-xs text-zinc-500 font-medium">Loading lesson material...</p>
              </div>
            ) : lessonContent || activeLesson.content_html ? (
              <div className="divide-y divide-line">
                {(() => {
                  const rawHtml = lessonContent || activeLesson.content_html || "";
                  const cleanedHtml = cleanLessonHtml(rawHtml);
                  return cleanedHtml
                    .split(/(<div class="kvj-assessment-placeholder[^>]*><\/div>)/g)
                    .map((segment, idx) => {
                      const match = segment.match(/data-test-id="([^"]*)"/);
                      if (match) {
                        const testId = match[1];
                        const showAnswersMatch = segment.match(/data-show-answers="([^"]*)"/);
                        const showAnswers = showAnswersMatch
                          ? showAnswersMatch[1] === "true"
                          : false;
                        return (
                          <div key={idx} className="px-3 sm:px-6 md:px-10 py-6 bg-transparent">
                            <TestTakingWidget
                              testId={testId}
                              courseSlug={course.slug}
                              adminPreview={adminPreview}
                              darkMode={false}
                              isInline={true}
                              showAnswers={showAnswers}
                              onStart={() => {}}
                              onExit={() => {}}
                              onComplete={async (score, maxScore) => {
                                console.log(
                                  `Embedded test ${testId} completed: ${score}/${maxScore}`
                                );
                              }}
                            />
                          </div>
                        );
                      }

                      if (!segment.trim() || segment === " ") return null;

                      return (
                        <div key={idx} className="w-full">
                          <LessonIframe
                            html={segment}
                            darkMode={false}
                            hideSidebar={viewerReady ? !sidebarOpen : false}
                            onLightDetected={() => {}}
                            onContentWindow={onIframeContentWindow}
                          />
                        </div>
                      );
                    });
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-zinc-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <p className="text-sm font-semibold text-zinc-600">
                  Lesson content could not be loaded.
                </p>
                <p className="text-xs text-center max-w-xs text-zinc-400">
                  This may be a temporary network issue. Please tap Retry — your progress is safe.
                </p>
                <button
                  type="button"
                  onClick={onRetryLessonFetch}
                  className="mt-1 px-5 py-2 rounded-lg text-sm font-semibold bg-[#08A88A] hover:bg-[#068A72] text-white transition-colors shadow-sm"
                >
                  ↺ Retry
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        {!isAssessmentActive && (
          <div className="flex items-center justify-between border-t pt-6 mt-12 border-line">
            <button
              type="button"
              disabled={!prevLesson}
              onClick={() => onSelectLesson(prevLesson!)}
              className="py-2 px-5 text-sm border flex items-center gap-1.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
            >
              <ChevronLeft className="w-4 h-4" /> Prev Lesson
            </button>

            <span className="text-sm font-mono text-zinc-400">
              {activeIndex + 1} of {totalLessons}
            </span>

            {activeLesson.kind === "assessment" ? (
              nextLesson ? (
                <button
                  type="button"
                  onClick={onMarkCompleteAndNext}
                  className="py-2.5 px-6 bg-[#08A88A] hover:bg-[#068A72] text-white text-sm font-semibold flex items-center gap-1.5 rounded-xl border-none transition-all shadow-[0_4px_15px_rgba(8,168,138,0.2)]"
                >
                  Continue to Next Session <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onMarkCompleteAndNext}
                  className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-1.5 rounded-xl border-none transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
                >
                  Finish Course <CheckCircle2 className="w-4 h-4" />
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={onMarkCompleteAndNext}
                className="py-2.5 px-6 bg-[#08A88A] hover:bg-[#068A72] active:scale-[0.98] text-white text-sm font-bold flex items-center gap-2 rounded-xl border-none transition-all shadow-[0_4px_15px_rgba(8,168,138,0.25)] cursor-pointer"
              >
                {completedLessonIds.has(activeLesson.id) ? (
                  nextLesson ? (
                    <>
                      <span>Next Lesson</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Finish Course</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )
                ) : nextLesson ? (
                  <>
                    <span>Mark Complete & Next Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Mark Complete & Finish Course</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

