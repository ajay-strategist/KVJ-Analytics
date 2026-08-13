"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall } from "lucide-react";
import { Button } from "./ui/Button";
import { FALLBACK_SITE_SETTINGS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  siteSettings?: typeof FALLBACK_SITE_SETTINGS;
}

export function Header({ siteSettings = FALLBACK_SITE_SETTINGS }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync Supabase session to a cookie for server route verification
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session) {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        const secureFlag = isSecure ? "; Secure" : "";
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax${secureFlag}`;
      } else {
        document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close the mobile menu on route change; lock body scroll while it's open.
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const vis = (siteSettings as { pageVisibility?: Record<string, boolean> }).pageVisibility || {};
  const navItems = (siteSettings.navItems || FALLBACK_SITE_SETTINGS.navItems)
    // Hide any page toggled OFF in the admin (Home always stays).
    .filter((item) => item.href === "/" || vis[item.href] !== false);
  const contact = siteSettings.contactInfo || FALLBACK_SITE_SETTINGS.contactInfo;

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-[calc(100%-2rem)] max-w-[1400px] rounded-full border border-line bg-glass-card backdrop-blur-[22px] shadow-lg ${
        scrolled ? "top-2 py-2 shadow-2xl border-line/80" : "top-4 py-3.5"
      }`}
    >
      <div className="w-full px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <img
            src="/logo-dark.png"
            alt="KVJ Analytics"
            className="h-8 md:h-9 w-auto object-contain transition-all duration-300 group-hover:scale-105"
          />
        </Link>
 
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
          {navItems.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
 
            return (
              <Link
                key={idx}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap text-[13px] xl:text-sm font-medium relative px-3 py-1.5 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-0.5 after:left-3 after:right-3 after:h-[2px] after:bg-brand after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left ${
                  isActive ? "text-brand after:scale-x-100 after:bg-brand" : "text-slate hover:text-brand"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
 
        {/* Right side CTA & Quick Contacts */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
          <a
            href={`tel:${contact.phones[0]}`}
            className="flex items-center whitespace-nowrap text-[13px] font-medium transition-all duration-300 px-4 py-2 rounded-full border border-line hover:border-brand/40 bg-surface text-slate hover:text-brand"
          >
            <PhoneCall className="w-3.5 h-3.5 mr-2 text-brand flex-shrink-0 animate-pulse" />
            <span>Call</span>
          </a>
          <Button variant="primary" href="/contact" className="px-5 py-2 text-[13px] xl:text-sm">
            Request Demo
          </Button>
        </div>
 
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-full focus:outline-none transition-colors text-ink hover:bg-emerald-50 border border-transparent hover:border-line"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-glass-card/95 backdrop-blur-xl border border-line rounded-3xl shadow-2xl animate-fade-in py-6 px-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? "text-brand bg-brand/10 font-bold border-l-2 border-brand"
                      : "text-slate hover:bg-emerald-50 hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-line pt-4 flex flex-col space-y-3">
            <a
              href={`tel:${contact.phones[0]}`}
              className="flex items-center justify-center w-full px-4 py-3 rounded-full text-sm font-medium border border-line bg-surface text-ink hover:bg-emerald-50 transition-all duration-300"
            >
              <PhoneCall className="w-4 h-4 mr-2 text-brand" />
              Call Us
            </a>
            <Button variant="primary" href="/contact" className="w-full py-3">
              Request Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
