import { supabase } from "./supabase";

const COOKIE_NAME = "sb-access-token";
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

/**
 * Synchronizes the current Supabase session access token to the sb-access-token cookie
 * with a 30-day max-age so student sessions don't expire during long study/simulation sessions.
 */
export function syncStudentSessionCookie(session: any) {
  if (typeof window === "undefined") return;
  if (session?.access_token) {
    const isSecure = window.location.protocol === "https:";
    const secureFlag = isSecure ? "; Secure" : "";
    document.cookie = `${COOKIE_NAME}=${session.access_token}; path=/; max-age=${THIRTY_DAYS_SECONDS}; SameSite=Lax${secureFlag}`;
  }
}

/**
 * Clears the student session cookie on logout.
 */
export function clearStudentSessionCookie() {
  if (typeof window === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;`;
}

/**
 * Synchronously retrieves the sb-access-token from document.cookie
 * to serve as an instant, zero-latency fallback when Supabase client lock is busy.
 */
export function getStudentCookieToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)sb-access-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Retrieves the current session with a resilient timeout guard.
 * If Supabase client session retrieval hangs or deadlocks (e.g. multi-tab storage lock),
 * it seamlessly falls back to the synchronous sb-access-token cookie.
 */
export async function getValidStudentSession() {
  if (typeof window === "undefined") return null;

  try {
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { session: null } }), 10000)
    );

    const { data: { session: currentSession } } = await Promise.race([
      sessionPromise,
      timeoutPromise,
    ]);

    if (!currentSession) {
      const cookieToken = getStudentCookieToken();
      if (cookieToken) {
        return { access_token: cookieToken } as any;
      }
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = currentSession.expires_at || 0;
    const isExpiringSoon = expiresAt - now < 300; // less than 5 minutes remaining

    if (isExpiringSoon) {
      const refreshPromise = supabase.auth.refreshSession();
      const refreshTimeout = new Promise<{ data: { session: null }; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: { session: null }, error: new Error("timeout") }), 10000)
      );

      const { data: refreshData, error: refreshError } = await Promise.race([
        refreshPromise,
        refreshTimeout,
      ]);

      if (!refreshError && refreshData?.session) {
        syncStudentSessionCookie(refreshData.session);
        return refreshData.session;
      }
    }

    syncStudentSessionCookie(currentSession);
    return currentSession;
  } catch (err) {
    console.warn("[KVJ Auth] Failed to get/refresh student session:", err);
    const cookieToken = getStudentCookieToken();
    if (cookieToken) {
      return { access_token: cookieToken } as any;
    }
    return null;
  }
}

/**
 * High-reliability fetch wrapper for student API endpoints.
 * - Injects the active student Bearer token in the Authorization header.
 * - Falls back to cookie token if session is busy.
 * - Enforces a 25-second network timeout so UI never hangs indefinitely.
 * - If 401, attempts a silent refresh and retries once.
 */
export async function fetchWithStudentAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const session = await getValidStudentSession();
  const token = session?.access_token || getStudentCookieToken();

  const headers = new Headers(init?.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      headers,
    });
  } catch (fetchErr: any) {
    // If request failed, retry once with direct cookie token if available
    const cookieToken = getStudentCookieToken();
    if (cookieToken && token !== cookieToken) {
      headers.set("Authorization", `Bearer ${cookieToken}`);
      return await fetch(input, {
        ...init,
        headers,
      });
    }
    throw fetchErr;
  }

  // If 401, attempt silent session refresh and retry once
  if (response.status === 401) {
    try {
      const refreshPromise = supabase.auth.refreshSession();
      const timeoutPromise = new Promise<{ data: { session: null }; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: { session: null }, error: new Error("timeout") }), 8000)
      );
      const { data: refreshData, error: refreshErr } = await Promise.race([
        refreshPromise,
        timeoutPromise,
      ]);

      if (!refreshErr && refreshData?.session?.access_token) {
        syncStudentSessionCookie(refreshData.session);
        const retryHeaders = new Headers(init?.headers || {});
        retryHeaders.set("Authorization", `Bearer ${refreshData.session.access_token}`);
        response = await fetch(input, {
          ...init,
          headers: retryHeaders,
        });
      }
    } catch (retryErr) {
      console.warn("[KVJ Auth] Session refresh retry failed:", retryErr);
    }
  }

  return response;
}
