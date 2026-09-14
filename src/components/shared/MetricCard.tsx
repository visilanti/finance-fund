import React from "react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: React.ReactNode;
  icon?: React.ElementType;
  iconBgClass?: string;
  valueClass?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  iconBgClass,
  valueClass = "text-slate-900 dark:text-slate-100",
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs dark:shadow-none flex flex-col justify-between space-y-3 transition-all hover:border-slate-300 dark:hover:border-slate-700 select-none",
        className
      )}
    >
      {/* Top Header: Title & Minimal Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-tight truncate">
          {title}
        </span>

        {Icon && (
          <div
            className={cn(
              "w-7 h-7 rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 flex items-center justify-center shrink-0 transition-colors",
              iconBgClass
            )}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Main Value, Optional Unit & Subtitle */}
      <div className="flex items-baseline min-w-0 gap-2 flex-wrap">
        <h3 className={cn("text-xl font-bold tracking-tight leading-none shrink-0", valueClass)}>
          {value}
        </h3>
        {unit && (
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">
            {unit}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-slate-400 dark:text-slate-400 inline-flex items-center gap-1 shrink-0">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
