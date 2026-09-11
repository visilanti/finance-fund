"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { JaldisItem } from "../hooks/useJaldisForm";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Input } from "@/components/ui/Input";
import { formatIDR } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FormJaldisRincianTableProps {
  items: JaldisItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof JaldisItem, value: string | number) => void;
  totalJumlah: number;
  batasAnggaran?: number;
}

export function FormJaldisRincianTable({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  totalJumlah,
  batasAnggaran = 0,
}: FormJaldisRincianTableProps) {
  const isOverBudget = batasAnggaran > 0 && totalJumlah > batasAnggaran;
  const sisa = batasAnggaran > 0 ? batasAnggaran - totalJumlah : null;

  return (
    <FormCardSection
      stepNumber={2}
      title="Rincian Biaya"
      action={
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-subtle transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-primary dark:text-red-400" />
          <span>Tambah Baris</span>
        </button>
      }
    >
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2.5 w-12 text-center">No</th>
              <th className="px-3 py-2.5">Uraian</th>
              <th className="px-3 py-2.5 w-44 text-right">Jumlah (Rp)</th>
              <th className="px-3 py-2.5 w-12 text-center">Hapus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {items.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* No */}
                <td className="px-3 py-2.5 text-center font-semibold text-slate-400 dark:text-slate-500">
                  {item.no}
                </td>

                {/* Uraian */}
                <td className="px-3 py-2.5">
                  <Input
                    value={item.uraian}
                    onChange={(e) => onUpdateItem(idx, "uraian", e.target.value)}
                    placeholder="Contoh: Tiket pesawat Jakarta–Surabaya PP"
                  />
                </td>

                {/* Jumlah */}
                <td className="px-3 py-2.5">
                  <Input
                    variant="number"
                    min={0}
                    value={item.jumlah || ""}
                    onChange={(e) => onUpdateItem(idx, "jumlah", Number(e.target.value))}
                    placeholder="0"
                    className="text-right font-semibold"
                  />
                </td>

                {/* Delete */}
                <td className="px-3 py-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="p-1 rounded text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 transition-colors cursor-pointer"
                    title="Hapus baris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      <div
        className={cn(
          "p-3 rounded-lg border flex items-center justify-between text-xs",
          isOverBudget
            ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800"
            : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800"
        )}
      >
        <div className="space-y-0.5">
          <span
            className={cn(
              "font-semibold",
              isOverBudget
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-600 dark:text-slate-400"
            )}
          >
            Total Rincian Biaya:
          </span>
          {batasAnggaran > 0 && (
            <p
              className={cn(
                "text-[11px]",
                isOverBudget
                  ? "text-rose-500 dark:text-rose-400 font-semibold"
                  : "text-slate-400 dark:text-slate-500"
              )}
            >
              {isOverBudget
                ? `Melebihi anggaran ${formatIDR(Math.abs(sisa ?? 0))}`
                : `Sisa anggaran: ${formatIDR(sisa ?? 0)}`}
            </p>
          )}
        </div>
        <span
          className={cn(
            "text-base font-extrabold",
            isOverBudget
              ? "text-rose-700 dark:text-rose-300"
              : "text-slate-900 dark:text-slate-100"
          )}
        >
          {formatIDR(totalJumlah)}
        </span>
      </div>
    </FormCardSection>
  );
}
