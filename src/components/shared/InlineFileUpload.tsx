"use client";

import React, { useRef } from "react";
import { Upload, ExternalLink, X } from "lucide-react";

export interface InlineFileUploadProps {
  /** URL file yang sudah terunggah (mode preview) */
  fileUrl?: string;
  /** Nama file yang ditampilkan di badge preview */
  fileName?: string;
  /** Format file yang diterima — default: PDF, JPG, PNG */
  accept?: string;
  /** Label teks tombol upload */
  uploadLabel?: string;
  /** Callback saat user memilih file baru */
  onUpload: (file: File) => void;
  /** Callback saat user menghapus file yang sudah ada */
  onRemove: () => void;
}

/**
 * Komponen upload file ringkas untuk digunakan di dalam sel tabel.
 *
 * - Jika `fileUrl` tersedia: tampilkan link preview + tombol hapus.
 * - Jika tidak: tampilkan tombol Upload (dashed border) yang memicu file picker.
 * - Mendukung paste clipboard (`Ctrl+V`) melalui prop `onUpload`.
 */
export function InlineFileUpload({
  fileUrl,
  fileName,
  accept = ".pdf,.jpg,.jpeg,.png,application/pdf,image/*",
  uploadLabel = "Upload",
  onUpload,
  onRemove,
}: InlineFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    // Reset agar file yang sama bisa dipilih ulang
    e.target.value = "";
  };

  /** Ambil file pertama dari clipboard saat Ctrl+V */
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          onUpload(file);
        }
        break;
      }
    }
  };

  // Mode preview: file sudah ada
  if (fileUrl && fileName) {
    return (
      <div className="flex items-center gap-1 min-w-[120px]">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={fileName}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-semibold transition-colors truncate max-w-[100px]"
        >
          <ExternalLink className="w-3 h-3 shrink-0" />
          <span className="truncate">{fileName}</span>
        </a>
        <button
          type="button"
          onClick={onRemove}
          title="Hapus bukti"
          className="p-0.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Mode upload: belum ada file
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <button
        ref={buttonRef}
        type="button"
        onClick={() => inputRef.current?.click()}
        onPaste={handlePaste}
        onMouseEnter={() => buttonRef.current?.focus()}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-dashed border-slate-300 dark:border-slate-700 hover:border-primary hover:bg-primary/5 focus:border-primary focus:bg-primary/5 focus:outline-none text-slate-400 hover:text-primary focus:text-primary text-[10px] font-medium transition-all cursor-pointer whitespace-nowrap"
        title="Klik untuk pilih file, atau Ctrl+V untuk tempel dari clipboard"
      >
        <Upload className="w-3 h-3" />
        <span>{uploadLabel}</span>
      </button>
    </>
  );
}
