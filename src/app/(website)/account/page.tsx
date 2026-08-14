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

        const enrolledSlugs = (enrolls || []).map((e: any) => e.course_slug);

        // 4. Fetch All Published Courses
        const { data: dbCourses } = await supabase
          .from("courses")
          .select("id, slug, title, summary, banner_url, duration, fee_inr, offer_price_inr, offer_label, offer_expiry, is_locked")
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        const courses = dbCourses || [];

        // Split into Enrolled and Suggested
        const enrolled = courses.filter((c: any) => enrolledSlugs.includes(c.slug));
        const suggested = courses.filter((c: any) => !enrolledSlugs.includes(c.slug));

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
      <div className="w-full min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#10B981] mx-auto" />
          <p className="text-muted text-sm font-light">Loading student account...</p>
        </div>
      </div>
    );
  }

  // Active offers on suggested courses
  const activeOffers = suggestedCourses.filter(
    (c) => c.offer_price_inr && c.offer_expiry && new Date(c.offer_expiry) > new Date()
  );

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-700 pt-32 pb-24 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#0D9488]/5 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        {/* Profile Card */}
        <div className="relative bg-white border border-slate-100 p-6 md:p-8 rounded-[2rem] shadow-[0_4px_25px_rgba(0,0,0,0.02)] mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#10B981]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#0D9488]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#0D9488] flex items-center justify-center text-white text-2xl font-bold font-display shadow-md shadow-[#10B981]/15">
              {profile?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 leading-tight">
                {profile?.name || profile?.full_name}
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{user?.email}</span>
                {profile?.organization && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>{profile.organization}</span>
                  </>
                )}
                {profile?.profession && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="capitalize">{profile.profession}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center text-xs font-bold text-slate-600 hover:text-rose-600 transition-all bg-slate-50 hover:bg-rose-50/50 border border-slate-200/60 hover:border-rose-100 rounded-xl px-4.5 py-2.5 shadow-sm shrink-0 active:scale-95 relative z-10"
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
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  My Enrolled Programs
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Launch the interactive course players to access curriculum videos, files, and exercises.
                </p>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="p-12 border border-dashed border-slate-200 rounded-[2rem] text-center bg-white shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1.5 font-display">
                    No Enrolled Programs
                  </h4>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 font-medium">
                    You have not enrolled in or unlocked any courses yet. Browse the catalog to start learning.
                  </p>
                  <Button
                    onClick={() => router.push("/training/online-courses")}
                    variant="primary"
                    className="text-xs font-bold"
                  >
                    Browse Online Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white border border-slate-100/90 p-5 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#10B981]/25 hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 relative group overflow-hidden"
                    >
                      {/* Left: Banner + Titles */}
                      <div className="flex gap-4.5 items-center">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-[#ECFDF5] hidden sm:flex items-center justify-center">
                          {course.banner_url ? (
                            <img src={course.banner_url} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-6 h-6 text-[#10B981]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                              {course.duration || "Self-Paced"}
                            </span>
                          </div>
                          <h4 className="text-base font-bold font-display text-slate-900 mt-2 group-hover:text-[#10B981] transition-colors">
                            {course.title}
                          </h4>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-1 max-w-md font-medium">
                            {course.summary}
                          </p>
                        </div>
                      </div>

                      {/* Launch Button */}
                      <div className="w-full sm:w-auto shrink-0">
                        <Button 
                          href={`/training/${course.slug}/learn`}
                          variant="primary"
                          className="w-full sm:w-auto text-xs py-3 px-5 rounded-xl font-bold"
                        >
                          Launch Player
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Applied Internships */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Applied Internships
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Applications submitted for KVJ Analytics internship cohorts.
                </p>
              </div>

              {appliedInternships.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 rounded-[1.5rem] bg-white text-center text-sm text-slate-400 font-medium shadow-sm">
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
                        className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-all duration-300"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {internTitle}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 font-mono">
                            Applied: {date} • Duration: {internDur}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#10B981] px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
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
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand" /> Suggested Programs
                </h3>
              </div>

              {suggestedCourses.length === 0 ? (
                <p className="text-xs text-slate-400 italic">You have unlocked all available courses!</p>
              ) : (
                <div className="space-y-4">
                  {suggestedCourses.map((c) => {
                    const hasOffer = c.offer_price_inr != null && c.offer_price_inr < c.fee_inr;

                    return (
                      <div
                        key={c.id}
                        className="bg-white border border-slate-100 p-5 rounded-2xl hover:border-brand/20 hover:shadow-[0_6px_25px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col space-y-3.5 relative overflow-hidden"
                      >
                        {hasOffer && (
                          <div className="absolute top-3 right-3 bg-brand text-black text-[9px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider font-mono">
                            {c.offer_label || "Sale"}
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {c.title}
                          </h4>
                          <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed font-medium">
                            {c.summary}
                          </p>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            {hasOffer ? `₹${c.offer_price_inr} (demo)` : (c.fee_inr > 0 ? `₹${c.fee_inr} (demo)` : "Free")}
                          </span>
                          <Link href={`/training/${c.slug}`} className="text-[10px] font-extrabold text-[#10B981] hover:underline flex items-center gap-1 font-mono uppercase tracking-wider">
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
              <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] border border-indigo-100 rounded-3xl p-6 relative overflow-hidden shadow-[0_4px_25px_rgba(99,102,241,0.03)]">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                <h4 className="text-xs font-bold text-indigo-600 font-display flex items-center gap-1.5 uppercase tracking-widest font-mono">
                  <Gift className="w-4 h-4 animate-bounce" /> Active Discount Promo
                </h4>
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                  Special enrollment rates are active for selected programs. Complete your Razorpay registration before the expiration timer runs out!
                </p>

                <div className="mt-4 space-y-3">
                  {activeOffers.map((c) => (
                    <div key={c.id} className="bg-white/80 backdrop-blur-sm border border-indigo-100/55 p-3.5 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">{c.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">Expires: {new Date(c.offer_expiry!).toLocaleDateString("en-IN")}</span>
                      </div>
                      <Link href={`/training/${c.slug}`} className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[9px] uppercase tracking-wider font-mono transition-colors">
                        Claim
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Timed Test Results */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Evaluation Scorecards
                </h3>
              </div>

              {testAttempts.length === 0 ? (
                <div className="p-6 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-xs text-slate-400 font-medium shadow-sm">
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
                        className={`p-4 rounded-2xl border bg-white flex items-center justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.02)] ${
                          attempt.passed ? "border-emerald-100 hover:border-emerald-200" : "border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 block truncate max-w-[140px]">
                            Test ID: {attempt.test_slug.slice(0, 8)}...
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5 font-mono">
                            {submitDate} • Score: {attempt.score} / {attempt.max_score || "10"}
                          </span>
                        </div>
                        <span className={`text-[9px] font-extrabold font-mono uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                          attempt.passed
                            ? "bg-[#F0FBF7] text-[#08A88A] border-[#DDF8F0]"
                            : "bg-[#FFF2F4] text-[#E11D48] border-[#FFE0E5]"
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
        <div className="w-full min-h-screen bg-surface flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
        </div>
      }
    >
      <StudentAccountDashboard />
    </Suspense>
  );
}
