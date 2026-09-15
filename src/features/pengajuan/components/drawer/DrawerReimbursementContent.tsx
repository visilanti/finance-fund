import React from "react";
import { FileText, Building2, Paperclip, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DetailItemReimbursement, RekeningTujuan, Pengesahan } from "@/features/pengajuan/types";
import { formatIDR } from "@/lib/utils";
import { PengesahanCard } from "./PengesahanCard";

interface DrawerReimbursementContentProps {
  jenis: string;
  items: DetailItemReimbursement[];
  rekening: RekeningTujuan;
  pengesahan: Pengesahan;
  itemId: string;
  buktiUrl: string;
}

export function DrawerReimbursementContent({
  jenis,
  items,
  rekening,
  pengesahan,
  itemId,
  buktiUrl,
}: DrawerReimbursementContentProps) {
  return (
    <div className="space-y-3">
      <Card
        variant="primary"
        title={`Detail Item ${jenis}`}
        leftIcon={<FileText className="w-3.5 h-3.5 text-primary" />}
        action={<span className="text-[11px] font-medium text-slate-500">{items.length} item</span>}
        className="p-0 overflow-hidden space-y-0"
        headerClassName="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="p-2.5 font-semibold">Keterangan</th>
                <th className="p-2.5 font-semibold text-center">Vol</th>
                <th className="p-2.5 font-semibold text-right">Biaya</th>
                <th className="p-2.5 font-semibold text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {items.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">{it.keterangan}</td>
                  <td className="p-2.5 text-center text-slate-600 dark:text-slate-400">{it.volume}</td>
                  <td className="p-2.5 text-right text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatIDR(it.biaya)}
                  </td>
                  <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {formatIDR(it.jumlah || it.volume * it.biaya)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rekening Tujuan & Pengesahan */}
      <div className="grid grid-cols-2 gap-3">
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

        <PengesahanCard
          namaTerang={pengesahan.namaTerang}
          tandaTanganUrl={pengesahan.tandaTanganUrl}
          digisignId={itemId || "8821"}
        />
      </div>

      {/* Bukti Pembayaran (Khusus Reimbursement) */}
      {jenis === "Reimbursement" && (
        <Card
          variant="secondary"
          title="Bukti Pembayaran / Struk"
          subtitle="Lampiran file bukti pengeluaran"
          leftIcon={<Paperclip className="w-4 h-4 text-slate-500" />}
          action={
            <button
              type="button"
              onClick={() => window.open(buktiUrl, "_blank")}
              className="px-2.5 py-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              Lihat File
            </button>
          }
          className="p-3 space-y-0"
          headerClassName="border-b-0 pb-0"
        />
      )}
    </div>
  );
}
