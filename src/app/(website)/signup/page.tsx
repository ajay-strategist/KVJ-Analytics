"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, Phone, Briefcase, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("student");
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Call Supabase Sign Up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) throw signUpError;

      const user = signUpData?.user;
      if (user) {
        // 2. Write extra metadata to the public.profiles table using the Supabase client
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: name,
            name: name,
            phone: phone,
            profession: profession,
            account_type: "individual",
          })
          .eq("id", user.id);

        if (profileError) {
          console.error("Error writing profile metadata:", profileError);
          // Don't fail completely if only the profile update throws (e.g. trigger lag)
        }
      }

      alert("Account registration successful!");
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card hoverLift={false} className="max-w-md w-full bg-[#0A0A0C]/55 border border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.4)] mx-auto relative z-10">
      <h2 className="text-3xl font-bold font-display text-white text-center mb-2">
        Create Account
      </h2>
      <p className="text-zinc-500 font-light text-center text-sm mb-8">
        Join KVJ Analytics to start automating workflows and taking mock tests.
      </p>

      {error && (
        <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl flex items-start space-x-3 text-rose-450 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahul Kumar"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Profession
          </label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white focus:outline-none focus:border-[#00F0FF]/40 appearance-none cursor-pointer"
            >
              <option value="student" className="bg-[#050505] text-white">Student</option>
              <option value="teacher" className="bg-[#050505] text-white">Teacher / Academician</option>
              <option value="it" className="bg-[#050505] text-white">IT Professional</option>
              <option value="non_it" className="bg-[#050505] text-white">Non-IT Professional</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-zinc-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/5 text-sm bg-[#0E0E12] text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]/40"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#00F0FF] to-[#0072FF] text-black font-bold flex items-center justify-center gap-1.5 border-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-white/5 text-xs text-zinc-400 font-light">
        Already have an account?{" "}
        <Link
          href={redirect ? `/signin?redirect=${encodeURIComponent(redirect)}` : "/signin"}
          className="text-[#00F0FF] font-bold hover:underline"
        >
          Log In Here
        </Link>
      </div>
    </Card>
  );
}

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen bg-[#050505] text-zinc-200 pt-36 pb-24 relative overflow-hidden flex items-center">
      {/* Background spotlights */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#0072FF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[140px] pointer-events-none" />

      <Container>
        <Suspense fallback={
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#00F0FF]" />
          </div>
        }>
          <SignUpForm />
        </Suspense>
      </Container>
    </div>
  );
}
