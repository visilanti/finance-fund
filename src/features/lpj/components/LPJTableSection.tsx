"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { MasterDataTableShell, ColumnDef, StatusBadge, DateRangeFilter } from "@/components/shared/MasterDataTableShell";
import { InfoLPJ, LPJBase, StatusLPJ } from "@/features/lpj/types";
import { LPJDetailDrawer } from "./LPJDetailDrawer";
import { formatIDR, cn } from "@/lib/utils";
import { Eye, Upload } from "lucide-react";
import { lpjService } from "../services/lpj.service";
import { useRouter } from "next/navigation";

interface LPJTableSectionProps {
  initialData?: InfoLPJ[];
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

const LPJ_STATUS_OPTIONS = [
  { label: "Semua Status", value: "all" },
  { label: "Belum LPJ", value: "belum_lpj" },
  { label: "Submit", value: "submit" },
  { label: "Disetujui", value: "disetujui" },
  { label: "Revisi", value: "revisi" },
];

const JENIS_LPJ_OPTIONS = [
  { label: "Semua Jenis", value: "all" },
  { label: "RKA", value: "rka" },
  { label: "Insidental", value: "insidental" },
];

function parseItemDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const normalized = dateStr
    .replace(/\bMei\b/gi, "May")
    .replace(/\bAgu(stus)?\b/gi, "Aug")
    .replace(/\bAgs\b/gi, "Aug")
    .replace(/\bOkt(ober)?\b/gi, "Oct")
    .replace(/\bDes(ember)?\b/gi, "Dec");
  const parsed = new Date(normalized);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function LPJTableSection({
  initialData = [],
  statusFilter: externalStatusFilter,
  onStatusFilterChange,
}: LPJTableSectionProps) {
  const router = useRouter();
  const [data, setData] = useState<InfoLPJ[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [internalStatusFilter, setInternalStatusFilter] = useState<string>("all");
  const [jenisFilter, setJenisFilter] = useState<string>("all");
  const [tanggalCairFilter, setTanggalCairFilter] = useState<DateRangeFilter>({ startDate: "", endDate: "" });
  const [tanggalPengajuanFilter, setTanggalPengajuanFilter] = useState<DateRangeFilter>({ startDate: "", endDate: "" });
  const [selectedItemDetail, setSelectedItemDetail] = useState<LPJBase | null>(null);

  const statusFilter = externalStatusFilter !== undefined ? externalStatusFilter : internalStatusFilter;

  const handleStatusChange = (val: string) => {
    setInternalStatusFilter(val);
    onStatusFilterChange?.(val);
  };

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
    if (initialData.length > 0) {
      setData(initialData);
    } else {
      loadData();
    }
  }, [initialData, loadData]);

  const handleViewDetail = async (info: InfoLPJ) => {
    try {
      const detail = await lpjService.getLPJDetail(info.id || info.noPengajuan);
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
      case "revisi":
        return { variant: "error" as const, label: "Revisi" };
      case "disetujui":
        return { variant: "success" as const, label: "Disetujui" };
      default:
        return { variant: "neutral" as const, label: status };
    }
  };

  const columns = useMemo<ColumnDef<InfoLPJ>[]>(
    () => [
      {
        key: "noPengajuan",
        header: "Nomor Pengajuan",
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
                {item.noPengajuan}
              </span>
              <span className="text-[11px] font-normal text-slate-400 dark:text-slate-400 mt-0.5">
                {item.tanggalCair}
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
          const isUploadActive = item.status === "belum_lpj" || item.status === "revisi";
          return (
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={!isUploadActive}
                onClick={() => isUploadActive && router.push(`/lpj/create?id=${item.id}`)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0",
                  isUploadActive
                    ? "bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                )}
                title={
                  isUploadActive
                    ? "Isi / Upload Berkas LPJ"
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
      if (jenisFilter !== "all" && item.jenis.toLowerCase() !== jenisFilter.toLowerCase()) {
        return false;
      }
      if (tanggalCairFilter.startDate || tanggalCairFilter.endDate) {
        const itemDate = parseItemDate(item.tanggalCair);
        if (itemDate) {
          if (tanggalCairFilter.startDate) {
            const start = new Date(tanggalCairFilter.startDate);
            start.setHours(0, 0, 0, 0);
            if (itemDate < start) return false;
          }
          if (tanggalCairFilter.endDate) {
            const end = new Date(tanggalCairFilter.endDate);
            end.setHours(23, 59, 59, 999);
            if (itemDate > end) return false;
          }
        }
      }
      if (tanggalPengajuanFilter.startDate || tanggalPengajuanFilter.endDate) {
        const itemDate = parseItemDate(item.tanggalPengajuan);
        if (itemDate) {
          if (tanggalPengajuanFilter.startDate) {
            const start = new Date(tanggalPengajuanFilter.startDate);
            start.setHours(0, 0, 0, 0);
            if (itemDate < start) return false;
          }
          if (tanggalPengajuanFilter.endDate) {
            const end = new Date(tanggalPengajuanFilter.endDate);
            end.setHours(23, 59, 59, 999);
            if (itemDate > end) return false;
          }
        }
      }
      return true;
    });
  }, [data, statusFilter, jenisFilter, tanggalCairFilter, tanggalPengajuanFilter]);

  return (
    <>
      <MasterDataTableShell<InfoLPJ>
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id || item.noPengajuan}
        isLoading={isLoading}
        totalRecords={filteredData.length}
        currentPage={1}
        totalPages={1}
        pageSize={10}
        onViewDetails={(item) => handleViewDetail(item)}
        toolbarProps={{
          searchPlaceholder: "Cari nomor pengajuan, jenis, atau tanggal...",
          dateRangeFilterGroups: [
            {
              id: "tanggalCair",
              title: "Tanggal Pencairan",
              placeholder: "Pilih rentang tgl cair...",
              value: tanggalCairFilter,
              onChange: setTanggalCairFilter,
            },
            {
              id: "tanggalPengajuan",
              title: "Tanggal Pengajuan",
              placeholder: "Pilih rentang tgl pengajuan...",
              value: tanggalPengajuanFilter,
              onChange: setTanggalPengajuanFilter,
            },
          ],
          filterOptionGroups: [
            {
              id: "status",
              title: "Status LPJ",
              value: statusFilter,
              onChange: handleStatusChange,
              options: LPJ_STATUS_OPTIONS,
            },
            {
              id: "jenis",
              title: "Jenis Pengajuan",
              value: jenisFilter,
              onChange: setJenisFilter,
              options: JENIS_LPJ_OPTIONS,
            },
          ],
          onResetFilters: () => {
            handleStatusChange("all");
            setJenisFilter("all");
            setTanggalCairFilter({ startDate: "", endDate: "" });
            setTanggalPengajuanFilter({ startDate: "", endDate: "" });
          },
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
