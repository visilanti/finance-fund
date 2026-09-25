"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/utils";
import { PengajuanDanaItem } from "@/features/pengajuan/types";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Input } from "@/components/ui/Input";
import { TaskModal } from "@/components/ui/modal";

export interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    status: "disetujui" | "ditolak";
    catatan: string;
    danaDisetujui?: number;
  }) => Promise<void> | void;
  actionType: "approve" | "reject" | null;
  item: PengajuanDanaItem | null;
  isLoading?: boolean;
  currentRole?: string;
}

export function ApprovalActionModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  item,
  isLoading = false,
  currentRole: currentRoleProp,
}: ApprovalActionModalProps) {
  const [catatan, setCatatan] = useState("");
  const [danaDisetujui, setDanaDisetujui] = useState("");
  const [errorText, setErrorText] = useState("");

  const storeRole = useSidebarStore((state) => state.currentRole);
  const activeRole = currentRoleProp || storeRole;

  useEffect(() => {
    if (isOpen) {
      setCatatan("");
      setDanaDisetujui("");
      setErrorText("");
    }
  }, [isOpen]);

  if (!item || !actionType) return null;

  const isApprove = actionType === "approve";
  const isBendaharaStep = activeRole === "bendahara" || item.currentStep === "bendahara";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isApprove && !catatan.trim()) {
      setErrorText("Catatan / alasan penolakan wajib diisi.");
      return;
    }

    const parsedDana = danaDisetujui ? Number(danaDisetujui) : undefined;

    await onConfirm({
      status: isApprove ? "disetujui" : "ditolak",
      catatan: catatan.trim(),
      danaDisetujui: isApprove && isBendaharaStep ? parsedDana : undefined,
    });
  };

  return (
    <TaskModal
      isOpen={isOpen}
      onClose={onClose}
      title={isApprove ? "Setujui Pengajuan Dana" : "Tolak Pengajuan Dana"}
      description={
        isApprove
          ? "Apakah Anda yakin ingin menyetujui pengajuan dana ini?"
          : "Harap berikan alasan penolakan agar pemohon dapat melakukan penyesuaian."
      }
      size="md"
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            size="md"
            isLoading={isLoading}
            className={
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-none cursor-pointer"
                : "bg-rose-600 hover:bg-rose-700 text-white border-none cursor-pointer"
            }
          >
            {isApprove ? "Ya, Setujui" : "Ya, Tolak Pengajuan"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Ringkasan Item Pengajuan */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nomor Kode</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {item.kode}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Kegiatan / Uraian</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
              {item.kegiatan}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Divisi</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {item.divisi}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nominal Pengajuan</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">
              {formatIDR(item.nominalPengajuan)}
            </span>
          </div>
        </div>

        {/* Form dana yang disetujui jika disetujui & role / step = bendahara */}
        {isApprove && isBendaharaStep && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              Dana yang Disetujui (Perbarui jika berbeda)
            </label>
            <Input
              variant="currency"
              value={danaDisetujui || item.nominalPengajuan}
              onChange={(e) => setDanaDisetujui(e.target.value)}
              placeholder="Opsional: Masukkan jumlah dana yang disetujui..."
            />
          </div>
        )}

        {/* Input Catatan Verifikator */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Catatan Verifikator {!isApprove && <span className="text-rose-500">*</span>}
          </label>
          <textarea
            rows={3}
            value={catatan}
            onChange={(e) => {
              setCatatan(e.target.value);
              if (errorText) setErrorText("");
            }}
            placeholder={
              isApprove
                ? "Opsional: Tambahkan catatan persetujuan jika ada instruksi khusus..."
                : "Wajib: Tuliskan alasan penolakan atau instruksi perbaikan..."
            }
            className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
          />
          {errorText && (
            <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {errorText}
            </p>
          )}
        </div>
      </form>
    </TaskModal>
  );
}
