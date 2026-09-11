"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";
import { RoleType } from "./Sidebar";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Breadcrumb, BreadcrumbItem } from "@/components/shared/Breadcrumb";
import { UserProfileCard } from "./UserProfileCard";

interface HeaderProps {
  currentRole: RoleType;
  userName?: string;
  userRoleTitle?: string;
  pageTitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  onNewRequestClick?: () => void;
}

const ROLE_LABELS: Record<RoleType, { title: string; badgeClass: string }> = {
  divisi: {
    title: "Staf / Kadiv Operasional",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
  manager: {
    title: "Department Manager",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  bendahara: {
    title: "Bendahara Yayasan / SaaS",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  finance: {
    title: "Finance & Treasury",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

export function Header({
  currentRole,
  userName = "Ahmad Hidayat",
  userRoleTitle,
  pageTitle = "Dashboard",
  breadcrumbs,
  onNewRequestClick,
}: HeaderProps) {
  const roleInfo = ROLE_LABELS[currentRole];
  const { toggleMobileOpen } = useSidebarStore();

  return (
    <header className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-20 shrink-0 shadow-subtle flex items-center transition-colors">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Left: Mobile Toggle & Page Title with Breadcrumb */}
        <div className="flex items-center gap-3.5 md:gap-4 flex-1 min-w-0">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={toggleMobileOpen}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Toggle Sidebar Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page Title & Breadcrumb Header Section */}
          <div className="flex flex-col justify-center space-y-0.5 min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
            <h1 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Bell */}
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-slate-900" />
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1" />

          {/* User Profile Card */}
          <UserProfileCard
            userName={userName}
            userRoleTitle={userRoleTitle}
            roleTitle={roleInfo.title}
          />
        </div>
      </div>
    </header>
  );
}
