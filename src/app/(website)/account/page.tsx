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
  Gift,
  GraduationCap,
  Briefcase,
  ExternalLink
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
        // Auto-claim any invited batch student enrollments
        if (session.user.email) {
          try {
            await fetch("/api/auth/claim-enrollments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: session.user.email, user_id: session.user.id })
            });
          } catch (claimErr) {
            console.error("Auto-claim enrollments warning:", claimErr);
          }
        }

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

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-700 pb-24 relative overflow-hidden">
      
      {/* Premium Dark Hero Header */}
      <div className="relative bg-gradient-to-br from-[#061C16] via-[#0B2A22] to-[#041712] text-white pt-36 pb-20 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        {/* Glow Spheres */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#0D9488]/10 rounded-full blur-[150px] pointer-events-none" />

        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            
            {/* User Info */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#10B981] to-[#0D9488] flex items-center justify-center text-white text-3xl font-extrabold font-display shadow-lg shadow-[#10B981]/20 border border-white/10 shrink-0">
                {profile?.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black font-display tracking-tight leading-none text-white">
                    {profile?.name || profile?.full_name}
                  </h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-lg border border-[#10B981]/25">
                    Student
                  </span>
                </div>
                <p className="text-sm text-slate-300 font-medium flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span>{user?.email}</span>
                  {profile?.organization && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="text-[#34D399] font-bold">{profile.organization}</span>
                    </>
                  )}
                  {profile?.profession && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="capitalize">{profile.profession}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center text-xs font-bold text-slate-300 hover:text-rose-450 transition-all bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 rounded-2xl px-5 py-3 shadow-sm shrink-0 active:scale-95 duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out Account
            </button>
          </div>

          {/* Quick Metrics Cards (Glassmorphism Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10">
            
            {/* Metric 1 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black block font-display text-white">{enrolledCourses.length}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Programs</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black block font-display text-white">
                  {testAttempts.filter(a => a.passed).length} / {testAttempts.length}
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assessments Passed</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black block font-display text-white">{appliedInternships.length}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Internships Applied</span>
              </div>
            </div>

          </div>
        </Container>
      </div>

      {/* Main Content Sections */}
      <Container className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Grid: Enrolled Courses (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  My Enrolled Programs
                </h3>
                <span className="text-xs text-[#10B981] font-extrabold uppercase tracking-wider font-mono">
                  Instant Access
                </span>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="p-16 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center bg-white shadow-soft">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-5 border border-slate-100">
                    <BookOpen className="w-8 h-8 text-slate-350" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2 font-display">
                    No Enrolled Programs
                  </h4>
                  <p className="text-sm text-slate-550 max-w-sm mx-auto mb-8 font-medium leading-relaxed">
                    You haven't been enrolled in any programs yet. Browse the course catalog to choose your training module.
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
                <div className="space-y-5">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white border border-slate-150 p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#10B981]/40 hover:shadow-[0_12px_36px_rgba(16,185,129,0.06)] transition-all duration-300 relative group overflow-hidden"
                    >
                      {/* Left: Banner + Detail Info */}
                      <div className="flex gap-5 items-center">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-[#ECFDF5] hidden sm:flex items-center justify-center">
                          {course.banner_url ? (
                            <img src={course.banner_url} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-8 h-8 text-[#10B981]" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-2.5 py-0.5 rounded-lg font-mono">
                              {course.duration || "Self-Paced"}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/60 px-2.5 py-0.5 rounded-lg font-mono">
                              Active Status
                            </span>
                          </div>
                          <h4 className="text-lg font-bold font-display text-slate-900 mt-2.5 group-hover:text-[#10B981] transition-colors leading-tight">
                            {course.title}
                          </h4>
                          <p className="text-slate-500 text-xs mt-1.5 line-clamp-1 max-w-md font-medium leading-relaxed">
                            {course.summary}
                          </p>
                        </div>
                      </div>

                      {/* Launch Button */}
                      <div className="w-full sm:w-auto shrink-0">
                        <Button 
                          href={`/training/${course.slug}/learn`}
                          variant="primary"
                          className="w-full sm:w-auto text-xs py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-1.5"
                        >
                          Launch Player <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Applied Internships inside Main Content */}
            <div className="space-y-4 pt-4">
              <div className="border-b border-slate-200/60 pb-3">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Applied Internships
                </h3>
              </div>

              {appliedInternships.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 rounded-[1.5rem] bg-white text-center text-sm text-slate-400 font-medium shadow-sm">
                  You have not applied for any internship cohorts yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="bg-white border border-slate-150 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:border-[#10B981]/20 transition-all duration-300"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {internTitle}
                          </h4>
                          <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-2 font-mono">
                            Submitted: {date} • {internDur}
                          </p>
                        </div>
                        <span className="text-[10px] font-extrabold font-mono uppercase tracking-widest text-[#10B981] px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-100 shrink-0">
                          Active
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Grid: Assessments Scorecards (4 columns) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="border-b border-slate-200/60 pb-3">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Mock Test scorecards
                </h3>
              </div>

              {testAttempts.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-xs text-slate-450 font-medium shadow-sm leading-relaxed">
                  No mock test assessments submitted yet. Launch a practice module to begin evaluation.
                </div>
              ) : (
                <div className="space-y-4">
                  {testAttempts.map((attempt) => {
                    const submitDate = new Date(attempt.submitted_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short"
                    });

                    return (
                      <div
                        key={attempt.id}
                        className={`p-4.5 rounded-2xl border bg-white flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-md ${
                          attempt.passed ? "border-emerald-100 hover:border-emerald-200" : "border-slate-150 hover:border-slate-250"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-900 block truncate max-w-[150px]">
                            Mock: {attempt.test_slug.split("-").map((w: any) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
                            {submitDate} • Score: {attempt.score} / {attempt.max_score || "10"}
                          </span>
                        </div>
                        <span className={`text-[9px] font-extrabold font-mono uppercase tracking-wider px-2.5 py-1.5 rounded-lg border ${
                          attempt.passed
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-500 border-rose-100"
                        }`}>
                          {attempt.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Tips Box */}
            <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] border border-indigo-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl" />
              <h4 className="text-xs font-extrabold text-indigo-600 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Certification Tip
              </h4>
              <p className="text-xs text-slate-550 mt-2 font-medium leading-relaxed">
                Unlock 80%+ marks on mock test evaluation scorecards to auto-activate target corporate recommendation tokens.
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Section: Explore Other Programs Grid */}
        {suggestedCourses.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-200/60 space-y-6">
            <div>
              <h3 className="text-2xl font-black font-display text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand" /> Explore More Programs & Certifications
              </h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Expand your skills. Enroll in additional data analytics, mock tests, and practice pipelines directly from your dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedCourses.map((c) => {
                const hasOffer = c.offer_price_inr != null && c.offer_price_inr < c.fee_inr;

                return (
                  <div
                    key={c.id}
                    className="bg-white border border-slate-150 p-6 rounded-[2rem] hover:border-[#10B981]/30 hover:shadow-[0_12px_36px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group"
                  >
                    {hasOffer && (
                      <div className="absolute top-4 right-4 bg-brand text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-lg uppercase tracking-wider font-mono">
                        {c.offer_label || "Offer"}
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono border border-emerald-100/50">
                        {c.duration || "Self-Paced"}
                      </span>
                      <h4 className="text-base font-bold font-display text-slate-900 leading-snug group-hover:text-[#10B981] transition-colors pt-1">
                        {c.title}
                      </h4>
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
                        {c.summary}
                      </p>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Price</span>
                        <span className="text-sm font-extrabold text-slate-800 font-mono">
                          {hasOffer ? `₹${c.offer_price_inr}` : (c.fee_inr > 0 ? `₹${c.fee_inr}` : "Free")}
                        </span>
                      </div>
                      <Link 
                        href={`/training/${c.slug}`} 
                        className="py-2.5 px-4 rounded-xl bg-transparent hover:bg-emerald-50 border border-slate-200 hover:border-[#10B981]/40 text-slate-700 hover:text-[#10B981] font-extrabold text-[10px] uppercase tracking-wider font-mono transition-all duration-300 flex items-center gap-1.5"
                      >
                        Explore Details <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
