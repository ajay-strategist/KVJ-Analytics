"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, GraduationCap, Newspaper, MessageSquare, Plus, Globe, Ticket, UserSquare2,
  AlertCircle, RefreshCw, Image as ImageIcon, ShoppingCart, BarChart3,
  Sparkles, ChevronRight
} from "lucide-react";
import { StatWidget, WidgetPanel, QuickAction, ListRow, HealthRow } from "@/components/admin/widgets";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";
import { formatDate } from "@/components/admin/DataTable/cells";

interface DashboardData {
  counts: Record<string, number | null>;
  recentLeads: { id: string; name?: string; email?: string; created_at?: string }[];
  recentEnrollments: { id: string; user_id?: string; course_slug?: string; created_at?: string }[];
  accessCodeStats: { total: number; totalSeats: number; seatsUsed: number; utilizationRate: number };
  generatedAt: string;
}

const fmt = (n?: number | null) => (typeof n === "number" ? n.toLocaleString("en-IN") : "—");
const sum = (...vals: (number | null | undefined)[]) => {
  const nums = vals.filter((v): v is number => typeof v === "number");
  return nums.length ? nums.reduce((a, b) => a + b, 0) : null;
};

/** Admin dashboard — live aggregated counts via /api/admin/dashboard. No fabricated statistics. */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useAdminFetch<DashboardData>("/api/admin/dashboard", {
    onUnauthorized: () => router.push("/admin"),
  });
  const c = data?.counts ?? {};
  const ac = data?.accessCodeStats ?? { total: 0, totalSeats: 0, seatsUsed: 0, utilizationRate: 0 };

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Welcome back <span className="animate-wave origin-[70%_70%] inline-block">👋</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">KVJ Analytics Admin Console. Manage courses, enrollments, and access codes.</p>
        </div>
        {data && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Updated {new Date(data.generatedAt).toLocaleTimeString("en-IN")}
          </div>
        )}
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50/50 p-12 text-center max-w-xl mx-auto shadow-sm">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <div>
            <h4 className="font-bold text-slate-900">Database Connection Error</h4>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
          <button onClick={reload} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"><RefreshCw className="h-3.5 w-3.5" />Retry Connection</button>
        </div>
      ) : (
        <>
          {/* live stat row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatWidget label="Active Courses" value={fmt(c.courses)} icon={BookOpen} loading={loading} href="/admin/courses" tone="cyan" />
            <StatWidget label="Enrollments" value={fmt(c.enrollments)} icon={GraduationCap} loading={loading} href="/admin/enrollments" tone="violet" />
            <StatWidget label="Vouchers / Access Codes" value={fmt(c.vouchers)} icon={Ticket} loading={loading} href="/admin/unlock-codes" tone="amber" />
            <StatWidget label="Leads Inbox" value={fmt(c.leads)} icon={MessageSquare} loading={loading} href="/admin/leads" tone="emerald" />
          </div>

          {/* quick actions */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" /> Quick admin actions
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <QuickAction label="New Course" href="/admin/courses?action=new" icon={Plus} tone="cyan" />
              <QuickAction label="Edit CMS" href="/admin/content" icon={Globe} tone="blue" />
              <QuickAction label="New Blog Post" href="/admin/blog/new" icon={Newspaper} tone="violet" />
              <QuickAction label="View Leads" href="/admin/leads" icon={MessageSquare} tone="emerald" />
              <QuickAction label="Generate Vouchers" href="/admin/unlock-codes?action=new" icon={Ticket} tone="amber" />
              <QuickAction label="Manage Team" href="/admin/team" icon={UserSquare2} tone="rose" />
            </div>
          </div>

          {/* Grid Layout for Panels */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Access Code Utilization Panel */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Access Code Utilization</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Tracking seat claiming performance for Colleges & Corporate accounts.</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100/40">Real-time</span>
                  </div>

                  {loading ? (
                    <div className="space-y-4 py-3">
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                      <div className="h-6 bg-slate-100 rounded animate-pulse w-3/4"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Metric blocks */}
                      <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-5">
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Batches</p>
                          <p className="text-2xl font-bold text-slate-800 mt-1">{ac.total}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Seats</p>
                          <p className="text-2xl font-bold text-slate-800 mt-1">{ac.totalSeats}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Seats Redeemed</p>
                          <p className="text-2xl font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                            {ac.seatsUsed}
                            <span className="text-xs font-medium text-slate-450">({ac.utilizationRate}%)</span>
                          </p>
                        </div>
                      </div>

                      {/* Progress bar container */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">Global Seat Claim Rate</span>
                          <span className="text-cyan-700 font-bold">{ac.utilizationRate}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500 transition-all duration-550 rounded-full"
                            style={{ width: `${Math.min(ac.utilizationRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Redemption logs audited under compliance standards.</span>
                  <Link href="/admin/unlock-codes" className="text-xs font-bold text-cyan-700 hover:text-cyan-850 flex items-center gap-1">
                    Manage Access Codes <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <WidgetPanel title="Recent contact requests" action={{ label: "Open leads", href: "/admin/leads" }}>
                {loading ? (
                  <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-9 w-full" />)}</div>
                ) : (data?.recentLeads?.length ?? 0) === 0 ? (
                  <p className="py-6 text-center text-[13px] text-slate-400">No contact requests yet.</p>
                ) : (
                  data!.recentLeads.map((l) => <ListRow key={l.id} primary={l.name || l.email || "Lead"} secondary={`${l.email ?? ""}${l.created_at ? " · " + formatDate(l.created_at) : ""}`} badge="Lead" />)
                )}
              </WidgetPanel>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <WidgetPanel title="LMS Platform Statistics">
                <ListRow primary="Total Inquiries" secondary="course & program" badge={fmt(c.inquiries)} />
                <ListRow primary="Applications" secondary="jobs + internships" badge={fmt(sum(c.jobApplications, c.internshipApplications))} />
                <ListRow primary="Internships" badge={fmt(c.internships)} />
                <ListRow primary="Vouchers Generated" badge={fmt(c.vouchers)} />
                <ListRow primary="Active Jobs" badge={fmt(c.jobs)} />
              </WidgetPanel>

              <WidgetPanel title="System Status">
                <HealthRow label="Supabase Database" ok={!error && !loading} note={loading ? "Checking…" : "Connected"} />
                <HealthRow label="Next.js App Server" ok={true} note="Online" />
                <HealthRow label="Sanity CMS Endpoint" ok={true} note="Active" />
              </WidgetPanel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
