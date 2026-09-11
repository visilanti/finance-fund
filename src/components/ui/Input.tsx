"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "text" | "number" | "email" | "password";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      isRequired,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "text",
      type,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const isPasswordType = variant === "password" || type === "password";
    const computedType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type || variant;

    return (
      <div className="w-full space-y-1">
        {label && (
          <Label htmlFor={inputId} isRequired={isRequired}>
            {label}
          </Label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={computedType}
            disabled={disabled}
            className={cn(
              "w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all duration-150",
              leftIcon && "pl-9",
              (rightIcon || isPasswordType) && "pr-9",
              error && "border-rose-500 dark:border-rose-500 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20 dark:bg-rose-950/20",
              disabled && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900",
              className
            )}
            {...props}
          />

          {isPasswordType ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {error ? (
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in duration-150">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
