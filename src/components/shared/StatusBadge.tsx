import React from "react";
import { Badge, BadgeVariant, BadgeType } from "@/components/ui/Badge";

export interface StatusBadgeProps {
  status?: "disetujui" | "ditolak" | "menunggu" | "diproses" | string;
  label?: string;
  variant?: BadgeVariant;
  type?: BadgeType;
  dot?: boolean;
  className?: string;
}

const STATUS_MAP: Record<string, { variant: BadgeVariant; defaultLabel: string }> = {
  disetujui: { variant: "success", defaultLabel: "Disetujui" },
  ditolak: { variant: "error", defaultLabel: "Ditolak" },
  menunggu: { variant: "warning", defaultLabel: "Proses Approval" },
  diproses: { variant: "info", defaultLabel: "Diproses Finance" },
};

export function StatusBadge({
  status = "",
  label,
  variant,
  type = "soft",
  dot = false,
  className,
}: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const mapped = STATUS_MAP[normalized];

  const resolvedVariant = variant || mapped?.variant || "neutral";
  const resolvedLabel = label || mapped?.defaultLabel || status;

  return (
    <Badge variant={resolvedVariant} type={type} dot={dot} className={className}>
      {resolvedLabel}
    </Badge>
  );
}
