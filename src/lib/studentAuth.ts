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
 * Retrieves the current session, automatically refreshing if it's expired or about to expire in the next 5 minutes.
 * Also keeps the sb-access-token cookie updated.
 */
export async function getValidStudentSession() {
  if (typeof window === "undefined") return null;

  try {
    const { data: { session: currentSession } } = await supabase.auth.getSession();

    if (!currentSession) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const expiresAt = currentSession.expires_at || 0;
    const isExpiringSoon = expiresAt - now < 300; // less than 5 minutes remaining

    if (isExpiringSoon) {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (!refreshError && refreshData?.session) {
        syncStudentSessionCookie(refreshData.session);
        return refreshData.session;
      }
    }

    syncStudentSessionCookie(currentSession);
    return currentSession;
  } catch (err) {
    console.warn("[KVJ Auth] Failed to get/refresh student session:", err);
    return null;
  }
}

/**
 * High-reliability fetch wrapper for student API endpoints.
 * - Injects the active student Bearer token in the Authorization header.
 * - Keeps the sb-access-token cookie synchronized.
 * - If the server returns a 401 Unauthorized / expired session, it silently refreshes
 *   the session via supabase.auth.refreshSession() and retries the request once.
 */
export async function fetchWithStudentAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const session = await getValidStudentSession();
  const token = session?.access_token;

  const headers = new Headers(init?.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(input, {
    ...init,
    headers,
  });

  // If 401, attempt silent session refresh and retry once
  if (response.status === 401) {
    try {
      const { data: refreshData, error: refreshErr } = await supabase.auth.refreshSession();
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
