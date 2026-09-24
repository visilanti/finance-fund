"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PengajuanDanaItem } from "@/features/pengajuan/types";
import { ApprovalTableSection } from "./ApprovalTableSection";
import { approvalService } from "../services/approval.service";
import { formatIDR, cn } from "@/lib/utils";

interface ApprovalListShellProps {
  initialData?: PengajuanDanaItem[];
  jenis?: string;
}

export function ApprovalListShell({ initialData = [], jenis = "rka" }: ApprovalListShellProps) {
  const [data, setData] = useState<PengajuanDanaItem[]>(initialData);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadData = async () => {
    try {
      const items = await approvalService.getDaftarApproval(jenis);
      setData(items);
    } catch (error) {
      console.error("Gagal memuat data approval:", error);
    }
  };

  useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData);
    } else {
      loadData();
    }
  }, [initialData, jenis]);

  // Hitung statistik per status approval
  const statusStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {
      all: { count: data.length, total: 0 },
      pending: { count: 0, total: 0 },
      disetujui: { count: 0, total: 0 },
      ditolak: { count: 0, total: 0 },
    };

    data.forEach((item) => {
      const nominal = item.nominalPengajuan || 0;
      stats.all.total += nominal;

      const st = item.currentStatus === "menunggu" ? "pending" : item.currentStatus;
      if (stats[st]) {
        stats[st].count += 1;
        stats[st].total += nominal;
      }
    });

    return stats;
  }, [data]);

  const pills = [
    { key: "all", label: "Semua Status", color: "bg-slate-500" },
    { key: "pending", label: "Menunggu Verifikasi", color: "bg-amber-500" },
    { key: "disetujui", label: "Disetujui", color: "bg-emerald-500" },
    { key: "ditolak", label: "Ditolak", color: "bg-rose-500" },
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

      {/* Tabel Utama Approval */}
      <ApprovalTableSection
        initialData={data}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onDataChange={loadData}
      />
    </div>
  );
}

export const ApprovalShell = ApprovalListShell;
