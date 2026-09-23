"use client";

import React from "react";
import { useMatrixRKA } from "../hooks/useMatrixRKA";
import { MatrixRKAMetrics } from "./MatrixRKAMetrics";
import { MatrixRKAToolbar } from "./MatrixRKAToolbar";
import { MatrixRKATable } from "./MatrixRKATable";
import { MatrixRKALegend } from "./MatrixRKALegend";
import { RKADocument } from "../types";

interface MatrixRKAViewProps {
  initialData?: RKADocument;
}

/**
 * Komponen utama MatrixRKAView yang menggabungkan seluruh fitur tabel matriks RKA:
 * - Metrics summary
 * - Toolbar & Search filter
 * - Table Matrix dengan status indicator dot
 * - Legenda status pencairan
 */
export function MatrixRKAView({ initialData }: MatrixRKAViewProps) {
  const {
    activeDoc,
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
    months,
  } = useMatrixRKA(initialData);

  return (
    <div className="space-y-5">
      <MatrixRKAMetrics metrics={metrics} />

      <div>
        <MatrixRKAToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRefresh={() => {
            // Trigger refresh logic / re-fetch
            setSearchQuery("");
          }}
          onExport={() => {
            // Export logic
            console.log("Exporting RKA Matrix Data...");
          }}
        />

        <div className="space-y-0">
          <MatrixRKATable
            rows={tableRows}
            months={months}
            tahun={activeDoc.tahun}
            expandedIds={expandedIds}
            onToggleNode={toggleNode}
            grandTotalPerMonth={grandTotalPerMonth}
            grandTotalYear={grandTotalYear}
          />
          <MatrixRKALegend tahun={activeDoc.tahun} unit={activeDoc.unit} />
        </div>
      </div>
    </div>
  );
}
