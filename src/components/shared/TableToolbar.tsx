"use client";

import React, { useState } from "react";
import { Search, Filter, ArrowUpDown, Download, RefreshCw, Plus, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/shared/Drawer/Drawer";

export interface FilterOption {
  label: string;
  value: string;
}

export interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  statusOptions?: FilterOption[];
  filterDrawerContent?: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  activeFilterCount?: number;
  onResetFilters?: () => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  sortOptions?: FilterOption[];
  onExport?: () => void;
  onRefresh?: () => void;
  onAddNew?: () => void;
  addNewLabel?: string;
  totalRecords?: number;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Cari data...",
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  filterDrawerContent,
  activeFilterCount,
  onResetFilters,
  sortBy,
  onSortChange,
  sortOptions = [],
  onExport,
  onRefresh,
  onAddNew,
  addNewLabel = "Tambah Data",
  totalRecords,
  selectedCount = 0,
  bulkActions,
}: TableToolbarProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const hasFilterSection = Boolean(
    (onStatusFilterChange && statusOptions.length > 0) || filterDrawerContent
  );

  const isFilterActive =
    (activeFilterCount ?? 0) > 0 || (Boolean(statusFilter) && statusFilter !== "all");

  const calculatedActiveCount =
    activeFilterCount ?? (statusFilter && statusFilter !== "all" ? 1 : 0);

  const handleReset = () => {
    onStatusFilterChange?.("all");
    onResetFilters?.();
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-t-xl border border-slate-200/80 dark:border-slate-800 border-b-0 space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Left: Combined Search Bar & Filter Drawer Trigger */}
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  "w-full pl-9 pr-3 py-1.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all",
                  hasFilterSection ? "rounded-l-lg border-r-0" : "rounded-lg"
                )}
              />
            </div>

            {hasFilterSection && (
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                title="Buka Filter Data"
                className={cn(
                  "relative flex items-center justify-center px-3 py-1.5 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-r-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 transition-all cursor-pointer shrink-0 self-stretch",
                  isFilterActive && "bg-red-50 dark:bg-red-950/40 border-primary/40 text-primary dark:text-red-400 font-semibold"
                )}
              >
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                {isFilterActive && calculatedActiveCount <= 1 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary dark:bg-red-500" />
                  </span>
                )}
                {calculatedActiveCount > 1 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[9px] bg-primary text-white dark:bg-red-600 rounded-full inline-flex items-center justify-center font-bold border border-white dark:border-slate-900 shadow-2xs">
                    {calculatedActiveCount}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Right: Actions & Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            {onSortChange && sortOptions.length > 0 && (
              <div className="relative">
                <select
                  value={sortBy || ""}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 pl-3 pr-7 appearance-none hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Urut: {opt.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                title="Refresh Data"
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {onExport && (
              <button
                type="button"
                onClick={onExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium shadow-subtle transition-all duration-150 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Export</span>
              </button>
            )}

            {onAddNew && (
              <button
                type="button"
                onClick={onAddNew}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-subtle transition-all duration-150 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{addNewLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Drawer Component */}
      {hasFilterSection && (
        <Drawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Filter Data"
          subtitle="Pilih filter untuk mempersempit daftar data"
          maxWidthClass="max-w-sm"
          footerActions={
            <>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Reset Filter
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-subtle transition-all cursor-pointer"
              >
                Terapkan
              </button>
            </>
          }
        >
          {filterDrawerContent ? (
            typeof filterDrawerContent === "function"
              ? filterDrawerContent({ close: () => setIsFilterDrawerOpen(false) })
              : filterDrawerContent
          ) : (
            <div className="space-y-4">
              {statusOptions.length > 0 && onStatusFilterChange && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Status Posisi
                  </label>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => onStatusFilterChange("all")}
                      className={cn(
                        "w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-between",
                        (!statusFilter || statusFilter === "all")
                          ? "bg-primary/5 dark:bg-primary/20 border-primary text-primary font-bold shadow-2xs"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <span>Semua Status</span>
                      {(!statusFilter || statusFilter === "all") && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                    {statusOptions.map((opt) => {
                      const isSelected = statusFilter === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onStatusFilterChange(opt.value)}
                          className={cn(
                            "w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-between",
                            isSelected
                              ? "bg-primary/5 dark:bg-primary/20 border-primary text-primary font-bold shadow-2xs"
                              : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          )}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </Drawer>
      )}
    </>
  );
}
