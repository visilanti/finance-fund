"use client";

import React, { useState } from "react";
import { Sidebar, RoleType } from "./Sidebar";
import { Header } from "./Header";
import { BreadcrumbItem } from "@/components/shared/Breadcrumb";

interface MainLayoutShellProps {
  children: React.ReactNode;
  initialRole?: RoleType;
  activePath?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: React.ReactNode;
}

export function MainLayoutShell({
  children,
  initialRole = "divisi",
  activePath = "/dashboard",
  pageTitle = "Daftar Pengajuan Dana",
  pageSubtitle,
  breadcrumbs,
  headerActions,
}: MainLayoutShellProps) {
  const [role, setRole] = useState<RoleType>(initialRole);

  return (
    <div className="h-screen overflow-hidden bg-background flex text-slate-800 antialiased font-sans">
      {/* White Clean Sidebar */}
      <Sidebar
        currentRole={role}
        onRoleChange={setRole}
        activePath={activePath}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        {/* Header with Breadcrumb and Page Title */}
        <Header
          currentRole={role}
          pageTitle={pageTitle}
          breadcrumbs={breadcrumbs}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Optional Page Subtitle / Top Header Actions Banner */}
          {(pageSubtitle || headerActions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
              <div>
                {pageSubtitle && (
                  <p className="text-xs font-medium text-slate-500">
                    {pageSubtitle}
                  </p>
                )}
              </div>
              {headerActions && (
                <div className="flex items-center gap-2.5">{headerActions}</div>
              )}
            </div>
          )}

          {/* Render children page content */}
          {children}
        </main>
      </div>
    </div>
  );
}
