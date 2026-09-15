"use client";

import { useState } from "react";
import { MasterDataTableShell, ColumnDef, StatusBadge } from "@/components/shared/MasterDataTableShell";
import { PengajuanDetailDrawer } from "@/features/pengajuan/components/drawer";
import { PengajuanDanaItem } from "@/features/pengajuan/types";
import { formatIDR } from "@/lib/utils";
import { STATUS_OPTIONS } from "@/lib/constants";
import { Eye } from "lucide-react";

interface PengajuanTableSectionProps {
  initialData: PengajuanDanaItem[];
}

export function PengajuanTableSection({ initialData }: PengajuanTableSectionProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItemDetail, setSelectedItemDetail] = useState<PengajuanDanaItem | null>(null);

  const columns: ColumnDef<PengajuanDanaItem>[] = [
    {
      key: "kode",
      header: "Kode & Tanggal",
      width: "190px",
      cell: (item) => (
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedItemDetail(item)}
            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:border-primary/40 dark:hover:border-primary/40 transition-all cursor-pointer shrink-0"
            title="Lihat Detail"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">{item.kode}</span>
            <div className="text-[11px] font-normal text-slate-400 dark:text-slate-400 mt-0.5">{item.tanggal}</div>
          </div>
        </div>
      ),
    },
    {
      key: "kegiatan",
      header: "Judul Pengajuan",
      width: "auto",
      cell: (item) => (
        <div className="max-w-md">
          <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{item.kegiatan}</div>
          <div className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] shrink-0">
              {item.divisi}
            </span>
            <span>•</span>
            <span className="truncate">{item.kelompok || "Umum"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "jenis",
      header: "Jenis Pengajuan",
      width: "150px",
      cell: (item) => (
        <div>
          <span className="inline-block px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[12px] whitespace-nowrap">
            {item.jenis}
          </span>
        </div>
      ),
    },
    {
      key: "nominal",
      header: "Nominal Dana",
      width: "160px",
      align: "right",
      sortable: true,
      cell: (item) => (
        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">{formatIDR(item.nominal)}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "180px",
      align: "center",
      cell: (item) => (
        <div className="flex flex-col items-center">
          <StatusBadge status={item.currentStatus} />
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal mt-1 whitespace-nowrap">{item.currentStep}</span>
        </div>
      ),
    },
  ];

  const filteredData = initialData.filter((item) => {
    if (statusFilter !== "all" && item.currentStatus !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <MasterDataTableShell<PengajuanDanaItem>
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id}
        totalRecords={filteredData.length}
        currentPage={1}
        totalPages={1}
        pageSize={10}
        onViewDetails={(item) => setSelectedItemDetail(item)}
        toolbarProps={{
          searchPlaceholder: "Cari kode, judul, atau jenis pengajuan...",
          statusFilter,
          onStatusFilterChange: setStatusFilter,
          statusOptions: STATUS_OPTIONS,
          onExport: () => alert("Exporting data rekap pengajuan..."),
          onRefresh: () => alert("Memperbarui data pengajuan..."),
          onAddNew: () => (window.location.href = "/pengajuan/create"),
          addNewLabel: "Pengajuan Baru",
        }}
      />

      <PengajuanDetailDrawer
        item={selectedItemDetail}
        onClose={() => setSelectedItemDetail(null)}
        onApproveProcess={(item) => alert(`Proses pengajuan ${item.kode}`)}
      />
    </>
  );
}
