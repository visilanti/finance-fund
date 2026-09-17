"use client";

import React from "react";
import { AlertTriangle, HelpCircle, Trash2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { cn } from "@/lib/utils";

export type ConfirmVariant = "danger" | "primary" | "warning";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
}

const variantStyles: Record<
  ConfirmVariant,
  { icon: React.ElementType; iconColor: string; iconBg: string }
> = {
  danger: {
    icon: Trash2,
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800",
  },
  primary: {
    icon: HelpCircle,
    iconColor: "text-primary",
    iconBg: "bg-primary-light border-primary-border dark:bg-primary-darkLight",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
  },
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "primary",
  isLoading = false,
}) => {
  const current = variantStyles[variant];
  const Icon = current.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnBackdropClick={!isLoading}
      closeOnEsc={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="p-6 text-center flex flex-col items-center">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center border mb-4",
            current.iconBg,
            current.iconColor
          )}
        >
          <Icon className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>

        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          {description}
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            {cancelLabel}
          </Button>

          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="md"
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
