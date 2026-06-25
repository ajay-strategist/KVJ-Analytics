import React from "react";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { getPageContent, mergePageContent } from "@/lib/content";
import { FALLBACK_CONTACT, FALLBACK_SITE_SETTINGS } from "@/lib/constants";

export const revalidate = 3600;

export default async function ContactPage() {
  const contactData = await getPageContent("contact");
  const settingsData = await getPageContent("site-settings");

  const page = mergePageContent(contactData, FALLBACK_CONTACT);
  const settings = mergePageContent(settingsData, FALLBACK_SITE_SETTINGS);
  const contact = settings.contactInfo || FALLBACK_SITE_SETTINGS.contactInfo;
  const inquiryAreas = page.inquiryAreas || FALLBACK_CONTACT.inquiryAreas;

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pb-28 bg-[#050505] text-slate-100 min-h-screen">
      {/* 3D Grid / Data streams overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
      <div className="blob animate-blob absolute -top-24 right-[-4rem] w-[28rem] h-[28rem] bg-brand/10 pointer-events-none blur-[100px]" />
      <div className="blob animate-blob absolute bottom-[-6rem] left-[-4rem] w-[24rem] h-[24rem] bg-corporate/8 pointer-events-none blur-[90px]" style={{ animationDelay: "4s" }} />

      <Container className="relative z-10">
        {/* Centered header */}
        <Reveal className="max-w-3xl mx-auto text-center mb-12 md:mb-14">
          <BoldStatement variant="h1" className="mb-4 text-white">
            {page.heading}
          </BoldStatement>
          <p className="text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-brand via-corporate to-brand animate-[signature-flow_6s_linear_infinite] bg-[size:200%_auto] mb-5">
            {page.strapline}
          </p>
          <p className="text-lg text-slate-400 font-light leading-relaxed">{page.intro}</p>
        </Reveal>

        {/* Unified two-panel card */}
        <Reveal className="max-w-6xl mx-auto rounded-[32px] overflow-hidden shadow-2xl border border-white/5 bg-[#0A0A0C]/75 backdrop-blur-[24px]">
          <div className="grid lg:grid-cols-12">
            
            {/* Info panel (dark premium & cyan/blue radar) */}
            <div
              className="lg:col-span-5 relative overflow-hidden p-8 sm:p-10 text-white flex flex-col min-h-[500px] border-r border-white/5"
              style={{ background: "linear-gradient(150deg, #0A0A0E 0%, #12121A 60%, #181824 100%)" }}
            >
              {/* Glowing backlights */}
              <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-blob" style={{ background: "rgba(0, 240, 255, 0.15)" }} />
              <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-blob" style={{ background: "rgba(0, 114, 255, 0.1)", animationDelay: "3s" }} />

              {/* Slow-rotating 3D Holographic Globe & Radar Ping overlay */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-25">
                <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                  <defs>
                    <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0072FF" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Globe outer glow */}
                  <circle cx="200" cy="200" r="130" fill="url(#globeGlow)" />

                  {/* 3D Wireframe Globe Group */}
                  <g className="animate-[spin_40s_linear_infinite]" style={{ transformOrigin: "200px 200px" }}>
                    <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.2" />
                    <ellipse cx="200" cy="200" rx="120" ry="40" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />
                    <ellipse cx="200" cy="200" rx="120" ry="80" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />
                    <ellipse cx="200" cy="200" rx="40" ry="120" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />
                    <ellipse cx="200" cy="200" rx="80" ry="120" fill="none" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1" />
                    <line x1="200" y1="80" x2="200" y2="320" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
                    <line x1="80" y1="200" x2="320" y2="200" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />
                  </g>

                  {/* India origin radar waves */}
                  <g transform="translate(210, 205)">
                    <circle cx="0" cy="0" r="12" fill="none" stroke="#00F0FF" strokeWidth="1.2" className="animate-ping duration-3000" />
                    <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(0, 240, 255, 0.6)" strokeWidth="1" className="animate-[ping_3.5s_linear_infinite]" />
                    <circle cx="0" cy="0" r="60" fill="none" stroke="rgba(0, 114, 255, 0.4)" strokeWidth="1" className="animate-[ping_5s_linear_infinite]" />
                    
                    <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />
                    <circle cx="0" cy="0" r="2.5" fill="#00F0FF" className="animate-pulse" />
                  </g>

                  {/* Global projects paths */}
                  <path d="M 210 205 L 140 130 M 210 205 L 290 140 M 210 205 L 160 270 M 210 205 L 270 280" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.2" strokeDasharray="3, 4" />
                  <circle cx="140" cy="130" r="3.5" fill="#D4AF37" className="animate-pulse" />
                  <circle cx="290" cy="140" r="3.5" fill="#00F0FF" className="animate-pulse" />
                  <circle cx="160" cy="270" r="3" fill="#0072FF" />
                  <circle cx="270" cy="280" r="3.5" fill="#D4AF37" className="animate-pulse" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Brand block */}
                <div className="mb-10">
                  <h2 className="text-2xl font-bold font-display mb-1.5 text-white">KVJ Analytics</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                    Analytics | Automation | Training | Educational Technology
                  </p>
                </div>

                {/* Details */}
                <ul className="space-y-6 mb-8">
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-brand/10 border border-brand/40 shrink-0 text-brand animate-pulse">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Office Address</div>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">{contact.address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-brand/10 border border-brand/40 shrink-0 text-brand animate-pulse">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Direct Email</div>
                      <a href={`mailto:${contact.email}`} className="text-sm font-semibold text-white hover:text-brand transition-colors break-all">
                        {contact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-brand/10 border border-brand/40 shrink-0 text-brand animate-pulse">
                      <Phone className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Hotlines</div>
                      <div className="flex flex-col gap-0.5">
                        {contact.phones.map((phone: string, idx: number) => (
                          <a key={idx} href={`tel:${phone}`} className="text-sm font-semibold text-white hover:text-brand transition-colors">
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                </ul>

                {/* WhatsApp button with outer green stroke glow */}
                <a
                  href={`https://wa.me/91${contact.phones[0]}?text=${encodeURIComponent(
                    "Hello KVJ Analytics, I visited your website and would like to discuss training/automation."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold text-sm shadow-[0_0_15px_rgba(37,211,102,0.4)] border border-[#25D366] hover:shadow-[0_0_25px_rgba(37,211,102,0.85)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>

            {/* Form panel */}
            <div className="lg:col-span-7 p-8 sm:p-10 bg-[#050505]/40 backdrop-blur-[24px]">
              <h2 className="text-2xl font-bold font-display text-white mb-1.5 tracking-tight">Send Us a Message</h2>
              <p className="text-sm text-slate-400 font-light mb-8">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              <ContactForm inquiryAreas={inquiryAreas} />
            </div>

          </div>
        </Reveal>
      </Container>
    </section>
  );
}
