"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar, RoleType } from "./Sidebar";
import { Header } from "./Header";
import { BreadcrumbItem } from "@/components/shared/Breadcrumb";
import { NAV_GROUPS } from "@/constants/navigation";
import { useSidebarStore } from "@/store/useSidebarStore";

export function isPathAllowedForRole(targetPath: string, role: RoleType): boolean {
  const cleanPath = targetPath.split("?")[0];

  if (cleanPath === "/profile" || cleanPath === "/matriks-rka" || cleanPath === "/") {
    return true;
  }

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.path) {
        const itemCleanPath = item.path.split("?")[0];
        if (cleanPath === itemCleanPath || cleanPath.startsWith(itemCleanPath + "/")) {
          return item.roles.includes(role);
        }
      }

      if (item.children) {
        for (const child of item.children) {
          const childCleanPath = child.path.split("?")[0];
          if (cleanPath === childCleanPath || cleanPath.startsWith(childCleanPath + "/")) {
            return child.roles.includes(role);
          }
        }
      }
    }
  }

  return true;
}

interface MainLayoutShellProps {
  children: React.ReactNode;
  /**
   * TODO (Next Development):
   * `initialRole` saat ini digunakan sebagai fallback untuk fitur simulasi role.
   * Ketika sistem autentikasi (NextAuth / JWT / session login) sudah diintegrasikan,
   * prop ini bisa dihapus/digantikan dengan data role resmi dari session pengguna (misal: `useAuth()`).
   */
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
  pageTitle = "Pengajuan Dana",
  pageSubtitle,
  breadcrumbs,
  headerActions,
}: MainLayoutShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { currentRole, setRole } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectivePath = activePath || pathname || "";
  const activeRole = mounted ? currentRole : initialRole;

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);

    const isAllowed = isPathAllowedForRole(effectivePath, newRole);
    if (!isAllowed) {
      router.push("/matriks-rka");
    }
  };

  useEffect(() => {
    if (mounted) {
      const isAllowed = isPathAllowedForRole(effectivePath, currentRole);
      if (!isAllowed) {
        router.push("/matriks-rka");
      }
    }
  }, [mounted, effectivePath, currentRole, router]);

  return (
    <div className="h-screen overflow-hidden bg-background flex text-slate-800 antialiased font-sans">
      {/* White Clean Sidebar */}
      <Sidebar
        currentRole={activeRole}
        onRoleChange={handleRoleChange}
        activePath={activePath}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        {/* Header with Breadcrumb and Page Title */}
        <Header
          currentRole={activeRole}
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

