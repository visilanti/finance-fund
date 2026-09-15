import React from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "primary" | "secondary";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: CardVariant;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  leftIcon?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const CARD_VARIANTS: Record<CardVariant, string> = {
  primary: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl",
  secondary: "bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl",
};

export function Card({
  variant = "primary",
  title,
  subtitle,
  leftIcon,
  action,
  children,
  className,
  headerClassName,
  bodyClassName,
  ...props
}: CardProps) {
  const hasHeader = Boolean(title || subtitle || leftIcon || action);

  return (
    <div
      className={cn(
        CARD_VARIANTS[variant],
        "p-3.5 transition-colors",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            "flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-700/50",
            headerClassName
          )}
        >
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200">
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <div>
              {title && (typeof title === "string" ? <span>{title}</span> : title)}
              {subtitle && (
                <p className="text-[10px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {children && (
        <div className={bodyClassName}>
          {children}
        </div>
      )}
    </div>
  );
}
