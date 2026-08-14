"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LogOut, ExternalLink, Search, Star, ChevronRight, Pin,
  PanelLeftClose, PanelLeft, Command, Sparkles, Plus, FileText, Newspaper,
  BookOpen, Ticket, Shield
} from "lucide-react";
import { ADMIN_NAV, ADMIN_ITEMS, titleForPath } from "./adminNav";

/**
 * AdminShell — modern enterprise admin layout with:
 * 1. Collapsible sidebar state (persisted to localStorage)
 * 2. Pinned / Favorite links section (persisted to localStorage)
 * 3. Dynamic breadcrumb path display
 * 4. Premium Cmd+K command palette modal with full keyboard navigation
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState<string[]>([]);
  const [showCmdK, setShowCmdK] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");
  const [cmdIndex, setCmdIndex] = useState(0);
  const cmdInputRef = useRef<HTMLInputElement>(null);

  // Load configuration from localStorage on mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("admin_sidebar_collapsed");
    if (savedCollapsed === "true") setCollapsed(true);

    const savedPinned = localStorage.getItem("admin_sidebar_pinned");
    if (savedPinned) {
      try {
        setPinned(JSON.parse(savedPinned));
      } catch {
        setPinned(["/admin/dashboard", "/admin/unlock-codes"]);
      }
    } else {
      setPinned(["/admin/dashboard", "/admin/unlock-codes"]);
    }
  }, []);

  // Sync collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("admin_sidebar_collapsed", String(newState));
  };

  // Sync pinned state to localStorage
  const togglePin = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let nextPinned = [...pinned];
    if (pinned.includes(href)) {
      nextPinned = nextPinned.filter((item) => item !== href);
    } else {
      nextPinned.push(href);
    }
    setPinned(nextPinned);
    localStorage.setItem("admin_sidebar_pinned", JSON.stringify(nextPinned));
  };

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCmdK((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle escape in CmdK
  useEffect(() => {
    if (showCmdK) {
      setCmdSearch("");
      setCmdIndex(0);
      setTimeout(() => cmdInputRef.current?.focus(), 50);
    }
  }, [showCmdK]);

  // Login page renders without the shell.
  if (pathname === "/admin") return <>{children}</>;

  const logout = async () => {
    try { await fetch("/api/admin/logout", { method: "POST" }); } catch { /* noop */ }
    router.push("/admin");
    router.refresh();
  };

  // Filter items for command palette
  const allActions = [
    { label: "Create Access Code", href: "/admin/unlock-codes?action=new", icon: Plus, category: "Actions" },
    { label: "New Course", href: "/admin/courses?action=new", icon: BookOpen, category: "Actions" },
    { label: "New Blog Post", href: "/admin/blog?action=new", icon: Newspaper, category: "Actions" },
  ];

  const paletteItems = [
    ...ADMIN_ITEMS.filter((i) => i.status === "active").map((i) => ({
      label: i.label,
      href: i.href,
      icon: i.icon,
      category: "Navigation Pages"
    })),
    ...allActions
  ];

  const filteredPalette = cmdSearch.trim() === "" 
    ? paletteItems.slice(0, 8)
    : paletteItems.filter(item => 
        item.label.toLowerCase().includes(cmdSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(cmdSearch.toLowerCase())
      );

  const handlePaletteSelect = (item: typeof paletteItems[0]) => {
    router.push(item.href);
    setShowCmdK(false);
  };

  const handleCmdKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCmdIndex((prev) => (prev + 1) % filteredPalette.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCmdIndex((prev) => (prev - 1 + filteredPalette.length) % filteredPalette.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredPalette[cmdIndex]) {
        handlePaletteSelect(filteredPalette[cmdIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowCmdK(false);
    }
  };

  // Build breadcrumbs dynamically from current pathname
  const pathParts = pathname.split("/").filter(Boolean);
  const breadcrumbs = pathParts.map((part, idx) => {
    const href = "/" + pathParts.slice(0, idx + 1).join("/");
    const label = ADMIN_ITEMS.find((i) => i.href === href)?.label || 
                  part.charAt(0).toUpperCase() + part.slice(1).replace("-", " ");
    const isLast = idx === pathParts.length - 1;
    return { label, href, isLast };
  });

  return (
    <div className="admin-light min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl flex flex-col">
            <SidebarContent 
              pathname={pathname} 
              onNavigate={() => setOpen(false)} 
              pinned={pinned} 
              togglePin={togglePin}
              collapsed={false}
            />
          </div>
        </div>
      )}

      {/* Main Grid Wrapper */}
      <div className="flex">
        {/* Collapsible Sidebar */}
        <aside className={`sticky top-0 hidden h-screen shrink-0 border-r border-slate-200 bg-white transition-all duration-300 lg:block ${collapsed ? "w-16" : "w-64"}`}>
          <div className="flex h-full flex-col">
            {/* Header logo / collapse */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              {!collapsed && (
                <div className="flex items-center gap-2">
                  <img src="/logo-dark.png" alt="KVJ Analytics" className="h-6 w-auto object-contain" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">Console</span>
                </div>
              )}
              {collapsed && (
                <img src="/logo-dark.png" alt="KVJ" className="h-6 w-6 object-contain mx-auto" />
              )}
              <button 
                onClick={toggleCollapse} 
                className="hidden lg:grid h-7 w-7 place-items-center rounded-lg border border-slate-150 hover:bg-slate-50 text-slate-400 hover:text-slate-655"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </div>

            <SidebarContent 
              pathname={pathname} 
              pinned={pinned} 
              togglePin={togglePin}
              collapsed={collapsed}
            />
          </div>
        </aside>

        {/* Content Column */}
        <div className="min-w-0 flex-1 flex flex-col">
          {/* Topbar Header */}
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur md:px-6 h-14">
            <button onClick={() => setOpen(true)} aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-1.5 text-[13px] font-medium text-slate-400 overflow-hidden shrink min-w-0">
              <span className="hover:text-slate-600 cursor-pointer hidden md:inline">Admin</span>
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={b.href}>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  {b.isLast ? (
                    <span className="font-bold text-slate-800 truncate shrink min-w-0">{b.label}</span>
                  ) : (
                    <Link href={b.href} className="hover:text-slate-600 truncate hidden sm:inline">{b.label}</Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Search Trigger (Linear styled) & Action Items */}
            <div className="ml-auto flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setShowCmdK(true)}
                className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 w-44 lg:w-56 text-left transition-all"
              >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 font-light">Search modules...</span>
                <span className="rounded bg-white border border-slate-200 px-1 py-0.5 text-[9px] font-semibold text-slate-450 font-mono tracking-widest leading-none shadow-sm">⌘K</span>
              </button>

              <button 
                onClick={() => setShowCmdK(true)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 md:hidden text-slate-500"
              >
                <Search className="h-4 w-4" />
              </button>

              <Link href="/" target="_blank" rel="noreferrer"
                className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:inline-flex bg-white transition-all shadow-sm">
                <ExternalLink className="h-3.5 w-3.5" />View site
              </Link>
              <button onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1e1b4b] to-[#4f46e5] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-all shadow-sm shadow-indigo-500/10">
                <LogOut className="h-3.5 w-3.5" />Logout
              </button>
            </div>
          </header>

          <main className="min-h-[calc(100vh-56px)] bg-slate-50/50">{children}</main>
        </div>
      </div>

      {/* Command Palette (Cmd+K) Modal */}
      {showCmdK && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
          {/* Overlay backdrop */}
          <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] transition-opacity animate-fade-in" onClick={() => setShowCmdK(false)} />
          
          {/* Palette Box */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all animate-scale-up flex flex-col max-h-[420px]">
            {/* Search Input Box */}
            <div className="flex items-center border-b border-slate-100 px-4 py-3 bg-slate-50/30">
              <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
              <input
                ref={cmdInputRef}
                type="text"
                value={cmdSearch}
                onChange={(e) => {
                  setCmdSearch(e.target.value);
                  setCmdIndex(0);
                }}
                onKeyDown={handleCmdKeyDown}
                placeholder="Search modules, pages, or admin actions..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button 
                onClick={() => setShowCmdK(false)}
                className="text-[10px] bg-slate-100 text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded font-mono tracking-wider"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              {filteredPalette.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-1">
                  <Command className="h-6 w-6 text-slate-300" />
                  <p>No results found for &ldquo;{cmdSearch}&rdquo;</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Render list */}
                  {filteredPalette.map((item, idx) => {
                    const isSelected = idx === cmdIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.href + "-" + idx}
                        onClick={() => handlePaletteSelect(item)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl transition-all ${
                          isSelected ? "bg-indigo-50/60 text-indigo-950 font-semibold border-l-2 border-indigo-500" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-500"}`}>
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                          </div>
                          <span className="text-xs">{item.label}</span>
                        </div>
                        <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded ${
                          isSelected ? "bg-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-450"
                        }`}>
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
              <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-indigo-600" /> KVJ Admin Helper</span>
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SidebarContentProps {
  pathname: string;
  onNavigate?: () => void;
  pinned: string[];
  togglePin: (href: string, e: React.MouseEvent) => void;
  collapsed: boolean;
}

function SidebarContent({ pathname, onNavigate, pinned, togglePin, collapsed }: SidebarContentProps) {
  // Filter active navigation items for favorites list
  const activeNavItems = ADMIN_ITEMS.filter((i) => i.status === "active");
  const pinnedItems = activeNavItems.filter((i) => pinned.includes(i.href));

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white via-white to-slate-50/70 overflow-hidden">
      {/* 1. Logo Block in mobile / drawer (where shell lacks the default block) */}
      <div className="lg:hidden flex items-center gap-2 border-b border-slate-100 px-5 py-4 shrink-0">
        <img src="/logo-dark.png" alt="KVJ Analytics" className="h-7 w-auto object-contain" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">Console</span>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin">
        {/* Pinned / Favorites Section */}
        {pinnedItems.length > 0 && (
          <div className="animate-fade-in">
            <div className={`mb-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 flex items-center justify-between ${collapsed ? "justify-center" : ""}`}>
              {!collapsed && <span>Favorites</span>}
              <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
            </div>
            <div className="space-y-0.5">
              {pinnedItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link key={"pin-" + item.href} href={item.href} onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-lg border-l-[3px] border-transparent px-2.5 py-1.5 text-[12.5px] font-medium transition-all group ${
                      active
                        ? "bg-gradient-to-r from-indigo-50 to-violet-50/30 !border-[#4f46e5] text-[#4338ca] font-bold shadow-[0_1px_2px_rgba(79,70,229,0.04)]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-[#4338ca]" : "text-slate-400 group-hover:text-slate-700"}`} />
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && (
                      <button 
                        onClick={(e) => togglePin(item.href, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-amber-500"
                        title="Unfavorite"
                      >
                        <Star className="h-3 w-3 text-amber-450 fill-amber-450 shrink-0" />
                      </button>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Modules */}
        {ADMIN_NAV.map((group) => {
          // If all items are "soon" and collapsed, don't show group
          const activeCount = group.items.filter((i) => i.status === "active").length;
          if (collapsed && activeCount === 0) return null;

          return (
            <div key={group.label} className="border-t border-slate-50 pt-3 first:border-none first:pt-0">
              <div className={`mb-1 px-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400 truncate ${collapsed ? "text-center" : ""}`}>
                {collapsed ? group.label.substring(0, 3) : group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.status === "active" && (pathname === item.href || pathname.startsWith(item.href + "/"));
                  const isPinned = pinned.includes(item.href);

                  if (item.status === "soon") {
                    if (collapsed) return null;
                    return (
                      <div key={item.href} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium text-slate-350 select-none">
                        <item.icon className="h-4 w-4 shrink-0 text-slate-300" />
                        <span className="flex-1 truncate">{item.label}</span>
                        <span className="rounded bg-slate-50 px-1 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-slate-400 border border-slate-100">Soon</span>
                      </div>
                    );
                  }

                  return (
                    <Link key={item.href} href={item.href} onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-lg border-l-[3px] border-transparent px-2.5 py-1.5 text-[12.5px] font-medium transition-all group ${
                        active
                          ? "bg-gradient-to-r from-indigo-50 to-violet-50/30 !border-[#4f46e5] text-[#4338ca] font-bold shadow-[0_1px_2px_rgba(79,70,229,0.04)]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${active ? "text-[#4338ca] font-bold" : "text-slate-400 group-hover:text-slate-700"}`} />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && (
                        <button 
                          onClick={(e) => togglePin(item.href, e)}
                          className={`transition-opacity duration-200 ${isPinned ? "opacity-100 text-amber-500" : "opacity-0 group-hover:opacity-100 text-slate-300 hover:text-amber-500"}`}
                          title={isPinned ? "Unfavorite" : "Favorite"}
                        >
                          <Star className={`h-3.5 w-3.5 shrink-0 ${isPinned ? "fill-amber-500 text-amber-500" : ""}`} />
                        </button>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info (User Profile/Indicator) */}
      {!collapsed && (
        <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate">
            <div className="h-7 w-7 rounded-full bg-[#1e1b4b] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              AD
            </div>
            <div className="truncate">
              <p className="text-[11px] font-bold text-slate-800 leading-none">Administrator</p>
              <p className="text-[9px] text-slate-400 truncate mt-0.5">admin@kvjanalytics.in</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
