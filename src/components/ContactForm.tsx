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
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-3 rounded-input border border-line bg-surface/30 focus:bg-white focus-glow text-sm transition-all font-medium placeholder:text-slate/40"
          />
        </div>
        <div>
          <label htmlFor="organization" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
            Organization Name *
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            required
            value={formData.organization}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            className="w-full px-4 py-3 rounded-input border border-line bg-surface/30 focus:bg-white focus-glow text-sm transition-all font-medium placeholder:text-slate/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. john@company.com"
            className="w-full px-4 py-3 rounded-input border border-line bg-surface/30 focus:bg-white focus-glow text-sm transition-all font-medium placeholder:text-slate/40"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 9961813730"
            className="w-full px-4 py-3 rounded-input border border-line bg-surface/30 focus:bg-white focus-glow text-sm transition-all font-medium placeholder:text-slate/40"
          />
        </div>
      </div>

      <div>
        <label htmlFor="serviceInterest" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
          Service Interested In *
        </label>
        <select
          id="serviceInterest"
          name="serviceInterest"
          required
          value={formData.serviceInterest}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-input border border-line bg-surface/30 focus:bg-white focus-glow text-sm transition-all font-medium"
        >
          <option value="">-- Select Interest Category --</option>
          {inquiryAreas.map((area, idx) => (
            <option key={idx} value={area}>
              {area}
            </option>
          ))}
          {formData.serviceInterest && !inquiryAreas.includes(formData.serviceInterest) && (
            <option value={formData.serviceInterest}>{formData.serviceInterest}</option>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
          How can we help you? *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Briefly describe your requirements or the systems you'd like audited/automated..."
          className="w-full px-4 py-3 rounded-input border border-line bg-surface/30 focus:bg-white focus-glow text-sm transition-all resize-y font-medium placeholder:text-slate/40"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
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
              <span>Send Request</span>
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
