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
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { client as sanityClient } from "@/sanity/lib/client";

function StudentAccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("test");

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);
  
  // Auth Form State (Fallback login/register if not logged in)
  const [showRegister, setShowRegister] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authOrg, setAuthOrg] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Active Test State
  const [activeTest, setActiveTest] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState("");
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [testTimeRemaining, setTestTimeRemaining] = useState(0);
  const [testStartedAt, setTestStartedAt] = useState<string>("");
  const [testResults, setTestResults] = useState<any>(null);
  const [submittingTest, setSubmittingTest] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load basic session and student records
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
        // Fetch matching course syllabi from Sanity
        const slugs = enrolls.map((e) => e.course_slug);
        const sanityCourses = await sanityClient.fetch(
          `*[_type == "course" && slug.current in $slugs] {
            title,
            "slug": slug.current,
            segment,
            summary,
            "materials": *[_type == "material" && references(^._id)] | order(order asc) {
              _id,
              title,
              type,
              isPreview
            },
            "tests": *[_type == "mockTest" && references(^._id)] {
              _id,
              title,
              durationMins,
              passMark,
              "questionCount": count(questions)
            }
          }`,
          { slugs }
        );
        setCoursesData(sanityCourses || []);
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

    // Listen to authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadDashboardData(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setEnrollments([]);
        setCoursesData([]);
        setTestAttempts([]);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Trigger test loader if testId in search query changes
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

  // Handle Login & Signup
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
        
        // Wait minor delay and upsert custom profile
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

  // Mock Test Loader & Timers
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

      // Start countdown timer
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            // Auto-submit when timer expires
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
      // Convert answers map to a matched array matching question order
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
      
      // Reload history background list
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

  // Helper format seconds -> mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-corporate" />;
      case "video":
        return <Video className="w-4 h-4 text-education" />;
      default:
        return <ExternalLink className="w-4 h-4 text-slate" />;
    }
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
            {/* Decorative Top Accent Bar */}
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

  // 2. ACTIVE TEST LAYOUT (Takes over page when test query is present)
  if (activeTest) {
    const questionsList = activeTest.questions || [];
    
    return (
      <Section background="default" className="bg-surface/30 min-h-[90vh] py-12">
        <Container className="max-w-4xl">
          {/* Header Bar */}
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
                Close & Return
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
              {/* If test is already submitted, display score receipt */}
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

              {/* Quiz Body */}
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

                              // Results review display
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

              {/* Submit panel */}
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

  // 3. MAIN STUDENT DASHBOARD PORTAL
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
              <p className="text-sm text-slate mt-1.5">
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
          {/* Left Side: Course Catalog Syllabus folders */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-line pb-3">
              <h3 className="text-xl font-bold font-display text-ink">
                My Enrolled Programs
              </h3>
              <p className="text-xs text-slate mt-1">
                Open specific syllabi folders to access workbook databases and files.
              </p>
            </div>

            {coursesData.length === 0 ? (
              <Card className="p-8 border-dashed border-2 border-line text-center">
                <BookOpen className="w-12 h-12 text-slate/40 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-ink mb-2 font-display">
                  No Active Courses
                </h4>
                <p className="text-sm text-slate max-w-sm mx-auto mb-6 leading-relaxed">
                  You are not currently enrolled in any skill programs. Check the course catalog to enroll or apply college code.
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
                        href={`/training/${course.slug}`}
                        className="text-xs font-semibold text-brand hover:text-brand-700 transition-colors flex items-center"
                      >
                        Syllabus details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </Link>
                    </div>

                    {/* Materials inside Course */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-slate uppercase tracking-wider block mb-1">
                        Syllabus Files & Attachments
                      </span>
                      {course.materials?.length === 0 ? (
                        <p className="text-xs text-slate italic">No downloadable assets loaded.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.materials?.map((mat: any) => (
                            <a
                              key={mat._id}
                              href={`/api/materials/${mat._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3.5 bg-surface/50 border border-line rounded-lg text-sm font-semibold hover:border-brand/40 hover:bg-white hover:shadow-soft transition-all duration-200 group"
                            >
                              <div className="flex items-center space-x-2.5">
                                {getMaterialIcon(mat.type)}
                                <span className="text-ink group-hover:text-brand transition-colors text-xs truncate max-w-[200px]">
                                  {mat.title}
                                </span>
                              </div>
                              <span className="text-[8px] font-bold uppercase tracking-wider text-slate border border-line bg-white px-1.5 py-0.5 rounded shadow-sm">
                                {mat.type}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tests inside Course */}
                    <div className="space-y-2.5 mt-6 pt-5 border-t border-line">
                      <span className="text-[10px] font-bold text-slate uppercase tracking-wider block mb-1">
                        Cert Evaluations & Mock Tests
                      </span>
                      {course.tests?.length === 0 ? (
                        <p className="text-xs text-slate italic">No test models scheduled.</p>
                      ) : (
                        <div className="space-y-2">
                          {course.tests?.map((test: any) => (
                            <div
                              key={test._id}
                              className="flex items-center justify-between p-3.5 bg-surface/50 border border-line rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <PlayCircle className="w-5 h-5 text-education" />
                                <div>
                                  <span className="text-xs font-semibold text-ink block">{test.title}</span>
                                  <span className="text-[9px] font-bold text-slate uppercase tracking-wider block mt-0.5">
                                    {test.durationMins} Mins • Pass Mark: {test.passMark} • {test.questionCount} Qs
                                  </span>
                                </div>
                              </div>
                              
                              <Button
                                href={`/account?test=${test._id}`}
                                variant="secondary"
                                className="px-4 py-1.5 text-xs font-bold bg-white text-education border-education hover:bg-education/5"
                              >
                                Start Exam
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Evaluation history logs */}
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
