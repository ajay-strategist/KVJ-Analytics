"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Laptop, Calendar, DollarSign, ArrowRight, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { QuickPurchaseModal } from "@/components/QuickPurchaseModal";

interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  banner_url?: string;
  duration?: string;
  fee_inr: number;
  offer_price_inr?: number | null;
  offer_label?: string | null;
  is_locked: boolean;
}

interface OnlineCoursesClientProps {
  courses: Course[];
  header?: { headingLead?: string; headingAccent?: string; intro?: string };
}

export function OnlineCoursesClient({ courses, header }: OnlineCoursesClientProps) {
  const h = {
    headingLead: header?.headingLead || "Online",
    headingAccent: header?.headingAccent || "Courses",
    intro: header?.intro || "Self-paced video curricula. Code spreadsheets, build telemetry dashboards, and consolidate financial pipelines.",
  };
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="w-full bg-[#050505] text-zinc-200 min-h-screen pt-28 pb-24">
      {/* Backlight spotlights */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#0072FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        {/* Breadcrumb & Title */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-sm text-zinc-400 font-light mb-4">
            <Link href="/training" className="hover:text-[#00F0FF] transition-colors">Training Hub</Link>
            <span>/</span>
            <span className="text-[#00F0FF]">Online Courses</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight leading-none">
            {h.headingLead} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#0072FF] to-[#00F0FF] bg-[size:200%_auto]">{h.headingAccent}</span>
          </h1>
          <p className="text-zinc-400 font-light text-lg leading-relaxed mt-4">
            {h.intro}
          </p>
        </div>

        {/* Catalog Grid */}
        {courses.length === 0 ? (
          <div className="border border-white/5 bg-[#0A0A0C]/55 rounded-3xl p-16 text-center max-w-2xl mx-auto backdrop-blur-xl">
            <Laptop className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Courses Available</h3>
            <p className="text-zinc-400 font-light">Our syllabus catalog is being updated. Please check back shortly or request a custom program.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course, idx) => {
              const hasOffer = course.offer_price_inr != null && course.offer_price_inr < course.fee_inr;
              const displayPrice = hasOffer ? course.offer_price_inr : course.fee_inr;

              return (
                <Reveal key={course.id} delay={idx * 85} variant="up">
                  <div className="bg-[#0A0A0C]/75 border border-white/5 hover:border-[#00F0FF]/30 rounded-3xl p-6 flex flex-col h-full hover:shadow-[0_8px_32px_rgba(0,240,255,0.04)] hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">

                    {/* Course Banner */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 mb-5 shrink-0">
                      {course.banner_url ? (
                        <img
                          src={course.banner_url}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-[#0072FF]/10 via-[#00F0FF]/5 to-[#0A0A0C] flex items-center justify-center">
                          <Laptop className="w-10 h-10 text-brand/30" />
                        </div>
                      )}

                      {/* Floating locked badge */}
                      {course.is_locked && (
                        <div className="absolute top-3 left-3 bg-[#050505]/85 border border-[#00F0FF]/35 px-2.5 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-md">
                          <Lock className="w-3 h-3 text-[#00F0FF]" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Locked</span>
                        </div>
                      )}

                      {/* Floating offer label */}
                      {hasOffer && course.offer_label && (
                        <div className="absolute top-3 right-3 bg-brand/90 text-[#050505] font-extrabold text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                          {course.offer_label}
                        </div>
                      )}
                    </div>

                    {/* Title & description */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold font-display text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-zinc-400 text-sm font-light leading-relaxed mt-2.5 line-clamp-3">
                          {course.summary}
                        </p>
                      </div>

                      {/* Specifications (Duration, Price) */}
                      <div className="border-t border-white/5 pt-4 mt-5 space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500 flex items-center gap-1.5 font-light">
                            <Calendar className="w-4 h-4 text-[#0072FF]" /> Duration
                          </span>
                          <span className="text-zinc-200 font-medium">{course.duration || "Self-Paced"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-500 flex items-center gap-1.5 font-light">
                            <DollarSign className="w-4 h-4 text-[#00F0FF]" /> Price
                          </span>
                          <div className="text-right">
                            {hasOffer ? (
                              <div className="flex items-center gap-2">
                                <span className="text-zinc-500 line-through text-xs">₹{course.fee_inr}</span>
                                <span className="text-[#00F0FF] font-bold">₹{displayPrice}</span>
                              </div>
                            ) : (
                              <span className="text-zinc-200 font-bold">
                                {course.fee_inr > 0 ? `₹${course.fee_inr}` : "Free"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5 mt-5">
                      <Link href={`/training/${course.slug}`} className="w-full">
                        <Button variant="secondary" className="w-full text-xs py-2 bg-[#0A0A0C]/50 hover:bg-zinc-900 border-white/5">
                          Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => setSelectedCourse(course)}
                        className="w-full text-xs py-2 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold hover:brightness-110 border-none flex items-center justify-center gap-1"
                      >
                        Buy Now <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </Container>

      {/* Quick Purchase Modal */}
      {selectedCourse && (
        <QuickPurchaseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
