"use client";

import React from "react";
import { Drawer } from "@/components/shared/Drawer";
import {
  PengajuanDanaItem,
  DetailItemRKA,
  DetailItemReimbursement,
} from "@/features/pengajuan/types";
import { formatIDR, numberToTerbilang } from "@/lib/utils";
import { Printer, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card } from "@/components/ui/Card";
import { RejectionBanner } from "./RejectionBanner";
import { ProgressLineChecklist } from "./ProgressLineChecklist";
import { DrawerRkaContent } from "./DrawerRkaContent";
import { DrawerReimbursementContent } from "./DrawerReimbursementContent";

export interface PengajuanDetailDrawerProps {
  item: PengajuanDanaItem | null;
  onClose: () => void;
  onApproveProcess?: (item: PengajuanDanaItem) => void;
  onEditRevisi?: (item: PengajuanDanaItem) => void;
}

export function PengajuanDetailDrawer({
  item,
  onClose,
  onEditRevisi,
}: PengajuanDetailDrawerProps) {
  if (!item) return null;

  const displayItem = item;

  const handleEditRevisi = () => {
    if (onEditRevisi) {
      onEditRevisi(displayItem);
    } else {
      onClose();
      const typeMap: Record<string, string> = {
        RKA: "rka",
        Insidental: "insidental",
        Reimbursement: "reimbursement",
      };
      const typeKey = typeMap[displayItem.jenis] || "rka";
      window.location.href = `/pengajuan/create?type=${typeKey}&editId=${displayItem.id}`;
    }
  };

  // Fallback / default data parsing based on specification
  const rkaItems: DetailItemRKA[] =
    displayItem.jenis === "RKA" && displayItem.itemsRka
      ? displayItem.itemsRka
      : [
        {
          kelompok: displayItem.kelompok || "Belanja Modal (CAPEX)",
          kegiatanRka: displayItem.kegiatan,
          bulan: "Maret 2026",
          budget: Math.round(displayItem.nominalPengajuan * 1.15),
          nominal: displayItem.nominalPengajuan,
        },
      ];

  const reimbItems: DetailItemReimbursement[] =
    displayItem.jenis === "Reimbursement" && displayItem.itemsReimbursement
      ? displayItem.itemsReimbursement
      : displayItem.jenis === "Insidental" && displayItem.itemsInsidental
        ? displayItem.itemsInsidental
        : [
          {
            keterangan: displayItem.kegiatan,
            volume: 1,
            biaya: displayItem.nominalPengajuan,
            jumlah: displayItem.nominalPengajuan,
          },
        ];

  const rekening =
    displayItem.rekeningTujuan
      ? displayItem.rekeningTujuan
      : {
        namaBank: "Bank Mandiri",
        nomorRekening: "137-00-1892019-4",
        namaPemilikRekening: "Divisi " + displayItem.divisi,
      };

  const pengesahan = displayItem.pengesahan || {
    namaTerang: "Drs. Hendra Wijaya, M.M.",
  };

  const buktiUrl =
    (displayItem.jenis === "Reimbursement"
      ? displayItem.buktiPembayaranUrl
      : "#") || "#";

  const isSelesai =
    displayItem.currentStatus?.toLowerCase() === "selesai" ||
    displayItem.currentStep?.toLowerCase() === "selesai";

  const rejectionCatatan = displayItem.riwayatStep?.find((r) => r.status === "ditolak")?.catatan;

  return (
    <Drawer
      isOpen={!!item}
      onClose={onClose}
      maxWidthClass="max-w-[520px] min-w-[min(420px,100vw)]"
      title={
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
          {displayItem.kelompok ? `${displayItem.kelompok} - ` : ""}
          {displayItem.kegiatan}
        </h3>
      }
      footerActions={
        displayItem.currentStatus === "ditolak" ? (
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
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={handleEditRevisi}
            >
              Revisi Pengajuan
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
        {/* Rejection Alert Banner if status is ditolak */}
        {displayItem.currentStatus === "ditolak" && (
          <RejectionBanner currentStep={displayItem.currentStep} alasan={rejectionCatatan} />
        )}

        {/* Informasi Utama Pengajuan */}
        <Card variant="secondary" className="p-3.5 space-y-2.5">
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
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {displayItem.tanggalPengajuan}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Harapan Realisasi</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {displayItem.harapanRealisasi}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Status Pengajuan</span>
            <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
              <StatusBadge status={displayItem.currentStatus} />
            </span>
          </div>
        </Card>

        {/* Nominal Pengajuan Box */}
        <Card variant="secondary" className="p-4">
          <span className="text-slate-400 dark:text-slate-400 font-medium">Nominal Pengajuan</span>
          <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
            {formatIDR(displayItem.nominalPengajuan)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block italic font-medium">
            "{numberToTerbilang(displayItem.nominalPengajuan)}"
          </span>
        </Card>

        {/* Nominal Diterima Box */}
        <Card variant="secondary" className="p-4">
          <span className="text-slate-400 dark:text-slate-400 font-medium">Nominal Diterima</span>
          {displayItem.nominalDiterima ? (
            <>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {formatIDR(displayItem.nominalDiterima)}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block italic font-medium">
                "{numberToTerbilang(displayItem.nominalDiterima)}"
              </span>
            </>
          ) : (
            <>
              <div className="text-lg font-extrabold text-slate-400 dark:text-slate-500 mt-0.5">
                -
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block italic font-medium">
                Belum melalui persetujuan Bendahara
              </span>
            </>
          )}
        </Card>

        {/* Dynamic Item Content based on Jenis Pengajuan */}
        {displayItem.jenis === "RKA" && (
          <DrawerRkaContent
            items={rkaItems}
            rekening={rekening}
            pengesahan={pengesahan}
            itemId={displayItem.id}
          />
        )}

        {(displayItem.jenis === "Reimbursement" || displayItem.jenis === "Insidental") && (
          <DrawerReimbursementContent
            jenis={displayItem.jenis}
            items={reimbItems}
            rekening={rekening}
            pengesahan={pengesahan}
            itemId={displayItem.id}
            buktiUrl={buktiUrl}
          />
        )}

        {/* Progress Line Checklist (5 Steps) */}
        <ProgressLineChecklist item={displayItem} />
      </div>
    </Drawer>
  );
}
