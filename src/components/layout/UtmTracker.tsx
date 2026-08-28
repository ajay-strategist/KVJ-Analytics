"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";

// Cookie helper functions
function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return "";
}

function UtmTrackerInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Capture landing page & referrer for first-touch attribution
    if (!getCookie("first_landing_page")) {
      setCookie("first_landing_page", window.location.href, 30);
      localStorage.setItem("first_landing_page", window.location.href);
    }
    if (!getCookie("first_referrer") && document.referrer) {
      setCookie("first_referrer", document.referrer, 30);
      localStorage.setItem("first_referrer", document.referrer);
    }

    // 2. Extract UTM parameters from URL query
    const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
    let utmFound = false;

    const currentUtms: Record<string, string> = {};

    utmKeys.forEach((key) => {
      const val = searchParams.get(key);
      if (val) {
        utmFound = true;
        currentUtms[key] = val;
        
        // Save last-touch in cookies & localStorage
        setCookie(key, val, 30);
        localStorage.setItem(key, val);

        // Save first-touch if not set yet
        const firstKey = `first_${key}`;
        if (!getCookie(firstKey)) {
          setCookie(firstKey, val, 30);
          localStorage.setItem(firstKey, val);
        }
      }
    });

    // 3. Fallback: If no UTM query is found but there is an organic referrer, set organic traffic properties
    if (!utmFound && document.referrer && !getCookie("utm_source")) {
      const referrerHost = new URL(document.referrer).hostname;
      if (!referrerHost.includes(window.location.hostname)) {
        let source = "referral";
        let medium = "organic";

        if (referrerHost.includes("google.com")) {
          source = "google";
          medium = "organic";
        } else if (referrerHost.includes("facebook.com") || referrerHost.includes("instagram.com")) {
          source = "facebook";
          medium = "social";
        }

        setCookie("utm_source", source, 30);
        setCookie("utm_medium", medium, 30);
        localStorage.setItem("utm_source", source);
        localStorage.setItem("utm_medium", medium);
      }
    }
  }, [searchParams, pathname]);

  return null;
}

export function UtmTracker() {
  return (
    <Suspense fallback={null}>
      <UtmTrackerInner />
    </Suspense>
  );
}
