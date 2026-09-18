"use client";

import React, { useState } from "react";
import { Search, Filter, ArrowUpDown, Download, RefreshCw, Plus, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/shared/Drawer/Drawer";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { DatePicker } from "../ui/DatePicker";
import { Input } from "../ui/Input";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterOptionGroup {
  id: string;
  title: string;
  options: FilterOption[];
  value?: string;
  onChange?: (value: string) => void;
  allValue?: string;
  allLabel?: string;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface DateRangeFilterGroup {
  id: string;
  title: string;
  placeholder?: string;
  value?: DateRangeFilter;
  onChange?: (dateRange: DateRangeFilter) => void;
}

export interface NominalRangeFilter {
  minNominal?: number | string;
  maxNominal?: number | string;
}

export interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filterOptionGroups?: FilterOptionGroup[];
  dateRangeFilterGroups?: DateRangeFilterGroup[];
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
  nominalRangeFilter?: NominalRangeFilter;
  onNominalRangeFilterChange?: (nominalRange: NominalRangeFilter) => void;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Cari data...",
  filterOptionGroups,
  dateRangeFilterGroups,
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
  nominalRangeFilter,
  onNominalRangeFilterChange,
}: TableToolbarProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const hasFilterOptionGroups = Boolean(filterOptionGroups && filterOptionGroups.length > 0);
  const hasDateRangeGroups = Boolean(dateRangeFilterGroups && dateRangeFilterGroups.length > 0);

  const hasFilterSection = Boolean(
    hasFilterOptionGroups ||
    hasDateRangeGroups ||
    onNominalRangeFilterChange ||
    filterDrawerContent
  );

  const activeDateGroupsCount = (dateRangeFilterGroups || []).filter(
    (g) => Boolean(g.value?.startDate || g.value?.endDate)
  ).length;
  const isDateFilterActive = activeDateGroupsCount > 0;

  const isNominalFilterActive = Boolean(
    (nominalRangeFilter?.minNominal !== undefined && nominalRangeFilter?.minNominal !== "") ||
    (nominalRangeFilter?.maxNominal !== undefined && nominalRangeFilter?.maxNominal !== "")
  );

  const activeGroupsCount = filterOptionGroups
    ? filterOptionGroups.filter((g) => {
        const allVal = g.allValue ?? "all";
        return Boolean(g.value && g.value !== allVal);
      }).length
    : 0;

  const isFilterActive =
    (activeFilterCount ?? 0) > 0 ||
    activeGroupsCount > 0 ||
    isDateFilterActive ||
    isNominalFilterActive;

  const calculatedActiveCount =
    activeFilterCount ??
    (activeGroupsCount +
      activeDateGroupsCount +
      (isNominalFilterActive ? 1 : 0));

  const handleReset = () => {
    if (filterOptionGroups && filterOptionGroups.length > 0) {
      filterOptionGroups.forEach((g) => {
        g.onChange?.(g.allValue ?? "all");
      });
    }
    if (dateRangeFilterGroups && dateRangeFilterGroups.length > 0) {
      dateRangeFilterGroups.forEach((g) => {
        g.onChange?.({ startDate: "", endDate: "" });
      });
    }
    onNominalRangeFilterChange?.({ minNominal: "", maxNominal: "" });
    onResetFilters?.();
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-t-xl space-y-3 transition-colors">
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

            {onAddNew && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAddNew}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {addNewLabel}
              </Button>
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
            <div className="space-y-5">
              {/* Date Range Filter Groups */}
              {dateRangeFilterGroups?.map((group) => {
                const val = group.value;
                const displayVal =
                  val?.startDate && val?.endDate
                    ? `${val.startDate} to ${val.endDate}`
                    : val?.startDate || "";

                return (
                  <div key={group.id} className="space-y-2">
                    <Label variant="bold">{group.title}</Label>
                    <DatePicker
                      id={`filterDateRange_${group.id}`}
                      mode="range"
                      placeholder={group.placeholder || `Pilih Rentang ${group.title}...`}
                      value={displayVal}
                      onChange={(selectedDates: Date[], dateStr: string) => {
                        if (selectedDates && selectedDates.length === 2) {
                          const parts = (dateStr as string).split(" to ");
                          group.onChange?.({
                            startDate: parts[0] || "",
                            endDate: parts[1] || parts[0] || "",
                          });
                        } else if (selectedDates && selectedDates.length === 1) {
                          const parts = (dateStr as string).split(" to ");
                          group.onChange?.({
                            startDate: parts[0] || "",
                            endDate: "",
                          });
                        } else if (!dateStr) {
                          group.onChange?.({
                            startDate: "",
                            endDate: "",
                          });
                        }
                      }}
                    />
                  </div>
                );
              })}

              {onNominalRangeFilterChange && (
                <div className="space-y-2">
                  <Label variant="bold">Rentang Nominal (Rp)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      variant="currency"
                      placeholder="Min Rp..."
                      value={nominalRangeFilter?.minNominal ?? ""}
                      onChange={(e) =>
                        onNominalRangeFilterChange({
                          ...nominalRangeFilter,
                          minNominal: e.target.value !== "" ? Number(e.target.value) : "",
                        })
                      }
                    />
                    <Input
                      variant="currency"
                      placeholder="Maks Rp..."
                      value={nominalRangeFilter?.maxNominal ?? ""}
                      onChange={(e) =>
                        onNominalRangeFilterChange({
                          ...nominalRangeFilter,
                          maxNominal: e.target.value !== "" ? Number(e.target.value) : "",
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Multi Filter Option Groups */}
              {hasFilterOptionGroups &&
                filterOptionGroups?.map((group) => {
                  const allVal = group.allValue ?? "all";
                  const currentValue = group.value || allVal;
                  const hasAllOption = group.options.some((opt) => opt.value === allVal);
                  const shouldRenderDefaultAll = !hasAllOption && group.allLabel !== null;
                  const defaultAllLabel = group.allLabel || `Semua ${group.title}`;

                  return (
                    <div key={group.id} className="space-y-2">
                      <Label variant="bold">{group.title}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {shouldRenderDefaultAll && (
                          <Button
                            onClick={() => group.onChange?.(allVal)}
                            variant="ghost"
                            className={cn(
                              "w-full justify-between px-3.5 py-2.5 h-auto text-xs font-medium border transition-all cursor-pointer",
                              currentValue === allVal
                                ? "bg-primary/5 dark:bg-primary/20 border-primary text-primary font-bold shadow-2xs"
                                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                            rightIcon={currentValue === allVal ? <Check className="w-4 h-4 text-primary" /> : undefined}
                          >
                            <span className="flex-1 text-left">{defaultAllLabel}</span>
                          </Button>
                        )}
                        {group.options.map((opt) => {
                          const isSelected = currentValue === opt.value;
                          return (
                            <Button
                              key={opt.value}
                              onClick={() => group.onChange?.(opt.value)}
                              variant="ghost"
                              className={cn(
                                "w-full justify-between px-3.5 py-2.5 h-auto text-xs font-medium border transition-all cursor-pointer",
                                isSelected
                                  ? "bg-primary/5 dark:bg-primary/20 border-primary text-primary font-bold shadow-2xs"
                                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              )}
                              rightIcon={isSelected ? <Check className="w-4 h-4 text-primary" /> : undefined}
                            >
                              <span className="flex-1 text-left">{opt.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}


            </div>
          )}
        </Drawer>
      )}
    </>
  );
}

