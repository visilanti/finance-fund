"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { PencairanItem } from "../../types";
import { formatIDR, numberToTerbilang } from "@/lib/utils";
import { Printer, CreditCard, Copy, Check, ExternalLink, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/Card";
import { ProgressLineChecklist } from "@/features/pengajuan/components/drawer/ProgressLineChecklist";
import { DrawerRkaContent } from "@/features/pengajuan/components/drawer/DrawerRkaContent";
import { DrawerInsidentalContent } from "@/features/pengajuan/components/drawer/DrawerInsidentalContent";
import { DrawerReimbursementContent } from "@/features/pengajuan/components/drawer/DrawerReimbursementContent";

export interface PencairanDetailDrawerProps {
  item: PencairanItem | null;
  onClose: () => void;
  onCairkanClick?: (item: PencairanItem) => void;
}

export function PencairanDetailDrawer({
  item,
  onClose,
  onCairkanClick,
}: PencairanDetailDrawerProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!item) return null;

  const isSudahCair = item.statusPencairan === "selesai" || Boolean(item.buktiTransferUrl);

  const handleCopyRekening = () => {
    if (item.rekeningTujuan?.nomorRekening) {
      navigator.clipboard.writeText(item.rekeningTujuan.nomorRekening);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const nominalCair = item.nominalDiterima || item.nominalPengajuan;

  // Fallback items data
  const rkaItems =
    item.jenis === "RKA" && item.itemsRka
      ? item.itemsRka
      : [
          {
            kelompok: item.kelompok || "Belanja Modal (CAPEX)",
            kegiatanRka: item.kegiatan,
            bulan: "Maret 2026",
            budget: Math.round(nominalCair * 1.15),
            nominal: nominalCair,
          },
        ];

  const genericItems =
    item.jenis === "Reimbursement" && item.itemsReimbursement
      ? item.itemsReimbursement
      : item.jenis === "Insidental" && item.itemsInsidental
      ? item.itemsInsidental
      : [
          {
            keterangan: item.kegiatan,
            volume: 1,
            biaya: nominalCair,
            jumlah: nominalCair,
          },
        ];

  return (
    <Drawer
      isOpen={!!item}
      onClose={onClose}
      maxWidthClass="max-w-[540px] min-w-[min(440px,100vw)]"
      title={
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {item.kelompok ? `${item.kelompok} - ` : ""}
            {item.kegiatan}
          </h3>
        </div>
      }
      footerActions={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="outline"
            size="md"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
          >
            Print
          </Button>

          {!isSudahCair && onCairkanClick && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<CreditCard className="w-3.5 h-3.5" />}
              onClick={() => onCairkanClick(item)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              Upload Bukti & Cairkan
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Status Banner Pencairan */}
        {isSudahCair ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pencairan Dana Telah Selesai</span>
              </div>
              {item.tanggalPencairan && (
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  {item.tanggalPencairan}
                </span>
              )}
            </div>

            {item.catatanFinance && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                "{item.catatanFinance}"
              </p>
            )}

            {/* Bukti Transfer Box */}
            {item.buktiTransferUrl && (
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Lampiran Bukti Transfer:
                </span>
                <div className="relative group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 max-h-48">
                  <img
                    src={item.buktiTransferUrl}
                    alt="Bukti Transfer Bank"
                    className="w-full object-cover max-h-48 hover:scale-105 transition-transform duration-200"
                  />
                  <a
                    href={item.buktiTransferUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-semibold text-xs"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka Bukti Ukuran Penuh</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1 min-w-0">
              <h4 className="font-bold text-amber-900 dark:text-amber-200">
                Menunggu Pencairan Dana oleh Finance
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                Pengajuan ini telah disetujui. Silakan lakukan proses transfer ke rekening tujuan di bawah, lalu unggah bukti transfer untuk mengubah status menjadi <strong>Selesai</strong>.
              </p>
              {onCairkanClick && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onCairkanClick(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Upload Bukti & Selesaikan</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informasi Utama Pengajuan */}
        <Card variant="secondary" className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nomor Kode</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{item.kode}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Divisi Pengaju</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.divisi}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Tanggal Pengajuan</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {item.tanggalPengajuan}
            </span>
          </div>
          {item.harapanRealisasi && (
            <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Target Realisasi</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {item.harapanRealisasi}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Status Pencairan</span>
            <span className="font-semibold">
              <StatusBadge
                status={isSudahCair ? "selesai" : "diproses"}
                label={isSudahCair ? "Selesai" : "Dalam Proses"}
                variant={isSudahCair ? "success" : "warning"}
              />
            </span>
          </div>
        </Card>

        {/* Rekening Tujuan Penerima Dana */}
        <Card
          variant="secondary"
          title="Rekening Tujuan Transfer"
          leftIcon={<CreditCard className="w-3.5 h-3.5 text-slate-400" />}
          className="p-3.5 space-y-2.5"
          headerClassName="pb-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nama Bank</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {item.rekeningTujuan?.namaBank || "Bank Mandiri"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nomor Rekening</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {item.rekeningTujuan?.nomorRekening || "-"}
              </span>
              {item.rekeningTujuan?.nomorRekening && (
                <button
                  type="button"
                  onClick={handleCopyRekening}
                  className="p-1 rounded text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Salin Nomor Rekening"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Atas Nama Rekening</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {item.rekeningTujuan?.namaPemilikRekening || item.divisi}
            </span>
          </div>
        </Card>

        {/* Box Nominal Pencairan */}
        <Card variant="secondary" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nominal yang Dicairkan</span>
            <span className="text-xs font-semibold text-slate-400">
              (Disetujui Bendahara)
            </span>
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatIDR(nominalCair)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block italic font-medium">
            "{numberToTerbilang(nominalCair)}"
          </span>
          {item.nominalPengajuan !== nominalCair && (
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/50">
              Nominal awal pengajuan: <span className="font-semibold">{formatIDR(item.nominalPengajuan)}</span>
            </div>
          )}
        </Card>

        {/* Detail Usulan / Item Breakdown */}
        {item.jenis === "RKA" && (
          <DrawerRkaContent
            items={rkaItems}
            rekening={item.rekeningTujuan}
            pengesahan={item.pengesahan}
            itemId={item.id}
          />
        )}

        {item.jenis === "Reimbursement" && (
          <DrawerReimbursementContent
            jenis={item.jenis}
            items={genericItems}
            rekening={item.rekeningTujuan}
            pengesahan={item.pengesahan}
            itemId={item.id}
            buktiUrl={item.buktiPembayaranUrl}
          />
        )}

        {item.jenis === "Insidental" && (
          <DrawerInsidentalContent
            jenis={item.jenis}
            items={genericItems}
            rekening={item.rekeningTujuan}
            pengesahan={item.pengesahan}
            itemId={item.id}
          />
        )}

        {/* Workflow Checklist Timeline */}
        <ProgressLineChecklist item={item as any} />
      </div>
    </Drawer>
  );
}
