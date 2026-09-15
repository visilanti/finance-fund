import React from "react";
import { Clock, Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { PengajuanDanaItem, StepType } from "@/features/pengajuan/types";

export const STEP_ROLE_LABEL_MAP: Record<string, string> = {
  manager: "Manager Divisi",
  bendahara: "Bendahara Yayasan",
  finance: "Finance / Tim Pencairan",
  lpj: "Verifikator LPJ",
  selesai: "Selesai",
};

export function getStepIndex(currentStep: string = "", status: string = ""): number {
  if (status === "disetujui" || currentStep === "selesai") {
    return 4; // Selesai
  }

  const stepLower = currentStep.toLowerCase();
  if (stepLower === "lpj") {
    return 3; // Pembuatan LPJ
  }
  if (stepLower === "finance" || status === "diproses") {
    return 2; // Pencairan Finance
  }
  if (stepLower === "bendahara") {
    return 1; // Bendahara
  }

  return 0; // Default: Manager Divisi
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

interface ProgressLineChecklistProps {
  item: PengajuanDanaItem;
}

export function ProgressLineChecklist({ item }: ProgressLineChecklistProps) {
  const isRejected = item.currentStatus === "ditolak";
  const currentStepIndex = getStepIndex(item.currentStep, item.currentStatus);

  const stepsList: { key: StepType; label: string; sublabel: string }[] = [
    { key: "manager", label: "Manager", sublabel: "Persetujuan Manager Divisi" },
    { key: "bendahara", label: "Bendahara", sublabel: "Verifikasi & Approval Yayasan" },
    { key: "finance", label: "Pencairan Finance", sublabel: "Transfer & Pencairan Dana" },
    { key: "lpj", label: "Pembuatan LPJ", sublabel: "Laporan Pertanggungjawaban" },
    { key: "selesai", label: "Selesai", sublabel: "Verifikasi LPJ oleh Finance" },
  ];

  return (
    <Card
      variant="secondary"
      title="Progress & Workflow Approval"
      leftIcon={<Clock className="w-3.5 h-3.5 text-slate-400" />}
      className="p-3.5 space-y-3"
      headerClassName="pb-2.5"
    >
      <div className="space-y-0 pt-1">
        {stepsList.map((step, idx) => {
          const stepRecord = item.riwayatStep?.find((r) => r.step === step.key);
          const isCompleted = stepRecord
            ? stepRecord.status === "disetujui" || stepRecord.status === "selesai"
            : idx < currentStepIndex && !isRejected;
          const isCurrent = !stepRecord && idx === currentStepIndex && !isRejected;
          const isStepRejected = stepRecord?.status === "ditolak" || (isRejected && idx === currentStepIndex);
          const isLast = idx === stepsList.length - 1;

          return (
            <div key={idx} className="flex items-stretch gap-3">
              {/* Icon & Vertical Line Column */}
              <div className="flex flex-col items-center shrink-0 w-5">
                {/* Circle Indicator */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-all shrink-0 mt-0.5",
                    isCompleted && "bg-green-500 text-white ring-2 ring-emerald-100 dark:ring-emerald-950",
                    isCurrent && "bg-orange-500 text-white ring-4 ring-orange-500/20 animate-pulse",
                    isStepRejected && "bg-rose-500 text-white ring-2 ring-rose-100 dark:ring-rose-950",
                    !isCompleted && !isCurrent && !isStepRejected && "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : isStepRejected ? (
                    <X className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Bottom line segment connecting to next step */}
                {!isLast && (
                  <div
                    className={cn(
                      "w-[2px] flex-1 my-1 transition-colors min-h-[16px]",
                      isCompleted ? "bg-emerald-500/80" : "bg-slate-200 dark:bg-slate-700/80"
                    )}
                  />
                )}
              </div>

              {/* Step Label & Detail */}
              <div className="flex-1 min-w-0 pt-0.5 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs leading-5 text-slate-800 dark:text-slate-100">
                    {step.label}
                  </span>
                  {isStepRejected ? (
                    <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                      <X className="w-2.5 h-2.5" /> Ditolak
                    </span>
                  ) : isCompleted ? (
                    <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Selesai
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[9px] font-bold text-orange-500 animate-pulse">
                      Menunggu Approval
                    </span>
                  ) : null}
                </div>

                {/* Sublabel / Description */}
                {step.sublabel && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                    {step.sublabel}
                  </p>
                )}

                {/* Metadata from riwayatStep (diupdateOleh, tanggal, catatan) */}
                {stepRecord && (
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                      {stepRecord.diupdateOleh && (
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {stepRecord.diupdateOleh}
                        </span>
                      )}
                      {stepRecord.diupdateOleh && stepRecord.tanggalUpdate && <span>•</span>}
                      {stepRecord.tanggalUpdate && (
                        <span>{formatDate(stepRecord.tanggalUpdate)}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

