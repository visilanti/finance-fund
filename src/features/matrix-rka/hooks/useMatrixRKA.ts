"use client";

import { useState, useMemo, useCallback } from "react";
import { RKADocument, RKANode, RKAStatusPencairan, MatrixTableRow } from "../types";
import {
  MOCK_RKA,
  STANDARD_MONTHS,
  buildMatrixTableRows,
  calculateMatrixMetrics,
} from "../services/rka.services";

export function useMatrixRKA(initialDoc?: RKADocument) {
  const [activeDoc, setActiveDoc] = useState<RKADocument>(
    initialDoc || MOCK_RKA[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | RKAStatusPencairan>("all");

  // Kumpulkan semua ID node yang memiliki children
  const allExpandableIds = useMemo(() => {
    const ids = new Set<string>();
    function collect(node: RKANode) {
      if (node.children && node.children.length > 0) {
        ids.add(node.id);
        node.children.forEach(collect);
      }
    }
    activeDoc.list_item.forEach(collect);
    return ids;
  }, [activeDoc]);

  // Default: semua groups & kelompoks terbuka agar langsung terbaca
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    function collectInitial(node: RKANode, level: number = 0) {
      if (node.children && node.children.length > 0 && level <= 2) {
        ids.add(node.id);
        node.children.forEach((c: RKANode) => collectInitial(c, level + 1));
      }
    }
    (initialDoc || MOCK_RKA[0]).list_item.forEach((n) => collectInitial(n, 0));
    return ids;
  });

  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(allExpandableIds));
  }, [allExpandableIds]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const allExpanded = useMemo(() => {
    return (
      allExpandableIds.size > 0 &&
      [...allExpandableIds].every((id) => expandedIds.has(id))
    );
  }, [allExpandableIds, expandedIds]);

  // Build flattened table rows
  const tableRows = useMemo(() => {
    const rawRows = buildMatrixTableRows(
      activeDoc,
      expandedIds,
      searchQuery,
      STANDARD_MONTHS
    );

    if (statusFilter === "all") {
      return rawRows;
    }

    // Jika filter status diaktifkan, saring baris yang memiliki status sesuai di salah satu bulan
    return rawRows.filter((row) => {
      if (row.rowType === "group" || row.rowType === "subtotal" || row.hasChildren) return true;
      return Object.values(row.months).some(
        (cell) => cell.status === statusFilter && cell.budget > 0
      );
    });
  }, [activeDoc, expandedIds, searchQuery, statusFilter]);

  // Hitung Grand Total (Total Cash Out) per Bulan di paling bawah
  const grandTotalPerMonth = useMemo(() => {
    const result: Record<string, number> = {};
    for (const m of STANDARD_MONTHS) {
      // Jumlahkan seluruh subtotal group
      const subtotalSum = tableRows
        .filter((r) => r.rowType === "subtotal")
        .reduce((sum, r) => sum + (r.months[m]?.budget || 0), 0);
      result[m] = subtotalSum;
    }
    return result;
  }, [tableRows]);

  const grandTotalYear = useMemo(() => {
    return Object.values(grandTotalPerMonth).reduce((sum, val) => sum + val, 0);
  }, [grandTotalPerMonth]);

  // Hitung ringkasan metrik
  const metrics = useMemo(() => {
    return calculateMatrixMetrics(activeDoc);
  }, [activeDoc]);

  return {
    activeDoc,
    setActiveDoc,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    expandedIds,
    toggleNode,
    expandAll,
    collapseAll,
    allExpanded,
    tableRows,
    grandTotalPerMonth,
    grandTotalYear,
    metrics,
    months: STANDARD_MONTHS,
  };
}
