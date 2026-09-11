import React from "react";
import { Paperclip, Trash2, FileText, Image as ImageIcon, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileItem {
  id?: string;
  name: string;
  size?: number | string;
  url?: string;
  type?: string;
}

export interface FileUploadZoneProps {
  label?: string;
  sublabel?: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect?: (files: FileList | null) => void;
  previewUrl?: string | null;
  onClearPreview?: () => void;
  files?: Array<File | FileItem>;
  onRemoveFile?: (index: number) => void;
  className?: string;
}

function formatFileSize(bytes?: number | string): string {
  if (!bytes) return "";
  if (typeof bytes === "string") return bytes;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(filename: string, fileType?: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (fileType?.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) {
    return <ImageIcon className="w-4 h-4 text-emerald-500 shrink-0" />;
  }
  if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext) || fileType?.includes("pdf")) {
    return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
  }
  return <File className="w-4 h-4 text-slate-400 shrink-0" />;
}

export function FileUploadZone({
  label = "Tarik & Lepas File di Sini",
  sublabel = "Mendukung format PDF, XLSX, atau ZIP (Maksimal 10MB)",
  accept,
  multiple = false,
  onFileSelect,
  previewUrl,
  onClearPreview,
  files = [],
  onRemoveFile,
  className,
}: FileUploadZoneProps) {
  if (previewUrl) {
    return (
      <div
        className={cn(
          "relative border-2 border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center bg-white dark:bg-slate-900 shadow-subtle group",
          className
        )}
      >
        <div className="relative flex flex-col items-center justify-center py-2">
          <div className="p-2 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700 w-full flex items-center justify-center min-h-[90px]">
            <img
              src={previewUrl}
              alt="Preview Tanda Tangan"
              className="max-h-24 object-contain mx-auto transition-transform group-hover:scale-105"
            />
          </div>

          {onClearPreview && (
            <button
              type="button"
              onClick={onClearPreview}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors z-20 cursor-pointer shadow-xs"
              title="Hapus / Ganti TTD"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:bg-slate-50/50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer group"
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => onFileSelect?.(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <Paperclip className="w-6 h-6 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</p>
        {sublabel && <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">{sublabel}</p>}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            File Terunggah ({files.length})
          </p>
          <div className="space-y-1.5">
            {files.map((file, idx) => {
              const fileName = file.name;
              const fileSize = formatFileSize("size" in file ? file.size : undefined);
              const fileType = "type" in file ? file.type : undefined;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {getFileIcon(fileName, fileType)}
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate" title={fileName}>
                      {fileName}
                    </span>
                    {fileSize && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                        ({fileSize})
                      </span>
                    )}
                  </div>

                  {onRemoveFile && (
                    <button
                      type="button"
                      onClick={() => onRemoveFile(idx)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
                      title="Hapus file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
