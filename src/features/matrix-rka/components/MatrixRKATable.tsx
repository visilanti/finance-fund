"use client";

import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatIDR, cn } from "@/lib/utils";
import { MatrixTableRow } from "../types";
import { StatusIndicatorDot } from "./StatusIndicatorDot";
import { formatMatrixNumber, SHORT_MONTH_MAP } from "../services/rka.services";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/HoverCard";

interface MatrixRKATableProps {
  rows: MatrixTableRow[];
  months: readonly string[];
  tahun: number;
  expandedIds: Set<string>;
  onToggleNode: (id: string) => void;
  grandTotalPerMonth: Record<string, number>;
  grandTotalYear: number;
}

export function MatrixRKATable({
  rows,
  months,
  tahun,
  expandedIds,
  onToggleNode,
  grandTotalPerMonth,
  grandTotalYear,
}: MatrixRKATableProps) {
  const now = new Date();
  const currentMonthName = months[now.getMonth()];
  const isCurrentYear = tahun === now.getFullYear();
  const isCurrentMonth = (m: string) => isCurrentYear && m === currentMonthName;

  return (
    <div className="w-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card">
      <div className="overflow-auto relative max-h-[calc(100vh-260px)] sm:max-h-[78vh]">
        <table className="w-full text-left border-collapse text-xs select-none">
          <thead className="sticky top-0 z-20">
            <tr className="bg-[#d2392e] dark:bg-slate-800 text-white dark:text-slate-100 text-[11px] font-bold tracking-wider border-b border-[#b91c1c] dark:border-slate-700">
              {/* KETERANGAN Column - Sticky Top & Left */}
              <th className="py-3 px-4 min-w-[260px] sm:min-w-[320px] sticky top-0 sm:left-0 z-30 bg-[#d2392e] dark:bg-slate-800 text-white dark:text-slate-100 shadow-[1px_0_0_0_rgba(0,0,0,0.06)]">
                Keterangan
              </th>

              {/* 12 Bulan Columns - Sticky Top */}
              {months.map((m) => {
                const isCurrent = isCurrentMonth(m);
                return (
                  <th
                    key={m}
                    className={cn(
                      "py-3 px-3 min-w-[110px] w-28 text-right font-bold whitespace-nowrap text-white dark:text-slate-200 transition-colors sticky top-0 z-20",
                      isCurrent
                        ? "bg-[#991b1b] dark:bg-slate-700/90 font-extrabold"
                        : "bg-[#d2392e] dark:bg-slate-800"
                    )}
                  >
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <span>{m}</span>
                    </div>
                  </th>
                );
              })}

              {/* Total Column - Sticky Top */}
              <th className="py-3 px-4 min-w-[130px] text-right font-extrabold bg-[#991b1b] dark:bg-slate-900/90 whitespace-nowrap text-white dark:text-slate-100 sticky top-0 z-20">
                Total {tahun}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={months.length + 2}
                  className="py-12 text-center text-slate-400 dark:text-slate-500"
                >
                  Tidak ada data kegiatan RKA yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                // Baris Group (Level 0: A. KEGIATAN KURIKULUM)
                if (row.rowType === "group") {
                  return (
                    <tr
                      key={row.id}
                      onClick={() => row.originalNodeId && onToggleNode(row.originalNodeId)}
                      className="bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      {/* Name */}
                      <td className="py-2.5 px-4 sm:sticky sm:left-0 z-10 bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="p-0.5 rounded hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-transform"
                          >
                            {row.isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span>{row.name}</span>
                        </div>
                      </td>

                      {/* Month Columns: Kosong di baris Header Group */}
                      {months.map((m) => {
                        const isCurrent = isCurrentMonth(m);
                        return (
                          <td
                            key={m}
                            className={cn(
                              "py-2.5 px-3 text-right",
                              isCurrent && "bg-slate-200/50 dark:bg-slate-700/40"
                            )}
                          />
                        );
                      })}

                      {/* Total Year Group */}
                      <td className="py-2.5 px-4 text-right" />
                    </tr>
                  );
                }

                // Baris Subtotal per Group (Kuning / Amber sesuai gambar)
                if (row.rowType === "subtotal") {
                  return (
                    <tr
                      key={row.id}
                      className="bg-[#fef9c3]/70 dark:bg-amber-950/30 text-slate-900 dark:text-slate-100 font-bold"
                    >
                      {/* Subtotal Label */}
                      <td className="py-2.5 px-4 text-[11px] tracking-wider font-extrabold sm:sticky sm:left-0 z-10 bg-[#fef9c3] dark:bg-amber-950 text-slate-900 dark:text-slate-100">
                        {row.name}
                      </td>

                      {/* Subtotal Month Values */}
                      {months.map((m) => {
                        const cell = row.months[m];
                        const val = cell?.budget || 0;
                        const isCurrent = isCurrentMonth(m);
                        return (
                          <td
                            key={m}
                            className={cn(
                              "py-2.5 px-3 text-right font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap",
                              isCurrent && "bg-[#fef08a] dark:bg-amber-900/50"
                            )}
                          >
                            {val > 0 ? formatMatrixNumber(val) : "—"}
                          </td>
                        );
                      })}

                      {/* Subtotal Total Year */}
                      <td className="py-2.5 px-4 text-right font-extrabold text-slate-900 dark:text-slate-100 bg-[#fef08a] dark:bg-amber-900/40 whitespace-nowrap">
                        {formatMatrixNumber(row.totalYear)}
                      </td>
                    </tr>
                  );
                }

                // Baris Item Standar: Kelompok (level 1), Kegiatan (level 2), Sub-kegiatan (level 3)
                const isKelompok = row.rowType === "kelompok";
                const isKegiatan = row.rowType === "kegiatan";
                const isSubKegiatan = row.rowType === "sub_kegiatan";

                // Hanya tampilkan budget nominal jika baris merupakan leaf item (isHasBudget & tidak punya children)
                const isLeafBudget = row.isHasBudget && !row.hasChildren;

                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                      isKelompok && "bg-slate-50/40 dark:bg-slate-900/40 font-semibold",
                      isKegiatan && "text-slate-800 dark:text-slate-200",
                      isSubKegiatan && "text-slate-600 dark:text-slate-300 text-[11px]"
                    )}
                  >
                    {/* KETERANGAN Column */}
                    <td className="py-2 px-4 sm:sticky sm:left-0 z-10 bg-white dark:bg-slate-900">
                      <div
                        className="flex items-center gap-1.5"
                        style={{
                          paddingLeft: `${row.level === 1 ? 8 : row.level === 2 ? 24 : 40
                            }px`,
                        }}
                      >
                        {/* Toggle button jika punya anak */}
                        {row.hasChildren ? (
                          <button
                            type="button"
                            onClick={() =>
                              row.originalNodeId && onToggleNode(row.originalNodeId)
                            }
                            className="p-0.5 -ml-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-transform"
                          >
                            {row.isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : (
                          // Spacer untuk leaf
                          <span className="w-3.5 inline-block" />
                        )}

                        <span
                          className={cn(
                            "truncate max-w-[260px] sm:max-w-xs",
                            row.hasChildren && "cursor-pointer",
                            isKelompok && "font-bold text-slate-900 dark:text-slate-100",
                            isKegiatan && !row.hasChildren && "font-medium",
                            isSubKegiatan && "font-normal text-slate-700 dark:text-slate-300"
                          )}
                          title={row.name}
                          onClick={() => {
                            if (row.hasChildren && row.originalNodeId) {
                              onToggleNode(row.originalNodeId);
                            }
                          }}
                        >
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Month Data Cells */}
                    {months.map((m) => {
                      const cell = row.months[m];
                      const val = cell?.budget || 0;
                      const hasBudget = isLeafBudget && val > 0;
                      const isCurrent = isCurrentMonth(m);

                      return (
                        <td
                          key={m}
                          className={cn(
                            "py-2 px-3 text-right whitespace-nowrap transition-colors",
                            isCurrent &&
                              "bg-primary/[0.04] dark:bg-primary/[0.08]"
                          )}
                        >
                          {hasBudget ? (
                            <HoverCard openDelay={150} closeDelay={150}>
                              <HoverCardTrigger asChild>
                                <div className="inline-flex items-center justify-end gap-1.5 font-medium cursor-pointer group">
                                  {/* Titik Status (Hijau, Kuning, Grey) */}
                                  <StatusIndicatorDot
                                    status={cell?.status}
                                    catatan={cell?.catatan}
                                  />
                                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                                    {formatMatrixNumber(val)}
                                  </span>
                                </div>
                              </HoverCardTrigger>

                              <HoverCardContent
                                side="top"
                                align="end"
                                className="w-80 p-4 space-y-3 shadow-xl bg-white dark:bg-slate-900 rounded-xl"
                              >
                                {/* Header: Item & Month */}
                                <div className="pb-2 space-y-1">
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                                    <span className="truncate max-w-[200px]" title={row.name}>
                                      {row.name}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                                      {SHORT_MONTH_MAP[m] || m} {tahun}
                                    </span>
                                  </div>
                                  {row.metadata && (
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                                      <p className="font-medium text-slate-700 dark:text-slate-300">
                                        {row.metadata.jurnal_code} — {row.metadata.jurnal_name}
                                      </p>
                                      {row.metadata.cource_fund && (
                                        <p className="text-[10px] text-slate-400">
                                          Sumber Dana: {row.metadata.cource_fund}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Financial Details Grid */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">
                                      Anggaran
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">
                                      {formatIDR(val)}
                                    </span>
                                  </div>
                                  <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">
                                      Realisasi
                                    </span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                      {cell?.realisasi ? formatIDR(cell.realisasi) : "Rp 0"}
                                    </span>
                                  </div>
                                </div>

                                {/* Status & Catatan */}
                                <div className="space-y-1.5 pt-1 text-xs">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-500 dark:text-slate-400">
                                      Status Pencairan:
                                    </span>
                                    <span
                                      className={cn(
                                        "font-bold capitalize px-2 py-0.5 rounded text-[10px]",
                                        cell?.status === "dicairkan" &&
                                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                                        cell?.status === "belum_cair" &&
                                          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                                        cell?.status === "hangus" &&
                                          "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                      )}
                                    >
                                      {cell?.status === "dicairkan"
                                        ? "Dicairkan"
                                        : cell?.status === "belum_cair"
                                        ? "Belum Cair"
                                        : "Hangus"}
                                    </span>
                                  </div>
                                  {cell?.catatan && (
                                    <div className="text-[11px] bg-amber-50/80 dark:bg-amber-950/40 p-2 rounded-lg text-amber-900 dark:text-amber-200">
                                      <span className="font-semibold block text-[10px] text-amber-700 dark:text-amber-400">
                                        Catatan:
                                      </span>
                                      {cell.catatan}
                                    </div>
                                  )}
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ) : row.hasChildren ? null : (
                            <span className="text-slate-300 dark:text-slate-600">
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Year Item */}
                    <td className="py-2 px-4 text-right font-semibold text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/30 whitespace-nowrap">
                      {isLeafBudget && row.totalYear > 0 ? formatMatrixNumber(row.totalYear) : row.hasChildren ? "" : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          <tfoot>
            <tr className="bg-[#fef08a]/80 dark:bg-amber-950/60 text-rose-700 dark:text-rose-400 font-extrabold">
              {/* Total Label */}
              <td className="py-3 px-4 text-xs tracking-wider sm:sticky sm:left-0 z-10 bg-[#fef08a] dark:bg-amber-950 font-black">
                Total Pengeluaran
              </td>

              {/* Month Grand Totals */}
              {months.map((m) => {
                const total = grandTotalPerMonth[m] || 0;
                const isCurrent = isCurrentMonth(m);
                return (
                  <td
                    key={m}
                    className={cn(
                      "py-3 px-3 text-right font-black text-xs whitespace-nowrap",
                      isCurrent &&
                        "bg-[#fde047] dark:bg-amber-900/90 text-rose-900 dark:text-rose-200 ring-1 ring-inset ring-amber-500/30"
                    )}
                  >
                    {total > 0 ? formatMatrixNumber(total) : "—"}
                  </td>
                );
              })}

              {/* Grand Total All Year */}
              <td className="py-3 px-4 text-right font-black text-sm bg-[#fde047] dark:bg-amber-900/80 whitespace-nowrap text-rose-800 dark:text-rose-300">
                {formatMatrixNumber(grandTotalYear)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
