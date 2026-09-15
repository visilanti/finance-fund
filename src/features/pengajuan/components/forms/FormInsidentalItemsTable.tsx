"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { PengajuanItemDetail } from "@/features/pengajuan/services/pengajuanService.types";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Input } from "@/components/ui/Input";
import { formatIDR } from "@/lib/utils";

interface FormInsidentalItemsTableProps {
  items: PengajuanItemDetail[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof PengajuanItemDetail, value: any) => void;
  totalNominal: number;
}

export function FormInsidentalItemsTable({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  totalNominal,
}: FormInsidentalItemsTableProps) {
  return (
    <FormCardSection
      // stepNumber={2}
      title="Detail Item Kegiatan"
      action={
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-subtle transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-primary dark:text-red-400" />
          <span>Tambah</span>
        </button>
      }
    >
      {/* Dynamic Item Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2.5 w-12 text-center">No</th>
              <th className="px-3 py-2.5 min-w-[240px]">Keterangan Pengajuan</th>
              <th className="px-3 py-2.5 w-28 text-center">Volume</th>
              <th className="px-3 py-2.5 min-w-[160px] text-right">Biaya (Rp)</th>
              <th className="px-3 py-2.5 min-w-[160px] text-right">Jumlah (Rp)</th>
              <th className="px-3 py-2.5 w-12 text-center">Hapus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {items.map((item, idx) => {
              const volume = item.volume ?? 1;
              const biaya = item.biaya ?? item.hargaSatuan ?? 0;
              const jumlah = item.subtotal ?? item.nominalPengajuan ?? (volume * biaya);

              return (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 text-center font-semibold text-slate-400 dark:text-slate-500">
                    {idx + 1}
                  </td>

                  <td className="px-3 py-2.5">
                    <Input
                      value={item.keterangan || item.namaItem || ""}
                      onChange={(e) => {
                        onUpdateItem(idx, "keterangan", e.target.value);
                        onUpdateItem(idx, "namaItem", e.target.value);
                      }}
                      placeholder="Masukkan keterangan pengajuan..."
                    />
                  </td>

                  <td className="px-3 py-2.5">
                    <Input
                      variant="number"
                      min={1}
                      value={volume}
                      onChange={(e) => onUpdateItem(idx, "volume", Number(e.target.value))}
                      placeholder="1"
                      className="text-center font-medium"
                    />
                  </td>

                  <td className="px-3 py-2.5 text-right">
                    <Input
                      variant="currency"
                      min={0}
                      value={biaya || ""}
                      onChange={(e) => onUpdateItem(idx, "biaya", Number(e.target.value))}
                      placeholder="0"
                      className="text-right font-semibold"
                    />
                  </td>

                  <td className="px-3 py-2.5 text-right">
                    <Input
                      value={formatIDR(jumlah)}
                      disabled
                      className="text-right font-bold text-slate-900 dark:text-slate-100 bg-slate-100/70 dark:bg-slate-800/70"
                    />
                  </td>

                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-1 rounded text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 transition-colors cursor-pointer"
                      title="Hapus baris item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dynamic Total Summary Row */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-400">Total Nominal Insidental:</span>
        <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">{formatIDR(totalNominal)}</span>
      </div>
    </FormCardSection>
  );
}
