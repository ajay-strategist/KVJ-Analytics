"use client";

import React, { useState, useEffect } from "react";
import { Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { supabase } from "@/lib/supabase";

interface InternshipApplyFormProps {
  internshipId: string;
  internshipTitle: string;
}

export function InternshipApplyForm({ internshipId, internshipTitle }: InternshipApplyFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Prefill user details if logged in
  useEffect(() => {
    const prefillUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setEmail(session.user.email || "");
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, phone")
          .eq("id", session.user.id)
          .maybeSingle();
        
        if (profile) {
          setName(profile.name || "");
          setPhone(profile.phone || "");
        }
      }
    };
    prefillUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: dbError } = await supabase
        .from("internship_applications")
        .insert([
          {
            internship_id: internshipId,
            name,
            email,
            phone,
            resume_url: resumeUrl,
            message,
          },
        ]);

      if (dbError) throw dbError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card hoverLift={false} className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl text-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-2">Application Submitted!</h3>
        <p className="text-sm text-zinc-400 font-light leading-relaxed">
          Thank you for applying to the <strong>{internshipTitle}</strong>. Our consulting team will review your profile and contact you by email.
        </p>
      </Card>
    );
  }

  return (
    <Card hoverLift={false} className="bg-[#0A0A0C]/55 border border-white/5 p-8 rounded-3xl backdrop-blur-xl">
      <h3 className="text-xl font-bold font-display text-white mb-6">Apply for Internship</h3>

      {error && (
        <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl flex items-start space-x-3 text-rose-450 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aditi Sharma"
            className="w-full px-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@email.com"
              className="w-full px-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Resume / Portfolio Link (PDF / GDrive)
          </label>
          <input
            type="url"
            required
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className="w-full px-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Statement of Purpose / Message
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why do you want to join KVJ Analytics?"
            className="w-full px-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold flex items-center justify-center gap-1.5 border-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Submit Application</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
