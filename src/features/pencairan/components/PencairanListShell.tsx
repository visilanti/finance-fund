"use client";

import React, { useState, useMemo } from "react";
import { PencairanItem } from "../types";
import { PencairanRKATableSection } from "./tables/PencairanRKATableSection";
import { PencairanInsidentalTableSection } from "./tables/PencairanInsidentalTableSection";
import { PencairanReimbursementTableSection } from "./tables/PencairanReimbursementTableSection";
import { formatIDR, cn } from "@/lib/utils";
import { Clock, CheckCircle2, ListFilter, Banknote, Wallet } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";

export interface PencairanListShellProps {
  initialData?: PencairanItem[];
  jenis?: string;
}

export function PencairanListShell({ initialData = [], jenis = "rka" }: PencairanListShellProps) {
  const currentJenis = jenis.toLowerCase();

  // Hitung ringkasan statistik per status
  const stats = useMemo(() => {
    let totalNominal = 0;
    let pendingCount = 0;
    let pendingNominal = 0;
    let selesaiCount = 0;
    let selesaiNominal = 0;

    initialData.forEach((item) => {
      const nominal = item.nominalDiterima || item.nominalPengajuan || 0;
      totalNominal += nominal;

      const isSelesai = item.statusPencairan === "selesai" || Boolean(item.buktiTransferUrl);
      if (isSelesai) {
        selesaiCount += 1;
        selesaiNominal += nominal;
      } else {
        pendingCount += 1;
        pendingNominal += nominal;
      }
    });

    return {
      totalCount: initialData.length,
      totalNominal,
      pendingCount,
      pendingNominal,
      selesaiCount,
      selesaiNominal,
    };
  }, [initialData]);

  const renderTableSection = () => {
    switch (currentJenis) {
      case "insidental":
        return <PencairanInsidentalTableSection initialData={initialData} />;
      case "reimbursement":
        return <PencairanReimbursementTableSection initialData={initialData} />;
      case "rka":
      default:
        return <PencairanRKATableSection initialData={initialData} />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Mini Metric KPI Cards untuk Finance
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <MetricCard
          title="Total Pengajuan"
          value={stats.totalCount}
          icon={ListFilter}
        />
        <MetricCard
          title="Dalam Proses"
          value={stats.pendingCount}
          icon={Clock}
        />
        <MetricCard
          title="Selesai Dicairkan"
          value={stats.selesaiCount}
          icon={CheckCircle2}
        />
      </div> */}

      {/* Tabel Section Utama */}
      {renderTableSection()}
    </div>
  );
}

export const PencairanShell = PencairanListShell;
