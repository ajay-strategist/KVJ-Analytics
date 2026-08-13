"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  ListOrdered,
  GripVertical,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  X,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import dynamic from "next/dynamic";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

let python: any;
let javascript: any;
let sql: any;

if (typeof window !== "undefined") {
  python = require("@codemirror/lang-python").python;
  javascript = require("@codemirror/lang-javascript").javascript;
  sql = require("@codemirror/lang-sql").sql;
}

// Draggable Right Item for DragDrop Matching
function DraggableItem({ id, text, colors }: { id: string; text: string; colors: any }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 border rounded-lg cursor-grab active:cursor-grabbing text-xs font-semibold shadow-sm select-none ${colors.card} ${colors.hover}`}
    >
      {text}
    </div>
  );
}

// Droppable Left Slot for DragDrop Matching
function DroppableSlot({
  id,
  matchedItem,
  label,
  onClear,
  colors,
}: {
  id: string;
  matchedItem?: string;
  label: string;
  onClear: () => void;
  colors: any;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div className="flex items-center gap-3">
      <div className={`w-1/2 p-3 border rounded-lg text-xs font-semibold ${colors.card}`}>
        {label}
      </div>
      <div className={`${colors.slate} font-bold text-xs`}>⇌</div>
      <div
        ref={setNodeRef}
        className={`w-1/2 p-3 border rounded-lg min-h-[46px] flex items-center justify-between text-xs font-semibold transition-all relative ${
          isOver ? "border-brand bg-brand/5 border-dashed" : `${colors.card}`
        }`}
      >
        {matchedItem ? (
          <>
            <span className={colors.ink}>{matchedItem}</span>
            <button
              type="button"
              onClick={onClear}
              className="text-error font-bold text-xs hover:underline cursor-pointer bg-transparent border-none p-1"
            >
              ✕
            </button>
          </>
        ) : (
          <span className={`${colors.slate} opacity-40 italic`}>Drop match here</span>
        )}
      </div>
    </div>
  );
}

// Sortable Item for Sequence Ordering
function SortableSeqItem({ id, text, colors }: { id: string; text: string; colors: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 border rounded-lg cursor-grab active:cursor-grabbing text-xs font-semibold shadow-sm flex items-center gap-2 select-none ${colors.card} ${colors.hover}`}
    >
      <GripVertical className={`w-4 h-4 shrink-0 ${colors.slate}`} />
      <span className={colors.ink}>{text}</span>
    </div>
  );
}

interface TestTakingWidgetProps {
  testId: string;
  courseSlug: string;
  adminPreview?: boolean;
  darkMode?: boolean;
  onComplete?: (score: number, maxScore: number, passed: boolean) => void;
  onExit?: () => void;
}

export function TestTakingWidget({
  testId,
  courseSlug,
  adminPreview = false,
  darkMode = false,
  onComplete,
  onExit,
}: TestTakingWidgetProps) {
  // Theme coloring mapping
  const colors = darkMode
    ? {
        container: "bg-[#09090b] text-zinc-100",
        surface: "bg-[#0A0A0C] text-zinc-100 border border-white/5",
        card: "bg-[#111114] border border-white/5 text-zinc-100",
        line: "border-white/5",
        ink: "text-zinc-100",
        slate: "text-zinc-400",
        active: "bg-brand/10 border-brand text-[#10B981]",
        hover: "hover:border-white/10 hover:bg-[#16161a]",
        btnSecondary: "bg-[#18181b] border-white/5 text-zinc-300 hover:bg-[#27272a] hover:text-white",
      }
    : {
        container: "bg-surface/50 text-ink",
        surface: "bg-card border border-line text-ink",
        card: "bg-card border border-line text-ink",
        line: "border-line",
        ink: "text-ink",
        slate: "text-slate",
        active: "bg-brand/10 border-brand text-brand",
        hover: "hover:border-slate/40 hover:bg-surface/30",
        btnSecondary: "bg-white border border-line text-slate hover:bg-surface hover:text-ink",
      };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [test, setTest] = useState<any>(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Student test values
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [gradedResult, setGradedResult] = useState<any>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch course and enrollments to double gate
        const resTest = await fetch(`/api/tests/${testId}${adminPreview ? "?preview=1" : ""}`);
        const testData = await resTest.json();

        if (!resTest.ok) {
          throw new Error(testData.error || "Mock test data unavailable.");
        }

        setTest(testData.test);

        // Prepopulate answers configurations
        const defaultAnswers: Record<string, any> = {};
        testData.test.questions.forEach((q: any) => {
          if (q.type === "single") defaultAnswers[q.id] = null;
          else if (q.type === "multiple") defaultAnswers[q.id] = [];
          else if (q.type === "truefalse") defaultAnswers[q.id] = null;
          else if (q.type === "dragdrop") {
            defaultAnswers[q.id] = (q.config.left || []).map((l: string) => [l, ""]);
          } else if (q.type === "sequence") {
            defaultAnswers[q.id] = [...(q.config.items || [])];
          } else if (q.type === "fillblank") {
            defaultAnswers[q.id] = Array(q.config.blanks?.length || 0).fill("");
          } else if (q.type === "matrix") {
            defaultAnswers[q.id] = (q.config.rows || []).map(() => []);
          } else if (q.type === "code") {
            defaultAnswers[q.id] = q.config.starterCode || "";
          }
        });
        setAnswers(defaultAnswers);
      } catch (err: any) {
        setError(err.message || "Failed to load test details.");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [testId]);

  // Countdown timer
  useEffect(() => {
    if (!started || completed || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, completed, timeRemaining]);

  const startTest = () => {
    if (!test) return;
    setStarted(true);
    setTimeRemaining(test.durationMins * 60);
  };

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    if (submitting || completed) return;
    if (!isAuto && !confirm("Are you sure you want to submit your mock test for grading?")) return;

    setSubmitting(true);
    try {
      const elapsedSecs = test.durationMins * 60 - timeRemaining;
      const bodyPayload = {
        answers,
        startedAt: new Date(Date.now() - elapsedSecs * 1000).toISOString(),
      };

      let result: any;
      if (adminPreview) {
        // Admin preview: simulate grading locally or fetch from server without saving to db.
        // To score correctly, we can hit `/api/tests/${testId}/submit` but wait,
        // the server route blocks non-enrolled students except admins!
        // Since the current user is an admin preview user, their token will be authorized on the server.
        // We can POST to `/api/tests/${testId}/submit`. The backend handles admin checks and
        // stores attempts, but we asked to "allow taking but don't save".
        // Wait, how can we avoid saving for admin preview in `/api/tests/[id]/route.ts`?
        // Ah, let's look at `POST /api/tests/[id]/route.ts`:
        // It always inserts a `test_attempts` row!
        // Wait! We can add a query parameter `preview=true` or similar to the submit POST request,
        // or the endpoint can check if `preview === true` in request body.
        // Let's modify `/api/tests/[id]/route.ts` so that if `preview: true` is passed,
        // it grades the test and returns the results but skips inserting the record to database!
        // That is exceptionally clean and perfectly respects "DO NOT save — just show a toast".
      }

      const res = await fetch(`/api/tests/${testId}/submit${adminPreview ? "?preview=true" : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      result = await res.json();
      if (!res.ok) throw new Error(result.error || "Submission grading failed.");

      setGradedResult(result);
      setCompleted(true);

      // Trigger completion callback
      onComplete?.(result.score, result.totalPossibleMarks, result.passed);
    } catch (err: any) {
      alert(err.message || "Failed to submit exam.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getExtensions = (lang: string) => {
    if (lang === "python" && python) return [python()];
    if ((lang === "javascript" || lang === "js") && javascript) return [javascript()];
    if (lang === "sql" && sql) return [sql()];
    return [];
  };

  const handleClearDragDrop = (leftVal: string) => {
    const nextMatches = (answers[currentQuestion.id] || []).map((p: any) => {
      if (p[0] === leftVal) return [leftVal, ""];
      return p;
    });
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: nextMatches }));
  };

  const handleDragEndDragDrop = (event: any) => {
    const { over, active } = event;
    if (!over || !active) return;

    const rightStr = active.id;
    const leftStr = over.id.replace("slot-", "");
    const currentMatches = answers[currentQuestion.id] || [];

    const nextMatches = currentMatches.map((p: any) => {
      if (p[0] === leftStr) return [leftStr, rightStr];
      if (p[1] === rightStr) return [p[0], ""];
      return p;
    });

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: nextMatches }));
  };

  const handleDragEndSequence = (event: any) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const currentSeq = answers[currentQuestion.id] || [];
    const oldIndex = currentSeq.indexOf(active.id);
    const newIndex = currentSeq.indexOf(over.id);

    const nextSeq = [...currentSeq];
    nextSeq.splice(oldIndex, 1);
    nextSeq.splice(newIndex, 0, active.id);

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: nextSeq }));
  };

  if (loading) {
    return (
      <div className={`py-12 flex justify-center items-center h-96 ${colors.container}`}>
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 flex items-center justify-center font-body h-96 ${colors.container}`}>
        <div className={`text-center p-8 rounded-2xl max-w-sm shadow-soft ${colors.surface}`}>
          <AlertTriangle className="w-12 h-12 text-error mx-auto mb-3" />
          <h3 className="font-bold text-base">Access Error</h3>
          <p className="text-xs text-slate-500 mt-2">{error}</p>
          {onExit && (
            <Button onClick={onExit} variant="secondary" className="mt-6 px-4 py-2 text-xs">
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 1. Introduction Screen (Before Test starts)
  if (!started) {
    return (
      <div className={`py-8 font-body flex justify-center items-center min-h-[400px] ${colors.container}`}>
        <div className="max-w-xl w-full mx-auto px-4">
          <Card className={`p-8 shadow-soft space-y-6 ${colors.surface}`}>
            <div className={`border-b pb-4 text-center ${colors.line}`}>
              <span className="px-2.5 py-1 bg-brand/10 text-brand text-[9px] font-bold uppercase tracking-wider rounded border border-brand/20">
                timed certification exam
              </span>
              <h1 className="text-xl font-bold font-display mt-3">{test.title}</h1>
            </div>

            <div className="space-y-4 text-xs font-medium leading-relaxed">
              <div className={`grid grid-cols-2 gap-4 border rounded-lg p-4 bg-surface/20 ${colors.line}`}>
                <div>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase block`}>Duration</span>
                  <span className="text-sm font-bold">{test.durationMins} Minutes</span>
                </div>
                <div>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase block`}>Questions</span>
                  <span className="text-sm font-bold">{test.questions?.length || 0} Items</span>
                </div>
                <div className={`col-span-2 border-t pt-2 mt-2 ${colors.line}`}>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase block`}>Passing Mark</span>
                  <span className="text-sm font-bold">{test.passMark} Marks Required</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold">Instructions &amp; Safety:</h4>
                <ul className={`list-disc pl-5 space-y-1.5 ${colors.slate}`}>
                  <li>Keep track of the countdown timer at the top of the interface.</li>
                  <li>Leaving the page or letting the timer expire will automatically submit the test.</li>
                  <li>Coding test cases are graded using isolated server-side sandbox environments.</li>
                  <li>Answers cannot be modified once submitted.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <Button onClick={startTest} className="px-6 py-3 bg-brand text-white font-bold text-sm w-full">
                Begin Exam
              </Button>
              {onExit && (
                <Button onClick={onExit} variant="secondary" className="px-4 py-3 text-sm">
                  Cancel
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 2. Graded Results Review Screen (After submit completes)
  if (completed && gradedResult) {
    const scorePct = gradedResult.totalPossibleMarks > 0
      ? Math.round((gradedResult.score / gradedResult.totalPossibleMarks) * 100)
      : 0;

    const isPreviewMode = adminPreview || gradedResult.isPreview;

    return (
      <div className={`py-6 font-body ${colors.container}`}>
        <div className="max-w-4xl mx-auto space-y-8 px-4">
          {isPreviewMode && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl p-4 text-xs font-bold text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Preview Mode — Result was graded for preview only and not saved to database.</span>
            </div>
          )}
          <Card className={`p-8 shadow-soft border-t-8 ${colors.surface} ${
            gradedResult.passed ? "border-emerald-500" : "border-red-500"
          }`}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold font-display">{test.title} Results</h2>

              <div className="flex flex-col items-center">
                <span className={`w-20 h-20 rounded-full flex items-center justify-center font-display text-2xl font-bold ${
                  gradedResult.passed ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {scorePct}%
                </span>
                <span className="text-lg font-bold mt-3">
                  Scored {gradedResult.score} / {gradedResult.totalPossibleMarks} Marks
                </span>
                <span className={`text-xs mt-1 ${colors.slate}`}>Passing standard: {gradedResult.passMark} marks</span>
              </div>

              <div className={`max-w-md mx-auto pt-4 border-t ${colors.line}`}>
                {gradedResult.passed ? (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-emerald-500 text-xs font-semibold leading-relaxed">
                    🎉 Excellent work! You passed this certification. Your progress has been updated.
                  </div>
                ) : (
                  <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl text-red-500 text-xs font-semibold leading-relaxed">
                    😢 You did not achieve the passing mark. Do not worry, review your incorrect responses and try again.
                  </div>
                )}
              </div>

              {onExit && (
                <div className="pt-4">
                  <Button onClick={onExit} variant="primary" className="px-6 py-2.5 text-xs bg-brand text-white font-bold">
                    Return to Course Player
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Per Question Details Review */}
          <div className="space-y-6">
            <h3 className="text-base font-bold font-display uppercase tracking-wider border-b pb-2.5">
              Review Test Response Details
            </h3>

            {test.questions.map((q: any, idx: number) => {
              const res = gradedResult.gradedQuestions[q.id];
              if (!res) return null;

              return (
                <Card key={q.id} className={`p-6 shadow-soft space-y-4 ${colors.surface}`}>
                  <div className={`flex items-center justify-between border-b pb-3 ${colors.line}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-brand/10 text-brand text-[11px] font-bold flex items-center justify-center">
                        Q{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded border border-corporate/30 bg-corporate/10 text-corporate text-[9px] font-bold uppercase tracking-wider">
                        {q.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {res.pending ? (
                        <span className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${colors.slate}`}>
                          <HelpCircle className="w-4 h-4" /> Manual Review
                        </span>
                      ) : res.isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-bold uppercase tracking-wider">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                      <span className={`text-xs font-semibold ml-2 ${colors.slate}`}>
                        Score: {res.earned} / {res.marks}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-medium leading-relaxed">
                    <h4 className={`font-bold mb-1 ${colors.slate}`}>Question prompt:</h4>
                    <div dangerouslySetInnerHTML={{ __html: q.stem }} className={`prose text-xs max-w-none ${darkMode ? "prose-invert text-zinc-300" : "text-ink"}`} />
                  </div>

                  <div className={`p-3 rounded-lg border space-y-2 text-xs font-medium ${colors.card}`}>
                    <div>
                      <span className={`${colors.slate} font-bold block mb-1`}>Your Submitted Response:</span>
                      {q.type === "code" ? (
                        <pre className={`p-2 border rounded font-mono text-[10px] overflow-x-auto max-h-40 whitespace-pre-wrap ${colors.card}`}>{res.studentAnswer || "Not answered."}</pre>
                      ) : q.type === "dragdrop" ? (
                        <div className="space-y-1">
                          {(res.studentAnswer || []).map((p: any, pidx: number) => (
                            <div key={pidx}>
                              - <span className="font-bold">{p[0]}</span> matched with <span className="font-bold">{p[1] || "(unmatched)"}</span>
                            </div>
                          ))}
                        </div>
                      ) : q.type === "sequence" ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(res.studentAnswer || []).map((val: string, sidx: number) => (
                            <span key={sidx} className={`px-2 py-1 border rounded text-[10px] font-semibold ${colors.card}`}>
                              {sidx + 1}. {val}
                            </span>
                          ))}
                        </div>
                      ) : q.type === "fillblank" ? (
                        <div className="space-y-1">
                          {(res.studentAnswer || []).map((ans: string, bidx: number) => (
                            <div key={bidx}>Blank #{bidx + 1}: <span className="font-bold">{ans || "(blank)"}</span></div>
                          ))}
                        </div>
                      ) : (
                        <span className="font-bold">{String(res.studentAnswer ?? "Not answered.")}</span>
                      )}
                    </div>

                    {!res.pending && (
                      <div className={`border-t pt-2 mt-2 ${colors.line}`}>
                        <span className={`${colors.slate} font-bold block mb-0.5`}>Correct Answer Key:</span>
                        <span className="font-semibold">{res.correctAnswer}</span>
                      </div>
                    )}

                    {res.codeResults && (
                      <div className={`border-t pt-2 mt-2 ${colors.line}`}>
                        <span className={`${colors.slate} font-bold block mb-1`}>Sandbox Execution Logs:</span>
                        <div className="space-y-2">
                          {res.codeResults.map((tc: any, tcIdx: number) => (
                            <div key={tcIdx} className={`border p-2 rounded text-[10px] ${colors.card}`}>
                              <div className="flex justify-between font-bold">
                                <span className={colors.slate}>Test case #{tcIdx + 1}</span>
                                <span className={tc.passed ? "text-emerald-500" : "text-red-500"}>
                                  {tc.passed ? "PASS" : "FAIL"}
                                </span>
                              </div>
                              {tc.error && <p className="text-red-500 font-bold mt-1">Error: {tc.error}</p>}
                              {tc.stdout && <pre className={`p-1 mt-1 font-mono text-[9px] max-h-20 overflow-y-auto ${colors.card}`}>Stdout: {tc.stdout}</pre>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. Exam Workspace (Active test taking mode)
  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className={`py-6 font-body ${colors.container}`}>
      <div className="max-w-7xl mx-auto space-y-6 px-4">
        {/* Sticky Header with Timer */}
        <div className={`sticky top-0 z-40 p-4 shadow-soft flex items-center justify-between gap-4 rounded-xl ${colors.surface}`}>
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className={`p-2 border rounded-lg shrink-0 cursor-pointer ${colors.btnSecondary}`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h1 className="text-sm font-bold leading-tight">{test.title}</h1>
              <p className={`text-[10px] mt-0.5 ${colors.slate}`}>Program mock certification examination</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-mono text-sm font-bold ${colors.card}`}>
              <Clock className="w-4 h-4 text-brand animate-pulse" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            <Button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="py-2 px-4 bg-brand text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Submit Test</span>
            </Button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Nav Map (Left) */}
          <div className="lg:col-span-3 space-y-4">
            <Card className={`p-5 shadow-soft space-y-4 ${colors.surface}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider border-b pb-2 mb-2 ${colors.line}`}>
                Exam Navigation Map
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {test.questions.map((q: any, idx: number) => {
                  const ans = answers[q.id];
                  let isAnswered = false;
                  if (q.type === "single" || q.type === "truefalse") {
                    isAnswered = ans !== null && ans !== undefined;
                  } else if (q.type === "multiple" || q.type === "dragdrop" || q.type === "sequence") {
                    isAnswered = Array.isArray(ans) && ans.length > 0;
                  } else if (q.type === "fillblank") {
                    isAnswered = Array.isArray(ans) && ans.some((s: string) => s.trim().length > 0);
                  } else if (q.type === "matrix") {
                    isAnswered = Array.isArray(ans) && ans.some((row: any) => Array.isArray(row) && row.length > 0);
                  } else if (q.type === "code") {
                    isAnswered = typeof ans === "string" && ans.trim().length > 0;
                  }

                  const isCurrent = idx === currentQuestionIndex;
                  const isFlagged = flaggedQuestions[q.id];

                  let btnClass = `${colors.card} hover:border-slate/40`;
                  if (isCurrent) btnClass = "border-brand bg-brand/5 text-brand ring-2 ring-brand/20";
                  else if (isFlagged) btnClass = "border-corporate bg-corporate/5 text-corporate";
                  else if (isAnswered) btnClass = "border-success bg-success/5 text-success";

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-lg font-bold text-xs border flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className={`pt-3 border-t space-y-2 text-[10px] font-bold uppercase tracking-wider ${colors.line} ${colors.slate}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded border shrink-0 ${colors.card}`} />
                  <span>Unvisited</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded border border-success bg-success/5 shrink-0" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded border border-corporate bg-corporate/5 shrink-0" />
                  <span>Flagged</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded border border-brand bg-brand/5 ring-2 ring-brand/20 shrink-0" />
                  <span>Current</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Workspace (Right) */}
          <div className="lg:col-span-9 space-y-6">
            <Card className={`p-6 shadow-soft space-y-6 ${colors.surface}`}>
              {/* Question metadata */}
              <div className={`flex items-center justify-between border-b pb-3 ${colors.line}`}>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-brand/10 text-brand text-xs font-bold flex items-center justify-center">
                    {currentQuestionIndex + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded border border-corporate/30 bg-corporate/10 text-corporate text-[9px] font-bold uppercase tracking-wider">
                    {currentQuestion.type}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${colors.slate}`}>
                    {currentQuestion.marks} {currentQuestion.marks === 1 ? "mark" : "marks"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFlaggedQuestions((prev) => ({
                      ...prev,
                      [currentQuestion.id]: !prev[currentQuestion.id],
                    }))}
                    className={`p-1.5 border rounded-lg transition-all cursor-pointer ${
                      flaggedQuestions[currentQuestion.id]
                        ? "border-corporate bg-corporate/5 text-corporate"
                        : `${colors.card} hover:text-ink`
                    }`}
                    title="Flag for review"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question stem */}
              <div className="text-sm font-medium leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: currentQuestion.stem }} className={`prose text-sm max-w-none ${darkMode ? "prose-invert text-zinc-300" : "text-ink"}`} />
              </div>

              {/* Workspace widgets */}
              <div className={`pt-2 border-t ${colors.line}`}>
                {currentQuestion.type === "single" && (
                  <div className="space-y-3">
                    {currentQuestion.config.options.map((opt: string, idx: number) => {
                      const isSelected = answers[currentQuestion.id] === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }))}
                          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected ? "border-brand bg-brand/5" : `${colors.card} ${colors.hover}`
                          }`}
                        >
                          <input
                            type="radio"
                            checked={isSelected}
                            readOnly
                            className="w-4 h-4 text-brand"
                          />
                          <span className="text-sm font-semibold">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === "multiple" && (
                  <div className="space-y-3">
                    {currentQuestion.config.options.map((opt: string, idx: number) => {
                      const currentVal = answers[currentQuestion.id] || [];
                      const isSelected = currentVal.includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            let next = [...currentVal];
                            if (isSelected) next = next.filter((x) => x !== idx);
                            else next.push(idx);
                            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: next }));
                          }}
                          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected ? "border-brand bg-brand/5" : `${colors.card} ${colors.hover}`
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="w-4 h-4 rounded text-brand border-line"
                          />
                          <span className="text-sm font-semibold">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === "truefalse" && (
                  <div className="flex gap-4">
                    {[true, false].map((val) => {
                      const isSelected = answers[currentQuestion.id] !== null && String(answers[currentQuestion.id]) === String(val);
                      return (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }))}
                          className={`flex-1 py-4 border rounded-xl font-bold transition-all text-center cursor-pointer ${
                            isSelected ? "border-brand bg-brand/5 text-brand" : `${colors.card} ${colors.hover}`
                          }`}
                        >
                          {val ? "True" : "False"}
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === "dragdrop" && (
                  <DndContext onDragEnd={handleDragEndDragDrop}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Matching slots */}
                      <div className="space-y-4">
                        <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${colors.slate}`}>Matching Targets</h4>
                        {(currentQuestion.config.left || []).map((l: string) => {
                          const pair = (answers[currentQuestion.id] || []).find((p: any) => p[0] === l);
                          const matchedItem = pair ? pair[1] : "";
                          return (
                            <DroppableSlot
                              key={l}
                              id={`slot-${l}`}
                              matchedItem={matchedItem}
                              label={l}
                              onClear={() => handleClearDragDrop(l)}
                              colors={colors}
                            />
                          );
                        })}
                      </div>

                      {/* Right Draggable pool */}
                      <div className={`border p-4 rounded-xl space-y-3 ${colors.card}`}>
                        <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${colors.slate}`}>Unmatched Options</h4>
                        {(() => {
                          const matchedRights = (answers[currentQuestion.id] || []).map((p: any) => p[1]).filter(Boolean);
                          const pool = (currentQuestion.config.right || []).filter((r: string) => !matchedRights.includes(r));

                          if (pool.length === 0) {
                            return <p className={`text-[11px] italic ${colors.slate}`}>All items matching.</p>;
                          }

                          return (
                            <div className="flex flex-wrap gap-2">
                              {pool.map((r: string) => (
                                <DraggableItem key={r} id={r} text={r} colors={colors} />
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </DndContext>
                )}

                {currentQuestion.type === "sequence" && (
                  <DndContext onDragEnd={handleDragEndSequence}>
                    <div className="max-w-md mx-auto space-y-4">
                      <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 text-center ${colors.slate}`}>
                        Drag items to rearrange sequence
                      </h4>
                      <SortableContext items={answers[currentQuestion.id] || []} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {(answers[currentQuestion.id] || []).map((item: string) => (
                            <SortableSeqItem key={item} id={item} text={item} colors={colors} />
                          ))}
                        </div>
                      </SortableContext>
                    </div>
                  </DndContext>
                )}

                {currentQuestion.type === "fillblank" && (
                  <div className={`leading-loose text-sm font-medium border rounded-xl p-5 ${colors.card}`}>
                    {(() => {
                      const template = currentQuestion.config.template || "";
                      const blanks = currentQuestion.config.blanks || [];
                      const currentVal = answers[currentQuestion.id] || [];

                      const parts = template.split(/(\{\{\d+\}\})/g);

                      return parts.map((part: string, index: number) => {
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
                                  setAnswers((prev) => ({ ...prev, [currentQuestion.id]: next }));
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
                                  setAnswers((prev) => ({ ...prev, [currentQuestion.id]: next }));
                                }}
                                className={`inline-block mx-1.5 px-2.5 py-1 rounded border text-xs font-semibold w-32 focus:outline-none focus:border-brand ${colors.card}`}
                              />
                            );
                          }
                        }
                        return <span key={index}>{part}</span>;
                      });
                    })()}
                  </div>
                )}

                {currentQuestion.type === "matrix" && (
                  <div className="overflow-x-auto">
                    <table className={`w-full text-sm border rounded-xl overflow-hidden ${colors.line}`}>
                      <thead>
                        <tr className="bg-surface/50">
                          <th className={`p-3 border text-left ${colors.line}`}></th>
                          {(currentQuestion.config.columns || []).map((col: string, cIdx: number) => (
                            <th key={cIdx} className={`p-3 border text-xs font-bold text-center whitespace-nowrap ${colors.line}`}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(currentQuestion.config.rows || []).map((row: string, rIdx: number) => (
                          <tr key={rIdx}>
                            <td className={`p-3 border text-sm font-semibold ${colors.line}`}>{row}</td>
                            {(currentQuestion.config.columns || []).map((col: string, cIdx: number) => {
                              const rowAns: number[] = answers[currentQuestion.id]?.[rIdx] || [];
                              const checked = rowAns.includes(cIdx);
                              return (
                                <td key={cIdx} className={`p-3 border text-center ${colors.line}`}>
                                  <input
                                    type={currentQuestion.config.multiple ? "checkbox" : "radio"}
                                    name={`matrix-${currentQuestion.id}-row-${rIdx}`}
                                    checked={checked}
                                    onChange={() => setAnswers((prev) => {
                                      const grid = ((prev[currentQuestion.id] || []) as number[][]).map((r) => [...(r || [])]);
                                      while (grid.length <= rIdx) grid.push([]);
                                      if (currentQuestion.config.multiple) {
                                        const set = new Set<number>(grid[rIdx]);
                                        if (set.has(cIdx)) set.delete(cIdx); else set.add(cIdx);
                                        grid[rIdx] = Array.from(set).sort((a, b) => a - b);
                                      } else {
                                        grid[rIdx] = [cIdx];
                                      }
                                      return { ...prev, [currentQuestion.id]: grid };
                                    })}
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
                )}

                {currentQuestion.type === "code" && (
                  <div className="space-y-2">
                    <div className={`flex justify-between items-center px-4 py-2 border-t border-x rounded-t-xl ${colors.line}`}>
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-brand" />
                        {currentQuestion.config.language} Sandbox compiler
                      </span>
                    </div>
                    <div className={`border rounded-b-xl overflow-hidden ${colors.line}`}>
                      <CodeMirror
                        value={answers[currentQuestion.id] || ""}
                        height="320px"
                        theme={darkMode ? "dark" : "light"}
                        extensions={getExtensions(currentQuestion.config.language)}
                        onChange={(val: string) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Bottom Nav Bar */}
            <div className={`flex justify-between items-center p-4 rounded-xl shadow-soft ${colors.surface}`}>
              <Button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                variant="secondary"
                className="px-4 py-2 text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </Button>

              <span className={`text-xs font-bold uppercase tracking-wider ${colors.slate}`}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>

              <Button
                disabled={isLastQuestion}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                variant="secondary"
                className="px-4 py-2 text-xs flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
