"use client";

import React from "react";
import { RKAStatusPencairan } from "../types";
import { cn } from "@/lib/utils";

interface StatusIndicatorDotProps {
  status?: RKAStatusPencairan;
  catatan?: string | null;
  className?: string;
  size?: "sm" | "md";
}

/**
 * Status Indicator Dot sesuai anotasi Figma (Node 130:1108):
 * - hijau : dicairkan (#16a34a)
 * - kuning : belum_cair (#eab308)
 * - grey   : hangus (#9ca3af)
 */
export function StatusIndicatorDot({
  status,
  catatan,
  className,
  size = "sm",
}: StatusIndicatorDotProps) {
  if (!status) return null;

  let colorClass = "bg-slate-400";
  let label = "Hangus";

  if (status === "dicairkan") {
    colorClass = "bg-[#16a34a] shadow-[0_0_6px_rgba(22,163,74,0.4)]";
    label = "Sudah Dicairkan";
  } else if (status === "belum_cair") {
    colorClass = "bg-[#eab308] shadow-[0_0_6px_rgba(234,179,8,0.4)]";
    label = "Belum Dicairkan";
  } else if (status === "hangus") {
    colorClass = "bg-[#9ca3af]";
    label = "Hangus (Terlewat)";
  }

  const sizeClass = size === "md" ? "w-2.5 h-2.5" : "w-1.5 h-1.5";

  return (
    <span
      title={catatan ? `${label}: ${catatan}` : label}
      className={cn(
        "inline-block rounded-full shrink-0 transition-transform hover:scale-125 cursor-help",
        sizeClass,
        colorClass,
        className
      )}
    />
  );
}
