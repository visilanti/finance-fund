"use client";

import React, { useState, useMemo, useEffect } from "react";
import { InfoLPJ } from "@/features/lpj/types";
import { LPJTableSection } from "./LPJTableSection";
import { formatIDR, cn } from "@/lib/utils";
import { lpjService } from "../services/lpj.service";

interface LPJListShellProps {
  initialData?: InfoLPJ[];
}

export function LPJListShell({ initialData = [] }: LPJListShellProps) {
  const [data, setData] = useState<InfoLPJ[]>(initialData);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData);
    } else {
      lpjService.getDaftarLPJ().then(setData).catch(console.error);
    }
  }, [initialData]);

  // Hitung statistik total item & total nominal saldo awal per status
  const statusStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {
      all: { count: data.length, total: 0 },
      belum_lpj: { count: 0, total: 0 },
      submit: { count: 0, total: 0 },
      disetujui: { count: 0, total: 0 },
      revisi: { count: 0, total: 0 },
    };

    data.forEach((item) => {
      const nominal = item.saldoAwal || 0;
      stats.all.total += nominal;

      const st = item.status;
      if (stats[st]) {
        stats[st].count += 1;
        stats[st].total += nominal;
      }
    });

    return stats;
  }, [data]);

  const pills = [
    { key: "all", label: "Semua Status", color: "bg-slate-500" },
    { key: "belum_lpj", label: "Belum LPJ", color: "bg-amber-500" },
    { key: "submit", label: "Submit", color: "bg-blue-500" },
    { key: "disetujui", label: "Disetujui", color: "bg-emerald-500" },
    { key: "revisi", label: "Revisi", color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Status Pills & Total Ringkasan */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pills.map((pill) => {
          const isActive = statusFilter === pill.key;
          const stat = statusStats[pill.key] || { count: 0, total: 0 };

          return (
            <button
              key={pill.key}
              type="button"
              onClick={() => setStatusFilter(pill.key)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer border select-none",
                isActive
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/20 ring-2 ring-primary/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  isActive ? "bg-white" : pill.color
                )}
              />
              <span>{pill.label}</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors",
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                )}
              >
                {stat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabel Utama LPJ */}
      <LPJTableSection
        initialData={data}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
    </div>
  );
}

// Alias LPJShell untuk keselarasan penamaan
export const LPJShell = LPJListShell;
