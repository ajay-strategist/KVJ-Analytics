"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-xs text-slate-500">
          {error?.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
