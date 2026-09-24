import React from "react";
import { FileText, Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DetailItemRKA, RekeningTujuan, Pengesahan } from "@/features/pengajuan/types";
import { formatIDR } from "@/lib/utils";
import { PengesahanCard } from "./PengesahanCard";

interface DrawerRkaContentProps {
  items: DetailItemRKA[];
  rekening: RekeningTujuan;
  pengesahan?: Pengesahan;
  itemId: string;
}

export function DrawerRkaContent({
  items,
  rekening,
  pengesahan,
  itemId,
}: DrawerRkaContentProps) {
  return (
    <div className="space-y-3">
      <Card
        variant="primary"
        title="Detail Item RKA"
        leftIcon={<FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200" />}
        action={<span className="text-[11px] font-medium text-slate-500">{items.length} item</span>}
        className="p-0 overflow-hidden space-y-0"
        headerClassName="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="p-2.5 font-semibold">Kegiatan RKA</th>
                <th className="p-2.5 font-semibold">Bulan</th>
                <th className="p-2.5 font-semibold text-right">Budget</th>
                <th className="p-2.5 font-semibold text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {items.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-2.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{it.kegiatanRka}</div>
                    <div className="text-[10px] text-slate-400">{it.kelompok}</div>
                  </td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {Array.isArray(it.bulan) ? it.bulan.join(", ") : it.bulan}
                  </td>
                  <td className="p-2.5 text-right font-medium text-slate-500 whitespace-nowrap">
                    {formatIDR(it.budget)}
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {formatIDR(it.nominal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card
        variant="secondary"
        title="Rekening Tujuan"
        leftIcon={<Building2 className="w-3 h-3 text-slate-400" />}
        className="p-3 space-y-1"
        headerClassName="border-b-0 pb-0"
      >
        <div className="font-bold text-slate-800 dark:text-slate-200">{rekening.namaBank}</div>
        <div className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{rekening.nomorRekening}</div>
        <div className="text-slate-500 dark:text-slate-400 text-[10px]">a.n {rekening.namaPemilikRekening}</div>
      </Card>

      {/* Pengesahan Cards */}
      <div className="grid grid-cols-2 gap-3">
        <PengesahanCard
          title="Yang Mengajukan"
          namaTerang={pengesahan?.namaTerang}
          tandaTanganUrl={pengesahan?.tandaTanganUrl}
          digisignId={itemId}
        />

        <PengesahanCard
          title="Mengetahui Direktorat"
          digisignId={itemId}
        />

        <PengesahanCard
          title="Menyetujui Bendahara"
          digisignId={itemId}
        />

        <PengesahanCard
          title="Menyetujui Finance"
          digisignId={itemId}
        />
      </div>
    </div>
  );
}
