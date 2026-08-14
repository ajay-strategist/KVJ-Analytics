"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  Loader2,
  AlertCircle,
  Upload,
  Check,
  X,
  Eye,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Course {
  id: string;
  slug: string;
  title: string;
  segment: "corporate" | "college";
  summary: string;
  registration_form_html: string | null;
  created_at: string;
}

export default function AdminCampaignsPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Form Editor States
  const [regFormHtml, setRegFormHtml] = useState("");
  const [regFormPreview, setRegFormPreview] = useState(false);
  const [copiedRegPrompt, setCopiedRegPrompt] = useState(false);
  const [savingRegForm, setSavingRegForm] = useState(false);
  const [regFormSaved, setRegFormSaved] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/courses");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load courses");
      const list = data.courses || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedCourse(list[0]);
        setRegFormHtml(list[0].registration_form_html || "");
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setRegFormHtml(course.registration_form_html || "");
    setRegFormPreview(false);
    setRegFormSaved(false);
  };

  const handleSaveForm = async () => {
    if (!selectedCourse) return;
    setSavingRegForm(true);
    try {
      const res = await fetch(`/api/admin/courses/${selectedCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_form_html: regFormHtml }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      
      // Update local state
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, registration_form_html: regFormHtml }
            : c
        )
      );
      if (selectedCourse) {
        setSelectedCourse({ ...selectedCourse, registration_form_html: regFormHtml });
      }

      setRegFormSaved(true);
      setTimeout(() => setRegFormSaved(false), 2500);
    } catch (err: any) {
      alert("Failed to save form: " + err.message);
    } finally {
      setSavingRegForm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h1 className="text-xl font-bold font-display text-ink flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-brand" />
              Marketing Campaigns
            </h1>
            <p className="text-xs text-slate mt-1">
              Announce programs, custom registration forms, and track user leads dynamically.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Courses Sidebar Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-line rounded-card p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate">Select Program</h3>
              <div className="space-y-1.5">
                {courses.map((c) => {
                  const isSelected = selectedCourse?.id === c.id;
                  const hasForm = !!c.registration_form_html;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleSelectCourse(c)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-brand/10 text-brand border border-brand/20 shadow-sm"
                          : "bg-surface hover:bg-surface/70 text-ink border border-transparent"
                      }`}
                    >
                      <span className="truncate pr-2">{c.title}</span>
                      {hasForm ? (
                        <span className="text-[10px] bg-emerald-100 border border-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full shrink-0 font-bold">
                          Active Form
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate px-1.5 py-0.5 rounded-full shrink-0 font-medium">
                          No Form
                        </span>
                      )}
                    </button>
                  );
                })}
                {courses.length === 0 && (
                  <p className="text-xs text-slate italic p-2">No courses available.</p>
                )}
              </div>
            </div>

            {/* Other Campaigns Placeholder */}
            <div className="bg-card border border-line rounded-card p-4 space-y-3 opacity-60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate">Other Campaigns</h3>
              <div className="space-y-2 text-[11px] text-slate leading-relaxed">
                <div className="p-2.5 rounded-xl bg-surface border border-line/45">
                  <span className="font-semibold text-ink block mb-0.5">📧 Email Broadcasts</span>
                  Create scheduled newsletter campaigns.
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-line/45">
                  <span className="font-semibold text-ink block mb-0.5">💬 WhatsApp Marketing</span>
                  Send automated broadcast updates.
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-line/45">
                  <span className="font-semibold text-ink block mb-0.5">🎯 UTM Trackers</span>
                  Generate custom marketing tags.
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Form Workspace */}
          <div className="lg:col-span-3">
            {selectedCourse ? (
              <div className="bg-card border border-line rounded-card overflow-hidden">
                
                {/* Workspace Header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-surface/30 border-b border-line">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5 text-brand" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-ink">{selectedCourse.title}</h2>
                    <p className="text-[10px] text-slate mt-0.5">
                      Configure the custom lead registration form for this program.
                    </p>
                  </div>
                  <a
                    href={`/training/register?course=${selectedCourse.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-brand flex items-center gap-1 hover:underline shrink-0 bg-white border border-line shadow-sm px-2.5 py-1.5 rounded-lg"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview live
                  </a>
                </div>

                <div className="p-6 space-y-6">
                  
                  {/* AI Helper Banner */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-800">Generate Custom Form with AI</span>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Copy the prompt template below, paste it into ChatGPT or Gemini to generate your premium registrations form, and paste the output HTML in the editor box.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const prompt = `Generate a beautiful, self-contained HTML registration form for the KVJ Analytics "${selectedCourse.title}" training program.

IMPORTANT TECHNICAL RULES:
1. Inline ALL CSS and JS — no external files, no CDN links.
2. The <form> tag MUST have these exact attributes:
   data-kvj-form="registration"
   data-kvj-endpoint="/api/register"
   data-kvj-course="${selectedCourse.slug}"
3. Add these hidden fields inside the form:
   <input type="hidden" name="course_id" value="${selectedCourse.slug}">
   <input type="hidden" name="training_mode" value="online">
   <input type="hidden" name="source_page" value="/training/${selectedCourse.slug}">
   <input type="text" name="username" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true">
4. Use these exact name/id attributes on visible fields:
   name="name"  name="email"  name="phone"  name="age"
   name="current_profession"  name="location"  name="district"  name="message"
5. Add this JS submit handler before </body>:
   document.querySelector('[data-kvj-form="registration"]').addEventListener('submit', async function(e) {
     e.preventDefault();
     if (this.querySelector('[name="username"]').value) return;
     const btn = this.querySelector('[type="submit"]');
     btn.disabled = true; btn.textContent = 'Submitting...';
     const data = Object.fromEntries(new FormData(this));
     const gc = n => (document.cookie.match('(^| )'+n+'=([^;]+)')||[])[2]||'';
     data.utm_source = gc('utm_source'); data.utm_medium = gc('utm_medium');
     data.utm_campaign = gc('utm_campaign'); data.landing_page = location.href;
     data.referrer = document.referrer; data.status = 'new';
     delete data.username;
     try {
       const r = await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
       const j = await r.json();
       if (r.ok) { this.innerHTML = '<div style="text-align:center;padding:40px"><div style="font-size:48px">✅</div><h2 style="color:#08A88A">Registration Received!</h2><p style="color:#666">We will contact you shortly.</p></div>'; }
       else { alert('Error: '+(j.error||'Try again')); btn.disabled=false; btn.textContent='Register'; }
     } catch { alert('Network error'); btn.disabled=false; }
   });

DESIGN:
- Premium glassmorphism / dark gradient design (dark navy/purple gradient)
- Split layout: left panel with course highlights, right panel with the form
- Font: Poppins from Google Fonts
- Course: ${selectedCourse.title}
- Fields to include: Full Name, Email, Phone, Age, Current Status (dropdown: Student/Professional/Job Seeker), Country, District (Kerala districts)
- Submit button text: "Register for ${selectedCourse.title}"
- Footer note: "Your information is secure and confidential."`;

                        navigator.clipboard.writeText(prompt).then(() => {
                          setCopiedRegPrompt(true);
                          setTimeout(() => setCopiedRegPrompt(false), 2500);
                        }).catch(() => alert("Copy failed. Try selecting and copying manually."));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                        copiedRegPrompt
                          ? "bg-emerald-100 border border-emerald-300 text-emerald-700"
                          : "bg-white border border-amber-300 hover:border-amber-400 text-amber-700"
                      }`}
                    >
                      {copiedRegPrompt ? (
                        <>✅ Copied Prompt Template!</>
                      ) : (
                        <>📋 Copy AI Prompt Template</>
                      )}
                    </button>
                  </div>

                  {/* HTML Input + Preview Tabs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate">
                        Registration HTML Code
                      </label>
                      <div className="flex items-center bg-surface p-0.5 rounded-lg border border-line">
                        <button
                          type="button"
                          onClick={() => setRegFormPreview(false)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                            !regFormPreview ? "bg-white text-ink shadow-sm font-bold" : "text-slate hover:text-ink"
                          }`}
                        >
                          Code Editor
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegFormPreview(true)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                            regFormPreview ? "bg-white text-ink shadow-sm font-bold" : "text-slate hover:text-ink"
                          }`}
                        >
                          Live Preview
                        </button>
                      </div>
                    </div>

                    {!regFormPreview ? (
                      <textarea
                        value={regFormHtml}
                        onChange={(e) => setRegFormHtml(e.target.value)}
                        placeholder={`Paste form HTML here...`}
                        rows={18}
                        className="w-full px-3.5 py-3 border border-line rounded-2xl text-xs font-mono bg-slate-950 text-green-300 resize-y focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        spellCheck={false}
                      />
                    ) : (
                      <div className="w-full border border-line rounded-2xl overflow-hidden bg-surface" style={{ height: 500 }}>
                        {regFormHtml ? (
                          <iframe
                            srcDoc={regFormHtml}
                            sandbox="allow-scripts allow-forms allow-same-origin"
                            className="w-full h-full border-0"
                            title="Registration Form Preview"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate text-xs italic">
                            No HTML pasted yet. Write/paste some HTML to see the preview.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* HTML Import Upload */}
                  <div className="flex items-center gap-3 border border-dashed border-line rounded-2xl p-4">
                    <Upload className="w-4 h-4 text-slate shrink-0" />
                    <span className="text-[11px] text-slate">Import HTML structure from a file:</span>
                    <label className="ml-auto cursor-pointer bg-surface border border-line rounded-lg px-3 py-1.5 text-[11px] font-bold text-ink hover:border-brand/40 hover:text-brand transition-all">
                      Choose File
                      <input
                        type="file"
                        accept=".html,text/html"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => setRegFormHtml(ev.target?.result as string || "");
                          reader.readAsText(file);
                        }}
                      />
                    </label>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-line">
                    <button
                      type="button"
                      onClick={handleSaveForm}
                      disabled={savingRegForm}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        regFormSaved
                          ? "bg-emerald-100 border border-emerald-300 text-emerald-700"
                          : "bg-brand text-white hover:bg-brand/90"
                      }`}
                    >
                      {savingRegForm ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      ) : regFormSaved ? (
                        <><Check className="w-4 h-4" /> Form Saved Successfully!</>
                      ) : (
                        <><Check className="w-4 h-4" /> Save Registration Form</>
                      )}
                    </button>

                    {regFormHtml && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Are you sure you want to clear the form HTML?")) {
                            setRegFormHtml("");
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold border border-error/20 text-error hover:bg-error/5 transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 inline mr-1" /> Clear HTML
                      </button>
                    )}

                    <p className="text-[10px] text-slate ml-auto">
                      Registration Form URL: <code className="bg-surface px-1.5 py-0.5 rounded border border-line">/training/register?course={selectedCourse.slug}</code>
                    </p>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-card border border-line rounded-card p-12 text-center text-slate text-sm">
                No course selected. Please select a program from the left panel.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
