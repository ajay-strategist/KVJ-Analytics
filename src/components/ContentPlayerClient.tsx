"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, CheckCircle, Circle, ChevronLeft, ChevronRight, Menu, X, Loader2, PlayCircle, Award, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Container } from "./ui/Container";
import { supabase } from "@/lib/supabase";

interface Lesson {
  id: string;
  title: string;
  kind: "material" | "activity";
  max_score: number | null;
  video_url?: string | null;
  content_html?: string | null;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface ContentPlayerClientProps {
  course: {
    id: string;
    title: string;
    slug: string;
  };
  modules: Module[];
}

export function ContentPlayerClient({ course, modules }: ContentPlayerClientProps) {
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  // Flatten lessons for easy next/prev indexing
  const allLessons = modules.flatMap((mod) => mod.lessons);

  useEffect(() => {
    const initPlayer = async () => {
      // 1. Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push(`/signin?redirect=/training/${course.slug}/learn`);
        return;
      }
      setUser(session.user);

      // 2. Verify enrollment
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("course_slug", course.slug)
        .eq("status", "active")
        .maybeSingle();

      if (!enrollment) {
        alert("Access denied. You must enroll in the course to access the content player.");
        router.push(`/training/${course.slug}`);
        return;
      }

      // 3. Fetch completed lessons (activity results)
      const { data: results } = await supabase
        .from("activity_results")
        .select("lesson_id")
        .eq("user_id", session.user.id)
        .eq("course_slug", course.slug);

      if (results) {
        setCompletedLessonIds(new Set(results.map((r) => r.lesson_id)));
      }

      // 4. Set first lesson as active by default
      if (allLessons.length > 0) {
        setActiveLesson(allLessons[0]);
      }

      setLoading(false);
    };

    initPlayer();
  }, [course.slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#00F0FF] mx-auto" />
          <p className="text-zinc-500 text-sm font-light">Loading training portal...</p>
        </div>
      </div>
    );
  }

  const activeIndex = activeLesson ? allLessons.findIndex((l) => l.id === activeLesson.id) : -1;
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!activeLesson || !user) return;
    setActionLoading(true);

    const isCurrentlyCompleted = completedLessonIds.has(activeLesson.id);

    try {
      if (isCurrentlyCompleted) {
        // Toggle completion off by deleting activity result
        const { error } = await supabase
          .from("activity_results")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", activeLesson.id);

        if (error) throw error;
        
        const newCompletions = new Set(completedLessonIds);
        newCompletions.delete(activeLesson.id);
        setCompletedLessonIds(newCompletions);
      } else {
        // Mark complete by submitting result
        const response = await fetch("/api/activity-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: activeLesson.id,
            score: 100,
            maxScore: 100,
            courseSlug: course.slug,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to submit completion.");
        }

        const newCompletions = new Set(completedLessonIds);
        newCompletions.add(activeLesson.id);
        setCompletedLessonIds(newCompletions);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update completion status.");
    } finally {
      setActionLoading(false);
    }
  };

  const totalLessons = allLessons.length;
  const completedLessonsCount = completedLessonIds.size;
  const percentComplete = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  return (
    <div className="w-full h-screen bg-[#050505] text-zinc-200 flex relative overflow-hidden">
      
      {/* 1. Collapsible Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:relative w-[320px] bg-[#0A0A0C] border-r border-white/5 flex flex-col transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:-ml-[320px]"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <Link href={`/training/${course.slug}`} className="text-xs text-zinc-500 hover:text-[#00F0FF] flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" /> Back to detail
            </Link>
            <h2 className="text-md font-bold text-white font-display mt-2 line-clamp-1">
              {course.title}
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="p-6 border-b border-white/5 bg-[#08080A]/40 shrink-0">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-400 mb-2">
            <span>Progress</span>
            <span className="text-[#00F0FF]">{percentComplete}% ({completedLessonsCount}/{totalLessons})</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00F0FF] to-[#0072FF] transition-all duration-550"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Curriculum list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {modules.map((mod, modIdx) => (
            <div key={mod.id} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Module {modIdx + 1}: {mod.title}
              </h3>
              <div className="space-y-1">
                {mod.lessons.map((les) => {
                  const isActive = activeLesson?.id === les.id;
                  const isCompleted = completedLessonIds.has(les.id);

                  return (
                    <button
                      key={les.id}
                      onClick={() => handleLessonSelect(les)}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 text-xs transition-all ${
                        isActive
                          ? "bg-[#00F0FF]/10 text-white font-semibold border border-[#00F0FF]/30"
                          : "hover:bg-zinc-900 border border-transparent text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-450 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-650 shrink-0" />
                        )}
                        <span className="truncate">{les.title}</span>
                      </div>
                      {les.video_url && (
                        <PlayCircle className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#00F0FF]" : "text-zinc-600"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Player Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Player Header */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between shrink-0 bg-[#0A0A0C]/55 backdrop-blur-md relative z-30">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            {activeLesson && (
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase">
                {activeLesson.kind === "activity" ? "Lesson Activity" : "Study Material"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              disabled={!prevLesson}
              onClick={() => activeLesson && handleLessonSelect(prevLesson!)}
              className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-350 disabled:opacity-30 disabled:hover:bg-zinc-900 text-xs border border-white/5 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </Button>
            <Button
              disabled={!nextLesson}
              onClick={() => activeLesson && handleLessonSelect(nextLesson!)}
              className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-350 disabled:opacity-30 disabled:hover:bg-zinc-900 text-xs border border-white/5 flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </header>

        {/* Player Content Body */}
        {activeLesson ? (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Lesson Title & Completion Toggle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold font-display text-white">
                    {activeLesson.title}
                  </h1>
                </div>
                
                <Button
                  onClick={handleMarkComplete}
                  disabled={actionLoading}
                  className={`py-2 px-5 font-bold text-xs flex items-center gap-2 ${
                    completedLessonIds.has(activeLesson.id)
                      ? "bg-emerald-500/10 text-emerald-450 hover:bg-emerald-500/15 border border-emerald-500/25"
                      : "bg-[#00F0FF] text-black hover:bg-[#00D8FF] border-none shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                  }`}
                >
                  {actionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : completedLessonIds.has(activeLesson.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <span>Mark Complete</span>
                  )}
                </Button>
              </div>

              {/* Video Player Box */}
              {activeLesson.video_url && (
                <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black shadow-2xl relative">
                  <video
                    src={activeLesson.video_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Text Description Box */}
              <div className="bg-[#0A0A0C]/55 border border-white/5 p-8 rounded-3xl backdrop-blur-xl">
                {activeLesson.content_html ? (
                  <div
                    className="prose prose-invert max-w-none text-zinc-300 font-light leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: activeLesson.content_html }}
                  />
                ) : (
                  <p className="text-zinc-550 italic text-sm">No textbook or text reference uploaded for this lesson. Use worksheets.</p>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div>
              <BookOpen className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">Select a Lesson</h3>
              <p className="text-zinc-400 font-light text-sm">Select any curriculum syllabus item from the sidebar to launch.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
