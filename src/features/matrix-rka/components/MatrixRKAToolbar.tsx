"use client";

import React from "react";
import { Search, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RKAStatusPencairan } from "../types";
import { Select } from "@/components/ui/Select";
import { useSidebarStore } from "@/store/useSidebarStore";

const DIVISI_OPTIONS = [
  { value: "IT & Infrastructure", label: "IT & Infrastructure" },
  { value: "Cloud Engineering", label: "Cloud Engineering" },
  { value: "Marketing & Business", label: "Marketing & Business" },
  { value: "General Affairs", label: "General Affairs" },
  { value: "HR & People Ops", label: "HR & People Ops" },
  { value: "Pendidikan & Akademik", label: "Pendidikan & Akademik" },
  { value: "Operasional", label: "Operasional" },
  { value: "Keuangan & Bendahara", label: "Keuangan & Bendahara" },
];

interface MatrixRKAToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter?: "all" | RKAStatusPencairan;
  onStatusFilterChange?: (status: "all" | RKAStatusPencairan) => void;
  selectedDivisi?: string;
  onDivisiChange?: (divisi: string) => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  allExpanded?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function MatrixRKAToolbar({
  searchQuery,
  onSearchChange,
  selectedDivisi,
  onDivisiChange,
  onRefresh,
  onExport,
}: MatrixRKAToolbarProps) {
  const currentRole = useSidebarStore((state) => state.currentRole);
  const isBendaharaOrFinance = currentRole === "bendahara" || currentRole === "finance";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-t-2xl shadow-subtle">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari kelompok, kegiatan, atau sub-kegiatan..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
          >
            ×
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isBendaharaOrFinance && (
          <Select
            options={DIVISI_OPTIONS}
            value={selectedDivisi}
            onChange={(val: any) => {
              const v = typeof val === "string" ? val : val?.target?.value ?? "";
              onDivisiChange?.(v);
            }}
            placeholder="Pilih Divisi.."
            isSearchable
            // className="min-w-[160px]"
          />
        )}
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            title="Refresh Data"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          />
        )}

        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            title="Export Data"
            leftIcon={<Download className="w-4 h-4" />}
          />
        )}
      </div>
    </div>
  );
}
