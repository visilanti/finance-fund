"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/utils";
import { PengajuanDanaItem } from "@/features/pengajuan/types";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: { status: "disetujui" | "ditolak"; catatan: string }) => Promise<void> | void;
  actionType: "approve" | "reject" | null;
  item: PengajuanDanaItem | null;
  isLoading?: boolean;
}

export function ApprovalActionModal({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  item,
  isLoading = false,
}: ApprovalActionModalProps) {
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
      setErrorText("Catatan / alasan penolakan wajib diisi.");
      return;
    }

    await onConfirm({
      status: isApprove ? "disetujui" : "ditolak",
      catatan: catatan.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnBackdropClick={!isLoading}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Header Icon & Title */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl shrink-0 ${
              isApprove
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
                : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60"
            }`}
          >
            {isApprove ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {isApprove ? "Setujui Pengajuan Dana" : "Tolak Pengajuan Dana"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isApprove
                ? "Apakah Anda yakin ingin menyetujui pengajuan dana ini? Status pengajuan akan diperbarui."
                : "Harap berikan alasan penolakan agar pemohon dapat melakukan penyesuaian."}
            </p>
          </div>
        </div>

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

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
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
        </div>
      </form>
    </Modal>
  );
}
