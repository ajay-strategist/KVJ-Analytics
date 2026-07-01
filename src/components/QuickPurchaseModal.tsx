"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Clock,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  BadgePercent,
  BookOpen,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

interface QuickPurchaseCourse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  banner_url?: string | null;
  duration?: string;
  fee_inr: number;
  offer_price_inr?: number | null;
  offer_label?: string | null;
}

interface QuickPurchaseModalProps {
  course: QuickPurchaseCourse | null;
  onClose: () => void;
}

function MiniCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 23, seconds: 0 });

  useEffect(() => {
    const target = Date.now() + (47 * 3600 + 23 * 60) * 1000;
    const interval = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) { clearInterval(interval); return; }
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#00F0FF]">
      <Clock className="w-3.5 h-3.5 animate-pulse shrink-0" />
      <span>
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
      <span className="text-zinc-400 font-sans font-normal text-xs">left</span>
    </div>
  );
}

export function QuickPurchaseModal({ course, onClose }: QuickPurchaseModalProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course) return;
    setAuthLoading(true);
    setEnrolled(false);
    setSuccess(false);
    setError("");

    supabase.auth.getSession().then(async ({ data }: { data: any }) => {
      const session = data?.session;
      const u = session?.user || null;
      setUser(u);
      if (u) {
        const { data } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", u.id)
          .eq("course_slug", course.slug)
          .eq("status", "active")
          .maybeSingle();
        if (data) setEnrolled(true);
      }
      setAuthLoading(false);
    });
  }, [course?.slug]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!course) return null;

  const hasOffer = course.offer_price_inr != null && course.offer_price_inr < course.fee_inr;
  const finalPrice = hasOffer ? course.offer_price_inr! : course.fee_inr;

  const handleBuy = async () => {
    setError("");

    if (!user) {
      router.push(`/signin?redirect=/training/online-courses`);
      onClose();
      return;
    }

    if (enrolled) {
      router.push(`/training/${course.slug}/learn`);
      onClose();
      return;
    }

    setCheckoutLoading(true);
    try {
      if (finalPrice === 0) {
        const { error: dbErr } = await supabase
          .from("enrollments")
          .upsert(
            { user_id: user.id, course_slug: course.slug, enrollment_method: "paid", status: "active" },
            { onConflict: "user_id,course_slug" }
          );
        if (dbErr) throw dbErr;
        setSuccess(true);
        setEnrolled(true);
        setCheckoutLoading(false);
        return;
      }

      const res = await fetch("/api/payments/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug, userId: user.id }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Order creation failed");

      await new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Razorpay SDK failed to load."));
        document.body.appendChild(script);
      });

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "KVJ Analytics",
        description: `Enrollment: ${course.title}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          setCheckoutLoading(true);
          try {
            const verifyRes = await fetch("/api/payments/razorpay/webhook", {
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
            if (verifyRes.ok) {
              setEnrolled(true);
              setSuccess(true);
            } else {
              setError("Payment validation failed. Please contact support.");
            }
          } catch {
            setError("Verification error. Please refresh your dashboard.");
          } finally {
            setCheckoutLoading(false);
          }
        },
        prefill: { email: user.email },
        theme: { color: "#0072FF" },
        modal: { ondismiss: () => setCheckoutLoading(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Checkout failed. Please try again.");
      setCheckoutLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-md bg-[#0A0A0C] border border-white/8 rounded-3xl shadow-[0_0_80px_rgba(0,240,255,0.06)] overflow-hidden">

        {course.banner_url && (
          <div className="relative w-full h-36 overflow-hidden bg-zinc-950">
            <img src={course.banner_url} alt={course.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0C]/50 to-[#0A0A0C]" />
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#0A0A0C]/80 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-7 pb-7 pt-5 space-y-5">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white">Enrollment Confirmed!</h3>
                <p className="text-zinc-400 text-sm font-light mt-1">
                  Welcome to <span className="text-white font-medium">{course.title}</span>. Your learning journey begins now.
                </p>
              </div>
              <Button
                onClick={() => { router.push(`/training/${course.slug}/learn`); onClose(); }}
                className="w-full py-3.5 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold rounded-full flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Launch Course Player
              </Button>
              <button onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                Return to catalog
              </button>
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#00F0FF] uppercase px-2.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/20">
                    Online Course
                  </span>
                  {hasOffer && (
                    <span className="text-[10px] font-bold font-mono tracking-widest text-amber-400 uppercase px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center gap-1">
                      <BadgePercent className="w-3 h-3" /> {course.offer_label}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold font-display text-white leading-snug">{course.title}</h3>
                <p className="text-zinc-400 text-sm font-light mt-1.5 line-clamp-2">{course.summary}</p>
              </div>

              {hasOffer && (
                <div className="flex items-center justify-between px-4 py-3 bg-amber-400/5 border border-amber-400/15 rounded-xl">
                  <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Limited Offer
                  </span>
                  <MiniCountdown />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#111116] border border-white/5 rounded-2xl p-3.5">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5">Duration</span>
                  <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
                    <Clock className="w-4 h-4 text-[#0072FF] shrink-0" />
                    {course.duration || "Self-Paced"}
                  </div>
                </div>
                <div className="bg-[#111116] border border-white/5 rounded-2xl p-3.5">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5">Investment</span>
                  {hasOffer ? (
                    <div>
                      <span className="text-[#00F0FF] font-bold text-lg font-display">₹{finalPrice}</span>
                      <span className="text-zinc-500 line-through text-xs ml-2">₹{course.fee_inr}</span>
                    </div>
                  ) : (
                    <span className="text-white font-bold text-lg font-display">
                      {course.fee_inr > 0 ? `₹${course.fee_inr}` : "Free"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {["Full curriculum access", "Self-paced video lessons", "Certificate on completion"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {authLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-[#00F0FF]" />
                </div>
              ) : enrolled ? (
                <Button
                  onClick={() => { router.push(`/training/${course.slug}/learn`); onClose(); }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-full flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Already Enrolled — Launch Course
                </Button>
              ) : (
                <div className="space-y-2.5">
                  <Button
                    onClick={handleBuy}
                    disabled={checkoutLoading}
                    className="w-full py-4 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold rounded-full text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(0,240,255,0.18)] hover:brightness-110 transition-all"
                  >
                    {checkoutLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Initializing...</>
                    ) : user ? (
                      <><Zap className="w-4 h-4" /> Buy Now — ₹{finalPrice}</>
                    ) : (
                      <><BookOpen className="w-4 h-4" /> Sign In to Purchase</>
                    )}
                  </Button>

                  <button
                    onClick={() => { router.push(`/training/${course.slug}`); onClose(); }}
                    className="w-full py-2.5 text-center text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    View full course details →
                  </button>
                </div>
              )}

              <p className="text-center text-[10px] text-zinc-600 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Secured by Razorpay · 256-bit SSL
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
