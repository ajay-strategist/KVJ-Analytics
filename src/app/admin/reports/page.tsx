"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { WidgetPanel, BarList } from "@/components/admin/widgets";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface Point { label: string; value: number }
interface ReportsData {
  enrollmentsByMonth: Point[]; revenueByMonth: Point[]; topCourses: Point[]; leadsByStatus: Point[]; leadsBySource: Point[];
}

export default function AdminReportsPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useAdminFetch<ReportsData>("/api/admin/reports", { onUnauthorized: () => router.push("/admin") });

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-brand" />Reports</h2>
        <p className="text-sm text-slate-500">Enrollment, revenue and lead trends computed from live data — last 6 months.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-700">
          {error} <button onClick={reload} className="ml-2 underline">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <WidgetPanel title="Enrollments by month">
            {loading ? <Skeleton /> : <BarList data={data?.enrollmentsByMonth ?? []} />}
          </WidgetPanel>
          <WidgetPanel title="Revenue by month">
            {loading ? <Skeleton /> : <BarList data={data?.revenueByMonth ?? []} valueFormat={(n) => `₹${n.toLocaleString("en-IN")}`} />}
          </WidgetPanel>
          <WidgetPanel title="Top courses by enrollment">
            {loading ? <Skeleton /> : <BarList data={data?.topCourses ?? []} />}
          </WidgetPanel>
          <WidgetPanel title="Leads by status">
            {loading ? <Skeleton /> : <BarList data={data?.leadsByStatus ?? []} />}
          </WidgetPanel>
          <WidgetPanel title="Leads by source page">
            {loading ? <Skeleton /> : <BarList data={data?.leadsBySource ?? []} />}
          </WidgetPanel>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return <div className="space-y-3">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-6 w-full" />)}</div>;
}
