"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  Layers,
  Download,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Database,
  Check,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Building2,
  HelpCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { useAdminFetch } from "@/components/admin/hooks/useAdminFetch";

interface TopicStatus {
  completed: boolean;
  status: "Yes" | "";
  score: number | null;
  maxScore: number | null;
  passed: boolean | null;
  submittedAt: string | null;
}

interface ModuleProgress {
  moduleId: string;
  moduleTitle: string;
  total: number;
  completed: number;
  pct: number;
}

interface StudentRow {
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  organization: string;
  accountType: string;
  enrollmentMethod: string;
  enrolledAt: string;
  completedTopicsCount: number;
  totalTopicsCount: number;
  courseCompletionPct: number;
  avgModuleCompletionPct: number;
  avgActivityScorePct: number | null;
  assessmentScore: number | null;
  assessmentPassed: boolean | null;
  assessmentAttempts: number;
  moduleProgress: Record<string, ModuleProgress>;
  topicStatuses: Record<string, TopicStatus>;
}

interface Lesson {
  id: string;
  title: string;
  kind: string;
  max_score: number;
  display_order: number;
  module_id: string;
  module_title: string;
}

interface Module {
  id: string;
  title: string;
  display_order: number;
  lessons: Lesson[];
}

interface CourseItem {
  id: string;
  title: string;
  slug: string;
}

interface ReportData {
  courses: CourseItem[];
  activeCourse: {
    id: string;
    title: string;
    slug: string;
    totalModules: number;
    totalTopics: number;
  } | null;
  modules: Module[];
  students: StudentRow[];
  kpis: {
    totalStudents: number;
    avgCompletionPct: number;
    avgScorePct: number;
    passRatePct: number;
    completedCount: number;
  };
}

export default function LearningReportsPage() {
  const router = useRouter();
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPowerBiModal, setShowPowerBiModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Construct URL with query parameter
  const fetchUrl = useMemo(() => {
    if (!selectedCourseSlug) return "/api/admin/learning-reports";
    return `/api/admin/learning-reports?course_slug=${encodeURIComponent(selectedCourseSlug)}`;
  }, [selectedCourseSlug]);

  const { data, loading, error, reload } = useAdminFetch<ReportData>(fetchUrl, {
    onUnauthorized: () => router.push("/admin"),
  });

  // Extract unique colleges from students for filter dropdown
  const uniqueColleges = useMemo(() => {
    if (!data?.students) return [];
    const set = new Set<string>();
    data.students.forEach((s) => {
      if (s.organization) set.add(s.organization);
    });
    return Array.from(set).sort();
  }, [data?.students]);

  // Filter students based on search term, college, and completion status
  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    return data.students.filter((student) => {
      // 1. Search term match
      const searchMatch =
        searchTerm.trim() === "" ||
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.organization.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // 2. College match
      if (selectedCollege !== "all" && student.organization !== selectedCollege) {
        return false;
      }

      // 3. Status filter
      if (statusFilter === "completed" && student.courseCompletionPct < 100) return false;
      if (statusFilter === "in_progress" && (student.courseCompletionPct === 0 || student.courseCompletionPct >= 100)) return false;
      if (statusFilter === "not_started" && student.courseCompletionPct > 0) return false;

      return true;
    });
  }, [data?.students, searchTerm, selectedCollege, statusFilter]);

  // Export Matrix Table to CSV
  const handleExportCSV = () => {
    if (!data || !filteredStudents.length) return;

    const allLessons = (data.modules || []).flatMap((m) => m.lessons);

    // CSV Header row
    const headers = [
      "Student ID",
      "Student Name",
      "Email",
      "College / Organization",
      "Overall Course Completion %",
      "Avg Module Completion %",
      "Assessment Score",
      "Assessment Status",
      ...allLessons.map((l) => `Topic: ${l.title.replace(/"/g, '""')} (Status)`),
    ];

    // CSV Data rows
    const rows = filteredStudents.map((s) => {
      const topicCols = allLessons.map((l) => {
        const tStatus = s.topicStatuses[l.id];
        return tStatus?.completed ? "Yes" : "";
      });

      return [
        `"${s.studentId}"`,
        `"${s.studentName.replace(/"/g, '""')}"`,
        `"${s.email}"`,
        `"${s.organization.replace(/"/g, '""')}"`,
        `"${s.courseCompletionPct}%"`,
        `"${s.avgModuleCompletionPct}%"`,
        s.assessmentScore !== null ? `"${s.assessmentScore}%"` : `""`,
        s.assessmentPassed !== null ? (s.assessmentPassed ? `"Passed"` : `"Failed"`) : `""`,
        ...topicCols.map((col) => `"${col}"`),
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KVJ_Learning_Report_${data.activeCourse?.slug || "Matrix"}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPowerBiSql = () => {
    const sqlText = `SELECT * FROM public.v_powerbi_student_topic_matrix WHERE course_slug = '${data?.activeCourse?.slug || "data-analytics"}';`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1700px] p-4 md:p-6 lg:p-8 space-y-6">
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Learning Intelligence & Matrix
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Student Learning & Topic Reports
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Real-time curriculum progress matrix, granular topic-by-topic completion status, module averages, and live assessment scores for active cohorts.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowPowerBiModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-semibold text-xs transition-all flex items-center gap-2 shadow-sm shadow-amber-500/10"
          >
            <Database className="h-4 w-4 text-amber-400" />
            Power BI Live Connection
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!filteredStudents.length}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export Matrix (CSV)
          </button>

          <button
            onClick={reload}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            title="Refresh Report"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── KPI Highlight Cards (Vibrant Gradients) ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-white to-indigo-50/40 border border-indigo-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Enrolled Students</span>
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{loading ? "—" : data?.kpis.totalStudents ?? 0}</div>
            <p className="text-xs text-slate-500 mt-1">Active learners in {data?.activeCourse?.title || "course"}</p>
          </div>
        </div>

        {/* Avg Course Completion */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-emerald-50/40 border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Avg Course Completion</span>
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-emerald-600">{loading ? "—" : `${data?.kpis.avgCompletionPct ?? 0}%`}</div>
            <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, data?.kpis.avgCompletionPct || 0)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Assessment Pass Rate */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-amber-50/40 border border-amber-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Assessment Pass Rate</span>
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{loading ? "—" : `${data?.kpis.passRatePct ?? 0}%`}</div>
            <p className="text-xs text-slate-500 mt-1">Scored $\ge$ pass benchmark score</p>
          </div>
        </div>

        {/* Completed Students */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-white to-purple-50/40 border border-purple-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">100% Completed</span>
            <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{loading ? "—" : data?.kpis.completedCount ?? 0}</div>
            <p className="text-xs text-slate-500 mt-1">Completed all modules & activities</p>
          </div>
        </div>
      </div>

      {/* ── Filter Controls Bar ───────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Course Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <BookOpen className="h-4 w-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-700">Course:</span>
            <select
              value={data?.activeCourse?.slug || selectedCourseSlug}
              onChange={(e) => setSelectedCourseSlug(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              {(data?.courses || []).map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* College / Organization Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Building2 className="h-4 w-4 text-slate-500" />
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Colleges / Batches</option>
              {uniqueColleges.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Learning Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Progress Statuses</option>
              <option value="completed">Completed (100%)</option>
              <option value="in_progress">In Progress (1-99%)</option>
              <option value="not_started">Not Started (0%)</option>
            </select>
          </div>
        </div>

        {/* Search by Student Name / Email */}
        <div className="relative min-w-[260px]">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* ── Main Topic Completion Matrix Table ────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              Topic-by-Topic Completion Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing <span className="font-semibold text-slate-800">{filteredStudents.length}</span> students across{" "}
              <span className="font-semibold text-slate-800">{data?.modules?.length || 0} modules</span> and{" "}
              <span className="font-semibold text-slate-800">{data?.activeCourse?.totalTopics || 0} curriculum topics</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Yes = Completed
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> — = Pending / Blank
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-4">
            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Loading student topic matrix & assessment logs...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600 text-sm font-medium">
            Failed to load reports: {error}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-sm">
            No students found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[750px] relative">
            <table className="w-full text-left border-collapse text-xs">
              {/* Table Header with sticky properties */}
              <thead className="sticky top-0 z-20 bg-slate-900 text-white uppercase text-[11px] tracking-wider shadow-md">
                <tr>
                  {/* Fixed Student Info Columns */}
                  <th className="py-3.5 px-4 font-bold border-r border-slate-800 min-w-[200px] sticky left-0 z-30 bg-slate-900 shadow-r">
                    Student Details
                  </th>
                  <th className="py-3.5 px-3 font-bold border-r border-slate-800 min-w-[130px] text-center">
                    College / Batch
                  </th>
                  <th className="py-3.5 px-3 font-bold border-r border-slate-800 min-w-[150px] text-center">
                    Course Progress %
                  </th>
                  <th className="py-3.5 px-3 font-bold border-r border-slate-800 min-w-[120px] text-center">
                    Avg Module %
                  </th>
                  <th className="py-3.5 px-3 font-bold border-r border-slate-800 min-w-[140px] text-center bg-indigo-950/60">
                    Mock Test Score
                  </th>

                  {/* Dynamic Module and Topic Columns */}
                  {(data?.modules || []).map((mod, mIdx) => (
                    <React.Fragment key={mod.id}>
                      {/* Module Completion Summary Header */}
                      <th className="py-3.5 px-3 font-extrabold border-r border-slate-800 min-w-[110px] text-center bg-indigo-900/80 text-indigo-200">
                        {`M${mIdx + 1} %`}
                      </th>

                      {/* Individual Topic Headers inside Module */}
                      {mod.lessons.map((lesson, lIdx) => (
                        <th
                          key={lesson.id}
                          className="py-3.5 px-3 font-semibold border-r border-slate-800 min-w-[130px] text-center max-w-[180px] truncate"
                          title={`${mod.title} -> ${lesson.title}`}
                        >
                          <div className="truncate font-medium text-slate-200" title={lesson.title}>
                            {`T${mIdx + 1}.${lIdx + 1}: ${lesson.title}`}
                          </div>
                          <span className="text-[9px] uppercase tracking-normal px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                            {lesson.kind}
                          </span>
                        </th>
                      ))}
                    </React.Fragment>
                  ))}
                </tr>
              </thead>

              {/* Table Body with colorful row highlights */}
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudents.map((student, sIdx) => {
                  const is100Pct = student.courseCompletionPct >= 100;
                  const rowBg = sIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50";

                  return (
                    <tr key={student.studentId} className={`${rowBg} hover:bg-indigo-50/40 transition-colors`}>
                      {/* Student Name & Email (Sticky Left Column) */}
                      <td className={`py-3 px-4 border-r border-slate-100 sticky left-0 z-10 ${rowBg} shadow-r`}>
                        <div className="font-bold text-slate-900">{student.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-normal truncate max-w-[180px]">{student.email}</div>
                      </td>

                      {/* College / Batch Badge */}
                      <td className="py-3 px-3 border-r border-slate-100 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium max-w-[120px] truncate" title={student.organization}>
                          {student.organization}
                        </span>
                      </td>

                      {/* Course Completion Progress Bar */}
                      <td className="py-3 px-3 border-r border-slate-100 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                is100Pct
                                  ? "bg-emerald-500"
                                  : student.courseCompletionPct > 50
                                  ? "bg-indigo-600"
                                  : student.courseCompletionPct > 0
                                  ? "bg-amber-500"
                                  : "bg-slate-300"
                              }`}
                              style={{ width: `${student.courseCompletionPct}%` }}
                            />
                          </div>
                          <span
                            className={`font-bold text-xs ${
                              is100Pct ? "text-emerald-700" : student.courseCompletionPct > 50 ? "text-indigo-700" : "text-slate-800"
                            }`}
                          >
                            {student.courseCompletionPct}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {student.completedTopicsCount} / {student.totalTopicsCount} topics
                        </div>
                      </td>

                      {/* Average Module % */}
                      <td className="py-3 px-3 border-r border-slate-100 text-center font-bold text-slate-800">
                        {student.avgModuleCompletionPct}%
                      </td>

                      {/* Mock Test Score Pill */}
                      <td className="py-3 px-3 border-r border-slate-100 text-center bg-indigo-50/30">
                        {student.assessmentScore !== null ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              student.assessmentPassed
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-rose-100 text-rose-800 border border-rose-300"
                            }`}
                          >
                            {student.assessmentScore}% {student.assessmentPassed ? "✓ Pass" : "✗ Fail"}
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </td>

                      {/* Dynamic Modules & Topics for this Student */}
                      {(data?.modules || []).map((mod) => {
                        const mProgress = student.moduleProgress[mod.id];
                        const mPct = mProgress?.pct ?? 0;

                        return (
                          <React.Fragment key={mod.id}>
                            {/* Module Summary Column */}
                            <td className="py-3 px-3 border-r border-slate-100 text-center bg-indigo-50/20 font-bold">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                                  mPct === 100
                                    ? "bg-emerald-100 text-emerald-800 font-bold"
                                    : mPct > 0
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "text-slate-400"
                                }`}
                              >
                                {mPct}%
                              </span>
                            </td>

                            {/* Individual Topic Cells (Yes / Blank) */}
                            {mod.lessons.map((lesson) => {
                              const tStatus = student.topicStatuses[lesson.id];
                              const isCompleted = tStatus?.completed;

                              return (
                                <td
                                  key={lesson.id}
                                  className={`py-3 px-3 border-r border-slate-100 text-center ${
                                    isCompleted ? "bg-emerald-50/40" : ""
                                  }`}
                                >
                                  {isCompleted ? (
                                    <div className="inline-flex flex-col items-center">
                                      <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-black text-xs shadow-sm shadow-emerald-600/20 inline-flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Yes
                                      </span>
                                      {tStatus?.score !== null && (
                                        <span className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                                          {tStatus.score}/{tStatus.maxScore} pts
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-300 font-light text-base select-none">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Power BI Live Connection Modal ────────────────────────────── */}
      {showPowerBiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 md:p-8 space-y-5 relative">
            <button
              onClick={() => setShowPowerBiModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Power BI Live DirectQuery Connection</h3>
                <p className="text-xs text-slate-500">Connect Power BI Desktop live to your Supabase PostgreSQL database view.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                1. Open <strong>Power BI Desktop</strong> $\to$ <strong>Get Data</strong> $\to$ <strong>PostgreSQL Database</strong>.
              </p>
              <p className="font-semibold text-slate-800">
                2. Enter your Supabase Direct Connection Host & Database Name:
              </p>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-xs space-y-1">
                <div><strong>Server:</strong> db.your-project.supabase.co:5432</div>
                <div><strong>Database:</strong> postgres</div>
                <div><strong>Data Connectivity Mode:</strong> DirectQuery (Live) or Import</div>
              </div>

              <p className="font-semibold text-slate-800 pt-1">
                3. Direct View SQL Query for Topic Completion Matrix:
              </p>
              <div className="relative">
                <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                  {`SELECT * FROM public.v_powerbi_student_topic_matrix;`}
                </pre>
                <button
                  onClick={copyPowerBiSql}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition-all"
                >
                  {copiedSql ? "Copied!" : "Copy SQL"}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] space-y-1">
                <strong>Available Views in Database:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li><code>public.v_powerbi_student_topic_matrix</code> (Granular Topic 'Yes'/Blank Matrix)</li>
                  <li><code>public.v_powerbi_student_course_progress</code> (Aggregated Module % & Course %)</li>
                  <li><code>public.v_powerbi_assessment_scores</code> (Mock Test Attempts & Scores)</li>
                  <li><code>public.v_powerbi_students</code> (Student & College Dimensions)</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPowerBiModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
