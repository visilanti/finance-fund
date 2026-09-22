"use client";

import { Drawer } from "@/components/shared/Drawer";
import { LPJBase, DetailItemLPJ } from "@/features/lpj/types";
import { formatIDR } from "@/lib/utils";
import { Printer, Download, ExternalLink, FileText, Receipt, AlertCircle, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/Card";

export interface LPJDetailDrawerProps {
  item: LPJBase | null;
  onClose: () => void;
  onOpenUpload?: (item: LPJBase) => void;
}

export function LPJDetailDrawer({ item, onClose, onOpenUpload }: LPJDetailDrawerProps) {
  if (!item) return null;

  const rawItems = item.rincian?.item || [];
  const items: DetailItemLPJ[] = rawItems.length > 0
    ? (rawItems.some((it) => it.keterangan?.toLowerCase().startsWith("pencairan dana"))
      ? rawItems
      : [
        {
          tanggal: item.tanggalCair,
          noKwitansi: "-",
          keterangan: `Pencairan Dana — ${item.jenis}`,
          debit: item.saldoAwal,
          kredit: 0,
        },
        ...rawItems,
      ])
    : [];

  const totalDebit = item.saldoAwal;
  const totalKredit = items.reduce((acc, curr) => acc + (Number(curr.kredit) || 0), 0);

  let running = 0;
  const runningSaldos = items.map((it, idx) => {
    if (idx === 0) {
      running = Number(it.debit) || item.saldoAwal;
    } else {
      running = running + (Number(it.debit) || 0) - (Number(it.kredit) || 0);
    }
    return running;
  });

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "belum_lpj":
        return { variant: "warning" as const, label: "Belum LPJ" };
      case "submit":
        return { variant: "info" as const, label: "Submit" };
      case "revisi":
        return { variant: "error" as const, label: "Revisi" };
      case "disetujui":
        return { variant: "success" as const, label: "Disetujui" };
      default:
        return { variant: "neutral" as const, label: status };
    }
  };

  const badgeProps = getStatusBadgeProps(item.status);
  const isUploadAllowed = item.status === "belum_lpj" || item.status === "revisi";

  return (
    <Drawer
      isOpen={!!item}
      onClose={onClose}
      maxWidthClass="max-w-[560px] min-w-[min(480px,100vw)]"
      title={
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
          Detail LPJ - {item.noPengajuan}
        </h3>
      }
      subtitle={
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Jenis: {item.jenis} • Tanggal Cair: {item.tanggalCair}
        </span>
      }
      footerActions={
        isUploadAllowed ? (
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
            >
              Print
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                if (onOpenUpload) {
                  onOpenUpload(item);
                } else {
                  window.location.href = `/lpj/create?id=${item.id}`;
                }
              }}
            >
              Isi LPJ
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            leftIcon={<Printer className="w-3 h-3" />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        )
      }
    >
      <div className="space-y-4 text-xs">
        {/* Banner jika status revisi */}
        {item.status === "revisi" && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs">LPJ Perlu Revisi</p>
              <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">
                Terdapat ketidaksesuaian kwitansi atau bukti dukung. Silakan lakukan upload ulang berkas LPJ yang telah diperbaiki.
              </p>
            </div>
          </div>
        )}

        {/* Informasi Utama Pengajuan */}
        <Card variant="secondary" className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nomor Pengajuan</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {item.noPengajuan}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Jenis Pengajuan</span>
            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
              {item.jenis}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Tanggal Pencairan</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.tanggalCair}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Status LPJ</span>
            <StatusBadge
              status={item.status}
              variant={badgeProps.variant}
              label={badgeProps.label}
            />
          </div>
        </Card>

        {/* Ringkasan Finansial: Saldo Awal, Saldo Akhir, Silpa */}
        <div className="grid grid-cols-3 gap-2.5">
          <Card variant="secondary" className="p-3 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-400 tracking-wider">
              Saldo Awal
            </span>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1 whitespace-nowrap">
              {formatIDR(item.saldoAwal)}
            </div>
          </Card>
          <Card variant="secondary" className="p-3 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-400 tracking-wider">
              Saldo Akhir
            </span>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mt-1 whitespace-nowrap">
              {item.saldoAkhir !== undefined ? formatIDR(item.saldoAkhir) : "-"}
            </div>
          </Card>
          <Card variant="secondary" className="p-3 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-400 tracking-wider">
              SiLPA
            </span>
            <div className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 whitespace-nowrap">
              {item.silpa !== undefined ? formatIDR(item.silpa) : "-"}
            </div>
          </Card>
        </div>

        {/* Tabel Rincian Transaksi */}
        <Card
          variant="primary"
          title="Rincian Transaksi LPJ"
          leftIcon={<Receipt className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200" />}
          action={<span className="text-[11px] font-medium text-slate-500">{items.length} item</span>}
          className="p-0 overflow-hidden space-y-0"
          headerClassName="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800"
        >
          {items.length === 0 ? (
            <div className="p-6 text-center text-slate-400 dark:text-slate-500">
              <p className="font-medium text-xs">Belum ada rincian item transaksi.</p>
              <p className="text-[11px] mt-1">
                {item.status === "belum_lpj"
                  ? "Unggah berkas LPJ untuk memperbarui laporan dan rincian transaksi."
                  : "Rincian belum diinputkan ke sistem."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-2.5 font-semibold">Tanggal & Kwitansi</th>
                    <th className="p-2.5 font-semibold">Keterangan</th>
                    <th className="p-2.5 font-semibold text-right">Debit</th>
                    <th className="p-2.5 font-semibold text-right">Kredit</th>
                    <th className="p-2.5 font-semibold text-right">Saldo</th>
                    <th className="p-2.5 font-semibold">Bukti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {items.map((it, idx) => {
                    // Baris pencairan awal tidak perlu bukti
                    const isPencairan = it.keterangan?.toLowerCase().startsWith("pencairan dana");
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-2.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{it.tanggal}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{it.noKwitansi || "-"}</div>
                        </td>
                        <td className="p-2.5">
                          <div className="font-medium text-slate-700 dark:text-slate-300 max-w-xs">
                            {it.keterangan}
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {it.debit > 0 ? formatIDR(it.debit) : "-"}
                        </td>
                        <td className="p-2.5 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {it.kredit > 0 ? formatIDR(it.kredit) : "-"}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {formatIDR(runningSaldos[idx])}
                        </td>
                        {/* Kolom Bukti Nota */}
                        <td className="p-2.5">
                          {isPencairan ? (
                            <span className="text-slate-300 dark:text-slate-700 text-[10px] italic">—</span>
                          ) : it.buktiUrl ? (
                            <a
                              href={it.buktiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={it.buktiNama}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-semibold transition-colors max-w-[90px] truncate"
                            >
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{it.buktiNama ?? "Lihat"}</span>
                            </a>
                          ) : (
                            <span
                              title="Bukti nota belum diunggah"
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-200 dark:border-amber-800/50"
                            >
                              <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                              Belum
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                    <td colSpan={2} className="p-2.5 text-right">Total:</td>
                    <td className="p-2.5 text-right text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatIDR(totalDebit)}
                    </td>
                    <td className="p-2.5 text-right text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatIDR(totalKredit)}
                    </td>
                    <td className="p-2.5 text-right font-extrabold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {formatIDR(runningSaldos[runningSaldos.length - 1] ?? item.saldoAwal)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </Card>
      </div>
    </Drawer>
  );
}
