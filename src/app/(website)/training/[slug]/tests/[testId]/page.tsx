"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  FileCode
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { supabase } from "@/lib/supabase";

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import dynamic from "next/dynamic";
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";

// Draggable Right Item for DragDrop Matching
function DraggableItem({ id, text }: { id: string; text: string }) {
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
      className="p-3 border border-line bg-white rounded-lg cursor-grab active:cursor-grabbing text-xs font-semibold shadow-sm select-none hover:border-brand/40"
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
}: {
  id: string;
  matchedItem?: string;
  label: string;
  onClear: () => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div className="flex items-center gap-3">
      <div className="w-1/2 p-3 bg-surface/50 border border-line rounded-lg text-xs font-semibold text-ink">
        {label}
      </div>
      <div className="text-slate font-bold text-xs">⇌</div>
      <div
        ref={setNodeRef}
        className={`w-1/2 p-3 border rounded-lg min-h-[46px] flex items-center justify-between text-xs font-semibold transition-all relative ${
          isOver ? "border-brand bg-brand/5 border-dashed" : "border-line bg-white"
        }`}
      >
        {matchedItem ? (
          <>
            <span className="text-ink">{matchedItem}</span>
            <button
              type="button"
              onClick={onClear}
              className="text-error font-bold text-xs hover:underline cursor-pointer bg-transparent border-none p-1"
            >
              ✕
            </button>
          </>
        ) : (
          <span className="text-slate/40 italic">Drop match here</span>
        )}
      </div>
    </div>
  );
}

// Sortable Item for Sequence Ordering
function SortableSeqItem({ id, text }: { id: string; text: string }) {
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
      className="p-3 border border-line bg-white rounded-lg cursor-grab active:cursor-grabbing text-xs font-semibold shadow-sm flex items-center gap-2 select-none hover:border-brand/40"
    >
      <GripVertical className="w-4 h-4 text-slate shrink-0" />
      <span className="text-ink">{text}</span>
    </div>
  );
}

// Main page component using Next 16 async params Promise helper
export default function TestTakingPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string; testId: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();

  // Core states
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
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
    setMounted(true);
    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        if (!session?.user) {
          setError("Please sign in to take this mock test.");
          setLoading(false);
          return;
        }

        // Fetch course and enrollments to double gate
        const resTest = await fetch(`/api/tests/${params.testId}`);
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
            // DragDrop initialized as list of matched pairs: [ [leftStr, ''] ]
            defaultAnswers[q.id] = (q.config.left || []).map((l: string) => [l, ""]);
          } else if (q.type === "sequence") {
            // Sequence initialized with shuffled values
            defaultAnswers[q.id] = [...(q.config.items || [])];
          } else if (q.type === "fillblank") {
            defaultAnswers[q.id] = Array(q.config.blanks?.length || 0).fill("");
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
  }, [params.testId]);

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
      const res = await fetch(`/api/tests/${params.testId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          startedAt: new Date(Date.now() - (test.durationMins * 60 - timeRemaining) * 1000).toISOString(),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Submission grading failed.");

      setGradedResult(result);
      setCompleted(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit exam.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper formats duration
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center font-body">
        <div className="text-center bg-white border border-line p-8 rounded-card max-w-sm shadow-soft">
          <AlertTriangle className="w-12 h-12 text-error mx-auto mb-3" />
          <h3 className="font-bold text-ink text-base">Access Error</h3>
          <p className="text-xs text-slate mt-2">{error}</p>
          <Link href={`/training/${params.slug}`} className="mt-6 inline-block">
            <Button variant="secondary" className="px-4 py-2 text-xs">Return to Program</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 1. Introduction Screen (Before Test starts)
  if (!started) {
    return (
      <Section background="default" className="bg-surface/50 min-h-screen flex items-center py-12 font-body">
        <Container className="max-w-xl mx-auto">
          <Card className="p-8 border-line bg-white shadow-soft space-y-6">
            <div className="border-b border-line pb-4 text-center">
              <span className="px-2.5 py-1 bg-brand/10 text-brand text-[9px] font-bold uppercase tracking-wider rounded border border-brand/20">
                timed certification exam
              </span>
              <h1 className="text-xl font-bold font-display text-ink mt-3">{test.title}</h1>
            </div>

            <div className="space-y-4 text-xs text-slate font-medium leading-relaxed">
              <div className="grid grid-cols-2 gap-4 border border-line rounded-lg p-4 bg-surface/20">
                <div>
                  <span className="text-[10px] text-slate/60 uppercase block">Duration</span>
                  <span className="text-sm font-bold text-ink">{test.durationMins} Minutes</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate/60 uppercase block">Questions</span>
                  <span className="text-sm font-bold text-ink">{test.questions?.length || 0} Items</span>
                </div>
                <div className="col-span-2 border-t border-line pt-2 mt-2">
                  <span className="text-[10px] text-slate/60 uppercase block">Passing Mark</span>
                  <span className="text-sm font-bold text-ink">{test.passMark} Marks Required</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-ink">Instructions &amp; Safety:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate">
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
              <Button href={`/training/${params.slug}`} variant="secondary" className="px-4 py-3 text-sm">
                Cancel
              </Button>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  // 2. Graded Results Review Screen (After submit completes)
  if (completed && gradedResult) {
    const scorePct = Math.round((gradedResult.score / gradedResult.totalPossibleMarks) * 100);

    return (
      <Section className="bg-surface/50 min-h-screen py-12 font-body">
        <Container className="max-w-4xl mx-auto space-y-8">
          {/* Summary Scorecard */}
          <Card className={`p-8 border-line bg-white shadow-soft border-t-8 ${
            gradedResult.passed ? "border-success" : "border-error"
          }`}>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold font-display text-ink">{test.title} Results</h2>
              
              <div className="flex flex-col items-center">
                <span className={`w-20 h-20 rounded-full flex items-center justify-center font-display text-2xl font-bold ${
                  gradedResult.passed ? "bg-success/10 text-success" : "bg-error/10 text-error"
                }`}>
                  {scorePct}%
                </span>
                <span className="text-lg font-bold text-ink mt-3">
                  Scored {gradedResult.score} / {gradedResult.totalPossibleMarks} Marks
                </span>
                <span className="text-xs text-slate mt-1">Passing standard: {gradedResult.passMark} marks</span>
              </div>

              <div className="max-w-md mx-auto pt-4 border-t border-line">
                {gradedResult.passed ? (
                  <div className="bg-success/5 border border-success/20 p-4 rounded-xl text-success text-xs font-semibold leading-relaxed">
                    🎉 Excellent work! You passed this certification. Your records have been updated successfully in the Supabase ledger.
                  </div>
                ) : (
                  <div className="bg-error/5 border border-error/20 p-4 rounded-xl text-error text-xs font-semibold leading-relaxed">
                    😢 You did not achieve the passing mark. Do not worry, review your incorrect responses and retake the test to try again.
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Link href={`/training/${params.slug}`}>
                  <Button variant="primary" className="px-6 py-2.5 text-xs bg-brand text-white font-bold">
                    Return to Course Outline
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Per Question Details Review */}
          <div className="space-y-6">
            <h3 className="text-base font-bold font-display text-ink uppercase tracking-wider border-b border-line pb-2.5">
              Review Test Response Details
            </h3>

            {test.questions.map((q: any, idx: number) => {
              const res = gradedResult.gradedQuestions[q.id];
              if (!res) return null;

              return (
                <Card key={q.id} className="p-6 border-line bg-white shadow-soft space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
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
                        <span className="flex items-center gap-1 text-slate text-xs font-bold uppercase tracking-wider">
                          <HelpCircle className="w-4 h-4 text-slate" /> Manual Review
                        </span>
                      ) : res.isCorrect ? (
                        <span className="flex items-center gap-1 text-success text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-success" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-error text-xs font-bold uppercase tracking-wider">
                          <XCircle className="w-4 h-4 text-error" /> Incorrect
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate ml-2">
                        Score: {res.earned} / {res.marks}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-ink font-medium leading-relaxed">
                    <h4 className="font-bold text-slate mb-1">Question prompt:</h4>
                    <div dangerouslySetInnerHTML={{ __html: q.stem }} className="prose text-xs text-ink mb-3" />
                  </div>

                  <div className="bg-surface/30 p-3 rounded-lg border border-line space-y-2 text-xs font-medium">
                    <div>
                      <span className="text-slate font-bold block mb-1">Your Submitted Response:</span>
                      {q.type === "code" ? (
                        <pre className="p-2 border bg-white rounded font-mono text-[10px] overflow-x-auto max-h-40 whitespace-pre-wrap">{res.studentAnswer || "Not answered."}</pre>
                      ) : q.type === "dragdrop" ? (
                        <div className="space-y-1">
                          {(res.studentAnswer || []).map((p: any, pidx: number) => (
                            <div key={pidx} className="text-ink">
                              - <span className="font-bold">{p[0]}</span> matched with <span className="font-bold">{p[1] || "(unmatched)"}</span>
                            </div>
                          ))}
                        </div>
                      ) : q.type === "sequence" ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(res.studentAnswer || []).map((val: string, sidx: number) => (
                            <span key={sidx} className="px-2 py-1 bg-white border border-line rounded text-[10px] font-semibold">
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
                        <span className="text-ink font-bold">{String(res.studentAnswer ?? "Not answered.")}</span>
                      )}
                    </div>

                    {!res.pending && (
                      <div className="border-t border-line/60 pt-2 mt-2">
                        <span className="text-slate font-bold block mb-0.5">Correct Answer Key:</span>
                        <span className="text-ink font-semibold">{res.correctAnswer}</span>
                      </div>
                    )}

                    {res.codeResults && (
                      <div className="border-t border-line/60 pt-2 mt-2">
                        <span className="text-slate font-bold block mb-1">Sandbox Execution Logs:</span>
                        <div className="space-y-2">
                          {res.codeResults.map((tc: any, tcIdx: number) => (
                            <div key={tcIdx} className="border border-line/60 p-2 rounded bg-white text-[10px]">
                              <div className="flex justify-between font-bold text-slate">
                                <span>Test case #{tcIdx + 1}</span>
                                <span className={tc.passed ? "text-success" : "text-error"}>
                                  {tc.passed ? "PASS" : "FAIL"}
                                </span>
                              </div>
                              {tc.error && <p className="text-error font-bold mt-1">Error: {tc.error}</p>}
                              {tc.stdout && <pre className="p-1 mt-1 bg-surface/50 font-mono text-[9px] max-h-20 overflow-y-auto">Stdout: {tc.stdout}</pre>}
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
        </Container>
      </Section>
    );
  }

  // 3. Exam Workspace (Active test taking mode)
  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const getExtensions = (lang: string) => {
    if (lang === "python") return [python()];
    if (lang === "javascript" || lang === "js") return [javascript()];
    if (lang === "sql") return [sql()];
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

  return (
    <Section className="bg-surface/50 min-h-screen py-6 font-body">
      <Container className="max-w-7xl mx-auto space-y-6">
        {/* Sticky Header with Timer */}
        <div className="sticky top-0 z-40 bg-white border border-line rounded-xl p-4 shadow-soft flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/training/${params.slug}`} className="p-2 border border-line rounded-lg text-slate hover:text-ink shrink-0 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm font-bold text-ink leading-tight">{test.title}</h1>
              <p className="text-[10px] text-slate mt-0.5">Program mock certification examination</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-line bg-surface/20 text-ink font-mono text-sm font-bold">
              <Clock className="w-4 h-4 text-brand animate-pulse" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            <Button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="py-2 px-4 bg-brand text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Submit Test</span>
            </Button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Question Nav Map (Left) */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-5 border-line bg-white shadow-soft space-y-4">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-line pb-2 mb-2">
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
                  } else if (q.type === "code") {
                    isAnswered = typeof ans === "string" && ans.trim().length > 0;
                  }

                  const isCurrent = idx === currentQuestionIndex;
                  const isFlagged = flaggedQuestions[q.id];

                  let btnClass = "border-line bg-white text-ink hover:border-slate/40";
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

              <div className="pt-3 border-t border-line/60 space-y-2 text-[10px] font-bold uppercase tracking-wider text-slate">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded border border-line bg-white shrink-0" />
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
            <Card className="p-6 border-line bg-white shadow-soft space-y-6">
              {/* Question metadata */}
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded bg-brand/10 text-brand text-xs font-bold flex items-center justify-center">
                    {currentQuestionIndex + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded border border-corporate/30 bg-corporate/10 text-corporate text-[9px] font-bold uppercase tracking-wider">
                    {currentQuestion.type}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate">{currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}</span>
                  <button
                    type="button"
                    onClick={() => setFlaggedQuestions(prev => ({
                      ...prev,
                      [currentQuestion.id]: !prev[currentQuestion.id]
                    }))}
                    className={`p-1.5 border rounded-lg transition-all cursor-pointer ${
                      flaggedQuestions[currentQuestion.id]
                        ? "border-corporate bg-corporate/5 text-corporate"
                        : "border-line bg-white text-slate hover:text-ink"
                    }`}
                    title="Flag for review"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question stem */}
              <div className="text-sm font-medium text-ink leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: currentQuestion.stem }} className="prose text-sm text-ink max-w-none" />
              </div>

              {/* Workspace widgets */}
              <div className="pt-2 border-t border-line/60">
                {currentQuestion.type === "single" && (
                  <div className="space-y-3">
                    {currentQuestion.config.options.map((opt: string, idx: number) => {
                      const isSelected = answers[currentQuestion.id] === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: idx }))}
                          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected ? "border-brand bg-brand/5" : "border-line bg-white hover:border-slate/40"
                          }`}
                        >
                          <input
                            type="radio"
                            checked={isSelected}
                            readOnly
                            className="w-4 h-4 text-brand"
                          />
                          <span className="text-sm font-semibold text-ink">{opt}</span>
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
                            if (isSelected) next = next.filter(x => x !== idx);
                            else next.push(idx);
                            setAnswers(prev => ({ ...prev, [currentQuestion.id]: next }));
                          }}
                          className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected ? "border-brand bg-brand/5" : "border-line bg-white hover:border-slate/40"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="w-4 h-4 rounded text-brand border-line"
                          />
                          <span className="text-sm font-semibold text-ink">{opt}</span>
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
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }))}
                          className={`flex-1 py-4 border rounded-xl font-bold transition-all text-center cursor-pointer ${
                            isSelected ? "border-brand bg-brand/5 text-brand" : "border-line bg-white hover:border-slate/40 text-slate"
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
                        <h4 className="text-[10px] font-bold text-slate uppercase tracking-wider mb-2">Matching Targets</h4>
                        {(currentQuestion.config.left || []).map((l: string, idx: number) => {
                          const pair = (answers[currentQuestion.id] || []).find((p: any) => p[0] === l);
                          const matchedItem = pair ? pair[1] : "";
                          return (
                            <DroppableSlot
                              key={l}
                              id={`slot-${l}`}
                              matchedItem={matchedItem}
                              label={l}
                              onClear={() => handleClearDragDrop(l)}
                            />
                          );
                        })}
                      </div>

                      {/* Right Draggable pool */}
                      <div className="bg-surface/20 border border-line p-4 rounded-xl space-y-3">
                        <h4 className="text-[10px] font-bold text-slate uppercase tracking-wider mb-2">Unmatched Options</h4>
                        {(() => {
                          const matchedRights = (answers[currentQuestion.id] || []).map((p: any) => p[1]).filter(Boolean);
                          const pool = (currentQuestion.config.right || []).filter((r: string) => !matchedRights.includes(r));
                          
                          if (pool.length === 0) {
                            return <p className="text-[11px] text-slate italic">All items matching.</p>;
                          }

                          return (
                            <div className="flex flex-wrap gap-2">
                              {pool.map((r: string) => (
                                <DraggableItem key={r} id={r} text={r} />
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
                      <h4 className="text-[10px] font-bold text-slate uppercase tracking-wider mb-2 text-center">Drag items to rearrange sequence</h4>
                      <SortableContext items={answers[currentQuestion.id] || []} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {(answers[currentQuestion.id] || []).map((item: string) => (
                            <SortableSeqItem key={item} id={item} text={item} />
                          ))}
                        </div>
                      </SortableContext>
                    </div>
                  </DndContext>
                )}

                {currentQuestion.type === "fillblank" && (
                  <div className="leading-loose text-sm font-medium text-ink bg-surface/10 p-5 border border-line rounded-xl">
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
                                  setAnswers(prev => ({ ...prev, [currentQuestion.id]: next }));
                                }}
                                className="inline-block mx-1.5 px-2.5 py-1 rounded border border-line bg-white text-xs font-semibold focus:outline-none focus:border-brand"
                              >
                                <option value="">-- select --</option>
                                {(blank.options || []).map((o: string) => (
                                  <option key={o} value={o}>{o}</option>
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
                                  setAnswers(prev => ({ ...prev, [currentQuestion.id]: next }));
                                }}
                                className="inline-block mx-1.5 px-2.5 py-1 rounded border border-line bg-white text-xs font-semibold w-32 focus:outline-none focus:border-brand"
                              />
                            );
                          }
                        }
                        return <span key={index}>{part}</span>;
                      });
                    })()}
                  </div>
                )}

                {currentQuestion.type === "code" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-surface/30 px-4 py-2 border-t border-x border-line rounded-t-xl">
                      <span className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-brand" />
                        {currentQuestion.config.language} Sandbox compiler
                      </span>
                    </div>
                    <div className="border border-line rounded-b-xl overflow-hidden bg-white">
                      <CodeMirror
                        value={answers[currentQuestion.id] || ""}
                        height="320px"
                        extensions={getExtensions(currentQuestion.config.language)}
                        onChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Bottom Nav Bar */}
            <div className="flex justify-between items-center bg-white border border-line p-4 rounded-xl shadow-soft">
              <Button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                variant="secondary"
                className="px-4 py-2 text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </Button>

              <span className="text-xs text-slate font-bold uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>

              <Button
                disabled={isLastQuestion}
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                variant="secondary"
                className="px-4 py-2 text-xs flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
