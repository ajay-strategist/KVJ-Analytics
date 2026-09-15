"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { syncStudentSessionCookie, clearStudentSessionCookie, getValidStudentSession } from "@/lib/studentAuth";

/**
 * Global component mounted at root layout.
 * Runs in all layouts (including (player), (website), and (admin)), ensuring:
 * 1. Supabase token changes (refresh, sign-in, sign-out) are immediately synced to sb-access-token cookie.
 * 2. Window focus and tab visibility changes trigger a session validity check.
 * 3. Proactive periodic refresh (every 10 minutes) keeps active student sessions alive during long simulations or lessons.
 */
export function AuthSessionSync() {
  useEffect(() => {
    // 1. Subscribe to all Supabase auth state transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (session?.access_token) {
        syncStudentSessionCookie(session);
      } else if (event === "SIGNED_OUT") {
        clearStudentSessionCookie();
      }
    });

    // 2. Sync on initial mount
    getValidStudentSession();

    // 3. Sync on tab focus / visibility return
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        getValidStudentSession();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    // 4. Periodic background refresh every 10 minutes
    const interval = setInterval(() => {
      getValidStudentSession();
    }, 10 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      clearInterval(interval);
    };
  }, []);

  return null;
}
