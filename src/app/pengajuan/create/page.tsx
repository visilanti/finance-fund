"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { RoleType } from "@/components/layout/Sidebar";
import { usePengajuanForm } from "@/features/pengajuan/hooks/usePengajuanForm";
import { FormPengajuanShell } from "@/features/pengajuan/components/forms/FormPengajuanShell";

// ─── Label lookup ────────────────────────────────────────────────
const PAGE_TITLE_MAP: Record<string, string> = {
  rka: "Pengajuan Dana RKA",
  insidental: "Pengajuan Dana Insidental",
  reimbursement: "Pengajuan Dana Reimbursement",
};

function CreatePengajuanContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const pengajuanType =
    typeParam === "insidental"
      ? "insidental"
      : typeParam === "reimbursement"
      ? "reimbursement"
      : "rka";

  const [currentRole] = useState<RoleType>("divisi");

  const form = usePengajuanForm(currentRole, (created) => {
    alert(
      `Pengajuan ${created.kode} (${pengajuanType.toUpperCase()}) berhasil dikirim! Mengalihkan ke daftar pengajuan...`
    );
    window.location.href = "/";
  });

  return (
    <MainLayoutShell
      initialRole={currentRole}
      activePath="/pengajuan/create"
      pageTitle={PAGE_TITLE_MAP[pengajuanType] ?? PAGE_TITLE_MAP.rka}
    >
      <FormPengajuanShell form={form} type={pengajuanType} />
    </MainLayoutShell>
  );
}

export default function CreatePengajuanPage() {
  return <CreatePengajuanContent />;
}

