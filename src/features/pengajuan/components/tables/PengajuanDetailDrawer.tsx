"use client";

import React from "react";
import { Drawer } from "@/components/shared/Drawer";
import { PengajuanDanaItem } from "@/features/pengajuan/types";
import { formatIDR, cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  UserCheck,
  Paperclip,
  ExternalLink,
  Printer,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PengajuanDetailDrawerProps {
  item: PengajuanDanaItem | null;
  onClose: () => void;
  onApproveProcess?: (item: PengajuanDanaItem) => void;
}

function PengesahanCard({
  namaTerang,
  tandaTanganUrl,
  digisignId,
}: {
  namaTerang: string;
  tandaTanganUrl?: string;
  digisignId?: string;
}) {
  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1.5 flex flex-col justify-between">
      <div>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-slate-400" />
          Pengesahan
        </span>
        <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{namaTerang}</div>
      </div>

      {/* Preview Image Tanda Tangan Digital */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-1.5 flex flex-col items-center justify-center min-h-[46px]">
        {tandaTanganUrl && tandaTanganUrl !== "#" ? (
          <img
            src={tandaTanganUrl}
            alt="Tanda Tangan Digital"
            className="max-h-9 object-contain dark:invert dark:brightness-200"
          />
        ) : (
          <svg className="w-full h-8 text-blue-600 dark:text-blue-400" viewBox="0 0 200 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 35 Q 35 10, 55 30 T 95 15 T 135 40 T 175 10 M 75 42 C 95 50, 125 45, 145 35" />
          </svg>
        )}
        <div className="w-full text-center border-t border-dashed border-slate-200/80 dark:border-slate-800 pt-0.5 mt-0.5 text-[9px] font-mono text-slate-400">
          Digisign: #{digisignId || "DS-8821"}
        </div>
      </div>
    </div>
  );
}

function ProgressLineChecklist({ item }: { item: PengajuanDanaItem }) {
  const isRejected = item.status === "ditolak";
  const approver = item.approverNext?.toLowerCase() || "";

  let currentStepIndex = 0;
  if (item.status === "disetujui" || approver.includes("selesai")) {
    currentStepIndex = 4; // Selesai
  } else if (item.status === "diproses" || approver.includes("finance") || approver.includes("pencairan")) {
    currentStepIndex = 2; // Pencairan Finance
  } else if (approver.includes("bendahara") || approver.includes("treasury") || approver.includes("sdm")) {
    currentStepIndex = 1; // Bendahara
  } else {
    currentStepIndex = 0; // Manager
  }

  const stepsList = [
    { label: "Manager", sublabel: "Persetujuan Manager Divisi" },
    { label: "Bendahara", sublabel: "Verifikasi & Approval Yayasan" },
    { label: "Pencairan Finance", sublabel: "Transfer & Pencairan Dana" },
    { label: "Pembuatan LPJ", sublabel: "Laporan Pertanggungjawaban" },
    { label: "Selesai", sublabel: "Pengajuan & LPJ Tuntas" },
  ];

  return (
    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/50 pb-2.5">
        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Progress & Workflow Approval
        </span>
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          {item.approverNext}
        </span>
      </div>

      <div className="space-y-0 pt-1">
        {stepsList.map((step, idx) => {
          const isCompleted = idx < currentStepIndex && !isRejected;
          const isCurrent = idx === currentStepIndex && !isRejected;
          const isStepRejected = isRejected && idx === currentStepIndex;
          const isLast = idx === stepsList.length - 1;

          return (
            <div key={idx} className="flex items-stretch gap-3">
              {/* Icon & Vertical Line Column */}
              <div className="flex flex-col items-center shrink-0 w-5">
                {/* Circle Indicator */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-all shrink-0 mt-0.5",
                    isCompleted && "bg-emerald-500 text-white ring-2 ring-emerald-100 dark:ring-emerald-950",
                    isCurrent && "bg-primary text-white ring-4 ring-primary/20 animate-pulse",
                    isStepRejected && "bg-rose-500 text-white ring-2 ring-rose-100 dark:ring-rose-950",
                    !isCompleted && !isCurrent && !isStepRejected && "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : isStepRejected ? (
                    <X className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Bottom line segment connecting to next step (hidden for last item) */}
                {!isLast && (
                  <div
                    className={cn(
                      "w-[2px] flex-1 my-1 transition-colors min-h-[16px]",
                      idx < currentStepIndex ? "bg-emerald-500/80" : "bg-slate-200 dark:bg-slate-700/80"
                    )}
                  />
                )}
              </div>

              {/* Step Label & Detail */}
              <div className="flex-1 min-w-0 pt-0.5 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "font-semibold text-xs leading-5",
                      isCompleted && "text-slate-800 dark:text-slate-200",
                      isCurrent && "text-primary dark:text-red-400 font-bold",
                      isStepRejected && "text-rose-600 dark:text-rose-400 font-bold",
                      !isCompleted && !isCurrent && !isStepRejected && "text-slate-400 dark:text-slate-500 font-normal"
                    )}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-red-950 dark:text-red-400 border border-primary/20">
                      Aktif
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Selesai
                    </span>
                  )}
                </div>
                {step.sublabel && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
                    {step.sublabel}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PengajuanDetailDrawer({
  item,
  onClose,
  onApproveProcess,
}: PengajuanDetailDrawerProps) {
  if (!item) return null;

  const displayItem = item;

  // Fallback / default data parsing based on Untitled-1 specification
  const rkaItems = displayItem.itemsRka || [
    {
      kelompok: displayItem.kelompok || "Belanja Modal (CAPEX)",
      kegiatanRka: displayItem.kegiatan,
      bulan: "Maret 2026",
      budget: Math.round(displayItem.nominal * 1.15),
      nominal: displayItem.nominal,
    },
  ];

  const reimbItems = displayItem.itemsReimbursement || displayItem.itemsInsidental || [
    {
      keterangan: displayItem.kegiatan,
      volume: 1,
      biaya: displayItem.nominal,
      jumlah: displayItem.nominal,
    },
  ];

  const jaldisInfo = displayItem.informasiKwitansi || {
    nomor: displayItem.kode,
    tanggal: displayItem.tanggal,
    diberikanKepada: "Ahmad Subagja, S.Kom (NIP: 20240811)",
    terbilang: "Delapan Juta Enam Ratus Ribu Rupiah",
    tujuan: displayItem.kegiatan,
  };

  const jaldisItems = displayItem.itemsJaldis || [
    { uraian: "Tiket Pesawat & Transportasi Lokal", jumlah: Math.round(displayItem.nominal * 0.45) },
    { uraian: "Akomodasi & Penginapan Hotel", jumlah: Math.round(displayItem.nominal * 0.35) },
    { uraian: "Uang Saku & Uang Makan Harian", jumlah: Math.round(displayItem.nominal * 0.20) },
  ];

  const rekening = displayItem.rekeningTujuan || {
    namaBank: "Bank Mandiri",
    nomorRekening: "137-00-1892019-4",
    namaPemilikRekening: "Divisi " + displayItem.divisi,
  };

  const pengesahan = displayItem.pengesahan || {
    namaTerang: "Drs. Hendra Wijaya, M.M.",
  };

  const buktiUrl = displayItem.buktiPembayaranUrl || displayItem.buktiKwitansiUrl || "#";

  return (
    <Drawer
      isOpen={!!item}
      onClose={onClose}
      maxWidthClass="max-w-[520px] min-w-[min(420px,100vw)]"
      title={
        <>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {displayItem.kelompok ? `${displayItem.kelompok} - ` : ""}
            {displayItem.kegiatan}
          </h3>
        </>
      }
      footerActions={
        <Button
          variant="outline"
          className="w-full"
          leftIcon={<Printer className="w-3 h-3" />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Informasi Utama Pengajuan */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Kode</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{displayItem.kode}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Divisi Pengaju</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{displayItem.divisi}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Tanggal Pengajuan</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{displayItem.tanggal}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Harapan Realisasi</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {displayItem.harapanRealisasi || displayItem.tanggal}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Status Pengajuan</span>
            <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{displayItem.status}</span>
          </div>
        </div>

        {/* Nominal Pengajuan Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <span className="text-slate-400 dark:text-slate-400 font-medium">Nominal Pengajuan</span>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {formatIDR(displayItem.nominal)}
          </div>
        </div>


        {displayItem.jenis === "RKA" && (
          <div className="space-y-3">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200" />
                  Detail Item RKA
                </span>
                <span className="text-[11px] font-medium text-slate-500">{rkaItems.length} item</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-2.5 font-semibold">Kegiatan RKA</th>
                      <th className="p-2.5 font-semibold">Bulan</th>
                      <th className="p-2.5 font-semibold text-right">Budget</th>
                      <th className="p-2.5 font-semibold text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {rkaItems.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-2.5">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{it.kegiatanRka}</div>
                          <div className="text-[10px] text-slate-400">{it.kelompok}</div>
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">{it.bulan}</td>
                        <td className="p-2.5 text-right font-medium text-slate-500 whitespace-nowrap">
                          {formatIDR(it.budget)}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {formatIDR(it.nominal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rekening Tujuan & Pengesahan */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  Rekening Tujuan
                </span>
                <div className="font-bold text-slate-800 dark:text-slate-200">{rekening.namaBank}</div>
                <div className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{rekening.nomorRekening}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">a.n {rekening.namaPemilikRekening}</div>
              </div>
              <PengesahanCard
                namaTerang={pengesahan.namaTerang}
                tandaTanganUrl={pengesahan.tandaTanganUrl}
                digisignId={displayItem.id || "8821"}
              />
            </div>
          </div>
        )}

        {/* 2. Pengajuan Reimbursement & Insidental */}
        {(displayItem.jenis === "Reimbursement" || displayItem.jenis === "Insidental") && (
          <div className="space-y-3">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Detail Item {displayItem.jenis}
                </span>
                <span className="text-[11px] font-medium text-slate-500">{reimbItems.length} item</span>
              </div>
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
                    {reimbItems.map((it, idx) => (
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
            </div>

            {/* Rekening Tujuan & Pengesahan */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  Rekening Tujuan
                </span>
                <div className="font-bold text-slate-800 dark:text-slate-200">{rekening.namaBank}</div>
                <div className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{rekening.nomorRekening}</div>
                <div className="text-slate-500 dark:text-slate-400 text-[10px]">a.n {rekening.namaPemilikRekening}</div>
              </div>

              <PengesahanCard
                namaTerang={pengesahan.namaTerang}
                tandaTanganUrl={pengesahan.tandaTanganUrl}
                digisignId={displayItem.id || "8821"}
              />
            </div>

            {/* Bukti Pembayaran (Khusus Reimbursement) */}
            {displayItem.jenis === "Reimbursement" && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Bukti Pembayaran / Struk</div>
                    <div className="text-[10px] text-slate-400">Lampiran file bukti pengeluaran</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.open(buktiUrl, "_blank")}
                  className="px-2.5 py-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Lihat File
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. Pengajuan Perjalanan Dinas (Jaldis) */}
        {displayItem.jenis === "Perjalanan" && (
          <div className="space-y-3">
            {/* Informasi Kwitansi */}
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl space-y-2 text-amber-950 dark:text-amber-100">
              <div className="font-bold text-xs flex items-center justify-between border-b border-amber-200/60 dark:border-amber-900/40 pb-2">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Informasi Kwitansi Jaldis
                </span>
                <span className="text-[10px] font-mono bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-800 dark:text-amber-300">
                  {jaldisInfo.nomor}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-amber-700/70 dark:text-amber-400 block text-[10px]">Diberikan Kepada</span>
                  <span className="font-semibold">{jaldisInfo.diberikanKepada}</span>
                </div>
                <div>
                  <span className="text-amber-700/70 dark:text-amber-400 block text-[10px]">Tanggal Kwitansi</span>
                  <span className="font-semibold">{jaldisInfo.tanggal}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-amber-700/70 dark:text-amber-400 block text-[10px]">Tujuan Perjalanan</span>
                  <span className="font-medium">{jaldisInfo.tujuan}</span>
                </div>
                <div className="col-span-2 bg-white/60 dark:bg-amber-900/30 p-2 rounded border border-amber-200/50 dark:border-amber-800/40">
                  <span className="text-amber-700/70 dark:text-amber-400 block text-[10px]">Terbilang</span>
                  <span className="font-semibold italic text-[11px] text-amber-900 dark:text-amber-200">
                    "{jaldisInfo.terbilang}"
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Item Jaldis Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Rincian Biaya Perjalanan Dinas
                </span>
                <span className="text-[11px] font-medium text-slate-500">{jaldisItems.length} rincian</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-2.5 font-semibold">Uraian Pengeluaran</th>
                      <th className="p-2.5 font-semibold text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {jaldisItems.map((it, idx) => (
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
            </div>

            {/* Pengesahan & Bukti Kwitansi */}
            <div className="grid grid-cols-2 gap-3">
              <PengesahanCard
                namaTerang={pengesahan.namaTerang}
                tandaTanganUrl={pengesahan.tandaTanganUrl}
                digisignId={displayItem.id || "8821"}
              />

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Paperclip className="w-3 h-3 text-slate-400" />
                    Bukti Kwitansi
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lampiran kwitansi</div>
                </div>
                <button
                  type="button"
                  onClick={() => window.open(buktiUrl, "_blank")}
                  className="mt-2 w-full py-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  Lihat File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Line Checklist (5 Steps) */}
        <ProgressLineChecklist item={displayItem} />
      </div>
    </Drawer>
  );
}
