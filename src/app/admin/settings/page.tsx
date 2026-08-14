"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings as SettingsIcon,
  AlertCircle,
  CheckCircle2,
  BellRing,
  ExternalLink,
  Send,
  Loader2,
  Eye,
  EyeOff,
  Info,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";
import { useForm, FormSection, FormRow, TextField, SwitchField, FormActions } from "@/components/admin/FormKit";
import { email as emailRule, type FieldSchema } from "@/lib/admin/validators";

interface Settings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  leadNotificationEmail: string;
  maintenanceMode: boolean;
  teamsWebhookUrl: string;
  telegramBotToken: string;
  telegramChatId: string;
}

const schema: FieldSchema = { supportEmail: [emailRule()], leadNotificationEmail: [emailRule()] };

export default function AdminSettingsPage() {
  const router = useRouter();
  const { data, loading, error } = useAdminFetch<{ settings: Settings }>("/api/admin/settings", {
    onUnauthorized: () => router.push("/admin"),
  });
  const [banner, setBanner] = useState<{ ok: boolean; msg: string } | null>(null);

  // Teams test state
  const [teamsUrl, setTeamsUrl] = useState("");
  const [showTeamsUrl, setShowTeamsUrl] = useState(false);
  const [testingTeams, setTestingTeams] = useState(false);
  const [teamsTestResult, setTeamsTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [showTeamsGuide, setShowTeamsGuide] = useState(false);

  // Telegram state
  const [telegramToken, setTelegramToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [showTelegramToken, setShowTelegramToken] = useState(false);

  const form = useForm<Record<string, unknown>>({
    initial: {
      siteName: "",
      supportEmail: "",
      supportPhone: "",
      whatsappNumber: "",
      leadNotificationEmail: "",
      maintenanceMode: false,
      teamsWebhookUrl: "",
      telegramBotToken: "",
      telegramChatId: "",
    },
    schema,
    onSubmit: async (values) => {
      setBanner(null);
      const payload = { ...values, teamsWebhookUrl: teamsUrl, telegramBotToken: telegramToken, telegramChatId };
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Save failed");
        setBanner({ ok: true, msg: "Settings saved successfully." });
      } catch (e) {
        setBanner({ ok: false, msg: e instanceof Error ? e.message : "Save failed" });
      }
    },
  });

  useEffect(() => {
    if (data?.settings) {
      form.reset(data.settings as unknown as Record<string, unknown>);
      setTeamsUrl(data.settings.teamsWebhookUrl || "");
      setTelegramToken(data.settings.telegramBotToken || "");
      setTelegramChatId(data.settings.telegramChatId || "");
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTestTeams = async () => {
    if (!teamsUrl.trim()) {
      setTeamsTestResult({ ok: false, msg: "Please enter a Webhook URL first." });
      return;
    }
    setTestingTeams(true);
    setTeamsTestResult(null);
    try {
      const res = await fetch("/api/admin/settings/test-teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: teamsUrl.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Test failed");
      setTeamsTestResult({ ok: true, msg: json.message || "Test message sent! Check your Teams channel." });
    } catch (e) {
      setTeamsTestResult({ ok: false, msg: e instanceof Error ? e.message : "Connection failed" });
    } finally {
      setTestingTeams(false);
    }
  };

  return (
    <div className="mx-auto max-w-[860px] p-4 pb-24 md:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-brand" />
          Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Site-wide configuration, notification integrations, and maintenance mode.
        </p>
      </div>

      {banner && (
        <div className={`mb-5 flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold ${banner.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {banner.ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {banner.msg}
        </div>
      )}

      {loading && !data ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-20 w-full rounded-2xl" />)}</div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-700">{error}</div>
      ) : (
        <div className="space-y-6">

          {/* General */}
          <FormSection title="General">
            <TextField form={form} name="siteName" label="Site name" placeholder="KVJ Analytics" />
            <FormRow cols={2}>
              <TextField form={form} name="supportEmail" type="email" label="Support email" placeholder="support@kvjanalytics.com" />
              <TextField form={form} name="supportPhone" type="tel" label="Support phone" placeholder="+91…" />
            </FormRow>
            <TextField form={form} name="whatsappNumber" type="tel" label="WhatsApp number" placeholder="+91…" description="Used by the floating WhatsApp button." />
          </FormSection>

          {/* ── MICROSOFT TEAMS ───────────────────────────────────── */}
          <div className="rounded-2xl border border-line bg-card shadow-soft overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-gradient-to-r from-[#6264A7]/5 to-transparent">
              <div className="flex items-center gap-3">
                {/* Teams icon */}
                <div className="w-9 h-9 rounded-xl bg-[#6264A7] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M19.19 8.77a4 4 0 1 0-5.66-5.66 4 4 0 0 0 5.66 5.66zM21 10h-5a1 1 0 0 0-1 1v6a3 3 0 0 0 6 0v-6a1 1 0 0 0-1-1zM12 13H3a1 1 0 0 0-1 1v5a3 3 0 0 0 6 0v-1h4a1 1 0 0 0 0-2H8v-2h4a1 1 0 0 0 0-2zM7.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">Microsoft Teams Notifications</p>
                  <p className="text-xs text-slate mt-0.5">Send new lead alerts to a Teams channel via Incoming Webhook</p>
                </div>
              </div>
              {teamsUrl && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Step-by-step guide toggle */}
              <button
                type="button"
                onClick={() => setShowTeamsGuide(!showTeamsGuide)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#6264A7]/5 border border-[#6264A7]/20 rounded-xl text-xs font-semibold text-[#6264A7] hover:bg-[#6264A7]/10 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  How to get a Teams Incoming Webhook URL
                </span>
                {showTeamsGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showTeamsGuide && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs text-slate-700">
                  <p className="font-bold text-slate-900 text-sm">Step-by-step: Create an Incoming Webhook in Teams</p>
                  <ol className="space-y-2.5 list-none">
                    {[
                      { n: "1", text: "Open Microsoft Teams and go to the channel where you want to receive lead notifications." },
                      { n: "2", text: <>Click the <strong>···</strong> (More options) next to the channel name → <strong>Connectors</strong>.</> },
                      { n: "3", text: <>Search for <strong>&quot;Incoming Webhook&quot;</strong> and click <strong>Configure</strong>.</> },
                      { n: "4", text: <>Give it a name like <strong>&quot;KVJ Lead Alerts&quot;</strong>, optionally upload the KVJ logo, then click <strong>Create</strong>.</> },
                      { n: "5", text: <>Copy the <strong>Webhook URL</strong> shown (starts with <code className="bg-slate-200 px-1 rounded">https://prod-XXX.westus.logic.azure.com</code> or <code className="bg-slate-200 px-1 rounded">https://XXX.webhook.office.com</code>).</> },
                      { n: "6", text: "Paste the URL below and click Test Connection to verify it's working." },
                    ].map((step) => (
                      <li key={step.n} className="flex gap-3 items-start">
                        <span className="w-5 h-5 rounded-full bg-[#6264A7] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{step.n}</span>
                        <span className="leading-relaxed">{step.text}</span>
                      </li>
                    ))}
                  </ol>
                  <a
                    href="https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#6264A7] font-semibold hover:underline mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Official Microsoft Docs
                  </a>
                </div>
              )}

              {/* Webhook URL input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Incoming Webhook URL</label>
                <div className="relative flex items-center">
                  <input
                    type={showTeamsUrl ? "text" : "password"}
                    value={teamsUrl}
                    onChange={(e) => { setTeamsUrl(e.target.value); setTeamsTestResult(null); }}
                    placeholder="https://prod-xxx.westus.logic.azure.com/... or https://xxx.webhook.office.com/..."
                    className="w-full pr-20 pl-3.5 py-2.5 text-xs border border-line rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-[#6264A7]/30 focus:border-[#6264A7]/50 font-mono transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTeamsUrl(!showTeamsUrl)}
                    className="absolute right-2.5 text-slate hover:text-ink transition-colors"
                    title={showTeamsUrl ? "Hide URL" : "Show URL"}
                  >
                    {showTeamsUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  This URL is stored securely in the database and used for all new lead notifications.
                </p>
              </div>

              {/* Test Connection button + result */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleTestTeams}
                  disabled={testingTeams || !teamsUrl.trim()}
                  className="py-2 px-4 bg-[#6264A7] text-white hover:bg-[#6264A7]/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  {testingTeams ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing...</>
                  ) : (
                    <><Send className="w-3.5 h-3.5" /> Send Test Message</>
                  )}
                </button>
                <p className="text-[11px] text-slate-500">Click to send a test card to your Teams channel</p>
              </div>

              {teamsTestResult && (
                <div className={`flex items-start gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border ${teamsTestResult.ok ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                  {teamsTestResult.ok
                    ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  {teamsTestResult.msg}
                </div>
              )}
            </div>
          </div>

          {/* ── TELEGRAM ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-line bg-card shadow-soft overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-gradient-to-r from-[#26A5E4]/5 to-transparent">
              <div className="w-9 h-9 rounded-xl bg-[#26A5E4] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Telegram Notifications</p>
                <p className="text-xs text-slate mt-0.5">Send alerts to a Telegram group or channel via Bot API</p>
              </div>
              {telegramToken && telegramChatId && (
                <span className="ml-auto text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              )}
            </div>

            <div className="p-5 space-y-4">
              {/* Telegram guide */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
                <p className="font-bold text-slate-900">How to set up Telegram alerts:</p>
                <ol className="space-y-1.5 list-none">
                  {[
                    <>Message <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-[#26A5E4] font-semibold hover:underline">@BotFather</a> on Telegram, send <code className="bg-slate-200 px-1 rounded">/newbot</code>, follow the prompts to get your <strong>Bot Token</strong>.</>,
                    <>Add the bot to your group/channel as an Administrator.</>,
                    <>Get the <strong>Chat ID</strong>: send a message to the group, then visit <code className="bg-slate-200 px-1 rounded">https://api.telegram.org/bot&#123;TOKEN&#125;/getUpdates</code> — the <code className="bg-slate-200 px-1 rounded">chat.id</code> field is your Chat ID (may be negative for groups).</>,
                  ].map((step, i) => (
                    <li key={i} className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-[#26A5E4] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <FormRow cols={2}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bot Token</label>
                  <div className="relative flex items-center">
                    <input
                      type={showTelegramToken ? "text" : "password"}
                      value={telegramToken}
                      onChange={(e) => setTelegramToken(e.target.value)}
                      placeholder="123456789:AAF..."
                      className="w-full pr-9 pl-3.5 py-2.5 text-xs border border-line rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-[#26A5E4]/30 focus:border-[#26A5E4]/50 font-mono transition"
                    />
                    <button type="button" onClick={() => setShowTelegramToken(!showTelegramToken)} className="absolute right-2.5 text-slate hover:text-ink">
                      {showTelegramToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Chat ID</label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="-1001234567890"
                    className="w-full px-3.5 py-2.5 text-xs border border-line rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-[#26A5E4]/30 focus:border-[#26A5E4]/50 font-mono transition"
                  />
                </div>
              </FormRow>
              <p className="text-[11px] text-slate-400">
                Telegram credentials are stored securely in the database. Your TELEGRAM_BOT_TOKEN environment variable will be used as a fallback if these are not set.
              </p>
            </div>
          </div>

          {/* Lead email notification */}
          <FormSection title="Email Notifications">
            <TextField
              form={form}
              name="leadNotificationEmail"
              type="email"
              label="New-lead notification email"
              placeholder="sales@kvjanalytics.com"
              help="Where a copy of new contact-form leads should be sent (needs Resend wiring to take effect)."
            />
          </FormSection>

          {/* Maintenance */}
          <FormSection title="Maintenance">
            <SwitchField form={form} name="maintenanceMode" label="Maintenance mode" description="Flag only — wire this into middleware to actually gate the public site." />
          </FormSection>
        </div>
      )}

      <FormActions saving={form.isSubmitting} saveLabel="Save all settings" onSave={() => form.handleSubmit()} />
    </div>
  );
}
