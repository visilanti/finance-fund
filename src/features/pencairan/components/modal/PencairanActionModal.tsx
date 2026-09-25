"use client";

import React, { useState, useEffect } from "react";
import { TaskModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/Button";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { formatIDR } from "@/lib/utils";
import { PencairanItem, PencairanPayload } from "../../types";
import { CreditCard, AlertCircle, Copy, Check, Calendar, FileText } from "lucide-react";

export interface PencairanActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: PencairanPayload) => Promise<void> | void;
  item: PencairanItem | null;
  isLoading?: boolean;
}

export function PencairanActionModal({
  isOpen,
  onClose,
  onConfirm,
  item,
  isLoading = false,
}: PencairanActionModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tanggalPencairan, setTanggalPencairan] = useState<string>("");
  const [catatanFinance, setCatatanFinance] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  // Initialize form state when item or modal opens
  useEffect(() => {
    if (isOpen && item) {
      setSelectedFile(null);
      setPreviewUrl(item.buktiTransferUrl || null);
      // Default to today's date in YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];
      setTanggalPencairan(item.tanggalPencairan || today);
      setCatatanFinance(item.catatanFinance || "");
      setErrorText("");
      setIsCopied(false);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleCopyRekening = () => {
    if (item.rekeningTujuan?.nomorRekening) {
      navigator.clipboard.writeText(item.rekeningTujuan.nomorRekening);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    setSelectedFile(file);

    // Create preview URL if it's an image
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    setErrorText("");
  };

  const handleClearPreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi: Bukti transfer wajib diunggah
    if (!selectedFile && !previewUrl && !item.buktiTransferUrl) {
      setErrorText("Bukti transfer wajib diunggah untuk menyelesaikan pencairan.");
      return;
    }

    if (!tanggalPencairan) {
      setErrorText("Tanggal pencairan / transfer wajib diisi.");
      return;
    }

    // Default mock URL jika file lokal
    const finalBuktiUrl =
      previewUrl ||
      item.buktiTransferUrl ||
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80";

    const payload: PencairanPayload = {
      id: item.id,
      buktiTransferUrl: finalBuktiUrl,
      buktiTransferNama: selectedFile?.name || item.buktiTransferNama || "bukti-transfer.png",
      tanggalPencairan,
      nominalPencairan: item.nominalDiterima || item.nominalPengajuan,
      catatanFinance: catatanFinance.trim(),
    };

    await onConfirm(payload);
  };

  const nominalCair = item.nominalDiterima || item.nominalPengajuan;

  return (
    <TaskModal
      isOpen={isOpen}
      onClose={onClose}
      title="Pencairan Dana & Upload Bukti Transfer"
      description="Unggah bukti transfer perbankan untuk menyelesaikan pencairan dana pengajuan ini."
      size="lg"
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
            size="md"
            isLoading={isLoading}
            className="bg-primary hover:bg-primary-dark text-white border-none cursor-pointer"
          >
            Kirim Bukti Transfer
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Ringkasan Rekening Penerima & Nominal yang Harus Ditransfer */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/50">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium">Nomor Pengajuan</span>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {item.kode}
              </div>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium">Nominal yang Dicairkan</span>
              <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatIDR(nominalCair)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Uraian Kegiatan</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                {item.kegiatan}
              </p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Divisi Pengaju</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {item.divisi}
              </p>
            </div>
          </div>

          {/* Rekening Card Info dengan tombol copy */}
          <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {item.rekeningTujuan?.namaBank || "Bank Transfer"}
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {item.rekeningTujuan?.nomorRekening || "-"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                a.n. {item.rekeningTujuan?.namaPemilikRekening || item.divisi}
              </p>
            </div>

            {item.rekeningTujuan?.nomorRekening && (
              <button
                type="button"
                onClick={handleCopyRekening}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
                title="Salin Nomor Rekening"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Rekening</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Input Tanggal Pencairan */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Tanggal Pencairan / Transfer <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={tanggalPencairan}
              onChange={(e) => {
                setTanggalPencairan(e.target.value);
                if (errorText) setErrorText("");
              }}
              required
              className="w-full text-xs p-2.5 pl-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Upload Bukti Transfer */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Upload Bukti Transfer Bank <span className="text-rose-500">*</span>
          </label>
          <FileUploadZone
            label="Tarik & Lepas Bukti Transfer di Sini"
            sublabel="Format Gambar JPG, PNG, atau PDF — atau tempel (Ctrl+V) langsung"
            accept="image/*,application/pdf"
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onClearPreview={handleClearPreview}
            files={selectedFile ? [selectedFile] : []}
            onRemoveFile={handleClearPreview}
          />
        </div>

        {/* Catatan / Keterangan Transfer */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between">
            <span>Catatan / Keterangan Pencairan (Opsional)</span>
          </label>
          <textarea
            rows={2}
            value={catatanFinance}
            onChange={(e) => setCatatanFinance(e.target.value)}
            placeholder="Contoh: Ditransfer via KlikBCA Bisnis No. Referensi #TRF-992019"
            className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Pesan Error jika ada */}
        {errorText && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="font-medium">{errorText}</p>
          </div>
        )}
      </form>
    </TaskModal>
  );
}

// Alias export untuk kompatibilitas jika dibutuhkan
export const ModalAction = PencairanActionModal;
