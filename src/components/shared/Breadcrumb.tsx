"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items = [], className }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1.5", className)}>
      {/* Root / Home link */}
      <Link
        href="/dashboard"
        className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1 text-[11px] font-medium"
      >
        <Home className="w-3 h-3 text-slate-400 dark:text-slate-500" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors truncate max-w-[120px] sm:max-w-xs"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
