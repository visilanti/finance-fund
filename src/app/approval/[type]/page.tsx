import React from "react";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { ApprovalListShell } from "@/features/approval/components";
import { approvalService } from "@/features/approval/services/approval.service";

interface PageProps {
  params: Promise<{ type: string }>;
}

export default async function DynamicApprovalPage({ params }: PageProps) {
  const resolvedParams = await params;
  const currentType = (resolvedParams?.type || "rka").toLowerCase();

  const daftarApproval = await approvalService.getDaftarApproval(currentType);

  const typeLabelMap: Record<string, string> = {
    rka: "RKA",
    insidental: "Insidental",
    reimbursement: "Reimbursement",
  };

  const displayTypeLabel = typeLabelMap[currentType] || "RKA";

  return (
    <MainLayoutShell
      pageTitle={`Approval ${displayTypeLabel}`}
      initialRole="manager"
      activePath={`/approval?type=${currentType}`}
    >
      <ApprovalListShell initialData={daftarApproval} jenis={currentType} />
    </MainLayoutShell>
  );
}
