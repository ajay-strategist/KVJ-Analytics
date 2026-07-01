import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BoldStatement } from "@/components/ui/BoldStatement";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { getPageContent } from "@/lib/content";
import { FALLBACK_PRIVACY } from "@/lib/constants";

export const revalidate = 3600;

export default async function PrivacyPage() {
  const stored = (await getPageContent("privacy")) as Record<string, any> | null;
  const page = { ...FALLBACK_PRIVACY, ...(stored || {}) };
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
                At KVJ Analytics, we respect your privacy and are committed to protecting the personal data we hold. This Privacy Policy details how we collect, use, and safeguard student and organization information when you use our website, enroll in certification programs, or use our platforms Grade Scope and Protrix.
              </p>
              
              <h4 className="text-lg font-bold text-ink font-display pt-4">1. Data We Collect</h4>
              <p>
                We collect information you provide directly, such as your name, email address, phone number, and organization when filling inquiry forms or registering via College Rotating Access Codes. For college programs, registration does not request payment data, but collects academic progress scores on mock-test evaluation structures.
              </p>

              <h4 className="text-lg font-bold text-ink font-display pt-4">2. Payment Security</h4>
              <p>
                Paid courses are processed securely through Razorpay checkout portals. KVJ Analytics does not store credit card or bank login details on our servers. Webhook validations ensure course enrollments are written only upon signature-verified transaction success.
              </p>

              <h4 className="text-lg font-bold text-ink font-display pt-4">3. Data Sharing & Consent</h4>
              <p>
                We never trade or sell student PII. Data collected via college rotating enrollment codes is accessible to the respective academic administrator of the college batch for grading purposes, with student consent captured upon code entry.
              </p>

              <h4 className="text-lg font-bold text-ink font-display pt-4">4. Your Rights</h4>
              <p>
                You have the right to request access to your profile data, review Mock Test scores, and request modifications or data removal by contacting us at info@kvjanalytics.in.
              </p>
            </div>
            )}
          </div>
        </Card>
      </Container>
    </Section>
  );
}
