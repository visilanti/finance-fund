"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MatrixRKALegendProps {
  tahun: number;
  unit?: string;
  className?: string;
}

/**
 * Bar Legenda Status Pencairan di bagian bawah tabel matriks RKA.
 * Sesuai desain referensi visualisasi & anotasi Figma.
 */
export function MatrixRKALegend({
  tahun,
  unit = "Divisi IT",
  className,
}: MatrixRKALegendProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 rounded-b-xl",
        className
      )}
    >
      {/* Legend Items */}
      <div className="flex flex-wrap items-center gap-5">
        {/* Sudah Dicairkan */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16a34a] shadow-[0_0_6px_rgba(22,163,74,0.4)]" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Sudah Dicairkan
          </span>
        </div>

        {/* Belum Dicairkan */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#eab308] shadow-[0_0_6px_rgba(234,179,8,0.4)]" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Belum Dicairkan
          </span>
        </div>

        {/* Hangus */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#9ca3af]" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Hangus (Terlewat)
          </span>
        </div>
      </div>

      {/* Tahun Anggaran & Unit */}
      <div className="text-slate-400 dark:text-slate-500 font-medium text-[11px] sm:text-xs">
        Tahun Anggaran <span className="font-semibold text-slate-700 dark:text-slate-300">{tahun}</span> — {unit}
      </div>
    </div>
  );
}
