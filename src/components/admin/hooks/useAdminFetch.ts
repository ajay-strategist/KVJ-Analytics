"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Reusable admin data hook — fetch + loading/error/retry with 401 handling. Used by dashboard
 * widgets and future module list/detail screens so fetch UX is consistent everywhere.
 */
export function useAdminFetch<T>(url: string, opts?: { onUnauthorized?: () => void }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(url, { cache: "no-store" });
      if (r.status === 401) { opts?.onUnauthorized?.(); return; }
      if (!r.ok) throw new Error("Failed to load data.");
      setData((await r.json()) as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}
