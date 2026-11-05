"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchWithStudentAuth, getValidStudentSession, syncStudentSessionCookie } from "@/lib/studentAuth";
import {
  Lesson,
  Module,
  EnrichedModule,
  ContentPlayerClientProps,
  ActivityResult,
} from "./player/types";
import { PlayerSidebar } from "./player/PlayerSidebar";
import { PlayerHeader } from "./player/PlayerHeader";
import { LessonViewer } from "./player/LessonViewer";

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

export function ContentPlayerClient({
  course,
  modules,
  adminPreview = false,
  initialLessonId = null,
}: ContentPlayerClientProps) {
  const router = useRouter();

  const enrichedModules: EnrichedModule[] = React.useMemo(() => {
    return modules.map((mod: Module, modIdx: number) => {
      const cleanTitle = cleanModuleTitle(mod.title, modIdx);
      const modDisplayTitle = `Module ${modIdx + 1}: ${cleanTitle}`;
      return {
        ...mod,
        title: cleanTitle,
        displayTitle: modDisplayTitle,
        lessons: (mod.lessons || []).map((l: Lesson) => ({
          ...l,
          moduleTitle: modDisplayTitle,
          moduleIdx: modIdx + 1,
        })),
      };
    });
  }, [modules]);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  const [expandedModuleIds, setExpandedModuleIds] = useState<Set<string>>(new Set());
  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-expand module and scroll into view on activeLesson change
  useEffect(() => {
    if (activeLesson?.id) {
      const parentMod = modules.find((m) =>
        m.lessons.some((l) => l.id === activeLesson.id)
      );
      if (parentMod) {
        setExpandedModuleIds(new Set([parentMod.id]));
      }
      const timer = setTimeout(() => {
        const el = document.getElementById(`lesson-nav-${activeLesson.id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeLesson?.id, modules]);

  // Reset main content scroll position to the very top on active lesson change
  useEffect(() => {
    if (activeLesson?.id) {
      if (mainScrollRef.current) {
        mainScrollRef.current.scrollTop = 0;
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    }
  }, [activeLesson?.id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModuleIds((prev) => {
      const next = new Set<string>();
      if (!prev.has(moduleId)) {
        next.add(moduleId);
      }
      return next;
    });
  };

  // Score received from a kvjSubmit() call inside the lesson iframe.
  const [activityResult, setActivityResult] = useState<ActivityResult | null>(null);

  // MCQ Assessment States
  const [activeTest, setActiveTest] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
  const [highestAttempt, setHighestAttempt] = useState<any>(null);
  const [attemptsTrigger, setAttemptsTrigger] = useState(0);

  // On-demand lesson content loading state & client cache
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [loadingLessonContent, setLoadingLessonContent] = useState<boolean>(false);
  const [lessonFetchRetry, setLessonFetchRetry] = useState<number>(0);
  const lessonContentCache = useRef<Map<string, string>>(new Map());
  const submittedScoresRef = useRef<Map<string, number>>(new Map());

  // Refs so the postMessage handler always sees the current lesson/user without closure drift
  const activeLessonRef = useRef<Lesson | null>(null);
  const userRef = useRef<any>(null);
  const adminPreviewRef = useRef(adminPreview);
  const courseSlugRef = useRef(course.slug);
  const lessonFrameWindowsRef = useRef<Set<Window>>(new Set());

  // Fetch full lesson content on-demand when active lesson changes
  useEffect(() => {
    if (!activeLesson?.id) {
      setLessonContent(null);
      setLoadingLessonContent(false);
      return;
    }

    if (activeLesson.kind === "assessment") {
      setLessonContent(null);
      setLoadingLessonContent(false);
      return;
    }

    if (activeLesson.content_html) {
      setLessonContent(activeLesson.content_html);
      setLoadingLessonContent(false);
      return;
    }

    if (lessonContentCache.current.has(activeLesson.id)) {
      setLessonContent(lessonContentCache.current.get(activeLesson.id) || "");
      setLoadingLessonContent(false);
      return;
    }

    let isMounted = true;
    setLoadingLessonContent(true);
    setLessonContent(null);

    const lessonUrl = `/api/lessons/${activeLesson.id}?courseSlug=${course.slug}${
      adminPreview ? "&preview=1" : ""
    }`;

    (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s circuit breaker timeout

        const res = await fetchWithStudentAuth(lessonUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          const html = data.content_html || "";
          lessonContentCache.current.set(activeLesson.id, html);
          if (isMounted) setLessonContent(html);
          return;
        }

        if (isMounted) setLessonContent("");
      } catch (err: any) {
        if (!isMounted) return;
        console.warn(
          "[ContentPlayer] Lesson fetch error:",
          err?.name === "AbortError" ? "Request timed out" : err
        );
        setLessonContent("");
      }
    })().finally(() => {
      if (isMounted) setLoadingLessonContent(false);
    });

    return () => {
      isMounted = false;
    };
  }, [
    activeLesson?.id,
    activeLesson?.kind,
    activeLesson?.content_html,
    course.slug,
    adminPreview,
    lessonFetchRetry,
  ]);

  const [viewerReady, setViewerReady] = useState(false);
  const lsHideKey = `kvj-player-hide-${course.slug}`;

  // Initialise hide-sidebar toggle from localStorage on mount
  useEffect(() => {
    const storedHide = lsGet(lsHideKey);
    if (storedHide !== null) {
      setSidebarOpen(!storedHide);
    } else {
      setSidebarOpen(true);
    }
    setViewerReady(true);
  }, [course.slug, lsHideKey]);

  const toggleSidebarWithSync = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      lsSet(lsHideKey, !next);
      [0, 50, 150, 300].forEach((delay) => {
        setTimeout(() => {
          if (typeof window !== "undefined") window.dispatchEvent(new Event("resize"));
        }, delay);
      });
      return next;
    });
  };

  useEffect(() => {
    activeLessonRef.current = activeLesson;
  }, [activeLesson]);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Clear score banner & remembered iframe window when navigating lessons
  useEffect(() => {
    setActivityResult(null);
    lessonFrameWindowsRef.current.clear();
  }, [activeLesson?.id]);

  // postMessage listener: receives kvjSubmit(score, maxScore) from the iframe
  useEffect(() => {
    const submitScore = async (score: number, msgMaxScore: number) => {
      const lesson = activeLessonRef.current;
      const currentUser = userRef.current;
      if (!lesson) return;

      const effectiveMaxScore = msgMaxScore || lesson.max_score || msgMaxScore;
      setActivityResult({ score, maxScore: effectiveMaxScore });

      if (adminPreviewRef.current || !currentUser) return;

      if (submittedScoresRef.current.get(lesson.id) === score) {
        return;
      }

      try {
        const res = await fetchWithStudentAuth("/api/activity-result", {
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
        submittedScoresRef.current.set(lesson.id, score);
        setCompletedLessonIds((prev) => new Set([...prev, lesson.id]));
      } catch (err) {
        console.error("[KVJ] Activity submit error:", err);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "KVJ_ACTIVITY_RESULT") return;
      if (
        lessonFrameWindowsRef.current.size > 0 &&
        !lessonFrameWindowsRef.current.has(event.source as Window)
      ) {
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
  }, []);

  // Load mock test when activeLesson changes and is an assessment
  useEffect(() => {
    if (activeLesson?.id && activeLesson.kind === "assessment") {
      const loadTestAndAttempts = async () => {
        if (activeTest?.lesson_id !== activeLesson.id) {
          setLoadingTest(true);
          setActiveTest(null);
        }
        setAttemptsCount(0);
        setHighestAttempt(null);
        try {
          const { data: testsData, error: testError } = await supabase
            .from("mock_tests")
            .select("*")
            .eq("lesson_id", activeLesson.id)
            .order("created_at", { ascending: false });

          if (testError) {
            console.warn("Failed loading test:", testError);
          }
          const testData = testsData?.[0];
          if (testData) {
            setActiveTest(testData);

            if (!adminPreview && user?.id) {
              try {
                const { data: attempts } = await supabase
                  .from("test_attempts")
                  .select("*")
                  .eq("test_id", testData.id)
                  .eq("user_id", user.id);

                if (attempts) {
                  setAttemptsCount(attempts.length);
                  if (attempts.length > 0) {
                    const sorted = [...attempts].sort((a, b) => b.score - a.score);
                    setHighestAttempt(sorted[0]);
                  }
                }
              } catch (attErr) {
                console.warn("Non-fatal: failed to load previous attempts:", attErr);
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

  const allLessons: Lesson[] = enrichedModules.flatMap((mod) => mod.lessons);

  useEffect(() => {
    const initPlayer = async () => {
      let targetLessonId = initialLessonId;
      if (!targetLessonId && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        targetLessonId = urlParams.get("lesson");
      }

      if (adminPreview) {
        let initialLesson = targetLessonId
          ? allLessons.find((l) => l.id === targetLessonId)
          : null;
        if (!initialLesson && allLessons.length > 0) {
          initialLesson = allLessons[0];
        }
        if (initialLesson) setActiveLesson(initialLesson);
        setLoading(false);
        return;
      }

      const session = await getValidStudentSession();
      if (!session?.user) {
        router.push(`/signin?redirect=/training/${course.slug}/learn`);
        return;
      }
      setUser(session.user);
      syncStudentSessionCookie(session);

      const [enrollmentRes, resultsRes] = await Promise.all([
        supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("course_slug", course.slug)
          .eq("status", "active")
          .maybeSingle(),
        supabase
          .from("activity_results")
          .select("lesson_id, passed")
          .eq("user_id", session.user.id)
          .eq("course_slug", course.slug),
      ]);

      if (!enrollmentRes.data) {
        alert("Access denied. You must enroll in the course to access the content player.");
        router.push(`/training/${course.slug}`);
        return;
      }

      const completedSet = new Set<string>(
        resultsRes.data ? resultsRes.data.map((r: { lesson_id: string }) => r.lesson_id) : []
      );
      setCompletedLessonIds(completedSet);

      let chosenLesson: Lesson | null = null;
      if (targetLessonId) {
        chosenLesson = allLessons.find((l) => l.id === targetLessonId) || null;
      }

      if (!chosenLesson && typeof window !== "undefined") {
        const lastSavedId = localStorage.getItem(
          `kvj_last_lesson_${course.slug}_${session.user.id}`
        );
        if (lastSavedId) {
          chosenLesson = allLessons.find((l) => l.id === lastSavedId) || null;
        }
      }

      if (!chosenLesson && allLessons.length > 0) {
        chosenLesson = allLessons.find((l) => !completedSet.has(l.id)) || null;
      }

      if (!chosenLesson && allLessons.length > 0) {
        chosenLesson = allLessons[0];
      }

      if (chosenLesson) {
        setActiveLesson(chosenLesson);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              `kvj_last_lesson_${course.slug}_${session.user.id}`,
              chosenLesson.id
            );
            const url = new URL(window.location.href);
            if (url.searchParams.get("lesson") !== chosenLesson.id) {
              url.searchParams.set("lesson", chosenLesson.id);
              window.history.replaceState(null, "", url.toString());
            }
          } catch {}
        }
      }

      setLoading(false);
    };

    initPlayer();
  }, [course.slug, initialLessonId]);

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

  const activeIndex = activeLesson
    ? allLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson =
    activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;

  const handleLessonSelect = (lesson: Lesson) => {
    setIsAssessmentActive(false);
    setActiveLesson(lesson);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    const parentMod = modules.find((m) =>
      (m.lessons || []).some((l) => l.id === lesson.id)
    );
    if (parentMod) {
      setExpandedModuleIds(new Set([parentMod.id]));
    }
    if (typeof window !== "undefined") {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (user?.id) {
          localStorage.setItem(`kvj_last_lesson_${course.slug}_${user.id}`, lesson.id);
        }
        const url = new URL(window.location.href);
        if (url.searchParams.get("lesson") !== lesson.id) {
          url.searchParams.set("lesson", lesson.id);
          window.history.replaceState(null, "", url.toString());
        }
      } catch {}
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleMarkCompleteAndNext = () => {
    if (!activeLesson) return;

    const currentLessonId = activeLesson.id;
    const isCurrentlyCompleted = completedLessonIds.has(currentLessonId);

    if (nextLesson) {
      handleLessonSelect(nextLesson);
    } else {
      router.push(`/training/${course.slug}`);
    }

    if (!isCurrentlyCompleted) {
      setCompletedLessonIds((prev) => new Set([...prev, currentLessonId]));

      if (!adminPreview && user) {
        fetchWithStudentAuth("/api/activity-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: currentLessonId,
            score: 100,
            maxScore: 100,
            courseSlug: course.slug,
          }),
        }).catch((err) => {
          console.error("[KVJ] Background mark complete error:", err);
        });
      }
    }
  };

  const totalLessons = allLessons.length;
  const completedLessonsCount = completedLessonIds.size;
  const percentComplete =
    totalLessons > 0
      ? Math.round((completedLessonsCount / totalLessons) * 100)
      : 0;

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="w-full flex-1 flex relative overflow-hidden transition-colors duration-300 bg-[#F8FAFC] text-zinc-800">
        {/* 1. Collapsible Sidebar */}
        <PlayerSidebar
          course={course}
          enrichedModules={enrichedModules}
          sidebarOpen={sidebarOpen}
          isAssessmentActive={isAssessmentActive}
          expandedModuleIds={expandedModuleIds}
          activeLesson={activeLesson}
          completedLessonIds={completedLessonIds}
          totalLessons={totalLessons}
          completedLessonsCount={completedLessonsCount}
          percentComplete={percentComplete}
          onSelectLesson={handleLessonSelect}
          onToggleModule={toggleModule}
          onCloseSidebar={() => setSidebarOpen(false)}
        />

        {/* 2. Main Player Column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <PlayerHeader
            sidebarOpen={sidebarOpen}
            activeLesson={activeLesson}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            isAssessmentActive={isAssessmentActive}
            hasHtmlContent={Boolean(lessonContent || activeLesson?.content_html)}
            viewerReady={viewerReady}
            completedLessonIds={completedLessonIds}
            onToggleSidebar={toggleSidebarWithSync}
            onSelectLesson={handleLessonSelect}
            onMarkCompleteAndNext={handleMarkCompleteAndNext}
          />

          {/* 3. Player Content Body */}
          {activeLesson ? (
            <LessonViewer
              course={course}
              activeLesson={activeLesson}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              isAssessmentActive={isAssessmentActive}
              sidebarOpen={sidebarOpen}
              completedLessonIds={completedLessonIds}
              activityResult={activityResult}
              adminPreview={adminPreview}
              activeTest={activeTest}
              loadingTest={loadingTest}
              attemptsCount={attemptsCount}
              highestAttempt={highestAttempt}
              loadingLessonContent={loadingLessonContent}
              lessonContent={lessonContent}
              mainScrollRef={mainScrollRef}
              totalLessons={totalLessons}
              activeIndex={activeIndex}
              viewerReady={viewerReady}
              onDismissActivityResult={() => setActivityResult(null)}
              onRetryLessonFetch={() => {
                lessonContentCache.current.delete(activeLesson.id);
                setLessonContent(null);
                setLessonFetchRetry((n) => n + 1);
              }}
              onStartAssessment={() => setIsAssessmentActive(true)}
              onExitAssessment={() => setIsAssessmentActive(false)}
              onCompleteAssessment={async (score, maxScore, passed) => {
                setAttemptsTrigger((prev) => prev + 1);
                if (!adminPreview) {
                  try {
                    const res = await fetchWithStudentAuth("/api/activity-result", {
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
                    if (res.ok) {
                      setCompletedLessonIds((prev) => new Set([...prev, activeLesson.id]));
                    }
                  } catch (err) {
                    console.error("Failed to save activity result:", err);
                  }
                }
              }}
              onSelectLesson={handleLessonSelect}
              onMarkCompleteAndNext={handleMarkCompleteAndNext}
              onIframeContentWindow={(win) => {
                if (win) lessonFrameWindowsRef.current.add(win);
              }}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div>
                <BookOpen className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-1 text-ink">Select a Lesson</h3>
                <p className="font-light text-sm text-slate">
                  Select any curriculum syllabus item from the sidebar to launch.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
