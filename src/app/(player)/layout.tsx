/**
 * Minimal layout for the immersive course player.
 *
 * Intentionally contains NO site chrome (Header, Footer, WhatsAppFloat,
 * ScrollProgress, CursorGlow, IntroLoader) so that the course player can
 * occupy the full viewport without any overlapping UI.
 *
 * All other (website) routes are unaffected — they continue to use
 * src/app/(website)/layout.tsx which renders all the chrome.
 */
import React from "react";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
