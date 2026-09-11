import React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
  children: React.ReactNode;
}

export function Label({ isRequired, children, className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1 select-none", className)}
      {...props}
    >
      {children}
      {isRequired && <span className="text-primary dark:text-red-400 ml-1 font-bold">*</span>}
    </label>
  );
}
