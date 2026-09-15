import React from "react";
import { AlertOctagon } from "lucide-react";
import { STEP_ROLE_LABEL_MAP } from "./ProgressLineChecklist";

interface RejectionBannerProps {
  currentStep: string;
  alasan?: string;
}

export function RejectionBanner({ currentStep, alasan }: RejectionBannerProps) {
  return (
    <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-2 text-rose-900 dark:text-rose-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xs text-rose-700 dark:text-rose-300">
          <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            Ditolak oleh {STEP_ROLE_LABEL_MAP[currentStep] || currentStep}
          </span>
        </div>
      </div>
      <div className="text-[11px] leading-relaxed text-rose-800 dark:text-rose-300 bg-white/70 dark:bg-rose-900/30 p-2.5 rounded-lg border border-rose-200/60 dark:border-rose-800/40">
        <span className="font-semibold text-rose-900 dark:text-rose-200 block text-[10px] uppercase tracking-wider mb-0.5">
          Alasan:
        </span>
        "{alasan || "Spesifikasi atau dokumen belum memenuhi syarat, harap lakukan revisi."}"
      </div>
    </div>
  );
}
