"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Unlock, FileText, Video, Link as LinkIcon, AlertCircle, PlayCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { supabase } from "@/lib/supabase";

interface CourseClientWrapperProps {
  course: {
    title: string;
    slug: string;
    segment: string;
    summary: string;
    priceINR: number;
    isPaid: boolean;
  };
  materials: Array<{
    _id: string;
    title: string;
    type: "pdf" | "video" | "link" | "richtext";
    isPreview: boolean;
  }>;
  tests: Array<{
    _id: string;
    title: string;
    durationMins: number;
    passMark: number;
    questionCount: number;
  }>;
}

export function CourseClientWrapper({ course, materials, tests }: CourseClientWrapperProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Auth form states for login
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    // 1. Get current auth user session
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

    // Listen to auth state updates
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

  // Check Supabase if user is enrolled in this course slug
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

  // Launch Razorpay Checkout
  const handlePayment = async () => {
    if (!user) {
      setIsLogin(true);
      setShowAuthForm(true);
      return;
    }

    setCheckoutLoading(true);
    try {
      // 1. Create order on our server
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

      // 2. Load Razorpay script dynamically
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

      // 3. Open Razorpay dialog checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "KVJ Analytics",
        description: `Enrollment: ${course.title}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Razorpay returns razorpay_payment_id, razorpay_order_id, razorpay_signature
          // We redirect student to wait, or query order status. We will trigger manual validation:
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
          color: "#1D4ED8", // brand blue hex
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

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
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
      {/* 1. Gated Materials Listing */}
      <div className="lg:col-span-8 space-y-6">
        <div className="border-b border-line pb-4">
          <h3 className="text-xl font-bold font-display text-ink">
            Course Syllabus & Study Materials
          </h3>
          <p className="text-sm text-slate mt-1">
            Access certification files, practical workbook dashboards, and instructional videos.
          </p>
        </div>

        {materials.length === 0 ? (
          <p className="text-slate text-sm">No materials added to this syllabus yet.</p>
        ) : (
          <div className="space-y-3">
            {materials.map((mat) => {
              const isUnlocked = mat.isPreview || enrolled;
              return (
                <div
                  key={mat._id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    isUnlocked
                      ? "bg-white border-line hover:border-brand/40 shadow-sm"
                      : "bg-surface/50 border-line opacity-75"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isUnlocked ? "bg-brand/10 text-brand" : "bg-slate/10 text-slate"
                      }`}
                    >
                      {getMaterialIcon(mat.type)}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-ink block">{mat.title}</span>
                      <span className="text-[10px] font-bold text-slate uppercase tracking-wider block mt-0.5">
                        {mat.type} • {mat.isPreview ? "free preview" : "gated content"}
                      </span>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <a
                      href={`/api/materials/${mat._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-surface text-brand hover:bg-brand hover:text-white font-bold text-xs border border-brand/20 transition-all"
                    >
                      Open Resource
                    </a>
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
        )}

        {/* Mock Tests Engine */}
        <div className="border-b border-line pb-4 pt-8">
          <h3 className="text-xl font-bold font-display text-ink">
            Mock Tests & Evaluations
          </h3>
          <p className="text-sm text-slate mt-1">
            Grades must meet the pass criteria to qualify for professional certifications.
          </p>
        </div>

        {tests.length === 0 ? (
          <p className="text-slate text-sm">No mock tests configured for this course yet.</p>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => {
              const isUnlocked = enrolled;
              return (
                <div
                  key={test._id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    isUnlocked
                      ? "bg-white border-line hover:border-education/40 shadow-sm"
                      : "bg-surface/50 border-line opacity-75"
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`p-2 rounded-lg ${
                        isUnlocked ? "bg-education/10 text-education" : "bg-slate/10 text-slate"
                      }`}
                    >
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-ink block">{test.title}</span>
                      <span className="text-[10px] font-bold text-slate uppercase tracking-wider block mt-0.5">
                        {test.durationMins} Mins • Pass Mark: {test.passMark} • {test.questionCount} Questions
                      </span>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <Button
                      href={`/account?test=${test._id}`}
                      variant="secondary"
                      className="px-3.5 py-1.5 text-xs font-bold border-education text-education hover:bg-education/5"
                    >
                      Start Test
                    </Button>
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
        )}
      </div>

      {/* 2. Sidebar Enrollment & Access CTAs */}
      <div className="lg:col-span-4 lg:sticky lg:top-28">
        {enrolled ? (
          <Card hoverLift={false} className="border-l-4 border-success bg-success/5 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-4 font-bold">
              ✓
            </div>
            <h4 className="text-xl font-bold font-display text-ink mb-2">
              Active Enrollment
            </h4>
            <p className="text-xs text-slate leading-relaxed mb-6">
              You are currently enrolled in this program. Gated files and mock tests are fully unlocked.
            </p>
            <Button href="/account" variant="primary" className="w-full py-3">
              Go to Account Dashboard
            </Button>
          </Card>
        ) : (
          <Card hoverLift={false} className="border-l-4 border-brand bg-surface/30 p-8">
            <h4 className="text-xl font-bold font-display text-ink mb-4">
              Get Program Access
            </h4>
            <p className="text-sm text-slate leading-relaxed mb-6">
              Unlock the full syllabus, workbook downloads, and server-scored mock test validations.
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
                  This program is offered through participating colleges. Enter your current batch code to enroll.
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

            {/* Auth Login Drawer option */}
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

      {/* Auth Modal Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 z-50 bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-card border border-line p-8 shadow-2xl relative">
            <button
              onClick={() => setShowAuthForm(false)}
              className="absolute top-4 right-4 text-slate hover:text-ink font-bold text-lg"
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
                    placeholder="e.g. John Doe"
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
