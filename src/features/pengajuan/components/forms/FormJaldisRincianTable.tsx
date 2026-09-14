"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { JaldisItem } from "@/features/pengajuan/hooks/useJaldisForm";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Input } from "@/components/ui/Input";
import { formatIDR } from "@/lib/utils";

interface FormJaldisRincianTableProps {
  items: JaldisItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof JaldisItem, value: string | number) => void;
  totalJumlah: number;
}

export function FormJaldisRincianTable({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  totalJumlah,
}: FormJaldisRincianTableProps) {
  return (
    <FormCardSection
      // stepNumber={2}
      title="Rincian Biaya"
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
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2.5 w-12 text-center">No</th>
              <th className="px-3 py-2.5 min-w-[240px]">Uraian</th>
              <th className="px-3 py-2.5 w-44 min-w-[160px] text-right">Jumlah (Rp)</th>
              <th className="px-3 py-2.5 w-12 text-center">Hapus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-3 py-2.5 text-center font-semibold text-slate-400 dark:text-slate-500">
                  {idx + 1}
                </td>

                <td className="px-3 py-2.5">
                  <Input
                    value={item.uraian}
                    onChange={(e) => onUpdateItem(idx, "uraian", e.target.value)}
                    placeholder="Contoh: Tiket pesawat PP / Penginapan 2 malam..."
                  />
                </td>

                <td className="px-3 py-2.5 text-right">
                  <Input
                    variant="number"
                    min={0}
                    value={item.jumlah || ""}
                    onChange={(e) => onUpdateItem(idx, "jumlah", Number(e.target.value))}
                    placeholder="0"
                    className="text-right font-semibold"
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Dynamic Total Summary Row */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-400">Total Rincian Biaya:</span>
        <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">{formatIDR(totalJumlah)}</span>
      </div>
    </FormCardSection>
  );
}
