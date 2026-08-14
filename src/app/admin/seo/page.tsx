"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  RefreshCw,
  Sliders,
  FileText,
  Code,
  ShieldCheck,
  Zap,
  BookOpen,
  Newspaper,
  Check,
  X,
  Eye,
  Info,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Filter,
} from "lucide-react";

export interface GlobalSeoSettings {
  site_title_default?: string;
  title_template?: string;
  meta_description_default?: string;
  default_og_image_url?: string;
  twitter_handle?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  google_site_verification?: string;
  bing_site_verification?: string;
  custom_robots_txt?: string;
}

export interface PageSeoItem {
  id?: string;
  route_path: string;
  seo_title?: string;
  meta_description?: string;
  keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  no_index?: boolean;
  no_follow?: boolean;
  structured_data_type?: string;
  custom_schema_json?: any;
}

export interface SeoRedirectItem {
  id?: string;
  source_path: string;
  target_path: string;
  redirect_type: 301 | 302;
  is_active: boolean;
}

export interface AuditReport {
  overallHealthScore: number;
  globalStatus: "healthy" | "warning" | "attention";
  pagesScannedCount: number;
  totalIssuesCount: number;
  totalWarningsCount: number;
  missingTitleCount: number;
  missingDescCount: number;
  missingOgCount: number;
  noIndexCount: number;
  redirectsCount: number;
  activeRedirectsCount: number;
  sitemapStatus: string;
  robotsStatus: string;
  routes: any[];
  auditedAt: string;
}

export default function DigitalMarketingSeoPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "global" | "pages" | "courses_blogs" | "redirects" | "integrations">("overview");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Data States
  const [globalSettings, setGlobalSettings] = useState<GlobalSeoSettings>({
    site_title_default: "KVJ Analytics | Power BI, Excel & Report Automation Training & Consulting",
    title_template: "%s | KVJ Analytics",
    meta_description_default: "KVJ Analytics delivers Power BI dashboards, Excel & report automation, and data analytics consulting.",
    default_og_image_url: "/og-image.png",
    twitter_handle: "@kvjanalytics",
    google_analytics_id: "",
    google_tag_manager_id: "",
    google_site_verification: "",
    bing_site_verification: "",
    custom_robots_txt: "",
  });

  const [pageSeoList, setPageSeoList] = useState<PageSeoItem[]>([]);
  const [redirectsList, setRedirectsList] = useState<SeoRedirectItem[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [blogList, setBlogList] = useState<any[]>([]);
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);

  // Search / Filters
  const [pageSearchQuery, setPageSearchQuery] = useState("");
  const [redirectSearchQuery, setRedirectSearchQuery] = useState("");

  // Page SEO Edit Modal State
  const [selectedPageSeo, setSelectedPageSeo] = useState<PageSeoItem | null>(null);
  const [showPageEditModal, setShowPageEditModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"google" | "social">("google");

  // Add Redirect Modal State
  const [showAddRedirectModal, setShowAddRedirectModal] = useState(false);
  const [newRedirectSource, setNewRedirectSource] = useState("");
  const [newRedirectTarget, setNewRedirectTarget] = useState("");
  const [newRedirectType, setNewRedirectType] = useState<301 | 302>(301);

  useEffect(() => {
    fetchSeoData();
    fetchAuditReport();
  }, []);

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const [seoRes, redRes] = await Promise.all([
        fetch("/api/admin/seo"),
        fetch("/api/admin/seo/redirects"),
      ]);

      if (seoRes.ok) {
        const data = await seoRes.json();
        if (data.siteSettings) setGlobalSettings(data.siteSettings);
        if (data.pageSeo) setPageSeoList(data.pageSeo);
        if (data.courses) setCoursesList(data.courses);
        if (data.blogPosts) setBlogList(data.blogPosts);
      }

      if (redRes.ok) {
        const data = await redRes.json();
        if (data.redirects) setRedirectsList(data.redirects);
      }
    } catch (err: any) {
      console.error("Failed to fetch SEO data:", err);
      setErrorMsg("Failed to load SEO configuration.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditReport = async () => {
    setRunningAudit(true);
    try {
      const res = await fetch("/api/admin/seo/audit");
      if (res.ok) {
        const data = await res.json();
        setAuditReport(data);
      }
    } catch (err) {
      console.error("Failed to run SEO audit:", err);
    } finally {
      setRunningAudit(false);
    }
  };

  // Save Global Settings
  const handleSaveGlobalSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "global", settings: globalSettings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setSuccessMsg("Global SEO & Analytics settings saved successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchAuditReport();
    } catch (err: any) {
      setErrorMsg(err.message || "Error saving global settings");
    } finally {
      setSaving(false);
    }
  };

  // Save Page SEO Record
  const handleSavePageSeo = async (pageRecord: PageSeoItem) => {
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "page", page: pageRecord }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save page SEO");

      setShowPageEditModal(false);
      setSelectedPageSeo(null);
      setSuccessMsg(`SEO configuration saved for ${pageRecord.route_path}!`);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchSeoData();
      fetchAuditReport();
    } catch (err: any) {
      setErrorMsg(err.message || "Error saving page SEO");
    } finally {
      setSaving(false);
    }
  };

  // Add New Redirect
  const handleAddRedirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRedirectSource.trim() || !newRedirectTarget.trim()) {
      alert("Source path and target path are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_path: newRedirectSource,
          target_path: newRedirectTarget,
          redirect_type: newRedirectType,
          is_active: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add redirect rule");

      setShowAddRedirectModal(false);
      setNewRedirectSource("");
      setNewRedirectTarget("");
      setSuccessMsg("Redirect rule created successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchSeoData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Toggle Redirect Active State
  const handleToggleRedirectActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/seo/redirects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentStatus }),
      });
      if (res.ok) {
        setRedirectsList((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_active: !currentStatus } : r))
        );
      }
    } catch (err) {
      console.error("Failed to toggle redirect:", err);
    }
  };

  // Delete Redirect
  const handleDeleteRedirect = async (id: string) => {
    if (!confirm("Are you sure you want to delete this redirect rule?")) return;
    try {
      const res = await fetch(`/api/admin/seo/redirects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRedirectsList((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete redirect:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand mx-auto" />
          <p className="text-xs font-semibold text-slate">Loading Digital Marketing & SEO Platform...</p>
        </div>
      </div>
    );
  }

  // Filtered Page SEO list
  const filteredPages = [
    { route_path: "/", name: "Home Page" },
    { route_path: "/about", name: "About Us" },
    { route_path: "/corporate", name: "Corporate Services" },
    { route_path: "/education", name: "Education & Colleges" },
    { route_path: "/products", name: "Products & Solutions" },
    { route_path: "/training", name: "Training Programs" },
    { route_path: "/contact", name: "Contact Us" },
    { route_path: "/careers", name: "Careers" },
    { route_path: "/blog", name: "Blog List" },
    { route_path: "/impact", name: "Impact" },
  ].filter((p) =>
    p.route_path.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(pageSearchQuery.toLowerCase())
  );

  // Filtered Redirects list
  const filteredRedirects = redirectsList.filter(
    (r) =>
      r.source_path.toLowerCase().includes(redirectSearchQuery.toLowerCase()) ||
      r.target_path.toLowerCase().includes(redirectSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Search className="w-6 h-6 text-brand" />
              <h1 className="text-xl font-bold font-display text-ink">Digital Marketing & SEO</h1>
            </div>
            <p className="text-xs text-slate mt-1">
              Manage website search engine optimization, page metadata, 301/302 redirects, GTM, and GA4 analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAuditReport}
              disabled={runningAudit}
              className="py-2.5 px-4 bg-white border border-line text-ink hover:bg-slate-50 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningAudit ? "animate-spin text-brand" : "text-slate"}`} />
              {runningAudit ? "Auditing Site..." : "Refresh Audit"}
            </button>

            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Globe className="w-4 h-4" /> View Sitemap
            </a>
          </div>
        </div>

        {/* Success / Error Banners */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-semibold shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-2xl flex items-center space-x-3 text-error text-xs font-semibold shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-line pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "overview" ? "bg-brand text-white shadow-sm" : "text-slate hover:bg-slate-100 hover:text-ink"
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> SEO Overview
          </button>

          <button
            onClick={() => setActiveTab("global")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "global" ? "bg-brand text-white shadow-sm" : "text-slate hover:bg-slate-100 hover:text-ink"
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Global SEO
          </button>

          <button
            onClick={() => setActiveTab("pages")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "pages" ? "bg-brand text-white shadow-sm" : "text-slate hover:bg-slate-100 hover:text-ink"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Page SEO Manager
          </button>

          <button
            onClick={() => setActiveTab("courses_blogs")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "courses_blogs" ? "bg-brand text-white shadow-sm" : "text-slate hover:bg-slate-100 hover:text-ink"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Course & Blog SEO
          </button>

          <button
            onClick={() => setActiveTab("redirects")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "redirects" ? "bg-brand text-white shadow-sm" : "text-slate hover:bg-slate-100 hover:text-ink"
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" /> Redirects & Technical
          </button>

          <button
            onClick={() => setActiveTab("integrations")}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "integrations" ? "bg-brand text-white shadow-sm" : "text-slate hover:bg-slate-100 hover:text-ink"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Analytics & Integrations
          </button>
        </div>

        {/* TAB 1: SEO OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">

            {/* Health Score Summary Card */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-line pb-4">
                <div>
                  <h3 className="text-base font-bold text-ink flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand" />
                    Website SEO Health Score
                  </h3>
                  <p className="text-xs text-slate mt-0.5">
                    Automated technical analysis evaluating meta titles, descriptions, canonical tags, OpenGraph imagery, and indexability across your key pages.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-2xl border text-center font-bold font-mono text-xl ${
                    (auditReport?.overallHealthScore || 0) >= 85
                      ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                      : (auditReport?.overallHealthScore || 0) >= 70
                      ? "bg-amber-100 border-amber-300 text-amber-800"
                      : "bg-red-100 border-red-300 text-red-800"
                  }`}>
                    {auditReport?.overallHealthScore || 100} / 100
                  </div>
                </div>
              </div>

              {/* Real Audit KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                <div className="bg-surface p-3 rounded-2xl border border-line text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Pages Scanned</p>
                  <p className="text-xl font-black text-ink mt-0.5">{auditReport?.pagesScannedCount || 10}</p>
                </div>

                <div className="bg-surface p-3 rounded-2xl border border-line text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Issues Found</p>
                  <p className="text-xl font-black text-red-600 mt-0.5">{auditReport?.totalIssuesCount || 0}</p>
                </div>

                <div className="bg-surface p-3 rounded-2xl border border-line text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Warnings</p>
                  <p className="text-xl font-black text-amber-600 mt-0.5">{auditReport?.totalWarningsCount || 0}</p>
                </div>

                <div className="bg-surface p-3 rounded-2xl border border-line text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Missing Titles</p>
                  <p className="text-xl font-black text-slate-800 mt-0.5">{auditReport?.missingTitleCount || 0}</p>
                </div>

                <div className="bg-surface p-3 rounded-2xl border border-line text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Missing Description</p>
                  <p className="text-xl font-black text-slate-800 mt-0.5">{auditReport?.missingDescCount || 0}</p>
                </div>

                <div className="bg-surface p-3 rounded-2xl border border-line text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Active Redirects</p>
                  <p className="text-xl font-black text-brand mt-0.5">{auditReport?.activeRedirectsCount || redirectsList.length}</p>
                </div>

                <div className="bg-surface p-3 rounded-2xl border border-line text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate">Sitemap Status</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Route Results Table */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h3 className="text-sm font-bold text-ink">Page Health Audit Report</h3>
                  <p className="text-[10px] text-slate mt-0.5">Route-level technical evaluation breakdown.</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-line rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface border-b border-line text-slate uppercase text-[10px] font-bold tracking-wider">
                      <th className="p-3">Page Name</th>
                      <th className="p-3">Route Path</th>
                      <th className="p-3">Health Score</th>
                      <th className="p-3">Indexing</th>
                      <th className="p-3">Audit Finding</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(auditReport?.routes || []).map((r: any, idx: number) => {
                      const pageOverride = pageSeoList.find((p) => p.route_path === r.route_path);
                      return (
                        <tr key={idx} className="border-b border-line/60 hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-ink">{r.name}</td>
                          <td className="p-3 font-mono text-[11px] text-brand">{r.route_path}</td>
                          <td className="p-3 font-bold font-mono">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                              r.score >= 90
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : r.score >= 70
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                            }`}>
                              {r.score} / 100
                            </span>
                          </td>
                          <td className="p-3">
                            {r.noIndex ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                NoIndex
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Indexable
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate">
                            {r.issues.length > 0 ? (
                              <span className="text-red-600 font-semibold">{r.issues[0]}</span>
                            ) : r.warnings.length > 0 ? (
                              <span className="text-amber-600 font-medium">{r.warnings[0]}</span>
                            ) : (
                              <span className="text-emerald-600 font-medium">✓ All checks passed</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedPageSeo({
                                  route_path: r.route_path,
                                  seo_title: pageOverride?.seo_title || r.title,
                                  meta_description: pageOverride?.meta_description || r.description,
                                  keywords: pageOverride?.keywords || "",
                                  canonical_url: pageOverride?.canonical_url || r.canonical,
                                  og_title: pageOverride?.og_title || "",
                                  og_description: pageOverride?.og_description || "",
                                  og_image_url: pageOverride?.og_image_url || r.ogImage,
                                  no_index: pageOverride?.no_index || false,
                                  no_follow: pageOverride?.no_follow || false,
                                  structured_data_type: pageOverride?.structured_data_type || r.structuredData,
                                });
                                setShowPageEditModal(true);
                              }}
                              className="py-1 px-3 bg-brand/10 text-brand hover:bg-brand hover:text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Configure SEO
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GLOBAL SEO SETTINGS */}
        {activeTab === "global" && (
          <form onSubmit={handleSaveGlobalSettings} className="space-y-6">
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-ink">Global Website SEO Defaults</h3>
                <p className="text-xs text-slate mt-0.5">
                  Configure default meta tags used across pages that do not have custom overrides.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Default Site Title</label>
                  <input
                    type="text"
                    value={globalSettings.site_title_default || ""}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, site_title_default: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface text-ink font-medium focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                  <p className="text-[10px] text-slate mt-1">Used when a page doesn't define its own title.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Title Template</label>
                  <input
                    type="text"
                    value={globalSettings.title_template || ""}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, title_template: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface text-ink font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                  <p className="text-[10px] text-slate mt-1">Next.js title template string. Use <code className="bg-slate-200 px-1 py-0.5 rounded">%s</code> for page title placeholder.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Default Meta Description</label>
                  <textarea
                    rows={3}
                    value={globalSettings.meta_description_default || ""}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, meta_description_default: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface text-ink font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 resize-y"
                  />
                  <p className="text-[10px] text-slate mt-1">Recommended length: 120 - 160 characters.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Default OpenGraph Social Image URL</label>
                    <input
                      type="text"
                      value={globalSettings.default_og_image_url || ""}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, default_og_image_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface text-ink font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                    <p className="text-[10px] text-slate mt-1">Standard size: 1200 x 630 px (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded">/og-image.png</code>).</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Twitter / X Handle</label>
                    <input
                      type="text"
                      value={globalSettings.twitter_handle || ""}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, twitter_handle: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface text-ink font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 px-6 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving Defaults..." : "Save Global SEO Settings"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: PAGE SEO MANAGER */}
        {activeTab === "pages" && (
          <div className="space-y-6">
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
                <div>
                  <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand" />
                    Route-Level SEO Overrides ({filteredPages.length})
                  </h3>
                  <p className="text-[10px] text-slate mt-0.5">
                    Customize titles, descriptions, canonical URLs, and social images for individual pages.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search page or route..."
                    value={pageSearchQuery}
                    onChange={(e) => setPageSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-line rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface border-b border-line text-slate uppercase text-[10px] font-bold tracking-wider">
                      <th className="p-3">Page Name</th>
                      <th className="p-3">Route Path</th>
                      <th className="p-3">SEO Title</th>
                      <th className="p-3">Index Status</th>
                      <th className="p-3">Structured Data</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPages.map((p, idx) => {
                      const override = pageSeoList.find((item) => item.route_path === p.route_path);
                      return (
                        <tr key={idx} className="border-b border-line/60 hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-ink">{p.name}</td>
                          <td className="p-3 font-mono text-[11px] text-brand">{p.route_path}</td>
                          <td className="p-3 text-slate">
                            {override?.seo_title ? (
                              <span className="font-semibold text-slate-800">{override.seo_title}</span>
                            ) : (
                              <span className="text-slate-400 italic">Global Default</span>
                            )}
                          </td>
                          <td className="p-3">
                            {override?.no_index ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                NoIndex
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Indexable
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-700">
                            {override?.structured_data_type || (p.route_path === "/" ? "ProfessionalService" : "WebPage")}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedPageSeo({
                                  route_path: p.route_path,
                                  seo_title: override?.seo_title || "",
                                  meta_description: override?.meta_description || "",
                                  keywords: override?.keywords || "",
                                  canonical_url: override?.canonical_url || "",
                                  og_title: override?.og_title || "",
                                  og_description: override?.og_description || "",
                                  og_image_url: override?.og_image_url || "",
                                  no_index: override?.no_index || false,
                                  no_follow: override?.no_follow || false,
                                  structured_data_type: override?.structured_data_type || "WebPage",
                                });
                                setShowPageEditModal(true);
                              }}
                              className="py-1.5 px-3 bg-brand/10 text-brand hover:bg-brand hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Edit SEO
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COURSE & BLOG SEO */}
        {activeTab === "courses_blogs" && (
          <div className="space-y-6">

            {/* Courses SEO */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand" />
                  Course Page SEO Configurations ({coursesList.length})
                </h3>
                <p className="text-[10px] text-slate mt-0.5">
                  Configure search engine title, description, and Course JSON-LD schema for active courses.
                </p>
              </div>

              <div className="overflow-x-auto border border-line rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface border-b border-line text-slate uppercase text-[10px] font-bold tracking-wider">
                      <th className="p-3">Course Title</th>
                      <th className="p-3">Course Route Path</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coursesList.map((c, idx) => {
                      const coursePath = `/training/${c.slug}`;
                      const override = pageSeoList.find((p) => p.route_path === coursePath);
                      return (
                        <tr key={idx} className="border-b border-line/60 hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-ink">{c.title}</td>
                          <td className="p-3 font-mono text-[11px] text-brand">{coursePath}</td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Published
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedPageSeo({
                                  route_path: coursePath,
                                  seo_title: override?.seo_title || `${c.title} Training & Certification | KVJ Analytics`,
                                  meta_description: override?.meta_description || `Master ${c.title} with hands-on projects and expert training at KVJ Analytics.`,
                                  keywords: override?.keywords || `${c.title}, training, certification`,
                                  canonical_url: override?.canonical_url || `https://www.kvjanalytics.in${coursePath}`,
                                  og_title: override?.og_title || "",
                                  og_description: override?.og_description || "",
                                  og_image_url: override?.og_image_url || "",
                                  no_index: override?.no_index || false,
                                  no_follow: override?.no_follow || false,
                                  structured_data_type: "Course",
                                });
                                setShowPageEditModal(true);
                              }}
                              className="py-1.5 px-3 bg-brand/10 text-brand hover:bg-brand hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Edit Course SEO
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Blog Posts SEO */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-brand" />
                  Blog Article SEO Configurations ({blogList.length})
                </h3>
                <p className="text-[10px] text-slate mt-0.5">
                  Configure BlogPosting JSON-LD and article search metadata.
                </p>
              </div>

              <div className="overflow-x-auto border border-line rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface border-b border-line text-slate uppercase text-[10px] font-bold tracking-wider">
                      <th className="p-3">Article Title</th>
                      <th className="p-3">Blog Route Path</th>
                      <th className="p-3">Schema Type</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogList.map((b, idx) => {
                      const blogPath = `/blog/${b.slug}`;
                      const override = pageSeoList.find((p) => p.route_path === blogPath);
                      return (
                        <tr key={idx} className="border-b border-line/60 hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-semibold text-ink">{b.title}</td>
                          <td className="p-3 font-mono text-[11px] text-brand">{blogPath}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-700">BlogPosting</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedPageSeo({
                                  route_path: blogPath,
                                  seo_title: override?.seo_title || `${b.title} | KVJ Analytics Blog`,
                                  meta_description: override?.meta_description || b.title,
                                  keywords: override?.keywords || "",
                                  canonical_url: override?.canonical_url || `https://www.kvjanalytics.in${blogPath}`,
                                  og_title: override?.og_title || "",
                                  og_description: override?.og_description || "",
                                  og_image_url: override?.og_image_url || "",
                                  no_index: override?.no_index || false,
                                  no_follow: override?.no_follow || false,
                                  structured_data_type: "BlogPosting",
                                });
                                setShowPageEditModal(true);
                              }}
                              className="py-1.5 px-3 bg-brand/10 text-brand hover:bg-brand hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Edit Article SEO
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: REDIRECTS & TECHNICAL SEO */}
        {activeTab === "redirects" && (
          <div className="space-y-6">

            {/* Redirects Manager */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-4">
                <div>
                  <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-brand" />
                    301 / 302 URL Redirect Manager ({redirectsList.length})
                  </h3>
                  <p className="text-[10px] text-slate mt-0.5">
                    Redirect old URLs to new destinations. Executed in middleware with zero database lag.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search redirect path..."
                      value={redirectSearchQuery}
                      onChange={(e) => setRedirectSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddRedirectModal(true)}
                    className="py-2 px-3.5 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add Redirect
                  </button>
                </div>
              </div>

              {filteredRedirects.length > 0 ? (
                <div className="overflow-x-auto border border-line rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface border-b border-line text-slate uppercase text-[10px] font-bold tracking-wider">
                        <th className="p-3">Source Path</th>
                        <th className="p-3">Target Destination</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRedirects.map((r, idx) => (
                        <tr key={idx} className="border-b border-line/60 hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono text-[11px] font-bold text-ink">{r.source_path}</td>
                          <td className="p-3 font-mono text-[11px] text-brand">{r.target_path}</td>
                          <td className="p-3 font-mono text-[10px] font-bold">
                            <span className={`px-2 py-0.5 rounded-full ${r.redirect_type === 301 ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                              {r.redirect_type} {r.redirect_type === 301 ? "Permanent" : "Temporary"}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => r.id && handleToggleRedirectActive(r.id, r.is_active)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                r.is_active ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-200 text-slate-600"
                              }`}
                            >
                              {r.is_active ? "Active" : "Disabled"}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => r.id && handleDeleteRedirect(r.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-all"
                              title="Delete Redirect Rule"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-surface rounded-2xl border border-line">
                  <ArrowUpRight className="w-8 h-8 text-slate mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate">No 301/302 redirect rules found.</p>
                </div>
              )}
            </div>

            {/* Custom Robots.txt Preview */}
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-4">
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  <Code className="w-4 h-4 text-brand" />
                  Custom Robots.txt Directives
                </h3>
                <p className="text-[10px] text-slate mt-0.5">
                  Private routes <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/admin</code>, <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/api/</code>, and <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/account</code> are automatically locked.
                </p>
              </div>

              <textarea
                rows={5}
                value={globalSettings.custom_robots_txt || ""}
                onChange={(e) => setGlobalSettings({ ...globalSettings, custom_robots_txt: e.target.value })}
                placeholder="Disallow: /private-demo&#10;Disallow: /temp-page"
                className="w-full px-4 py-3 border border-line rounded-2xl text-xs font-mono bg-slate-950 text-green-300 focus:outline-none focus:ring-2 focus:ring-brand/20 resize-y"
              />

              <button
                type="button"
                onClick={() => handleSaveGlobalSettings()}
                disabled={saving}
                className="py-2 px-4 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Custom Robots.txt
              </button>
            </div>

          </div>
        )}

        {/* TAB 6: ANALYTICS & INTEGRATIONS */}
        {activeTab === "integrations" && (
          <form onSubmit={handleSaveGlobalSettings} className="space-y-6">
            <div className="bg-card border border-line rounded-3xl p-6 shadow-soft space-y-6 max-w-4xl">
              <div>
                <h3 className="text-base font-bold text-ink">Analytics & Search Console Integrations</h3>
                <p className="text-xs text-slate mt-0.5">
                  Configure Google Analytics 4, Google Tag Manager, and Search Console verification tags.
                </p>
              </div>

              <div className="space-y-6">

                {/* GTM */}
                <div className="bg-surface p-4 rounded-2xl border border-line space-y-2">
                  <label className="block text-xs font-bold text-ink">Google Tag Manager Container ID</label>
                  <input
                    type="text"
                    placeholder="GTM-XXXXXXX"
                    value={globalSettings.google_tag_manager_id || ""}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, google_tag_manager_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                  <p className="text-[10px] text-slate">
                    Recommended: If GTM is configured, direct GA4 script loading is automatically paused to prevent duplicate pageviews.
                  </p>
                </div>

                {/* GA4 */}
                <div className="bg-surface p-4 rounded-2xl border border-line space-y-2">
                  <label className="block text-xs font-bold text-ink">Google Analytics 4 Measurement ID</label>
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    value={globalSettings.google_analytics_id || ""}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, google_analytics_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                {/* GSC */}
                <div className="bg-surface p-4 rounded-2xl border border-line space-y-2">
                  <label className="block text-xs font-bold text-ink">Google Search Console Verification Tag</label>
                  <input
                    type="text"
                    placeholder="google-site-verification key code"
                    value={globalSettings.google_site_verification || ""}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, google_site_verification: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                {/* Bing */}
                <div className="bg-surface p-4 rounded-2xl border border-line space-y-2">
                  <label className="block text-xs font-bold text-ink">Bing Webmaster Verification Code</label>
                  <input
                    type="text"
                    placeholder="msvalidate.01 key code"
                    value={globalSettings.bing_site_verification || ""}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, bing_site_verification: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 px-6 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving Integrations..." : "Save Analytics & Integrations"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* MODAL: EDIT PAGE SEO OVERRIDE & LIVE PREVIEW */}
        {showPageEditModal && selectedPageSeo && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-card border border-line rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-6 my-8">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h3 className="text-base font-bold text-ink">Configure SEO — {selectedPageSeo.route_path}</h3>
                  <p className="text-xs text-slate mt-0.5">Customize metadata and preview search engine & social appearance.</p>
                </div>
                <button
                  onClick={() => setShowPageEditModal(false)}
                  className="p-1.5 text-slate hover:text-ink rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SERP / Social Live Preview Controls */}
              <div className="bg-surface p-4 rounded-2xl border border-line space-y-3">
                <div className="flex items-center justify-between border-b border-line/60 pb-2">
                  <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-brand" /> Live Appearance Preview
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("google")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                        previewDevice === "google" ? "bg-brand text-white shadow-xs" : "bg-white text-slate border border-line"
                      }`}
                    >
                      Google Search SERP
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("social")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                        previewDevice === "social" ? "bg-brand text-white shadow-xs" : "bg-white text-slate border border-line"
                      }`}
                    >
                      Social Share Card
                    </button>
                  </div>
                </div>

                {previewDevice === "google" ? (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <span>https://www.kvjanalytics.in</span>
                      <span>{selectedPageSeo.route_path}</span>
                    </div>
                    <h4 className="text-base font-semibold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                      {selectedPageSeo.seo_title || globalSettings.site_title_default}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {selectedPageSeo.meta_description || globalSettings.meta_description_default}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs max-w-md mx-auto">
                    <div className="h-40 bg-slate-100 relative flex items-center justify-center border-b border-slate-200">
                      {selectedPageSeo.og_image_url ? (
                        <img
                          src={selectedPageSeo.og_image_url}
                          alt="Social preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <Globe className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                          <span className="text-[10px] font-mono text-slate-500">Default OG: /og-image.png</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400">KVJANALYTICS.IN</p>
                      <h4 className="text-xs font-bold text-ink line-clamp-1">
                        {selectedPageSeo.og_title || selectedPageSeo.seo_title || globalSettings.site_title_default}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {selectedPageSeo.og_description || selectedPageSeo.meta_description || globalSettings.meta_description_default}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">SEO Title</label>
                    <input
                      type="text"
                      value={selectedPageSeo.seo_title || ""}
                      onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, seo_title: e.target.value })}
                      className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={selectedPageSeo.meta_description || ""}
                      onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, meta_description: e.target.value })}
                      className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">SEO Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Power BI, Excel, Analytics"
                      value={selectedPageSeo.keywords || ""}
                      onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, keywords: e.target.value })}
                      className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Canonical URL</label>
                    <input
                      type="text"
                      placeholder={`https://www.kvjanalytics.in${selectedPageSeo.route_path}`}
                      value={selectedPageSeo.canonical_url || ""}
                      onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, canonical_url: e.target.value })}
                      className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">OpenGraph Title Override</label>
                    <input
                      type="text"
                      value={selectedPageSeo.og_title || ""}
                      onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, og_title: e.target.value })}
                      className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">OpenGraph Description Override</label>
                    <textarea
                      rows={2}
                      value={selectedPageSeo.og_description || ""}
                      onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, og_description: e.target.value })}
                      className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20 resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">OpenGraph Image URL</label>
                    <input
                      type="text"
                      value={selectedPageSeo.og_image_url || ""}
                      onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, og_image_url: e.target.value })}
                      className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">Structured Data Type</label>
                      <select
                        value={selectedPageSeo.structured_data_type || "WebPage"}
                        onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, structured_data_type: e.target.value })}
                        className="w-full px-3 py-2 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                      >
                        <option value="WebPage">WebPage</option>
                        <option value="ProfessionalService">ProfessionalService</option>
                        <option value="Course">Course</option>
                        <option value="BlogPosting">BlogPosting</option>
                        <option value="Service">Service</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end space-y-2 pb-1">
                      <label className="flex items-center space-x-2 text-xs font-bold text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedPageSeo.no_index)}
                          onChange={(e) => setSelectedPageSeo({ ...selectedPageSeo, no_index: e.target.checked })}
                          className="rounded border-line text-brand focus:ring-brand/20"
                        />
                        <span>NoIndex (Hide from Search)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setShowPageEditModal(false)}
                  className="py-2 px-4 bg-white border border-line text-slate hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSavePageSeo(selectedPageSeo)}
                  className="py-2 px-5 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save Page SEO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD 301/302 REDIRECT RULE */}
        {showAddRedirectModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleAddRedirectSubmit} className="bg-card border border-line rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <h3 className="text-base font-bold text-ink">Add URL Redirect Rule</h3>
                  <p className="text-xs text-slate mt-0.5">Redirect traffic from an old path to a new destination.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddRedirectModal(false)}
                  className="p-1 text-slate hover:text-ink rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Source Path (Old URL)</label>
                  <input
                    type="text"
                    placeholder="/old-course-page"
                    value={newRedirectSource}
                    onChange={(e) => setNewRedirectSource(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Target Destination (New URL)</label>
                  <input
                    type="text"
                    placeholder="/training/power-bi"
                    value={newRedirectTarget}
                    onChange={(e) => setNewRedirectTarget(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface font-mono focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Redirect HTTP Type</label>
                  <select
                    value={newRedirectType}
                    onChange={(e) => setNewRedirectType(Number(e.target.value) as 301 | 302)}
                    className="w-full px-3.5 py-2.5 border border-line rounded-xl text-xs bg-surface focus:outline-none focus:ring-2 focus:ring-brand/20"
                  >
                    <option value={301}>301 — Permanent Redirect (SEO Link Equity Transferred)</option>
                    <option value={302}>302 — Temporary Redirect (Short-term maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRedirectModal(false)}
                  className="py-2 px-4 bg-white border border-line text-slate hover:bg-slate-50 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="py-2 px-5 bg-brand text-white hover:bg-brand/90 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Create Redirect Rule
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
