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
      <div className="bg-brand/5 border border-brand/20 rounded-[24px] p-8 text-center flex flex-col items-center w-full shadow-sm animate-fade-up">
        <CheckCircle2 className="w-16 h-16 text-brand mb-6" />
        <h3 className="text-2xl font-bold font-display text-[#0B1F3A] mb-3">
          Message Sent Successfully!
        </h3>
        <p className="text-base text-slate-500 leading-relaxed mb-6 font-light">
          Thank you for contacting KVJ Analytics. Our consulting team will review your interest and reach back to you within 24 hours.
        </p>
        <Button variant="secondary" onClick={() => setSuccess(false)}>
          Submit Another Request
        </Button>
      </div>
    );
  }

  const inputClasses = "peer w-full px-0 pt-6 pb-2 rounded-none border-b border-[#0B1F3A]/30 bg-transparent focus:border-b-brand text-[#0F172A] text-sm transition-all outline-none";

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 relative">
      {/* Styles for breathing button and focus tracers */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blue-breath {
          0%, 100% {
            box-shadow: 0 0 12px rgba(29, 78, 216, 0.2), 0 0 5px rgba(6, 182, 212, 0.1);
            border-color: rgba(6, 182, 212, 0.3);
          }
          50% {
            box-shadow: 0 0 24px rgba(29, 78, 216, 0.4), 0 0 10px rgba(6, 182, 212, 0.2);
            border-color: #06B6D4;
          }
        }
        .btn-breathing-neon-blue {
          animation: blue-breath 3s ease-in-out infinite !important;
        }
      `}} />

      {error && (
        <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error animate-fade-up">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Name input */}
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
            className={inputClasses}
          />
          <label
            htmlFor="name"
            className={`absolute left-0 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
              focusedField === "name" || formData.name
                ? "transform -translate-y-2.5 scale-75 text-brand"
                : "transform translate-y-0 scale-100 text-slate-700"
            }`}
          >
            Your Name *
          </label>
        </div>

        {/* Organization input */}
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
            className={inputClasses}
          />
          <label
            htmlFor="organization"
            className={`absolute left-0 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
              focusedField === "organization" || formData.organization
                ? "transform -translate-y-2.5 scale-75 text-brand"
                : "transform translate-y-0 scale-100 text-slate-700"
            }`}
          >
            Organization Name *
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Email input */}
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
            className={inputClasses}
          />
          <label
            htmlFor="email"
            className={`absolute left-0 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
              focusedField === "email" || formData.email
                ? "transform -translate-y-2.5 scale-75 text-brand"
                : "transform translate-y-0 scale-100 text-slate-700"
            }`}
          >
            Email Address *
          </label>
        </div>

        {/* Phone input */}
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
            className={inputClasses}
          />
          <label
            htmlFor="phone"
            className={`absolute left-0 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
              focusedField === "phone" || formData.phone
                ? "transform -translate-y-2.5 scale-75 text-brand"
                : "transform translate-y-0 scale-100 text-slate-700"
            }`}
          >
            Phone Number *
          </label>
        </div>
      </div>

      {/* Select input */}
      <div className="relative">
        <select
          id="serviceInterest"
          name="serviceInterest"
          required
          value={formData.serviceInterest}
          onChange={handleChange}
          onFocus={() => setFocusedField("serviceInterest")}
          onBlur={() => setFocusedField("")}
          className="peer w-full px-0 pt-6 pb-2 rounded-none border-b border-[#0B1F3A]/30 bg-transparent focus:border-b-brand text-[#0F172A] text-sm transition-all outline-none appearance-none cursor-pointer"
        >
          <option value="" className="bg-white text-slate-600">-- Select Interest Category --</option>
          {inquiryAreas.map((area, idx) => (
            <option key={idx} value={area} className="bg-white text-[#0F172A]">
              {area}
            </option>
          ))}
          {formData.serviceInterest && !inquiryAreas.includes(formData.serviceInterest) && (
            <option value={formData.serviceInterest} className="bg-white text-[#0F172A]">{formData.serviceInterest}</option>
          )}
        </select>
        <label
          htmlFor="serviceInterest"
          className={`absolute left-0 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left transform -translate-y-2.5 scale-75 ${
            focusedField === "serviceInterest"
              ? "text-brand"
              : "text-slate-700"
          }`}
        >
          Service Interested In *
        </label>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none border-l border-[#0B1F3A]/30 pl-3">
          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Message textarea */}
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
          className="peer w-full px-0 pt-6 pb-2 rounded-none border-b border-[#0B1F3A]/30 bg-transparent focus:border-b-brand text-[#0F172A] text-sm transition-all outline-none resize-none"
        />
        <label
          htmlFor="message"
          className={`absolute left-0 top-4 text-xs font-bold uppercase tracking-wider transition-all pointer-events-none origin-left ${
            focusedField === "message" || formData.message
              ? "transform -translate-y-2.5 scale-75 text-brand"
              : "transform translate-y-0 scale-100 text-slate-700"
          }`}
        >
          How can we help you? *
        </label>
      </div>

      <div className="flex justify-end pt-4">
        {/* Request Demo submit button with breathing neon-blue glow */}
        <Button
          type="submit"
          variant="accent"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 flex items-center justify-center space-x-2 btn-breathing-neon-blue"
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
