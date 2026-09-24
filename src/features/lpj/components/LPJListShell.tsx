"use client";

import React, { useState, useMemo, useEffect } from "react";
import { InfoLPJ } from "@/features/lpj/types";
import { LPJTableSection } from "./LPJTableSection";
import { formatIDR, cn } from "@/lib/utils";
import { lpjService } from "../services/lpj.service";
import { useSidebarStore } from "@/store/useSidebarStore";

interface LPJListShellProps {
  initialData?: InfoLPJ[];
}

export function LPJListShell({ initialData = [] }: LPJListShellProps) {
  const [data, setData] = useState<InfoLPJ[]>(initialData);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const currentRole = useSidebarStore((state) => state.currentRole);
  const isFinance = currentRole === "finance";

  const loadData = async () => {
    try {
      const items = await lpjService.getDaftarLPJ();
      setData(items);
    } catch (error) {
      console.error("Gagal memuat data LPJ:", error);
    }
  };

  useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData);
    } else {
      loadData();
    }
  }, [initialData]);

  // Hitung statistik total item & total nominal saldo awal per status
  const statusStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {
      all: { count: data.length, total: 0 },
      dalam_proses: { count: 0, total: 0 },
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

      if (st === "submit" || st === "belum_lpj" || st === "dalam_proses") {
        stats.dalam_proses.count += 1;
        stats.dalam_proses.total += nominal;
      }
    });

    return stats;
  }, [data]);

  // Pills untuk Finance: disetujui, revisi, dalam proses
  const financePills = [
    { key: "all", label: "Semua Status", color: "bg-slate-500" },
    { key: "dalam_proses", label: "Dalam Proses", color: "bg-amber-500" },
    { key: "disetujui", label: "Disetujui", color: "bg-emerald-500" },
    { key: "revisi", label: "Revisi", color: "bg-rose-500" },
  ];

  // Pills untuk Divisi:
  const divisiPills = [
    { key: "all", label: "Semua Status", color: "bg-slate-500" },
    { key: "belum_lpj", label: "Belum LPJ", color: "bg-amber-500" },
    { key: "submit", label: "Submit", color: "bg-blue-500" },
    { key: "disetujui", label: "Disetujui", color: "bg-emerald-500" },
    { key: "revisi", label: "Revisi", color: "bg-rose-500" },
  ];

  const activePills = isFinance ? financePills : divisiPills;

  return (
    <div className="space-y-6">
      {/* Filter Status Pills & Total Ringkasan */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {activePills.map((pill) => {
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
                  ? "bg-gray-200 border-grey-900 shadow-sm shadow-grey-900/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <span
                className={cn(
                  `w-2 h-2 rounded-full shrink-0 ${pill.color}`
                )}
              />
              <span>{pill.label}</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
        onDataChange={loadData}
      />
    </div>
  );
}

// Alias LPJShell untuk keselarasan penamaan
export const LPJShell = LPJListShell;
