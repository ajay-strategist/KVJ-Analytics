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
    <section className="mesh-hero hero-grid hero-bleed relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-hero text-ink">
      <div className="blob animate-blob absolute -top-24 right-[-4rem] w-[28rem] h-[28rem] bg-brand/10 pointer-events-none" />
      <div className="blob animate-blob absolute bottom-[-6rem] left-[-4rem] w-[24rem] h-[24rem] bg-education/8 pointer-events-none" style={{ animationDelay: "4s" }} />

      <Container className="relative z-10">
        {/* Centered header */}
        <Reveal className="max-w-3xl mx-auto text-center mb-12 md:mb-14">
          <BoldStatement variant="h1" className="mb-4 text-ink">
            {page.heading}
          </BoldStatement>
          <p className="text-xl md:text-2xl font-medium signature-gradient-text mb-5">
            {page.strapline}
          </p>
          <p className="text-lg text-slate font-light leading-relaxed">{page.intro}</p>
        </Reveal>

        {/* Unified two-panel card */}
        <Reveal className="max-w-6xl mx-auto rounded-card overflow-hidden shadow-xl border border-line bg-card">
          <div className="grid lg:grid-cols-12">
            {/* Info panel (dark premium & cyan/blue radar) */}
            <div
              className="lg:col-span-5 relative overflow-hidden p-8 sm:p-10 text-white flex flex-col min-h-[500px]"
              style={{ background: "linear-gradient(150deg, #0A0A0E 0%, #12121A 60%, #181824 100%)" }}
            >
              {/* Glowing backlights */}
              <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-blob" style={{ background: "rgba(0, 240, 255, 0.15)" }} />
              <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-blob" style={{ background: "rgba(0, 114, 255, 0.1)", animationDelay: "3s" }} />

              {/* Pulsing Radar Connectivity Map Overlay */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0">
                <defs>
                  <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                {/* Concentric Pulsing Waves */}
                <circle cx="200" cy="200" r="40" fill="url(#radarGlow)" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" className="animate-[ping_3.5s_linear_infinite]" />
                <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(0, 240, 255, 0.12)" strokeWidth="1" className="animate-[ping_5s_linear_infinite]" />
                <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(0, 114, 255, 0.08)" strokeWidth="1" className="animate-[ping_6.5s_linear_infinite]" />
                
                {/* Grid rings */}
                <circle cx="200" cy="200" r="50" fill="none" stroke="rgba(0, 240, 255, 0.06)" strokeWidth="0.8" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(0, 240, 255, 0.06)" strokeWidth="0.8" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="0.8" />
                
                {/* Sweep line */}
                <line x1="200" y1="200" x2="200" y2="40" stroke="rgba(0, 240, 255, 0.35)" strokeWidth="1.2" className="origin-[200px_200px] animate-[spin_12s_linear_infinite]" />
                
                {/* Blinking geographic connectivity points */}
                <circle cx="120" cy="150" r="3" fill="#00F0FF" className="animate-ping" />
                <circle cx="120" cy="150" r="2" fill="#00F0FF" />
                
                <circle cx="280" cy="180" r="3" fill="#0072FF" className="animate-[ping_2s_linear_infinite_0.5s]" />
                <circle cx="280" cy="180" r="2" fill="#0072FF" />

                <circle cx="220" cy="290" r="3" fill="#00F0FF" className="animate-[ping_4s_linear_infinite_1.2s]" />
                <circle cx="220" cy="290" r="2" fill="#00F0FF" />
                
                <line x1="50" y1="200" x2="350" y2="200" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />
                <line x1="200" y1="50" x2="200" y2="350" stroke="rgba(0, 240, 255, 0.04)" strokeWidth="1" />
              </svg>

              <div className="relative z-10 flex flex-col h-full">
                {/* Brand block */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-display mb-1.5 text-white">KVJ Analytics</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand">
                    Analytics | Automation | Training | Educational Technology
                  </p>
                </div>

                {/* Details */}
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-white/5 border border-white/10 shrink-0 text-brand">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Office</div>
                      <p className="text-sm text-slate-350 leading-relaxed">{contact.address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-white/5 border border-white/10 shrink-0 text-brand">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</div>
                      <a href={`mailto:${contact.email}`} className="text-sm font-semibold text-white hover:text-brand transition-colors break-all">
                        {contact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-white/5 border border-white/10 shrink-0 text-brand">
                      <Phone className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</div>
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

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/91${contact.phones[0]}?text=${encodeURIComponent(
                    "Hello KVJ Analytics, I visited your website and would like to discuss training/automation."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-btn bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>

            {/* Form panel (white) */}
            <div className="lg:col-span-7 p-8 sm:p-10">
              <h2 className="text-2xl font-bold font-display text-ink mb-1.5 tracking-tight">Send Us a Message</h2>
              <p className="text-sm text-slate font-medium mb-7">
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
