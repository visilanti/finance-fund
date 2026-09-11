import React from "react";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { MetricCard } from "@/components/shared/MetricCard";
import { PengajuanTableSection } from "@/features/pengajuan/components/PengajuanTableSection";
import { PengajuanServiceFactory } from "@/features/pengajuan/services/pengajuanService.factory";
import { formatIDR } from "@/lib/utils";
import { Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import type { PengajuanDanaItem } from "@/features/pengajuan/types";

export type { PengajuanDanaItem };

export default async function Page() {
  const pengajuanService = PengajuanServiceFactory.getService("divisi");
  const daftarPengajuan = await pengajuanService.getDaftarPengajuan();
  const metricsSummary = await pengajuanService.getMetricsSummary();

  const metricsConfig = [
    {
      title: "Total Usulan",
      value: formatIDR(metricsSummary.totalUsulan),
      icon: FileText,
      iconBgClass: "bg-red-50 text-primary dark:bg-red-950/60 dark:text-red-400",
      valueClass: "text-slate-900 dark:text-slate-100",
    },
    {
      title: "Menunggu Approval",
      value: `${metricsSummary.menungguApprovalCount} Pengajuan`,
      icon: Clock,
      iconBgClass: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      valueClass: "text-slate-900 dark:text-slate-100",
    },
    {
      title: "Disetujui & Dicairkan",
      value: formatIDR(metricsSummary.disetujuiTotal),
      icon: CheckCircle2,
      iconBgClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
      valueClass: "text-slate-900 dark:text-slate-100",
    },
    {
      title: "Sisa Saldo RKA",
      value: formatIDR(metricsSummary.sisaPlafonRka),
      subtitle: "Sisa dana untuk tahun 2026",
      icon: AlertCircle,
      iconBgClass: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
      valueClass: "text-rose-700 dark:text-rose-400",
    },
  ];

  return (
    <MainLayoutShell
      initialRole="divisi"
      activePath="/dashboard"
      breadcrumbs={[{ label: "Daftar Pengajuan Dana" }]}
    >
      {/* Metric Cards Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsConfig.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Master Data Table & Interaktivitas UI (Client Component) */}
      <PengajuanTableSection initialData={daftarPengajuan} />
    </MainLayoutShell>
  );
}
