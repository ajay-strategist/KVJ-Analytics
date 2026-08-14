import type { ComponentType } from "react";
import {
  LayoutDashboard, Globe, Newspaper, Star, Building2, Users, GraduationCap,
  BookOpen, FolderTree, ClipboardList, Ticket, UserSquare2, MessageSquare,
  FileText, Briefcase, ShoppingCart, CreditCard, Image, BarChart3, Shield,
  Settings, ScrollText, Layers, Award, Megaphone, Search,
} from "lucide-react";

export type AdminStatus = "active" | "soon";
export interface AdminNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  status: AdminStatus;
}
export interface AdminNavGroup { label: string; items: AdminNavItem[] }

/**
 * Admin platform module registry — the single source of truth for the sidebar navigation.
 * `active` items map to routes that already exist; `soon` items are placeholders for modules to be
 * built in later Phase 2.x steps (they render disabled with a "Soon" badge). Add a module by adding
 * a row here + its `/admin/<route>` page — the sidebar updates automatically.
 */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, status: "active" }],
  },
  {
    label: "Website",
    items: [
      { label: "Website CMS", href: "/admin/content", icon: Globe, status: "active" },
      { label: "Digital Marketing", href: "/admin/seo", icon: Search, status: "active" },
      { label: "Blog", href: "/admin/blog", icon: Newspaper, status: "active" },
      { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone, status: "active" },
      { label: "Case Studies", href: "/admin/case-studies", icon: FileText, status: "active" },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star, status: "active" },
      { label: "Clients", href: "/admin/clients", icon: Building2, status: "active" },
      { label: "Team", href: "/admin/team", icon: UserSquare2, status: "active" },
      { label: "Media Library", href: "/admin/media", icon: Image, status: "active" },
    ],
  },
  {
    label: "Learning",
    items: [
      { label: "Courses", href: "/admin/courses", icon: BookOpen, status: "active" },
      { label: "Categories", href: "/admin/categories", icon: FolderTree, status: "active" },
      { label: "Enrollments", href: "/admin/enrollments", icon: GraduationCap, status: "active" },
      { label: "Batches", href: "/admin/batches", icon: Layers, status: "active" },
      { label: "Internships", href: "/admin/internships", icon: Briefcase, status: "active" },
      { label: "Assessments", href: "/admin/assessments", icon: ClipboardList, status: "active" },
      { label: "Question Bank", href: "/admin/question-bank", icon: ClipboardList, status: "active" },
      { label: "Certificates", href: "/admin/certificates", icon: Award, status: "active" },
    ],
  },
  {
    label: "People & CRM",
    items: [
      { label: "Leads", href: "/admin/leads", icon: MessageSquare, status: "active" },
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, status: "active" },
      { label: "Applications", href: "/admin/applications", icon: FileText, status: "active" },
      { label: "Students", href: "/admin/students", icon: Users, status: "active" },
      { label: "Users & Roles", href: "/admin/users", icon: Shield, status: "active" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart, status: "active" },
      { label: "Payments", href: "/admin/payments", icon: CreditCard, status: "active" },
      { label: "Vouchers & Codes", href: "/admin/unlock-codes", icon: Ticket, status: "active" },
    ],
  },
  {
    label: "Careers",
    items: [{ label: "Jobs", href: "/admin/jobs", icon: Briefcase, status: "active" }],
  },
  {
    label: "Insights & System",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChart3, status: "active" },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3, status: "active" },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText, status: "active" },
      { label: "Settings", href: "/admin/settings", icon: Settings, status: "active" },
    ],
  },
];

/** Flatten for lookups (active-page title, etc.). */
export const ADMIN_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((g) => g.items);

export function titleForPath(pathname: string): string {
  const match = ADMIN_ITEMS
    .filter((i) => i.status === "active" && pathname.startsWith(i.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Admin";
}
