"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Inbox, Eye, Edit3, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TableToolbar, TableToolbarProps, FilterOptionGroup, DateRangeFilter, DateRangeFilterGroup } from "./TableToolbar";
import { StatusBadge, StatusBadgeProps } from "./StatusBadge";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export { StatusBadge, type StatusBadgeProps, type FilterOptionGroup, type DateRangeFilter, type DateRangeFilterGroup };

export interface ColumnDef<T> {
  key: string;
  header: string | React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortKey?: string;
  sortFn?: (a: T, b: T, direction: "asc" | "desc") => number;
  cell: (item: T, index: number) => React.ReactNode;
}

export interface MasterDataTableShellProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  
  // Sorting
  defaultSortKey?: string;
  defaultSortDirection?: SortDirection;
  sortConfig?: SortConfig | null;
  onSortChange?: (sortConfig: SortConfig | null) => void;

  // Toolbar configuration
  toolbarProps?: Omit<TableToolbarProps, "searchQuery" | "onSearchChange">;
  
  // Pagination
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  
  // Selection
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: string, checked: boolean) => void;
  
  // Custom Action Pill buttons callback
  showActionColumn?: boolean;
  onViewDetails?: (item: T) => void;
  onEditItem?: (item: T) => void;
  onDeleteItem?: (item: T) => void;
  customRowActions?: (item: T) => React.ReactNode;
}

export function MasterDataTableShell<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyTitle = "Belum Ada Data",
  emptyDescription = "Tidak ada data yang memenuhi kriteria pencarian atau filter Anda.",
  emptyAction,
  defaultSortKey,
  defaultSortDirection = "asc",
  sortConfig,
  onSortChange,
  toolbarProps,
  currentPage: propsCurrentPage,
  totalPages: propsTotalPages,
  pageSize = 10,
  totalRecords: propsTotalRecords,
  onPageChange,
  selectedIds = [],
  onSelectAll,
  onSelectRow,
  showActionColumn = false,
  onViewDetails,
  onEditItem,
  onDeleteItem,
  customRowActions,
}: MasterDataTableShellProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalPage, setInternalPage] = useState(1);
  const [internalSortConfig, setInternalSortConfig] = useState<SortConfig | null>(
    defaultSortKey
      ? { key: defaultSortKey, direction: defaultSortDirection || "asc" }
      : null
  );

  const activeSort = sortConfig !== undefined ? sortConfig : internalSortConfig;

  const handleSort = (colKey: string, col: ColumnDef<T>) => {
    if (!col.sortable) return;

    let nextSort: SortConfig | null = null;
    if (!activeSort || activeSort.key !== colKey) {
      nextSort = { key: colKey, direction: "asc" };
    } else if (activeSort.direction === "asc") {
      nextSort = { key: colKey, direction: "desc" };
    } else {
      nextSort = null;
    }

    if (onSortChange) {
      onSortChange(nextSort);
    }
    if (sortConfig === undefined) {
      setInternalSortConfig(nextSort);
    }
  };

  // Search filtering
  const filteredData = useMemo(() => {
    if (!internalSearch.trim()) return data;
    const q = internalSearch.toLowerCase();
    return data.filter((item) =>
      Object.values(item as Record<string, unknown>).some(
        (val) => typeof val === "string" && val.toLowerCase().includes(q)
      )
    );
  }, [data, internalSearch]);

  // Client-side sorting
  const sortedData = useMemo(() => {
    if (!activeSort) return filteredData;

    const col = columns.find((c) => c.key === activeSort.key);
    const keyToAccess = (col?.sortKey || activeSort.key) as keyof T;

    return [...filteredData].sort((a, b) => {
      if (col?.sortFn) {
        return col.sortFn(a, b, activeSort.direction);
      }

      const aVal = a[keyToAccess];
      const bVal = b[keyToAccess];

      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null || aVal === "") return 1;
      if (bVal === undefined || bVal === null || bVal === "") return -1;

      // Numbers comparison
      if (typeof aVal === "number" && typeof bVal === "number") {
        return activeSort.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Numeric strings comparison
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum) && typeof aVal !== "boolean" && typeof bVal !== "boolean") {
        return activeSort.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Date comparison
      if (typeof aVal === "string" && typeof bVal === "string") {
        const aTime = Date.parse(aVal);
        const bTime = Date.parse(bVal);
        if (!isNaN(aTime) && !isNaN(bTime) && aVal.length > 5 && bVal.length > 5) {
          return activeSort.direction === "asc" ? aTime - bTime : bTime - aTime;
        }
      }

      // Default string comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return activeSort.direction === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [filteredData, activeSort, columns]);

  // Reset page when search, sort, or data length changes
  useEffect(() => {
    setInternalPage(1);
  }, [internalSearch, data.length, activeSort]);

  // Pagination calculation
  const totalItemCount = propsTotalRecords ?? sortedData.length;
  const computedTotalPages = propsTotalPages && onPageChange
    ? propsTotalPages
    : Math.ceil(totalItemCount / pageSize) || 1;

  const activePage = onPageChange && propsCurrentPage !== undefined ? propsCurrentPage : internalPage;

  // Determine if data is already pre-sliced (server-side pagination) or client-side array
  const isPreSliced = data.length <= pageSize && totalItemCount > data.length && Boolean(onPageChange);

  const displayData = isPreSliced
    ? sortedData
    : sortedData.slice((activePage - 1) * pageSize, activePage * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > computedTotalPages) return;
    if (onPageChange) {
      onPageChange(newPage);
    }
    setInternalPage(newPage);
  };

  const allSelected = displayData.length > 0 && displayData.every((item) => selectedIds.includes(keyExtractor(item)));
  const isActionColumnNeeded = showActionColumn && Boolean(onViewDetails || onEditItem || onDeleteItem || customRowActions);

  const startRecord = displayData.length > 0 ? (activePage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(activePage * pageSize, totalItemCount);

  return (
    <div className="w-full flex flex-col rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card dark:shadow-none overflow-hidden transition-colors">
      {/* Table Toolbar */}
      {toolbarProps && (
        <TableToolbar
          {...toolbarProps}
          searchQuery={internalSearch}
          onSearchChange={(q) => {
            setInternalSearch(q);
          }}
          selectedCount={selectedIds.length}
        />
      )}

      {/* Main Spacious Table Container */}
      <div className="overflow-x-auto min-h-[320px]">
        <table className="w-full text-left border-collapse">
          {/* Subtle Transparent Header */}
          <thead>
            <tr className="bg-slate-50/60 dark:bg-slate-800/60 border-y border-slate-200/80 dark:border-slate-800">
              {onSelectAll && (
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = activeSort?.key === col.key;
                const sortDir = isSorted ? activeSort.direction : null;

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={cn(
                      "px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.sortable && "cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
                    )}
                    onClick={() => col.sortable && handleSort(col.key, col)}
                    title={col.sortable ? `Urutkan berdasarkan ${typeof col.header === "string" ? col.header : col.key}` : undefined}
                  >
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        col.align === "center" && "justify-center",
                        col.align === "right" && "justify-end"
                      )}
                    >
                      <span className={cn(isSorted && "text-primary dark:text-primary font-bold")}>
                        {col.header}
                      </span>
                      {col.sortable && (
                        <span className="inline-flex items-center">
                          {sortDir === "asc" ? (
                            <ArrowUp className="w-3.5 h-3.5 text-primary dark:text-primary shrink-0" />
                          ) : sortDir === "desc" ? (
                            <ArrowDown className="w-3.5 h-3.5 text-primary dark:text-primary shrink-0" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-slate-400/60 dark:text-slate-500/60 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0 transition-colors" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {isActionColumnNeeded && (
                <th className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-24">
                  Aksi
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100/90 dark:divide-slate-800 text-xs">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {onSelectAll && (
                    <td className="px-4 py-4 text-center">
                      <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-4">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                    </td>
                  ))}
                  {isActionColumnNeeded && (
                    <td className="px-4 py-4 text-right">
                      <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full ml-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : displayData.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + (onSelectAll ? 1 : 0) + (isActionColumnNeeded ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{emptyTitle}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{emptyDescription}</p>
                    </div>
                    {emptyAction && <div className="pt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              displayData.map((item, index) => {
                const itemId = keyExtractor(item);
                const isSelected = selectedIds.includes(itemId);

                return (
                  <tr
                    key={itemId}
                    className={cn(
                      "transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/50 group",
                      isSelected && "bg-red-50/30 dark:bg-red-950/30"
                    )}
                  >
                    {onSelectRow && (
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onSelectRow(itemId, e.target.checked)}
                          className="w-4 h-4 rounded text-primary border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-primary focus:ring-offset-0 cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{ width: col.width }}
                        className={cn(
                          "px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium align-middle",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right"
                        )}
                      >
                        {col.cell(item, (activePage - 1) * pageSize + index)}
                      </td>
                    ))}

                    {/* Action Column */}
                    {isActionColumnNeeded && (
                      <td className="px-4 py-3.5 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          {customRowActions ? (
                            customRowActions(item)
                          ) : (
                            <>
                              {onViewDetails && (
                                <button
                                  type="button"
                                  onClick={() => onViewDetails(item)}
                                  className="p-1 rounded-full text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Lihat Detail"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {onEditItem && (
                                <button
                                  type="button"
                                  onClick={() => onEditItem(item)}
                                  className="p-1 rounded-full text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {onDeleteItem && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteItem(item)}
                                  className="p-1 rounded-full text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Menampilkan <span className="font-semibold text-slate-800 dark:text-slate-200">{startRecord}</span> -{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{endRecord}</span>{" "}
          dari <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItemCount}</span> data
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage <= 1 || isLoading}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <span className="px-3 py-1 font-semibold text-slate-800 dark:text-slate-200">
            {activePage} / {computedTotalPages}
          </span>

          <button
            type="button"
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage >= computedTotalPages || isLoading}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
