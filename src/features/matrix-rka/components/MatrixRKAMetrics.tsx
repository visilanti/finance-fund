"use client";

import React from "react";
import { formatIDR } from "@/lib/utils";
import { MatrixMetricsSummary } from "../types";
import { Wallet, CheckCircle2, Clock, AlertOctagon } from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";

interface MatrixRKAMetricsProps {
  metrics: MatrixMetricsSummary;
}

export function MatrixRKAMetrics({ metrics }: MatrixRKAMetricsProps) {
  const percentDicairkan =
    metrics.totalAnggaran > 0
      ? ((metrics.totalDicairkan / metrics.totalAnggaran) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total RKA 2026"
        value={formatIDR(metrics.totalAnggaran)}
        subtitle="Total pengeluaran"
        icon={Wallet}
      />
      <MetricCard
        title="Sudah Dicairkan"
        value={formatIDR(metrics.totalDicairkan)}
        subtitle={`${percentDicairkan}% dari total RKA`}
        icon={CheckCircle2}
      />
      <MetricCard
        title="Belum Dicairkan"
        value={formatIDR(metrics.totalBelumCair)}
        icon={Clock}
      />
      <MetricCard
        title="Hangus / Batal"
        value={formatIDR(metrics.totalHangus)}
        subtitle="Tidak terserap"
        icon={AlertOctagon}
        iconBgClass="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
        valueClass="text-rose-600 dark:text-rose-400"
      />
    </div>
  );
}
