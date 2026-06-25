"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, BookOpen, Layers, CheckCircle2, ChevronRight, Loader2, PlayCircle, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { supabase } from "@/lib/supabase";

interface Lesson {
  id: string;
  title: string;
  kind: "material" | "activity";
  max_score: number | null;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseClientWrapperProps {
  course: {
    id: string;
    title: string;
    slug: string;
    segment: string;
    summary: string;
    priceINR: number;
    isPaid: boolean;
  };
  modules: Module[];
}

export function CourseClientWrapper({ course, modules }: CourseClientWrapperProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Phase 3 - Mock Tests States
  const [mockTests, setMockTests] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);

  // Auth form states
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        checkEnrollment(session.user.id);
      } else {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          checkEnrollment(session.user.id);
        } else {
          setEnrolled(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [course.slug]);

  const checkEnrollment = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_slug", course.slug)
        .eq("status", "active")
        .maybeSingle();

      if (data) {
        setEnrolled(true);
      }
    } catch (err) {
      console.error("Enrollment check error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enrolled && user) {
      fetchStudentTestsAndAttempts();
    }
  }, [enrolled, user]);

  const fetchStudentTestsAndAttempts = async () => {
    setLoadingTests(true);
    try {
      const { data: tests, error: testsErr } = await supabase
        .from("mock_tests")
        .select("*")
        .eq("course_id", course.id)
        .order("display_order", { ascending: true });

      if (testsErr) throw testsErr;
      setMockTests(tests || []);

      const { data: atts, error: attsErr } = await supabase
        .from("test_attempts")
        .select("*")
        .eq("user_id", user.id);

      if (attsErr) throw attsErr;
      setAttempts(atts || []);
    } catch (err) {
      console.error("Failed to load student tests/attempts:", err);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });
        if (error) throw error;
        alert("Registration successful! You are logged in.");
      }
      setShowAuthForm(false);
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed.");
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      setIsLogin(true);
      setShowAuthForm(true);
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: course.slug,
          userId: user.id,
        }),
      });

      const orderData = await response.json();
      if (!response.ok) {
        throw new Error(orderData.error || "Order creation failed");
      }

      const loadScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadScript();
      if (!res) {
        throw new Error("Razorpay SDK failed to load. Are you offline?");
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "KVJ Analytics",
        description: `Enrollment: ${course.title}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          setLoading(true);
          try {
            const webhookVerify = await fetch("/api/payments/razorpay/webhook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                course_slug: course.slug,
                amount: course.priceINR,
              }),
            });

            if (webhookVerify.ok) {
              setEnrolled(true);
              alert("Payment successful! Access granted.");
              router.refresh();
            } else {
              alert("Payment validation failed. Please contact support.");
            }
          } catch (verifyErr) {
            console.error("Signature verification error:", verifyErr);
            alert("Verification connection issue. Please refresh dashboard.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#1D4ED8",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (err: any) {
      alert(err.message || "Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* 1. Gated Modules/Lessons Outline */}
      <div className="lg:col-span-8 space-y-6">
        <div className="border-b border-line pb-4">
          <h3 className="text-xl font-bold font-display text-ink">
            Course Curriculum & Lessons
          </h3>
          <p className="text-sm text-slate mt-1">
            Build hands-on competencies through structured HTML modules, practice activities, and feedback.
          </p>
        </div>

        {modules.length === 0 ? (
          <p className="text-slate text-sm italic">No modules scheduled for this syllabus yet.</p>
        ) : (
          <div className="space-y-6">
            {modules.map((mod, modIdx) => (
              <Card key={mod.id} hoverLift={false} className="border-line p-5 bg-white shadow-soft">
                <h4 className="font-bold font-display text-ink text-base flex items-center gap-2 mb-4 border-b border-line pb-2.5">
                  <span className="flex items-center justify-center w-6 h-6 text-[10px] font-bold rounded-lg bg-brand/10 text-brand">
                    M{modIdx + 1}
                  </span>
                  {mod.title}
                </h4>

                <div className="space-y-2.5">
                  {mod.lessons.map((les) => {
                    return (
                      <div
                        key={les.id}
                        className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                          enrolled
                            ? "bg-white border-line hover:border-brand/40 shadow-sm"
                            : "bg-surface/50 border-line opacity-75"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              enrolled ? "bg-brand/10 text-brand" : "bg-slate/10 text-slate"
                            }`}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-ink block">{les.title}</span>
                            <span className="text-[10px] font-bold text-slate uppercase tracking-wider block mt-0.5">
                              {les.kind === "activity" ? "Activity" : "Study Material"}
                              {les.kind === "activity" && les.max_score ? ` • Max Score: ${les.max_score}` : ""}
                            </span>
                          </div>
                        </div>

                        {enrolled ? (
                          <span className="flex items-center space-x-1 text-success text-xs font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Unlocked</span>
                          </span>
                        ) : (
                          <div className="flex items-center space-x-1.5 text-slate text-xs font-bold uppercase tracking-wider">
                            <Lock className="w-3.5 h-3.5 text-slate" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Module Assessment(s) */}
                {enrolled && mockTests.filter((t) => t.module_id === mod.id).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-line space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Module Assessment</p>
                    {mockTests.filter((t) => t.module_id === mod.id).map((test) => (
                      <a
                        key={test.id}
                        href={`/training/${course.slug}/tests/${test.id}`}
                        className="flex items-center justify-between p-3.5 rounded-lg border border-cta/30 bg-cta/5 hover:bg-cta/10 transition-all"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <Clock className="w-4 h-4 text-cta-600" />
                          {test.title}
                        </span>
                        <span className="text-xs font-bold text-cta-600 whitespace-nowrap">Take Assessment →</span>
                      </a>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Mock Tests Section */}
        {enrolled && (
          <div className="border-t border-line pt-8 mt-6 space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="text-lg font-bold font-display text-ink flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand" />
                Professional Certification Mock Tests
              </h3>
              <p className="text-xs text-slate mt-1">
                Take timed program examinations. Server auto-grading checks objectives and code correctness.
              </p>
            </div>

            {loadingTests ? (
              <div className="py-6 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-brand" />
              </div>
            ) : mockTests.filter((t) => !t.module_id).length === 0 ? (
              <p className="text-xs text-slate italic">No certification tests scheduled for this course yet.</p>
            ) : (
              <div className="space-y-4">
                {mockTests.filter((t) => !t.module_id).map((test) => {
                  const testAttempts = attempts.filter((a) => a.test_id === test.id);
                  const bestAttempt = testAttempts.length > 0
                    ? testAttempts.sort((a, b) => b.score - a.score)[0]
                    : null;

                  return (
                    <div key={test.id} className="bg-white border border-line rounded-xl p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                          {test.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {test.duration_mins} mins</span>
                          <span>•</span>
                          <span>Passing score: {test.pass_mark}</span>
                          {bestAttempt && (
                            <>
                              <span>•</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                bestAttempt.passed
                                  ? "bg-success/10 text-success border border-success/30"
                                  : "bg-error/10 text-error border border-error/30"
                              }`}>
                                {bestAttempt.passed ? "Passed" : "Failed"} (Best: {bestAttempt.score}/{bestAttempt.max_score})
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          href={`/training/${course.slug}/tests/${test.id}`}
                          className="py-2 px-4 bg-brand text-white text-xs font-bold"
                        >
                          {bestAttempt ? "Retake Exam" : "Start Exam"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!enrolled && (
          <div className="border-t border-line pt-8 mt-6">
            <div className="bg-surface/40 border border-line rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-bold uppercase text-slate tracking-wider bg-slate/10 px-2 py-0.5 rounded border border-line">
                  Phase 3 Placeholder
                </span>
                <h4 className="text-sm font-bold text-ink mt-2">Professional Certification Mock Tests</h4>
                <p className="text-xs text-slate mt-1">
                  Our server-graded certification mock tests will unlock in the next phase.
                </p>
              </div>
              <span className="text-xs font-bold text-slate uppercase tracking-widest shrink-0 border border-line bg-white px-3 py-1.5 rounded-btn shadow-sm">
                Coming Soon
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Sidebar Enrollment & Access Card */}
      <div className="lg:col-span-4 lg:sticky lg:top-28">
        {enrolled ? (
          <Card hoverLift={false} className="border-l-4 border-success bg-success/5 p-8 text-center shadow-soft">
            <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-4 font-bold">
              ✓
            </div>
            <h4 className="text-xl font-bold font-display text-ink mb-2">
              Program Unlocked
            </h4>
            <p className="text-xs text-slate leading-relaxed mb-6">
              You are enrolled in this training. You can view all HTML learning curriculum and submit activities.
            </p>
            <Button
              href={`/account?course=${course.slug}`}
              variant="primary"
              className="w-full py-3 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch Course Portal</span>
            </Button>
          </Card>
        ) : (
          <Card hoverLift={false} className="border-l-4 border-brand bg-surface/30 p-8 shadow-soft">
            <h4 className="text-xl font-bold font-display text-ink mb-4">
              Get Program Access
            </h4>
            <p className="text-sm text-slate leading-relaxed mb-6 font-medium">
              Unlock modules, workbook sheets, and interactive assignments for this curriculum.
            </p>

            {course.isPaid ? (
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-slate uppercase tracking-wider block leading-none">
                    Investment fee
                  </span>
                  <span className="text-3xl font-bold text-ink font-display mt-1 block">
                    ₹{course.priceINR}
                  </span>
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={checkoutLoading}
                  variant="primary"
                  className="w-full py-4 bg-cta hover:bg-cta-600 text-ink shadow-md font-bold flex items-center justify-center space-x-2"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Pay Portal...</span>
                    </>
                  ) : (
                    <span>Enroll Now (Razorpay)</span>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <p className="text-xs text-slate italic leading-relaxed">
                  This program is offered through participating colleges. Enter your batch passcode inside the join section.
                </p>
                <Button
                  href={`/training/${course.slug}/join`}
                  variant="primary"
                  className="w-full py-4 bg-education hover:bg-teal-700 text-white shadow-md font-bold text-center"
                >
                  Enter College Batch Code
                </Button>
              </div>
            )}

            {!user && (
              <div className="text-center border-t border-line pt-4 mt-6">
                <p className="text-xs text-slate">
                  Already enrolled?{" "}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setShowAuthForm(true);
                    }}
                    className="text-brand font-bold hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Log In Here
                  </button>
                </p>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-card border border-line p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAuthForm(false)}
              className="absolute top-4 right-4 text-slate hover:text-ink font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold font-display text-ink text-center mb-6">
              {isLogin ? "Sign In to Student Account" : "Register Student Account"}
            </h3>

            {authError && (
              <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error mb-6">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full px-4 py-3 rounded-input border border-line text-sm bg-surface/50 focus:bg-white"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@email.com"
                  className="w-full px-4 py-3 rounded-input border border-line text-sm bg-surface/50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-input border border-line text-sm bg-surface/50 focus:bg-white"
                />
              </div>

              <Button type="submit" className="w-full py-3.5 bg-brand hover:bg-brand-700 text-white font-bold">
                {isLogin ? "Log In" : "Register & Log In"}
              </Button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-line text-xs text-slate">
              {isLogin ? (
                <span>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-brand font-bold hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Register Here
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-brand font-bold hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Log In Here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
