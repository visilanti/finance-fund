import React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
  variant?: "normal" | "bold" | "underline";
  children: React.ReactNode;
}

export function Label({ isRequired, variant, children, className, ...props }: LabelProps) {
  const variantClass =
    variant === "bold"
      ? "font-bold"
      : variant === "underline"
      ? "underline font-semibold"
      : "font-semibold";

  return (
    <label
      className={cn("text-xs text-slate-700 dark:text-slate-300 block mb-1 select-none", variantClass, className)}
      {...props}
    >
      {children}
      {isRequired && <span className="text-primary dark:text-red-400 ml-1 font-bold">*</span>}
    </label>
  );
}
