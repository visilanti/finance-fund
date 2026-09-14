"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { PengajuanItemDetail } from "@/features/pengajuan/services/pengajuanService.types";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatIDR } from "@/lib/utils";

const KELOMPOK_OPTIONS = [
  "Operasional",
  "Pengadaan & Sarpras",
  "Pemeliharaan",
  "Pengembangan SDM",
  "Kegiatan Siswa/Akademik",
];

const KEGIATAN_RKA_OPTIONS = [
  "Pengadaan Hardware IT & Server",
  "Maintenance Jaringan & Internet",
  "Bahan Ajar & Modul Pembelajaran",
  "Operasional Listrik & Kebersihan",
  "Pelatihan & Workshop Guru",
];

const BULAN_OPTIONS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

interface FormItemsTableProps {
  items: PengajuanItemDetail[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof PengajuanItemDetail, value: any) => void;
  totalNominal: number;
}

export function FormItemsTable({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  totalNominal,
}: FormItemsTableProps) {
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
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2.5 w-12 text-center">No</th>
              <th className="px-3 py-2.5 min-w-[220px]">Kelompok</th>
              <th className="px-3 py-2.5 min-w-[220px]">Kegiatan RKA</th>
              <th className="px-3 py-2.5 min-w-[120px]">Bulan</th>
              <th className="px-3 py-2.5 min-w-[220px]">Budget RKA</th>
              <th className="px-3 py-2.5 w-40 min-w-[140px] text-right">Nominal Pengajuan</th>
              <th className="px-3 py-2.5 w-12 text-center">Hapus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-3 py-2.5 text-center font-semibold text-slate-400 dark:text-slate-500">{idx + 1}</td>

                <td className="px-3 py-2.5">
                  <Select
                    onChange={(val) => onUpdateItem(idx, "kelompok", val)}
                    options={KELOMPOK_OPTIONS}
                    isSearchable={false}
                  />
                </td>

                <td className="px-3 py-2.5">
                  <Select
                    onChange={(val) => onUpdateItem(idx, "kegiatanRka", val)}
                    options={KEGIATAN_RKA_OPTIONS}
                    isSearchable={true}
                  />
                </td>

                <td className="px-3 py-2.5">
                  <Select
                    options={BULAN_OPTIONS}
                    isSearchable={true}
                  />
                </td>

                <td className="px-3 py-2.5">
                  <Input
                    value={formatIDR(item.budgetRka ?? 0)}
                    disabled
                    className="font-semibold text-slate-600 dark:text-slate-400"
                  />
                </td>

                <td className="px-3 py-2.5 text-right">
                  <Input
                    variant="number"
                    min={0}
                    onChange={(e) => onUpdateItem(idx, "nominalPengajuan", Number(e.target.value))}
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
        <span className="font-semibold text-slate-600 dark:text-slate-400">Total Nominal:</span>
        <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">{formatIDR(totalNominal)}</span>
      </div>
    </FormCardSection>
  );
}
