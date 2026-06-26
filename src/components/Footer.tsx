"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, ShieldAlert, FileText } from "lucide-react";
import { Container } from "./ui/Container";
import { FALLBACK_SITE_SETTINGS } from "@/lib/constants";

interface FooterProps {
  siteSettings?: typeof FALLBACK_SITE_SETTINGS;
}

export function Footer({ siteSettings = FALLBACK_SITE_SETTINGS }: FooterProps) {
  const pathname = usePathname();
  const isLightHome = pathname === "/";
  const description = siteSettings.footerDescription || FALLBACK_SITE_SETTINGS.footerDescription;
  const tagline = siteSettings.footerTagline || FALLBACK_SITE_SETTINGS.footerTagline;
  const contact = siteSettings.contactInfo || FALLBACK_SITE_SETTINGS.contactInfo;
  const columns = siteSettings.footerColumns || FALLBACK_SITE_SETTINGS.footerColumns;

  return (
    <footer className={`pt-16 pb-8 border-t relative overflow-hidden transition-colors duration-500 ${
      isLightHome
        ? "bg-[#FAFAFC] border-slate-200 text-[#0F172A]"
        : "bg-[#0A0A0E]/80 backdrop-blur-xl border-line text-ink"
    }`}>
      {/* Ambient backgrounds */}
      {!isLightHome && (
        <>
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-education/8 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-16">
          {/* Brand/Tagline Column */}
          <div className="lg:col-span-3 flex flex-col justify-start">
            <Link href="/" className="flex items-center mb-6 group">
              <img
                src="/logo.png"
                alt="KVJ Analytics"
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className={`text-sm font-semibold mb-6 leading-relaxed ${isLightHome ? "text-[#0B1F3A]" : "text-slate"}`}>
              {tagline}
            </p>
            <p className={`text-sm leading-relaxed mb-8 max-w-sm font-light ${isLightHome ? "text-[#475569]" : "text-slate/80"}`}>
              {description}
            </p>
            {/* Regions badge strip */}
            <div className="flex flex-wrap gap-2">
              {siteSettings.regionsServed.map((region, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 cursor-default ${
                    isLightHome
                      ? "bg-slate-100 text-[#475569] border-slate-200 hover:bg-[#0B1F3A]/5 hover:text-[#0B1F3A] hover:border-[#0B1F3A]/30"
                      : "bg-slate/5 text-slate/85 border border-line hover:bg-brand/5 hover:text-brand hover:border-brand/30"
                  }`}
                >
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((column, idx) => (
            <div key={idx} className="lg:col-span-3">
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2.5 font-display ${
                isLightHome ? "text-[#0B1F3A] border-slate-200" : "text-ink border-line"
              }`}>
                {column.heading}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className={`text-sm hover:translate-x-1.5 transition-all duration-200 block ${
                        isLightHome
                          ? "text-[#475569] hover:text-[#0B1F3A]"
                          : "text-slate hover:text-brand"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Details Column */}
          <div className="lg:col-span-3">
            <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 border-b pb-2.5 font-display ${
              isLightHome ? "text-[#0B1F3A] border-slate-200" : "text-ink border-line"
            }`}>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-brand mr-3 shrink-0 mt-1" />
                <span className={`text-xs leading-relaxed ${isLightHome ? "text-[#475569]" : "text-slate"}`}>
                  {contact.address}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-brand mr-3 shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className={`text-xs transition-colors duration-150 ${
                    isLightHome ? "text-[#475569] hover:text-[#0B1F3A]" : "text-slate hover:text-brand"
                  }`}
                >
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-4 h-4 text-brand mr-3 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  {contact.phones.map((phone, pIdx) => (
                    <a
                      key={pIdx}
                      href={`tel:${phone}`}
                      className={`text-xs transition-colors duration-150 ${
                        isLightHome ? "text-[#475569] hover:text-[#0B1F3A]" : "text-slate hover:text-brand"
                      }`}
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className={`border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 ${
          isLightHome ? "border-slate-200" : "border-line"
        }`}>
          <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs ${
            isLightHome ? "text-[#475569]" : "text-slate/75"
          }`}>
            <span>&copy; {new Date().getFullYear()} KVJ Analytics. All Rights Reserved.</span>
            <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-tight border ${
              isLightHome
                ? "bg-slate-100 border-slate-200 text-[#475569]"
                : "bg-slate/5 border-line text-slate/85"
            }`}>
              GSTIN: {contact.gstNumber}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className={`text-xs hover:translate-y-[-1px] transition-all duration-150 inline-flex items-center ${
                isLightHome ? "text-[#475569] hover:text-[#0B1F3A]" : "text-slate hover:text-brand"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={`text-xs hover:translate-y-[-1px] transition-all duration-150 inline-flex items-center ${
                isLightHome ? "text-[#475569] hover:text-[#0B1F3A]" : "text-slate hover:text-brand"
              }`}
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Terms & Conditions
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
