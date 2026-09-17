"use client";

import React from "react";
import { Plus, Trash2, Receipt } from "lucide-react";
import { DetailItemLPJ } from "../types";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { formatIDR } from "@/lib/utils";

interface FormLPJItemsTableProps {
  items: DetailItemLPJ[];
  saldoAwal: number;
  tanggalCair: string;
  jenis: string;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof DetailItemLPJ, value: any) => void;
}

export function FormLPJItemsTable({
  items,
  saldoAwal,
  tanggalCair,
  jenis,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: FormLPJItemsTableProps) {
  const totalKredit = items.reduce((acc, curr) => acc + (Number(curr.kredit) || 0), 0);

  // Hitung running balance (saldo berjalan) secara real-time per baris belanja
  let currentBalance = saldoAwal;
  const runningSaldos = items.map((item) => {
    currentBalance = currentBalance + (Number(item.debit) || 0) - (Number(item.kredit) || 0);
    return currentBalance;
  });

  const saldoAkhir = runningSaldos.length > 0 ? runningSaldos[runningSaldos.length - 1] : saldoAwal;
  const isDeficit = saldoAkhir < 0;

  return (
    <FormCardSection
      title="Rincian Penggunaan Dana"
      action={
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-subtle transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-primary" />
          <span>Tambah Item</span>
        </button>
      }
    >
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[860px]">
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-800 text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">
              <th className="px-3 py-2.5 w-12 text-center">No</th>
              <th className="px-3 py-2.5 w-36 min-w-[140px]">Tanggal</th>
              <th className="px-3 py-2.5 w-44 min-w-[160px]">No. Kwitansi</th>
              <th className="px-3 py-2.5 min-w-[200px]">Uraian Belanja / Keterangan</th>
              <th className="px-3 py-2.5 w-36 min-w-[130px] text-right">Debit</th>
              <th className="px-3 py-2.5 w-36 min-w-[130px] text-right">Kredit</th>
              <th className="px-3 py-2.5 w-36 min-w-[130px] text-right">Saldo</th>
              <th className="px-3 py-2.5 w-12 text-center">Hapus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {/* Baris 1: Pencairan Dana Awal (Row paling atas, disabled & auto-filled) */}
            <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
              <td className="px-3 py-2.5 text-center font-semibold text-slate-400 dark:text-slate-500">
                1
              </td>

              <td className="px-3 py-2.5">
                <Input
                  value={tanggalCair}
                  disabled
                  className="text-xs bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 cursor-not-allowed border-slate-200/60 dark:border-slate-700/60"
                />
              </td>

              <td className="px-3 py-2.5">
                <Input
                  value=""
                  placeholder="-"
                  disabled
                  className="text-xs bg-slate-100/70 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200/60 dark:border-slate-700/60 text-center"
                />
              </td>

              <td className="px-3 py-2.5">
                <Input
                  value={`Pencairan Dana — ${jenis}`}
                  disabled
                  className="text-xs bg-slate-100/70 dark:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-300 cursor-not-allowed border-slate-200/60 dark:border-slate-700/60"
                />
              </td>

              <td className="px-3 py-2.5">
                <Input
                  variant="currency"
                  value={saldoAwal}
                  disabled
                  className="text-right text-xs bg-slate-100/70 dark:bg-slate-800/80 font-semibold text-slate-900 dark:text-slate-100 cursor-not-allowed border-slate-200/60 dark:border-slate-700/60"
                />
              </td>

              <td className="px-3 py-2.5">
                <Input
                  value="-"
                  disabled
                  className="text-right text-xs bg-slate-100/70 dark:bg-slate-800/80 text-slate-400 cursor-not-allowed border-slate-200/60 dark:border-slate-700/60"
                />
              </td>

              <td className="px-3 py-2.5">
                <Input
                  variant="currency"
                  value={saldoAwal}
                  disabled
                  className="text-right text-xs bg-slate-100/70 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-slate-100 cursor-not-allowed border-slate-200/60 dark:border-slate-700/60"
                />
              </td>

              <td className="px-3 py-2.5 text-center">
                <button
                  type="button"
                  disabled
                  className="p-1.5 rounded-lg text-slate-300 dark:text-slate-700 cursor-not-allowed"
                  title="Baris pencairan awal tidak dapat dihapus"
                >
                  <Trash2 className="w-4 h-4 opacity-30" />
                </button>
              </td>
            </tr>

            {/* Baris 2+: Rincian Kwitansi Pengeluaran */}
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50/20 dark:bg-slate-800/10">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Receipt className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    <span className="font-medium text-xs">Belum ada rincian kwitansi pengeluaran yang ditambahkan.</span>
                    <button
                      type="button"
                      onClick={onAddItem}
                      className="text-primary hover:underline text-xs font-semibold cursor-pointer"
                    >
                      + Tambah kwitansi pengeluaran pertama
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const currentSaldo = runningSaldos[idx];
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-2.5 text-center font-semibold text-slate-400 dark:text-slate-500">
                      {idx + 2}
                    </td>

                    <td className="px-3 py-2.5">
                      <Input
                        variant="date"
                        id={`tgl-${idx}`}
                        value={item.tanggal}
                        onChange={(e) => onUpdateItem(idx, "tanggal", e.target.value)}
                        placeholder="Pilih tanggal..."
                        className="text-xs"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <Input
                        value={item.noKwitansi}
                        onChange={(e) => onUpdateItem(idx, "noKwitansi", e.target.value)}
                        placeholder="Contoh: KW-001/2026"
                        className="text-xs"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <Input
                        value={item.keterangan}
                        onChange={(e) => onUpdateItem(idx, "keterangan", e.target.value)}
                        placeholder="Uraian belanja barang/jasa..."
                        className="text-xs"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <Input
                        value="-"
                        disabled
                        className="text-right text-xs bg-slate-100/50 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed border-slate-200/60 dark:border-slate-700/60"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <Input
                        variant="currency"
                        value={item.kredit !== undefined && item.kredit !== null ? item.kredit : ""}
                        onChange={(e) =>
                          onUpdateItem(
                            idx,
                            "kredit",
                            e.target.value !== "" ? Number(e.target.value) : 0
                          )
                        }
                        placeholder="Rp 0"
                        className="text-right text-xs"
                      />
                    </td>

                    <td className="px-3 py-2.5">
                      <Input
                        variant="currency"
                        value={currentSaldo}
                        disabled
                        className={`text-right text-xs font-semibold cursor-not-allowed border-slate-200/60 dark:border-slate-700/60 ${
                          currentSaldo < 0
                            ? "bg-rose-50/70 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                            : "bg-slate-100/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200"
                        }`}
                      />
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Hapus baris ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Ringkasan Perhitungan Anggaran */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/70 dark:border-slate-800">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Saldo Awal Cair
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
            {formatIDR(saldoAwal)}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Total Realisasi (Kredit)
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
            {formatIDR(totalKredit)}
          </span>
        </div>

        <div
          className={`p-3 rounded-lg border ${
            isDeficit
              ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
              : "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
          }`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider block">
            {isDeficit ? "Defisit Anggaran" : "Sisa Lebih (SILPA)"}
          </span>
          <span className="text-sm font-bold mt-0.5 block">
            {formatIDR(Math.abs(saldoAkhir))}
          </span>
        </div>
      </div>
    </FormCardSection>
  );
}
