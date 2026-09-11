"use client";

export const dynamic = "force-dynamic";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { RoleType } from "@/components/layout/Sidebar";
import { usePengajuanForm } from "@/features/pengajuan/hooks/usePengajuanForm";
import { useJaldisForm } from "@/features/pengajuan/hooks/useJaldisForm";
import { FormPengajuanShell } from "@/features/pengajuan/components/FormPengajuanShell";
import { FormJaldisShell } from "@/features/pengajuan/components/FormJaldisShell";

// ─── Label lookup ────────────────────────────────────────────────
const PAGE_TITLE_MAP: Record<string, string> = {
  rka: "Buat Pengajuan Dana RKA",
  insidental: "Buat Pengajuan Dana Insidental",
  reimbursement: "Buat Pengajuan Dana Reimbursement",
  jaldis: "Buat Kwitansi Perjalanan Dinas",
};

const BREADCRUMB_MAP: Record<string, string> = {
  rka: "Form Pengajuan RKA",
  insidental: "Form Pengajuan Insidental",
  reimbursement: "Form Pengajuan Reimbursement",
  jaldis: "Form Perjalanan Dinas",
};

// ─── Jaldis sub-page ─────────────────────────────────────────────
function CreateJaldisContent({ role }: { role: RoleType }) {
  const form = useJaldisForm((created) => {
    alert(`Kwitansi ${created.kode} berhasil dikirim!`);
    window.location.href = "/";
  });

  return (
    <MainLayoutShell
      initialRole={role}
      activePath="/pengajuan/create"
      pageTitle={PAGE_TITLE_MAP.jaldis}
      breadcrumbs={[{ label: BREADCRUMB_MAP.jaldis }]}
    >
      <FormJaldisShell form={form} />
    </MainLayoutShell>
  );
}

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
      breadcrumbs={[{ label: BREADCRUMB_MAP[pengajuanType] ?? BREADCRUMB_MAP.rka }]}
    >
      <FormPengajuanShell form={form} type={pengajuanType} />
    </MainLayoutShell>
  );
}

function CreatePageRouter() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const [currentRole] = useState<RoleType>("divisi");

  if (typeParam === "jaldis") {
    return <CreateJaldisContent role={currentRole} />;
  }

  return <CreatePengajuanContent />;
}

export default function CreatePengajuanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-xs text-slate-500">Memuat form pengajuan...</div>
      }
    >
      <CreatePageRouter />
    </Suspense>
  );
}

