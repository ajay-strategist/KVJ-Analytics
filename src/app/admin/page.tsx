"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-light min-h-screen bg-[#050608] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Decorative Ambient Glows */}
      <div className="absolute top-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#3A7BFF]/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#43F5FF]/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Grid Pattern Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#0E1117]/65 backdrop-blur-xl rounded-[24px] border border-white/5 p-8 md:p-10 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden">
        <div className="text-center mb-8">
          {/* Logo Card with Glow */}
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#43F5FF] to-[#3A7BFF] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative px-6 py-4 bg-[#050608]/90 border border-white/5 rounded-2xl flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="KVJ Analytics"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold font-display text-white tracking-tight">
            Admin Console
          </h2>
          <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mt-1">
            KVJ Analytics Platform
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/5 border border-rose-500/15 p-4 rounded-xl flex items-start space-x-3 text-rose-450 mb-6 text-xs animate-fade-up">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="username"
              className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 font-mono"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="username"
                required
                autoComplete="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mail@thestrategist.co.in"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 bg-[#050608]/50 text-white placeholder-zinc-650 focus:outline-none focus:border-[#43F5FF]/40 focus:ring-1 focus:ring-[#43F5FF]/40 text-sm transition-all focus:bg-[#050608]/80"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 font-mono"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 bg-[#050608]/50 text-white placeholder-zinc-650 focus:outline-none focus:border-[#43F5FF]/40 focus:ring-1 focus:ring-[#43F5FF]/40 text-sm transition-all focus:bg-[#050608]/80"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#43F5FF] to-[#3A7BFF] hover:from-[#16E6D8] hover:to-[#2B66EB] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(67,245,255,0.15)] hover:shadow-[0_0_30px_rgba(67,245,255,0.3)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 border-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Authorizing Console...</span>
              </>
            ) : (
              <span>Login to Console</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
