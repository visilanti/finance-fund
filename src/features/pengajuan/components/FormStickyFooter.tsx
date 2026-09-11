"use client";

import React from "react";
import { AlertTriangle, List, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatIDR, cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";

interface FormStickyFooterProps {
  totalNominal: number;
  isOverBudget: boolean;
  isSubmitting: boolean;
  onOpenRkaDrawer: () => void;
  onSubmitDraft: () => void;
  onSubmitFinal: () => void;
  showRkaButton?: boolean;
}

export function FormStickyFooter({
  totalNominal,
  isOverBudget,
  isSubmitting,
  onOpenRkaDrawer,
  onSubmitDraft,
  onSubmitFinal,
  showRkaButton = true,
}: FormStickyFooterProps) {
  const { isDesktopCollapsed } = useSidebarStore();

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-dropdown px-4 sm:px-6 py-3 transition-all duration-200",
        "left-0",
        isDesktopCollapsed ? "md:left-20" : "md:left-64"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Total & Budget Warning */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Total Pengajuan
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {formatIDR(totalNominal)}
            </span>
          </div>

          {showRkaButton && isOverBudget && (
            <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-full text-rose-700 dark:text-rose-300 text-[11px] sm:text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Over-Budget!</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {showRkaButton && (
            <Button
              variant="outline"
              size="sm"
              className="sm:px-4 sm:py-2"
              leftIcon={<List className="w-3.5 h-3.5" />}
              onClick={onOpenRkaDrawer}
            >
              Cek RKA
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            className="sm:px-4 sm:py-2"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            onClick={onSubmitFinal}
            isLoading={isSubmitting}
          >
            Kirim
          </Button>
        </div>
      </div>
    </div>
  );
}
