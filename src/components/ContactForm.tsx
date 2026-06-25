"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";

interface ContactFormProps {
  inquiryAreas: string[];
}

function ContactFormInner({ inquiryAreas }: ContactFormProps) {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    serviceInterest: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Pre-select interest from URL parameter
  useEffect(() => {
    const interest = searchParams.get("interest");
    if (interest) {
      // Find matching area (case-insensitive or containing string)
      const matchedArea = inquiryAreas.find(
        (area) =>
          area.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(area.toLowerCase())
      );
      if (matchedArea) {
        setFormData((prev) => ({ ...prev, serviceInterest: matchedArea }));
      } else {
        // Fallback to custom match if not in list
        setFormData((prev) => ({ ...prev, serviceInterest: interest }));
      }
    }
  }, [searchParams, inquiryAreas]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Capture UTM params from session/localStorage if available (Phase 4), else standard
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sourcePage: window.location.pathname,
          utmSource: localStorage.getItem("utm_source") || "",
          utmMedium: localStorage.getItem("utm_medium") || "",
          utmCampaign: localStorage.getItem("utm_campaign") || "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        organization: "",
        email: "",
        phone: "",
        serviceInterest: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-success/5 border border-success/30 rounded-card p-8 text-center flex flex-col items-center w-full shadow-sm animate-fade-up">
        <CheckCircle2 className="w-16 h-16 text-success mb-6" />
        <h3 className="text-2xl font-bold font-display text-ink mb-3">
          Message Sent Successfully!
        </h3>
        <p className="text-base text-slate leading-relaxed mb-6">
          Thank you for contacting KVJ Analytics. Our consulting team will review your interest and reach back to you within 24 hours.
        </p>
        <Button variant="secondary" onClick={() => setSuccess(false)}>
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {error && (
        <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error animate-fade-up">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name input with floating label */}
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField("")}
            className="peer w-full px-4 pt-6 pb-2 rounded-input border border-white/5 bg-[#12121A]/50 focus:bg-[#12121A]/80 focus:border-brand focus:ring-1 focus:ring-brand text-white text-sm transition-all outline-none"
          />
          <label
            htmlFor="name"
            className={`absolute left-4 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
              focusedField === "name" || formData.name
                ? "transform -translate-y-2.5 scale-75 text-brand"
                : "transform translate-y-0 scale-100 text-slate-400"
            }`}
          >
            Your Name *
          </label>
        </div>

        {/* Organization input with floating label */}
        <div className="relative">
          <input
            type="text"
            id="organization"
            name="organization"
            required
            value={formData.organization}
            onChange={handleChange}
            onFocus={() => setFocusedField("organization")}
            onBlur={() => setFocusedField("")}
            className="peer w-full px-4 pt-6 pb-2 rounded-input border border-white/5 bg-[#12121A]/50 focus:bg-[#12121A]/80 focus:border-brand focus:ring-1 focus:ring-brand text-white text-sm transition-all outline-none"
          />
          <label
            htmlFor="organization"
            className={`absolute left-4 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
              focusedField === "organization" || formData.organization
                ? "transform -translate-y-2.5 scale-75 text-brand"
                : "transform translate-y-0 scale-100 text-slate-400"
            }`}
          >
            Organization Name *
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Email input with floating label */}
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField("")}
            className="peer w-full px-4 pt-6 pb-2 rounded-input border border-white/5 bg-[#12121A]/50 focus:bg-[#12121A]/80 focus:border-brand focus:ring-1 focus:ring-brand text-white text-sm transition-all outline-none"
          />
          <label
            htmlFor="email"
            className={`absolute left-4 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
              focusedField === "email" || formData.email
                ? "transform -translate-y-2.5 scale-75 text-brand"
                : "transform translate-y-0 scale-100 text-slate-400"
            }`}
          >
            Email Address *
          </label>
        </div>

        {/* Phone input with floating label */}
        <div className="relative">
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            onFocus={() => setFocusedField("phone")}
            onBlur={() => setFocusedField("")}
            className="peer w-full px-4 pt-6 pb-2 rounded-input border border-white/5 bg-[#12121A]/50 focus:bg-[#12121A]/80 focus:border-brand focus:ring-1 focus:ring-brand text-white text-sm transition-all outline-none"
          />
          <label
            htmlFor="phone"
            className={`absolute left-4 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
              focusedField === "phone" || formData.phone
                ? "transform -translate-y-2.5 scale-75 text-brand"
                : "transform translate-y-0 scale-100 text-slate-400"
            }`}
          >
            Phone Number *
          </label>
        </div>
      </div>

      {/* Select input with floating label */}
      <div className="relative">
        <select
          id="serviceInterest"
          name="serviceInterest"
          required
          value={formData.serviceInterest}
          onChange={handleChange}
          onFocus={() => setFocusedField("serviceInterest")}
          onBlur={() => setFocusedField("")}
          className="peer w-full px-4 pt-6 pb-2 rounded-input border border-white/5 bg-[#12121A]/50 focus:bg-[#12121A]/80 focus:border-brand focus:ring-1 focus:ring-brand text-white text-sm transition-all outline-none appearance-none cursor-pointer"
        >
          <option value="" className="bg-[#0A0A0E] text-slate-500">-- Select Interest Category --</option>
          {inquiryAreas.map((area, idx) => (
            <option key={idx} value={area} className="bg-[#0A0A0E] text-white">
              {area}
            </option>
          ))}
          {formData.serviceInterest && !inquiryAreas.includes(formData.serviceInterest) && (
            <option value={formData.serviceInterest} className="bg-[#0A0A0E] text-white">{formData.serviceInterest}</option>
          )}
        </select>
        <label
          htmlFor="serviceInterest"
          className={`absolute left-4 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
            focusedField === "serviceInterest" || formData.serviceInterest
              ? "transform -translate-y-2.5 scale-75 text-brand"
              : "transform translate-y-0 scale-100 text-slate-400"
          }`}
        >
          Service Interested In *
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-3">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Message textarea with floating label */}
      <div className="relative">
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          onFocus={() => setFocusedField("message")}
          onBlur={() => setFocusedField("")}
          className="peer w-full px-4 pt-6 pb-2 rounded-input border border-white/5 bg-[#12121A]/50 focus:bg-[#12121A]/80 focus:border-brand focus:ring-1 focus:ring-brand text-white text-sm transition-all outline-none resize-none"
        />
        <label
          htmlFor="message"
          className={`absolute left-4 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
            focusedField === "message" || formData.message
              ? "transform -translate-y-2.5 scale-75 text-brand"
              : "transform translate-y-0 scale-100 text-slate-400"
          }`}
        >
          How can we help you? *
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="accent"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 animate-[bounce_1.5s_infinite]" />
              <span>Request Demo</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function ContactForm({ inquiryAreas }: ContactFormProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    }>
      <ContactFormInner inquiryAreas={inquiryAreas} />
    </Suspense>
  );
}
