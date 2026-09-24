import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { MetricCard } from "@/components/shared/MetricCard";
import { PengajuanServiceFactory } from "@/features/pengajuan/services/pengajuanService.factory";
import { formatIDR } from "@/lib/utils";
import { Clock, CheckCircle2, AlertCircle, FileText, } from "lucide-react";
import type { PengajuanDanaItem } from "@/features/pengajuan/types";

export type { PengajuanDanaItem };

export default async function Page() {
  const pengajuanService = PengajuanServiceFactory.getService("divisi");
  const metricsSummary = await pengajuanService.getMetricsSummary();

  const metricsConfig = [
    {
      title: "Total Usulan",
      value: formatIDR(metricsSummary.totalUsulan),
      icon: FileText,
    },
    {
      title: "Menunggu Approval",
      value: `${metricsSummary.menungguApprovalCount} Pengajuan`,
      icon: Clock,
    },
    {
      title: "Disetujui & Dicairkan",
      value: formatIDR(metricsSummary.disetujuiTotal),
      icon: CheckCircle2,
    },
    {
      title: "Sisa Saldo RKA",
      value: formatIDR(metricsSummary.sisaPlafonRka),
      subtitle: "Sisa dana untuk tahun 2026",
      icon: AlertCircle,
      iconBgClass: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
      valueClass: "text-primary dark:text-primary/90",
    },
  ];

  return (
    <MainLayoutShell
      // TODO (Next Development): Hapus atau ganti `initialRole` dengan data role dari session login user (misal `user.role`).
      initialRole="divisi"
      activePath="/dashboard"
    >
      {/* Metric Cards Summary Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {metricsConfig.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

    </MainLayoutShell>
  );
}

