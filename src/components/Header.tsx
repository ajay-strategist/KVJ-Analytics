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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; SameSite=Lax; Secure`;
      } else {
        document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const navItems = siteSettings.navItems || FALLBACK_SITE_SETTINGS.navItems;
  const contact = siteSettings.contactInfo || FALLBACK_SITE_SETTINGS.contactInfo;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-full border-b bg-white ${
        scrolled
          ? "py-3 shadow-[0_8px_30px_rgba(11,22,53,0.08)] border-line/70"
          : "py-5 border-line/60"
      }`}
    >
      <div className="w-full pl-3 pr-4 sm:pl-4 sm:pr-6 lg:pr-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <img
            src="/logo.png"
            alt="KVJ Analytics"
            className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-3">
          {navItems.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            // Custom highlighting for Corporate (blue) and Educational (teal)
            let hoverColor = "hover:text-brand";
            let activeColor = "text-brand font-semibold after:scale-x-100";
            if (item.href.includes("corporate")) {
              hoverColor = "hover:text-corporate";
              activeColor = "text-corporate font-semibold after:scale-x-100 after:bg-corporate";
            } else if (item.href.includes("education") || item.href.includes("training")) {
              hoverColor = "hover:text-education";
              activeColor = "text-education font-semibold after:scale-x-100 after:bg-education";
            }

            return (
              <Link
                key={idx}
                href={item.href}
                className={`whitespace-nowrap text-[13px] xl:text-sm font-medium relative px-2 xl:px-2.5 py-1.5 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-brand after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left ${
                  isActive ? activeColor : "text-slate"
                } ${hoverColor}`}
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
            className="hidden xl:flex items-center whitespace-nowrap text-xs font-semibold text-slate hover:text-brand transition-all duration-200 bg-surface/80 border border-line/45 hover:border-line px-3 py-2 rounded-lg"
          >
            <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-corporate animate-pulse flex-shrink-0" />
            <span className="whitespace-nowrap">Call {contact.phones[0]}</span>
          </a>
          <Button variant="primary" href="/contact" className="px-4 xl:px-5 py-2 text-[13px] xl:text-sm shadow-sm hover:shadow-md transition-all">
            Request Demo
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate hover:bg-surface hover:text-ink focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-line shadow-lg animate-fade-in py-6 px-4 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-3">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              let activeBg = "text-brand bg-brand/5";
              if (item.href.includes("corporate")) {
                activeBg = "text-corporate bg-corporate/5";
              } else if (item.href.includes("education") || item.href.includes("training")) {
                activeBg = "text-education bg-education/5";
              }

              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                    isActive ? activeBg : "text-slate hover:bg-surface"
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
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-surface text-sm font-semibold text-ink border border-line"
            >
              <PhoneCall className="w-4 h-4 mr-2 text-corporate" />
              Call Support: {contact.phones[0]}
            </a>
            <Button variant="primary" href="/contact" className="w-full py-3.5">
              Request Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
