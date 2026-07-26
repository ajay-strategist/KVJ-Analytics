"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Key, User, Phone, Building, CheckSquare, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

export default function CollegeJoinPage() {
  const routeParams = useParams<{ slug: string }>();
  const slug = routeParams?.slug as string;
  const router = useRouter();

  const [user, setUser] = React.useState<any>(null);
  const [authLoaded, setAuthLoaded] = React.useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
    code: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    // Check active auth session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata?.name || "",
          email: session.user.email || ""
        }));
      }
      setAuthLoaded(true);
    };
    checkUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, consent: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      setError("You must consent to sharing your details to register.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let activeUserId = user?.id;

      // If user is not logged in, trigger signup first
      if (!user) {
        if (!formData.email || !formData.password) {
          throw new Error("Email and password are required to create your student account.");
        }
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name },
          },
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error("Account creation failed.");
        activeUserId = signUpData.user.id;
      }

      const response = await fetch(`/api/courses/${slug}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: activeUserId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Verification failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/account");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Invalid code or connection error.");
      setLoading(false);
    }
  };

  const courseTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (!authLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (success) {
    return (
      <Section background="default" className="bg-card min-h-[70vh] flex items-center justify-center">
        <Container>
          <div className="bg-success/5 border border-success/30 rounded-card p-10 text-center flex flex-col items-center max-w-lg mx-auto shadow-sm animate-fade-up">
            <CheckCircle2 className="w-16 h-16 text-success mb-6" />
            <h3 className="text-2xl font-bold font-display text-ink mb-3">
              Access Code Verified!
            </h3>
            <p className="text-base text-slate leading-relaxed mb-4">
              Successfully enrolled in <strong>{courseTitle}</strong>.
            </p>
            <p className="text-xs text-slate mb-6">
              You are being redirected to your student account dashboard...
            </p>
            <Loader2 className="w-6 h-6 animate-spin text-success" />
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section background="default" className="bg-surface/30 min-h-[85vh] py-16">
      <Container>
        {/* Back Link */}
        <Link
          href={`/training/${slug}`}
          className="inline-flex items-center text-sm font-bold text-slate hover:text-brand mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Course Details</span>
        </Link>

        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow segment="education" className="mb-2">
              College Access Program
            </Eyebrow>
            <BoldStatement variant="h2" className="text-ink mb-3 leading-tight">
              Join Academic Class
            </BoldStatement>
            <p className="text-sm text-slate leading-relaxed max-w-md mx-auto">
              Enter your student details and the 6-digit access code provided by your college coordinator to enroll in {courseTitle}.
            </p>
          </div>

          {error && (
            <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error mb-6 animate-fade-up">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-card p-8 md:p-10 rounded-card border border-line/80 shadow-soft space-y-6 relative overflow-hidden"
          >
            {/* Decorative Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 signature-gradient" />

            {/* If user is logged in, show account info */}
            {user ? (
              <div className="bg-surface p-4 rounded-lg border border-line flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                    Signed In As
                  </span>
                  <span className="text-xs font-semibold text-ink block">{user.email}</span>
                </div>
                <span className="text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  Active Session
                </span>
              </div>
            ) : (
              /* If not logged in, collect name, email & password to register */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-card focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                      />
                      <User className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                      Choose Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-card focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                      />
                      <Key className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Kumar"
                    className="w-full pl-10 pr-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-card focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                  />
                  <User className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9961813730"
                    className="w-full pl-10 pr-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-card focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                  />
                  <Phone className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="organization" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                College / Institution Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  required
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g. Cochin College of Technology"
                  className="w-full pl-10 pr-4 py-3 rounded-input border border-line bg-surface/50 text-sm focus:outline-none focus:bg-card focus-glow transition-all duration-200 text-ink placeholder:text-muted"
                />
                <Building className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-xs font-bold uppercase tracking-wider text-slate mb-2">
                6-Digit Access Code *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="000000"
                  className="w-full pl-10 pr-4 py-3.5 rounded-input border border-line bg-surface/50 focus:bg-card text-center font-mono font-bold text-lg tracking-[0.2em] focus:outline-none focus-glow transition-all duration-200 text-ink placeholder:text-muted/60"
                />
                <Key className="w-4 h-4 text-slate absolute left-3.5 top-[18px]" />
              </div>
            </div>

            {/* Consent check box */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                id="consent"
                required
                checked={formData.consent}
                onChange={handleCheckbox}
                className="w-4 h-4 text-brand border-line rounded focus:ring-brand focus:ring-offset-2 mt-0.5 cursor-pointer transition-all"
              />
              <label htmlFor="consent" className="text-xs text-slate leading-relaxed cursor-pointer select-none">
                I agree to share my details with KVJ Analytics and my college coordinator for academic evaluation and mock test grading. *
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center py-3.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <span>Verify & Enroll</span>
              )}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
