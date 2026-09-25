"use client";

import React from "react";
import { Modal, ModalSize } from "./Modal";
import { cn } from "@/lib/utils";

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  taskCode?: string;
  description?: string;
  size?: ModalSize;
  children: React.ReactNode;
  /**
   * Slot untuk tombol aksi di footer (misal: Batal, Simpan Draf, Kirim).
   */
  actions?: React.ReactNode;
  /**
   * Jika true, disable tombol aksi dan tombol close saat sedang proses submit.
   */
  isLoading?: boolean;
  /**
   * Khusus Task Modal: Secara default DIKUNCI (false),
   * sehingga tidak bisa ditutup secara tidak sengaja melalui klik backdrop.
   */
  closeOnBackdropClick?: boolean;
  /**
   * Mencegah modal tertutup tidak sengaja dengan tombol Escape saat mengisi task/form.
   * Default: false
   */
  closeOnEsc?: boolean;
  className?: string;
}

const badgeVariants = {
  warning:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
  info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
  danger:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
  neutral:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
};

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  title,
  taskCode,
  description,
  size = "lg",
  children,
  actions,
  isLoading = false,
  // DIKUNCI: Secara default TIDAK BISA keluar lewat klik backdrop
  closeOnBackdropClick = false,
  closeOnEsc = false,
  className,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      closeOnBackdropClick={closeOnBackdropClick}
      closeOnEsc={closeOnEsc && !isLoading}
      showCloseButton={!isLoading}
      className={cn(
        "flex flex-col max-h-[85vh] sm:max-h-[88vh] overflow-hidden",
        className
      )}
    >
      {/* Sticky Task Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 pr-12">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              {taskCode && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                  {taskCode}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Task Body (Scrollable Content / Form Inputs) */}
      <div className="p-6 overflow-y-auto space-y-4 flex-1 min-h-0">
        {children}
      </div>

      {/* Sticky Task Footer Actions */}
      {actions && (
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xs shrink-0">
          {actions}
        </div>
      )}
    </Modal>
  );
};
