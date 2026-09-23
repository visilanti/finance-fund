"use client";

import React, { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { ChipCardIcon } from "../../../profile/components/ChipCardIcon";
import { cn } from "@/lib/utils";

export type BankCardVariant = "primary" | "dark" | "light";

export interface BankCardProps {
  bank: string;
  noRekening: string;
  name: string;
  isDefault?: boolean;
  variant?: BankCardVariant;
  className?: string;
  showCopyButton?: boolean;
  onCopy?: (text: string) => void;
}

export function BankCard({
  bank,
  noRekening,
  name,
  isDefault = true,
  variant = "primary",
  className,
  showCopyButton = true,
  onCopy,
}: BankCardProps) {
  const [copied, setCopied] = useState(false);

  const formatRekeningNumber = (num: string) => {
    if (!num) return "-";
    const cleaned = num.replace(/\s+/g, "");
    return cleaned.match(/.{1,4}/g)?.join(" ") || num;
  };

  const handleCopy = () => {
    if (noRekening && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(noRekening);
      setCopied(true);
      if (onCopy) onCopy(noRekening);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Variant-specific styles
  const variantStyles = {
    primary: {
      card: "bg-gradient-to-br from-[#772929] via-[#9e1b1b] to-[#c00000] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-transparent dark:border-slate-800 text-white shadow-md",
      bankText: "text-white dark:text-slate-100",
      checkIcon: "text-emerald-400 dark:text-emerald-300",
      label: "text-white/70 dark:text-slate-300/70",
      nameText: "text-white dark:text-slate-100",
      footer: "bg-gradient-to-b from-white/15 to-white/5 dark:from-white/10 dark:to-white/5 border-t border-white/10 dark:border-white/15",
      rekText: "text-white dark:text-slate-100 drop-shadow-sm",
      copyBtn: "text-slate-200 hover:text-white dark:text-slate-300 dark:hover:text-white",
      circles: (
        <div className="flex items-center -space-x-2.5 opacity-80 dark:opacity-90 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-white/40 dark:bg-white/30 backdrop-blur-xs" />
          <div className="w-7 h-7 rounded-full bg-white/20 dark:bg-white/15 backdrop-blur-xs" />
        </div>
      ),
    },
    dark: {
      card: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-700/60 dark:border-slate-800 text-white shadow-md",
      bankText: "text-white dark:text-slate-100",
      checkIcon: "text-emerald-400 dark:text-emerald-300",
      label: "text-slate-400 dark:text-slate-400",
      nameText: "text-white dark:text-slate-100",
      footer: "bg-gradient-to-b from-white/10 to-white/5 dark:from-white/5 dark:to-transparent border-t border-slate-700/70 dark:border-slate-800",
      rekText: "text-white dark:text-slate-100 drop-shadow-sm",
      copyBtn: "text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white",
      circles: (
        <div className="flex items-center -space-x-2.5 opacity-80 dark:opacity-90 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-white/30 dark:bg-white/20 backdrop-blur-xs" />
          <div className="w-7 h-7 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-xs" />
        </div>
      ),
    },
    light: {
      card: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm",
      bankText: "text-slate-900 dark:text-slate-100",
      checkIcon: "text-emerald-600 dark:text-emerald-400",
      label: "text-slate-400 dark:text-slate-500",
      nameText: "text-slate-900 dark:text-slate-100",
      footer: "bg-slate-50/90 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800",
      rekText: "text-slate-900 dark:text-slate-100",
      copyBtn: "text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
      circles: (
        <div className="flex items-center -space-x-2.5 opacity-60 dark:opacity-80 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-slate-400/40 dark:bg-white/25 backdrop-blur-xs" />
          <div className="w-7 h-7 rounded-full bg-slate-300/40 dark:bg-white/15 backdrop-blur-xs" />
        </div>
      ),
    },
  };

  const current = variantStyles[variant] || variantStyles.primary;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl max-w-md w-full p-4 sm:p-5 flex flex-col justify-between min-h-[170px] sm:min-h-[190px] max-h-[210px] transition-all",
        current.card,
        className
      )}
    >
      {/* Card Header: Bank Name & Chip */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-semibold tracking-wide", current.bankText)}>
              {bank || "-"}
            </span>
            {isDefault && (
              <CheckCircle2 className={cn("w-4 h-4 shrink-0", current.checkIcon)} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <ChipCardIcon />
        </div>
      </div>

      {/* Card Body: Card Holder Name */}
      <div className="relative z-10 my-3 space-y-0.5">
        <p className={cn("text-[10px] font-semibold tracking-wider uppercase", current.label)}>
          CARD HOLDER
        </p>
        <p className={cn("text-base font-bold tracking-wide truncate", current.nameText)}>
          {name || "-"}
        </p>
      </div>

      {/* Card Footer: Account Number, Copy & Circles */}
      <div
        className={cn(
          "relative z-10 -mx-5 -mb-5 mt-2 px-5 py-5 rounded-b-[20px] flex items-center justify-between gap-4",
          current.footer
        )}
      >
        <div className="flex items-center gap-2">
          <p className={cn("text-xl sm:text-2xl font-medium font-mono tracking-wider", current.rekText)}>
            {formatRekeningNumber(noRekening)}
          </p>
          {showCopyButton && (
            <button
              type="button"
              onClick={handleCopy}
              title="Salin Nomor Rekening"
              className={cn(
                "p-1 rounded transition-colors cursor-pointer",
                current.copyBtn
              )}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Decorative Overlapping Circles */}
        {current.circles}
      </div>
    </div>
  );
}
