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

  // Routes whose top section is a dark hero → header may be transparent (white) at the top.
  const HERO_ROUTES = new Set(["/", "/about", "/corporate", "/education", "/products", "/training", "/contact"]);
  const overHero = HERO_ROUTES.has(pathname) && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-full border-b ${
        overHero
          ? "py-5 bg-transparent border-transparent"
          : "py-3 bg-white/85 backdrop-blur-xl border-line shadow-[0_8px_30px_rgba(20,18,40,0.08)]"
      }`}
    >
      <div className="w-full pl-3 pr-4 sm:pl-4 sm:pr-6 lg:pr-8 flex items-center justify-between">
        {/* Brand Logo — always normal colors over light bases */}
        <Link href="/" className="flex items-center group shrink-0">
          <img
            src="/logo.png"
            alt="KVJ Analytics"
            className="h-8 md:h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105"
          />
        </Link>
 
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2">
          {navItems.map((item, idx) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
 
            const inactive = "text-slate hover:text-ink";
            const active = "text-ink after:scale-x-100";
 
            return (
              <Link
                key={idx}
                href={item.href}
                className={`whitespace-nowrap text-[13px] xl:text-sm font-medium relative px-2.5 xl:px-3 py-1.5 transition-colors duration-200 after:content-[''] after:absolute after:-bottom-0.5 after:left-2.5 after:right-2.5 after:h-[2px] after:bg-brand after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left ${
                  isActive ? active : inactive
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
            className={`hidden xl:flex items-center whitespace-nowrap text-[13px] font-medium transition-all duration-200 px-4 py-2 rounded-full border ${
              overHero
                ? "text-slate hover:text-ink border-line hover:border-brand/40 bg-white/40"
                : "text-slate hover:text-ink border-line hover:border-brand/40 bg-surface"
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 mr-2 text-brand flex-shrink-0" />
            <span>Call</span>
          </a>
          <Button variant="accent" href="/contact" className="px-5 py-2.5 text-[13px] xl:text-sm">
            Request Demo
          </Button>
        </div>
 
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg focus:outline-none transition-colors text-ink hover:bg-surface"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-line shadow-lg animate-fade-in py-6 px-4 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive ? "text-brand bg-brand/5" : "text-slate hover:bg-surface hover:text-ink"
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
              className="flex items-center justify-center w-full px-4 py-3 rounded-full bg-surface text-sm font-medium text-ink border border-line"
            >
              <PhoneCall className="w-4 h-4 mr-2 text-brand" />
              Call Us
            </a>
            <Button variant="accent" href="/contact" className="w-full py-3.5">
              Request Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
