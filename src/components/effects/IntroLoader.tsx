"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Cinematic intro loader with GSAP-powered belt strips, logo reveal, and counter.
 * Inspired by Trionn.com's dramatic page-load experience.
 * Runs once per browser session, respects reduced-motion.
 */
/** Broadcast that the intro is finished so the hero can time its reveal to it.
 *  Sets a global flag (for consumers that mount/read late) and fires an event
 *  (for consumers already listening). Safe to call more than once. */
function signalIntroDone() {
  try {
    (window as unknown as { __kvjIntroDone?: boolean }).__kvjIntroDone = true;
    window.dispatchEvent(new Event("kvj:intro-done"));
  } catch { /* ignore */ }
}

export function IntroLoader() {
  useEffect(() => {
    signalIntroDone();
  }, []);

  return null;
}
