"use client";

import React, { useState, useEffect } from "react";
import { TaskModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/Button";
import { DetailItemLPJ } from "../types";
import { formatIDR } from "@/lib/utils";
import { Send, FileText, CheckCircle2, ShieldCheck, Wallet, ArrowDownRight, Coins } from "lucide-react";

export interface PernyataanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  namaPenerima?: string;
  divisi?: string;
  tanggalCair: string;
  noPengajuan: string;
  jenis: string;
  saldoAwal: number;
  saldoAkhir: number;
  silpa: number;
  items: DetailItemLPJ[];
}

function formatIndonesianDate(dateStr?: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function PernyataanModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  namaPenerima = "Budi Santoso",
  divisi = "Divisi IT",
  tanggalCair,
  noPengajuan,
  jenis,
  saldoAwal,
  saldoAkhir,
  silpa,
  items,
}: PernyataanModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);

  // Reset agreement checkbox when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsAgreed(false);
    }
  }, [isOpen]);

  const totalPengeluaran = items.reduce(
    (acc, curr) => acc + (Number(curr.kredit) || 0),
    0
  );

  return (
    <TaskModal
      isOpen={isOpen}
      onClose={onClose}
      title="Pernyataan Tanggung Jawab Belanja (LPJ)"
      taskCode={noPengajuan}
      size="xl"
      isLoading={isLoading}
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
           Periksa Kembali
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            leftIcon={<Send className="w-4 h-4" />}
            disabled={!isAgreed || isLoading}
            isLoading={isLoading}
            onClick={onConfirm}
          >
            Selesaikan LPJ
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Paragraf Pernyataan Resmi */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-slate-700 dark:text-slate-300 leading-relaxed text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
            <span>Surat Pernyataan Pertanggungjawaban Dana</span>
          </div>
          <p>
            Pada tanggal{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatIndonesianDate(tanggalCair)}
            </span>
            , saya{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {namaPenerima}
            </span>{" "}
            selaku{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {divisi}
            </span>{" "}
            telah menerima pencairan dana dari Bendahara sebesar{" "}
            <span className="font-bold text-primary dark:text-red-400">
              {formatIDR(saldoAwal)}
            </span>{" "}
            untuk pengajuan{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {noPengajuan} — {jenis}
            </span>{" "}
            dengan rekapitulasi sebagai berikut:
          </p>
        </div>

        {/* Rekapitulasi Keuangan Ringkas */}
        <div>
          <h4 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Rekapitulasi Saldo & Realisasi
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Saldo Awal */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Saldo Awal</span>
                <Wallet className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {formatIDR(saldoAwal)}
              </div>
            </div>

            {/* Total Realisasi */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Total Realisasi</span>
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {formatIDR(totalPengeluaran)}
              </div>
            </div>

            {/* Saldo Akhir */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-medium">Saldo Akhir</span>
                <Coins className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {formatIDR(saldoAkhir)}
              </div>
            </div>

            {/* Saldo SiLPA */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
                <span className="text-[11px] font-medium">Saldo SiLPA</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {formatIDR(silpa)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Rincian Transaksi */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold upercase tracking-wider text-slate-500 dark:text-slate-400">
              Rincian Transaksi Belanja ({items.length} item)
            </h4>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-3 w-28">Tanggal</th>
                    <th className="py-2.5 px-3 w-36">No. Kwitansi</th>
                    <th className="py-2.5 px-3">Keterangan</th>
                    <th className="py-2.5 px-3 w-32 text-right">Pengeluaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-slate-400 italic text-xs"
                      >
                        Belum ada rincian transaksi belanja yang diinput.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2 px-3 text-center text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                          {formatIndonesianDate(item.tanggal)}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {item.noKwitansi || "-"}
                        </td>
                        <td className="py-2 px-3 text-slate-800 dark:text-slate-200 font-medium">
                          {item.keterangan || "-"}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                          {formatIDR(Number(item.kredit) || 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Checkbox Konfirmasi Pernyataan */}
        <div className="pt-1">
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              disabled={isLoading}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary cursor-pointer shrink-0"
            />
            <span className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              Saya menyatakan bahwa rincian di atas adalah benar dan telah saya pergunakan sesuai dengan peruntukan pengajuan yang disetujui.
            </span>
          </label>
        </div>
      </div>
    </TaskModal>
  );
}