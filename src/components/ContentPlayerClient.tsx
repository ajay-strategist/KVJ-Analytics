"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Loader2,
  PlayCircle,
  Award,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  Trophy,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { Button } from "./ui/Button";
import { supabase } from "@/lib/supabase";
import { TestTakingWidget } from "@/components/TestTakingWidget";
import { LessonIframe } from "./shared/LessonIframe";

interface Lesson {
  id: string;
  title: string;
  kind: "material" | "activity" | "assessment";
  max_score: number | null;
  video_url?: string | null;
  content_html?: string | null;
  moduleTitle?: string;
  moduleIdx?: number;
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
  /** Admin preview mode — verified server-side via the admin session cookie. Skips the
   *  login + enrollment gate so an admin can review the materials exactly as a student sees
   *  them, without paying or enrolling. Progress is never saved in this mode. */
  adminPreview?: boolean;
}

// ─── Viewer Controls Toggle Button ──────────────────────────────────────────

interface ViewerToggleProps {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

function ViewerToggle({ active, onClick, title, children }: ViewerToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 ${
        active
          ? "bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]"
          : "bg-zinc-100 border-zinc-200 text-zinc-650 hover:text-zinc-800 hover:bg-zinc-200/50"
      }`}
    >
      {children}
    </button>
  );
}

// ─── localStorage helpers ────────────────────────────────────────────────────

function lsGet(key: string): boolean | null {
  try {
    const v = localStorage.getItem(key);
    return v === null ? null : v === "1";
  } catch {
    return null;
  }
}

function lsSet(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // Private browsing or storage quota exceeded — silently ignore
  }
}

// Helper to strip "Module X:" or "MODULE X:" or "Module X -" or "MODULE X -" prefixes to avoid duplication in the curriculum list
function cleanModuleTitle(title: string, index: number): string {
  const prefixRegex = new RegExp(`^module\\s*${index + 1}\\s*[:\\-]?\\s*`, "i");
  return title.replace(prefixRegex, "").trim();
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ContentPlayerClient({ course, modules, adminPreview = false }: ContentPlayerClientProps) {
  const router = useRouter();

  const enrichedModules = React.useMemo(() => {
    return modules.map((mod: any, modIdx: number) => {
      const cleanTitle = cleanModuleTitle(mod.title, modIdx);
      const modDisplayTitle = `Module ${modIdx + 1}: ${cleanTitle}`;
      return {
        ...mod,
        title: cleanTitle,
        displayTitle: modDisplayTitle,
        lessons: (mod.lessons || []).map((l: any) => ({
          ...l,
          moduleTitle: modDisplayTitle,
          moduleIdx: modIdx + 1
        }))
      };
    });
  }, [modules]);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  // Score received from a kvjSubmit() call inside the lesson iframe.
  // Cleared whenever the active lesson changes.
  const [activityResult, setActivityResult] = useState<{ score: number; maxScore: number } | null>(null);

  // MCQ Assessment States
  const [activeTest, setActiveTest] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [highestAttempt, setHighestAttempt] = useState<any>(null);
  const [attemptsTrigger, setAttemptsTrigger] = useState(0);

  // Refs so the postMessage handler always sees the current lesson/user
  // without being re-created on every render (avoids stale-closure bugs).
  const activeLessonRef = useRef<Lesson | null>(null);
  const userRef = useRef<any>(null);
  const adminPreviewRef = useRef(adminPreview);
  const courseSlugRef = useRef(course.slug);
  // contentWindows of the currently-loaded lesson iframe(s), used to validate
  // event.source in the postMessage handler so we ignore rogue messages.
  const lessonFrameWindowsRef = useRef<Set<Window>>(new Set());

  // Viewer controls — hide-sidebar persisted in localStorage per course slug.
  // Dark mode is permanently OFF — player always uses the light theme.
  const darkMode = false;
  const [hideSidebar, setHideSidebarRaw] = useState<boolean>(false);
  // Track whether we've initialised from localStorage yet
  const [viewerReady, setViewerReady] = useState(false);

  // Key for localStorage (hide-sidebar only)
  const lsHideKey = `kvj-player-hide-${course.slug}`;

  // Initialise hide-sidebar toggle from localStorage on mount
  useEffect(() => {
    const storedHide = lsGet(lsHideKey);
    if (storedHide !== null) {
      setHideSidebarRaw(storedHide);
      setSidebarOpen(!storedHide);
    } else {
      setSidebarOpen(true);
    }
    setViewerReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.slug]);

  const setSidebarOpenWithSync = (open: boolean) => {
    setSidebarOpen(open);
    setHideSidebarRaw(!open);
    lsSet(lsHideKey, !open);
  };

  /**
   * Called by LessonIframe once per load — no-op now that dark mode is removed.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLightDetected = useCallback((_isLight: boolean) => {
    // Light theme is always active — nothing to do.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep refs in sync so the message handler is always up-to-date.
  useEffect(() => { activeLessonRef.current = activeLesson; }, [activeLesson]);
  useEffect(() => { userRef.current = user; }, [user]);

  // Clear the score banner AND the remembered iframe window when navigating lessons.
  useEffect(() => {
    setActivityResult(null);
    lessonFrameWindowsRef.current.clear(); // stale until the new iframe fires onLoad
  }, [activeLesson?.id]);

  // ── postMessage listener: receives kvjSubmit(score, maxScore) from the iframe ──
  useEffect(() => {
    /**
     * Submits an activity score to /api/activity-result and marks the lesson
     * complete in local state. Safe to call from the message handler because it
     * reads from refs, not closed-over state.
     */
    const submitScore = async (score: number, msgMaxScore: number) => {
      const lesson = activeLessonRef.current;
      const currentUser = userRef.current;
      if (!lesson) return;

      // Use the maxScore from the message; fall back to the lesson's stored
      // max_score if the activity sent 0 or omitted it.
      const effectiveMaxScore = msgMaxScore || lesson.max_score || msgMaxScore;

      // Always update the UI banner
      setActivityResult({ score, maxScore: effectiveMaxScore });

      // Admin preview: show the score but don't write to DB
      if (adminPreviewRef.current) return;

      if (!currentUser) return;

      try {
        const res = await fetch("/api/activity-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: lesson.id,
            score,
            maxScore: effectiveMaxScore,
            courseSlug: courseSlugRef.current,
          }),
        });
        if (!res.ok) {
          const d = await res.json();
          console.error("[KVJ] Activity submit failed:", d.error);
          return;
        }
        // Mark lesson complete in sidebar
        setCompletedLessonIds((prev) => new Set([...prev, lesson.id]));
      } catch (err) {
        console.error("[KVJ] Activity submit error:", err);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "KVJ_ACTIVITY_RESULT") return;
      // Security: only accept messages that originate from the active lesson
      // iframe. lessonFrameWindowRef is set by LessonIframe's onContentWindow
      // callback after each load. If it's null (e.g. first render not yet
      // loaded) we still accept the message — the type guard is sufficient
      // given sandbox="allow-scripts allow-same-origin".
      if (lessonFrameWindowsRef.current.size > 0 && !lessonFrameWindowsRef.current.has(event.source as Window)) {
        console.warn("[KVJ] Ignoring KVJ_ACTIVITY_RESULT from unexpected source.");
        return;
      }
      const score = Number(event.data.score);
      const maxScore = Number(event.data.maxScore);
      if (isNaN(score) || isNaN(maxScore)) {
        console.warn("[KVJ] Received invalid KVJ_ACTIVITY_RESULT payload:", event.data);
        return;
      }
      submitScore(score, maxScore);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  // Intentionally empty: handler uses refs so it only needs to be registered once.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load mock test when activeLesson changes and is an assessment
  useEffect(() => {
    if (activeLesson?.id && activeLesson.kind === "assessment") {
      const loadTestAndAttempts = async () => {
        // Do not reset activeTest if we are already displaying the test for this active lesson
        if (activeTest?.lesson_id !== activeLesson.id) {
          setLoadingTest(true);
          setActiveTest(null);
        }
        setAttemptsCount(0);
        setHighestAttempt(null);
        try {
          const { data: testData, error: testError } = await supabase
            .from("mock_tests")
            .select("*")
            .eq("lesson_id", activeLesson.id)
            .maybeSingle();

          if (testError) throw testError;
          if (testData) {
            setActiveTest(testData);

            if (!adminPreview && user?.id) {
              const { data: attempts, error: attemptsError } = await supabase
                .from("test_attempts")
                .select("*")
                .eq("test_id", testData.id)
                .eq("user_id", user.id);

              if (attemptsError) throw attemptsError;
              if (attempts) {
                setAttemptsCount(attempts.length);
                if (attempts.length > 0) {
                  const sorted = [...attempts].sort((a, b) => b.score - a.score);
                  setHighestAttempt(sorted[0]);
                }
              }
            }
          }
        } catch (err) {
          console.error("Failed to load active test and attempts:", err);
        } finally {
          setLoadingTest(false);
        }
      };
      loadTestAndAttempts();
    } else {
      setActiveTest(null);
      setAttemptsCount(0);
      setHighestAttempt(null);
    }
  }, [activeLesson?.id, activeLesson?.kind, user?.id, adminPreview, attemptsTrigger]);

  // Flatten lessons for easy next/prev indexing
  const allLessons: any[] = enrichedModules.flatMap((mod: any) => mod.lessons);

  useEffect(() => {
    const initPlayer = async () => {
      // Admin preview: access was already verified server-side via the admin session cookie,
      // so skip the student login + enrollment gate. No progress is saved in this mode.
      if (adminPreview) {
        if (allLessons.length > 0) setActiveLesson(allLessons[0]);
        setLoading(false);
        return;
      }

      // 1. Get user session & sync cookie for API routes
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push(`/signin?redirect=/training/${course.slug}/learn`);
        return;
      }
      setUser(session.user);

      if (session.access_token) {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        const secureFlag = isSecure ? "; Secure" : "";
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in || 3600}; SameSite=Lax${secureFlag}`;
      }

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
        .select("lesson_id, passed")
        .eq("user_id", session.user.id)
        .eq("course_slug", course.slug);

      if (results) {
        setCompletedLessonIds(
          new Set(
            results
              .filter((r: any) => r.passed !== false)
              .map((r: any) => r.lesson_id)
          )
        );
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
          <Loader2 className="w-8 h-8 animate-spin text-[#10B981] mx-auto" />
          <p className="text-zinc-500 text-sm font-light">Loading training portal...</p>
        </div>
      </div>
    );
  }

  const activeIndex = activeLesson ? allLessons.findIndex((l: any) => l.id === activeLesson.id) : -1;
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson = activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;

  const handleLessonSelect = (lesson: Lesson) => {
    setIsAssessmentActive(false);
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
    <div className="w-full h-screen flex flex-col overflow-hidden">
      {/* Admin preview banner */}
      {adminPreview && (
        <div className="w-full shrink-0 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-center text-[12px] font-bold text-black border-b border-amber-600 relative z-50 shadow-sm">
          <Award className="h-3.5 w-3.5 shrink-0" />
          <span>ADMIN PREVIEW — this is exactly what enrolled students see. Progress isn&apos;t saved.</span>
        </div>
      )}

      <div className={`w-full flex-1 flex relative overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-[#050505] text-zinc-200" : "bg-[#F8FAFC] text-zinc-800"
      }`}>

        {/* 1. Collapsible Sidebar */}
        <div
          className={`fixed ${adminPreview ? "top-[33px]" : "top-0"} bottom-0 left-0 z-40 w-[320px] flex flex-col transition-all duration-300 transform ${
            isAssessmentActive
              ? "-translate-x-full lg:-ml-[320px] lg:hidden"
              : sidebarOpen
                ? "translate-x-0 lg:relative lg:translate-x-0"
                : "-translate-x-full lg:-ml-[320px]"
          } ${
            darkMode 
              ? "bg-[#070E0B] border-r border-white/5" 
              : "bg-white border-r border-slate-200/60 shadow-[1px_0_10px_rgba(0,0,0,0.01)]"
          }`}
        >
        {/* Sidebar Header */}
        <div className={`p-6 border-b flex items-center justify-between ${darkMode ? "border-white/5" : "border-slate-200/60"}`}>
          <div>
            <Link 
              href={`/training/${course.slug}`} 
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors group ${
                darkMode ? "text-zinc-500 hover:text-[#10B981]" : "text-zinc-400 hover:text-[#10B981]"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to detail
            </Link>
            <h2 className={`text-base font-extrabold font-display mt-2 line-clamp-1 tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              {course.title}
            </h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              darkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-500 hover:bg-slate-100"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker */}
        <div className={`p-6 border-b shrink-0 ${darkMode ? "border-white/5 bg-[#080E0B]/30" : "border-slate-105 bg-white"}`}>
          <div className={`p-4 rounded-2xl border ${
            darkMode ? "bg-black/10 border-white/5" : "bg-[#F4F9FD]/40 border-slate-200/50 shadow-[0_4px_15px_rgba(16,35,63,0.01)]"
          }`}>
            <div className={`flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider mb-2.5 ${
              darkMode ? "text-zinc-400" : "text-[#7B8A99]"
            }`}>
              <span>Course Progress</span>
              <span className="text-[#08A88A] font-mono font-bold">{percentComplete}% ({completedLessonsCount}/{totalLessons})</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? "bg-zinc-800" : "bg-[#DCE5E8]"}`}>
              <div
                className="h-full bg-gradient-to-r from-[#08A88A] to-[#0E7490] rounded-full transition-all duration-550 shadow-[0_0_8px_rgba(8,168,138,0.2)]"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>
        </div>

        {/* Curriculum list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {enrichedModules.map((mod: any, modIdx: number) => (
            <div key={mod.id} className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono border ${
                  darkMode 
                    ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30" 
                    : "bg-[#F0FBF7] text-[#08A88A] border-[#DDF8F0]"
                }`}>
                  Mod {modIdx + 1}
                </span>
                <h3 className={`text-[10px] font-extrabold uppercase tracking-wider truncate font-sans ${
                  darkMode ? "text-zinc-500" : "text-[#10233F]"
                }`}>
                  {mod.title}
                </h3>
              </div>
              <div className="space-y-2">
                {mod.lessons.map((les: any) => {
                  const isActive = activeLesson?.id === les.id;
                  const isCompleted = completedLessonIds.has(les.id);

                  return (
                    <button
                      key={les.id}
                      onClick={() => handleLessonSelect(les)}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 text-xs transition-all duration-200 border transform hover:translate-x-0.5 group ${
                        isActive
                          ? darkMode
                            ? "bg-[#10B981]/10 text-white font-bold border-[#10B981]/30 shadow-[0_2px_8px_rgba(16,185,129,0.05)]"
                            : "bg-white text-[#10233F] font-bold border-[#08A88A]/60 shadow-[0_4px_12px_rgba(8,168,138,0.08)] scale-[1.01]"
                          : darkMode
                            ? "hover:bg-[#111814] border-transparent text-zinc-400 hover:text-zinc-200"
                            : "hover:bg-[#F4F9FD] border-transparent text-[#526477] hover:text-[#10233F]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#08A88A] shrink-0" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "border-[#08A88A]"
                              : darkMode
                                ? "border-zinc-700 group-hover:border-zinc-650"
                                : "border-[#DCE5E8] group-hover:border-[#08A88A]/40"
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full transition-transform ${
                              isActive
                                ? "bg-[#08A88A] scale-100"
                                : "bg-transparent scale-0"
                            }`} />
                          </div>
                        )}
                        <span className={`truncate tracking-tight font-sans ${isActive ? "font-bold text-[#10233F]" : "font-semibold text-[#526477] group-hover:text-[#10233F]"}`}>
                          {les.title}
                        </span>
                      </div>
                      {les.video_url && (
                        <PlayCircle className={`w-3.5 h-3.5 shrink-0 ${
                          isActive 
                            ? "text-[#08A88A]" 
                            : darkMode 
                              ? "text-zinc-600 group-hover:text-zinc-400" 
                              : "text-[#7B8A99] group-hover:text-[#08A88A]"
                        }`} />
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
        <header className={`h-16 border-b px-4 md:px-6 flex items-center justify-between shrink-0 backdrop-blur-md relative z-30 transition-colors duration-300 ${
          darkMode ? "border-white/5 bg-[#0A0A0C]/55" : "border-line bg-white/75"
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpenWithSync(true)}
                className={`p-2 rounded-lg border shrink-0 transition-colors ${darkMode ? "bg-zinc-900 border-white/5 text-zinc-400 hover:text-white" : "bg-white border-zinc-200 text-zinc-650 hover:text-zinc-800"}`}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            {activeLesson && (
              <span className={`text-xs font-mono font-bold uppercase truncate ${darkMode ? "text-zinc-500" : "text-slate/60"}`}>
                {activeLesson.kind === "activity" ? "Lesson Activity" : "Study Material"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">

            {/* ── Viewer controls (only shown when lesson has HTML content) ── */}
            {activeLesson?.content_html && viewerReady && (
              <>
                {/* Hide embedded sidebar toggle */}
                <ViewerToggle
                  active={!sidebarOpen}
                  onClick={() => setSidebarOpenWithSync(!sidebarOpen)}
                  title={!sidebarOpen ? "Show navigation sidebar" : "Hide navigation sidebar"}
                >
                  {!sidebarOpen
                    ? <PanelLeftOpen className="w-3.5 h-3.5" />
                    : <PanelLeftClose className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline text-[10px] font-semibold leading-none">
                    {!sidebarOpen ? "Show Nav" : "Hide Nav"}
                  </span>
                </ViewerToggle>

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
                  onClick={() => activeLesson && handleLessonSelect(prevLesson!)}
                  className={`py-1.5 px-3 text-xs border flex items-center gap-1 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    darkMode
                      ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-350 border-white/5"
                      : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                {nextLesson ? (
                  <button
                    type="button"
                    onClick={() => activeLesson && handleLessonSelect(nextLesson!)}
                    className={`py-1.5 px-3 text-xs border flex items-center gap-1 rounded-lg transition-all ${
                      darkMode
                        ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-350 border-white/5"
                        : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
                    }`}
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push(`/training/${course.slug}`)}
                    className={`py-1.5 px-3 text-xs border flex items-center gap-1 rounded-lg transition-all ${
                      darkMode
                        ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/30"
                        : "bg-emerald-50 hover:bg-emerald-100 text-brand border-brand/20"
                    }`}
                  >
                    Finish <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Player Content Body */}
        {activeLesson ? (
          isAssessmentActive && activeTest ? (
            <div className="flex-1 overflow-y-auto p-0 relative bg-[#F8FAFC]">
              <TestTakingWidget
                testId={activeTest.id}
                courseSlug={course.slug}
                adminPreview={adminPreview}
                darkMode={darkMode}
                onStart={() => setIsAssessmentActive(true)}
                onExit={() => setIsAssessmentActive(false)}
                onComplete={async (score, maxScore, passed) => {
                  setAttemptsTrigger((prev) => prev + 1);
                  try {
                    const res = await fetch("/api/activity-result", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        lessonId: activeLesson.id,
                        score,
                        maxScore,
                        courseSlug: course.slug,
                        passed,
                      }),
                    });
                    if (res.ok && passed) {
                      setCompletedLessonIds((prev) => new Set([...prev, activeLesson.id]));
                    }
                  } catch (err) {
                    console.error("Failed to save activity result:", err);
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
              <div className="max-w-4xl mx-auto space-y-8">

              {/* Lesson Title & Completion Toggle */}
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${darkMode ? "border-white/5" : "border-line"}`}>
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold font-display tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {activeLesson.moduleTitle || activeLesson.title}
                  </h1>
                </div>

                {activeLesson.kind === "assessment" ? (
                  completedLessonIds.has(activeLesson.id) ? (
                    <span className={`py-2 px-5 font-bold text-xs flex items-center gap-2 border rounded-lg ${
                      darkMode
                        ? "bg-emerald-500/10 text-emerald-450 border-emerald-500/25"
                        : "bg-emerald-50 text-brand border-brand/20"
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Passed / Completed</span>
                    </span>
                  ) : (
                    <span className={`py-2 px-5 font-bold text-xs flex items-center gap-2 border rounded-lg ${
                      darkMode
                        ? "bg-zinc-500/10 text-zinc-400 border-zinc-700"
                        : "bg-zinc-150/60 text-zinc-650 border-zinc-250/80"
                    }`}>
                      <span>Must Pass to Complete</span>
                    </span>
                  )
                ) : (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={actionLoading}
                    className={`py-2 px-5 font-bold text-xs flex items-center gap-2 border ${
                      completedLessonIds.has(activeLesson.id)
                        ? darkMode
                          ? "bg-emerald-500/10 text-emerald-450 hover:bg-emerald-500/15 border-emerald-500/25"
                          : "bg-emerald-50 text-brand hover:bg-emerald-100/80 border-brand/20"
                        : "bg-[#10B981] text-black hover:bg-[#00D8FF] border-none shadow-[0_0_15px_rgba(16,185,129,0.1)]"
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
                )}
              </div>

              {/* Video Player Box */}
              {activeLesson.video_url && (
                <div className={`w-full aspect-video rounded-3xl overflow-hidden border bg-black shadow-2xl relative ${darkMode ? "border-white/5" : "border-zinc-200"}`}>
                  <video
                    src={activeLesson.video_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* ── Activity score banner ────────────────────────────────────
                  Shown when the lesson iframe calls kvjSubmit(score, maxScore).
                  Dismissed by clicking ×. In admin preview the score is shown
                  but not persisted. */}
              {activityResult && (
                <div className={`flex items-center justify-between gap-4 border rounded-2xl px-5 py-4 ${
                  darkMode 
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                    : "bg-emerald-50 border-brand/20 text-brand"
                }`}>
                  <div className="flex items-center gap-3">
                    <Trophy className={`w-5 h-5 shrink-0 ${darkMode ? "text-emerald-400" : "text-[#059669]"}`} />
                    <div>
                      <p className={`text-sm font-bold ${darkMode ? "text-emerald-300" : "text-[#059669]"}`}>
                        Activity complete!
                        {adminPreview && (
                          <span className="ml-2 text-[10px] font-normal opacity-70">(admin preview — not saved)</span>
                        )}
                      </p>
                      <p className={`text-xs font-mono mt-0.5 ${darkMode ? "text-emerald-400/80" : "text-brand/80"}`}>
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
                    onClick={() => setActivityResult(null)}
                    className={`shrink-0 transition-colors ${darkMode ? "text-emerald-500/60 hover:text-emerald-300" : "text-brand/60 hover:text-brand"}`}
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
                  <div className={`text-center py-12 rounded-3xl p-8 border ${darkMode ? "bg-[#0A0A0C]/55 border-white/5" : "bg-white border-line shadow-soft"}`}>
                    <HelpCircle className="w-12 h-12 text-zinc-550 mx-auto mb-3" />
                    <p className={`text-sm font-semibold ${darkMode ? "text-zinc-400" : "text-ink"}`}>Assessment Under Construction</p>
                    <p className={`text-xs mt-1 ${darkMode ? "text-zinc-500" : "text-slate"}`}>This module assessment has not been configured yet.</p>
                  </div>
                ) : activeTest.attempts_allowed > 0 && attemptsCount >= activeTest.attempts_allowed ? (
                  <div className={`text-center py-12 rounded-3xl p-8 space-y-4 border ${darkMode ? "bg-[#0A0A0C]/55 border-white/5" : "bg-white border-line shadow-soft"}`}>
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
                    <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-ink"}`}>Attempt Limit Reached</h3>
                    <p className={`text-xs leading-relaxed max-w-md mx-auto ${darkMode ? "text-zinc-400" : "text-slate"}`}>
                      You have used all {activeTest.attempts_allowed} of your allowed attempts for this module assessment.
                    </p>
                    {highestAttempt && (
                      <div className={`border p-4 rounded-xl max-w-xs mx-auto text-xs ${
                        darkMode 
                          ? "bg-[#111114] border-white/5 text-zinc-400" 
                          : "bg-zinc-50 border-zinc-200 text-zinc-650"
                      }`}>
                        <span className="block uppercase tracking-wider font-bold text-[9px] mb-1 opacity-70">Your Best Score</span>
                        <span className={`text-sm font-bold block ${darkMode ? "text-white" : "text-ink"}`}>
                          {highestAttempt.score} / {highestAttempt.max_score} Marks ({highestAttempt.max_score > 0 ? Math.round((highestAttempt.score / highestAttempt.max_score) * 100) : 0}%)
                        </span>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                          highestAttempt.passed ? "bg-emerald-500/10 text-emerald-450" : "bg-red-500/10 text-red-450"
                        }`}>
                          {highestAttempt.passed ? "PASSED" : "FAILED"}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`border rounded-3xl overflow-hidden ${darkMode ? "bg-[#0A0A0C]/55 border-white/5" : "bg-white border-line shadow-soft"}`}>
                    <TestTakingWidget
                      testId={activeTest.id}
                      courseSlug={course.slug}
                      adminPreview={adminPreview}
                      darkMode={darkMode}
                      isInline={activeTest.is_inline}
                      showAnswers={activeTest.is_inline ? true : false}
                      onStart={() => {
                        if (!activeTest.is_inline) {
                          setIsAssessmentActive(true);
                        }
                      }}
                      onExit={() => {
                        if (!activeTest.is_inline) {
                          setIsAssessmentActive(false);
                        }
                      }}
                      onComplete={async (score, maxScore, passed) => {
                        setAttemptsTrigger((prev) => prev + 1);
                        if (!adminPreview) {
                          try {
                            const res = await fetch("/api/activity-result", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                lessonId: activeLesson.id,
                                score,
                                maxScore,
                                courseSlug: course.slug,
                                passed,
                              }),
                            });
                            if (res.ok && passed) {
                              setCompletedLessonIds((prev) => new Set([...prev, activeLesson.id]));
                            }
                          } catch (err) {
                            console.error("Failed to save activity result:", err);
                          }
                        }
                      }}
                    />
                  </div>
                )
              ) : (
                <div className={`border rounded-3xl overflow-hidden ${darkMode ? "bg-[#0A0A0C]/55 border-white/5" : "bg-white border-line shadow-soft"}`}>
                  {activeLesson.content_html ? (
                    <div className="divide-y divide-line dark:divide-white/5">
                      {activeLesson.content_html.split(/(<div class="kvj-assessment-placeholder[^>]*><\/div>)/g).map((segment, idx) => {
                        const match = segment.match(/data-test-id="([^"]*)"/);
                        if (match) {
                          const testId = match[1];
                          const showAnswersMatch = segment.match(/data-show-answers="([^"]*)"/);
                          const showAnswers = showAnswersMatch ? showAnswersMatch[1] === "true" : false;
                          const isInlineMatch = segment.match(/data-is-inline="([^"]*)"/);
                          const isInlineBlock = isInlineMatch ? isInlineMatch[1] === "true" : false;
                          return (
                            <div key={idx} className="p-6 md:p-10 bg-slate-50/30 dark:bg-slate-900/20">
                              <TestTakingWidget
                                testId={testId}
                                courseSlug={course.slug}
                                adminPreview={adminPreview}
                                darkMode={darkMode}
                                isInline={isInlineBlock}
                                showAnswers={showAnswers}
                                onStart={() => {}}
                                onExit={() => {}}
                                onComplete={async (score, maxScore, passed) => {
                                  console.log(`Embedded test ${testId} completed: ${score}/${maxScore}`);
                                }}
                              />
                            </div>
                          );
                        }

                        if (!segment.trim() || segment === " ") return null;

                        return (
                          <div key={idx} className="p-1">
                            <LessonIframe
                              html={segment}
                              darkMode={viewerReady ? darkMode : false}
                              hideSidebar={viewerReady ? hideSidebar : false}
                              onLightDetected={handleLightDetected}
                              onContentWindow={(win) => { if (win) lessonFrameWindowsRef.current.add(win); }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className={`italic text-sm p-8 ${darkMode ? "text-zinc-550" : "text-zinc-400"}`}>No textbook or text reference uploaded for this lesson. Use worksheets.</p>
                  )}
                </div>
              )}

              {/* Bottom Navigation */}
              {!isAssessmentActive && (
                <div className={`flex items-center justify-between border-t pt-6 mt-12 ${darkMode ? "border-white/5" : "border-line"}`}>
                  <button
                    type="button"
                    disabled={!prevLesson}
                    onClick={() => activeLesson && handleLessonSelect(prevLesson!)}
                    className={`py-2 px-5 text-sm border flex items-center gap-1.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      darkMode
                        ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-350 border-white/5"
                        : "bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev Lesson
                  </button>

                  <span className={`text-sm font-mono ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    {activeIndex + 1} of {totalLessons}
                  </span>

                  {nextLesson ? (
                    <button
                      type="button"
                      onClick={() => activeLesson && handleLessonSelect(nextLesson!)}
                      className="py-2 px-5 bg-[#10B981] hover:bg-[#0D9488] text-white text-sm font-semibold flex items-center gap-1.5 rounded-xl border-none transition-all shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                    >
                      Next Lesson <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push(`/training/${course.slug}`)}
                      className="py-2 px-5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center gap-1.5 rounded-xl border-none transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
                    >
                      Finish Course <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        )
      ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div>
              <BookOpen className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
              <h3 className={`text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-ink"}`}>Select a Lesson</h3>
              <p className={`font-light text-sm ${darkMode ? "text-zinc-400" : "text-slate"}`}>Select any curriculum syllabus item from the sidebar to launch.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
  );
}
