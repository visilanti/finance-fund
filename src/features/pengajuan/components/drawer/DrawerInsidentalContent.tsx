import React from "react";
import { FileText, Building2, Paperclip, ExternalLink, Receipt } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DetailItemReimbursement, RekeningTujuan, Pengesahan } from "@/features/pengajuan/types";
import { formatIDR } from "@/lib/utils";
import { PengesahanCard } from "./PengesahanCard";

interface DrawerInsidentalContentProps {
  jenis: string;
  items: DetailItemReimbursement[];
  rekening: RekeningTujuan;
  pengesahan?: Pengesahan;
  itemId: string;
  buktiUrl?: string | null;
}

export function DrawerInsidentalContent({
  jenis,
  items,
  rekening,
  pengesahan,
  itemId,
  buktiUrl,
}: DrawerInsidentalContentProps) {
  const hasLpjItems = jenis === "Reimbursement" && items.some((it) => it.detailItemLPJ && it.detailItemLPJ.length > 0);
  const hasBuktiUrl = buktiUrl !== null;
  return (
    <div className="space-y-3">
      <Card
        variant="primary"
        title={`Detail Item ${jenis}`}
        leftIcon={<FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200" />}
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

      {/* Rincian Kwitansi & Bukti Nota LPJ per Item (Khusus Reimbursement) */}
      {hasLpjItems && (
        <Card
          variant="primary"
          title="Rincian Kwitansi & Bukti LPJ"
          leftIcon={<Receipt className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200" />}
          className="p-0 overflow-hidden space-y-0"
          headerClassName="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800"
        >
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {items.map((it, itemIdx) => {
              const lpjs = it.detailItemLPJ || [];
              if (lpjs.length === 0) return null;
              return (
                <div key={itemIdx} className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="text-slate-700 dark:text-slate-300">#{itemIdx + 1} {it.keterangan}</span>
                    <span className="text-[11px] text-slate-400">{lpjs.length} Kwitansi</span>
                  </div>
                  <div className="overflow-x-auto rounded-md border border-slate-200/70 dark:border-slate-800">
                    <table className="w-full text-left border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                          <th className="p-2">Tgl & Kwitansi</th>
                          <th className="p-2">Uraian Belanja</th>
                          <th className="p-2 text-right">Nominal</th>
                          <th className="p-2 text-center">Bukti Nota</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {lpjs.map((lpj, lIdx) => (
                          <tr key={lIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                            <td className="p-2 whitespace-nowrap">
                              <div className="font-medium text-slate-800 dark:text-slate-200">{lpj.tanggal}</div>
                              <div className="text-[9px] text-slate-400 font-mono">{lpj.noKwitansi || "-"}</div>
                            </td>
                            <td className="p-2 text-slate-700 dark:text-slate-300">{lpj.keterangan}</td>
                            <td className="p-2 text-right font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                              {formatIDR(lpj.kredit)}
                            </td>
                            <td className="p-2 text-center">
                              {lpj.buktiUrl ? (
                                <a
                                  href={lpj.buktiUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-medium transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>{lpj.buktiNama || "Lihat Bukti"}</span>
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[10px]">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

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
