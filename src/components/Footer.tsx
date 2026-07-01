import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ShieldAlert, FileText } from "lucide-react";
import { Container } from "./ui/Container";
import { FALLBACK_SITE_SETTINGS } from "@/lib/constants";

interface FooterProps {
  siteSettings?: typeof FALLBACK_SITE_SETTINGS;
}

export function Footer({ siteSettings = FALLBACK_SITE_SETTINGS }: FooterProps) {
  const description = siteSettings.footerDescription || FALLBACK_SITE_SETTINGS.footerDescription;
  const tagline = siteSettings.footerTagline || FALLBACK_SITE_SETTINGS.footerTagline;
  const contact = siteSettings.contactInfo || FALLBACK_SITE_SETTINGS.contactInfo;
  const columns = siteSettings.footerColumns || FALLBACK_SITE_SETTINGS.footerColumns;

  return (
    <footer className="bg-[#0A0A0E]/80 backdrop-blur-xl text-ink pt-16 pb-8 border-t border-line relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-education/8 rounded-full blur-3xl pointer-events-none" />

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
            <p className="text-sm font-semibold text-slate-200 mb-6 leading-relaxed">
              {tagline}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mb-8 max-w-sm font-light">
              {description}
            </p>
            {/* Regions badge strip */}
            <div className="flex flex-wrap gap-2">
              {siteSettings.regionsServed.map((region, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-200 border border-white/10 hover:bg-brand/5 hover:text-brand hover:border-brand/30 transition-all duration-200 cursor-default"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((column, idx) => (
            <div key={idx} className="lg:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-6 border-b border-line pb-2.5 font-display">
                {column.heading}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-brand hover:translate-x-1.5 transition-all duration-200 block"
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
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-6 border-b border-line pb-2.5 font-display">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-brand mr-3 shrink-0 mt-1" />
                <span className="text-xs text-slate-200 leading-relaxed">
                  {contact.address}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-brand mr-3 shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-xs text-slate-200 hover:text-brand transition-colors duration-150"
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
                      className="text-xs text-slate-200 hover:text-brand transition-colors duration-150"
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
        <div className="border-t border-line pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-slate-300">
            <span>&copy; {new Date().getFullYear()} KVJ Analytics. All Rights Reserved.</span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-tight text-slate-200">
              GSTIN: {contact.gstNumber}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="text-xs text-slate-300 hover:text-brand hover:translate-y-[-1px] transition-all duration-150 inline-flex items-center"
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-slate-300 hover:text-brand hover:translate-y-[-1px] transition-all duration-150 inline-flex items-center"
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
