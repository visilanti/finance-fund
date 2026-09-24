"use client";

import React, { useMemo } from "react";
import { MasterDataTableShell, ColumnDef, StatusBadge } from "@/components/shared/MasterDataTableShell";
import { PencairanItem } from "../../types";
import { PencairanDetailDrawer } from "../drawer/PencairanDetailDrawer";
import { PencairanActionModal } from "../modal/PencairanActionModal";
import { usePencairan } from "../../hooks/usePencairan";
import { cn, formatIDR } from "@/lib/utils";
import { Eye, ExternalLink, CreditCard, CheckCircle2 } from "lucide-react";

interface PencairanInsidentalTableSectionProps {
  initialData?: PencairanItem[];
}

export function PencairanInsidentalTableSection({ initialData = [] }: PencairanInsidentalTableSectionProps) {
  const {
    filteredData,
    isLoading,
    isSubmitting,
    statusFilter,
    setStatusFilter,
    dateRangeFilter,
    setDateRangeFilter,
    nominalRangeFilter,
    setNominalRangeFilter,
    selectedItemDetail,
    setSelectedItemDetail,
    activeModalItem,
    handleOpenPencairanModal,
    handleClosePencairanModal,
    handleSubmitPencairan,
    loadData,
  } = usePencairan({ initialData, jenis: "Insidental" });

  const columns = useMemo<ColumnDef<PencairanItem>[]>(
    () => [
      {
        key: "kode",
        header: "Kode & Tanggal",
        width: "200px",
        sortable: true,
        sortKey: "kode",
        cell: (item) => (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedItemDetail(item)}
              className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:border-primary/40 dark:hover:border-primary/40 transition-all cursor-pointer shrink-0"
              title="Lihat Detail Pencairan"
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
        header: "Keterangan Usulan Insidental",
        width: "auto",
        cell: (item) => (
          <div className="max-w-md">
            <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
              {item.kegiatan}
            </div>
          </div>
        ),
      },
      {
        key: "divisi",
        header: "Divisi",
        width: "150px",
        cell: (item) => (
          <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
            {item.divisi}
          </span>
        ),
      },
      {
        key: "rekening",
        header: "Rekening Tujuan",
        width: "180px",
        cell: (item) => (
          <div className="space-y-0.5 text-xs">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {item.rekeningTujuan?.namaBank || "-"}
            </div>
            <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {item.rekeningTujuan?.nomorRekening || "-"}
            </div>
          </div>
        ),
      },
      {
        key: "nominalPengajuan",
        header: "Nominal Pengajuan",
        width: "150px",
        align: "right",
        sortable: true,
        cell: (item) => (
          <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs whitespace-nowrap">
            {formatIDR(item.nominalPengajuan)}
          </div>
        ),
      },
      {
        key: "nominalDiterima",
        header: "Nominal Pencairan",
        width: "160px",
        align: "right",
        sortable: true,
        cell: (item) => (
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
            {formatIDR(item.nominalDiterima || item.nominalPengajuan)}
          </div>
        ),
      },
      {
        key: "buktiTransfer",
        header: "Bukti Transfer",
        width: "150px",
        align: "center",
        cell: (item) => {
          if (item.buktiTransferUrl) {
            return (
              <a
                href={item.buktiTransferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-md transition-all flex items-center gap-1 mx-auto cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" />
                Bukti
              </a>
            );
          }
          return (
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 italic">
              Belum Diunggah
            </span>
          );
        },
      },
      {
        key: "status",
        header: "Status Pencairan",
        width: "150px",
        align: "center",
        cell: (item) => {
          const isSelesai = item.statusPencairan === "selesai" || Boolean(item.buktiTransferUrl);
          return (
            <div className="flex flex-col items-center">
              <StatusBadge
                status={isSelesai ? "selesai" : "diproses"}
                label={isSelesai ? "Selesai" : "Dalam Proses"}
                variant={isSelesai ? "success" : "warning"}
              />
            </div>
          );
        },
      },
      {
        key: "aksi",
        header: "Aksi",
        width: "140px",
        align: "center",
        cell: (item) => {
          const isSelesai = item.statusPencairan === "selesai" || Boolean(item.buktiTransferUrl);

          return (
            <button
              type="button"
              disabled={isSelesai}
              onClick={() => !isSelesai && handleOpenPencairanModal(item)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all",
                isSelesai
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                  : "bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
              )}
              title={isSelesai ? "Proses Telah Selesai" : "Upload Bukti Transfer & Cairkan"}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cairkan</span>
            </button>
          );
        },
      },
    ],
    [handleOpenPencairanModal, setSelectedItemDetail]
  );

  return (
    <>
      <MasterDataTableShell<PencairanItem>
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        totalRecords={filteredData.length}
        currentPage={1}
        totalPages={1}
        pageSize={10}
        onViewDetails={(item) => setSelectedItemDetail(item)}
        toolbarProps={{
          searchPlaceholder: "Cari di Pencairan Insidental...",
          filterOptionGroups: [
            {
              id: "status",
              title: "Status Pencairan",
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: "Dalam Proses (Belum Cair)", value: "diproses" },
                { label: "Selesai (Sudah Cair)", value: "selesai" },
              ],
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
          onExport: () => alert("Mengekspor data Pencairan Insidental..."),
          onRefresh: loadData,
        }}
      />

      <PencairanDetailDrawer
        item={selectedItemDetail}
        onClose={() => setSelectedItemDetail(null)}
        onCairkanClick={(item) => {
          setSelectedItemDetail(null);
          handleOpenPencairanModal(item);
        }}
      />

      <PencairanActionModal
        isOpen={!!activeModalItem}
        onClose={handleClosePencairanModal}
        onConfirm={handleSubmitPencairan}
        item={activeModalItem}
        isLoading={isSubmitting}
      />
    </>
  );
}
