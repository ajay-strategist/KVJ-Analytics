import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { getPageContent } from "@/lib/content";
import { FALLBACK_TERMS } from "@/lib/constants";

export const revalidate = 3600;

export default async function TermsPage() {
  const stored = (await getPageContent("terms")) as Record<string, any> | null;
  const page = { ...FALLBACK_TERMS, ...(stored || {}) };
  return (
    <Section background="default" className="bg-surface/30 relative overflow-hidden py-16 md:py-24">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      
      <Container className="relative z-10 max-w-4xl">
        <Card className="p-8 md:p-12 border-line/80 shadow-soft bg-base relative overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 signature-gradient" />

          <div className="max-w-3xl mx-auto">
            <Eyebrow className="mb-2">{page.eyebrow}</Eyebrow>
            <BoldStatement variant="h1" className="mb-4 text-ink leading-tight tracking-tight">
              {page.heading}
            </BoldStatement>
            <p className="text-sm text-slate mb-8 border-b border-line pb-4 font-medium">{page.lastUpdated}</p>

            {page.bodyHtml ? (
              <div
                className="prose prose-slate max-w-none text-slate leading-relaxed text-base font-medium space-y-6"
                dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
              />
            ) : (
            <div className="space-y-6 text-slate leading-relaxed text-base font-medium">
              <p>
                Welcome to KVJ Analytics. By accessing this website or enrolling in our programs, you agree to comply with and be bound by the following Terms and Conditions.
              </p>

              <h4 className="text-lg font-bold text-ink font-display pt-4">1. Use of Content & Gated Materials</h4>
              <p>
                All course curriculum sheets, dashboard worksheets, video links, and mock-test questionnaires are the intellectual property of KVJ Analytics. Gated content is served strictly for single-user student study and may not be shared, duplicated, or distributed.
              </p>

              <h4 className="text-lg font-bold text-ink font-display pt-4">2. Account Credentials & Security</h4>
              <p>
                If registering for college programs, you must use valid credentials and input correct details. Share of rotating access codes or attempt to bypass security layers will result in immediate enrollment suspension.
              </p>

              <h4 className="text-lg font-bold text-ink font-display pt-4">3. Payments, GST, & Refunds</h4>
              <p>
                Prices listed for training products are in INR (Indian Rupees) and are inclusive of GST parameters where noted. Fees paid for certification enrollments are non-refundable once gated study materials or mock tests have been accessed.
              </p>

              <h4 className="text-lg font-bold text-ink font-display pt-4">4. Governing Law</h4>
              <p>
                Any disputes arising out of the use of our services or platforms are governed by the laws of Cochin, Kerala, India.
              </p>
            </div>
            )}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
