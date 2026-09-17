"use client";

import React from "react";
import { Send, AlertTriangle, TableProperties } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormStickyFooter as SharedStickyFooter } from "@/components/shared/FormStickyFooter";

interface FormStickyFooterProps {
  totalNominal: number;
  isOverBudget?: boolean;
  isSubmitting?: boolean;
  showRkaButton?: boolean;
  onOpenRkaDrawer?: () => void;
  onSubmitFinal: () => void;
  className?: string;
}

export function FormStickyFooter({
  totalNominal,
  isOverBudget = false,
  isSubmitting = false,
  showRkaButton = false,
  onOpenRkaDrawer,
  onSubmitFinal,
  className,
}: FormStickyFooterProps) {
  return (
    <SharedStickyFooter
      totalLabel="Total Pengajuan"
      totalNominal={totalNominal}
      className={className}
      badge={
        isOverBudget ? (
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-full text-rose-700 dark:text-rose-300 text-[11px] sm:text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Melebihi Plafon Bulan Ini</span>
          </div>
        ) : undefined
      }
      actions={
        <>
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
        </>
      }
    />
  );
}
