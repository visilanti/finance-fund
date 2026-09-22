"use client";

import React, { useState, useEffect } from "react";
import { TaskModal } from "@/components/ui/modal/TaskModal";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { Button } from "@/components/ui/Button";
import { Check, RotateCcw, AlertCircle, Info } from "lucide-react";

export interface ModalTtdProps {
  isOpen: boolean;
  onClose: () => void;
  currentTtdUrl?: string;
  onSave: (newTtdUrl: string) => void;
  onResetDefault?: () => void;
}

export function ModalTtd({
  isOpen,
  onClose,
  currentTtdUrl = "/images/signature.png",
  onSave,
  onResetDefault,
}: ModalTtdProps) {
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state saat modal dibuka / ditutup
  useEffect(() => {
    if (!isOpen) {
      setSelectedPreviewUrl(null);
      setError(null);
    }
  }, [isOpen]);

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    setError(null);

    const validTypes = [
      "image/png",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Format file tidak didukung. Harap gunakan gambar PNG atau JPG.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimal ukuran adalah 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedPreviewUrl(result);
      }
    };
    reader.onerror = () => {
      setError("Gagal memproses file gambar. Silakan coba kembali.");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (selectedPreviewUrl) {
      onSave(selectedPreviewUrl);
      onClose();
    }
  };

  return (
    <TaskModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ubah Spesimen Tanda Tangan Digital"
      size="md"
      actions={
        <div className="flex items-center justify-between w-full">
          <div>
            {onResetDefault && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onResetDefault();
                  onClose();
                }}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Reset ke Default
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!selectedPreviewUrl}
              onClick={handleSave}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Simpan Spesimen
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Upload Zone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Unggah Berkas Tanda Tangan Baru
          </label>
          <FileUploadZone
            label="Klik untuk pilih file atau seret file ke sini"
            sublabel="Format PNG (Maks. 2 MB) atau Ctrl+V untuk tempel dari clipboard"
            accept="image/png"
            multiple={false}
            previewUrl={selectedPreviewUrl}
            onClearPreview={() => setSelectedPreviewUrl(null)}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Panduan & Info */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Info className="w-3.5 h-3.5 text-primary" />
            <span>Petunjuk Spesimen TTD:</span>
          </div>
          <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-500 dark:text-slate-400">
            <li>Disarankan menggunakan gambar latar belakang transparan (PNG).</li>
            <li>Gunakan tanda tangan dengan tinta warna hitam atau biru gelap yang jelas.</li>
            <li>Spesimen ini akan otomatis disematkan pada setiap lembar pengesahan pengajuan.</li>
          </ul>
        </div>
      </div>
    </TaskModal>
  );
}
