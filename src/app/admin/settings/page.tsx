"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings as SettingsIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";
import { useForm, FormSection, FormRow, TextField, SwitchField, FormActions } from "@/components/admin/FormKit";
import { email as emailRule, type FieldSchema } from "@/lib/admin/validators";

interface Settings {
  siteName: string; supportEmail: string; supportPhone: string; whatsappNumber: string;
  leadNotificationEmail: string; maintenanceMode: boolean;
}

const schema: FieldSchema = { supportEmail: [emailRule()], leadNotificationEmail: [emailRule()] };

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data, loading, error } = useAdminFetch<{ settings: Settings }>("/api/admin/settings", { onUnauthorized: () => router.push("/admin") });
  const [banner, setBanner] = React.useState<{ ok: boolean; msg: string } | null>(null);

  const form = useForm<Record<string, unknown>>({
    initial: { siteName: "", supportEmail: "", supportPhone: "", whatsappNumber: "", leadNotificationEmail: "", maintenanceMode: false },
    schema,
    onSubmit: async (values) => {
      setBanner(null);
      try {
        const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Save failed");
        setBanner({ ok: true, msg: "Settings saved." });
      } catch (e) { setBanner({ ok: false, msg: e instanceof Error ? e.message : "Save failed" }); }
    },
  });

  useEffect(() => { if (data?.settings) form.reset(data.settings as unknown as Record<string, unknown>); }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-[800px] p-4 pb-24 md:p-6 lg:p-8">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><SettingsIcon className="h-5 w-5 text-brand" />Settings</h2>
        <p className="text-sm text-slate-500">Site-wide contact details, notification routing and maintenance mode.</p>
      </div>

      {banner && (
        <div className={`mb-5 flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold ${banner.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {banner.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}{banner.msg}
        </div>
      )}

      {loading && !data ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-20 w-full rounded-2xl" />)}</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-700">{error}</div>
      ) : (
        <div className="space-y-5">
          <FormSection title="General">
            <TextField form={form} name="siteName" label="Site name" placeholder="KVJ Analytics" />
            <FormRow cols={2}>
              <TextField form={form} name="supportEmail" type="email" label="Support email" placeholder="support@kvjanalytics.com" />
              <TextField form={form} name="supportPhone" type="tel" label="Support phone" placeholder="+91…" />
            </FormRow>
            <TextField form={form} name="whatsappNumber" type="tel" label="WhatsApp number" placeholder="+91…" description="Used by the floating WhatsApp button." />
          </FormSection>

          <FormSection title="Notifications">
            <TextField form={form} name="leadNotificationEmail" type="email" label="New-lead notification email" placeholder="sales@kvjanalytics.com"
              help="Where a copy of new contact-form leads should be sent (needs Resend wiring to take effect)." />
          </FormSection>

          <FormSection title="Maintenance">
            <SwitchField form={form} name="maintenanceMode" label="Maintenance mode" description="Flag only — wire this into middleware to actually gate the public site." />
          </FormSection>
        </div>
      )}

      <FormActions saving={form.isSubmitting} saveLabel="Save settings" onSave={() => form.handleSubmit()} />
    </div>
  );
}
