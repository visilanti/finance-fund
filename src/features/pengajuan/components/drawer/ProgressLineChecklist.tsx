import React from "react";
import { Clock, Check, X, GitFork } from "lucide-react";
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

export const REIMB_STEP_ROLE_LABEL_MAP: Record<string, string> = {
  manager: "Manager Divisi",
  finance: "Finance Reviewer",
  bendahara: "Bendahara Yayasan",
  selesai: "Selesai",
};

export function getStepIndex(
  currentStep: string = "",
  status: string = "",
  isReimbursement: boolean = false
): number {
  const statusLower = status?.toLowerCase() || "";
  const stepLower = currentStep?.toLowerCase() || "";

  if (statusLower === "disetujui" || statusLower === "selesai" || stepLower === "selesai") {
    return isReimbursement ? 3 : 4; // Selesai
  }

  if (isReimbursement) {
    if (stepLower === "bendahara") {
      return 2; // Bendahara (Approval Final & Pencairan)
    }
    if (stepLower === "finance") {
      return 1; // Finance Reviewer
    }
    return 0; // Default: Manager Divisi
  }

  // Alur Reguler (RKA & Insidental)
  if (stepLower === "lpj") {
    return 3; // Pembuatan LPJ
  }
  if (stepLower === "finance" || statusLower === "diproses") {
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
  const isReimbursement = item.jenis === "Reimbursement";
  const isRejected = item.currentStatus === "ditolak";
  const currentStepIndex = getStepIndex(item.currentStep, item.currentStatus, isReimbursement);

  const regularSteps: { key: StepType; label: string; sublabel: string }[] = [
    { key: "manager", label: "Manager", sublabel: "Persetujuan Manager Divisi" },
    { key: "bendahara", label: "Bendahara", sublabel: "Verifikasi & Approval Yayasan" },
    { key: "finance", label: "Pencairan Finance", sublabel: "Transfer & Pencairan Dana" },
    { key: "lpj", label: "Pembuatan LPJ", sublabel: "Laporan Pertanggungjawaban" },
    { key: "selesai", label: "Selesai", sublabel: "Verifikasi LPJ oleh Finance" },
  ];

  const reimbursementSteps: { key: StepType; label: string; sublabel: string }[] = [
    { key: "manager", label: "Manager", sublabel: "Persetujuan Kelayakan Operasional" },
    { key: "finance", label: "Finance Reviewer", sublabel: "Verifikasi Bukti Kwitansi & Nota LPJ" },
    { key: "bendahara", label: "Bendahara", sublabel: "Approval Final & Pencairan Dana" },
    { key: "selesai", label: "Selesai", sublabel: "Pencairan Selesai & LPJ Terpenuhi" },
  ];

  const stepsList = isReimbursement ? reimbursementSteps : regularSteps;

  // Evaluasi Status Paralel Khusus Reimbursement
  const managerRecord = item.riwayatStep?.find((r) => r.step === "manager");
  const financeRecord = item.riwayatStep?.find((r) => r.step === "finance");
  const bendaharaRecord = item.riwayatStep?.find((r) => r.step === "bendahara");
  const selesaiRecord = item.riwayatStep?.find((r) => r.step === "selesai");

  const isManagerApproved = managerRecord?.status === "disetujui" || managerRecord?.status === "selesai";
  const isManagerRejected = managerRecord?.status === "ditolak" || (isRejected && item.currentStep === "manager");

  const isFinanceApproved = financeRecord?.status === "disetujui" || financeRecord?.status === "selesai";
  const isFinanceRejected = financeRecord?.status === "ditolak" || (isRejected && item.currentStep === "finance");

  const isBothParallelApproved = isManagerApproved && isFinanceApproved;

  const isBendaharaApproved = bendaharaRecord?.status === "disetujui" || bendaharaRecord?.status === "selesai";
  const isBendaharaRejected = bendaharaRecord?.status === "ditolak" || (isRejected && item.currentStep === "bendahara");

  const isSelesai =
    item.currentStatus === "disetujui" ||
    item.currentStatus === "selesai" ||
    item.currentStep === "selesai" ||
    selesaiRecord?.status === "selesai" ||
    isBendaharaApproved;

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
          const isLast = idx === stepsList.length - 1;

          let isCompleted = false;
          let isCurrent = false;
          let isStepRejected = false;
          let customStatusBadge: string | null = null;

          if (isReimbursement) {
            if (step.key === "manager") {
              isCompleted = isManagerApproved;
              isStepRejected = isManagerRejected;
              isCurrent = !isManagerApproved && !isManagerRejected && !isFinanceRejected && !isBendaharaRejected && !isSelesai;
              if (isCurrent) {
                customStatusBadge = "Menunggu Review";
              }
            } else if (step.key === "finance") {
              isCompleted = isFinanceApproved;
              isStepRejected = isFinanceRejected;
              isCurrent = !isFinanceApproved && !isFinanceRejected && !isManagerRejected && !isBendaharaRejected && !isSelesai;
              if (isCurrent) {
                customStatusBadge = "Menunggu Review";
              }
            } else if (step.key === "bendahara") {
              isCompleted = isBendaharaApproved;
              isStepRejected = isBendaharaRejected;
              isCurrent = isBothParallelApproved && !isBendaharaApproved && !isBendaharaRejected && !isSelesai;
              if (isCurrent) {
                customStatusBadge = "Menunggu Approval & Pencairan";
              } else if (!isBothParallelApproved && !isManagerRejected && !isFinanceRejected) {
                if (isManagerApproved && !isFinanceApproved) {
                  customStatusBadge = "Menunggu Review Finance";
                } else if (!isManagerApproved && isFinanceApproved) {
                  customStatusBadge = "Menunggu Review Manager";
                } else {
                  customStatusBadge = "Menunggu Review Manager & Finance";
                }
              }
            } else if (step.key === "selesai") {
              isCompleted = isSelesai;
              isCurrent = false;
              isStepRejected = false;
            }
          } else {
            // Alur Reguler (RKA & Insidental)
            isStepRejected =
              stepRecord?.status === "ditolak" || (isRejected && idx === currentStepIndex);
            isCompleted =
              !isStepRejected &&
              (stepRecord
                ? stepRecord.status === "disetujui" || stepRecord.status === "selesai"
                : idx < currentStepIndex && !isRejected);
            isCurrent =
              !isCompleted &&
              !isStepRejected &&
              (stepRecord
                ? stepRecord.status === "menunggu" || stepRecord.status === "diproses" || idx === currentStepIndex
                : idx === currentStepIndex && !isRejected);
          }

          const isParallelStep = isReimbursement && (step.key === "manager" || step.key === "finance");

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
                  ) : isParallelStep ? (
                    <GitFork className="w-3 h-3" />
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
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs leading-5 text-slate-800 dark:text-slate-100">
                      {step.label}
                    </span>
                  </div>

                  {isStepRejected ? (
                    <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                      <X className="w-2.5 h-2.5" /> Ditolak
                    </span>
                  ) : isCompleted ? (
                    <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Disetujui
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[9px] font-bold text-orange-500 animate-pulse">
                      {customStatusBadge || "Menunggu Approval"}
                    </span>
                  ) : customStatusBadge ? (
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 italic">
                      {customStatusBadge}
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

