"use client";

import React, { useState, useEffect } from "react";
import { StatusBadge } from "@/components/shared/MasterDataTableShell";
import { PengajuanDanaItem } from "@/features/pengajuan/types";
import { formatIDR } from "@/lib/utils";
import { Drawer } from "@/components/shared/Drawer/Drawer";

interface PengajuanDetailDrawerProps {
  item: PengajuanDanaItem | null;
  onClose: () => void;
  onApproveProcess?: (item: PengajuanDanaItem) => void;
}

export function PengajuanDetailDrawer({
  item,
  onClose,
  onApproveProcess,
}: PengajuanDetailDrawerProps) {
  const [activeItem, setActiveItem] = useState<PengajuanDanaItem | null>(item);

  useEffect(() => {
    if (item) {
      setActiveItem(item);
    }
  }, [item]);

  const displayItem = item || activeItem;
  if (!displayItem) return null;

  return (
    <Drawer
      isOpen={Boolean(item)}
      onClose={onClose}
      title={
        <>
          <span className="text-xs font-bold text-primary dark:text-red-400 block">{displayItem.kode}</span>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">{displayItem.judul}</h3>
        </>
      }
      footerActions={
        <>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => onApproveProcess?.(displayItem)}
            className="flex-1 py-2 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-subtle transition-all cursor-pointer"
          >
            Proses Approval
          </button>
        </>
      }
    >
      <div>
        <span className="text-slate-400 dark:text-slate-400 font-medium">Nominal Pengajuan</span>
        <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
          {formatIDR(displayItem.nominal)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-lg">
          <span className="text-slate-400 dark:text-slate-400 font-medium block">Divisi Pengaju</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{displayItem.divisi}</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-lg">
          <span className="text-slate-400 dark:text-slate-400 font-medium block">Status Posisi</span>
          <StatusBadge status={displayItem.status} />
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span className="text-slate-400 dark:text-slate-400 font-medium block mb-1">Mata Anggaran (COA)</span>
        <span className="font-medium text-slate-800 dark:text-slate-200">{displayItem.coa}</span>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-lg">
        <span className="text-slate-400 dark:text-slate-400 font-medium block mb-1">Approver Selanjutnya</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{displayItem.approverNext}</span>
      </div>
    </Drawer>
  );
}

