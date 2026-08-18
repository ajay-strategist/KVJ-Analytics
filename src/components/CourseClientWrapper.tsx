"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Loader2,
  PlayCircle,
  ShieldCheck,
  AlertCircle,
  Clock,
  Award,
  Tag,
  Percent,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { supabase } from "@/lib/supabase";

interface Lesson {
  id: string;
  title: string;
  kind: "material" | "activity";
  max_score: number | null;
  video_url?: string | null;
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
    banner_url?: string | null;
    duration?: string | null;
    fee_inr: number;
    offer_price_inr?: number | null;
    offer_label?: string | null;
    offer_expiry?: string | null;
    is_locked: boolean;
    isPaid: boolean;
    introduction?: string | null;
    syllabus?: string[] | null;
    hide_pricing?: boolean;
  };
  modules: Module[];
}

// Live Countdown Component
function OfferCountdown({ expiryDate, pulse = false }: { expiryDate: string; pulse?: boolean }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(expiryDate) - +new Date();
      if (difference <= 0) {
        return null;
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  if (!timeLeft) return null;

  return (
    <div
      id="offer-countdown"
      className={`bg-[#10B981]/5 border border-[#10B981]/25 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2.5 shadow-[0_0_15px_rgba(16,185,129,0.05)] w-full transition-all duration-500 ${
        pulse ? "ring-2 ring-[#10B981] scale-105 shadow-[0_0_25px_rgba(16,185,129,0.25)] bg-[#10B981]/15" : ""
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] flex items-center gap-1.5 font-mono">
        <Clock className="w-3.5 h-3.5 animate-pulse" /> Offer Ends In
      </span>
      <div className="flex gap-4 text-white font-mono text-xl font-bold">
        <div className="flex flex-col items-center">
          <span className="text-[#10B981]">{String(timeLeft.days).padStart(2, "0")}</span>
          <span className="text-[8px] text-zinc-500 font-sans uppercase font-bold tracking-wider mt-1">Days</span>
        </div>
        <span className="text-[#10B981]/30">:</span>
        <div className="flex flex-col items-center">
          <span className="text-[#10B981]">{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="text-[8px] text-zinc-500 font-sans uppercase font-bold tracking-wider mt-1">Hours</span>
        </div>
        <span className="text-[#10B981]/30">:</span>
        <div className="flex flex-col items-center">
          <span className="text-[#10B981]">{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="text-[8px] text-zinc-500 font-sans uppercase font-bold tracking-wider mt-1">Mins</span>
        </div>
        <span className="text-[#10B981]/30">:</span>
        <div className="flex flex-col items-center">
          <span className="text-[#10B981]">{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="text-[8px] text-zinc-500 font-sans uppercase font-bold tracking-wider mt-1">Secs</span>
        </div>
      </div>
    </div>
  );
}

export function CourseClientWrapper({ course, modules }: CourseClientWrapperProps) {
  const router = useRouter();
  
  const segmentLower = course.segment?.toLowerCase() || "";
  const isOneToOne = segmentLower === "one-to-one";
  const isCollegeOrCompany = segmentLower === "colleges" || segmentLower === "corporate";
  const isOnline = segmentLower === "online-courses" || segmentLower === "online" || (!isOneToOne && !isCollegeOrCompany);

  const [user, setUser] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [unlockCode, setUnlockCode] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [unlockSuccess, setUnlockSuccess] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);

  // Offer interaction states
  const [offerApplied, setOfferApplied] = useState(false);
  const [pulseTimer, setPulseTimer] = useState(false);

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
      async (_event: any, session: any) => {
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

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError("");
    setUnlockSuccess("");

    if (!user) {
      router.push(`/signin?redirect=/training/${course.slug}`);
      return;
    }

    if (!unlockCode || unlockCode.trim().length < 6) {
      setUnlockError("Access code must be at least 6 characters.");
      return;
    }

    setUnlockLoading(true);
    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: unlockCode,
          userId: user.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to unlock course.");
      }

      setUnlockSuccess(data.message || "Course successfully unlocked!");
      setEnrolled(true);
      router.refresh();
    } catch (err: any) {
      setUnlockError(err.message || "Unlock failed.");
    } finally {
      setUnlockLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      router.push(`/signin?redirect=/training/${course.slug}`);
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

      const finalPrice = course.offer_price_inr != null ? course.offer_price_inr : course.fee_inr;

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
                amount: finalPrice,
              }),
            });

            if (webhookVerify.ok) {
              setEnrolled(true);
              alert("Payment successful! Access granted.");
              router.push(`/training/${course.slug}/learn`);
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
          color: "#0D9488",
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

  const handleFreeEnroll = async () => {
    if (!user) {
      router.push(`/signin?redirect=/training/${course.slug}`);
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/enroll/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Enrollment failed.");
      }

      setEnrolled(true);
      alert("Enrolled successfully in free program!");
      router.push(`/training/${course.slug}/learn`);
    } catch (err: any) {
      alert(err.message || "Enrollment failed.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
      </div>
    );
  }

  const finalPrice = course.offer_price_inr != null ? course.offer_price_inr : course.fee_inr;
  const isDiscounted = course.offer_price_inr != null && course.offer_price_inr < course.fee_inr;

  // Build the clean syllabus list (topics only, no lessons cards)
  const syllabusList =
    course.syllabus && Array.isArray(course.syllabus) && course.syllabus.length > 0
      ? course.syllabus
      : modules.flatMap((m) => m.lessons.map((l) => l.title)).length > 0
      ? modules.flatMap((m) => m.lessons.map((l) => l.title))
      : [];

  return (
    <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-start text-left">
      {/* LEFT COLUMN: Main content (lg:col-span-2) */}
      <div className="lg:col-span-2 space-y-10">
        {/* 1. Header Info */}
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#10B981] uppercase px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 animate-pulse">
              {course.segment} program
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mt-2 leading-tight tracking-tight">
            {course.title}
          </h1>
          <p className="text-zinc-400 font-light text-lg leading-relaxed mt-2">
            {course.summary}
          </p>
        </div>

        {/* 2. Banner Image */}
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-line bg-[#07130E]">
          {course.banner_url && (
            <img
              src={course.banner_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* 4. Description */}
        <div className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold font-display text-white border-b border-line pb-2">Description</h2>
          {course.introduction ? (
            <div
              className="prose prose-invert max-w-none text-zinc-400 font-light leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: course.introduction }}
            />
          ) : (
            <p className="text-zinc-550 italic">No program introduction details uploaded yet.</p>
          )}
        </div>

        {/* 5. Syllabus */}
        <div className="space-y-4 pt-2">
          <h2 className="text-2xl font-bold font-display text-white border-b border-line pb-2">Syllabus</h2>
          {syllabusList.length === 0 ? (
            <p className="text-zinc-500 italic text-sm">No curriculum syllabus listed for this track yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {syllabusList.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-3.5 p-4 rounded-xl border border-line bg-[#0B2A22]/35 backdrop-blur-xl">
                  <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                  <span className="text-zinc-350 text-sm leading-relaxed font-light">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky enrollment panel (lg:col-span-1) */}
      <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-6 w-full">
        {/* Countdown Timer at the top of the column */}
        {!course.hide_pricing && isDiscounted && course.offer_expiry && (
          <OfferCountdown expiryDate={course.offer_expiry} pulse={pulseTimer} />
        )}


        {enrolled ? (
          <Card hoverLift={false} className="border border-emerald-500/25 bg-emerald-500/5 p-8 text-center rounded-3xl relative overflow-hidden w-full">
            <div className="absolute inset-0 bg-emerald-500/2 opacity-[0.02] pointer-events-none" />
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 font-bold border border-emerald-500/20">
              ✓
            </div>
            <h4 className="text-xl font-bold font-display text-white mb-2">
              Program Unlocked
            </h4>
            <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
              You are enrolled in this training. You can view all learning modules and launch the dashboard player.
            </p>
            <Button
              onClick={() => router.push(`/training/${course.slug}/learn`)}
              className="w-full py-4 bg-gradient-to-r from-[#10B981] to-[#0D9488] text-black font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(16,185,129,0.15)] rounded-full text-center whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch Course Player</span>
            </Button>
          </Card>
        ) : (
          <Card hoverLift={false} className="border border-line bg-[#0B2A22]/55 backdrop-blur-xl p-8 rounded-3xl w-full flex flex-col space-y-6">
            {/* Title / Header */}
            <div>
              <h4 className="text-xl font-bold font-display text-white">
                {isOneToOne ? "Personal Mentorship" : isCollegeOrCompany ? "Institutional Roster" : "Get Program Access"}
              </h4>
            </div>

            {/* Duration block */}
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">
                Course Duration
              </span>
              <div className="flex items-center gap-2 mt-1.5 text-white font-semibold">
                <Clock className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{course.duration || "Self-Paced"}</span>
              </div>
            </div>

            {/* Pricing / Investment block */}
            {!course.hide_pricing && (
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">
                  Course Investment
                </span>
                {isOnline ? (
                  course.isPaid ? (
                    <div className="space-y-2 mt-2">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-bold text-white font-display">
                          ₹{finalPrice}
                        </span>
                        {isDiscounted && (
                          <span className="text-zinc-500 line-through text-sm font-mono">
                            ₹{course.fee_inr}
                          </span>
                        )}
                      </div>
                      {isDiscounted && course.offer_label && (
                        <span className="text-xs font-bold text-[#10B981] mt-1 block">
                          ★ {course.offer_label}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2 text-zinc-300 text-sm font-semibold">
                      Free Enrollment
                    </div>
                  )
                ) : isOneToOne ? (
                  <div className="mt-2 text-zinc-300 text-sm font-semibold">
                    Personalized 1:1 Training Plan
                  </div>
                ) : (
                  <div className="mt-2 text-zinc-300 text-sm font-semibold">
                    Managed by Organization / College
                  </div>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              {/* Register Now / Enquire Button based on Segment */}
              {isOnline ? (
                course.hide_pricing ? (
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/training/register?course=${course.slug}${window.location.search || ""}`)}
                    className="w-full py-4 text-center font-bold text-[15px] block whitespace-nowrap rounded-full shrink-0"
                  >
                    <span>Register Interest</span>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={finalPrice > 0 ? handlePayment : handleFreeEnroll}
                    disabled={checkoutLoading}
                    className="w-full py-4 text-center font-bold text-[15px] block whitespace-nowrap rounded-full shrink-0"
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Initializing...
                      </span>
                    ) : (
                      <span>Buy Now / Enroll Now</span>
                    )}
                  </Button>
                )
              ) : isOneToOne ? (
                <Button
                  variant="primary"
                  onClick={() => router.push(`/training/register?course=${course.slug}${window.location.search}`)}
                  className="w-full py-4 text-center font-bold text-[15px] block whitespace-nowrap rounded-full shrink-0"
                >
                  Register Interest
                </Button>
              ) : (
                <div className="space-y-3 w-full">
                  <div className="p-4 bg-[#0B2A22]/20 border border-white/5 rounded-2xl text-center space-y-1.5">
                    <div className="text-xs font-bold text-zinc-350">Controlled Enrollment</div>
                    <div className="text-[11px] text-zinc-500 leading-relaxed">
                      Enrollment is managed directly by your company or college roster administrator.
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/training/register?course=${course.slug}${window.location.search}`)}
                    className="w-full py-4 text-center font-bold text-[15px] block whitespace-nowrap rounded-full shrink-0"
                  >
                    Register Roster Interest
                  </Button>
                </div>
              )}

              {/* Get Offer outline button for Online Courses only */}
              {isOnline && !course.hide_pricing && isDiscounted && !offerApplied && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setOfferApplied(true);
                    setPulseTimer(true);
                    setTimeout(() => setPulseTimer(false), 2000);
                    setTimeout(() => {
                      document.getElementById("offer-countdown")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 100);
                  }}
                  className="w-full py-4 text-center font-bold text-[15px] block whitespace-nowrap rounded-full shrink-0"
                >
                  Get Offer
                </Button>
              )}

              {/* Confirmation + copyable dummy coupon code */}
              {isOnline && !course.hide_pricing && offerApplied && isDiscounted && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center space-y-2.5 animate-fadeIn">
                  <div className="text-sm font-bold flex items-center justify-center gap-1.5">
                    <span>Offer Applied ✓</span>
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    Use code{" "}
                    <span
                      className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded border border-white/10 select-all cursor-pointer hover:bg-zinc-700 transition-colors"
                      title="Click to copy"
                      onClick={() => {
                        navigator.clipboard.writeText("EARLYBIRD30");
                        alert("Coupon code EARLYBIRD30 copied to clipboard!");
                      }}
                    >
                      EARLYBIRD30
                    </span>{" "}
                    at checkout for guaranteed pricing.
                  </div>
                </div>
              )}
            </div>

            {/* Unlock Code section - only visible for One-to-One, College/Company, or locked courses */}
            {(!isOnline || course.is_locked) && (
              <div className="border-t border-line pt-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block font-mono">
                  {isOneToOne ? "Redeem Voucher Code" : "Enter Institutional Code"}
                </span>

                {unlockError && (
                  <div className="bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl flex items-start space-x-2 text-rose-450">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold">{unlockError}</span>
                  </div>
                )}

                {unlockSuccess && (
                  <div className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-xl flex items-start space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold">{unlockSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUnlockSubmit} className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    maxLength={20}
                    required
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
                    placeholder={isOneToOne ? "ENTER VOUCHER CODE" : "ENTER BATCH PASSCODE"}
                    className="w-full px-4 py-2.5 rounded-xl border border-line text-sm bg-[#07130E] text-white placeholder-zinc-500 focus:outline-none focus:border-[#10B981]/40 text-center font-mono tracking-wider font-bold"
                  />
                  <Button
                    type="submit"
                    disabled={unlockLoading}
                    className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center justify-center shrink-0 border border-line rounded-xl"
                  >
                    {unlockLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isOneToOne ? "Redeem Voucher" : "Verify Code"}
                  </Button>
                </form>
              </div>
            )}

            {!user && (
              <div className="text-center border-t border-line pt-4">
                <p className="text-xs text-zinc-400 font-light">
                  Already enrolled?{" "}
                  <button
                    onClick={() => router.push(`/signin?redirect=/training/${course.slug}`)}
                    className="text-[#10B981] font-bold hover:underline cursor-pointer bg-transparent border-0 font-sans"
                  >
                    Log In Here
                  </button>
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
