"use client";

import React from "react";
import { formatIDR, cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";

export interface FormStickyFooterProps {
  /** Konten kustom sisi kiri (indikator nominal/keterangan) */
  leftContent?: React.ReactNode;
  /** Konten kustom sisi kanan (tombol aksi) */
  rightContent?: React.ReactNode;
  /** Konten bebas jika ingin mengontrol seluruh isi baris */
  children?: React.ReactNode;

  /** Label ringkasan nominal default, contoh: "Total Pengajuan", "Total Realisasi" */
  totalLabel?: string;
  /** Nilai nominal yang akan diformat otomatis menggunakan formatIDR */
  totalNominal?: number;
  /** Badge / indikator tambahan di samping nominal (misal: badge over-budget) */
  badge?: React.ReactNode;

  /** Tombol aksi sisi kanan jika menggunakan shortcut */
  actions?: React.ReactNode;

  className?: string;
}

export function FormStickyFooter({
  leftContent,
  rightContent,
  children,
  totalLabel,
  totalNominal,
  badge,
  actions,
  className,
}: FormStickyFooterProps) {
  const { isDesktopCollapsed, isHovered } = useSidebarStore();
  const isCollapsed = isDesktopCollapsed && !isHovered;

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-dropdown px-4 sm:px-6 md:px-8 py-3 transition-all duration-200",
        "left-0",
        isCollapsed ? "md:left-20" : "md:left-64",
        className
      )}
    >
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        {children ? (
          children
        ) : (
          <>
            {/* Sisi Kiri: Ringkasan atau Konten Kustom */}
            {leftContent ? (
              leftContent
            ) : totalNominal !== undefined ? (
              <div className="flex items-center gap-3">
                <div>
                  {totalLabel && (
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                      {totalLabel}
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {formatIDR(totalNominal)}
                  </span>
                </div>
                {badge}
              </div>
            ) : (
              <div />
            )}

            {/* Sisi Kanan: Aksi atau Konten Kustom */}
            {rightContent ? (
              rightContent
            ) : actions ? (
              <div className="flex items-center gap-2">{actions}</div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
