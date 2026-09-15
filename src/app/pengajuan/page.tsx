import React from "react";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { RKATableSection } from "@/features/pengajuan/components/tables/RKATableSection";
import { InsidentalTableSection } from "@/features/pengajuan/components/tables/InsidentalTableSection";
import { ReimbursementTableSection } from "@/features/pengajuan/components/tables/ReimbursementTableSection";
import { JaldisTableSection } from "@/features/pengajuan/components/tables/JaldisTableSection";
import { PengajuanServiceFactory } from "@/features/pengajuan/services/pengajuanService.factory";

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentType = (resolvedParams?.type || "rka").toLowerCase();

  const pengajuanService = PengajuanServiceFactory.getService("divisi");
  const daftarPengajuan = await pengajuanService.getDaftarPengajuan();

  const typeLabelMap: Record<string, string> = {
    rka: "RKA",
    insidental: "Insidental",
    reimbursement: "Reimbursement",
    jaldis: "Perjalanan Dinas",
  };

  const displayTypeLabel = typeLabelMap[currentType] || "RKA";

  const renderTableContent = () => {
    switch (currentType) {
      case "insidental":
        return <InsidentalTableSection initialData={daftarPengajuan} />;
      case "reimbursement":
        return <ReimbursementTableSection initialData={daftarPengajuan} />;
      case "jaldis":
        return <JaldisTableSection initialData={daftarPengajuan} />;
      case "rka":
      default:
        return <RKATableSection initialData={daftarPengajuan} />;
    }
  };

  return (
    <MainLayoutShell
      pageTitle={`Pengajuan ${displayTypeLabel}`}
      initialRole="divisi"
      activePath={`/pengajuan?type=${currentType}`}
    >
      {renderTableContent()}
    </MainLayoutShell>
  );
}
