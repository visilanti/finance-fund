"use client";

import React, { useState, useMemo } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { KelompokRKA } from "@/features/pengajuan/types";
import { MOCK_KELOMPOK_RKA } from "@/features/pengajuan/services/divisiPengajuan.service";
import { formatIDR } from "@/lib/utils";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface RKAMatrixDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  kelompokRkaList?: KelompokRKA[];
}

export function RKAMatrixDrawer({
  isOpen,
  onClose,
  kelompokRkaList,
}: RKAMatrixDrawerProps) {
  const [selectedKelompokName, setSelectedKelompokName] = useState<string>("all");

  const dataRKA = useMemo(
    () => (kelompokRkaList && kelompokRkaList.length > 0 ? kelompokRkaList : MOCK_KELOMPOK_RKA),
    [kelompokRkaList]
  );

  const kelompokFilterOptions = useMemo(() => {
    return [
      { label: "Semua Kelompok RKA", value: "all" },
      ...dataRKA.map((k) => ({ label: k.namaKelompok, value: k.namaKelompok })),
    ];
  }, [dataRKA]);

  // Flatten rows to show each activity and its monthly budget
  const flattenedRows = useMemo(() => {
    const listToProcess =
      selectedKelompokName === "all"
        ? dataRKA
        : dataRKA.filter((k) => k.namaKelompok === selectedKelompokName);

    return listToProcess.flatMap((kel) =>
      kel.DetailItemRKA.flatMap((keg) =>
        keg.detail.map((d) => ({
          namaKelompok: kel.namaKelompok,
          kegiatanRka: keg.kegiatanRka,
          bulan: d.bulan,
          budget: d.budget,
        }))
      )
    );
  }, [dataRKA, selectedKelompokName]);

  // Total alokasi budget
  const totalAlokasiRKA = useMemo(() => {
    return flattenedRows.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  }, [flattenedRows]);

  const totalKegiatanCount = useMemo(() => {
    return new Set(flattenedRows.map((r) => r.kegiatanRka)).size;
  }, [flattenedRows]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-xl"
      title="Detail Alokasi Pagu RKA"
      subtitle="Daftar kegiatan, jadwal bulan, dan alokasi anggaran RKA"
    >
      <div className="space-y-4">
        {/* Filter Kelompok RKA */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Filter Kelompok RKA:
          </label>
          <Select
            value={selectedKelompokName}
            onChange={(val: any) => {
              const str = typeof val === "string" ? val : val?.target?.value || "all";
              setSelectedKelompokName(str);
            }}
            options={kelompokFilterOptions}
            isSearchable={true}
          />
        </div>

        {/* Summary Card Top */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Total Alokasi RKA</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {formatIDR(totalAlokasiRKA)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Total Kegiatan</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {totalKegiatanCount} Kegiatan
            </span>
          </div>
        </div>

        {/* Table Detail Item RKA */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                <th className="py-2.5 px-3 w-10 text-center">No</th>
                <th className="py-2.5 px-3">Kegiatan RKA</th>
                <th className="py-2.5 px-3">Bulan</th>
                <th className="py-2.5 px-3 text-right">Alokasi RKA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {flattenedRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 dark:text-slate-500">
                    Tidak ada kegiatan RKA ditemukan
                  </td>
                </tr>
              ) : (
                flattenedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center text-slate-400 dark:text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {row.kegiatanRka}
                      </div>
                      {selectedKelompokName === "all" && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {row.namaKelompok}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {row.bulan}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {formatIDR(row.budget)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {flattenedRows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 font-bold">
                  <td colSpan={3} className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    Total
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    {formatIDR(totalAlokasiRKA)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </Drawer>
  );
}

