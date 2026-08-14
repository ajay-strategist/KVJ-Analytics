"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { Send, CheckCircle2, AlertCircle, Loader2, ArrowRight, BookOpen, User, Phone, Mail, MapPin, Briefcase } from "lucide-react";
import { Button } from "../ui/Button";
import { REGISTRATION_FIELDS, FormField } from "@/lib/registrationSchema";

// Cookie helper
function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return "";
}

interface DynamicRegisterFormProps {
  courses: { id: string; slug: string; title: string }[];
  initialCourseSlug?: string;
}

export function DynamicRegisterForm({ courses, initialCourseSlug }: DynamicRegisterFormProps) {
  // Find course id by slug
  const matchedCourse = courses.find((c) => c.slug === initialCourseSlug);
  
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
    email: "",
    phone: "",
    whatsapp_number: "",
    course_id: matchedCourse?.id || "",
    training_mode: "",
    location: "",
    current_profession: "",
    organization: "",
    college_name: "",
    current_education: "",
    preferred_start_date: "",
    message: "",
    // Honeypot spam protection field (must remain empty)
    username: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  
  // Track lead draft ID to update the same record instead of duplicating
  const [draftId, setDraftId] = useState<string | null>(null);
  const prevDraftData = useRef({ name: "", email: "", phone: "", course_id: "" });

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  // 1. Initialise Cloudflare Turnstile if site key is configured
  useEffect(() => {
    if (!turnstileSiteKey) return;

    let widgetId: any = null;
    const renderWidget = () => {
      if ((window as any).turnstile && document.getElementById("turnstile-container")) {
        try {
          widgetId = (window as any).turnstile.render("#turnstile-container", {
            sitekey: turnstileSiteKey,
            callback: (token: string) => {
              setTurnstileToken(token);
            },
          });
        } catch (e) {
          console.error("Turnstile render error:", e);
        }
      }
    };

    if ((window as any).turnstile) {
      renderWidget();
    } else {
      const timer = setInterval(() => {
        if ((window as any).turnstile) {
          renderWidget();
          clearInterval(timer);
        }
      }, 200);
      return () => clearInterval(timer);
    }

    return () => {
      if (widgetId && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(widgetId);
        } catch (e) {}
      }
    };
  }, [turnstileSiteKey]);

  // 2. Client-Side Field Validations
  const validateField = (id: string, value: string): string => {
    if (!value) return "";
    if (id === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Invalid email address format.";
    }
    if (id === "phone" || id === "whatsapp_number") {
      const cleanPhone = value.replace(/\D/g, "");
      if (cleanPhone.length < 10) return "Phone number must be at least 10 digits.";
    }
    return "";
  };

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    const err = validateField(id, value);
    setValidationErrors((prev) => ({ ...prev, [id]: err }));
  };

  // 3. Debounced Draft Auto-Save
  useEffect(() => {
    const { name, email, phone, course_id } = formData;
    
    // Check basic conditions to initiate draft save
    if (name.trim().length >= 2 && email && phone) {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isPhoneValid = phone.replace(/\D/g, "").length >= 10;
      
      if (isEmailValid && isPhoneValid) {
        // Prevent duplicate draft saves if basic values haven't changed
        if (
          prevDraftData.current.name === name &&
          prevDraftData.current.email === email &&
          prevDraftData.current.phone === phone &&
          prevDraftData.current.course_id === course_id
        ) {
          return;
        }

        const handler = setTimeout(async () => {
          try {
            prevDraftData.current = { name, email, phone, course_id };
            
            const response = await fetch("/api/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...formData,
                id: draftId, // Pass draft ID to update same row
                status: "draft",
                utmSource: getCookie("utm_source") || localStorage.getItem("utm_source") || "",
                utmMedium: getCookie("utm_medium") || localStorage.getItem("utm_medium") || "",
                utmCampaign: getCookie("utm_campaign") || localStorage.getItem("utm_campaign") || "",
                utmTerm: getCookie("utm_term") || localStorage.getItem("utm_term") || "",
                utmContent: getCookie("utm_content") || localStorage.getItem("utm_content") || "",
                landing_page: getCookie("first_landing_page") || localStorage.getItem("first_landing_page") || window.location.pathname,
                referrer: getCookie("first_referrer") || localStorage.getItem("first_referrer") || document.referrer || "direct",
              }),
            });

            if (response.ok) {
              const resData = await response.json();
              if (resData.id) {
                setDraftId(resData.id);
              }
            }
          } catch (err) {
            console.warn("Draft auto-save error:", err);
          }
        }, 2000); // 2 seconds debounce delay

        return () => clearTimeout(handler);
      }
    }
  }, [formData.name, formData.email, formData.phone, formData.course_id, draftId]);

  // 4. Final Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Final checks
    const errors: Record<string, string> = {};
    REGISTRATION_FIELDS.forEach((field) => {
      // Evaluate conditional visibility
      let visible = true;
      if (field.conditional) {
        visible = formData[field.conditional.fieldId] === field.conditional.value;
      }
      
      if (visible && field.required && !formData[field.id]) {
        errors[field.id] = `${field.label} is required.`;
      }
      const valErr = validateField(field.id, formData[field.id]);
      if (valErr) {
        errors[field.id] = valErr;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: draftId, // Pass draft ID to promote it to active status
          status: "new",
          turnstileToken,
          utmSource: getCookie("utm_source") || localStorage.getItem("utm_source") || "",
          utmMedium: getCookie("utm_medium") || localStorage.getItem("utm_medium") || "",
          utmCampaign: getCookie("utm_campaign") || localStorage.getItem("utm_campaign") || "",
          utmTerm: getCookie("utm_term") || localStorage.getItem("utm_term") || "",
          utmContent: getCookie("utm_content") || localStorage.getItem("utm_content") || "",
          landing_page: getCookie("first_landing_page") || localStorage.getItem("first_landing_page") || window.location.pathname,
          referrer: getCookie("first_referrer") || localStorage.getItem("first_referrer") || document.referrer || "direct",
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit registration. Please try again.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Render dynamic inputs
  const renderFieldInput = (field: FormField) => {
    const baseInputStyle = "w-full px-4 py-3 rounded-xl border border-line bg-surface/40 text-ink placeholder-slate/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all";
    const hasError = !!validationErrors[field.id];

    if (field.id === "course_id") {
      return (
        <div key={field.id} className="space-y-1.5 text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-slate/85 block">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={formData[field.id]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className={`${baseInputStyle} ${hasError ? "border-red-500" : ""}`}
          >
            <option value="">-- Choose Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          {hasError && <span className="text-xs text-red-500 font-semibold">{validationErrors[field.id]}</span>}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.id} className="space-y-1.5 text-left">
          <label className="text-xs font-bold uppercase tracking-wider text-slate/85 block">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={formData[field.id]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            className={`${baseInputStyle} ${hasError ? "border-red-500" : ""}`}
          >
            <option value="">-- Select {field.label} --</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          {hasError && <span className="text-xs text-red-500 font-semibold">{validationErrors[field.id]}</span>}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={field.id} className="space-y-1.5 text-left md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate/85 block">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={formData[field.id]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={`${baseInputStyle} resize-none ${hasError ? "border-red-500" : ""}`}
          />
          {hasError && <span className="text-xs text-red-500 font-semibold">{validationErrors[field.id]}</span>}
        </div>
      );
    }

    return (
      <div key={field.id} className="space-y-1.5 text-left">
        <label className="text-xs font-bold uppercase tracking-wider text-slate/85 block">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={field.type === "phone" ? "tel" : field.type}
          value={formData[field.id]}
          onChange={(e) => handleInputChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={`${baseInputStyle} ${hasError ? "border-red-500" : ""}`}
        />
        {hasError && <span className="text-xs text-red-500 font-semibold">{validationErrors[field.id]}</span>}
      </div>
    );
  };

  // 6. Success State UI
  if (success) {
    const courseTitle = courses.find((c) => c.id === formData.course_id)?.title || "Selected Course";
    return (
      <div className="bg-white border border-[#DCE5E8] rounded-3xl p-8 md:p-12 text-center flex flex-col items-center max-w-2xl mx-auto shadow-soft animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-[#F0FBF7] text-[#08A88A] flex items-center justify-center border border-[#DDF8F0] mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-[28px] font-bold font-display text-ink tracking-tight mb-4">
          Registration Received!
        </h3>
        <p className="text-base text-slate font-light leading-relaxed mb-8 max-w-lg">
          Thank you, <strong className="text-ink font-semibold">{formData.name}</strong>. We have successfully registered your interest for <strong className="text-[#08A88A] font-semibold">{courseTitle}</strong>. 
          Our academic counselor will contact you shortly to explain options for your preferred <strong className="text-ink font-semibold">{formData.training_mode}</strong> program format.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button
            onClick={() => window.location.href = "/training"}
            variant="primary"
            className="px-6 py-3.5 rounded-full font-bold flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>Back to Training</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => window.location.href = "/training/online-courses"}
            variant="secondary"
            className="px-6 py-3.5 rounded-full border border-line hover:bg-surface text-slate font-bold flex items-center justify-center"
          >
            <span>Explore Other Programs</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#DCE5E8] rounded-3xl p-6 sm:p-10 shadow-soft max-w-4xl mx-auto">
      {/* Turnstile CDN Loader */}
      {turnstileSiteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start space-x-3 text-rose-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Dynamic fields columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REGISTRATION_FIELDS.map((field) => {
            // Check conditional visibility logic
            if (field.conditional) {
              const activeVal = formData[field.conditional.fieldId];
              if (activeVal !== field.conditional.value) {
                return null;
              }
            }
            return renderFieldInput(field);
          })}
        </div>

        {/* Spam Protection Honeypot field (hidden from users) */}
        <div className="hidden aria-hidden" style={{ display: "none" }}>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="Do not fill this field if you are human"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Cloudflare Turnstile Verification */}
        {turnstileSiteKey && (
          <div className="flex justify-start py-2">
            <div id="turnstile-container"></div>
          </div>
        )}

        {/* Submission Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 mt-6 border-t border-line gap-4">
          <p className="text-xs text-slate/70 text-center sm:text-left">
            By submitting, you agree to receive program details & counselor guidance from KVJ Analytics.
          </p>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 flex items-center justify-center space-x-2 rounded-full font-bold shadow-[0_4px_14px_rgba(8,168,138,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Registration...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Registration</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
