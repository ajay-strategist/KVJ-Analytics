"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, AlertCircle, ArrowRight, KeyRound, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { syncStudentSessionCookie } from "@/lib/studentAuth";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [invitedInfo, setInvitedInfo] = useState<{
    name?: string;
    message?: string;
    joinUrl?: string;
    collegeName?: string;
  } | null>(null);

  // Force password change state
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const [updatePasswordError, setUpdatePasswordError] = useState("");
  const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState(false);

  // Self-service Reset Password state
  const [showResetFlow, setShowResetFlow] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetFlowLoading, setResetFlowLoading] = useState(false);
  const [resetFlowError, setResetFlowError] = useState("");
  const [resetFlowSuccess, setResetFlowSuccess] = useState("");

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
    setInvitedInfo(null);
    setLoading(true);

    try {
      // 1. Admins sign in here with their admin credentials to get access to every course
      const adminRes = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email.trim(), password }),
      });
      if (adminRes.ok) {
        const dest = redirect && redirect.startsWith("/training") ? redirect : "/admin/dashboard";
        router.push(dest);
        router.refresh();
        return;
      }

      // 2. Student login via server-side /api/auth/login
      // This handles both Email and Phone number lookup, auto-confirmation, and sets auth cookies directly.
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email.trim(), password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        if (loginData?.isInvitedStudent) {
          setInvitedInfo({
            name: loginData.name,
            message: loginData.message,
            joinUrl: loginData.joinUrl,
            collegeName: loginData.collegeName,
          });
          setLoading(false);
          return;
        }
        throw new Error(loginData?.error || "Failed to sign in. Please check your credentials.");
      }

      // 3. Synchronize Supabase client session with returned tokens
      if (loginData?.session?.access_token && loginData?.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: loginData.session.access_token,
          refresh_token: loginData.session.refresh_token,
        });

        // Set persistent 30-day cookie on client
        syncStudentSessionCookie(loginData.session);
      }

      // 4. Check if password update is required
      if (loginData?.mustChangePassword) {
        setMustChangePassword(true);
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatePasswordError("");

    if (!newPassword || newPassword.length < 6) {
      setUpdatePasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword.toLowerCase().trim() === "password") {
      setUpdatePasswordError('You cannot use the default "password". Please enter a unique personal password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setUpdatePasswordError("Passwords do not match. Please re-enter them carefully.");
      return;
    }

    setUpdatePasswordLoading(true);

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password.");

      try {
        await supabase.auth.updateUser({
          password: newPassword,
          data: { must_change_password: false },
        });
      } catch (clientErr) {
        console.warn("Client password update warning:", clientErr);
      }

      setUpdatePasswordSuccess(true);
      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setUpdatePasswordError(err.message || "Failed to update password.");
      setUpdatePasswordLoading(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetFlowError("");

    const target = (resetIdentifier || email).trim();
    if (!target) {
      setResetFlowError("Please enter your email or phone number.");
      return;
    }

    if (!resetNewPassword || resetNewPassword.length < 6) {
      setResetFlowError("New password must be at least 6 characters long.");
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetFlowError("Passwords do not match. Please re-enter them carefully.");
      return;
    }

    setResetFlowLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: target,
          newPassword: resetNewPassword,
          confirmPassword: resetConfirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");

      if (data?.session?.access_token && data?.session?.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        syncStudentSessionCookie(data.session);
      }

      setResetFlowSuccess("Password updated successfully! Welcome back.");
      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setResetFlowError(err.message || "Failed to reset password.");
    } finally {
      setResetFlowLoading(false);
    }
  };

  return (
    <Card hoverLift={false} className="max-w-md w-full bg-card border border-line p-8 rounded-3xl backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] mx-auto relative z-10">
      {showResetFlow ? (
        <div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-ink text-center mb-1">
            Reset Password
          </h2>
          <p className="text-muted font-light text-center text-xs mb-6 leading-relaxed">
            Enter your registered Email or Phone Number and set your new password directly.
          </p>

          {resetFlowError && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-start space-x-2 text-rose-400 mb-4 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{resetFlowError}</span>
            </div>
          )}

          {resetFlowSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-bold text-ink text-sm">Password Updated!</h3>
              <p className="text-xs text-slate">Signing you in and redirecting to your account...</p>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate mb-2">
                  Registered Email or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-muted" />
                  <input
                    type="text"
                    required
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder="name@company.com or 9876543210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-line text-sm bg-surface text-ink placeholder-muted focus:outline-none focus:border-[#10B981]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-muted" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-line text-sm bg-surface text-ink placeholder-muted focus:outline-none focus:border-[#10B981]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-muted" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-line text-sm bg-surface text-ink placeholder-muted focus:outline-none focus:border-[#10B981]/40"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={resetFlowLoading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#10B981] to-[#0D9488] text-black font-bold flex items-center justify-center gap-1.5 border-none cursor-pointer"
              >
                {resetFlowLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Reset & Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center mt-4 pt-3 border-t border-line text-xs">
                <button
                  type="button"
                  onClick={() => setShowResetFlow(false)}
                  className="text-muted hover:text-ink font-medium transition-colors cursor-pointer"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      ) : mustChangePassword ? (
        <div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-display text-ink text-center mb-1">
            Update Your Password
          </h2>
          <p className="text-muted font-light text-center text-xs mb-6">
            Your password was reset to the default temporary password. For account security, please create your new personal password to continue.
          </p>

          {updatePasswordError && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-start space-x-2 text-rose-400 mb-4 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{updatePasswordError}</span>
            </div>
          )}

          {updatePasswordSuccess ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-bold text-ink text-sm">Password Updated!</h3>
              <p className="text-xs text-slate">Redirecting to your account...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Choose a personal password (min 6 characters).</span>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-line text-sm bg-surface text-ink placeholder-muted focus:outline-none focus:border-[#10B981]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-line text-sm bg-surface text-ink placeholder-muted focus:outline-none focus:border-[#10B981]/40"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={updatePasswordLoading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#10B981] to-[#0D9488] text-black font-bold flex items-center justify-center gap-1.5 border-none cursor-pointer"
              >
                {updatePasswordLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Save Password & Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold font-display text-ink text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-muted font-light text-center text-sm mb-8">
            Access your KVJ Analytics courses and test scorecards.
          </p>

          {invitedInfo && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl space-y-3 mb-6">
              <div className="flex items-start space-x-3 text-emerald-400">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-sm font-bold text-ink block">Roster Registration Found</span>
                  <p className="text-xs text-slate leading-relaxed">
                    {invitedInfo.message}
                  </p>
                </div>
              </div>
              {invitedInfo.joinUrl && (
                <Link
                  href={invitedInfo.joinUrl}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span>Activate Batch Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}

          {error && !invitedInfo && (
            <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl space-y-2 text-rose-450 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
              <div className="pl-8 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setResetIdentifier(email);
                    setShowResetFlow(true);
                  }}
                  className="text-[#10B981] font-bold hover:underline cursor-pointer"
                >
                  Click here to Reset Password with default &quot;password&quot; &rarr;
                </button>
              </div>
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
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com or 9876543210"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-line text-sm bg-surface text-ink placeholder-muted focus:outline-none focus:border-[#10B981]/40"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate font-mono">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetIdentifier(email);
                    setShowResetFlow(true);
                  }}
                  className="text-xs text-[#10B981] hover:underline font-mono font-medium cursor-pointer"
                >
                  Reset Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-muted" />
                <input
                  type="password"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
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
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#10B981] to-[#0D9488] text-black font-bold flex items-center justify-center gap-1.5 border-none cursor-pointer"
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

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setResetIdentifier(email);
                  setShowResetFlow(true);
                }}
                className="text-xs text-muted hover:text-[#10B981] transition-colors cursor-pointer"
              >
                Forgot password or need to reset? Click here
              </button>
            </div>
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
        </>
      )}
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
