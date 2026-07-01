"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  BookOpen,
  Award,
  LogOut,
  Clock,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Lock,
  Calendar,
  Gift
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

function StudentAccountDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  // Dashboard sections data
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [suggestedCourses, setSuggestedCourses] = useState<any[]>([]);
  const [appliedInternships, setAppliedInternships] = useState<any[]>([]);
  const [testAttempts, setTestAttempts] = useState<any[]>([]);

  useEffect(() => {
    const initDashboard = async () => {
      // 1. Fetch Auth Session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/signin?redirect=/account");
        return;
      }
      setUser(session.user);

      try {
        // 2. Fetch User Profile
        const { data: profData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        setProfile(profData || { name: session.user.user_metadata?.name || "Student" });

        // 3. Fetch All Active Enrollments
        const { data: enrolls } = await supabase
          .from("enrollments")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("status", "active");

        const enrolledSlugs = (enrolls || []).map((e) => e.course_slug);

        // 4. Fetch All Published Courses
        const { data: dbCourses } = await supabase
          .from("courses")
          .select("id, slug, title, summary, banner_url, duration, fee_inr, offer_price_inr, offer_label, offer_expiry, is_locked")
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        const courses = dbCourses || [];

        // Split into Enrolled and Suggested
        const enrolled = courses.filter((c) => enrolledSlugs.includes(c.slug));
        const suggested = courses.filter((c) => !enrolledSlugs.includes(c.slug));

        setEnrolledCourses(enrolled);
        setSuggestedCourses(suggested);

        // 5. Fetch Applied Internships (match by user's email)
        const { data: internshipApps } = await supabase
          .from("internship_applications")
          .select("id, created_at, message, internships(title, duration)")
          .eq("email", session.user.email);

        setAppliedInternships(internshipApps || []);

        // 6. Fetch Timed Mock Test Attempts
        const { data: attempts } = await supabase
          .from("test_attempts")
          .select("*")
          .eq("user_id", session.user.id)
          .order("submitted_at", { ascending: false });

        setTestAttempts(attempts || []);
      } catch (err) {
        console.error("Error loading account dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  const handleSignOut = async () => {
    setLoading(true);
    // Clear cookies
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    await supabase.auth.signOut();
    router.push("/training");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#00F0FF] mx-auto" />
          <p className="text-zinc-500 text-sm font-light">Loading student account...</p>
        </div>
      </div>
    );
  }

  // Active offers on suggested courses
  const activeOffers = suggestedCourses.filter(
    (c) => c.offer_price_inr && c.offer_expiry && new Date(c.offer_expiry) > new Date()
  );

  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-200 pt-32 pb-24 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#0072FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        {/* Profile Card */}
        <div className="relative bg-[#0A0A0C]/55 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-xl mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute inset-0 bg-[#00F0FF]/2 opacity-[0.02] pointer-events-none" />
          
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#0072FF] flex items-center justify-center text-black text-2xl font-bold font-display shadow-lg">
              {profile?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display text-white leading-tight">
                {profile?.name || profile?.full_name}
              </h2>
              <p className="text-sm text-zinc-400 font-light mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                <span>{user?.email}</span>
                {profile?.organization && (
                  <>
                    <span className="text-zinc-700">•</span>
                    <span>{profile.organization}</span>
                  </>
                )}
                {profile?.profession && (
                  <>
                    <span className="text-zinc-700">•</span>
                    <span className="capitalize">{profile.profession}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center text-xs font-bold text-zinc-400 hover:text-rose-400 transition-colors bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 shadow-sm shrink-0 active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out Account
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (8 cols): Enrolled Courses + Applications */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. Enrolled Courses */}
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xl font-bold font-display text-white">
                  My Enrolled Programs
                </h3>
                <p className="text-xs text-zinc-500 font-light mt-1">
                  Launch the interactive course players to access curriculum videos, files, and exercises.
                </p>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="p-12 border border-dashed border-zinc-800 rounded-3xl text-center bg-[#0A0A0C]/20 backdrop-blur-sm">
                  <BookOpen className="w-10 h-10 text-zinc-650 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-white mb-1.5 font-display">
                    No Enrolled Programs
                  </h4>
                  <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6 font-light">
                    You have not enrolled in or unlocked any courses yet. Browse the catalog to start learning.
                  </p>
                  <Button
                    onClick={() => router.push("/training/online-courses")}
                    className="bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold text-xs"
                  >
                    Browse Online Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-[#0A0A0C]/55 border border-white/5 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#00F0FF]/25 transition-all duration-300 relative group overflow-hidden"
                    >
                      {/* Left: Banner + Titles */}
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-zinc-900 hidden sm:block">
                          {course.banner_url ? (
                            <img src={course.banner_url} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-zinc-850 flex items-center justify-center text-[#00F0FF]">
                              <BookOpen className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono tracking-widest text-[#00F0FF] uppercase bg-[#00F0FF]/10 px-2 py-0.5 rounded border border-[#00F0FF]/15">
                              {course.duration || "Self-Paced"}
                            </span>
                          </div>
                          <h4 className="text-md font-bold font-display text-white mt-1.5 group-hover:text-[#00F0FF] transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-zinc-500 text-xs mt-1 line-clamp-1 max-w-md font-light">
                            {course.summary}
                          </p>
                        </div>
                      </div>

                      {/* Launch Button */}
                      <Link href={`/training/${course.slug}/learn`} className="w-full sm:w-auto shrink-0">
                        <Button className="w-full sm:w-auto py-2.5 px-5 bg-zinc-800 hover:bg-[#0072FF] hover:text-black font-bold text-xs border-white/5 transition-all flex items-center justify-center gap-1">
                          Launch Player <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Applied Internships */}
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xl font-bold font-display text-white">
                  Applied Internships
                </h3>
                <p className="text-xs text-zinc-500 font-light mt-1">
                  Applications submitted for KVJ Analytics internship cohorts.
                </p>
              </div>

              {appliedInternships.length === 0 ? (
                <div className="p-8 border border-zinc-800 rounded-3xl bg-[#0A0A0C]/25 text-center text-sm text-zinc-500 font-light">
                  You have not applied for any internship programs yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {appliedInternships.map((app) => {
                    const date = new Date(app.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    });
                    const internTitle = app.internships?.title || "Data Analytics Intern";
                    const internDur = app.internships?.duration || "3 Months";

                    return (
                      <div
                        key={app.id}
                        className="bg-[#0A0A0C]/35 border border-white/5 p-4.5 rounded-2xl flex items-center justify-between gap-4"
                      >
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            {internTitle}
                          </h4>
                          <p className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider mt-1 font-mono">
                            Applied: {date} • Duration: {internDur}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#00F0FF] px-2.5 py-1 bg-[#00F0FF]/10 rounded border border-[#00F0FF]/20">
                          Applied
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (4 cols): Suggested + active offers */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 3. Suggested & Offers */}
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand" /> Suggested Programs
                </h3>
              </div>

              {suggestedCourses.length === 0 ? (
                <p className="text-xs text-zinc-550 italic">You have unlocked all available courses!</p>
              ) : (
                <div className="space-y-4">
                  {suggestedCourses.map((c) => {
                    const hasOffer = c.offer_price_inr != null && c.offer_price_inr < c.fee_inr;

                    return (
                      <div
                        key={c.id}
                        className="bg-[#0A0A0C]/55 border border-white/5 p-5 rounded-2xl hover:border-zinc-700 transition-colors flex flex-col space-y-3.5 relative overflow-hidden"
                      >
                        {hasOffer && (
                          <div className="absolute top-2 right-2 bg-brand/90 text-black text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                            {c.offer_label || "Sale"}
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {c.title}
                          </h4>
                          <p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed font-light">
                            {c.summary}
                          </p>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                          <span className="text-xs font-bold text-zinc-450 font-mono">
                            {hasOffer ? `₹${c.offer_price_inr} (demo)` : (c.fee_inr > 0 ? `₹${c.fee_inr} (demo)` : "Free")}
                          </span>
                          <Link href={`/training/${c.slug}`} className="text-[10px] font-bold text-[#00F0FF] hover:underline flex items-center gap-1 font-mono uppercase tracking-wider">
                            Unlock Program <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Active Promo Deals Panel */}
            {activeOffers.length > 0 && (
              <div className="bg-gradient-to-tr from-[#0072FF]/10 via-[#00F0FF]/5 to-[#0A0A0C] border border-[#00F0FF]/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-[#00F0FF]/10 rounded-full blur-2xl" />
                <h4 className="text-sm font-bold text-[#00F0FF] font-display flex items-center gap-1.5 uppercase tracking-widest font-mono">
                  <Gift className="w-4 h-4 animate-bounce" /> Active Discount Promo
                </h4>
                <p className="text-xs text-zinc-450 mt-2 font-light leading-relaxed">
                  Special enrollment rates are active for selected programs. Complete your Razorpay registration before the expiration timer runs out!
                </p>

                <div className="mt-4 space-y-3">
                  {activeOffers.map((c) => (
                    <div key={c.id} className="bg-[#050505]/45 border border-white/5 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">{c.title}</span>
                        <span className="text-[10px] text-zinc-500 font-mono mt-1 block">Expires: {new Date(c.offer_expiry!).toLocaleDateString("en-IN")}</span>
                      </div>
                      <Link href={`/training/${c.slug}`} className="py-1 px-3 rounded bg-[#00F0FF] hover:bg-[#00D8FF] text-black font-extrabold text-[9px] uppercase tracking-wider font-mono transition-colors">
                        Claim
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Timed Test Results */}
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold font-display text-white">
                  Evaluation Scorecards
                </h3>
              </div>

              {testAttempts.length === 0 ? (
                <div className="p-6 border border-white/5 bg-[#0A0A0C]/25 rounded-2xl text-center text-xs text-zinc-500 font-light">
                  No mock test assessments submitted yet.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {testAttempts.map((attempt) => {
                    const submitDate = new Date(attempt.submitted_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short"
                    });

                    return (
                      <div
                        key={attempt.id}
                        className={`p-4 rounded-xl border bg-[#0A0A0C]/45 flex items-center justify-between transition-colors ${
                          attempt.passed ? "border-emerald-500/20" : "border-rose-500/20"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-white block truncate max-w-[140px]">
                            Test ID: {attempt.test_slug.slice(0, 8)}...
                          </span>
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mt-1 font-mono">
                            {submitDate} • Score: {attempt.score} / {attempt.max_score || "10"}
                          </span>
                        </div>
                        <span className={`text-[8px] font-extrabold font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                          attempt.passed
                            ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-455 border border-rose-500/20"
                        }`}>
                          {attempt.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </Container>
    </div>
  );
}

export default function StudentAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#050505] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00F0FF]" />
        </div>
      }
    >
      <StudentAccountDashboard />
    </Suspense>
  );
}
