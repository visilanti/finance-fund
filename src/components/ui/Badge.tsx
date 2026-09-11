import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "brand" | "info" | "warning" | "success" | "error" | "neutral";
export type BadgeType = "soft" | "fill";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  type?: BadgeType;
  dot?: boolean;
  children?: React.ReactNode;
}

const BADGE_STYLES: Record<BadgeVariant, Record<BadgeType, { bg: string; dot: string }>> = {
  brand: {
    soft: {
      bg: "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-primary dark:text-red-400",
      dot: "bg-primary dark:bg-red-400",
    },
    fill: {
      bg: "bg-primary border-primary text-white",
      dot: "bg-white",
    },
  },
  info: {
    soft: {
      bg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
      dot: "bg-blue-500 dark:bg-blue-400",
    },
    fill: {
      bg: "bg-blue-600 border-blue-600 text-white",
      dot: "bg-white",
    },
  },
  warning: {
    soft: {
      bg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500 dark:bg-amber-400",
    },
    fill: {
      bg: "bg-amber-500 border-amber-500 text-white",
      dot: "bg-white",
    },
  },
  success: {
    soft: {
      bg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500 dark:bg-emerald-400",
    },
    fill: {
      bg: "bg-emerald-600 border-emerald-600 text-white",
      dot: "bg-white",
    },
  },
  error: {
    soft: {
      bg: "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300",
      dot: "bg-rose-500 dark:bg-rose-400",
    },
    fill: {
      bg: "bg-rose-600 border-rose-600 text-white",
      dot: "bg-white",
    },
  },
  neutral: {
    soft: {
      bg: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300",
      dot: "bg-slate-400 dark:bg-slate-500",
    },
    fill: {
      bg: "bg-slate-700 dark:bg-slate-600 border-slate-700 dark:border-slate-600 text-white",
      dot: "bg-white",
    },
  },
};

export function Badge({
  className,
  variant = "neutral",
  type = "soft",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const styleConfig = BADGE_STYLES[variant]?.[type] || BADGE_STYLES.neutral.soft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-tight transition-colors select-none",
        styleConfig.bg,
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", styleConfig.dot)} />}
      {children}
    </span>
  );
}
