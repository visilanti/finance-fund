"use client"

import React from "react";
import { cn } from "@/lib/utils";

export interface FormCardSectionProps {
  stepNumber?: number | string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormCardSection({
  stepNumber,
  title,
  description,
  action,
  children,
  className,
}: FormCardSectionProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-card dark:shadow-none p-5 md:p-6 space-y-5 transition-colors",
        className
      )}
    >
      {/* Step Header Bar */}
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          {stepNumber !== undefined && (
            <div className="w-8 h-8 rounded-lg bg-primary dark:bg-primary/60 text-white dark:text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
              {stepNumber}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl md:max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Card Form Body */}
      {children}
    </div>
  );
}
