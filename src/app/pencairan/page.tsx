import React from "react";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { PencairanListShell } from "@/features/pencairan/components";
import { pencairanService } from "@/features/pencairan/services/pencairan.service";

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function PencairanPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentType = (resolvedParams?.type || "rka").toLowerCase();

  const daftarPencairan = await pencairanService.getPencairanList(currentType);

  const typeLabelMap: Record<string, string> = {
    rka: "RKA",
    insidental: "Insidental",
    reimbursement: "Reimbursement",
  };

  const displayTypeLabel = typeLabelMap[currentType] || "RKA";

  return (
    <MainLayoutShell
      pageTitle={`Pencairan Dana ${displayTypeLabel}`}
      initialRole="finance"
      activePath={`/pencairan?type=${currentType}`}
    >
      <PencairanListShell initialData={daftarPencairan} jenis={currentType} />
    </MainLayoutShell>
  );
}
