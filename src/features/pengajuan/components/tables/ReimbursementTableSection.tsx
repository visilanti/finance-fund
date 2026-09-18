"use client";

import React, { useState, useMemo } from "react";
import { MasterDataTableShell, ColumnDef, StatusBadge } from "@/components/shared/MasterDataTableShell";
import { PengajuanDetailDrawer } from "@/features/pengajuan/components/drawer";
import { PengajuanDanaItem } from "@/features/pengajuan/types";
import { DateRangeFilter, NominalRangeFilter } from "@/components/shared/TableToolbar";
import { formatIDR } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { STATUS_OPTIONS } from "@/lib/constants";
import { Eye } from "lucide-react";

interface ReimbursementTableSectionProps {
  initialData: PengajuanDanaItem[];
}

export function ReimbursementTableSection({ initialData }: ReimbursementTableSectionProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>({ startDate: "", endDate: "" });
  const [nominalRangeFilter, setNominalRangeFilter] = useState<NominalRangeFilter>({ minNominal: "", maxNominal: "" });
  const [selectedItemDetail, setSelectedItemDetail] = useState<PengajuanDanaItem | null>(null);

  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      const matchType = item.jenis === "Reimbursement";
      const matchStatus = statusFilter === "all" || item.currentStatus === statusFilter;
      const itemDateStr = item.tanggalPengajuan;
      const matchStart = !dateRangeFilter.startDate || (itemDateStr ? new Date(itemDateStr) >= new Date(dateRangeFilter.startDate) : true);
      const matchEnd = !dateRangeFilter.endDate || (itemDateStr ? new Date(itemDateStr) <= new Date(dateRangeFilter.endDate) : true);

      const minNom = Number(nominalRangeFilter.minNominal);
      const maxNom = Number(nominalRangeFilter.maxNominal);
      const matchMinNominal = nominalRangeFilter.minNominal === "" || nominalRangeFilter.minNominal === undefined || item.nominalPengajuan >= minNom;
      const matchMaxNominal = nominalRangeFilter.maxNominal === "" || nominalRangeFilter.maxNominal === undefined || item.nominalPengajuan <= maxNom;

      return matchType && matchStatus && matchStart && matchEnd && matchMinNominal && matchMaxNominal;
    });
  }, [initialData, statusFilter, dateRangeFilter, nominalRangeFilter]);

  const columns = useMemo<ColumnDef<PengajuanDanaItem>[]>(() => [
    {
      key: "kode",
      header: "Kode & Tanggal",
      width: "200px",
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
            <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
              {item.kode}
            </span>
            <div className="text-[11px] font-normal text-slate-400 dark:text-slate-400 mt-0.5">
              {item.tanggalPengajuan}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "kegiatan",
      header: "Keterangan Usulan",
      width: "auto",
      cell: (item) => (
        <div className="max-w-md">
          {item.kegiatan}
        </div>
      ),
    },
    {
      key: "divisi",
      header: "Divisi",
      width: "160px",
      cell: (item) => (
        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
          {item.divisi}
        </span>
      ),
    },
    {
      key: "nominalPengajuan",
      header: "Nominal Pengajuan",
      width: "160px",
      align: "right",
      sortable: true,
      cell: (item) => (
        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
          {formatIDR(item.nominalPengajuan)}
        </div>
      ),
    },
    {
      key: "nominalDiterima",
      header: "Nominal Diterima",
      width: "160px",
      align: "right",
      sortable: true,
      cell: (item) => (
        <div className="text-sm whitespace-nowrap">
          {item.nominalDiterima ? (
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatIDR(item.nominalDiterima)}
            </span>
          ) : (
            <span className="font-semibold text-slate-400 dark:text-slate-500">-</span>
          )}
        </div>
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
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal mt-1 whitespace-nowrap">
            {item.currentStep}
          </span>
        </div>
      ),
    },
  ], []);

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
          searchPlaceholder: "Cari di Pengajuan Reimbursement...",
          filterOptionGroups: [
            {
              id: "status",
              title: "Status Reimbursement",
              value: statusFilter,
              onChange: setStatusFilter,
              options: STATUS_OPTIONS,
              allLabel: "Semua Status",
            },
          ],
          dateRangeFilterGroups: [
            {
              id: "tanggalPengajuan",
              title: "Rentang Tanggal",
              placeholder: "Pilih Rentang Tanggal...",
              value: dateRangeFilter,
              onChange: setDateRangeFilter,
            },
          ],
          nominalRangeFilter,
          onNominalRangeFilterChange: setNominalRangeFilter,
          onExport: () => alert("Exporting data Reimbursement..."),
          onRefresh: () => alert("Memperbarui data Reimbursement..."),
          onAddNew: () => router.push("/pengajuan/create?type=reimbursement"),
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
