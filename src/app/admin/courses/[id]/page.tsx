"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Layers,
  FileCode,
  Sparkles,
  BookOpen,
  Clock,
  HelpCircle,
  Code2,
  ListOrdered,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";
const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false });
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  kind: "material" | "activity";
  content_html: string;
  max_score: number | null;
  display_order: number;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  display_order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  slug: string;
  title: string;
  segment: "corporate" | "college";
  summary: string;
  introduction: string;
  thumbnail_url: string;
  price_inr: number;
  is_paid: boolean;
  display_order: number;
}

export default function AdminCourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingCourse, setSavingCourse] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  // Form states for modules
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // Form states for lessons (mapping of moduleId -> LessonForm)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>({});
  const [uploadingHtml, setUploadingHtml] = useState(false);

  // Phase 3 - Mock Tests States
  const [activeTab, setActiveTab] = useState<"curriculum" | "mock-tests">("curriculum");
  const [mockTests, setMockTests] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Editing test details
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [testForm, setTestForm] = useState({ title: "", duration_mins: 30, pass_mark: 0 });

  // Editing question details
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState<any>({
    type: "single",
    stem: "",
    marks: 1,
    config: { options: ["Option A", "Option B"], correctIndex: 0 }
  });

  const fetchMockTests = async (courseId: string) => {
    setLoadingTests(true);
    try {
      const res = await fetch(`/api/admin/tests?course_id=${courseId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMockTests(data.mock_tests || []);
    } catch (err: any) {
      console.error("Failed to load mock tests:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  const fetchQuestions = async (testId: string | null) => {
    if (!testId) return;
    setLoadingQuestions(true);
    try {
      const res = await fetch(`/api/admin/questions?test_id=${testId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuestions(data.questions || []);
    } catch (err: any) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

  useEffect(() => {
    if (selectedTestId) {
      fetchQuestions(selectedTestId);
    } else {
      setQuestions([]);
    }
  }, [selectedTestId]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/courses/${params.id}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load course details");
      setCourse(data.course);
      setCurriculum(data.curriculum || []);
      if (data.course) {
        fetchMockTests(data.course.id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch details.");
    } finally {
      setLoading(false);
    }
  };

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
    } else if (type === "sequence") {
      defaultConfig = { items: ["Item 1", "Item 2"], correctOrder: [0, 1] };
    } else if (type === "fillblank") {
      defaultConfig = { template: "The capital of France is {{1}}.", blanks: [{ mode: "text", accepted: ["Paris"] }] };
    } else if (type === "code") {
      defaultConfig = { language: "python", starterCode: "# Write your Python code here\n", testCases: [{ stdin: "", expectedOutput: "" }] };
    }
    setQuestionForm((prev: any) => ({
      ...prev,
      type,
      config: defaultConfig
    }));
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    const isNew = editingTestId === "new";
    const method = isNew ? "POST" : "PATCH";
    const body = isNew
      ? { ...testForm, course_id: course.id, display_order: mockTests.length + 1 }
      : { ...testForm, id: editingTestId };

    try {
      const res = await fetch("/api/admin/tests", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingTestId(null);
      fetchMockTests(course.id);
    } catch (err: any) {
      alert(err.message || "Failed to save mock test");
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm("Are you sure you want to delete this mock test? This will permanently delete all questions and student attempts.")) return;
    try {
      const res = await fetch("/api/admin/tests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: testId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (selectedTestId === testId) {
        setSelectedTestId(null);
      }
      if (course) fetchMockTests(course.id);
    } catch (err: any) {
      alert(err.message || "Failed to delete test");
    }
  };

  const handleMoveTest = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= mockTests.length) return;
    const listCopy = [...mockTests];
    const temp = listCopy[index].display_order;
    listCopy[index].display_order = listCopy[targetIdx].display_order;
    listCopy[targetIdx].display_order = temp;

    setMockTests(listCopy);
    try {
      await Promise.all([
        fetch("/api/admin/tests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: listCopy[index].id, display_order: listCopy[index].display_order }),
        }),
        fetch("/api/admin/tests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: listCopy[targetIdx].id, display_order: listCopy[targetIdx].display_order }),
        }),
      ]);
      if (course) fetchMockTests(course.id);
    } catch (err) {
      console.error("Failed to move test:", err);
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTestId) return;
    const isNew = editingQuestionId === "new";
    const method = isNew ? "POST" : "PATCH";
    const body = isNew
      ? { ...questionForm, test_id: selectedTestId, display_order: questions.length + 1 }
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
      fetchQuestions(selectedTestId);
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
      fetchQuestions(selectedTestId);
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
      fetchQuestions(selectedTestId);
    } catch (err) {
      console.error("Failed to move question:", err);
    }
  };

  // Course updates
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setSavingCourse(true);
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Course settings saved successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update course.");
    } finally {
      setSavingCourse(false);
    }
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !course) return;
    setUploadingThumb(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourse({ ...course, thumbnail_url: data.url });
    } catch (err: any) {
      alert(err.message || "Image upload failed.");
    } finally {
      setUploadingThumb(false);
    }
  };

  // Module actions
  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !course) return;
    const order = curriculum.length > 0 ? Math.max(...curriculum.map((m) => m.display_order)) + 1 : 1;

    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: course.id,
          title: newModuleTitle,
          display_order: order,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewModuleTitle("");
      setAddingModule(false);
      fetchCourseDetails(); // Reload curriculum
    } catch (err: any) {
      alert(err.message || "Failed to create module.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module and all lessons inside it?")) return;
    try {
      const res = await fetch("/api/admin/modules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: moduleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCourseDetails();
    } catch (err: any) {
      alert(err.message || "Module delete failed.");
    }
  };

  const handleRenameModule = async (moduleId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch("/api/admin/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: moduleId, title: newTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCurriculum((prev) =>
        prev.map((mod) => (mod.id === moduleId ? { ...mod, title: newTitle } : mod))
      );
    } catch (err: any) {
      alert(err.message || "Rename failed.");
    }
  };

  const handleMoveModule = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= curriculum.length) return;

    const newCurriculum = [...curriculum];
    const temp = newCurriculum[index].display_order;
    newCurriculum[index].display_order = newCurriculum[targetIndex].display_order;
    newCurriculum[targetIndex].display_order = temp;

    // Swap locally
    setCurriculum(newCurriculum);

    try {
      await Promise.all([
        fetch("/api/admin/modules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newCurriculum[index].id, display_order: newCurriculum[index].display_order }),
        }),
        fetch("/api/admin/modules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: newCurriculum[targetIndex].id, display_order: newCurriculum[targetIndex].display_order }),
        }),
      ]);
      fetchCourseDetails(); // Reload ordering
    } catch (err) {
      console.error("Move module failed:", err);
    }
  };

  // Lesson actions
  const openAddLesson = (moduleId: string) => {
    const mod = curriculum.find((m) => m.id === moduleId);
    const order = mod && mod.lessons.length > 0 ? Math.max(...mod.lessons.map((l) => l.display_order)) + 1 : 1;
    setEditingLessonId(`new-${moduleId}`);
    setLessonForm({
      module_id: moduleId,
      title: "",
      kind: "material",
      content_html: "",
      max_score: 100,
      display_order: order,
    });
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonForm(lesson);
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.title?.trim()) {
      alert("Lesson title is required.");
      return;
    }
    const isNew = editingLessonId?.startsWith("new-");
    const method = isNew ? "POST" : "PATCH";
    try {
      const res = await fetch("/api/admin/lessons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNew ? lessonForm : { id: editingLessonId, ...lessonForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEditingLessonId(null);
      setLessonForm({});
      fetchCourseDetails();
    } catch (err: any) {
      alert(err.message || "Failed to save lesson.");
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lessonId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchCourseDetails();
    } catch (err: any) {
      alert(err.message || "Failed to delete lesson.");
    }
  };

  const handleMoveLesson = async (modIndex: number, lessonIndex: number, direction: -1 | 1) => {
    const mod = curriculum[modIndex];
    const targetIndex = lessonIndex + direction;
    if (targetIndex < 0 || targetIndex >= mod.lessons.length) return;

    const lessonsCopy = [...mod.lessons];
    const temp = lessonsCopy[lessonIndex].display_order;
    lessonsCopy[lessonIndex].display_order = lessonsCopy[targetIndex].display_order;
    lessonsCopy[targetIndex].display_order = temp;

    try {
      await Promise.all([
        fetch("/api/admin/lessons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: lessonsCopy[lessonIndex].id, display_order: lessonsCopy[lessonIndex].display_order }),
        }),
        fetch("/api/admin/lessons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: lessonsCopy[targetIndex].id, display_order: lessonsCopy[targetIndex].display_order }),
        }),
      ]);
      fetchCourseDetails();
    } catch (err) {
      console.error("Failed to move lesson:", err);
    }
  };

  const handleHtmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHtml(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setLessonForm((prev) => ({ ...prev, content_html: text }));
      setUploadingHtml(false);
    };
    reader.onerror = () => {
      alert("Failed to read HTML file.");
      setUploadingHtml(false);
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-surface p-8 flex items-center justify-center">
        <div className="text-center bg-white border border-line p-8 rounded-card max-w-sm">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-3" />
          <h3 className="font-bold text-ink">Course Not Found</h3>
          <p className="text-xs text-slate mt-2">The selected program details could not be resolved.</p>
          <Link href="/admin/courses" className="mt-6 inline-block">
            <Button variant="secondary" className="px-4 py-2 text-xs">Return to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-line shadow-soft">
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/courses"
              className="p-2 border border-line rounded-lg text-slate hover:text-brand hover:border-brand/30 transition-all shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                program builder
              </span>
              <h1 className="text-xl font-bold font-display text-ink leading-tight mt-0.5">
                {course.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Two Columns: Course Info & Curriculum Outline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Course Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-6">
              <h2 className="text-base font-bold font-display text-ink border-b border-line pb-2.5">
                Course Settings
              </h2>

              <form onSubmit={handleUpdateCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={course.slug}
                    onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Segment
                    </label>
                    <select
                      value={course.segment}
                      onChange={(e: any) => setCourse({ ...course, segment: e.target.value })}
                      className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm"
                    >
                      <option value="college">College</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5 pl-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={course.is_paid}
                        onChange={(e) => setCourse({ ...course, is_paid: e.target.checked })}
                        className="w-4 h-4 rounded text-brand border-line"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate">Paid</span>
                    </label>
                  </div>
                </div>

                {course.is_paid && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                      Price (INR)
                    </label>
                    <input
                      type="number"
                      required
                      value={course.price_inr}
                      onChange={(e) => setCourse({ ...course, price_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm focus:bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Thumbnail Image URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={course.thumbnail_url}
                      onChange={(e) => setCourse({ ...course, thumbnail_url: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-input border border-line bg-surface/50 text-sm"
                    />
                    <input
                      type="file"
                      id="thumb-file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbUpload}
                    />
                    <label
                      htmlFor="thumb-file"
                      className="px-3 py-2 border border-line rounded-btn hover:bg-surface text-slate text-xs font-bold cursor-pointer shrink-0 inline-flex items-center justify-center gap-1.5"
                    >
                      {uploadingThumb ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Upload</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Introduction (Markdown / Rich HTML)
                  </label>
                  <textarea
                    rows={8}
                    value={course.introduction}
                    onChange={(e) => setCourse({ ...course, introduction: e.target.value })}
                    placeholder="Provide HTML content explaining what students learn in this program..."
                    className="w-full px-3 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white text-xs font-mono resize-y"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Summary Text
                  </label>
                  <textarea
                    rows={3}
                    value={course.summary}
                    onChange={(e) => setCourse({ ...course, summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-input border border-line bg-surface/50 text-sm focus:bg-white resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={savingCourse}
                  className="w-full py-3 justify-center text-sm font-bold bg-brand text-white"
                >
                  {savingCourse ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Save Program Settings
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Curriculum & Mock Tests Tabs */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-6">
              {/* Tab Selector */}
              <div className="flex border-b border-line -mx-6 -mt-6 px-6 bg-surface/20 rounded-t-card overflow-x-auto">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("curriculum");
                    setSelectedTestId(null);
                  }}
                  className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "curriculum"
                      ? "border-brand text-brand bg-white"
                      : "border-transparent text-slate hover:text-ink"
                  }`}
                >
                  Curriculum Outline
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("mock-tests");
                    setSelectedTestId(null);
                  }}
                  className={`py-3.5 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "mock-tests"
                      ? "border-brand text-brand bg-white"
                      : "border-transparent text-slate hover:text-ink"
                  }`}
                >
                  Mock Tests ({mockTests.length})
                </button>
              </div>

              {activeTab === "curriculum" ? (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <h2 className="text-base font-bold font-display text-ink">Course Curriculum Outline</h2>
                    {!addingModule && (
                      <Button
                        onClick={() => setAddingModule(true)}
                        className="px-3.5 py-1.5 bg-education text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Module
                      </Button>
                    )}
                  </div>

                  {/* Add Module inline form */}
                  {addingModule && (
                    <div className="bg-surface/50 border border-line p-4 rounded-xl flex items-center gap-3 animate-fade-up">
                      <input
                        type="text"
                        placeholder="Enter module title..."
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-line bg-white text-sm"
                      />
                      <Button
                        onClick={handleAddModule}
                        disabled={!newModuleTitle.trim()}
                        className="px-4 py-2 bg-education text-white text-xs font-bold shrink-0"
                      >
                        Create
                      </Button>
                      <Button
                        onClick={() => {
                          setAddingModule(false);
                          setNewModuleTitle("");
                        }}
                        variant="secondary"
                        className="px-3 py-2 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Modules List */}
                  {curriculum.length === 0 ? (
                    <div className="text-center py-12 border-dashed border-2 border-line rounded-xl">
                      <Layers className="w-12 h-12 text-slate/30 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate">No modules defined yet.</p>
                      <p className="text-xs text-slate mt-1">Start by creating a module, then populate it with lessons.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {curriculum.map((mod, modIdx) => (
                        <div key={mod.id} className="border border-line rounded-xl shadow-sm overflow-hidden">
                          {/* Module Title Row */}
                          <div className="bg-surface/55 px-5 py-4 border-b border-line flex items-center justify-between gap-3">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand/10 text-brand text-xs font-bold shrink-0">
                                M{modIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => handleRenameModule(mod.id, e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate/30 focus:border-brand focus:outline-none font-bold text-ink text-sm flex-1 min-w-0 py-0.5"
                              />
                            </div>

                            {/* Module Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMoveModule(modIdx, -1)}
                                disabled={modIdx === 0}
                                className="p-1 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                title="Move Module Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5 text-slate" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveModule(modIdx, 1)}
                                disabled={modIdx === curriculum.length - 1}
                                className="p-1 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                title="Move Module Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5 text-slate" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openAddLesson(mod.id)}
                                className="p-1.5 bg-education/10 border border-education/20 hover:bg-education/20 text-education rounded-md text-xs font-bold flex items-center gap-0.5 ml-1 cursor-pointer"
                                title="Add Lesson inside Module"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Add Lesson</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteModule(mod.id)}
                                className="p-1.5 border border-error/25 hover:bg-error/5 text-error rounded-md ml-1 cursor-pointer"
                                title="Delete Module"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Lessons List inside Module */}
                          <div className="p-4 space-y-2 bg-white">
                            {mod.lessons.length === 0 ? (
                              <div className="text-center py-5 text-xs text-slate italic">
                                No lessons added to this module yet.
                              </div>
                            ) : (
                              mod.lessons.map((les, lesIdx) => {
                                const isEditing = editingLessonId === les.id;
                                const isActivity = les.kind === "activity";
                                const badgeColor = isActivity
                                  ? "bg-corporate/10 text-corporate border-corporate/30"
                                  : "bg-education/10 text-education border-education/30";

                                return (
                                  <div
                                    key={les.id}
                                    className={`border rounded-lg p-3 transition-all ${
                                      isEditing
                                        ? "border-brand/40 bg-brand/5 shadow-soft"
                                        : "border-line bg-surface/10 hover:border-line-hover"
                                    }`}
                                  >
                                    {!isEditing ? (
                                      /* Display Mode */
                                      <div className="flex items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                          <span className="font-semibold text-slate">L{lesIdx + 1}</span>
                                          <span
                                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 border ${badgeColor}`}
                                          >
                                            {les.kind}
                                          </span>
                                          <span className="font-semibold text-ink truncate text-sm">
                                            {les.title}
                                          </span>
                                          {isActivity && les.max_score && (
                                            <span className="text-[10px] text-slate font-semibold shrink-0">
                                              (Max Score: {les.max_score})
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            type="button"
                                            onClick={() => handleMoveLesson(modIdx, lesIdx, -1)}
                                            disabled={lesIdx === 0}
                                            className="p-0.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                          >
                                            <ArrowUp className="w-3 h-3 text-slate" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleMoveLesson(modIdx, lesIdx, 1)}
                                            disabled={lesIdx === mod.lessons.length - 1}
                                            className="p-0.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                          >
                                            <ArrowDown className="w-3 h-3 text-slate" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => openEditLesson(les)}
                                            className="p-1 text-slate hover:text-brand cursor-pointer"
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteLesson(les.id)}
                                            className="p-1 text-slate hover:text-error cursor-pointer"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      /* Inline Lesson Edit Form */
                                      <div className="space-y-4 pt-1">
                                        <div className="flex items-center justify-between border-b border-line/60 pb-2">
                                          <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                                            Edit Lesson details
                                          </h4>
                                          <button type="button" onClick={() => setEditingLessonId(null)} className="cursor-pointer">
                                            <X className="w-4 h-4 text-slate hover:text-ink" />
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">
                                              Lesson Title *
                                            </label>
                                            <input
                                              type="text"
                                              required
                                              value={lessonForm.title}
                                              onChange={(e) =>
                                                setLessonForm((prev) => ({ ...prev, title: e.target.value }))
                                              }
                                              className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">
                                              Lesson Kind
                                            </label>
                                            <select
                                              value={lessonForm.kind}
                                              onChange={(e: any) =>
                                                setLessonForm((prev) => ({ ...prev, kind: e.target.value }))
                                              }
                                              className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
                                            >
                                              <option value="material">Study Material (HTML)</option>
                                              <option value="activity">Interactive Activity (HTML)</option>
                                            </select>
                                          </div>

                                          {lessonForm.kind === "activity" && (
                                            <div>
                                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">
                                                Max Score *
                                              </label>
                                              <input
                                                type="number"
                                                required
                                                value={lessonForm.max_score || 0}
                                                onChange={(e) =>
                                                  setLessonForm((prev) => ({
                                                    ...prev,
                                                    max_score: Number(e.target.value),
                                                  }))
                                                }
                                                className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
                                              />
                                            </div>
                                          )}

                                          <div className="md:col-span-2">
                                            <div className="flex items-center justify-between mb-1">
                                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">
                                                Lesson Content (HTML Source Code)
                                              </label>
                                              <div className="flex items-center gap-1.5">
                                                <input
                                                  type="file"
                                                  id={`html-file-${les.id}`}
                                                  accept=".html"
                                                  className="hidden"
                                                  onChange={handleHtmlFileChange}
                                                />
                                                <label
                                                  htmlFor={`html-file-${les.id}`}
                                                  className="cursor-pointer px-2 py-1 bg-white border border-line hover:border-brand/40 text-brand text-[10px] font-bold rounded flex items-center gap-1 shadow-sm shrink-0"
                                                >
                                                  {uploadingHtml ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                  ) : (
                                                    <Upload className="w-3 h-3" />
                                                  )}
                                                  <span>Import HTML file</span>
                                                </label>
                                              </div>
                                            </div>
                                            <textarea
                                              rows={12}
                                              placeholder="<div>Paste lesson HTML markup here...</div>"
                                              value={lessonForm.content_html}
                                              onChange={(e) =>
                                                setLessonForm((prev) => ({
                                                  ...prev,
                                                  content_html: e.target.value,
                                                }))
                                              }
                                              className="w-full px-3 py-2 border border-line bg-white rounded-lg text-xs font-mono resize-y"
                                            />
                                          </div>
                                        </div>

                                        <div className="flex gap-2 justify-end">
                                          <Button
                                            onClick={handleSaveLesson}
                                            className="px-4 py-2 bg-brand text-white text-xs font-bold flex items-center gap-1"
                                          >
                                            <Check className="w-3.5 h-3.5" />
                                            Save Lesson
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              setEditingLessonId(null);
                                              setLessonForm({});
                                            }}
                                            variant="secondary"
                                            className="px-3 py-2 text-xs"
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Phase 3 Mock Tests Builder Tab */
                <div className="space-y-6 pt-2">
                  {!selectedTestId ? (
                    /* Mock Tests Listing view */
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-line pb-3">
                        <h2 className="text-base font-bold font-display text-ink">Programs Mock Tests</h2>
                        {!editingTestId && (
                          <Button
                            onClick={() => {
                              setEditingTestId("new");
                              setTestForm({ title: "", duration_mins: 30, pass_mark: 0 });
                            }}
                            className="px-3.5 py-1.5 bg-brand text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Test
                          </Button>
                        )}
                      </div>

                      {/* Add/Edit Mock Test Form */}
                      {editingTestId && (
                        <form onSubmit={handleSaveTest} className="bg-surface/50 border border-line p-4 rounded-xl space-y-4 animate-fade-up">
                          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
                            {editingTestId === "new" ? "Create Mock Test" : "Edit Mock Test Settings"}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Test Title *</label>
                              <input
                                type="text"
                                required
                                value={testForm.title}
                                onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                                className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                                placeholder="e.g. SQL Basics Practice Exam"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Duration (Minutes)</label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={testForm.duration_mins}
                                onChange={(e) => setTestForm({ ...testForm, duration_mins: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Minimum Passing Mark</label>
                              <input
                                type="number"
                                required
                                min={0}
                                step="any"
                                value={testForm.pass_mark}
                                onChange={(e) => setTestForm({ ...testForm, pass_mark: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button type="submit" className="px-4 py-2 bg-brand text-white text-xs font-bold">
                              {editingTestId === "new" ? "Create Test" : "Save Test Settings"}
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setEditingTestId(null)}
                              variant="secondary"
                              className="px-3 py-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}

                      {loadingTests ? (
                        <div className="py-12 flex justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-brand" />
                        </div>
                      ) : mockTests.length === 0 ? (
                        <div className="text-center py-12 border-dashed border-2 border-line rounded-xl">
                          <Clock className="w-12 h-12 text-slate/30 mx-auto mb-3" />
                          <p className="text-sm font-semibold text-slate">No mock tests designed yet.</p>
                          <p className="text-xs text-slate mt-1">Start by adding a timed test, then build out its questions.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {mockTests.map((test, index) => (
                            <div key={test.id} className="border border-line rounded-xl p-4 bg-white hover:border-line-hover transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="font-bold text-ink text-sm flex items-center gap-2">
                                  <span className="w-5 h-5 rounded bg-brand/10 text-brand text-[10px] font-bold flex items-center justify-center">
                                    T{index + 1}
                                  </span>
                                  {test.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-slate">
                                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.duration_mins} mins</span>
                                  <span>•</span>
                                  <span>Pass score: {test.pass_mark}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleMoveTest(index, -1)}
                                  disabled={index === 0}
                                  className="p-1.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5 text-slate" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveTest(index, 1)}
                                  disabled={index === mockTests.length - 1}
                                  className="p-1.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5 text-slate" />
                                </button>
                                <Button
                                  onClick={() => setSelectedTestId(test.id)}
                                  className="py-1 px-3 bg-brand/10 hover:bg-brand/20 text-brand border border-brand/20 text-xs font-bold"
                                >
                                  Manage Questions
                                </Button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingTestId(test.id);
                                    setTestForm({ title: test.title, duration_mins: test.duration_mins, pass_mark: test.pass_mark });
                                  }}
                                  className="p-1.5 border border-line rounded hover:bg-surface cursor-pointer text-slate hover:text-ink"
                                  title="Edit Test Settings"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTest(test.id)}
                                  className="p-1.5 border border-error/30 hover:bg-error/5 text-error rounded cursor-pointer"
                                  title="Delete Test"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Questions list/builder for selected test */
                    <div className="space-y-6">
                      {(() => {
                        const selectedTest = mockTests.find(t => t.id === selectedTestId);
                        const getExtensions = (lang: string) => {
                          if (lang === "python") return [python()];
                          if (lang === "javascript" || lang === "js") return [javascript()];
                          if (lang === "sql") return [sql()];
                          return [];
                        };

                        return (
                          <>
                            <div className="flex items-center justify-between border-b border-line pb-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => setSelectedTestId(null)}
                                  variant="secondary"
                                  className="py-1 px-2 text-xs"
                                >
                                  ← Back
                                </Button>
                                <div>
                                  <h2 className="text-sm font-bold text-ink leading-tight">{selectedTest?.title}</h2>
                                  <p className="text-[10px] text-slate mt-0.5">{selectedTest?.duration_mins} mins • Passing: {selectedTest?.pass_mark} marks</p>
                                </div>
                              </div>
                              {!editingQuestionId && (
                                <Button
                                  onClick={() => {
                                    setEditingQuestionId("new");
                                    setQuestionForm({
                                      type: "single",
                                      stem: "",
                                      marks: 1,
                                      config: { options: ["Option A", "Option B"], correctIndex: 0 }
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

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Question Type</label>
                                    <select
                                      value={questionForm.type}
                                      onChange={(e) => handleTypeChange(e.target.value)}
                                      className="w-full px-3 py-2 rounded border border-line bg-white text-sm"
                                    >
                                      <option value="single">Single Choice (Radio)</option>
                                      <option value="multiple">Multiple Choice (Checkboxes)</option>
                                      <option value="truefalse">True / False</option>
                                      <option value="dragdrop">Drag &amp; Drop Matching</option>
                                      <option value="sequence">Sequence Reordering</option>
                                      <option value="fillblank">Fill in the Blanks</option>
                                      <option value="code">Sandbox Code Execution</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Marks Assigned</label>
                                    <input
                                      type="number"
                                      required
                                      min={0.5}
                                      step="any"
                                      value={questionForm.marks}
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
                                    value={questionForm.stem}
                                    onChange={(e) => setQuestionForm({ ...questionForm, stem: e.target.value })}
                                    className="w-full px-3 py-2.5 rounded border border-line bg-white text-sm font-mono"
                                    placeholder="e.g. <p>What is the output of the following code?</p>"
                                  />
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
                                              config: { ...prev.config, correctIndex: idx }
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
                                                config: { ...prev.config, options: opts }
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
                                                config: { ...prev.config, options: opts, correctIndex: newCorrectIndex }
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
                                          config: { ...prev.config, options: [...(prev.config.options || []), ""] }
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
                                                  nextIndexes = nextIndexes.filter(x => x !== idx);
                                                }
                                                setQuestionForm((prev: any) => ({
                                                  ...prev,
                                                  config: { ...prev.config, correctIndexes: nextIndexes }
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
                                                  config: { ...prev.config, options: opts }
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
                                                  config: { ...prev.config, options: opts, correctIndexes: nextIndexes }
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
                                          config: { ...prev.config, options: [...(prev.config.options || []), ""] }
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
                                              config: { ...prev.config, correct: true }
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
                                              config: { ...prev.config, correct: false }
                                            }))}
                                            className="w-4 h-4 text-brand"
                                          />
                                          <span className="font-bold text-ink">False</span>
                                        </label>
                                      </div>
                                    </div>
                                  )}

                                  {questionForm.type === "dragdrop" && (
                                    <div>
                                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Matching Pairs</label>
                                      <p className="text-[10px] text-slate mb-3">Add left items and their matching right items. The system will shuffle the right items for the student.</p>
                                      {(() => {
                                        const config = questionForm.config || { left: [], right: [], correctPairs: [] };
                                        const pairs = (config.left || []).map((l: string, idx: number) => ({
                                          leftText: l,
                                          rightText: config.right?.[idx] || ""
                                        }));

                                        return (
                                          <div className="space-y-2">
                                            {pairs.map((p: any, idx: number) => (
                                              <div key={idx} className="flex gap-2 items-center">
                                                <input
                                                  type="text"
                                                  required
                                                  placeholder="Left Item"
                                                  value={p.leftText}
                                                  onChange={(e) => {
                                                    const left = [...config.left];
                                                    left[idx] = e.target.value;
                                                    setQuestionForm((prev: any) => ({
                                                      ...prev,
                                                      config: { ...prev.config, left }
                                                    }));
                                                  }}
                                                  className="flex-1 px-3 py-1.5 rounded border border-line bg-white text-sm"
                                                />
                                                <span className="text-slate font-bold">⇌</span>
                                                <input
                                                  type="text"
                                                  required
                                                  placeholder="Matching Right Item"
                                                  value={p.rightText}
                                                  onChange={(e) => {
                                                    const right = [...(config.right || [])];
                                                    right[idx] = e.target.value;
                                                    setQuestionForm((prev: any) => ({
                                                      ...prev,
                                                      config: { ...prev.config, right }
                                                    }));
                                                  }}
                                                  className="flex-1 px-3 py-1.5 rounded border border-line bg-white text-sm"
                                                />
                                                <button
                                                  type="button"
                                                  disabled={pairs.length <= 1}
                                                  onClick={() => {
                                                    const left = [...config.left];
                                                    const right = [...config.right];
                                                    left.splice(idx, 1);
                                                    right.splice(idx, 1);
                                                    const correctPairs = left.map((_: any, i: number) => [i, i]);
                                                    setQuestionForm((prev: any) => ({
                                                      ...prev,
                                                      config: { left, right, correctPairs }
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
                                                const left = [...(config.left || []), ""];
                                                const right = [...(config.right || []), ""];
                                                const correctPairs = left.map((_: any, i: number) => [i, i]);
                                                setQuestionForm((prev: any) => ({
                                                  ...prev,
                                                  config: { left, right, correctPairs }
                                                }));
                                              }}
                                              variant="secondary"
                                              className="py-1 px-3 text-xs mt-2"
                                            >
                                              + Add Pair
                                            </Button>
                                          </div>
                                        );
                                      })()}
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
                                                      config: { ...prev.config, items: newItems }
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
                                                      config: { items: newItems, correctOrder }
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
                                                  config: { items: newItems, correctOrder }
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
                                              blanks: currentBlanks
                                            }
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
                                                  config: { ...prev.config, blanks: newBlanks }
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
                                                      options: e.target.value.split(",").map(s => s.trim())
                                                    };
                                                    setQuestionForm((prev: any) => ({
                                                      ...prev,
                                                      config: { ...prev.config, blanks: newBlanks }
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
                                                    accepted: e.target.value.split(",").map(s => s.trim())
                                                  };
                                                  setQuestionForm((prev: any) => ({
                                                    ...prev,
                                                    config: { ...prev.config, blanks: newBlanks }
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

                                  {questionForm.type === "code" && (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate mb-1">Programming Language</label>
                                        <select
                                          value={questionForm.config?.language || "python"}
                                          onChange={(e) => setQuestionForm((prev: any) => ({
                                            ...prev,
                                            config: { ...prev.config, language: e.target.value }
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
                                            onChange={(val) => setQuestionForm((prev: any) => ({
                                              ...prev,
                                              config: { ...prev.config, starterCode: val }
                                            }))}
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <div className="flex justify-between items-center mb-2">
                                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">Test Cases (Auto-grading parameters)</label>
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              const cases = [...(questionForm.config?.testCases || [])];
                                              cases.push({ stdin: "", expectedOutput: "" });
                                              setQuestionForm((prev: any) => ({
                                                ...prev,
                                                config: { ...prev.config, testCases: cases }
                                              }));
                                            }}
                                            variant="secondary"
                                            className="py-1 px-2.5 text-[10px] font-bold"
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
                                                    config: { ...prev.config, testCases: cases }
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
                                                    config: { ...prev.config, testCases: cases }
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
                                                    config: { ...prev.config, testCases: cases }
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

                            {loadingQuestions ? (
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
                                          {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                                        </span>
                                      </div>
                                      <div
                                        className="text-xs text-slate font-medium truncate mt-1.5 max-w-xl"
                                        dangerouslySetInnerHTML={{ __html: q.stem }}
                                      />
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
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
