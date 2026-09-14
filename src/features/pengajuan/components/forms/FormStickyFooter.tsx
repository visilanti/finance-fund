"use client";

import React from "react";
import { formatIDR, cn } from "@/lib/utils";
import { Send, Save, AlertTriangle, TableProperties } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FormStickyFooterProps {
  totalNominal: number;
  isOverBudget?: boolean;
  isSubmitting?: boolean;
  showRkaButton?: boolean;
  onOpenRkaDrawer?: () => void;
  onSubmitDraft: () => void;
  onSubmitFinal: () => void;
  className?: string;
}

export function FormStickyFooter({
  totalNominal,
  isOverBudget = false,
  isSubmitting = false,
  showRkaButton = false,
  onOpenRkaDrawer,
  onSubmitDraft,
  onSubmitFinal,
  className,
}: FormStickyFooterProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-dropdown px-4 sm:px-6 py-3 transition-all duration-200",
        "left-0 md:left-64", // Responsive alignment with desktop sidebar
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Total Nominal & Over Budget Alert */}
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Total Pengajuan
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {formatIDR(totalNominal)}
            </span>
          </div>

          {/* Over-budget Badge Indicator */}
          {isOverBudget && (
            <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-full text-rose-700 dark:text-rose-300 text-[11px] sm:text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Melebihi Plafon Bulan Ini</span>
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Optional RKA Matrix Drawer Trigger */}
          {showRkaButton && onOpenRkaDrawer && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onOpenRkaDrawer}
              leftIcon={<TableProperties className="w-4 h-4 text-slate-500" />}
              className="hidden sm:inline-flex"
            >
              Cek Plafon RKA
            </Button>
          )}

          {/* Draft Save */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onSubmitDraft}
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Simpan Draft
          </Button>

          {/* Final Submit */}
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onSubmitFinal}
            isLoading={isSubmitting}
            disabled={isOverBudget}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Kirim Pengajuan
          </Button>
        </div>
      </div>
    </div>
  );
}
