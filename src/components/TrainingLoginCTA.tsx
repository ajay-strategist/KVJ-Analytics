"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, User } from "lucide-react";
import { Button } from "./ui/Button";
import { supabase } from "@/lib/supabase";

export function TrainingLoginCTA() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 mt-6 animate-pulse items-center">
        <div className="h-10 w-44 bg-white/5 rounded-full" />
        <div className="h-4 w-52 bg-white/5 rounded" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6 animate-fadeIn">
        <Button
          variant="light"
          onClick={() => router.push("/account")}
          className="py-2.5 px-6 text-sm flex items-center gap-2 rounded-full border border-white/10 hover:border-[#00F0FF]/30 transition-all duration-300 w-full sm:w-auto"
        >
          <User className="w-4 h-4 text-[#00F0FF]" />
          <span>Student Dashboard</span>
        </Button>
        <span className="text-xs text-zinc-400 font-mono">
          Logged in as: <span className="text-white font-bold">{user.email}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 animate-fadeIn">
      <Button
        variant="primary"
        onClick={() => router.push("/signin?redirect=/training")}
        className="py-2.5 px-6 text-sm flex items-center gap-2 rounded-full w-full sm:w-auto text-[#00F0FF] border border-[#00F0FF]/40 hover:text-white"
      >
        <LogIn className="w-4 h-4" />
        <span>Student Portal Login</span>
      </Button>
      <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-xs">
        Already enrolled? Log in here to access your learning portal, spreadsheets, and assessments.
      </p>
    </div>
  );
}
