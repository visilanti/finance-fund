"use client";

import React from "react";
import { CheckSquare } from "lucide-react";
import { Modal, ModalSize } from "./Modal";
import { cn } from "@/lib/utils";

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  taskCode?: string;
  badgeLabel?: string;
  badgeVariant?: "warning" | "info" | "success" | "danger" | "neutral";
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
  badgeLabel,
  badgeVariant = "info",
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
      className={cn("flex flex-col max-h-[90vh]", className)}
    >
      {/* Task Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 pr-12">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            </div>
            {badgeLabel && (
              <span
                className={cn(
                  "inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                  badgeVariants[badgeVariant]
                )}
              >
                {badgeLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Task Body (Scrollable Content / Form Inputs) */}
      <div className="p-6 overflow-y-auto space-y-4 flex-1">{children}</div>

      {/* Task Footer Actions */}
      {actions && (
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl shrink-0">
          {actions}
        </div>
      )}
    </Modal>
  );
};
