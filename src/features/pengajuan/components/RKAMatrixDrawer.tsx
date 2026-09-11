"use client";

import React, { useState, useEffect } from "react";
import { COAOption } from "../services/pengajuanService.types";
import { formatIDR, cn } from "@/lib/utils";
import { Drawer } from "@/components/shared/Drawer/Drawer";

interface RKAMatrixDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoa: COAOption | null;
}

export function RKAMatrixDrawer({
  isOpen,
  onClose,
  selectedCoa,
}: RKAMatrixDrawerProps) {
  const [activeCoa, setActiveCoa] = useState<COAOption | null>(selectedCoa);

  useEffect(() => {
    if (selectedCoa) {
      setActiveCoa(selectedCoa);
    }
  }, [selectedCoa]);

  const displayCoa = selectedCoa || activeCoa;
  if (!displayCoa) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-lg"
      title="Matriks Alokasi RKA 12 Bulan"
      subtitle={`Mata Anggaran: ${displayCoa.code} - ${displayCoa.name}`}
      footerActions={
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 px-4 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer"
        >
          Tutup Matriks RKA
        </button>
      }
    >
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 dark:text-slate-400 block font-medium">Total Plafon Tahunan</span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {formatIDR(displayCoa.plafonTahunan)}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-400 block font-medium">Sisa Plafon Bulan Ini</span>
          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            {formatIDR(displayCoa.sisaBulanIni)}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
              <th className="py-2 px-3">Bulan</th>
              <th className="py-2 px-3 text-right">Budget</th>
              <th className="py-2 px-3 text-right">Terpakai</th>
              <th className="py-2 px-3 text-right">Sisa Plafon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {displayCoa.monthlyBreakdown.map((m) => (
              <tr
                key={m.month}
                className={cn(m.month === "Mar" && "bg-red-50/40 dark:bg-red-950/40 font-bold")}
              >
                <td className="py-2 px-3 text-slate-800 dark:text-slate-200">
                  {m.month} {m.month === "Mar" && "(Bulan Ini)"}
                </td>
                <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">
                  {formatIDR(m.budget)}
                </td>
                <td className="py-2 px-3 text-right text-slate-500 dark:text-slate-400">
                  {formatIDR(m.terpakai)}
                </td>
                <td
                  className={cn(
                    "py-2 px-3 text-right font-semibold",
                    m.sisa > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {formatIDR(m.sisa)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Drawer>
  );
}

