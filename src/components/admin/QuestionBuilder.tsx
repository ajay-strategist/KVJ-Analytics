"use client";

import React, { useEffect, useState, useId } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  GripVertical,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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

const QUESTION_TYPES = [
  { value: "single", label: "Single Choice", hint: "One correct (radio)" },
  { value: "multiple", label: "Multiple Choice", hint: "Many correct (checkboxes)" },
  { value: "truefalse", label: "True / False", hint: "Boolean" },
  { value: "fillblank", label: "Fill in the Blank", hint: "Text / dropdown" },
  { value: "dragdrop", label: "Drag & Drop", hint: "Matching pairs" },
  { value: "dragtable", label: "Drag & Drop to Table", hint: "Drag items directly into table cells" },
  { value: "sequence", label: "Sequence", hint: "Reorder steps" },
  { value: "matrix", label: "Matrix / Grid", hint: "Rows × columns" },
  { value: "code", label: "Code", hint: "Sandbox execution" },
];

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

interface QuestionBuilderProps {
  testId: string;
}

export function QuestionBuilder({ testId }: QuestionBuilderProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState<any>({});
  const fileId = useId();

  const getExtensions = (lang: string) => {
    if (lang === "python" && python) return [python()];
    if ((lang === "javascript" || lang === "js") && javascript) return [javascript()];
    if (lang === "sql" && sql) return [sql()];
    return [];
  };

  const fetchQuestions = async () => {
    if (!testId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/questions?test_id=${testId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    setEditingQuestionId(null);
    setQuestionForm({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const handleTypeChange = (type: string) => {
    let defaultConfig: any = {};
    if (type === "single") {
      defaultConfig = { options: ["Option A", "Option B"], correctIndex: 0 };
    } else if (type === "multiple") {
      defaultConfig = { options: ["Option A", "Option B"], correctIndexes: [0] };
    } else if (type === "truefalse") {
      defaultConfig = { correct: true };
    } else if (type === "dragdrop") {
      defaultConfig = { left: ["Left Item A"], right: ["Right Item A"], correctPairs: [[0, 0]] };
    } else if (type === "dragtable") {
      defaultConfig = {
        headers: ["Region", "Quarter 1", "Answer area"],
        rows: [
          ["North", "25000", "{{drop_0}}"]
        ],
        draggables: ["Average", "Max"],
        correct: {
          "drop_0": "Average"
        }
      };
    } else if (type === "sequence") {
      defaultConfig = { items: ["Item 1", "Item 2"], correctOrder: [0, 1] };
    } else if (type === "fillblank") {
      defaultConfig = { template: "The capital of France is {{1}}.", blanks: [{ mode: "text", accepted: ["Paris"] }] };
    } else if (type === "matrix") {
      defaultConfig = { rows: ["Row 1", "Row 2"], columns: ["Column A", "Column B"], multiple: false, correct: [[0], [1]] };
    } else if (type === "code") {
      defaultConfig = { language: "python", starterCode: "# Write your Python code here\n", testCases: [{ stdin: "", expectedOutput: "" }] };
    }
    setQuestionForm((prev: any) => ({
      ...prev,
      type,
      config: defaultConfig,
    }));
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId) return;
    const isNew = editingQuestionId === "new";
    const method = isNew ? "POST" : "PATCH";
    const body = isNew
      ? { ...questionForm, test_id: testId, display_order: questions.length + 1 }
      : { ...questionForm, id: editingQuestionId };

    try {
      const res = await fetch("/api/admin/questions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingQuestionId(null);
      fetchQuestions();
    } catch (err: any) {
      alert(err.message || "Failed to save question");
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch("/api/admin/questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: qId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchQuestions();
    } catch (err: any) {
      alert(err.message || "Failed to delete question");
    }
  };

  const handleMoveQuestion = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const listCopy = [...questions];
    const temp = listCopy[index].display_order;
    listCopy[index].display_order = listCopy[targetIdx].display_order;
    listCopy[targetIdx].display_order = temp;

    setQuestions(listCopy);
    try {
      await Promise.all([
        fetch("/api/admin/questions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: listCopy[index].id, display_order: listCopy[index].display_order }),
        }),
        fetch("/api/admin/questions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: listCopy[targetIdx].id, display_order: listCopy[targetIdx].display_order }),
        }),
      ]);
      fetchQuestions();
    } catch (err) {
      console.error("Failed to move question:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h3 className="text-xs font-bold text-slate uppercase tracking-wider">Assessment Questions</h3>
        {!editingQuestionId && (
          <Button
            onClick={() => {
              setEditingQuestionId("new");
              setQuestionForm({
                type: "single",
                stem: "",
                marks: 1,
                config: { options: ["Option A", "Option B"], correctIndex: 0 },
              });
            }}
            className="px-3 py-1.5 bg-brand text-white text-xs font-bold"
          >
            + Add Question
          </Button>
        )}
      </div>

      {/* Add/Edit Question Form */}
      {editingQuestionId && (
        <form onSubmit={handleSaveQuestion} className="bg-surface/50 border border-line p-5 rounded-xl space-y-4 animate-fade-up">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            {editingQuestionId === "new" ? "New Question Details" : "Edit Question Details"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-2">Question Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUESTION_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => handleTypeChange(t.value)}
                    className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
                      questionForm.type === t.value
                        ? "border-brand bg-brand/10 text-brand shadow-sm"
                        : "border-line bg-white text-slate hover:border-brand/40 hover:text-ink"
                    }`}
                  >
                    <span className="block text-xs font-bold">{t.label}</span>
                    <span className="block text-[9px] font-medium opacity-70 mt-0.5">{t.hint}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="max-w-[180px]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Marks Assigned</label>
              <input
                type="number"
                required
                min={0.5}
                step="any"
                value={questionForm.marks || 1}
                onChange={(e) => setQuestionForm({ ...questionForm, marks: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Question Prompt / Stem (HTML Allowed)</label>
            <textarea
              rows={4}
              required
              value={questionForm.stem || ""}
              onChange={(e) => setQuestionForm({ ...questionForm, stem: e.target.value })}
              className="w-full px-3 py-2.5 rounded border border-line bg-white text-sm font-mono"
              placeholder="e.g. <p>What is the output of the following code?</p>"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">
              Image URL / Attachment (Google Drive or OneDrive sharing link) — Optional
            </label>
            <input
              type="url"
              value={questionForm.image_url || ""}
              onChange={(e) => setQuestionForm({ ...questionForm, image_url: e.target.value })}
              className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
              placeholder="e.g. https://drive.google.com/file/d/XYZ/view?usp=sharing"
            />
            {questionForm.image_url && (
              <div className="mt-2 border border-line rounded-lg p-2 bg-white max-w-sm">
                <span className="block text-[9px] font-bold text-slate uppercase mb-1">Image Preview:</span>
                <img
                  src={getDirectImageUrl(questionForm.image_url)}
                  alt="Question Preview"
                  className="max-h-40 w-auto object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                    const nextSibling = (e.target as HTMLElement).nextElementSibling;
                    if (nextSibling) (nextSibling as HTMLElement).style.display = "block";
                  }}
                />
                <p className="text-[10px] text-error font-medium mt-1 hidden">
                  ⚠️ Failed to load image. Ensure it is a valid public shareable link.
                </p>
              </div>
            )}
          </div>

          {/* Tailored Config Editor Forms */}
          <div className="border-t border-line/60 pt-4 mt-4 space-y-4">
            {questionForm.type === "single" && (
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Answer Options (Select correct option index)</label>
                {(questionForm.config?.options || []).map((opt: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={Number(questionForm.config?.correctIndex) === idx}
                      onChange={() => setQuestionForm((prev: any) => ({
                        ...prev,
                        config: { ...prev.config, correctIndex: idx },
                      }))}
                      className="w-4 h-4 text-brand"
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const opts = [...questionForm.config.options];
                        opts[idx] = e.target.value;
                        setQuestionForm((prev: any) => ({
                          ...prev,
                          config: { ...prev.config, options: opts },
                        }));
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 rounded border border-line bg-white text-sm"
                    />
                    <button
                      type="button"
                      disabled={(questionForm.config?.options || []).length <= 2}
                      onClick={() => {
                        const opts = [...questionForm.config.options];
                        opts.splice(idx, 1);
                        let newCorrectIndex = questionForm.config.correctIndex;
                        if (newCorrectIndex >= opts.length) {
                          newCorrectIndex = Math.max(0, opts.length - 1);
                        }
                        setQuestionForm((prev: any) => ({
                          ...prev,
                          config: { ...prev.config, options: opts, correctIndex: newCorrectIndex },
                        }));
                      }}
                      className="text-error text-xs hover:underline disabled:opacity-30 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => setQuestionForm((prev: any) => ({
                    ...prev,
                    config: { ...prev.config, options: [...(prev.config.options || []), ""] },
                  }))}
                  variant="secondary"
                  className="py-1 px-3 text-xs mt-2"
                >
                  + Add Option
                </Button>
              </div>
            )}

            {questionForm.type === "multiple" && (
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Answer Options (Check all correct option indices)</label>
                {(questionForm.config?.options || []).map((opt: string, idx: number) => {
                  const currentIndexes = questionForm.config?.correctIndexes || [];
                  const isChecked = currentIndexes.includes(idx);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          let nextIndexes = [...currentIndexes];
                          if (e.target.checked) {
                            nextIndexes.push(idx);
                          } else {
                            nextIndexes = nextIndexes.filter((x) => x !== idx);
                          }
                          setQuestionForm((prev: any) => ({
                            ...prev,
                            config: { ...prev.config, correctIndexes: nextIndexes },
                          }));
                        }}
                        className="w-4 h-4 rounded text-brand border-line"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => {
                          const opts = [...questionForm.config.options];
                          opts[idx] = e.target.value;
                          setQuestionForm((prev: any) => ({
                            ...prev,
                            config: { ...prev.config, options: opts },
                          }));
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 rounded border border-line bg-white text-sm"
                      />
                      <button
                        type="button"
                        disabled={(questionForm.config?.options || []).length <= 2}
                        onClick={() => {
                          const opts = [...questionForm.config.options];
                          opts.splice(idx, 1);
                          const nextIndexes = currentIndexes
                            .map((x: number) => (x > idx ? x - 1 : x))
                            .filter((x: number) => x < opts.length && x !== idx);
                          setQuestionForm((prev: any) => ({
                            ...prev,
                            config: { ...prev.config, options: opts, correctIndexes: nextIndexes },
                          }));
                        }}
                        className="text-error text-xs hover:underline disabled:opacity-30 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
                <Button
                  type="button"
                  onClick={() => setQuestionForm((prev: any) => ({
                    ...prev,
                    config: { ...prev.config, options: [...(prev.config.options || []), ""] },
                  }))}
                  variant="secondary"
                  className="py-1 px-3 text-xs mt-2"
                >
                  + Add Option
                </Button>
              </div>
            )}

            {questionForm.type === "truefalse" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-2">Correct Answer</label>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={questionForm.config?.correct === true}
                      onChange={() => setQuestionForm((prev: any) => ({
                        ...prev,
                        config: { ...prev.config, correct: true },
                      }))}
                      className="w-4 h-4 text-brand"
                    />
                    <span className="font-bold text-ink">True</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={questionForm.config?.correct === false}
                      onChange={() => setQuestionForm((prev: any) => ({
                        ...prev,
                        config: { ...prev.config, correct: false },
                      }))}
                      className="w-4 h-4 text-brand"
                    />
                    <span className="font-bold text-ink">False</span>
                  </label>
                </div>
              </div>
            )}

            {questionForm.type === "dragdrop" && (
              <div className="space-y-4">
                {/* 1. Options Pool */}
                <div className="border border-line/60 p-4 rounded-xl space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Draggable Options Pool</label>
                    <span className="text-[10px] text-slate-400 font-medium">Add all draggable choices here</span>
                  </div>
                  {(() => {
                    const config = questionForm.config || { left: [], right: [], correctPairs: [] };
                    const rightPool = config.right || [];
                    return (
                      <div className="space-y-2">
                        {rightPool.map((r: string, rIdx: number) => (
                          <div key={rIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              required
                              placeholder={`Option ${rIdx + 1}`}
                              value={r}
                              onChange={(e) => {
                                const newRight = [...rightPool];
                                newRight[rIdx] = e.target.value;
                                setQuestionForm((prev: any) => ({
                                  ...prev,
                                  config: { ...prev.config, right: newRight },
                                }));
                              }}
                              className="flex-1 px-3 py-1.5 rounded border border-line bg-white text-sm"
                            />
                            <button
                              type="button"
                              disabled={rightPool.length <= 1}
                              onClick={() => {
                                const newRight = [...rightPool];
                                newRight.splice(rIdx, 1);
                                const newCorrectPairs = (config.correctPairs || [])
                                  .filter((pair: any) => pair[1] !== rIdx)
                                  .map((pair: any) => {
                                    const nextR = pair[1] > rIdx ? pair[1] - 1 : pair[1];
                                    return [pair[0], nextR];
                                  });
                                setQuestionForm((prev: any) => ({
                                  ...prev,
                                  config: { ...prev.config, right: newRight, correctPairs: newCorrectPairs },
                                }));
                              }}
                              className="text-error text-xs hover:underline shrink-0 disabled:opacity-30 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => {
                            const newRight = [...rightPool, `New Option`];
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, right: newRight },
                            }));
                          }}
                          variant="secondary"
                          className="py-1 px-3 text-xs mt-1"
                        >
                          + Add Option
                        </Button>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. Left Targets & Mapping */}
                <div className="border border-line/60 p-4 rounded-xl space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Left Targets & Correct Matches</label>
                    <span className="text-[10px] text-slate-400 font-medium">Match each target to a pool option</span>
                  </div>
                  {(() => {
                    const config = questionForm.config || { left: [], right: [], correctPairs: [] };
                    const leftList = config.left || [];
                    return (
                      <div className="space-y-3">
                        {leftList.map((l: string, lIdx: number) => {
                          const pair = (config.correctPairs || []).find((p: any) => p[0] === lIdx);
                          const matchedIdx = pair ? pair[1] : -1;

                          return (
                            <div key={lIdx} className="flex gap-3 items-center bg-surface/30 p-2.5 rounded-lg border border-line/40">
                              <input
                                type="text"
                                required
                                placeholder={`Target ${lIdx + 1} (e.g. Average)`}
                                value={l}
                                onChange={(e) => {
                                  const newLeft = [...leftList];
                                  newLeft[lIdx] = e.target.value;
                                  setQuestionForm((prev: any) => ({
                                    ...prev,
                                    config: { ...prev.config, left: newLeft },
                                  }));
                                }}
                                className="flex-1 px-3 py-1.5 rounded border border-line bg-white text-sm"
                              />
                              <span className="text-slate font-bold text-xs shrink-0">⇌ Match:</span>
                              <select
                                value={matchedIdx}
                                onChange={(e) => {
                                  const selectVal = Number(e.target.value);
                                  let newCorrectPairs = [...(config.correctPairs || [])];
                                  newCorrectPairs = newCorrectPairs.filter((p: any) => p[0] !== lIdx);
                                  if (selectVal >= 0) {
                                    newCorrectPairs.push([lIdx, selectVal]);
                                  }
                                  setQuestionForm((prev: any) => ({
                                    ...prev,
                                    config: { ...prev.config, correctPairs: newCorrectPairs },
                                  }));
                                }}
                                className="px-2 py-1.5 rounded border border-line bg-white text-xs shrink-0 max-w-[150px]"
                              >
                                <option value={-1}>-- No Match --</option>
                                {(config.right || []).map((r: string, rIdx: number) => (
                                  <option key={rIdx} value={rIdx}>{r || `Option ${rIdx + 1}`}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                disabled={leftList.length <= 1}
                                onClick={() => {
                                  const newLeft = [...leftList];
                                  newLeft.splice(lIdx, 1);
                                  const newCorrectPairs = (config.correctPairs || [])
                                    .filter((pair: any) => pair[0] !== lIdx)
                                    .map((pair: any) => {
                                      const nextL = pair[0] > lIdx ? pair[0] - 1 : pair[0];
                                      return [nextL, pair[1]];
                                    });
                                  setQuestionForm((prev: any) => ({
                                    ...prev,
                                    config: { ...prev.config, left: newLeft, correctPairs: newCorrectPairs },
                                  }));
                                }}
                                className="text-error text-xs hover:underline shrink-0 disabled:opacity-30 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                        <Button
                          type="button"
                          onClick={() => {
                            const newLeft = [...leftList, ""];
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, left: newLeft },
                            }));
                          }}
                          variant="secondary"
                          className="py-1 px-3 text-xs mt-1"
                        >
                          + Add Target
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {questionForm.type === "dragtable" && (
              <div className="space-y-6">
                {/* 1. Headers Editor */}
                <div className="border border-line/60 p-4 rounded-xl space-y-3 bg-white">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Table Headers / Columns</label>
                  {(() => {
                    const config = questionForm.config || { headers: [], rows: [], draggables: [], correct: {} };
                    const headers = config.headers || [];
                    return (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {headers.map((h: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1.5 bg-surface border border-line px-2.5 py-1 rounded-lg">
                              <input
                                type="text"
                                value={h}
                                onChange={(e) => {
                                  const newHeaders = [...headers];
                                  newHeaders[idx] = e.target.value;
                                  setQuestionForm((prev: any) => ({
                                    ...prev,
                                    config: { ...prev.config, headers: newHeaders },
                                  }));
                                }}
                                className="bg-transparent border-0 font-semibold text-xs focus:ring-0 w-24 p-0"
                              />
                              <button
                                type="button"
                                disabled={headers.length <= 1}
                                onClick={() => {
                                  const newHeaders = [...headers];
                                  newHeaders.splice(idx, 1);
                                  // Trim rows to match
                                  const newRows = (config.rows || []).map((row: string[]) => {
                                    const newRow = [...row];
                                    newRow.splice(idx, 1);
                                    return newRow;
                                  });
                                  setQuestionForm((prev: any) => ({
                                    ...prev,
                                    config: { ...prev.config, headers: newHeaders, rows: newRows },
                                  }));
                                }}
                                className="text-error font-bold text-xs hover:text-red-700 disabled:opacity-30 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            const newHeaders = [...headers, `Column ${headers.length + 1}`];
                            // Append empty cell to all rows
                            const newRows = (config.rows || []).map((row: string[]) => [...row, ""]);
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, headers: newHeaders, rows: newRows },
                            }));
                          }}
                          variant="secondary"
                          className="py-1 px-3 text-xs mt-1"
                        >
                          + Add Column Header
                        </Button>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. Draggable Options Pool */}
                <div className="border border-line/60 p-4 rounded-xl space-y-3 bg-white">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Draggable Choices (Correct Answers & Decoys)</label>
                  {(() => {
                    const config = questionForm.config || { headers: [], rows: [], draggables: [], correct: {} };
                    const draggables = config.draggables || [];
                    return (
                      <div className="space-y-2">
                        {draggables.map((d: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              required
                              placeholder={`Option ${idx + 1}`}
                              value={d}
                              onChange={(e) => {
                                const newDraggables = [...draggables];
                                newDraggables[idx] = e.target.value;
                                // If this option was used as correct answer in mapping, update its text there as well
                                const oldVal = draggables[idx];
                                const newVal = e.target.value;
                                const newCorrect = { ...(config.correct || {}) };
                                Object.keys(newCorrect).forEach((k) => {
                                  if (newCorrect[k] === oldVal) {
                                    newCorrect[k] = newVal;
                                  }
                                });
                                setQuestionForm((prev: any) => ({
                                  ...prev,
                                  config: { ...prev.config, draggables: newDraggables, correct: newCorrect },
                                }));
                              }}
                              className="flex-1 px-3 py-1.5 rounded border border-line bg-white text-sm"
                            />
                            <button
                              type="button"
                              disabled={draggables.length <= 1}
                              onClick={() => {
                                const newDraggables = [...draggables];
                                newDraggables.splice(idx, 1);
                                setQuestionForm((prev: any) => ({
                                  ...prev,
                                  config: { ...prev.config, draggables: newDraggables },
                                }));
                              }}
                              className="text-error text-xs hover:underline shrink-0 disabled:opacity-30 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => {
                            const newDraggables = [...draggables, `Choice ${draggables.length + 1}`];
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, draggables: newDraggables },
                            }));
                          }}
                          variant="secondary"
                          className="py-1 px-3 text-xs mt-1"
                        >
                          + Add Choice Option
                        </Button>
                      </div>
                    );
                  })()}
                </div>

                {/* 3. Interactive Table Rows Editor */}
                <div className="border border-line/60 p-4 rounded-xl space-y-4 bg-white">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Table Rows & Cells Editor</label>
                    <span className="text-[10px] text-slate-400 font-medium">Click "Drop Target" to turn any cell into a drop zone</span>
                  </div>
                  {(() => {
                    const config = questionForm.config || { headers: [], rows: [], draggables: [], correct: {} };
                    const headers = config.headers || [];
                    const rows = config.rows || [];
                    const draggables = config.draggables || [];
                    const correct = config.correct || {};

                    return (
                      <div className="space-y-3">
                        <div className="overflow-x-auto border border-line rounded-lg bg-surface/20">
                          <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-line">
                                {headers.map((h: string, idx: number) => (
                                  <th key={idx} className="p-2 text-[10px] font-bold text-slate uppercase tracking-wider">
                                    {h}
                                  </th>
                                ))}
                                <th className="p-2 w-16"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row: string[], rIdx: number) => (
                                <tr key={rIdx} className="border-b border-line last:border-0 hover:bg-slate-50/50">
                                  {row.map((cell: string, cIdx: number) => {
                                    const isPlaceholder = cell.startsWith("{{") && cell.endsWith("}}");
                                    if (isPlaceholder) {
                                      const slotId = cell.replace("{{", "").replace("}}", "").trim();
                                      const matchedVal = correct[slotId] || "";

                                      return (
                                        <td key={cIdx} className="p-2">
                                          <div className="flex items-center gap-1 bg-emerald-500/5 border border-emerald-500/25 p-1 rounded-lg">
                                            <select
                                              value={matchedVal}
                                              onChange={(e) => {
                                                const newCorrect = { ...correct };
                                                newCorrect[slotId] = e.target.value;
                                                setQuestionForm((prev: any) => ({
                                                  ...prev,
                                                  config: { ...prev.config, correct: newCorrect },
                                                }));
                                              }}
                                              className="flex-1 px-1 py-1 rounded border border-emerald-500/30 bg-white text-[11px] font-semibold text-emerald-700"
                                            >
                                              <option value="">-- Correct Match --</option>
                                              {draggables.map((d: string, dIdx: number) => (
                                                <option key={dIdx} value={d}>{d}</option>
                                              ))}
                                            </select>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newRow = [...row];
                                                newRow[cIdx] = "";
                                                const newRows = [...rows];
                                                newRows[rIdx] = newRow;
                                                // Clear matching in config
                                                const newCorrect = { ...correct };
                                                delete newCorrect[slotId];
                                                setQuestionForm((prev: any) => ({
                                                  ...prev,
                                                  config: { ...prev.config, rows: newRows, correct: newCorrect },
                                                }));
                                              }}
                                              className="p-1 rounded text-red-500 hover:bg-red-50 text-[10px] font-bold cursor-pointer shrink-0"
                                              title="Convert back to text cell"
                                            >
                                              ✕ Text
                                            </button>
                                          </div>
                                        </td>
                                      );
                                    }

                                    return (
                                      <td key={cIdx} className="p-2">
                                        <div className="flex items-center gap-1.5">
                                          <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => {
                                              const newRow = [...row];
                                              newRow[cIdx] = e.target.value;
                                              const newRows = [...rows];
                                              newRows[rIdx] = newRow;
                                              setQuestionForm((prev: any) => ({
                                                ...prev,
                                                config: { ...prev.config, rows: newRows },
                                              }));
                                            }}
                                            className="flex-1 px-2.5 py-1.5 rounded border border-line bg-white text-xs"
                                            placeholder="Text cell"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              // Find next slot index
                                              let nextSlotNum = 0;
                                              const allRowsStr = JSON.stringify(rows);
                                              const slotRegex = /drop_(\d+)/g;
                                              let match;
                                              const existingNums: number[] = [];
                                              while ((match = slotRegex.exec(allRowsStr)) !== null) {
                                                existingNums.push(Number(match[1]));
                                              }
                                              if (existingNums.length > 0) {
                                                nextSlotNum = Math.max(...existingNums) + 1;
                                              }
                                              const slotId = `drop_${nextSlotNum}`;

                                              const newRow = [...row];
                                              newRow[cIdx] = `{{${slotId}}}`;
                                              const newRows = [...rows];
                                              newRows[rIdx] = newRow;

                                              const newCorrect = { ...correct };
                                              newCorrect[slotId] = draggables[0] || "";

                                              setQuestionForm((prev: any) => ({
                                                ...prev,
                                                config: { ...prev.config, rows: newRows, correct: newCorrect },
                                              }));
                                            }}
                                            className="px-2 py-1.5 rounded border border-brand/20 bg-brand/5 text-brand text-[10px] font-bold hover:bg-brand/10 shrink-0 cursor-pointer"
                                          >
                                            🎯 Drop Target
                                          </button>
                                        </div>
                                      </td>
                                    );
                                  })}
                                  <td className="p-2 text-right">
                                    <button
                                      type="button"
                                      disabled={rows.length <= 1}
                                      onClick={() => {
                                        const newRows = [...rows];
                                        newRows.splice(rIdx, 1);
                                        setQuestionForm((prev: any) => ({
                                          ...prev,
                                          config: { ...prev.config, rows: newRows },
                                        }));
                                      }}
                                      className="text-error text-xs hover:underline disabled:opacity-30 cursor-pointer"
                                    >
                                      Remove Row
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            const emptyRow = Array(headers.length).fill("");
                            const newRows = [...rows, emptyRow];
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, rows: newRows },
                            }));
                          }}
                          variant="secondary"
                          className="py-1 px-3 text-xs mt-1"
                        >
                          + Add Row
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {questionForm.type === "sequence" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Sequence Items (In Correct Order)</label>
                <p className="text-[10px] text-slate mb-3">Add items in their correct, final order. The system shuffles them when presenting to the student.</p>
                {(() => {
                  const items = questionForm.config?.items || [];
                  return (
                    <div className="space-y-2">
                      {items.map((item: string, idx: number) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <span className="text-xs font-semibold text-slate">{idx + 1}.</span>
                          <input
                            type="text"
                            required
                            value={item}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[idx] = e.target.value;
                              setQuestionForm((prev: any) => ({
                                ...prev,
                                config: { ...prev.config, items: newItems },
                              }));
                            }}
                            className="flex-1 px-3 py-1.5 rounded border border-line bg-white text-sm"
                          />
                          <button
                            type="button"
                            disabled={items.length <= 2}
                            onClick={() => {
                              const newItems = [...items];
                              newItems.splice(idx, 1);
                              const correctOrder = newItems.map((_: any, i: number) => i);
                              setQuestionForm((prev: any) => ({
                                ...prev,
                                config: { items: newItems, correctOrder },
                              }));
                            }}
                            className="text-error text-xs hover:underline disabled:opacity-30 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => {
                          const newItems = [...items, ""];
                          const correctOrder = newItems.map((_: any, i: number) => i);
                          setQuestionForm((prev: any) => ({
                            ...prev,
                            config: { items: newItems, correctOrder },
                          }));
                        }}
                        variant="secondary"
                        className="py-1 px-3 text-xs mt-2"
                      >
                        + Add Item
                      </Button>
                    </div>
                  );
                })()}
              </div>
            )}

            {questionForm.type === "fillblank" && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Question Template</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Python was created by {{1}} in the year {{2}}."
                  value={questionForm.config?.template || ""}
                  onChange={(e) => {
                    const tpl = e.target.value;
                    const matches = tpl.match(/\{\{\d+\}\}/g) || [];
                    const count = matches.length;
                    const currentBlanks = [...(questionForm.config?.blanks || [])];
                    if (currentBlanks.length < count) {
                      for (let i = currentBlanks.length; i < count; i++) {
                        currentBlanks.push({ mode: "text", accepted: [""] });
                      }
                    } else if (currentBlanks.length > count) {
                      currentBlanks.splice(count);
                    }
                    setQuestionForm((prev: any) => ({
                      ...prev,
                      config: {
                        ...prev.config,
                        template: tpl,
                        blanks: currentBlanks,
                      },
                    }));
                  }}
                  className="w-full px-3 py-2 rounded border border-line bg-white text-sm mb-4"
                />

                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-2">Configure Blanks</label>
                {(questionForm.config?.blanks || []).map((blank: any, idx: number) => (
                  <div key={idx} className="border border-line rounded-lg p-3 mb-3 bg-surface/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-ink">Blank #{idx + 1} (matches `{"{{" + (idx + 1) + "}}"}`)</span>
                      <select
                        value={blank.mode || "text"}
                        onChange={(e) => {
                          const newBlanks = [...questionForm.config.blanks];
                          newBlanks[idx] = { ...blank, mode: e.target.value };
                          setQuestionForm((prev: any) => ({
                            ...prev,
                            config: { ...prev.config, blanks: newBlanks },
                          }));
                        }}
                        className="px-2 py-1 rounded border border-line text-xs"
                      >
                        <option value="text">Text Input</option>
                        <option value="dropdown">Dropdown Options</option>
                      </select>
                    </div>

                    <div className="space-y-2 text-xs">
                      {blank.mode === "dropdown" && (
                        <div>
                          <label className="block font-bold text-slate mb-1">Dropdown Options (comma-separated)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Guido van Rossum, Dennis Ritchie, Bjarne Stroustrup"
                            value={blank.options?.join(", ") || ""}
                            onChange={(e) => {
                              const newBlanks = [...questionForm.config.blanks];
                              newBlanks[idx] = {
                                ...blank,
                                options: e.target.value.split(",").map((s) => s.trim()),
                              };
                              setQuestionForm((prev: any) => ({
                                ...prev,
                                config: { ...prev.config, blanks: newBlanks },
                              }));
                            }}
                            className="w-full px-3 py-1.5 rounded border border-line bg-white"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block font-bold text-slate mb-1">Accepted Answers (comma-separated, case-insensitive)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Guido van Rossum, Guido"
                          value={blank.accepted?.join(", ") || ""}
                          onChange={(e) => {
                            const newBlanks = [...questionForm.config.blanks];
                            newBlanks[idx] = {
                              ...blank,
                              accepted: e.target.value.split(",").map((s) => s.trim()),
                            };
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, blanks: newBlanks },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded border border-line bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {questionForm.type === "matrix" && (
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate">
                  <input
                    type="checkbox"
                    checked={!!questionForm.config?.multiple}
                    onChange={(e) => setQuestionForm((prev: any) => ({ ...prev, config: { ...prev.config, multiple: e.target.checked } }))}
                  />
                  Allow multiple correct columns per row
                </label>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Rows</label>
                  {(questionForm.config?.rows || []).map((row: string, rIdx: number) => (
                    <div key={rIdx} className="flex items-center gap-2 mb-2">
                      <input
                        value={row}
                        onChange={(e) => setQuestionForm((prev: any) => {
                          const rows = [...prev.config.rows];
                          rows[rIdx] = e.target.value;
                          return { ...prev, config: { ...prev.config, rows } };
                        })}
                        className="flex-1 px-3 py-2 rounded border border-line bg-white text-sm"
                      />
                      <button
                        type="button"
                        className="text-error text-xs font-bold px-2 cursor-pointer"
                        onClick={() => setQuestionForm((prev: any) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            rows: prev.config.rows.filter((_: any, i: number) => i !== rIdx),
                            correct: (prev.config.correct || []).filter((_: any, i: number) => i !== rIdx),
                          },
                        }))}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-brand text-xs font-bold cursor-pointer"
                    onClick={() => setQuestionForm((prev: any) => ({
                      ...prev,
                      config: {
                        ...prev.config,
                        rows: [...(prev.config.rows || []), `Row ${(prev.config.rows?.length || 0) + 1}`],
                        correct: [...(prev.config.correct || []), []],
                      },
                    }))}
                  >
                    + Add Row
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Columns</label>
                  {(questionForm.config?.columns || []).map((col: string, cIdx: number) => (
                    <div key={cIdx} className="flex items-center gap-2 mb-2">
                      <input
                        value={col}
                        onChange={(e) => setQuestionForm((prev: any) => {
                          const columns = [...prev.config.columns];
                          columns[cIdx] = e.target.value;
                          return { ...prev, config: { ...prev.config, columns } };
                        })}
                        className="flex-1 px-3 py-2 rounded border border-line bg-white text-sm"
                      />
                      <button
                        type="button"
                        className="text-error text-xs font-bold px-2 cursor-pointer"
                        onClick={() => setQuestionForm((prev: any) => ({
                          ...prev,
                          config: {
                            ...prev.config,
                            columns: prev.config.columns.filter((_: any, i: number) => i !== cIdx),
                            correct: (prev.config.correct || []).map((cols: number[]) =>
                              (cols || []).filter((c) => c !== cIdx).map((c) => (c > cIdx ? c - 1 : c))
                            ),
                          },
                        }))}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-brand text-xs font-bold cursor-pointer"
                    onClick={() => setQuestionForm((prev: any) => ({
                      ...prev,
                      config: {
                        ...prev.config,
                        columns: [...(prev.config.columns || []), `Column ${(prev.config.columns?.length || 0) + 1}`],
                      },
                    }))}
                  >
                    + Add Column
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-2">Mark the correct cell(s)</label>
                  <div className="overflow-x-auto">
                    <table className="text-sm border border-line">
                      <thead>
                        <tr>
                          <th className="p-2 border border-line bg-surface"></th>
                          {(questionForm.config?.columns || []).map((col: string, cIdx: number) => (
                            <th key={cIdx} className="p-2 border border-line bg-surface text-xs font-semibold whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(questionForm.config?.rows || []).map((row: string, rIdx: number) => (
                          <tr key={rIdx}>
                            <td className="p-2 border border-line text-xs font-semibold whitespace-nowrap">{row}</td>
                            {(questionForm.config?.columns || []).map((col: string, cIdx: number) => {
                              const sel = (questionForm.config?.correct?.[rIdx] || []).includes(cIdx);
                              return (
                                <td key={cIdx} className="p-2 border border-line text-center">
                                  <input
                                    type={questionForm.config?.multiple ? "checkbox" : "radio"}
                                    name={`matrix-row-${rIdx}`}
                                    checked={sel}
                                    onChange={() => setQuestionForm((prev: any) => {
                                      const correct = (prev.config.correct || []).map((c: number[]) => [...(c || [])]);
                                      while (correct.length <= rIdx) correct.push([]);
                                      if (prev.config.multiple) {
                                        const set = new Set<number>(correct[rIdx]);
                                        if (set.has(cIdx)) set.delete(cIdx); else set.add(cIdx);
                                        correct[rIdx] = Array.from(set).sort((a, b) => a - b);
                                      } else {
                                        correct[rIdx] = [cIdx];
                                      }
                                      return { ...prev, config: { ...prev.config, correct } };
                                    })}
                                  />
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
            )}

            {questionForm.type === "code" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Programming Language</label>
                  <select
                    value={questionForm.config?.language || "python"}
                    onChange={(e) => setQuestionForm((prev: any) => ({
                      ...prev,
                      config: { ...prev.config, language: e.target.value },
                    }))}
                    className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript / Node.js</option>
                    <option value="sql">SQL / SQLite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Starter Code (Initial layout for student)</label>
                  <div className="border border-line rounded-lg overflow-hidden mt-1 bg-white">
                    <CodeMirror
                      value={questionForm.config?.starterCode || ""}
                      height="180px"
                      extensions={getExtensions(questionForm.config?.language || "python")}
                      onChange={(val: string) => setQuestionForm((prev: any) => ({
                        ...prev,
                        config: { ...prev.config, starterCode: val },
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Grading Test Cases</label>
                    <Button
                      type="button"
                      onClick={() => setQuestionForm((prev: any) => ({
                        ...prev,
                        config: {
                          ...prev.config,
                          testCases: [...(prev.config.testCases || []), { stdin: "", expectedOutput: "" }],
                        },
                      }))}
                      variant="secondary"
                      className="py-0.5 px-2 text-[10px]"
                    >
                      + Add Test Case
                    </Button>
                  </div>
                  {(questionForm.config?.testCases || []).map((tc: any, tcIdx: number) => (
                    <div key={tcIdx} className="border border-line rounded-lg p-3 mb-3 bg-surface/20 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate">Test Case #{tcIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cases = [...questionForm.config.testCases];
                            cases.splice(tcIdx, 1);
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, testCases: cases },
                            }));
                          }}
                          className="text-error text-xs hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      <div>
                        <label className="block font-bold text-slate mb-1">Stdin Input (optional)</label>
                        <input
                          type="text"
                          value={tc.stdin || ""}
                          onChange={(e) => {
                            const cases = [...questionForm.config.testCases];
                            cases[tcIdx] = { ...tc, stdin: e.target.value };
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, testCases: cases },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded border border-line bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate mb-1">Expected Output (Must match stdout exactly)</label>
                        <textarea
                          rows={2}
                          required
                          value={tc.expectedOutput || ""}
                          onChange={(e) => {
                            const cases = [...questionForm.config.testCases];
                            cases[tcIdx] = { ...tc, expectedOutput: e.target.value };
                            setQuestionForm((prev: any) => ({
                              ...prev,
                              config: { ...prev.config, testCases: cases },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded border border-line bg-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-line">
            <Button type="submit" className="px-4 py-2 bg-brand text-white text-xs font-bold">
              {editingQuestionId === "new" ? "Create Question" : "Save Question Details"}
            </Button>
            <Button
              type="button"
              onClick={() => setEditingQuestionId(null)}
              variant="secondary"
              className="px-3 py-2 text-xs"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 border-dashed border-2 border-line rounded-xl">
          <HelpCircle className="w-12 h-12 text-slate/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate">No questions added yet.</p>
          <p className="text-xs text-slate mt-1">Click &quot;Add Question&quot; to populate this test.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, qIdx) => (
            <div key={q.id} className="border border-line rounded-xl p-4 bg-white hover:border-line-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center shrink-0">
                    Q{qIdx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-corporate uppercase tracking-wider bg-corporate/10 border border-corporate/25 px-1.5 py-0.5 rounded shrink-0">
                    {q.type}
                  </span>
                  <span className="text-xs font-bold text-slate">
                    {q.marks} {q.marks === 1 ? "mark" : "marks"}
                  </span>
                </div>
                <div className="flex gap-3 items-start mt-1.5">
                  {q.image_url && (
                    <img
                      src={getDirectImageUrl(q.image_url)}
                      alt="Thumbnail"
                      className="w-10 h-10 object-contain rounded border border-line bg-surface shrink-0"
                    />
                  )}
                  <div
                    className="text-xs text-slate font-medium truncate max-w-xl"
                    dangerouslySetInnerHTML={{ __html: q.stem }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveQuestion(qIdx, -1)}
                  disabled={qIdx === 0}
                  className="p-1.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5 text-slate" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveQuestion(qIdx, 1)}
                  disabled={qIdx === questions.length - 1}
                  className="p-1.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-slate" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestionId(q.id);
                    setQuestionForm(q);
                  }}
                  className="p-1.5 border border-line rounded hover:bg-surface cursor-pointer text-slate hover:text-ink"
                  title="Edit Question"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="p-1.5 border border-error/30 hover:bg-error/5 text-error rounded cursor-pointer"
                  title="Delete Question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
