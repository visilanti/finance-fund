import React from "react";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { LPJListShell } from "@/features/lpj/components";
import { lpjService } from "@/features/lpj/services/lpj.service";

export default async function Page() {
  const initialData = await lpjService.getDaftarLPJ();

  return (
    <MainLayoutShell
      pageTitle="Daftar LPJ"
      initialRole="divisi"
      activePath="/lpj"
    >
      <LPJListShell initialData={initialData} />
    </MainLayoutShell>
  );
}
