"use client";

import React from "react";
import { Drawer } from "@/components/shared/Drawer";
import { COAOption } from "@/features/pengajuan/services/pengajuanService.types";
import { formatIDR, cn } from "@/lib/utils";

interface RKAMatrixDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoa?: COAOption | null;
}

export function RKAMatrixDrawer({
  isOpen,
  onClose,
  selectedCoa,
}: RKAMatrixDrawerProps) {
  const defaultCoa: COAOption = {
    code: "5.1.02.01",
    name: "Belanja Peralatan & Perangkat IT",
    category: "Belanja Modal (CAPEX)",
    plafonTahunan: 500000000,
    sisaBulanIni: 65000000,
    monthlyBreakdown: [
      { month: "Jan", budget: 40000000, terpakai: 38000000, sisa: 2000000 },
      { month: "Feb", budget: 40000000, terpakai: 40000000, sisa: 0 },
      { month: "Mar", budget: 70000000, terpakai: 5000000, sisa: 65000000 },
      { month: "Apr", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Mei", budget: 40000000, terpakai: 0, sisa: 40000000 },
      { month: "Jun", budget: 40000000, terpakai: 0, sisa: 40000000 },
      { month: "Jul", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Agu", budget: 40000000, terpakai: 0, sisa: 40000000 },
      { month: "Sep", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Okt", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Nov", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Des", budget: 50000000, terpakai: 0, sisa: 50000000 },
    ],
  };

  const displayCoa = selectedCoa || defaultCoa;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-lg"
      title="Matriks Alokasi RKA 12 Bulan"
      footerActions={
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 px-4 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer"
        >
          Tutup Matriks
        </button>
      }
    >
      <div className="space-y-4">
        {/* Summary Card Top */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-400 block font-medium">Total Plafon Tahunan</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {formatIDR(displayCoa.plafonTahunan)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 dark:text-slate-400 block font-medium">Sisa Plafon Bulan Ini</span>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              {formatIDR(displayCoa.sisaBulanIni)}
            </span>
          </div>
        </div>

        {/* Breakdown Table 12 Months */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                <th className="py-2 px-3">Bulan</th>
                <th className="py-2 px-3 text-right">Alokasi RKA</th>
                <th className="py-2 px-3 text-right">Terpakai</th>
                <th className="py-2 px-3 text-right">Sisa Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {displayCoa.monthlyBreakdown.map((m, idx) => (
                <tr
                  key={idx}
                  className={cn(m.month === "Mar" && "bg-red-50/40 dark:bg-red-950/40 font-bold")}
                >
                  <td className="py-2 px-3 text-slate-800 dark:text-slate-200">{m.month}</td>
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
      </div>
    </Drawer>
  );
}
