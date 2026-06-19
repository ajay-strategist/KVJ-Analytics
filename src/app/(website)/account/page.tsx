"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  BookOpen,
  Award,
  LogOut,
  FileText,
  Video,
  ExternalLink,
  PlayCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldAlert,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  Trophy,
  ArrowRight
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

// ─── Course Portal Sub-component ─────────────────────────────────────────────

interface CoursePortalViewProps {
  course: any;
  activityResults: any[];
  refreshResults: () => Promise<void>;
  onClose: () => void;
}

function CoursePortalView({ course, activityResults, refreshResults, onClose }: CoursePortalViewProps) {
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [submittingScore, setSubmittingScore] = useState(false);
  const [scoreSubmittedOk, setScoreSubmittedOk] = useState(false);
  const [latestScoreData, setLatestScoreData] = useState<any>(null);

  // Flatten lessons for next/prev navigation
  const allLessons = (course.modules || []).reduce((acc: any[], mod: any) => {
    return [...acc, ...(mod.lessons || [])];
  }, []);

  const activeLessonIndex = allLessons.findIndex((l: any) => l.id === activeLesson?.id);

  // Listen to postMessage event for activity-score
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === "activity-score") {
        const { score, max } = e.data;
        if (!activeLesson || activeLesson.kind !== "activity") return;

        setSubmittingScore(true);
        setScoreSubmittedOk(false);

        try {
          const res = await fetch("/api/activity-result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessonId: activeLesson.id,
              score: Number(score),
              maxScore: Number(max),
              courseSlug: course.slug,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to submit score");

          setScoreSubmittedOk(true);
          setLatestScoreData({ score, max });
          await refreshResults();

          // Hide success toast after 4 seconds
          setTimeout(() => {
            setScoreSubmittedOk(false);
          }, 4000);
        } catch (err) {
          console.error("Score submission error:", err);
          alert("Could not save activity score. Please check connection.");
        } finally {
          setSubmittingScore(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeLesson, course.slug]);

  const handleNext = () => {
    if (activeLessonIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[activeLessonIndex + 1]);
      setScoreSubmittedOk(false);
      setLatestScoreData(null);
    }
  };

  const handlePrev = () => {
    if (activeLessonIndex > 0) {
      setActiveLesson(allLessons[activeLessonIndex - 1]);
      setScoreSubmittedOk(false);
      setLatestScoreData(null);
    }
  };

  const getLessonResult = (lessonId: string) => {
    return activityResults.find((r) => r.lesson_id === lessonId);
  };

  // Progress metrics
  const totalActivities = allLessons.filter((l: any) => l.kind === "activity").length;
  const completedActivities = allLessons.filter(
    (l: any) => l.kind === "activity" && getLessonResult(l.id)
  ).length;

  const progressPercent = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 100;

  return (
    <Section background="default" className="bg-surface/30 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navbar Takeover */}
        <div className="bg-white border border-line rounded-card p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 signature-gradient" />
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 border border-line rounded-lg text-slate hover:text-brand hover:border-brand/35 transition-all shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                learning portal
              </span>
              <h2 className="text-lg font-bold font-display text-ink leading-tight mt-0.5">
                {course.title}
              </h2>
            </div>
          </div>

          {/* Progress bar */}
          {totalActivities > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs font-bold text-slate block leading-none">Activities Progress</span>
                <span className="text-[10px] text-brand font-bold mt-1 block">
                  {completedActivities} of {totalActivities} Completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-32 bg-slate/10 rounded-full h-2 overflow-hidden border border-line shrink-0">
                <div
                  className="signature-gradient h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Portal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Curriculum Selector */}
          <div className="lg:col-span-4 bg-white border border-line rounded-card p-5 shadow-soft space-y-5">
            <div className="border-b border-line pb-3">
              <h3 className="font-bold font-display text-ink text-sm uppercase tracking-wide">
                Course Syllabus
              </h3>
              <p className="text-[11px] text-slate mt-0.5">Select a lesson node below to begin.</p>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {course.modules?.map((mod: any, modIdx: number) => (
                <div key={mod.id} className="space-y-2">
                  <h4 className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand/60 shrink-0" />
                    M{modIdx + 1}: {mod.title}
                  </h4>

                  <div className="space-y-1 pl-3">
                    {mod.lessons?.map((les: any, lesIdx: number) => {
                      const isActive = activeLesson?.id === les.id;
                      const result = getLessonResult(les.id);
                      const isActivity = les.kind === "activity";

                      return (
                        <button
                          key={les.id}
                          onClick={() => {
                            setActiveLesson(les);
                            setScoreSubmittedOk(false);
                            setLatestScoreData(null);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between gap-2 border transition-all ${
                            isActive
                              ? "bg-brand/10 border-brand/20 text-brand font-bold"
                              : "border-transparent text-slate hover:bg-surface hover:text-ink"
                          }`}
                        >
                          <span className="truncate flex-1">
                            L{lesIdx + 1}: {les.title}
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            {isActivity && result && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded bg-success/10 text-success border border-success/20">
                                {result.score}/{result.max_score}
                              </span>
                            )}
                            {isActivity && !result && (
                              <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/10">
                                Activity
                              </span>
                            )}
                            {!isActivity && (
                              <span className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate/10 text-slate border border-line">
                                Material
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Workspace Frame */}
          <div className="lg:col-span-8 space-y-4">
            {/* Score Saved Toast */}
            {scoreSubmittedOk && latestScoreData && (
              <div className="bg-success/15 border border-success/30 p-4 rounded-xl flex items-start space-x-3 text-success animate-fade-up">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-ink block">Activity Attempt Submitted!</span>
                  <span className="text-xs text-slate block mt-1">
                    Your interactive score of <strong>{latestScoreData.score} marks</strong> out of <strong>{latestScoreData.max} marks</strong> has been securely logged to Supabase.
                  </span>
                </div>
              </div>
            )}

            {activeLesson ? (
              <div className="bg-white border border-line rounded-card p-6 shadow-soft space-y-4 flex flex-col">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                      {activeLesson.kind === "activity" ? "Interactive Practice Activity" : "Syllabus Study Material"}
                    </span>
                    <h3 className="text-base font-bold font-display text-ink mt-0.5">{activeLesson.title}</h3>
                  </div>

                  {activeLesson.kind === "activity" && (
                    <div className="text-right">
                      {getLessonResult(activeLesson.id) ? (
                        <div>
                          <span className="text-[9px] font-bold text-slate uppercase tracking-wider block">
                            Logged Marks
                          </span>
                          <span className="text-lg font-bold text-success font-display">
                            {getLessonResult(activeLesson.id).score} / {activeLesson.max_score}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[9px] font-bold text-slate uppercase tracking-wider block">
                            Possible Marks
                          </span>
                          <span className="text-lg font-bold text-brand font-display">
                            {activeLesson.max_score} Max
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sandboxed iframe */}
                {activeLesson.content_html ? (
                  <iframe
                    key={activeLesson.id}
                    sandbox="allow-scripts allow-same-origin"
                    srcDoc={activeLesson.content_html}
                    className="w-full min-h-[580px] bg-white border border-line rounded-xl shadow-inner mt-2"
                  />
                ) : (
                  <div className="min-h-[300px] flex items-center justify-center border-dashed border-2 border-line rounded-xl text-slate text-xs italic">
                    This lesson node has no HTML material content loaded.
                  </div>
                )}

                {/* Score submission pending loader */}
                {submittingScore && (
                  <div className="flex items-center justify-center py-4 bg-brand/5 border border-brand/10 rounded-lg text-brand gap-2 text-xs font-semibold animate-pulse mt-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing interactive score submission...</span>
                  </div>
                )}

                {/* Lesson Pagination Nav */}
                <div className="border-t border-line pt-4 mt-6 flex items-center justify-between">
                  <Button
                    onClick={handlePrev}
                    disabled={activeLessonIndex <= 0}
                    variant="secondary"
                    className="px-4 py-2 text-xs font-bold flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={activeLessonIndex >= allLessons.length - 1}
                    className="px-5 py-2 text-xs font-bold flex items-center gap-1 bg-brand text-white"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-line rounded-card p-10 text-center shadow-soft min-h-[450px] flex flex-col justify-center items-center">
                <GraduationCap className="w-16 h-16 text-brand/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-display text-ink">Welcome to the Learning Portal</h3>
                <p className="text-xs text-slate max-w-sm mx-auto mt-2 leading-relaxed font-medium">
                  Select a module lesson node from the sidebar to launch the sandboxed material worksheets and assignment activities.
                </p>

                {/* Introduction quick summary */}
                {course.introduction && (
                  <div className="mt-8 border-t border-line pt-6 max-w-xl w-full text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate mb-3">Course Syllabus Overview</h4>
                    <div
                      className="text-xs text-slate/85 leading-relaxed max-h-48 overflow-y-auto bg-surface/40 p-4 rounded-xl border border-line/60 prose prose-slate"
                      dangerouslySetInnerHTML={{ __html: course.introduction }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Main Account Dashboard Component ────────────────────────────────────────

function StudentAccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("test");

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [activityResults, setActivityResults] = useState<any[]>([]);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);

  // Auth Form State
  const [showRegister, setShowRegister] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authOrg, setAuthOrg] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active Test State (Phase 1 legacy tests fallback logic placeholder)
  const [activeTest, setActiveTest] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState("");
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testTimeRemaining, setTestTimeRemaining] = useState(0);
  const [testStartedAt, setTestStartedAt] = useState<string>("");
  const [testResults, setTestResults] = useState<any>(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadDashboardData = async (sessionUser: any) => {
    try {
      // 1. Profile metadata
      const { data: profData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionUser.id)
        .maybeSingle();

      setProfile(profData || { name: sessionUser.user_metadata?.name || "Student" });

      // 2. Active Enrollments
      const { data: enrolls, error: enrollsErr } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", sessionUser.id)
        .eq("status", "active");

      if (enrollsErr) throw enrollsErr;
      setEnrollments(enrolls || []);

      if (enrolls && enrolls.length > 0) {
        const slugs = enrolls.map((e) => e.course_slug);

        // Fetch courses, modules, lessons from Supabase (single-source of truth)
        const { data: dbCourses } = await supabase
          .from("courses")
          .select("*")
          .in("slug", slugs)
          .order("display_order", { ascending: true });

        if (dbCourses && dbCourses.length > 0) {
          const courseIds = dbCourses.map((c) => c.id);

          // Fetch modules
          const { data: dbMods } = await supabase
            .from("modules")
            .select("*")
            .in("course_id", courseIds)
            .order("display_order", { ascending: true });

          // Fetch lessons
          let dbLessons: any[] = [];
          if (dbMods && dbMods.length > 0) {
            const { data: dbLess } = await supabase
              .from("lessons")
              .select("*")
              .in("module_id", dbMods.map((m) => m.id))
              .order("display_order", { ascending: true });
            dbLessons = dbLess || [];
          }

          // Fetch student activity results
          const { data: dbResults } = await supabase
            .from("activity_results")
            .select("*")
            .eq("user_id", sessionUser.id);

          setActivityResults(dbResults || []);

          // Assemble the course syllabus data
          const assembled = dbCourses.map((course) => {
            const courseMods = (dbMods || []).filter((m) => m.course_id === course.id);
            const courseModsWithLessons = courseMods.map((mod) => ({
              ...mod,
              lessons: dbLessons.filter((l) => l.module_id === mod.id),
            }));

            return {
              ...course,
              title: course.title,
              slug: course.slug,
              segment: course.segment,
              summary: course.summary,
              introduction: course.introduction,
              modules: courseModsWithLessons,
            };
          });

          setCoursesData(assembled);
        } else {
          setCoursesData([]);
        }
      } else {
        setCoursesData([]);
      }

      // 3. Test Attempts History
      const { data: attempts } = await supabase
        .from("test_attempts")
        .select("*")
        .eq("user_id", sessionUser.id)
        .order("submitted_at", { ascending: false });

      setTestAttempts(attempts || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshActivityResults = async () => {
    if (!user) return;
    const { data: dbResults } = await supabase
      .from("activity_results")
      .select("*")
      .eq("user_id", user.id);
    setActivityResults(dbResults || []);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        loadDashboardData(session.user);
      } else {
        setLoading(false);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadDashboardData(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setEnrollments([]);
        setCoursesData([]);
        setActivityResults([]);
        setTestAttempts([]);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (testId && user) {
      loadMockTest(testId);
    } else {
      setActiveTest(null);
      setTestResults(null);
      setTestAnswers({});
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [testId, user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (showRegister) {
        if (!authName || !authPhone || !authOrg) {
          throw new Error("All registration details are required.");
        }
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: { name: authName },
          },
        });
        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            name: authName,
            phone: authPhone,
            organization: authOrg,
            role: "student",
          });
        }
        alert("Registration complete! Welcome to KVJ Analytics.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
      }
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
      setAuthPhone("");
      setAuthOrg("");
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/training");
  };

  // Mock Test Loader (Phase 1 legacy tests logic)
  const loadMockTest = async (id: string) => {
    setTestLoading(true);
    setTestError("");
    setTestResults(null);
    setTestAnswers({});

    try {
      const response = await fetch(`/api/tests/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load test questions.");
      }

      const testData = data.test;
      setActiveTest(testData);
      setTestTimeRemaining(testData.durationMins * 60);
      setTestStartedAt(new Date().toISOString());

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            triggerAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setTestError(err.message || "Connection issue.");
    } finally {
      setTestLoading(false);
    }
  };

  const selectAnswer = (questionIdx: number, optionIdx: number) => {
    if (submittingTest || testResults) return;
    setTestAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const triggerAutoSubmit = () => {
    alert("Time limit reached! Your test is being automatically submitted.");
    submitTestAnswers(true);
  };

  const submitTestAnswers = async (force: boolean = false) => {
    if (submittingTest || (!force && !confirm("Are you sure you want to finish and submit your test?"))) {
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setSubmittingTest(true);
    try {
      const questionsCount = activeTest.questions?.length || 0;
      const answersArray = Array.from({ length: questionsCount }, (_, i) =>
        testAnswers[i] !== undefined ? testAnswers[i] : null
      );

      const response = await fetch(`/api/tests/${activeTest._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answersArray,
          startedAt: testStartedAt,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Submission failed");
      }

      setTestResults(result);

      // Reload attempts list
      const { data: attempts } = await supabase
        .from("test_attempts")
        .select("*")
        .eq("user_id", user.id)
        .order("submitted_at", { ascending: false });
      setTestAttempts(attempts || []);
    } catch (err: any) {
      alert(err.message || "Failed to submit answers. Check connection.");
    } finally {
      setSubmittingTest(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-brand mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate font-display">Loading Student Portal...</p>
        </div>
      </div>
    );
  }

  // 1. ANONYMOUS PORTAL RENDER (Not logged in)
  if (!user) {
    return (
      <Section background="default" className="bg-surface/30 min-h-[85vh] flex items-center py-16">
        <Container className="max-w-md">
          <Card className="p-8 md:p-10 border-line/80 shadow-xl relative overflow-hidden bg-white">
            <div className="absolute top-0 left-0 right-0 h-1.5 signature-gradient" />

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl signature-gradient flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-md">
                K
              </div>
              <h3 className="text-2xl font-bold font-display text-ink tracking-tight">
                {showRegister ? "Register Student Account" : "Student Portal Sign In"}
              </h3>
              <p className="text-xs text-slate mt-2 leading-relaxed">
                Access your custom learning syllabi, databases, and certification mock tests.
              </p>
            </div>

            {authError && (
              <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error mb-6 animate-fade-up">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {showRegister && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Rahul Kumar"
                      className="w-full px-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-white focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="e.g. 9961813730"
                      className="w-full px-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-white focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                      College or Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={authOrg}
                      onChange={(e) => setAuthOrg(e.target.value)}
                      placeholder="Cochin Institute of Technology"
                      className="w-full px-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-white focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-white focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-white focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                />
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 justify-center"
              >
                {authLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : showRegister ? (
                  "Create Account & Login"
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            <div className="text-center mt-8 pt-5 border-t border-line text-xs text-slate">
              {showRegister ? (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setAuthError("");
                      setShowRegister(false);
                    }}
                    className="text-brand font-bold hover:text-brand-700 transition-colors cursor-pointer bg-transparent border-0 outline-none"
                  >
                    Log In Here
                  </button>
                </span>
              ) : (
                <span>
                  Don&apos;t have a student account?{" "}
                  <button
                    onClick={() => {
                      setAuthError("");
                      setShowRegister(true);
                    }}
                    className="text-brand font-bold hover:text-brand-700 transition-colors cursor-pointer bg-transparent border-0 outline-none"
                  >
                    Register Here
                  </button>
                </span>
              )}
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  // 2. ACTIVE TEST LAYOUT (Takeover for mock tests)
  if (activeTest) {
    const questionsList = activeTest.questions || [];

    return (
      <Section background="default" className="bg-surface/30 min-h-[90vh] py-12">
        <Container className="max-w-4xl">
          <div className="bg-white border border-line/80 rounded-card p-6 shadow-soft mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 signature-gradient" />
            <div>
              <span className="text-[10px] font-bold text-education uppercase tracking-wider block">
                Evaluation Engine
              </span>
              <h2 className="text-xl font-bold font-display text-ink mt-1">
                {activeTest.title}
              </h2>
            </div>

            {!testResults && (
              <div className="flex items-center space-x-3 bg-navy/5 px-4 py-2.5 rounded-lg text-navy border border-navy/10 shrink-0">
                <Clock className="w-4 h-4 text-brand animate-pulse" />
                <span className="text-sm font-bold font-mono">
                  Time Remaining: {formatTime(testTimeRemaining)}
                </span>
              </div>
            )}
            {testResults && (
              <Link
                href="/account"
                className="px-4 py-2.5 bg-slate text-white text-xs font-bold rounded-btn hover:bg-slate-700 transition-colors shadow-sm"
              >
                Close &amp; Return
              </Link>
            )}
          </div>

          {testLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-3" />
              <p className="text-sm text-slate">Downloading exam parameters...</p>
            </div>
          ) : testError ? (
            <div className="bg-error/5 border border-error/20 p-6 rounded-card text-center max-w-md mx-auto">
              <ShieldAlert className="w-12 h-12 text-error mx-auto mb-4" />
              <h4 className="text-lg font-bold text-ink">Access Error</h4>
              <p className="text-sm text-slate mt-2">{testError}</p>
              <Link href="/account" className="mt-6 inline-block px-4 py-2 bg-brand text-white rounded-lg text-xs font-bold">
                Return to Portal
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {testResults && (
                <Card className={`p-8 border-t-4 shadow-soft transition-all duration-200 ${testResults.passed ? "border-success bg-success/5" : "border-error bg-error/5"}`}>
                  <div className="text-center max-w-md mx-auto">
                    {testResults.passed ? (
                      <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    ) : (
                      <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
                    )}
                    <h3 className="text-2xl font-bold font-display text-ink">
                      {testResults.passed ? "Test Passed!" : "Test Failed"}
                    </h3>
                    <p className="text-sm text-slate mt-3 leading-relaxed">
                      You scored <strong className="text-ink">{testResults.score} marks</strong> out of a possible <strong className="text-ink">{testResults.totalPossibleMarks} marks</strong>.
                      The passing grade requires at least <strong className="text-ink">{testResults.passMark} marks</strong>.
                    </p>
                    <div className="mt-6">
                      <Button href="/account" variant="secondary" className="px-6 py-2.5 text-xs font-bold bg-white">
                        Return to Student Dashboard
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-6">
                {questionsList.map((q: any, qIdx: number) => {
                  const studentAnswer = testAnswers[qIdx];
                  const gradedQ = testResults?.gradedQuestions?.[qIdx];

                  return (
                    <Card
                      key={qIdx}
                      className={`p-6 md:p-8 border border-line/80 bg-white shadow-soft transition-colors ${
                        gradedQ
                          ? gradedQ.isCorrect
                            ? "border-l-4 border-success bg-success/5"
                            : "border-l-4 border-error bg-error/5"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate/10 text-slate text-xs font-bold font-display shrink-0 mt-0.5">
                          {qIdx + 1}
                        </span>
                        <div className="flex-grow">
                          <p className="text-base font-semibold text-ink leading-relaxed">
                            {q.stem}
                          </p>
                          <span className="text-[10px] text-slate font-bold uppercase tracking-wider block mt-2 mb-4">
                            ({q.marks || 1} mark{q.marks > 1 ? "s" : ""})
                          </span>

                          <div className="space-y-2.5">
                            {q.options?.map((option: string, oIdx: number) => {
                              const isSelected = studentAnswer === oIdx;
                              let optionStyle = "bg-surface/50 hover:bg-surface border-line text-slate hover:text-ink focus-glow";

                              if (isSelected) {
                                optionStyle = "bg-brand/5 border-brand text-brand font-semibold shadow-sm";
                              }

                              if (gradedQ) {
                                const isCorrectAnswer = gradedQ.correctIndex === oIdx;
                                const isStudentAnswer = gradedQ.studentIndex === oIdx;

                                if (isCorrectAnswer) {
                                  optionStyle = "bg-success/10 border-success text-success font-bold";
                                } else if (isStudentAnswer) {
                                  optionStyle = "bg-error/10 border-error text-error line-through";
                                } else {
                                  optionStyle = "bg-white border-line text-slate opacity-60";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => selectAnswer(qIdx, oIdx)}
                                  disabled={submittingTest || !!testResults}
                                  className={`w-full text-left p-4 rounded-lg border text-sm transition-all duration-200 flex items-center space-x-3 cursor-pointer ${optionStyle}`}
                                >
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 transition-colors ${isSelected ? "bg-brand text-white" : "border border-slate/30 bg-white"}`}>
                                    {String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span>{option}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {!testResults && (
                <div className="bg-white border border-line/80 rounded-card p-6 shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-xs text-slate max-w-md leading-relaxed">
                    Once submitted, answers are graded on the KVJ Server. You cannot redo the test session. Double check all options.
                  </div>
                  <Button
                    onClick={() => submitTestAnswers(false)}
                    disabled={submittingTest}
                    className="py-3 px-8 justify-center shrink-0"
                  >
                    {submittingTest ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span>Grading Exam...</span>
                      </>
                    ) : (
                      <span>Submit Answers</span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    );
  }

  // 3. ENROLLED COURSE CURRICULUM PORTAL VIEW (Interactive iframe Takeover)
  const activeCourseSlug = searchParams.get("course");
  const activeCourse = coursesData.find((c) => c.slug === activeCourseSlug);

  if (activeCourse && enrollments.some((e) => e.course_slug === activeCourseSlug)) {
    return (
      <CoursePortalView
        course={activeCourse}
        activityResults={activityResults}
        refreshResults={refreshActivityResults}
        onClose={() => {
          router.push("/account");
        }}
      />
    );
  }

  // 4. MAIN STUDENT DASHBOARD PORTAL
  return (
    <Section background="default" className="bg-surface/30 min-h-[85vh] py-12">
      <Container>
        {/* Top Profile Header */}
        <div className="bg-white border border-line/80 rounded-card p-6 md:p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 signature-gradient" />
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-full signature-gradient flex items-center justify-center text-white text-2xl font-bold font-display shadow-md">
              {profile?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display text-ink leading-tight">
                {profile?.name}
              </h2>
              <p className="text-sm text-slate mt-1.5 font-medium">
                {user.email} {profile?.organization ? `• ${profile.organization}` : ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center text-xs font-bold text-slate hover:text-error transition-all bg-white hover:bg-error/5 border border-line rounded-btn px-4 py-2.5 shadow-sm hover:shadow cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out Account
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Course Curriculum Folders */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-line pb-3">
              <h3 className="text-xl font-bold font-display text-ink">
                My Enrolled Programs
              </h3>
              <p className="text-xs text-slate mt-1">
                Open specific syllabi dashboards to launch HTML materials and activities.
              </p>
            </div>

            {coursesData.length === 0 ? (
              <Card className="p-8 border-dashed border-2 border-line text-center">
                <BookOpen className="w-12 h-12 text-slate/40 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-ink mb-2 font-display">
                  No Active Courses
                </h4>
                <p className="text-sm text-slate max-w-sm mx-auto mb-6 leading-relaxed">
                  You are not currently enrolled in any programs. Check the course catalog to enroll or apply college code.
                </p>
                <Button href="/training" variant="primary" className="px-6 py-2.5 text-xs font-bold">
                  Browse Course Catalog
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {coursesData.map((course) => (
                  <Card key={course.slug} hoverLift={false} className="border-line p-6 bg-white shadow-soft">
                    <div className="border-b border-line pb-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white ${course.segment === "corporate" ? "bg-corporate" : "bg-education"}`}>
                          {course.segment}
                        </span>
                        <h4 className="text-lg font-bold font-display text-ink mt-1">
                          {course.title}
                        </h4>
                      </div>

                      <Link
                        href={`/account?course=${course.slug}`}
                        className="px-4 py-2 bg-brand/5 border border-brand/20 text-brand text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-brand/10 transition-colors shadow-sm"
                      >
                        <span>Launch Course Portal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Quick Outline preview */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-slate uppercase tracking-wider block mb-1">
                        Syllabus Outline
                      </span>
                      {course.modules?.length === 0 ? (
                        <p className="text-xs text-slate italic">Curriculum outline is loading.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-medium text-slate">
                          {course.modules?.map((mod: any, idx: number) => (
                            <div key={mod.id} className="flex items-center gap-2 p-2.5 bg-surface/50 border border-line rounded-lg">
                              <span className="flex items-center justify-center w-5 h-5 rounded bg-brand/10 text-brand text-[9px] font-bold shrink-0">
                                M{idx + 1}
                              </span>
                              <span className="truncate text-ink/80">{mod.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Mock Tests Placeholder Section */}
                    <div className="space-y-2.5 mt-6 pt-5 border-t border-line">
                      <span className="text-[10px] font-bold text-slate uppercase tracking-wider block mb-1">
                        Cert Evaluations &amp; Mock Tests (Phase 3)
                      </span>
                      <div className="bg-surface/40 border border-line p-4 rounded-xl flex items-center justify-between gap-3 text-xs text-slate">
                        <span>Professional Certification evaluations will launch in the next phase.</span>
                        <span className="font-bold text-[9px] uppercase tracking-wider bg-slate/15 px-2 py-1 rounded">Coming Soon</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Evaluation History logs */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border-b border-line pb-3">
              <h3 className="text-xl font-bold font-display text-ink">
                Evaluation History
              </h3>
              <p className="text-xs text-slate mt-1">
                Overview of submitted mock test results.
              </p>
            </div>

            {testAttempts.length === 0 ? (
              <Card className="p-6 border-line bg-white text-center shadow-soft">
                <Award className="w-10 h-10 text-slate/30 mx-auto mb-2.5" />
                <p className="text-xs text-slate">No mock tests submitted yet.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {testAttempts.map((attempt) => {
                  const submitDate = new Date(attempt.submitted_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  });

                  return (
                    <div
                      key={attempt.id}
                      className={`p-4 rounded-lg border bg-white flex items-center justify-between shadow-soft hover:shadow-md transition-all duration-200 ${
                        attempt.passed ? "border-success/30" : "border-error/30"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-ink block truncate max-w-[180px]">
                          Test ID: {attempt.test_slug.slice(0, 8)}...
                        </span>
                        <span className="text-[10px] text-slate font-bold uppercase tracking-wider block mt-0.5">
                          {submitDate} • Score: {attempt.score} Marks
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {attempt.passed ? (
                          <span className="flex items-center text-[9px] font-extrabold uppercase tracking-wider text-success bg-success/10 px-2 py-1 rounded border border-success/20 shadow-sm">
                            Passed
                          </span>
                        ) : (
                          <span className="flex items-center text-[9px] font-extrabold uppercase tracking-wider text-error bg-error/10 px-2 py-1 rounded border border-error/20 shadow-sm">
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function StudentAccountPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-white">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-brand mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate font-display">Loading Student Portal...</p>
          </div>
        </div>
      }
    >
      <StudentAccountDashboard />
    </React.Suspense>
  );
}
