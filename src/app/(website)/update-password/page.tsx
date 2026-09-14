"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, KeyRound, Loader2, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push(`/signin?redirect=${encodeURIComponent("/update-password?redirect=" + redirect)}`);
        return;
      }
      setUserEmail(session.user.email || null);
      setCheckingSession(false);
    };
    checkUser();
  }, [redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword.toLowerCase().trim() === "password") {
      setError('You cannot use the default "password". Please enter a unique personal password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter them carefully.");
      return;
    }

    setLoading(true);

    try {
      // 1. Call server update-password API
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      // 2. Also synchronize client Supabase session
      try {
        await supabase.auth.updateUser({
          password: newPassword,
          data: { must_change_password: false },
        });
      } catch (clientErr) {
        console.warn("Client session password sync:", clientErr);
      }

      setSuccess(true);

      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
          <p className="text-muted text-sm font-light">Verifying student session...</p>
        </div>
      </div>
    );
  }

  return (
    <Card hoverLift={false} className="max-w-md w-full bg-card border border-line p-8 rounded-3xl backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] mx-auto relative z-10">
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
        <KeyRound className="w-6 h-6" />
      </div>

      <h2 className="text-2xl font-bold font-display text-ink text-center mb-1">
        Update Your Password
      </h2>
      <p className="text-muted font-light text-center text-xs mb-6">
        {userEmail ? (
          <>For account <strong className="text-ink">{userEmail}</strong></>
        ) : (
          "Your password was reset to the default. Please choose a new secure password to activate your account."
        )}
      </p>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-start space-x-3 text-rose-400 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      )}

      {success ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
          <h3 className="font-bold text-ink text-base">Password Updated Successfully!</h3>
          <p className="text-xs text-slate">
            Your new password has been saved. Redirecting to your dashboard...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Default password must be replaced with a personal password.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters"
                className="w-full bg-surface border border-line rounded-2xl px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-brand-accent transition-colors pl-10"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full bg-surface border border-line rounded-2xl px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:border-brand-accent transition-colors pl-10"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Save New Password & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      )}
    </Card>
  );
}

export default function UpdatePasswordPage() {
  return (
    <div className="w-full min-h-screen bg-canvas flex flex-col justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <Suspense fallback={<div className="text-center text-muted">Loading...</div>}>
          <UpdatePasswordForm />
        </Suspense>
      </Container>
    </div>
  );
}
