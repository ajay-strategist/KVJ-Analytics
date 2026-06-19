"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Download,
  LogOut,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Users,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Lead {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  service_interest: string;
  message: string;
  source_page: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/leads");
      if (response.status === 401) {
        router.push("/admin");
        return;
      }
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load leads");
      }
      
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leads database.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      // Update locally
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus as any } : lead
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // CSV Exporter
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      "ID",
      "Date",
      "Name",
      "Organization",
      "Email",
      "Phone",
      "Interest",
      "Message",
      "Source Page",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "Status",
    ];

    const rows = leads.map((lead) => [
      lead.id,
      new Date(lead.created_at).toLocaleDateString(),
      lead.name,
      lead.organization,
      lead.email,
      lead.phone,
      lead.service_interest,
      lead.message.replace(/\n/g, " "),
      lead.source_page,
      lead.utm_source,
      lead.utm_medium,
      lead.utm_campaign,
      lead.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KVJ_Analytics_Leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtering / Search computation
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.service_interest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Summary Metrics calculations
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;
  const closedLeads = leads.filter((l) => l.status === "closed").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand mb-4" />
        <span className="text-sm font-semibold text-slate font-display">
          Loading Leads inbox...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 font-body">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top bar header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-card border border-line shadow-soft">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <span className="text-xs font-bold text-slate uppercase tracking-wider">
                operator panel
              </span>
            </div>
            <h1 className="text-2xl font-bold font-display text-ink mt-1">
              KVJ Analytics leads inbox
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleExportCSV}
              disabled={filteredLeads.length === 0}
              variant="secondary"
              className="px-4 py-2 text-sm border-line text-slate hover:bg-surface flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="px-4 py-2 text-sm text-error hover:bg-error/5 flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation Panel */}
        <div className="flex flex-wrap gap-1 border-b border-line">
          {[
            { label: "Leads Inbox", href: "/admin/leads" },
            { label: "College Batches", href: "/admin/batches" },
            { label: "Enrollments", href: "/admin/enrollments" },
            { label: "Clients", href: "/admin/clients" },
            { label: "Testimonials", href: "/admin/testimonials" },
            { label: "Case Studies", href: "/admin/case-studies" },
            { label: "Team", href: "/admin/team" },
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                pathname === tab.href
                  ? "border-brand text-brand font-bold"
                  : "border-transparent text-slate hover:text-ink"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Submissions", val: totalLeads, color: "text-brand bg-brand/5 border-brand/20" },
            { label: "New / Unread", val: newLeads, color: "text-corporate bg-corporate/5 border-corporate/20" },
            { label: "Contacted", val: contactedLeads, color: "text-education bg-education/5 border-education/20" },
            { label: "Closed / Resolved", val: closedLeads, color: "text-success bg-success/5 border-success/20" },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-card p-6 shadow-soft flex items-center justify-between ${card.color}`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate/75 block">
                  {card.label}
                </span>
                <span className="text-3xl font-bold font-display mt-1 block">
                  {card.val}
                </span>
              </div>
              <Users className="w-8 h-8 opacity-40" />
            </div>
          ))}
        </div>

        {/* Filters / Search Bar */}
        <div className="bg-white p-6 rounded-card border border-line shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads name, company, interest, or message..."
              className="w-full pl-10 pr-4 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all"
            />
            <Search className="w-4 h-4 text-slate absolute left-3.5 top-3.5" />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <label className="text-xs font-bold text-slate uppercase tracking-wider whitespace-nowrap">
              Filter status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto px-4 py-2.5 rounded-input border border-line bg-surface/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-error/5 border border-error/20 p-4 rounded-lg flex items-start space-x-3 text-error">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Table Panel */}
        <div className="bg-white border border-line rounded-card shadow-soft overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-slate">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate" />
              <p className="text-base font-semibold">No submissions found matching filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface border-b border-line text-xs font-bold uppercase tracking-wider text-slate">
                    <th className="p-4 pl-6">Received</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Organization</th>
                    <th className="p-4">Interest Area</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filteredLeads.map((lead) => {
                    const isExpanded = expandedLeadId === lead.id;
                    const dateStr = new Date(lead.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    // Status Badge Styling
                    const statusStyles = {
                      new: "bg-corporate/10 text-corporate border-corporate/30",
                      contacted: "bg-education/10 text-education border-education/30",
                      closed: "bg-success/10 text-success border-success/30",
                    };

                    return (
                      <React.Fragment key={lead.id}>
                        <tr className="hover:bg-surface/30 transition-colors text-[14px]">
                          {/* Received Date */}
                          <td className="p-4 pl-6 text-slate whitespace-nowrap">
                            <div className="flex items-center space-x-1.5 font-medium">
                              <Calendar className="w-3.5 h-3.5 opacity-60 text-slate" />
                              <span>{dateStr}</span>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="p-4">
                            <div className="font-bold text-ink">{lead.name}</div>
                            <div className="flex flex-col space-y-0.5 text-xs text-slate mt-1">
                              <a href={`mailto:${lead.email}`} className="flex items-center hover:underline">
                                <Mail className="w-3 h-3 mr-1 text-slate/60" />
                                {lead.email}
                              </a>
                              <a href={`tel:${lead.phone}`} className="flex items-center hover:underline">
                                <Phone className="w-3 h-3 mr-1 text-slate/60" />
                                {lead.phone}
                              </a>
                            </div>
                          </td>

                          {/* Organization */}
                          <td className="p-4 text-slate">
                            <div className="flex items-center space-x-1.5 font-semibold text-ink">
                              <Building className="w-3.5 h-3.5 opacity-50 text-slate" />
                              <span>{lead.organization}</span>
                            </div>
                            <div className="text-[10px] text-slate/80 mt-0.5 truncate max-w-[150px]">
                              Page: {lead.source_page}
                            </div>
                          </td>

                          {/* Interest Area */}
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded bg-surface border border-line text-xs font-semibold text-brand">
                              {lead.service_interest}
                            </span>
                            {lead.utm_source && (
                              <div className="text-[10px] text-slate mt-1">
                                UTM: {lead.utm_source} / {lead.utm_campaign}
                              </div>
                            )}
                          </td>

                          {/* Status Selection */}
                          <td className="p-4 whitespace-nowrap">
                            <select
                              value={lead.status}
                              disabled={updatingId === lead.id}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`px-3 py-1 rounded border text-xs font-bold leading-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand ${
                                statusStyles[lead.status]
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>

                          {/* Read/Expand Message */}
                          <td className="p-4 text-center whitespace-nowrap">
                            <Button
                              onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                              variant="ghost"
                              className="px-3 py-1 text-xs text-slate hover:bg-surface border border-line hover:text-ink font-semibold"
                            >
                              <span className="mr-1">{isExpanded ? "Hide" : "Read"}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </Button>
                          </td>
                        </tr>

                        {/* Expanded Message Box */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="bg-surface/50 p-6 pl-8 border-b border-line animate-fade-up">
                              <div className="bg-white p-5 rounded-card border border-line shadow-sm space-y-4">
                                <div className="flex items-center space-x-2 border-b border-line pb-2.5 text-xs font-bold uppercase tracking-wider text-slate">
                                  <MessageSquare className="w-4 h-4 text-brand" />
                                  <span>Customer Message Requirement</span>
                                </div>
                                <p className="text-base text-ink leading-relaxed whitespace-pre-wrap">
                                  {lead.message}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
