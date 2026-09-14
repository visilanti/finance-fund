"use client";

import React from "react";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  NAV_GROUPS,
  type RoleType,
  type NavChildItem,
  type NavItem,
  type NavGroup,
} from "@/constants/navigation";

export type { RoleType, NavChildItem, NavItem, NavGroup };
export { NAV_GROUPS };

interface SidebarProps {
  currentRole: RoleType;
  onRoleChange?: (role: RoleType) => void;
  activePath?: string;
}

function SidebarContent({ currentRole, onRoleChange, activePath }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryStr = searchParams?.toString();
  const fullPath = queryStr ? `${pathname}?${queryStr}` : pathname;

  const currentPath =
    activePath && activePath.includes("?")
      ? activePath
      : activePath && queryStr
        ? `${activePath}?${queryStr}`
        : fullPath || activePath || "/dashboard";

  const {
    isMobileOpen,
    closeMobile,
    isDesktopCollapsed,
    toggleDesktopCollapsed,
    toggleSubmenu,
    isSubmenuOpen,
  } = useSidebarStore();

  const isPathActive = (targetPath?: string) => {
    if (!targetPath) return false;

    // Handle query string exact/fallback matching
    if (targetPath.includes("?")) {
      if (currentPath.includes("?")) {
        return currentPath === targetPath;
      }
      const [targetBase, targetQuery] = targetPath.split("?");
      if (currentPath === targetBase && targetQuery === "type=rka") {
        return true;
      }
      return false;
    }

    const cleanTarget = targetPath.split("?")[0];
    const cleanCurrent = currentPath.split("?")[0];

    if (cleanTarget === "/dashboard" || cleanTarget === "/") {
      return cleanCurrent === "/dashboard" || cleanCurrent === "/";
    }

    return (
      cleanCurrent === cleanTarget ||
      (cleanTarget !== "/" && cleanCurrent.startsWith(cleanTarget))
    );
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 select-none transition-colors duration-150">
      {/* Brand Header */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-slate-100 dark:border-slate-800 shrink-0 transition-all",
          isDesktopCollapsed ? "justify-center px-0" : "justify-between px-5"
        )}
      >
        <div className={cn("flex items-center gap-3", isDesktopCollapsed && "justify-center w-full")}>
          <img
            src="/images/logo.png"
            alt="FinanceHubs Logo"
            className="w-9 h-9 object-contain shrink-0"
          />
          {!isDesktopCollapsed && (
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none tracking-tight">
                CASHOUT<span className="text-primary">HUBS</span>
              </h1>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">Finance Fund Management</p>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={closeMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {NAV_GROUPS.map((group) => {
          // Filter items based on user role
          const visibleItems = group.items.filter((item) => {
            const hasRole = item.roles.includes(currentRole);
            if (item.children) {
              const visibleChildren = item.children.filter((c) => c.roles.includes(currentRole));
              return hasRole && visibleChildren.length > 0;
            }
            return hasRole;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title}>
              {/* Category Header: UPPERCASE 10px (Hidden on desktop collapsed) */}
              {!isDesktopCollapsed && (
                <h2 className="text-2xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider px-3 mb-2 uppercase">
                  {group.title}
                </h2>
              )}

              <nav className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = Boolean(item.children && item.children.length > 0);

                  // Active state logic
                  const isDirectActive = isPathActive(item.path);
                  const isChildActive = hasChildren && item.children?.some((c) => c.roles.includes(currentRole) && isPathActive(c.path));
                  const isActive = isDirectActive || isChildActive;
                  const isSubOpen = isSubmenuOpen(item.id);

                  if (hasChildren) {
                    const visibleChildren = item.children!.filter((c) => c.roles.includes(currentRole));

                    return (
                      <div key={item.id} className="space-y-1">
                        {/* Parent Accordion Header */}
                        <button
                          type="button"
                          onClick={() => toggleSubmenu(item.id)}
                          className={cn(
                            "w-full flex items-center text-xs font-medium rounded-lg transition-all duration-150 group",
                            isDesktopCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2",
                            isActive
                              ? "bg-red-50/80 dark:bg-red-950/40 text-primary dark:text-red-400 font-semibold"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
                          )}
                          title={isDesktopCollapsed ? item.label : undefined}
                        >
                          <div className={cn("flex items-center", isDesktopCollapsed ? "justify-center w-full" : "gap-2.5 min-w-0")}>
                            <Icon
                              className={cn(
                                "w-4 h-4 shrink-0 transition-colors",
                                isActive ? "text-primary dark:text-red-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                              )}
                            />
                            {!isDesktopCollapsed && (
                              <span className="truncate">{item.label}</span>
                            )}
                          </div>

                          {!isDesktopCollapsed && (
                            <ChevronDown
                              className={cn(
                                "w-3.5 h-3.5 transition-transform duration-200 shrink-0",
                                isSubOpen && "rotate-180",
                                isActive
                                  ? "text-primary dark:text-red-400"
                                  : isSubOpen
                                    ? "text-slate-600 dark:text-slate-300"
                                    : "text-slate-400 dark:text-slate-500"
                              )}
                            />
                          )}
                        </button>

                        {/* Sub-menu Child Items (Accordion) */}
                        {isSubOpen && !isDesktopCollapsed && (
                          <div className="pl-4 space-y-1 border-l border-slate-200/60 dark:border-slate-800 ml-4 py-0.5">
                            {visibleChildren.map((child) => {
                              const isChildItemActive = isPathActive(child.path);

                              return (
                                <Link
                                  key={child.id}
                                  href={child.path}
                                  onClick={closeMobile}
                                  className={cn(
                                    "flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 group/sub cursor-pointer",
                                    isChildItemActive
                                      ? "bg-red-50 dark:bg-red-950/40 text-primary dark:text-red-400 font-bold"
                                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={cn("w-1.5 h-1.5 rounded-full transition-colors", isChildItemActive ? "bg-primary dark:bg-red-400" : "bg-slate-300 dark:bg-slate-600 group-hover/sub:bg-slate-500 dark:group-hover/sub:bg-slate-400")} />
                                    <span>{child.label}</span>
                                  </div>

                                  {child.badge !== undefined && (
                                    <span
                                      className={cn(
                                        "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                                        child.badgeColor || "bg-primary/10 dark:bg-primary/20 text-primary dark:text-red-400"
                                      )}
                                    >
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Single Nav Item
                  return (
                    <Link
                      key={item.id}
                      href={item.path || "#"}
                      onClick={closeMobile}
                      title={isDesktopCollapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center text-xs font-medium rounded-lg transition-all duration-150 group cursor-pointer",
                        isDesktopCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3 py-2",
                        isActive
                          ? "bg-red-50/80 dark:bg-red-950/40 text-primary dark:text-red-400 font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-5 before:bg-primary dark:before:bg-red-400 before:rounded-r-full"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <div className={cn("flex items-center", isDesktopCollapsed ? "justify-center w-full" : "gap-2.5 min-w-0")}>
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0 transition-colors",
                            isActive ? "text-primary dark:text-red-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                          )}
                        />
                        {!isDesktopCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isDesktopCollapsed && item.badge !== undefined && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            item.badgeColor || "bg-primary/10 dark:bg-primary/20 text-primary dark:text-red-400"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* User Role Switcher & Bottom Section */}
      {!isDesktopCollapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 shrink-0">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-subtle">
            <div className="text-[10px] font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Simulasi Role</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="relative">
              <select
                value={currentRole}
                onChange={(e) => onRoleChange?.(e.target.value as RoleType)}
                className="w-full text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1.5 px-2.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
              >
                <option value="divisi">Role: Divisi (Pengaju)</option>
                <option value="manager">Role: Manager (Approver 1)</option>
                <option value="bendahara">Role: Bendahara (Approver 2)</option>
                <option value="finance">Role: Finance (Pencairan)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* MOBILE OFF-CANVAS DRAWER WITH BACKDROP */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark Backdrop Overlay */}
          <div
            onClick={closeMobile}
            className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-over Mobile Sidebar Content */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* DESKTOP STICKY SIDEBAR */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 h-screen shrink-0 relative group z-30 transition-all duration-200",
          isDesktopCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Floating Toggle Button Melayang di Antara Sidebar & Header */}
        <button
          type="button"
          onClick={toggleDesktopCollapsed}
          className="hidden md:flex absolute -right-3.5 top-6 z-40 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-110 active:scale-95 items-center justify-center transition-all cursor-pointer"
          title={isDesktopCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
        >
          {isDesktopCollapsed ? (
            <PanelLeftOpen className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftClose className="w-3.5 h-3.5" />
          )}
        </button>

        {renderNavContent()}
      </aside>
    </>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <React.Suspense fallback={null}>
      <SidebarContent {...props} />
    </React.Suspense>
  );
}
