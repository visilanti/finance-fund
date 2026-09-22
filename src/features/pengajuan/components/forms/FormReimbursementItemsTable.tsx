"use client";

import React from "react";
import { Plus, Trash2, Receipt, Paperclip, CheckCircle2, AlertCircle } from "lucide-react";
import { PengajuanItemDetail } from "@/features/pengajuan/services/pengajuanService.types";
import { DetailItemLPJ } from "@/features/lpj/types";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Input } from "@/components/ui/Input";
import { InlineFileUpload } from "@/components/shared/InlineFileUpload";
import { formatIDR } from "@/lib/utils";

interface FormReimbursementItemsTableProps {
  items: PengajuanItemDetail[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof PengajuanItemDetail, value: any) => void;
  totalNominal: number;
}

export function FormReimbursementItemsTable({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  totalNominal,
}: FormReimbursementItemsTableProps) {
  // Tambah baris kwitansi LPJ (sub item)
  const handleAddLpjRow = (itemIdx: number) => {
    const item = items[itemIdx];
    const volume = item?.volume ?? 1;
    const biaya = item?.biaya ?? item?.hargaSatuan ?? 0;
    const parentSubtotal = item?.subtotal ?? item?.nominalPengajuan ?? volume * biaya;

    const currentLpjs = item?.detailItemLPJ || [];
    const currentTotal = currentLpjs.reduce((acc, curr) => acc + (Number(curr.kredit) || 0), 0);

    if (biaya <= 0) {
      alert("Mohon isi Biaya (Rp) item kegiatan terlebih dahulu sebagai patokan plafon subtotal.");
      return;
    }

    if (currentTotal >= parentSubtotal && parentSubtotal > 0) {
      alert(
        `Total nominal sub item sudah mencapai batas maksimal subtotal parent (${formatIDR(
          parentSubtotal
        )}).`
      );
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const newLpjs: DetailItemLPJ[] = [
      ...currentLpjs,
      {
        tanggal: today,
        noKwitansi: "",
        keterangan: "",
        debit: 0,
        kredit: 0,
        buktiUrl: undefined,
        buktiNama: undefined,
      },
    ];
    onUpdateItem(itemIdx, "detailItemLPJ", newLpjs);
  };

  // Hapus baris kwitansi LPJ (sub item)
  const handleRemoveLpjRow = (itemIdx: number, lpjIdx: number) => {
    const currentLpjs = items[itemIdx]?.detailItemLPJ || [];
    const updatedLpjs = currentLpjs.filter((_, idx) => idx !== lpjIdx);
    onUpdateItem(itemIdx, "detailItemLPJ", updatedLpjs);
  };

  // Update nilai baris kwitansi LPJ (sub item) dengan batasan plafon parent subtotal
  const handleUpdateLpjRow = (
    itemIdx: number,
    lpjIdx: number,
    field: keyof DetailItemLPJ,
    val: any
  ) => {
    const currentLpjs = [...(items[itemIdx]?.detailItemLPJ || [])];
    if (!currentLpjs[lpjIdx]) return;

    if (field === "kredit") {
      const item = items[itemIdx];
      const volume = item?.volume ?? 1;
      const biaya = item?.biaya ?? item?.hargaSatuan ?? 0;
      const parentSubtotal = item?.subtotal ?? item?.nominalPengajuan ?? volume * biaya;

      // Hitung total dari sub item lain selain baris yang sedang diedit
      const otherSum = currentLpjs.reduce((acc, curr, idx) => {
        if (idx === lpjIdx) return acc;
        return acc + (Number(curr.kredit) || 0);
      }, 0);

      // Sisa maksimal yang diperbolehkan agar total tidak melebihi subtotal parent (patokan Biaya x Volume)
      const maxAllowed = Math.max(0, parentSubtotal - otherSum);
      const inputVal = Number(val) || 0;
      const finalVal = Math.min(inputVal, maxAllowed);

      currentLpjs[lpjIdx] = {
        ...currentLpjs[lpjIdx],
        kredit: finalVal,
      };
    } else {
      currentLpjs[lpjIdx] = {
        ...currentLpjs[lpjIdx],
        [field]: val,
      };
    }

    onUpdateItem(itemIdx, "detailItemLPJ", currentLpjs);
  };

  const handleBuktiUpload = (itemIdx: number, lpjIdx: number, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    handleUpdateLpjRow(itemIdx, lpjIdx, "buktiUrl", objectUrl);
    handleUpdateLpjRow(itemIdx, lpjIdx, "buktiNama", file.name);
  };

  const handleBuktiRemove = (itemIdx: number, lpjIdx: number) => {
    handleUpdateLpjRow(itemIdx, lpjIdx, "buktiUrl", undefined);
    handleUpdateLpjRow(itemIdx, lpjIdx, "buktiNama", undefined);
  };

  return (
    <FormCardSection
      title="Detail Kegiatan Reimbursement"
      description="Tentukan biaya sebagai patokan dan lampirkan bukti kwitansi LPJ di bawahnya."
      action={
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-subtle transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-primary" />
          <span>Item Kegiatan</span>
        </button>
      }
    >
      <div className="space-y-6">
        {items.map((item, itemIdx) => {
          const volume = item.volume ?? 1;
          const biaya = item.biaya ?? item.hargaSatuan ?? 0;
          const jumlah = item.subtotal ?? item.nominalPengajuan ?? volume * biaya;
          const lpjList = item.detailItemLPJ || [];
          const totalLpjKredit = lpjList.reduce((acc, curr) => acc + (Number(curr.kredit) || 0), 0);
          const sisaKuota = Math.max(0, jumlah - totalLpjKredit);
          const isMatched = lpjList.length > 0 && totalLpjKredit === jumlah;
          const isOverBudget = totalLpjKredit > jumlah && jumlah > 0;
          const isZeroBiaya = biaya <= 0;
          const isFullyAllocated = totalLpjKredit >= jumlah && jumlah > 0;

          return (
            <div
              key={itemIdx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-subtle overflow-hidden"
            >
              {/* Header Baris Item Kegiatan */}
              <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                      Item Kegiatan #{itemIdx + 1}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(itemIdx)}
                    disabled={items.length <= 1}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 transition-colors cursor-pointer"
                    title="Hapus item kegiatan ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Item</span>
                  </button>
                </div>

                {/* Form Field Item Kegiatan */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-5">
                    <Input
                      label="Keterangan Pengajuan Kegiatan"
                      value={item.keterangan || item.namaItem || ""}
                      onChange={(e) => {
                        onUpdateItem(itemIdx, "keterangan", e.target.value);
                        onUpdateItem(itemIdx, "namaItem", e.target.value);
                      }}
                      placeholder="Contoh: Pembelian ATK & Konsumsi Rapat"
                      className="text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      variant="number"
                      label="Volume"
                      min={1}
                      value={volume}
                      onChange={(e) => onUpdateItem(itemIdx, "volume", Number(e.target.value))}
                      placeholder="1"
                      className="text-center text-xs font-medium"
                    />
                  </div>

                  {/* Input Biaya (Rp) - PATOKAN PLAFON SUB ITEM */}
                  <div className="sm:col-span-2">
                    <div>
                      <Input
                        variant="currency"
                        label="Biaya (Rp) — Patokan"
                        min={0}
                        value={biaya || ""}
                        onChange={(e) => onUpdateItem(itemIdx, "biaya", Number(e.target.value))}
                        placeholder="0"
                        className="text-right text-xs font-semibold"
                      />
                      {isOverBudget && (
                        <span className="text-[10px] text-rose-500 font-medium mt-1 block">
                          Biaya lebih kecil dari total sub item ({formatIDR(totalLpjKredit)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Input
                      label="Jumlah Subtotal (Plafon Maksimal)"
                      value={formatIDR(jumlah)}
                      disabled
                      className="text-right text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100/70 dark:bg-slate-800/70"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-Seksi: Tabel LPJ dan Bukti Kwitansi di bawah Item Kegiatan */}
              <div className="p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/40">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Rincian Kwitansi & Bukti Nota LPJ
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {lpjList.length} Kwitansi
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddLpjRow(itemIdx)}
                    disabled={isZeroBiaya || isFullyAllocated}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-md text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
                    title={
                      isZeroBiaya
                        ? "Isi Biaya (Rp) terlebih dahulu sebagai patokan"
                        : isFullyAllocated
                        ? "Subtotal sudah mencapai batas maksimal"
                        : "Tambah kwitansi LPJ"
                    }
                  >
                    <Plus className="w-3 h-3 text-primary" />
                    <span>Tambah Kwitansi / Bukti LPJ</span>
                  </button>
                </div>

                {/* Tabel Detail Kwitansi LPJ */}
                <div className="overflow-x-auto rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <table className="w-full text-left border-collapse min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                        <th className="px-3 py-2 w-10 text-center">No</th>
                        <th className="px-3 py-2 w-36 min-w-[130px]">Tanggal Kwitansi</th>
                        <th className="px-3 py-2 w-36 min-w-[140px]">No. Kwitansi / Struk</th>
                        <th className="px-3 py-2 min-w-[200px]">Uraian Belanja / Keterangan</th>
                        <th className="px-3 py-2 w-44 min-w-[160px] text-right">Nominal (Rp)</th>
                        <th className="px-3 py-2 w-44 min-w-[160px]">
                          <span className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3 text-slate-400" />
                            Bukti Nota / Struk
                          </span>
                        </th>
                        <th className="px-3 py-2 w-12 text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {lpjList.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-3 py-6 text-center text-slate-400 dark:text-slate-500 bg-slate-50/20 dark:bg-slate-800/10"
                          >
                            <div className="flex flex-col items-center justify-center gap-1">
                              <Receipt className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                              <span className="text-[11px] font-medium">
                                Belum ada kwitansi / bukti nota LPJ untuk item kegiatan ini.
                              </span>
                              {!isZeroBiaya && !isFullyAllocated && (
                                <button
                                  type="button"
                                  onClick={() => handleAddLpjRow(itemIdx)}
                                  className="text-primary hover:underline text-[11px] font-semibold cursor-pointer"
                                >
                                  + Tambah kwitansi/nota LPJ pertama
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        lpjList.map((lpj, lpjIdx) => {
                          const otherLpjSum = lpjList.reduce(
                            (acc, curr, i) => (i === lpjIdx ? acc : acc + (Number(curr.kredit) || 0)),
                            0
                          );
                          const maxAllowedForThisRow = Math.max(0, jumlah - otherLpjSum);

                          return (
                            <tr
                              key={lpjIdx}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              <td className="px-3 py-2 text-center font-semibold text-slate-400 dark:text-slate-500 text-[11px]">
                                {lpjIdx + 1}
                              </td>

                              <td className="px-3 py-2">
                                <Input
                                  variant="date"
                                  id={`tgl-${itemIdx}-${lpjIdx}`}
                                  value={lpj.tanggal}
                                  onChange={(e) =>
                                    handleUpdateLpjRow(itemIdx, lpjIdx, "tanggal", e.target.value)
                                  }
                                  placeholder="YYYY-MM-DD"
                                  className="text-xs py-1"
                                />
                              </td>

                              <td className="px-3 py-2">
                                <Input
                                  value={lpj.noKwitansi}
                                  onChange={(e) =>
                                    handleUpdateLpjRow(itemIdx, lpjIdx, "noKwitansi", e.target.value)
                                  }
                                  placeholder="Contoh: KW-001/2026"
                                  className="text-xs py-1"
                                />
                              </td>

                              <td className="px-3 py-2">
                                <Input
                                  value={lpj.keterangan}
                                  onChange={(e) =>
                                    handleUpdateLpjRow(itemIdx, lpjIdx, "keterangan", e.target.value)
                                  }
                                  placeholder="Uraian belanja barang / jasa..."
                                  className="text-xs py-1"
                                />
                              </td>

                              <td className="px-3 py-2 text-right">
                                <div className="space-y-0.5">
                                  <Input
                                    variant="currency"
                                    value={
                                      lpj.kredit !== undefined && lpj.kredit !== null ? lpj.kredit : ""
                                    }
                                    max={maxAllowedForThisRow}
                                    onChange={(e) =>
                                      handleUpdateLpjRow(
                                        itemIdx,
                                        lpjIdx,
                                        "kredit",
                                        e.target.value !== "" ? Number(e.target.value) : 0
                                      )
                                    }
                                    placeholder="Rp 0"
                                    className="text-right text-xs py-1 font-medium"
                                  />
                                  {jumlah > 0 && (
                                    <span className="text-[10px] text-slate-400 block text-right">
                                      Maks: {formatIDR(maxAllowedForThisRow)}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="px-3 py-2">
                                <InlineFileUpload
                                  fileUrl={lpj.buktiUrl}
                                  fileName={lpj.buktiNama}
                                  accept=".pdf,.jpg,.jpeg,.png,image/*,application/pdf"
                                  onUpload={(file) => handleBuktiUpload(itemIdx, lpjIdx, file)}
                                  onRemove={() => handleBuktiRemove(itemIdx, lpjIdx)}
                                />
                              </td>

                              <td className="px-3 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLpjRow(itemIdx, lpjIdx)}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Hapus kwitansi ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Status Baris Kwitansi & Kesesuaian Terhadap Patokan Subtotal */}
                <div className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isZeroBiaya ? (
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Tentukan Biaya (Rp) item di atas terlebih dahulu sebagai patokan plafon.
                      </span>
                    ) : isOverBudget ? (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Total sub item ({formatIDR(totalLpjKredit)}) melebihi subtotal patokan (
                        {formatIDR(jumlah)}).
                      </span>
                    ) : isMatched ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Total sub item telah memenuhi 100% dari subtotal patokan ({formatIDR(jumlah)})
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        Total Sub Item:{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {formatIDR(totalLpjKredit)}
                        </strong>{" "}
                        / Plafon:{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {formatIDR(jumlah)}
                        </strong>
                      </span>
                    )}
                  </div>

                  {!isZeroBiaya && !isOverBudget && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        Sisa Alokasi:{" "}
                        <strong
                          className={
                            sisaKuota === 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-primary dark:text-primary-light"
                          }
                        >
                          {formatIDR(sisaKuota)}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Total Summary Card */}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            Total Nominal Reimbursement:
          </span>
          <span className="text-[11px] text-slate-400">({items.length} item kegiatan)</span>
        </div>
        <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          {formatIDR(totalNominal)}
        </span>
      </div>
    </FormCardSection>
  );
}
