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
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/Button";

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

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

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
    } catch (err: any) {
      setError(err.message || "Failed to fetch details.");
    } finally {
      setLoading(false);
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

          {/* Right Column: Modules & Lessons Builder */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-6">
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
                            onClick={() => handleMoveModule(modIdx, -1)}
                            disabled={modIdx === 0}
                            className="p-1 border border-line bg-white rounded hover:bg-surface disabled:opacity-30"
                            title="Move Module Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5 text-slate" />
                          </button>
                          <button
                            onClick={() => handleMoveModule(modIdx, 1)}
                            disabled={modIdx === curriculum.length - 1}
                            className="p-1 border border-line bg-white rounded hover:bg-surface disabled:opacity-30"
                            title="Move Module Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5 text-slate" />
                          </button>
                          <button
                            onClick={() => openAddLesson(mod.id)}
                            className="p-1.5 bg-education/10 border border-education/20 hover:bg-education/20 text-education rounded-md text-xs font-bold flex items-center gap-0.5 ml-1"
                            title="Add Lesson inside Module"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Add Lesson</span>
                          </button>
                          <button
                            onClick={() => handleDeleteModule(mod.id)}
                            className="p-1.5 border border-error/25 hover:bg-error/5 text-error rounded-md ml-1"
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
                                        onClick={() => handleMoveLesson(modIdx, lesIdx, -1)}
                                        disabled={lesIdx === 0}
                                        className="p-0.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30"
                                      >
                                        <ArrowUp className="w-3 h-3 text-slate" />
                                      </button>
                                      <button
                                        onClick={() => handleMoveLesson(modIdx, lesIdx, 1)}
                                        disabled={lesIdx === mod.lessons.length - 1}
                                        className="p-0.5 border border-line bg-white rounded hover:bg-surface disabled:opacity-30"
                                      >
                                        <ArrowDown className="w-3 h-3 text-slate" />
                                      </button>
                                      <button
                                        onClick={() => openEditLesson(les)}
                                        className="p-1 text-slate hover:text-brand"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(les.id)}
                                        className="p-1 text-slate hover:text-error"
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
                                      <button onClick={() => setEditingLessonId(null)}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
