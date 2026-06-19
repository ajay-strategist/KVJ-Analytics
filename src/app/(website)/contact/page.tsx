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
    <section className="mesh-hero relative overflow-hidden py-20 md:py-28">
      <div className="blob animate-blob absolute -top-24 right-[-4rem] w-[26rem] h-[26rem] bg-brand/10 pointer-events-none" />
      <div className="blob animate-blob absolute bottom-[-6rem] left-[-4rem] w-[22rem] h-[22rem] bg-education/10 pointer-events-none" style={{ animationDelay: "4s" }} />

      <Container className="relative z-10">
        {/* Centered header */}
        <Reveal className="max-w-3xl mx-auto text-center mb-12 md:mb-14">
          <BoldStatement variant="h1" className="mb-4">
            {page.heading}
          </BoldStatement>
          <p className="text-xl md:text-2xl font-bold font-display signature-gradient-text mb-5">
            {page.strapline}
          </p>
          <p className="text-lg text-slate leading-relaxed">{page.intro}</p>
        </Reveal>

        {/* Unified two-panel card */}
        <Reveal className="max-w-6xl mx-auto rounded-card overflow-hidden shadow-xl border border-line bg-white">
          <div className="grid lg:grid-cols-12">
            {/* Info panel (navy) */}
            <div
              className="lg:col-span-5 relative overflow-hidden p-8 sm:p-10 text-white flex flex-col"
              style={{ background: "linear-gradient(150deg, #0B1635 0%, #16284f 55%, #1A56DB 130%)" }}
            >
              <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-blob" style={{ background: "rgba(26,86,219,0.35)" }} />
              <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full blur-3xl pointer-events-none animate-blob" style={{ background: "rgba(249,115,22,0.16)", animationDelay: "3s" }} />

              <div className="relative z-10 flex flex-col h-full">
                {/* Brand block */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-display mb-1.5">KVJ Analytics</h2>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
                    Analytics | Automation | Training | Educational Technology
                  </p>
                </div>

                {/* Details */}
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-white/10 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white/55 mb-1">Office</div>
                      <p className="text-sm text-white/85 leading-relaxed">{contact.address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-white/10 shrink-0">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold uppercase tracking-wider text-white/55 mb-1">Email</div>
                      <a href={`mailto:${contact.email}`} className="text-sm font-semibold text-white hover:text-cta transition-colors break-all">
                        {contact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-white/10 shrink-0">
                      <Phone className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-white/55 mb-1">Phone</div>
                      <div className="flex flex-col gap-0.5">
                        {contact.phones.map((phone: string, idx: number) => (
                          <a key={idx} href={`tel:${phone}`} className="text-sm font-semibold text-white hover:text-cta transition-colors">
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
                  className="mt-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-btn bg-success hover:bg-success/90 text-white font-bold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5"
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
