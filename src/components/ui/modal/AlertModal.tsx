"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "../Button";
import { cn } from "@/lib/utils";

export type AlertType = "success" | "danger" | "warning" | "info";

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: AlertType;
  title: string;
  description: string | React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  closeOnBackdropClick?: boolean;
}

const alertConfig: Record<
  AlertType,
  { icon: React.ElementType; iconBox: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    iconBox: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  danger: {
    icon: AlertCircle,
    iconBox: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    iconBox: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    iconBox: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
};

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  type = "info",
  title,
  description,
  buttonText = "Mengerti",
  onButtonClick,
  closeOnBackdropClick = true,
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  const handleAction = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdropClick={closeOnBackdropClick}
    >
      <div className="p-6 text-center flex flex-col items-center">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center border mb-4",
            config.iconBox,
            config.iconColor
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

        <Button
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleAction}
        >
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};
