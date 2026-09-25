"use client";

import React, { useState, useEffect } from "react";
import { TaskModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/utils";
import { InfoLPJ, LPJBase } from "../types";
import { CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";

export interface LPJActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    status: "disetujui" | "revisi";
    catatan: string;
  }) => Promise<void> | void;
  actionType: "approve" | "revisi" | null;
  item: InfoLPJ | LPJBase | null;
  isLoading?: boolean;
}

export function LPJActionModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  item,
  isLoading = false,
}: LPJActionModalProps) {
  const [catatan, setCatatan] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCatatan("");
      setErrorText("");
    }
  }, [isOpen]);

  if (!item || !actionType) return null;

  const isApprove = actionType === "approve";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isApprove && !catatan.trim()) {
      setErrorText(
        "Catatan / alasan revisi wajib diisi agar divisi dapat memperbaiki berkas LPJ."
      );
      return;
    }

    await onConfirm({
      status: isApprove ? "disetujui" : "revisi",
      catatan: catatan.trim(),
    });
  };

  return (
    <TaskModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isApprove
          ? "Setujui Laporan Pertanggungjawaban (LPJ)"
          : "Minta Revisi Berkas LPJ"
      }
      description={
        isApprove
          ? "Jika anda menyetujui, saldo dan transaksi akan diverifikasi sebagai sah."
          : "Berikan rincian koreksi agar divisi pengaju dapat melakukan perbaikan."
      }
      size="md"
      isLoading={isLoading}
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
            form="lpj-action-form"
            size="md"
            isLoading={isLoading}
            className={
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-700 text-white border-none cursor-pointer"
                : "bg-amber-600 hover:bg-amber-700 text-white border-none cursor-pointer"
            }
          >
            {isApprove ? "Ya, Setujui LPJ" : "Kirim Permintaan Revisi"}
          </Button>
        </>
      }
    >
      <form id="lpj-action-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Ringkasan Item LPJ */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Nomor Pengajuan
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {item.noPengajuan}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Jenis Pengajuan
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {item.jenis}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Saldo Awal (Dana Cair)
            </span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">
              {formatIDR(item.saldoAwal)}
            </span>
          </div>
          {item.saldoAkhir !== undefined && (
            <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Saldo Akhir / SiLPA
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatIDR(item.saldoAkhir)}
              </span>
            </div>
          )}
        </div>

        {/* Input Catatan Verifikator */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Catatan Verifikator Finance{" "}
            {!isApprove && <span className="text-rose-500">*</span>}
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
                ? "Opsional: Tambahkan catatan pengesahan atau verifikasi jika ada..."
                : "Wajib: Tuliskan bagian kwitansi atau bukti yang perlu direvisi oleh divisi..."
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

