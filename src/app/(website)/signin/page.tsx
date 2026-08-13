"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect away
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        router.push(redirect);
      }
    };
    checkUser();
  }, [redirect, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Admins sign in here with their admin credentials to get access to every course
      // (no enrolment / payment). We try that first; if it isn't the admin, fall through to
      // the normal student login.
      const adminRes = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      if (adminRes.ok) {
        // Admin has no student dashboard — send them to the course they came from, else the panel.
        const dest = redirect && redirect.startsWith("/training") ? redirect : "/admin/dashboard";
        router.push(dest);
        router.refresh();
        return;
      }

      // Normal student login via Supabase.
      // Check if input is email or phone number
      const isEmail = email.includes("@");
      
      let signInParams;
      if (isEmail) {
        signInParams = { email, password };
      } else {
        // Format as phone number (assuming +91 if no + is provided)
        const formattedPhone = email.startsWith("+") ? email : `+91${email.replace(/\D/g, "")}`;
        signInParams = { phone: formattedPhone, password };
      }

      const { error: authError } = await supabase.auth.signInWithPassword(signInParams);

      if (authError) throw authError;

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <Card hoverLift={false} className="max-w-md w-full bg-card border border-line p-8 rounded-3xl backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] mx-auto relative z-10">
      <h2 className="text-3xl font-bold font-display text-ink text-center mb-2">
        Welcome Back
      </h2>
      <p className="text-muted font-light text-center text-sm mb-8">
        Access your KVJ Analytics courses and test scorecards.
      </p>

      {error && (
        <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl flex items-start space-x-3 text-rose-450 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-2 font-mono">
            Email or Phone Number
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-muted" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com or 9876543210"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-line text-sm bg-surface text-ink placeholder-muted focus:outline-none focus:border-[#10B981]/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate mb-2 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-muted" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-line text-sm bg-surface text-ink placeholder-muted focus:outline-none focus:border-[#10B981]/40"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#10B981] to-[#0D9488] text-black font-bold flex items-center justify-center gap-1.5 border-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-line text-xs text-slate font-light">
        Don&apos;t have an account?{" "}
        <Link
          href={redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup"}
          className="text-[#10B981] font-bold hover:underline"
        >
          Register Here
        </Link>
      </div>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="w-full min-h-screen bg-base text-slate pt-36 pb-24 relative overflow-hidden flex items-center">
      {/* Background radial highlights */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#0D9488]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        <Suspense fallback={
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#10B981]" />
          </div>
        }>
          <SignInForm />
        </Suspense>
      </Container>
    </div>
  );
}
