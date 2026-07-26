"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LineChart, ExternalLink } from "lucide-react";
import { StatWidget, WidgetPanel, BarList, HealthRow } from "@/components/admin/widgets";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";
import { GraduationCap, Award, Users2, Ticket } from "lucide-react";

interface Point { label: string; value: number }
interface AnalyticsData {
  testAttempts: number; passRate: number | null; enrollmentsByMethod: Point[]; studentsByAccountType: Point[];
  leadFunnel: Point[]; activeCompletedEnrollments: number; gaConfigured: boolean; metaPixelConfigured: boolean;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useAdminFetch<AnalyticsData>("/api/admin/analytics", { onUnauthorized: () => router.push("/admin") });

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><LineChart className="h-5 w-5 text-brand" />Analytics</h2>
        <p className="text-sm text-slate-500">Learning outcomes &amp; lead conversion from live platform data. Website traffic analytics live in Google Analytics.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-700">
          {error} <button onClick={reload} className="ml-2 underline">Retry</button>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatWidget label="Test attempts" value={loading ? "—" : String(data?.testAttempts ?? 0)} icon={GraduationCap} loading={loading} tone="violet" />
            <StatWidget label="Pass rate" value={loading ? "—" : data?.passRate != null ? `${data.passRate}%` : "—"} icon={Award} loading={loading} tone="emerald" />
            <StatWidget label="Completed enrollments" value={loading ? "—" : String(data?.activeCompletedEnrollments ?? 0)} icon={Users2} loading={loading} tone="cyan" />
            <StatWidget label="Vouchers used" value={loading ? "—" : String(data?.enrollmentsByMethod?.find((e) => e.label === "college_code")?.value ?? 0)} icon={Ticket} loading={loading} tone="amber" />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              <WidgetPanel title="Lead conversion funnel">
                <BarList data={data?.leadFunnel ?? []} />
              </WidgetPanel>
              <WidgetPanel title="Students by account type">
                <BarList data={data?.studentsByAccountType ?? []} />
              </WidgetPanel>
            </div>
            <div className="space-y-5">
              <WidgetPanel title="Enrollment method">
                <BarList data={data?.enrollmentsByMethod ?? []} />
              </WidgetPanel>
              <WidgetPanel title="Website analytics">
                <HealthRow label="Google Analytics" ok={!!data?.gaConfigured} note={data?.gaConfigured ? "Connected" : "Not configured"} />
                <HealthRow label="Meta Pixel" ok={!!data?.metaPixelConfigured} note={data?.metaPixelConfigured ? "Connected" : "Not configured"} />
                <a href="https://analytics.google.com" target="_blank" rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline">
                  Open Google Analytics<ExternalLink className="h-3.5 w-3.5" />
                </a>
              </WidgetPanel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
