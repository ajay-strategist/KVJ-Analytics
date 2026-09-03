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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

import { DndContext, useDraggable, useDroppable, useSensor, useSensors, PointerSensor, TouchSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import dynamic from "next/dynamic";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });

export function isImageUrl(url: string): boolean {
  if (!url) return false;
  const cleanUrl = url.trim().toLowerCase();
  if (cleanUrl.includes("drive.google.com") || cleanUrl.includes("onedrive.live.com")) {
    return true;
  }
  return cleanUrl.startsWith("http") && (
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".gif") ||
    cleanUrl.endsWith(".svg") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.match(/\.(png|jpg|jpeg|gif|svg|webp)(\?|$)/i) !== null
  );
}

export function getDirectImageUrl(url: string): string {
  if (!url) return "";
  
  // 1. Google Drive
  const gdRegex1 = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const gdMatch1 = url.match(gdRegex1);
  if (gdMatch1 && gdMatch1[1]) {
    return `https://drive.google.com/uc?export=download&id=${gdMatch1[1]}`;
  }
  const gdRegex2 = /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/;
  const gdMatch2 = url.match(gdRegex2);
  if (gdMatch2 && gdMatch2[1]) {
    return `https://drive.google.com/uc?export=download&id=${gdMatch2[1]}`;
  }
  
  // 2. OneDrive
  if (url.includes("onedrive.live.com") && url.includes("/redir?")) {
    return url.replace("/redir?", "/download?");
  }
  
  return url;
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

function TableDroppableSlot({
  id,
  matchedItem,
  onClear,
  colors,
}: {
  id: string;
  matchedItem?: string;
  onClear: () => void;
  colors: any;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`p-2 border rounded-lg min-h-[38px] flex items-center justify-between text-xs font-semibold transition-all relative ${
        isOver
          ? "border-brand bg-brand/5 border-dashed"
          : matchedItem
          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600"
          : "border-dashed border-slate-300 bg-slate-50/50 text-slate-400"
      }`}
    >
      {matchedItem ? (
        <>
          <span>{matchedItem}</span>
          <button
            type="button"
            onClick={onClear}
            className="text-error font-bold text-xs hover:underline cursor-pointer bg-transparent border-none p-0.5 ml-2"
          >
            ✕
          </button>
        </>
      ) : (
        <span className="text-[10px] italic opacity-60 text-center w-full">Drop here</span>
      )}
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
  onStart?: () => void;
  onExit?: () => void;
  isInline?: boolean;
  showAnswers?: boolean;
  autoStart?: boolean;
}

export function TestTakingWidget({
  testId,
  courseSlug,
  adminPreview = false,
  darkMode = false,
  onComplete,
  onStart,
  onExit,
  isInline = false,
  showAnswers = false,
  autoStart = false,
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

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const [test, setTest] = useState<any>(null);
  const [started, setStarted] = useState(isInline || autoStart);
  const [completed, setCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  
  const [showQuestionsList, setShowQuestionsList] = useState(showAnswers || isInline);
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, {
    checked: boolean;
    correct: boolean;
    correctAnswerLabel: string;
    explanation: string;
    correctIndex?: number;
    correctIndexes?: number[];
    correctTF?: boolean;
  }>>({});

  const checkAnswerInline = async (questionId: string) => {
    const studentAnswer = answers[questionId];
    if (studentAnswer === undefined || studentAnswer === null) {
      alert("Please select an answer first.");
      return;
    }

    try {
      const res = await fetch(`/api/tests/${testId}/check${adminPreview ? "?preview=1" : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, studentAnswer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCheckedAnswers((prev) => ({
        ...prev,
        [questionId]: {
          checked: true,
          correct: data.correct,
          correctAnswerLabel: data.correctAnswerLabel,
          explanation: data.explanation,
          correctIndex: data.correctIndex,
          correctIndexes: data.correctIndexes,
          correctTF: data.correctTF,
        },
      }));
    } catch (err: any) {
      alert("Failed to check answer: " + err.message);
    }
  };

  useEffect(() => {
    if (isInline) {
      setStarted(true);
      setShowQuestionsList(true);
    }
  }, [isInline]);

  useEffect(() => {
    if (showAnswers) {
      setShowQuestionsList(true);
    }
  }, [showAnswers]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Custom modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Student test values
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [gradedResult, setGradedResult] = useState<any>(null);

  // Question visitation tracking state
  const [visitedIndexes, setVisitedIndexes] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (started && !completed) {
      setVisitedIndexes((prev) => {
        const next = new Set(prev);
        next.add(currentQuestionIndex);
        return next;
      });
    }
  }, [currentQuestionIndex, started, completed]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch course and enrollments to double gate
        const resTest = await fetch(`/api/tests/${testId}${adminPreview ? "?preview=1" : ""}`);
        const testData = await resTest.json();

        const testObj = testData?.test;
        if (!testObj) {
          throw new Error(testData?.error || "Mock test data unavailable.");
        }

        setTest(testObj);

        const duration = Number(testObj.durationMins ?? testObj.duration_mins ?? 30);
        if (autoStart && !isInline) {
          setStarted(true);
          setTimeRemaining(duration * 60);
          setVisitedIndexes(new Set([0]));
          onStart?.();
        }

        // Prepopulate answers configurations
        const defaultAnswers: Record<string, any> = {};
        (testObj.questions || []).forEach((q: any) => {
          let config = q.config;
          if (typeof config === "string") {
            try { config = JSON.parse(config); } catch { config = {}; }
          }
          if (q.type === "single") defaultAnswers[q.id] = null;
          else if (q.type === "multiple") defaultAnswers[q.id] = [];
          else if (q.type === "truefalse") defaultAnswers[q.id] = null;
          else if (q.type === "dragtable") defaultAnswers[q.id] = {};
          else if (q.type === "dragdrop") {
            defaultAnswers[q.id] = (config?.left || []).map((l: string) => [l, ""]);
          } else if (q.type === "sequence") {
            defaultAnswers[q.id] = [...(config?.items || [])];
          } else if (q.type === "fillblank") {
            defaultAnswers[q.id] = Array(config?.blanks?.length || 0).fill("");
          } else if (q.type === "matrix") {
            defaultAnswers[q.id] = (config?.rows || []).map(() => []);
          } else if (q.type === "code") {
            defaultAnswers[q.id] = config?.starterCode || "";
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
    if (isInline) return;
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
  }, [started, completed, timeRemaining, isInline]);

  const startTest = () => {
    if (!test) return;
    setStarted(true);
    setTimeRemaining(test.durationMins * 60);
    setVisitedIndexes(new Set([0]));
    onStart?.();
  };

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false, bypassConfirm = false) => {
    if (submitting || completed) return;
    if (!isAuto && !bypassConfirm) {
      setShowConfirmModal(true);
      return;
    }

    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      const elapsedSecs = test.durationMins * 60 - timeRemaining;
      const bodyPayload = {
        answers,
        startedAt: new Date(Date.now() - elapsedSecs * 1000).toISOString(),
      };

      // Get current auth token to ensure request is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(`/api/tests/${testId}${adminPreview ? "?preview=true" : ""}`, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyPayload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Submission grading failed.");

      setGradedResult(result);
      setCompleted(true);

      // Trigger completion callback
      onComplete?.(result.score, result.totalPossibleMarks, result.passed);
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to submit exam.");
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
    try {
      if (lang === "python" && typeof python === "function") return [python()];
      if ((lang === "javascript" || lang === "js") && typeof javascript === "function") return [javascript()];
      if (lang === "sql" && typeof sql === "function") return [sql()];
    } catch (e) {
      console.error("CodeMirror extension error:", e);
    }
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
    const leftStr = String(over.id).replace("slot-", "");
    const currentMatches = answers[currentQuestion.id] || [];

    const nextMatches = currentMatches.map((p: any) => {
      if (p[0] === leftStr) return [leftStr, rightStr];
      if (p[1] === rightStr) return [p[0], ""];
      return p;
    });

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: nextMatches }));
  };

  const handleClearDragTable = (slotId: string) => {
    const nextAnswers = { ...(answers[currentQuestion.id] || {}) };
    delete nextAnswers[slotId];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: nextAnswers }));
  };

  const handleDragEndDragTable = (event: any) => {
    const { over, active } = event;
    if (!over || !active) return;

    const dragItem = active.id;
    const slotId = String(over.id).replace("slot-", "");
    const currentAnswers = { ...(answers[currentQuestion.id] || {}) };

    // If this item was already assigned to another slot, clear it from there
    Object.keys(currentAnswers).forEach((key) => {
      if (currentAnswers[key] === dragItem) {
        delete currentAnswers[key];
      }
    });

    currentAnswers[slotId] = dragItem;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: currentAnswers }));
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

  const renderQuestionWidget = (q: any, idx: number) => {
    const wrapperClass = isInline 
      ? "py-6 space-y-4 bg-transparent text-ink border-b border-line last:border-b-0"
      : `p-6 shadow-soft space-y-4 ${colors.surface}`;

    const Element = isInline ? "div" : Card;

    return (
      <Element key={q.id} className={wrapperClass}>
        <div className={`flex justify-between items-center ${isInline ? "pb-3 mb-3 border-b" : "border-b pb-2 mb-2"}`}>
          <div className="flex items-center gap-2">
            {isInline ? (
              <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold tracking-wide ${
                darkMode
                  ? "bg-brand/20 text-brand"
                  : "bg-zinc-100 text-zinc-700"
              }`}>
                Q{idx + 1}
              </span>
            ) : (
              <>
                <span className="w-6 h-6 rounded-full bg-brand text-white font-extrabold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="px-2 py-0.5 rounded border border-corporate/30 bg-corporate/10 text-corporate text-[9px] font-bold uppercase tracking-wider">
                  {q.type}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isInline && (
              <span className={`text-xs font-semibold ${colors.slate}`}>
                {q.marks} {q.marks === 1 ? "mark" : "marks"}
              </span>
            )}
            {!isInline && (
              <button
                type="button"
                onClick={() => setFlaggedQuestions((prev) => ({
                  ...prev,
                  [q.id]: !prev[q.id],
                }))}
                className={`px-3 py-1.5 border rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                  flaggedQuestions[q.id]
                    ? "border-red-500 bg-red-50 text-red-650 shadow-sm shadow-red-100/50 font-bold"
                    : `${colors.card} hover:bg-slate-50 text-slate-600 hover:text-slate-800`
                }`}
                title="Flag for review"
              >
                <Bookmark className={`w-3.5 h-3.5 ${flaggedQuestions[q.id] ? "fill-red-500 text-red-500" : ""}`} />
                <span>{flaggedQuestions[q.id] ? "Flagged for Review" : "Mark for Review"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Question stem */}
        <div className="text-sm font-medium leading-relaxed space-y-4">
          <div dangerouslySetInnerHTML={{ __html: q.stem }} className={`prose text-sm max-w-none ${darkMode ? "prose-invert text-zinc-300" : "text-ink"}`} />
          {q.image_url && (
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-line shadow-sm bg-white p-2">
              <img
                src={getDirectImageUrl(q.image_url)}
                alt="Question attachment"
                className="max-h-96 w-auto mx-auto object-contain rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Workspace widgets */}
        <div className={`pt-2 border-t ${colors.line}`}>
          {q.type === "single" && q.config?.options && (
            <div className="space-y-3">
              {q.config.options.map((opt: string, oIdx: number) => {
                const isSelected = answers[q.id] === oIdx;
                const isChecked = checkedAnswers[q.id]?.checked;
                const correctIndex = checkedAnswers[q.id]?.correctIndex;
                const isThisCorrectOption = isChecked && correctIndex !== undefined && Number(correctIndex) === oIdx;

                const optImage = q.config?.optionImages?.[oIdx] || (isImageUrl(opt) ? opt : "");
                const hasImage = Boolean(optImage);
                const optLabel = q.config?.optionImages?.[oIdx] ? opt : (isImageUrl(opt) ? "" : opt);

                let borderStyle = isSelected ? "border-brand bg-brand/5 shadow-sm" : `${colors.card} ${colors.hover}`;
                if (isChecked) {
                  if (isThisCorrectOption) {
                    borderStyle = "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]";
                  } else if (isSelected) {
                    borderStyle = "border-red-500 bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400 font-bold";
                  }
                }

                return (
                  <div
                    key={oIdx}
                    onClick={() => {
                      if (isChecked) return; // disable change after checked
                      setAnswers((prev) => ({ ...prev, [q.id]: oIdx }));
                      setCheckedAnswers((prev) => {
                        const next = { ...prev };
                        delete next[q.id];
                        return next;
                      });
                    }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex ${hasImage ? "items-start gap-3.5" : "items-center gap-3"} ${borderStyle}`}
                  >
                    {isInline ? (
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${hasImage ? "mt-0.5" : ""} ${
                        isChecked
                          ? isThisCorrectOption
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : isSelected
                              ? "border-red-500 bg-red-500 text-white"
                              : "border-[#DCE5E8] text-zinc-500 dark:border-white/10"
                          : isSelected
                            ? "border-brand bg-brand text-black font-black"
                            : "border-[#DCE5E8] text-zinc-500 dark:border-white/10"
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                    ) : (
                      <input
                        type="radio"
                        checked={isSelected}
                        readOnly
                        className={`w-4 h-4 text-brand ${hasImage ? "mt-1" : ""}`}
                      />
                    )}
                    {hasImage ? (
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        {optLabel ? (
                          <span className="text-sm font-semibold">{optLabel}</span>
                        ) : (
                          <span className="text-xs font-semibold text-slate">Option {String.fromCharCode(65 + oIdx)}</span>
                        )}
                        <div className="rounded-xl border border-line/80 bg-white p-2.5 shadow-sm max-w-md w-full overflow-hidden">
                          <img
                            src={getDirectImageUrl(optImage)}
                            alt={optLabel || `Option ${String.fromCharCode(65 + oIdx)}`}
                            className="max-h-52 w-auto object-contain mx-auto rounded"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold">{opt}</span>
                    )}
                    {isChecked && isThisCorrectOption && (
                      <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">✓ Correct</span>
                    )}
                    {isChecked && isSelected && !isThisCorrectOption && (
                      <span className="ml-auto text-[9px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-full shrink-0">Your Answer</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {q.type === "multiple" && q.config?.options && (
            <div className="space-y-3">
              {q.config.options.map((opt: string, oIdx: number) => {
                const currentVal = answers[q.id] || [];
                const isSelected = currentVal.includes(oIdx);
                const isChecked = checkedAnswers[q.id]?.checked;
                const correctIndexes = checkedAnswers[q.id]?.correctIndexes || [];
                const isThisCorrectOption = isChecked && Array.isArray(correctIndexes) && correctIndexes.map(Number).includes(oIdx);

                const optImage = q.config?.optionImages?.[oIdx] || (isImageUrl(opt) ? opt : "");
                const hasImage = Boolean(optImage);
                const optLabel = q.config?.optionImages?.[oIdx] ? opt : (isImageUrl(opt) ? "" : opt);

                let borderStyle = isSelected ? "border-brand bg-brand/5 shadow-sm" : `${colors.card} ${colors.hover}`;
                if (isChecked) {
                  if (isThisCorrectOption) {
                    borderStyle = "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]";
                  } else if (isSelected) {
                    borderStyle = "border-red-500 bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400 font-bold";
                  }
                }

                return (
                  <div
                    key={oIdx}
                    onClick={() => {
                      if (isChecked) return; // disable change after checked
                      let next = [...currentVal];
                      if (isSelected) next = next.filter((x) => x !== oIdx);
                      else next.push(oIdx);
                      setAnswers((prev) => ({ ...prev, [q.id]: next }));
                      setCheckedAnswers((prev) => {
                        const next = { ...prev };
                        delete next[q.id];
                        return next;
                      });
                    }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex ${hasImage ? "items-start gap-3.5" : "items-center gap-3"} ${borderStyle}`}
                  >
                    {isInline ? (
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${hasImage ? "mt-0.5" : ""} ${
                        isChecked
                          ? isThisCorrectOption
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : isSelected
                              ? "border-red-500 bg-red-500 text-white"
                              : "border-[#DCE5E8] text-zinc-500 dark:border-white/10"
                          : isSelected
                            ? "border-brand bg-brand text-black font-black"
                            : "border-[#DCE5E8] text-zinc-500 dark:border-white/10"
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                    ) : (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className={`w-4 h-4 rounded text-brand border-line ${hasImage ? "mt-1" : ""}`}
                      />
                    )}
                    {hasImage ? (
                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        {optLabel ? (
                          <span className="text-sm font-semibold">{optLabel}</span>
                        ) : (
                          <span className="text-xs font-semibold text-slate">Option {String.fromCharCode(65 + oIdx)}</span>
                        )}
                        <div className="rounded-xl border border-line/80 bg-white p-2.5 shadow-sm max-w-md w-full overflow-hidden">
                          <img
                            src={getDirectImageUrl(optImage)}
                            alt={optLabel || `Option ${String.fromCharCode(65 + oIdx)}`}
                            className="max-h-52 w-auto object-contain mx-auto rounded"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold">{opt}</span>
                    )}
                    {isChecked && isThisCorrectOption && (
                      <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">✓ Correct</span>
                    )}
                    {isChecked && isSelected && !isThisCorrectOption && (
                      <span className="ml-auto text-[9px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-full shrink-0">Your Answer</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {q.type === "truefalse" && (
            <div className="flex gap-4">
              {[true, false].map((val) => {
                const isSelected = answers[q.id] !== null && String(answers[q.id]) === String(val);
                const isChecked = checkedAnswers[q.id]?.checked;
                const correctTF = checkedAnswers[q.id]?.correctTF;
                const isThisCorrectOption = isChecked && correctTF !== undefined && String(correctTF) === String(val);

                let borderStyle = isSelected ? "border-brand bg-brand/5 text-brand" : `${colors.card} ${colors.hover}`;
                if (isChecked) {
                  if (isThisCorrectOption) {
                    borderStyle = "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]";
                  } else if (isSelected) {
                    borderStyle = "border-red-500 bg-red-500/10 dark:bg-red-500/5 text-red-600 dark:text-red-400 font-bold";
                  }
                }

                return (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => {
                      if (isChecked) return;
                      setAnswers((prev) => ({ ...prev, [q.id]: val }));
                      setCheckedAnswers((prev) => {
                        const next = { ...prev };
                        delete next[q.id];
                        return next;
                      });
                    }}
                    className={`flex-1 py-4 border rounded-xl font-bold transition-all text-center cursor-pointer ${borderStyle}`}
                  >
                    {val ? "True" : "False"}
                    {isChecked && isThisCorrectOption && " (✓ Correct)"}
                    {isChecked && isSelected && !isThisCorrectOption && " (Your Answer)"}
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "dragtable" && (
            <DndContext sensors={sensors} onDragEnd={(event) => {
              const { over, active } = event;
              if (!over || !active) return;
              const dragItem = active.id;
              const slotId = String(over.id).replace("slot-", "");
              const currentAnswers = { ...(answers[q.id] || {}) };
              Object.keys(currentAnswers).forEach((key) => {
                if (currentAnswers[key] === dragItem) {
                  delete currentAnswers[key];
                }
              });
              currentAnswers[slotId] = dragItem;
              setAnswers((prev) => ({ ...prev, [q.id]: currentAnswers }));
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 border border-line p-4 rounded-2xl bg-surface/50 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate">Draggable Options</h4>
                  {(() => {
                    const currentAnswers = answers[q.id] || {};
                    const matchedOptions = Object.values(currentAnswers);
                    const pool = (q.config.draggables || []).filter((d: string) => !matchedOptions.includes(d));
                    if (pool.length === 0) {
                      return <p className={`text-[11px] italic ${colors.slate}`}>All options matching.</p>;
                    }
                    return (
                      <div className="flex flex-col gap-2.5">
                        {pool.map((d: string) => (
                          <DraggableItem key={d} id={d} text={d} colors={colors} />
                        ))}
                      </div>
                    );
                  })()}
                </div>
                <div className="lg:col-span-3 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate">Fill in the Answer Area</h4>
                  <div className="overflow-x-auto border border-line rounded-xl bg-white shadow-soft">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-line">
                          {(q.config.headers || []).map((h: string, hIdx: number) => (
                            <th key={hIdx} className="p-3 text-[10px] font-bold text-slate uppercase tracking-wider select-none">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(q.config.rows || []).map((row: string[], rIdx: number) => (
                          <tr key={rIdx} className="border-b border-line/60 last:border-0 hover:bg-slate-50/50">
                            {row.map((cell: string, cIdx: number) => {
                              const isPlaceholder = cell.startsWith("{{") && cell.endsWith("}}");
                              if (isPlaceholder) {
                                const slotId = cell.replace("{{", "").replace("}}", "").trim();
                                const matchedItem = (answers[q.id] || {})[slotId] || "";
                                return (
                                  <td key={cIdx} className="p-2 min-w-[120px]">
                                    <TableDroppableSlot
                                      id={`slot-${slotId}`}
                                      matchedItem={matchedItem}
                                      onClear={() => {
                                        const nextAnswers = { ...(answers[q.id] || {}) };
                                        delete nextAnswers[slotId];
                                        setAnswers((prev) => ({ ...prev, [q.id]: nextAnswers }));
                                      }}
                                      colors={colors}
                                    />
                                  </td>
                                );
                              }
                              return (
                                <td key={cIdx} className="p-3 text-xs font-semibold text-ink select-none">
                                  {cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </DndContext>
          )}

          {q.type === "dragdrop" && (
            <DndContext sensors={sensors} onDragEnd={(event) => {
              const { over, active } = event;
              if (!over || !active) return;
              const rightStr = String(active.id);
              // Slot IDs are "slot-{index}" — extract the index
              const slotIdStr = String(over.id);
              if (!slotIdStr.startsWith("slot-")) return;
              const slotIdx = parseInt(slotIdStr.replace("slot-", ""), 10);
              if (isNaN(slotIdx)) return;
              const currentMatches = [...(answers[q.id] || [])];
              // Only update the target slot; do NOT clear other slots that have the same option
              currentMatches[slotIdx] = [currentMatches[slotIdx]?.[0] ?? "", rightStr];
              setAnswers((prev) => ({ ...prev, [q.id]: currentMatches }));
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Match Choices (Draggables) — always show all options so they can be reused */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate">Match Choices</h4>
                  <p className={`text-[10px] italic mb-1 ${colors.slate}`}>Options can be reused across multiple targets.</p>
                  <div className="flex flex-col gap-2">
                    {(q.config.right || []).map((r: string, rIdx: number) => (
                      <DraggableItem key={`opt-${rIdx}`} id={r} text={r} colors={colors} />
                    ))}
                  </div>
                </div>

                {/* Column 2: Items to Match (Droppables) */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate">Items to Match</h4>
                  {(q.config.left || []).map((l: string, lIdx: number) => {
                    const pair = (answers[q.id] || [])[lIdx];
                    return (
                      <DroppableSlot
                        key={`slot-${lIdx}`}
                        id={`slot-${lIdx}`}
                        label={l}
                        matchedItem={pair ? pair[1] : ""}
                        onClear={() => {
                          const nextMatches = [...(answers[q.id] || [])];
                          nextMatches[lIdx] = [l, ""];
                          setAnswers((prev) => ({ ...prev, [q.id]: nextMatches }));
                        }}
                        colors={colors}
                      />
                    );
                  })}
                </div>
              </div>
            </DndContext>
          )}

          {q.type === "sequence" && (
            <DndContext sensors={sensors} onDragEnd={(event) => {
              const { active, over } = event;
              if (!active || !over || active.id === over.id) return;
              const currentSeq = answers[q.id] || [];
              const oldIndex = currentSeq.indexOf(active.id);
              const newIndex = currentSeq.indexOf(over.id);
              const nextSeq = [...currentSeq];
              nextSeq.splice(oldIndex, 1);
              nextSeq.splice(newIndex, 0, active.id);
              setAnswers((prev) => ({ ...prev, [q.id]: nextSeq }));
            }}>
              <div className="max-w-md mx-auto space-y-4">
                <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 text-center ${colors.slate}`}>
                  Drag items to rearrange sequence
                </h4>
                <SortableContext items={answers[q.id] || []} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {(answers[q.id] || []).map((item: string) => (
                      <SortableSeqItem key={item} id={item} text={item} colors={colors} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </DndContext>
          )}

          {q.type === "fillblank" && (
            <div className={`leading-loose text-sm font-medium border rounded-xl p-5 ${colors.card}`}>
              {(() => {
                const template = q.config.template || "";
                const blanks = q.config.blanks || [];
                const currentVal = answers[q.id] || [];
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
                            setAnswers((prev) => ({ ...prev, [q.id]: next }));
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
                            setAnswers((prev) => ({ ...prev, [q.id]: next }));
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

          {q.type === "matrix" && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className={`w-full text-sm border rounded-xl overflow-hidden ${colors.line}`}>
                  <thead>
                    <tr className="bg-surface/50">
                      <th className={`p-3 border text-left ${colors.line}`}></th>
                      {(q.config.columns || []).map((col: string, cIdx: number) => (
                        <th key={cIdx} className={`p-3 border text-xs font-bold text-center whitespace-nowrap ${colors.line}`}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(q.config.rows || []).map((row: string, rIdx: number) => (
                      <tr key={rIdx}>
                        <td className={`p-3 border text-sm font-semibold ${colors.line}`}>{row}</td>
                        {(q.config.columns || []).map((col: string, cIdx: number) => {
                          const rowAns: number[] = answers[q.id]?.[rIdx] || [];
                          const checked = rowAns.includes(cIdx);
                          return (
                            <td key={cIdx} className={`p-3 border text-center ${colors.line}`}>
                              <input
                                type={q.config.multiple ? "checkbox" : "radio"}
                                name={`matrix-${q.id}-row-${rIdx}`}
                                checked={checked}
                                onChange={() => setAnswers((prev) => {
                                  const grid = ((prev[q.id] || []) as number[][]).map((r) => [...(r || [])]);
                                  while (grid.length <= rIdx) grid.push([]);
                                  if (q.config.multiple) {
                                    const set = new Set<number>(grid[rIdx]);
                                    if (set.has(cIdx)) set.delete(cIdx); else set.add(cIdx);
                                    grid[rIdx] = Array.from(set).sort((a, b) => a - b);
                                  } else {
                                    grid[rIdx] = [cIdx];
                                  }
                                  return { ...prev, [q.id]: grid };
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

              {/* Mobile Stacked Card View */}
              <div className="block md:hidden space-y-4">
                {(q.config.rows || []).map((row: string, rIdx: number) => (
                  <div key={rIdx} className={`p-4 border rounded-xl space-y-3 ${colors.card}`}>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-brand">{row}</h5>
                    <div className="flex flex-wrap gap-2">
                      {(q.config.columns || []).map((col: string, cIdx: number) => {
                        const rowAns: number[] = answers[q.id]?.[rIdx] || [];
                        const checked = rowAns.includes(cIdx);
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => setAnswers((prev) => {
                              const grid = ((prev[q.id] || []) as number[][]).map((r) => [...(r || [])]);
                              while (grid.length <= rIdx) grid.push([]);
                              if (q.config.multiple) {
                                const set = new Set<number>(grid[rIdx]);
                                if (set.has(cIdx)) set.delete(cIdx); else set.add(cIdx);
                                grid[rIdx] = Array.from(set).sort((a, b) => a - b);
                              } else {
                                grid[rIdx] = [cIdx];
                              }
                              return { ...prev, [q.id]: grid };
                            })}
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
          )}

          {q.type === "code" && (
            <div className="space-y-2">
              <div className={`flex justify-between items-center px-4 py-2 border-t border-x rounded-t-xl ${colors.line}`}>
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-brand" />
                  {q.config?.language || "python"} Sandbox compiler
                </span>
              </div>
              <div className={`border rounded-b-xl overflow-hidden ${colors.line}`}>
                <CodeMirror
                  value={answers[q.id] || ""}
                  height="320px"
                  theme={darkMode ? "dark" : "light"}
                  extensions={getExtensions(q.config?.language || "python")}
                  onChange={(val: string) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                />
              </div>
            </div>
          )}
        </div>

        {isInline && (
          <div className="pt-3 border-t flex flex-col gap-2.5">
            {(!checkedAnswers[q.id]?.checked || !checkedAnswers[q.id]?.correct) && (
              <div className="flex gap-2">
                {!checkedAnswers[q.id]?.checked ? (
                  <Button
                    type="button"
                    onClick={() => checkAnswerInline(q.id)}
                    className="py-2 px-4 bg-[#10233F] text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md rounded-lg"
                  >
                    <span>Check Answer</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      setCheckedAnswers((prev) => {
                        const next = { ...prev };
                        delete next[q.id];
                        return next;
                      });
                    }}
                    className="py-2 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md rounded-lg border border-line bg-white hover:bg-surface text-slate"
                  >
                    <span>Try Again</span>
                  </Button>
                )}
              </div>
            )}

            {checkedAnswers[q.id]?.checked && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 animate-fade-in ${
                checkedAnswers[q.id].correct
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
              }`}>
                <div className="font-bold flex items-center gap-2 text-sm">
                  {checkedAnswers[q.id].correct ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>Incorrect</span>
                      <span className="font-normal opacity-85 text-xs">Try again!</span>
                    </>
                  )}
                </div>
                {checkedAnswers[q.id].explanation && (
                  <p className="opacity-90 leading-relaxed font-normal mt-1">
                    {checkedAnswers[q.id].explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Element>
    );
  };

  if (showQuestionsList && test && !isInline) {
    return (
      <div className={`py-6 font-body ${colors.container}`}>
        <div className="max-w-4xl mx-auto space-y-6 px-4">
          {/* Header */}
          <div className={`sticky top-0 z-40 p-4 shadow-soft flex items-center justify-between gap-4 rounded-xl ${colors.surface}`}>
            <div className="flex items-center gap-3">
              {(onExit || !showAnswers) && !isInline && (
                <button
                  type="button"
                  onClick={() => {
                    if (showAnswers) {
                      onExit?.();
                    } else {
                      setShowQuestionsList(false);
                    }
                  }}
                  className={`p-2 border rounded-lg shrink-0 cursor-pointer ${colors.btnSecondary}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="text-sm font-bold leading-tight">{test.title}</h1>
                <p className={`text-[10px] mt-0.5 ${colors.slate}`}>Inline Assessment Questions</p>
              </div>
            </div>
            
            {!isInline && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="py-2 px-4 bg-[#10B981] text-black hover:bg-[#00D8FF] text-xs font-bold flex items-center gap-1"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Submit Answers</span>
                </Button>
              </div>
            )}
          </div>

          {/* List of Questions */}
          <div className="space-y-6">
            {test.questions.map((q: any, idx: number) => renderQuestionWidget(q, idx))}
          </div>

          {/* Footer CTA */}
          {!isInline && (
            <div className="flex justify-between items-center border-t pt-6 mt-8">
              {!showAnswers ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowQuestionsList(false)}
                  className="text-xs px-4 py-2"
                >
                  Go Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="py-2.5 px-6 bg-[#10B981] text-black hover:bg-[#00D8FF] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Submit Assessment</span>
              </Button>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border text-center space-y-6 ${colors.surface}`}>
              <div className="mx-auto w-12 h-12 bg-brand/10 text-[#10B981] rounded-full flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold">Submit Assessment</h3>
                <p className={`text-sm ${colors.slate}`}>
                  Are you sure you want to submit your answers for grading? You will not be able to modify your answers after submission.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${colors.btnSecondary}`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(false, true)}
                  className="px-4 py-2 bg-brand text-black rounded-xl hover:opacity-90 text-xs font-bold transition-all"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {alertMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border text-center space-y-6 ${colors.surface}`}>
              <div className="mx-auto w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-red-500">Submission Error</h3>
                <p className={`text-sm ${colors.slate}`}>
                  {alertMessage}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setAlertMessage(null)}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl hover:opacity-90 text-xs font-bold transition-all"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 1. Introduction Screen (Before Test starts)
  if (!started && !isInline) {
    const totalMarks = test.totalPossibleMarks ?? (test.questions || []).reduce((acc: number, q: any) => acc + Number(q.marks || 1), 0);
    const passPercent = test.passMark !== undefined && test.passMark !== null ? test.passMark : 70;
    const requiredPassingMarks = Math.ceil((totalMarks * passPercent) / 100);

    return (
      <div className={`py-8 font-body flex justify-center items-center min-h-[400px] ${colors.container}`}>
        <div className="max-w-xl w-full mx-auto px-4">
          <Card className={`p-8 shadow-soft space-y-6 ${colors.surface}`}>
            <div className={`border-b pb-4 text-center ${colors.line}`}>
              <span className="px-2.5 py-1 bg-brand/10 text-brand text-[9px] font-bold uppercase tracking-wider rounded border border-brand/20">
                {isInline ? "inline assessment" : "timed certification exam"}
              </span>
              <h1 className="text-xl font-bold font-display mt-3">{test.title}</h1>
            </div>

            <div className="space-y-5 text-xs font-medium leading-relaxed">
              {/* Detailed Exam Summary Grid */}
              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 border rounded-xl p-4 bg-surface/20 ${colors.line}`}>
                <div>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase font-bold block`}>Duration</span>
                  <span className="text-sm font-bold">{test.durationMins} Mins</span>
                </div>
                <div>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase font-bold block`}>Questions</span>
                  <span className="text-sm font-bold">{test.questions?.length || 0} Items</span>
                </div>
                <div>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase font-bold block`}>Total Marks</span>
                  <span className="text-sm font-bold">{totalMarks} Marks</span>
                </div>
                <div>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase font-bold block`}>Passing Standard</span>
                  <span className="text-sm font-bold">{passPercent}% ({requiredPassingMarks} Marks)</span>
                </div>
                <div>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase font-bold block`}>Allowed Attempts</span>
                  <span className="text-sm font-bold">
                    {test.attemptsAllowed > 0 ? `${test.attemptsAllowed}` : "Unlimited"}
                  </span>
                </div>
                <div>
                  <span className={`${colors.slate} opacity-60 text-[10px] uppercase font-bold block`}>Negative Marking</span>
                  <span className="text-sm font-bold">
                    {test.negativeMarking > 0 ? `-${test.negativeMarking}` : "None"}
                  </span>
                </div>
              </div>

              {/* Instructions & Guidelines */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm">Instructions &amp; Safety Guidelines:</h4>
                {test.instructions ? (
                  <div className={`p-3 rounded-lg border bg-surface/10 space-y-2 ${colors.line}`}>
                    <p className={`whitespace-pre-line text-xs ${colors.ink}`}>{test.instructions}</p>
                    <ul className={`list-disc pl-5 pt-2 border-t space-y-1 text-[11px] ${colors.slate} ${colors.line}`}>
                      <li>Countdown timer will start as soon as you click Begin Exam.</li>
                      <li>Answers cannot be modified once submitted.</li>
                    </ul>
                  </div>
                ) : (
                  <ul className={`list-disc pl-5 space-y-1.5 ${colors.slate}`}>
                    <li>Keep track of the countdown timer ({test.durationMins} minutes) at the top of the screen.</li>
                    {test.negativeMarking > 0 ? (
                      <li className="text-amber-500 dark:text-amber-400 font-semibold">
                        Negative marking enabled: {test.negativeMarking} mark(s) deducted per wrong answer.
                      </li>
                    ) : (
                      <li>No negative marking for incorrect answers.</li>
                    )}
                    {test.attemptsAllowed > 0 && (
                      <li>You have a limit of {test.attemptsAllowed} attempt(s) for this assessment.</li>
                    )}
                    <li>Leaving the page or letting the timer expire will automatically submit the test.</li>
                    <li>Answers cannot be modified once final submission is made.</li>
                  </ul>
                )}
              </div>

              {/* Best Wishes & Encouragement Banner */}
              <div className={`p-3 rounded-xl border bg-brand/5 border-brand/20 text-center space-y-0.5`}>
                <p className="text-xs font-bold text-brand flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand animate-pulse" />
                  Best Wishes &amp; Good Luck for Your Exam!
                </p>
                <p className={`${colors.slate} opacity-70 text-[10px] font-medium`}>
                  Stay calm, read each question carefully, and do your best.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button onClick={startTest} className="px-6 py-3 bg-brand text-white font-bold text-sm w-full">
                {isInline ? "Check Knowledge" : "Begin Exam"}
              </Button>
              {isInline && (
                <Button
                  onClick={() => {
                    setShowQuestionsList(true);
                    onStart?.();
                  }}
                  variant="secondary"
                  className="px-6 py-3 text-sm w-full"
                >
                  Show Questions &amp; Answers
                </Button>
              )}
              {onExit && (
                <Button onClick={onExit} variant="secondary" className="px-4 py-3 text-sm w-full">
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
    const passed = gradedResult.passed;
    const isPreviewMode = adminPreview || gradedResult.isPreview;
    const totalQ = test.questions.length;
    const correctCount = test.questions.filter((q: any) => gradedResult.gradedQuestions[q.id]?.isCorrect).length;
    const wrongCount = test.questions.filter((q: any) => gradedResult.gradedQuestions[q.id] && !gradedResult.gradedQuestions[q.id]?.isCorrect && !gradedResult.gradedQuestions[q.id]?.pending).length;
    const pendingCount = test.questions.filter((q: any) => gradedResult.gradedQuestions[q.id]?.pending).length;

    // Scorecard accent colors
    const passGradient = "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)";
    const failGradient = "linear-gradient(135deg, #450a0a 0%, #7f1d1d 40%, #991b1b 100%)";

    return (
      <div className={`py-6 font-body ${colors.container}`}>
        <style>{`
          @keyframes scoreIn {
            0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
            70% { transform: scale(1.12) rotate(2deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes confettiFall {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(60px) rotate(720deg); opacity: 0; }
          }
          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
            70% { box-shadow: 0 0 0 20px rgba(16,185,129,0); }
            100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
          }
          @keyframes pulse-ring-red {
            0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
            70% { box-shadow: 0 0 0 20px rgba(239,68,68,0); }
            100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          }
          .score-circle-pass { animation: scoreIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards, pulse-ring 2s ease-out 0.7s infinite; }
          .score-circle-fail { animation: scoreIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards, pulse-ring-red 2s ease-out 0.7s infinite; }
          .result-card-anim { animation: fadeSlideUp 0.5s ease forwards; }
          .result-card-anim-delay { animation: fadeSlideUp 0.5s ease 0.2s both; }
          .shimmer-text {
            background: linear-gradient(90deg, currentColor 25%, rgba(255,255,255,0.8) 50%, currentColor 75%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 2.5s linear infinite;
          }
          .confetti-dot { position: absolute; border-radius: 50%; animation: confettiFall 1.2s ease-in forwards; }
        `}</style>

        <div className="max-w-3xl mx-auto space-y-6 px-4">
          {isPreviewMode && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl p-4 text-xs font-bold text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>Preview Mode — Result was graded for preview only and not saved to database.</span>
            </div>
          )}

          {gradedResult.dbSaveError && !isPreviewMode && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-xs font-bold text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>⚠️ Your score was calculated but could not be saved to the database. Please contact support. (DB: {gradedResult.dbSaveError})</span>
            </div>
          )}

          {/* ─── HERO SCORECARD ─── */}
          <div
            className="relative overflow-hidden rounded-3xl shadow-2xl"
            style={{ background: passed ? passGradient : failGradient }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-10"
              style={{ background: passed ? "#34d399" : "#f87171" }} />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
              style={{ background: passed ? "#6ee7b7" : "#fca5a5" }} />

            {/* Confetti particles (pass only) */}
            {passed && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {["#34d399","#fbbf24","#60a5fa","#f472b6","#a78bfa","#fb923c"].map((color, i) => (
                  <div
                    key={i}
                    className="confetti-dot"
                    style={{
                      left: `${10 + i * 15}%`,
                      top: `${5 + (i % 3) * 8}%`,
                      width: 8 + (i % 3) * 4,
                      height: 8 + (i % 3) * 4,
                      background: color,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: `${1.2 + i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative z-10 p-8 text-center text-white space-y-6">
              {/* Status badge */}
              <div className="result-card-anim">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                  passed
                    ? "bg-emerald-400/20 border-emerald-400/40 text-emerald-100"
                    : "bg-red-400/20 border-red-400/40 text-red-100"
                }`}>
                  {passed ? "🏆 Assessment Passed" : "❌ Assessment Failed"}
                </span>
              </div>

              {/* Score circle */}
              <div className="flex flex-col items-center gap-3 result-card-anim">
                <div
                  className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 bg-white/10 backdrop-blur-sm ${
                    passed ? "border-emerald-400 score-circle-pass" : "border-red-400 score-circle-fail"
                  }`}
                >
                  <span className={`text-5xl font-black leading-none ${passed ? "text-emerald-300" : "text-red-300"}`}>
                    {scorePct}%
                  </span>
                  <span className="text-xs font-bold text-white/70 mt-1">Score</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">
                    {passed ? "🎉 Congratulations!" : "😔 Don't give up!"}
                  </p>
                  <p className="text-white/70 text-sm font-medium">
                    {gradedResult.score} / {gradedResult.totalPossibleMarks} marks • Passing: {gradedResult.passMark || 84}%
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="result-card-anim-delay grid grid-cols-3 gap-3 max-w-sm mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                  <div className="text-2xl font-black text-emerald-300">{correctCount}</div>
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mt-0.5">Correct ✅</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                  <div className="text-2xl font-black text-red-300">{wrongCount}</div>
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mt-0.5">Wrong ❌</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                  <div className="text-2xl font-black text-amber-300">{totalQ}</div>
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider mt-0.5">Total 📝</div>
                </div>
              </div>

              {/* Message */}
              <div className="result-card-anim-delay max-w-md mx-auto">
                {passed ? (
                  <p className="text-emerald-100 text-sm leading-relaxed bg-emerald-500/10 border border-emerald-400/20 rounded-2xl px-5 py-3">
                    🌟 Outstanding achievement! You've demonstrated mastery of this topic. Your certification has been recorded and your course progress updated.
                  </p>
                ) : (
                  <p className="text-red-100 text-sm leading-relaxed bg-red-500/10 border border-red-400/20 rounded-2xl px-5 py-3">
                    📚 Review the correct answers below, revisit the study material, and try again. Every expert was once a beginner — keep going!
                  </p>
                )}
              </div>

              {onExit && (
                <div className="result-card-anim-delay pt-2">
                  <button
                    type="button"
                    onClick={onExit}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-white text-slate-800 hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Return to Course Player
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── PER-QUESTION REVIEW ─── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center">
                <FileCode className="w-4 h-4 text-brand" />
              </div>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? "text-zinc-200" : "text-ink"}`}>
                Detailed Answer Review
              </h3>
            </div>

            {test.questions.map((q: any, idx: number) => {
              const res = gradedResult.gradedQuestions[q.id];
              if (!res) return null;

              const qCorrect = res.isCorrect;
              const qPending = res.pending;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border-2 overflow-hidden shadow-sm transition-all ${
                    qPending
                      ? (darkMode ? "border-amber-500/30 bg-zinc-900" : "border-amber-300 bg-amber-50/30")
                      : qCorrect
                        ? (darkMode ? "border-emerald-500/30 bg-zinc-900" : "border-emerald-300 bg-emerald-50/20")
                        : (darkMode ? "border-red-500/30 bg-zinc-900" : "border-red-300 bg-red-50/20")
                  }`}
                  style={{ animation: `fadeSlideUp 0.4s ease ${idx * 0.07}s both` }}
                >
                  {/* Question header bar */}
                  <div className={`flex items-center justify-between px-5 py-3 border-b ${
                    qPending
                      ? (darkMode ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-100/60 border-amber-200")
                      : qCorrect
                        ? (darkMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-100/60 border-emerald-200")
                        : (darkMode ? "bg-red-500/10 border-red-500/20" : "bg-red-100/60 border-red-200")
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                        qCorrect ? "bg-emerald-500 text-white" : qPending ? "bg-amber-400 text-white" : "bg-red-500 text-white"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${darkMode ? "border-zinc-600 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-white text-slate-500"}`}>
                        {q.type}
                      </span>
                      <span className={`text-xs font-bold ${darkMode ? "text-zinc-300" : "text-slate-600"}`}>
                        {res.earned}/{res.marks} pts
                      </span>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                      qPending
                        ? "bg-amber-400/20 text-amber-500"
                        : qCorrect
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-red-500/20 text-red-500"
                    }`}>
                      {qPending ? (
                        <><HelpCircle className="w-3.5 h-3.5" /> Pending Review</>
                      ) : qCorrect ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> ✅ Correct</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> ❌ Incorrect</>
                      )}
                    </span>
                  </div>

                  <div className="px-5 py-4 space-y-4">
                    {/* Question stem */}
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-zinc-400" : "text-slate-400"}`}>Question</p>
                      <div dangerouslySetInnerHTML={{ __html: q.stem }} className={`prose prose-sm max-w-none text-xs leading-relaxed ${darkMode ? "prose-invert text-zinc-300" : "text-ink"}`} />
                      {q.image_url && (
                        <div className="mt-2 max-w-sm rounded-xl overflow-hidden border border-line shadow-sm bg-white p-1.5">
                          <img src={getDirectImageUrl(q.image_url)} alt="Question attachment" className="max-h-48 w-auto object-contain rounded-lg" />
                        </div>
                      )}
                    </div>

                    {/* MCQ options with correct/wrong highlights */}
                    {(q.type === "single" || q.type === "multiple") && q.config?.options && (
                      <div className="space-y-2">
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? "text-zinc-400" : "text-slate-400"}`}>Options</p>
                        {q.config.options.map((opt: string, oi: number) => {
                          const correctKey = res.config?.correctIndex ?? res.config?.correctIndexes ?? q.config?.correctIndex ?? q.config?.correctIndexes ?? q.config?.correct_option ?? q.config?.correct_options;
                          const isCorrectOption = q.type === "single"
                            ? Number(correctKey) === oi
                            : Array.isArray(correctKey) && correctKey.map(Number).includes(oi);
                          const studentAns = res.studentAnswer;
                          const studentPicked = q.type === "single"
                            ? Number(studentAns) === oi
                            : Array.isArray(studentAns) && studentAns.map(Number).includes(oi);

                          let optStyle = darkMode
                            ? "border-zinc-700 bg-zinc-800 text-zinc-300"
                            : "border-slate-200 bg-white text-slate-600";
                          let optIcon = null;

                          if (isCorrectOption) {
                            optStyle = darkMode
                              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold"
                              : "border-emerald-400 bg-emerald-50 text-emerald-700 font-bold";
                            optIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
                          } else if (studentPicked && !isCorrectOption) {
                            optStyle = darkMode
                              ? "border-red-500/50 bg-red-500/10 text-red-300 font-bold"
                              : "border-red-400 bg-red-50 text-red-700 font-bold";
                            optIcon = <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
                          }

                          const optImage = res.config?.optionImages?.[oi] ?? q.config?.optionImages?.[oi] ?? (isImageUrl(opt) ? opt : "");
                          const hasImage = Boolean(optImage);
                          const optLabel = (res.config?.optionImages?.[oi] ?? q.config?.optionImages?.[oi]) ? opt : (isImageUrl(opt) ? "" : opt);

                          return (
                            <div key={oi} className={`flex ${hasImage ? "items-start gap-3" : "items-center gap-2.5"} px-3 py-2.5 rounded-xl border text-xs transition-all ${optStyle}`}>
                              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-black shrink-0 ${hasImage ? "mt-0.5" : ""} ${
                                isCorrectOption ? "border-emerald-500 bg-emerald-500 text-white"
                                : studentPicked ? "border-red-500 bg-red-500 text-white"
                                : "border-current opacity-40"
                              }`}>
                                {String.fromCharCode(65 + oi)}
                              </span>
                              {hasImage ? (
                                <div className="flex-1 flex flex-col gap-1.5 max-w-full">
                                  {optLabel ? (
                                    <span className="font-semibold text-xs">{optLabel}</span>
                                  ) : (
                                    <span className="text-[11px] opacity-75">Option {String.fromCharCode(65 + oi)}</span>
                                  )}
                                  <div className="rounded-lg border border-line bg-white p-2 max-w-xs shadow-xs">
                                    <img
                                      src={getDirectImageUrl(optImage)}
                                      alt={optLabel || `Option ${String.fromCharCode(65 + oi)}`}
                                      className="max-h-28 w-auto object-contain mx-auto rounded"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                      }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="flex-1 font-medium">{opt}</span>
                              )}
                              {optIcon}
                              {studentPicked && !isCorrectOption && (
                                <span className="text-[9px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-full">Your answer</span>
                              )}
                              {isCorrectOption && (
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">✓ Correct</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* DragTable Detailed Review in Table Format */}
                    {q.type === "dragtable" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Student's Answer Table */}
                          <div className={`p-4 rounded-2xl border ${darkMode ? "border-zinc-700 bg-zinc-800/80" : "border-slate-200 bg-white shadow-soft"}`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-zinc-400" : "text-slate-500"}`}>📝 Your Answer Table</p>
                              <span className="text-[10px] font-bold text-slate-500">{res.earned}/{res.marks} pts</span>
                            </div>
                            <div className="overflow-x-auto border border-line rounded-xl">
                              <table className="w-full text-left text-xs border-collapse">
                                {(res.config?.headers || q.config?.headers) && (
                                  <thead>
                                    <tr className={darkMode ? "bg-zinc-900 text-zinc-400 border-b border-zinc-700" : "bg-slate-50 text-slate-500 border-b border-slate-200"}>
                                      {(res.config?.headers || q.config?.headers || []).map((h: string, i: number) => (
                                        <th key={i} className="p-2.5 font-bold text-[10px] uppercase tracking-wider">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                )}
                                <tbody>
                                  {(res.config?.rows || q.config?.rows || []).map((row: string[], rIdx: number) => (
                                    <tr key={rIdx} className={darkMode ? "border-b border-zinc-800 last:border-0" : "border-b border-slate-100 last:border-0"}>
                                      {row.map((cell: string, cIdx: number) => {
                                        const isPlaceholder = cell.startsWith("{{") && cell.endsWith("}}");
                                        if (isPlaceholder) {
                                          const slotId = cell.replace("{{", "").replace("}}", "").trim();
                                          const sVal = String((res.studentAnswer || {})[slotId] || "").trim();
                                          const cVal = String((res.config?.correct || q.config?.correct || {})[slotId] || "").trim();
                                          const isMatch = sVal.length > 0 && sVal.toLowerCase() === cVal.toLowerCase();

                                          return (
                                            <td key={cIdx} className="p-2 font-semibold">
                                              {sVal ? (
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold ${
                                                  isMatch
                                                    ? darkMode ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-emerald-300 bg-emerald-50 text-emerald-700"
                                                    : darkMode ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-red-300 bg-red-50 text-red-700"
                                                }`}>
                                                  {isMatch ? "✅" : "❌"} {sVal}
                                                </span>
                                              ) : (
                                                <span className="text-[10px] italic opacity-50 text-slate-400">(empty)</span>
                                              )}
                                            </td>
                                          );
                                        }
                                        return <td key={cIdx} className={`p-2.5 font-semibold ${darkMode ? "text-zinc-300" : "text-slate-700"}`}>{cell}</td>;
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Correct Answer Table */}
                          <div className={`p-4 rounded-2xl border ${darkMode ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/60 shadow-soft"}`}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2">✅ Correct Answer Table</p>
                            <div className="overflow-x-auto border border-emerald-200 rounded-xl bg-white">
                              <table className="w-full text-left text-xs border-collapse">
                                {(res.config?.headers || q.config?.headers) && (
                                  <thead>
                                    <tr className="bg-emerald-100/60 text-emerald-800 border-b border-emerald-200">
                                      {(res.config?.headers || q.config?.headers || []).map((h: string, i: number) => (
                                        <th key={i} className="p-2.5 font-bold text-[10px] uppercase tracking-wider">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                )}
                                <tbody>
                                  {(res.config?.rows || q.config?.rows || []).map((row: string[], rIdx: number) => (
                                    <tr key={rIdx} className="border-b border-emerald-100 last:border-0">
                                      {row.map((cell: string, cIdx: number) => {
                                        const isPlaceholder = cell.startsWith("{{") && cell.endsWith("}}");
                                        if (isPlaceholder) {
                                          const slotId = cell.replace("{{", "").replace("}}", "").trim();
                                          const cVal = String((res.config?.correct || q.config?.correct || {})[slotId] || "").trim();
                                          return (
                                            <td key={cIdx} className="p-2 font-semibold">
                                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-400 bg-emerald-100 text-emerald-800 text-xs font-bold">
                                                ✓ {cVal}
                                              </span>
                                            </td>
                                          );
                                        }
                                        return <td key={cIdx} className="p-2.5 font-semibold text-slate-800">{cell}</td>;
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Drag & Drop Pair Review */}
                    {q.type === "dragdrop" && (
                      <div className="space-y-2">
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${darkMode ? "text-zinc-400" : "text-slate-400"}`}>
                          📎 Your Matches
                        </p>
                        {(q.config?.left || []).map((leftLabel: string, lIdx: number) => {
                          const pair = Array.isArray(res.studentAnswer) ? res.studentAnswer[lIdx] : null;
                          const studentRight = pair ? pair[1] : "";
                          // Find expected right for this slot from correctPairs
                          const correctPairEntry = (res.config?.correctPairs || q.config?.correctPairs || []).find((p: any) => Number(p[0]) === lIdx);
                          const rightList = res.config?.right || q.config?.right || [];
                          const expectedRight = correctPairEntry ? (rightList[correctPairEntry[1]] ?? "") : "";
                          const isMatch = studentRight && expectedRight && String(studentRight).trim() === String(expectedRight).trim();
                          return (
                            <div key={lIdx} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold ${
                              isMatch
                                ? darkMode ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-emerald-400 bg-emerald-50 text-emerald-800"
                                : darkMode ? "border-red-500/50 bg-red-500/10 text-red-300" : "border-red-400 bg-red-50 text-red-800"
                            }`}>
                              {isMatch ? <span className="shrink-0">✅</span> : <span className="shrink-0">❌</span>}
                              <span className="font-bold shrink-0">{leftLabel}</span>
                              <span className="opacity-60">→</span>
                              <span>{studentRight || <em className="opacity-50">Not answered</em>}</span>
                              {!isMatch && expectedRight && (
                                <span className={`ml-auto text-[10px] ${darkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                                  ✓ Expected: <strong>{expectedRight}</strong>
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Response + Answer key for non-MCQ non-DragTable non-DragDrop */}
                    {q.type !== "single" && q.type !== "multiple" && q.type !== "dragtable" && q.type !== "dragdrop" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className={`p-3 rounded-xl border ${darkMode ? "border-zinc-700 bg-zinc-800" : "border-slate-200 bg-white"}`}>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-zinc-400" : "text-slate-400"}`}>📝 Your Answer</p>
                          {q.type === "code" ? (
                            <pre className={`font-mono text-[10px] overflow-x-auto max-h-32 whitespace-pre-wrap ${darkMode ? "text-zinc-300" : "text-slate-700"}`}>{res.studentAnswer || "Not answered."}</pre>
                          ) : q.type === "fillblank" ? (
                            <div className="space-y-1">
                              {(res.studentAnswer || []).map((ans: string, bidx: number) => (
                                <div key={bidx} className={`text-xs font-semibold ${darkMode ? "text-zinc-300" : "text-slate-700"}`}>Blank {bidx + 1}: <span className="font-bold">{ans || "(blank)"}</span></div>
                              ))}
                            </div>
                          ) : (
                            <p className={`text-xs font-semibold ${darkMode ? "text-zinc-300" : "text-slate-700"}`}>{String(res.studentAnswer ?? "Not answered.")}</p>
                          )}
                        </div>

                        {!res.pending && (
                          <div className={`p-3 rounded-xl border ${darkMode ? "border-emerald-500/30 bg-emerald-500/10" : "border-emerald-300 bg-emerald-50"}`}>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-emerald-600">✅ Correct Answer</p>
                            <p className={`text-xs font-bold ${darkMode ? "text-emerald-300" : "text-emerald-700"}`}>{res.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Code sandbox results */}
                    {res.codeResults && (
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${darkMode ? "text-zinc-400" : "text-slate-400"}`}>Sandbox Execution Logs</p>
                        <div className="space-y-2">
                          {res.codeResults.map((tc: any, tcIdx: number) => (
                            <div key={tcIdx} className={`border p-2.5 rounded-xl text-[10px] ${
                              tc.passed
                                ? darkMode ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50"
                                : darkMode ? "border-red-500/30 bg-red-500/5" : "border-red-200 bg-red-50"
                            }`}>
                              <div className="flex justify-between font-bold">
                                <span className={darkMode ? "text-zinc-400" : "text-slate-500"}>Test case #{tcIdx + 1}</span>
                                <span className={tc.passed ? "text-emerald-500" : "text-red-500"}>
                                  {tc.passed ? "✅ PASS" : "❌ FAIL"}
                                </span>
                              </div>
                              {tc.error && <p className="text-red-500 font-bold mt-1">Error: {tc.error}</p>}
                              {tc.stdout && <pre className={`p-1 mt-1 font-mono max-h-20 overflow-y-auto ${darkMode ? "text-zinc-300" : "text-slate-600"}`}>Stdout: {tc.stdout}</pre>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Explanation / Feedback */}
                    {res.config?.explanation && (
                      <div className={`p-3.5 rounded-xl border flex gap-3 items-start ${darkMode ? "border-amber-400/30 bg-amber-400/5" : "border-amber-300 bg-amber-50"}`}>
                        <span className="text-lg shrink-0">💡</span>
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${darkMode ? "text-amber-400" : "text-amber-700"}`}>Explanation</p>
                          <p className={`text-xs leading-relaxed ${darkMode ? "text-amber-200" : "text-amber-800"}`}>{res.config.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bottom CTA */}
            {onExit && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-brand text-white hover:bg-brand/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. Exam Workspace (Active test taking mode)
  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // ── INLINE MODE: All questions stacked vertically, no timer/nav map/submit ──
  if (isInline) {
    const checkedCount = Object.keys(checkedAnswers).length;
    const correctCount = Object.values(checkedAnswers).filter((x) => x.correct).length;
    
    let totalMarks = 0;
    let earnedMarks = 0;
    test.questions.forEach((q: any) => {
      const qMarks = q.marks ?? 1;
      totalMarks += qMarks;
      const ans = checkedAnswers[q.id];
      if (ans?.checked) {
        if (ans.correct) {
          earnedMarks += qMarks;
        } else {
          const qNegative = q.negative_marks ?? 0;
          earnedMarks -= qNegative;
        }
      }
    });

    return (
      <div className="py-2 font-body bg-transparent text-ink">
        <div className="space-y-6">
          {test.questions.map((q: any, idx: number) => (
            <div key={q.id}>
              {renderQuestionWidget(q, idx)}
            </div>
          ))}

          {checkedCount === totalQuestions && totalQuestions > 0 && (
            <Card className={`p-6 text-center space-y-3 rounded-2xl animate-fade-in shadow-soft ${colors.surface} border-emerald-500/30`}>
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-ink">Practice Check Completed!</h3>
              <p className={`text-xs ${colors.slate}`}>
                You have answered and checked all {totalQuestions} questions.
              </p>
              <div className="text-2xl font-black text-[#08A88A]">
                {correctCount} / {totalQuestions} Correct ({Math.round((correctCount / totalQuestions) * 100)}%)
              </div>
              {totalMarks > 0 && (
                <div className={`text-xs font-semibold ${colors.slate}`}>
                  Total Marks: {earnedMarks} / {totalMarks}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ── REGULAR EXAM MODE ───────────────────────────────────────────────────────
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
            <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-mono text-sm font-bold transition-all ${
              timeRemaining < 120
                ? "text-red-500 border-red-500/70 bg-red-500/10"
                : colors.card
            }`}>
              <Clock className={`w-4 h-4 ${
                timeRemaining < 120
                  ? "text-red-500 animate-[pulse_0.6s_infinite]"
                  : "text-brand animate-pulse"
              }`} />
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
                    const starter = (q.config?.starterCode || "").trim();
                    isAnswered = typeof ans === "string" && ans.trim().length > 0 && ans.trim() !== starter;
                  }

                  const isCurrent = idx === currentQuestionIndex;
                  const isFlagged = flaggedQuestions[q.id];

                  let btnClass = "";
                  if (isCurrent) {
                    btnClass = "border-brand bg-brand/5 text-brand ring-2 ring-brand/20";
                  } else if (isFlagged) {
                    btnClass = darkMode
                      ? "border-red-500/30 bg-red-500/10 text-red-405 font-bold"
                      : "border-red-500 bg-red-50 text-red-650 font-bold";
                  } else if (isAnswered) {
                    btnClass = darkMode
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-405 font-bold"
                      : "border-emerald-600 bg-emerald-50 text-emerald-750 font-bold";
                  } else if (visitedIndexes.has(idx)) {
                    btnClass = "border-slate bg-slate/10 text-slate";
                  } else {
                    btnClass = `${colors.card} opacity-60 hover:opacity-100 hover:border-slate/40`;
                  }

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
                  <span className={`w-3 h-3 rounded border shrink-0 ${colors.card} opacity-60`} />
                  <span>Unvisited</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded border border-slate bg-slate/10 shrink-0" />
                  <span>Visited (Skipped)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded border shrink-0 ${
                    darkMode ? "border-emerald-500/30 bg-emerald-500/10" : "border-emerald-600 bg-emerald-50"
                  }`} />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded border shrink-0 ${
                    darkMode ? "border-red-500/30 bg-red-500/10" : "border-red-500 bg-red-50"
                  }`} />
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
            {renderQuestionWidget(currentQuestion, currentQuestionIndex)}

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

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border text-center space-y-6 ${colors.surface}`}>
            <div className="mx-auto w-12 h-12 bg-brand/10 text-[#10B981] rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Submit Certification Exam</h3>
              <p className={`text-sm ${colors.slate}`}>
                Are you sure you want to submit your mock test for grading? You will not be able to modify your answers after submission.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${colors.btnSecondary}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false, true)}
                className="px-4 py-2 bg-brand text-black rounded-xl hover:opacity-90 text-xs font-bold transition-all"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border text-center space-y-6 ${colors.surface}`}>
            <div className="mx-auto w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-red-500">Submission Error</h3>
              <p className={`text-sm ${colors.slate}`}>
                {alertMessage}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setAlertMessage(null)}
                className="px-6 py-2 bg-red-500 text-white rounded-xl hover:opacity-90 text-xs font-bold transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
