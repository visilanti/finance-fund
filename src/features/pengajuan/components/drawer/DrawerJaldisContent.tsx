import React from "react";
import { FileText, Paperclip, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DetailItemJaldis, Pengesahan } from "@/features/pengajuan/types";
import { formatIDR } from "@/lib/utils";
import { PengesahanCard } from "./PengesahanCard";

interface DrawerJaldisContentProps {
  items: DetailItemJaldis[];
  pengesahan: Pengesahan;
  itemId: string;
  buktiUrl: string;
}

export function DrawerJaldisContent({
  items,
  pengesahan,
  itemId,
  buktiUrl,
}: DrawerJaldisContentProps) {
  return (
    <div className="space-y-3">
      {/* Detail Item Jaldis Table */}
      <Card
        variant="primary"
        title="Rincian Biaya Perjalanan Dinas"
        leftIcon={<FileText className="w-3.5 h-3.5 text-gray-400" />}
        action={<span className="text-[11px] font-medium text-slate-500">{items.length} rincian</span>}
        className="p-0 overflow-hidden space-y-0"
        headerClassName="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="p-2.5 font-semibold">Uraian Pengeluaran</th>
                <th className="p-2.5 font-semibold text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {items.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">{it.uraian}</td>
                  <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {formatIDR(it.jumlah)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pengesahan & Bukti Kwitansi */}
      <div className="grid grid-cols-2 gap-3">
        <PengesahanCard
          namaTerang={pengesahan.namaTerang}
          tandaTanganUrl={pengesahan.tandaTanganUrl}
          digisignId={itemId || "8821"}
        />

        <Card
          variant="secondary"
          title="Bukti Kwitansi"
          leftIcon={<Paperclip className="w-3 h-3 text-slate-400" />}
          className="p-3 space-y-1 flex flex-col justify-between"
          headerClassName="border-b-0 pb-0"
        >
          <button
            type="button"
            onClick={() => window.open(buktiUrl, "_blank")}
            className="mt-2 w-full py-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3 h-3" />
            Lihat File
          </button>
        </Card>
      </div>
    </div>
  );
}
