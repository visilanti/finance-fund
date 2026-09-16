"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { MasterDataTableShell, ColumnDef, StatusBadge } from "@/components/shared/MasterDataTableShell";
import { InfoLPJ, LPJBase, StatusLPJ } from "@/features/lpj/types";
import { LPJDetailDrawer } from "./LPJDetailDrawer";
import { formatIDR, cn } from "@/lib/utils";
import { Eye, Upload } from "lucide-react";
import { lpjService } from "../services/lpj.service";

interface LPJTableSectionProps {
  initialData?: InfoLPJ[];
}

const LPJ_STATUS_OPTIONS = [
  { label: "Semua Status", value: "all" },
  { label: "Belum LPJ", value: "belum_lpj" },
  { label: "Submit", value: "submit" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Ditolak", value: "ditolak" },
];

export function LPJTableSection({ initialData = [] }: LPJTableSectionProps) {
  const [data, setData] = useState<InfoLPJ[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItemDetail, setSelectedItemDetail] = useState<LPJBase | null>(null);

  // Muat data jika initialData kosong
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await lpjService.getDaftarLPJ();
      setData(items);
    } catch (error) {
      console.error("Gagal memuat data LPJ:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialData.length === 0) {
      loadData();
    }
  }, [initialData, loadData]);

  const handleViewDetail = async (info: InfoLPJ) => {
    try {
      const detail = await lpjService.getLPJDetail(info.idPengajuan);
      if (detail) {
        setSelectedItemDetail(detail);
      }
    } catch (error) {
      console.error("Gagal memuat detail LPJ:", error);
    }
  };

  const getStatusBadgeProps = (status: StatusLPJ) => {
    switch (status) {
      case "belum_lpj":
        return { variant: "warning" as const, label: "Belum LPJ" };
      case "submit":
        return { variant: "info" as const, label: "Submit" };
      case "ditolak":
        return { variant: "error" as const, label: "Ditolak" };
      case "disetujui":
        return { variant: "success" as const, label: "Disetujui" };
      default:
        return { variant: "neutral" as const, label: status };
    }
  };

  const columns = useMemo<ColumnDef<InfoLPJ>[]>(
    () => [
      {
        key: "idPengajuan",
        header: "ID Pengajuan",
        width: "200px",
        cell: (item) => (
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleViewDetail(item)}
              className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:border-primary/40 dark:hover:border-primary/40 transition-all cursor-pointer shrink-0"
              title="Lihat Detail"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
                {item.idPengajuan}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "tanggalCair",
        header: "Tanggal Cair",
        width: "140px",
        cell: (item) => (
          <span className="text-slate-600 dark:text-slate-300 text-xs font-medium whitespace-nowrap">
            {item.tanggalCair}
          </span>
        ),
      },
      {
        key: "jenis",
        header: "Jenis",
        width: "140px",
        cell: (item) => (
          <div>
            <span className="inline-block px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[12px] whitespace-nowrap">
              {item.jenis}
            </span>
          </div>
        ),
      },
      {
        key: "saldoAwal",
        header: "Saldo Awal",
        width: "160px",
        align: "right",
        sortable: true,
        cell: (item) => (
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
            {formatIDR(item.saldoAwal)}
          </div>
        ),
      },
      {
        key: "saldoAkhir",
        header: "Saldo Akhir",
        width: "160px",
        align: "right",
        sortable: true,
        cell: (item) => (
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm whitespace-nowrap">
            {item.saldoAkhir !== undefined && item.saldoAkhir !== null
              ? formatIDR(item.saldoAkhir)
              : "-"}
          </div>
        ),
      },
      {
        key: "status",
        header: "Status LPJ",
        width: "160px",
        align: "center",
        cell: (item) => {
          const badgeProps = getStatusBadgeProps(item.status);
          return (
            <div className="flex flex-col items-center">
              <StatusBadge
                status={item.status}
                variant={badgeProps.variant}
                label={badgeProps.label}
              />
            </div>
          );
        },
      },
      {
        key: "aksi",
        header: "Aksi",
        width: "130px",
        align: "center",
        cell: (item) => {
          const isUploadActive = item.status === "belum_lpj" || item.status === "ditolak";
          return (
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={!isUploadActive}
                // onClick={() => isUploadActive && setSelectedItemUpload(item)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0",
                  isUploadActive
                    ? "bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                )}
                title={
                  isUploadActive
                    ? "Upload Berkas LPJ"
                    : item.status === "disetujui"
                    ? "LPJ sudah disetujui"
                    : "LPJ sedang diverifikasi"
                }
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [data, statusFilter]);

  return (
    <>
      <MasterDataTableShell<InfoLPJ>
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.idPengajuan}
        isLoading={isLoading}
        totalRecords={filteredData.length}
        currentPage={1}
        totalPages={1}
        pageSize={10}
        onViewDetails={(item) => handleViewDetail(item)}
        toolbarProps={{
          searchPlaceholder: "Cari nomor pengajuan, jenis, atau tanggal...",
          statusFilter,
          onStatusFilterChange: setStatusFilter,
          statusOptions: LPJ_STATUS_OPTIONS,
          onExport: () => alert("Exporting data rekap LPJ..."),
          onRefresh: loadData,
        }}
      />

      {/* Drawer Detail LPJ */}
      <LPJDetailDrawer
        item={selectedItemDetail}
        onClose={() => setSelectedItemDetail(null)}
      />
    </>
  );
}
