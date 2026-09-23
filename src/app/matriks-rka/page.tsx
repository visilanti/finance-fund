import React from "react";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { MatrixRKAView } from "@/features/matrix-rka";
import { MOCK_RKA } from "@/features/matrix-rka/services/rka.services";

export const metadata = {
  title: "Matriks RKA Tahun 2026 | Finance Fund",
  description: "Matriks Rencana Kerja dan Anggaran (RKA) 12 Bulan Multi-Tier dengan Status Pencairan",
};

export default function Page() {
  const defaultRKA = MOCK_RKA[0];

  return (
    <MainLayoutShell
      pageTitle="Matriks RKA Tahun 2026"
      pageSubtitle={`Rencana alokasi dan realisasi anggaran pengeluaran (cash out) Tahun ${defaultRKA.tahun} — ${defaultRKA.unit}`}
      initialRole="divisi"
      activePath="/matriks-rka"
    >
      <div className="space-y-6">
        <MatrixRKAView initialData={defaultRKA} />
      </div>
    </MainLayoutShell>
  );
}
