"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Send, Lock, Unlock, Mail, Phone, User, Building, Loader2, AlertCircle, CheckCircle2, Laptop } from "lucide-react";
import { Container } from "./ui/Container";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { supabase } from "@/lib/supabase";

interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  banner_url?: string;
  duration?: string;
  fee_inr: number;
  is_locked: boolean;
}

interface CategoryPageClientProps {
  categorySlug: "corporate" | "colleges" | "one-to-one";
  categoryName: string;
  categoryDesc: string;
  courses: Course[];
}

export function CategoryPageClient({ categorySlug, categoryName, categoryDesc, courses }: CategoryPageClientProps) {
  const router = useRouter();
  
  // User & enrollment states
  const [user, setUser] = useState<any>(null);
  const [enrolledSlugs, setEnrolledSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Inquiry Form States
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryOrg, setInquiryOrg] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState("");

  // Unlock Code States
  const [unlockCode, setUnlockCode] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [unlockSuccess, setUnlockSuccess] = useState("");

  useEffect(() => {
    const checkAuthAndEnrollments = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Fetch enrollments to check which courses are unlocked
        const { data: enrolls } = await supabase
          .from("enrollments")
          .select("course_slug")
          .eq("user_id", session.user.id)
          .eq("status", "active");

        if (enrolls) {
          setEnrolledSlugs(new Set(enrolls.map((e) => e.course_slug)));
        }

        // Prefill form details
        setInquiryEmail(session.user.email || "");
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, phone, organization")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profile) {
          setInquiryName(profile.name || "");
          setInquiryPhone(profile.phone || "");
          setInquiryOrg(profile.organization || "");
        }
      }
      setLoading(false);
    };

    checkAuthAndEnrollments();
  }, [categorySlug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryError("");
    setInquiryLoading(true);

    // Map URL slug category to DB category
    const dbCategory = categorySlug === "one-to-one" ? "one_to_one" : (categorySlug === "corporate" ? "corporate" : "college");

    try {
      const { error: dbError } = await supabase
        .from("inquiries")
        .insert([
          {
            category: dbCategory,
            name: inquiryName,
            email: inquiryEmail,
            phone: inquiryPhone,
            organization: inquiryOrg,
            message: inquiryMessage,
          },
        ]);

      if (dbError) throw dbError;

      setInquirySuccess(true);
      setInquiryMessage("");
    } catch (err: any) {
      setInquiryError(err.message || "Failed to submit inquiry.");
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError("");
    setUnlockSuccess("");

    if (!user) {
      router.push(`/signin?redirect=/training/${categorySlug}`);
      return;
    }

    if (!unlockCode || unlockCode.length !== 6) {
      setUnlockError("Unlock code must be exactly 6 digits.");
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
        throw new Error(data.error || "Verification failed.");
      }

      setUnlockSuccess(data.message || "Course successfully unlocked!");
      setUnlockCode("");
      
      // Update local state to unlock the course slug
      if (data.courseSlug) {
        const newEnrolls = new Set(enrolledSlugs);
        newEnrolls.add(data.courseSlug);
        setEnrolledSlugs(newEnrolls);
      }
      
      router.refresh();
    } catch (err: any) {
      setUnlockError(err.message || "Invalid unlock code.");
    } finally {
      setUnlockLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#050505] text-zinc-200 min-h-screen pt-28 pb-24 relative overflow-hidden">
      {/* Background spotlights */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[#0072FF]/5 rounded-full blur-[160px] pointer-events-none" />

      <Container>
        {/* Breadcrumbs & Header */}
        <div className="max-w-4xl mb-16 text-left">
          <div className="flex items-center gap-2 text-sm text-zinc-400 font-light mb-4">
            <Link href="/training" className="hover:text-[#00F0FF] transition-colors">Training Hub</Link>
            <span>/</span>
            <span className="text-[#00F0FF]">{categoryName}</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
            {categoryName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#0072FF] to-[#00F0FF] bg-[size:200%_auto]">Training</span>
          </h1>
          <p className="text-zinc-400 font-light text-lg leading-relaxed mt-4">
            {categoryDesc}
          </p>
        </div>

        {/* Multi column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Left Column (7 cols): Unlock Box + Course catalog */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Enter unlock code */}
            <Card hoverLift={false} className="border border-[#00F0FF]/25 bg-[#00F0FF]/5 p-6 rounded-2xl relative overflow-hidden">
              <h3 className="text-md font-bold text-white flex items-center gap-2 font-display">
                <Unlock className="w-5 h-5 text-[#00F0FF]" /> Redeem Batch Access Code
              </h3>
              <p className="text-xs text-zinc-450 mt-2 font-light leading-relaxed">
                If you have been provided a 6-digit unlock code by your college coordinator or corporate account admin, enter it below to gain instant access to your syllabus.
              </p>

              {unlockError && (
                <div className="bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl flex items-start space-x-2 text-rose-450 mt-4">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold">{unlockError}</span>
                </div>
              )}

              {unlockSuccess && (
                <div className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-xl flex items-start space-x-2 text-emerald-455 mt-4">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold">{unlockSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUnlockSubmit} className="flex gap-2 mt-4">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit code"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40 text-center font-mono tracking-widest font-bold"
                />
                <Button
                  type="submit"
                  disabled={unlockLoading}
                  className="py-2.5 px-5 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold text-xs border-none flex items-center justify-center shrink-0"
                >
                  {unlockLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Verify & Unlock"}
                </Button>
              </form>

              {!user && (
                <p className="text-[10px] text-zinc-500 mt-2 text-center">
                  * You must be signed in to student account to redeem.{" "}
                  <Link href={`/signin?redirect=/training/${categorySlug}`} className="text-[#00F0FF] font-bold underline">Log In</Link>
                </p>
              )}
            </Card>

            {/* Course catalog under this track */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display text-white border-b border-white/5 pb-2">Program Curriculum Catalog</h3>
              
              {courses.length === 0 ? (
                <p className="text-zinc-550 italic text-sm">No curriculum syllabus listed for this track yet.</p>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => {
                    const isUnlocked = !course.is_locked || enrolledSlugs.has(course.slug);

                    return (
                      <div
                        key={course.id}
                        className="bg-[#0A0A0C]/55 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#0072FF]/30 transition-all duration-300 relative group overflow-hidden"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/5 bg-zinc-950 hidden sm:block">
                            {course.banner_url ? (
                              <img src={course.banner_url} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[#00F0FF]">
                                <Laptop className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-md font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-tight">
                              {course.title}
                            </h4>
                            <p className="text-zinc-500 text-xs mt-1.5 line-clamp-1 max-w-sm font-light">
                              {course.summary}
                            </p>
                          </div>
                        </div>

                        {/* Lock / Play badge */}
                        <div className="flex items-center gap-3 shrink-0">
                          {isUnlocked ? (
                            <Link href={`/training/${course.slug}/learn`}>
                              <Button className="py-2 px-4 bg-[#00F0FF] text-black font-bold text-xs border-none flex items-center gap-1">
                                Launch Program
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/training/${course.slug}`}>
                              <Button variant="secondary" className="py-2 px-4 bg-zinc-900 border-white/5 text-zinc-300 text-xs flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-zinc-500" /> Details &amp; Unlock
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): "Request a Programme" Inquiry Form */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              {inquirySuccess ? (
                <Card hoverLift={false} className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl text-center relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 font-bold">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold font-display text-white mb-2">Request Submitted!</h3>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">
                    Thank you. We have received your training inquiry details. A program analyst will review your requirements and reach out to discuss team alignment.
                  </p>
                </Card>
              ) : (
                <Card hoverLift={false} className="bg-[#0A0A0C]/55 border border-white/5 p-8 rounded-3xl backdrop-blur-xl">
                  <h3 className="text-xl font-bold font-display text-white mb-2">Request a Programme</h3>
                  <p className="text-xs text-zinc-500 font-light mb-6">Discuss customized cohorts, curriculum models, or team license pricing.</p>

                  {inquiryError && (
                    <div className="bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl flex items-start space-x-2 text-rose-450 mb-4">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold">{inquiryError}</span>
                    </div>
                  )}

                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                        Contact Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="e.g. Samuel Mathew"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                        <input
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="e.g. sam@company.com"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                        <input
                          type="tel"
                          required
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="e.g. 98450 12345"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                        College / Corporation Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={inquiryOrg}
                          onChange={(e) => setInquiryOrg(e.target.value)}
                          placeholder="e.g. Cochin University"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                        Program Requirements / Comments
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Detail expected team size, target topics, timeline..."
                        className="w-full px-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={inquiryLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-extrabold flex items-center justify-center gap-1.5 border-none"
                    >
                      {inquiryLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Submit Program Request</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
