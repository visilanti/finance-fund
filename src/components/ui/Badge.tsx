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
      bg: "rounded-md bg-red-50 dark:bg-red-950/50 text-primary dark:text-red-400",
      dot: "bg-primary dark:bg-red-400",
    },
    fill: {
      bg: "rounded-md bg-primary text-white",
      dot: "bg-white",
    },
  },
  info: {
    soft: {
      bg: "rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300",
      dot: "bg-blue-500 dark:bg-blue-400",
    },
    fill: {
      bg: "rounded-md bg-blue-600 text-white",
      dot: "bg-white",
    },
  },
  warning: {
    soft: {
      bg: "rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300",
      dot: "bg-amber-500 dark:bg-amber-400",
    },
    fill: {
      bg: "rounded-md bg-amber-500 text-white",
      dot: "bg-white",
    },
  },
  success: {
    soft: {
      bg: "rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300",
      dot: "bg-emerald-500 dark:bg-emerald-400",
    },
    fill: {
      bg: "rounded-md bg-emerald-600 text-white",
      dot: "bg-white",
    },
  },
  error: {
    soft: {
      bg: "rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300",
      dot: "bg-rose-500 dark:bg-rose-400",
    },
    fill: {
      bg: "rounded-md bg-rose-600 text-white",
      dot: "bg-white",
    },
  },
  neutral: {
    soft: {
      bg: "rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
      dot: "bg-slate-400 dark:bg-slate-500",
    },
    fill: {
      bg: "rounded-md bg-slate-700 dark:bg-slate-600 text-white",
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
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight transition-colors select-none",
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
