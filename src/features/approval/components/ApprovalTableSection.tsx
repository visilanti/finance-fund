"use client";

import React, { useState, useMemo } from "react";
import { MasterDataTableShell, ColumnDef, StatusBadge } from "@/components/shared/MasterDataTableShell";
import { PengajuanDanaItem } from "@/features/pengajuan/types";
import { PengajuanDetailDrawer } from "@/features/pengajuan/components/drawer";
import { ApprovalActionModal } from "./ApprovalActionModal";
import { approvalService } from "../services/approval.service";
import { formatIDR } from "@/lib/utils";
import { Eye, Check, X } from "lucide-react";

interface ApprovalTableSectionProps {
  initialData?: PengajuanDanaItem[];
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  onDataChange?: () => void;
}

export function ApprovalTableSection({
  initialData = [],
  statusFilter: externalStatusFilter,
  onStatusFilterChange,
  onDataChange,
}: ApprovalTableSectionProps) {
  const [data, setData] = useState<PengajuanDanaItem[]>(initialData);
  const [isLoading] = useState(false);
  const [internalStatusFilter, setInternalStatusFilter] = useState<string>("all");

  const [selectedItemDetail, setSelectedItemDetail] = useState<PengajuanDanaItem | null>(null);
  const [activeActionItem, setActiveActionItem] = useState<PengajuanDanaItem | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const statusFilter = externalStatusFilter !== undefined ? externalStatusFilter : internalStatusFilter;

  const handleStatusChange = (val: string) => {
    setInternalStatusFilter(val);
    onStatusFilterChange?.(val);
  };

  // Sync initialData when parent passes updated items
  React.useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const handleOpenAction = (item: PengajuanDanaItem, type: "approve" | "reject") => {
    setActiveActionItem(item);
    setActionType(type);
  };

  const handleConfirmAction = async (payload: { status: "disetujui" | "ditolak"; catatan: string }) => {
    if (!activeActionItem) return;

    setIsSubmittingAction(true);
    try {
      await approvalService.submitApprovalAction({
        id: activeActionItem.id,
        status: payload.status,
        catatan: payload.catatan,
      });

      // Update local state
      setData((prev) =>
        prev.map((it) =>
          it.id === activeActionItem.id
            ? { ...it, currentStatus: payload.status }
            : it
        )
      );

      setActiveActionItem(null);
      setActionType(null);

      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error("Gagal memperbarui status approval:", error);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "menunggu":
      case "pending":
        return { variant: "warning" as const, label: "Menunggu Verifikasi" };
      case "disetujui":
        return { variant: "success" as const, label: "Disetujui" };
      case "ditolak":
        return { variant: "error" as const, label: "Ditolak" };
      case "revisi":
        return { variant: "error" as const, label: "Revisi" };
      default:
        return { variant: "neutral" as const, label: status };
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const st = String(item.currentStatus);
      if (statusFilter === "all") return true;
      if (statusFilter === "pending" || statusFilter === "menunggu") {
        return st === "menunggu" || st === "pending";
      }
      return st === statusFilter;
    });
  }, [data, statusFilter]);

  const columns = useMemo<ColumnDef<PengajuanDanaItem>[]>(
    () => [
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
              title="Lihat Detail Pengajuan"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <div className="min-w-0">
              <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight block truncate">
                {item.kode}
              </span>
              <span className="text-[11px] font-normal text-slate-400 dark:text-slate-400 mt-0.5 block">
                {item.tanggalPengajuan}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: "kegiatan",
        header: "Uraian Kegiatan",
        width: "auto",
        cell: (item) => (
          <div className="max-w-md">
            <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
              {item.kegiatan}
            </div>
            {item.kelompok && (
              <div className="text-[11px] font-medium text-slate-400 dark:text-slate-400 mt-0.5 truncate">
                {item.kelompok}
              </div>
            )}
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
        key: "currentStatus",
        header: "Status Approval",
        width: "170px",
        align: "center",
        cell: (item) => {
          const badgeProps = getStatusBadgeProps(item.currentStatus);
          return (
            <div className="flex flex-col items-center">
              <StatusBadge
                status={item.currentStatus}
                variant={badgeProps.variant}
                label={badgeProps.label}
              />
            </div>
          );
        },
      },
      {
        key: "aksi",
        header: "Aksi Approval",
        width: "170px",
        align: "center",
        cell: (item) => {
          const st = String(item.currentStatus);
          const isPending = st === "menunggu" || st === "pending";

          if (!isPending) {
            return (
              <span className="text-[11px] font-medium text-slate-400 italic">
                Selesai Diproses
              </span>
            );
          }

          return (
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenAction(item, "approve")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Setujui Pengajuan Ini"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Setujui</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenAction(item, "reject")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold transition-all cursor-pointer"
                title="Tolak Pengajuan Ini"
              >
                <X className="w-3.5 h-3.5" />
                <span>Tolak</span>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <MasterDataTableShell<PengajuanDanaItem>
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id || item.kode}
        isLoading={isLoading}
        totalRecords={filteredData.length}
        currentPage={1}
        totalPages={1}
        pageSize={10}
        onViewDetails={(item) => setSelectedItemDetail(item)}
        toolbarProps={{
          searchPlaceholder: "Cari kode, kegiatan, divisi...",
          filterOptionGroups: [
            {
              id: "status",
              title: "Status Approval",
              value: statusFilter,
              onChange: handleStatusChange,
              options: [
                { label: "Semua Status", value: "all" },
                { label: "Menunggu Verifikasi", value: "pending" },
                { label: "Disetujui", value: "disetujui" },
                { label: "Ditolak", value: "ditolak" },
              ],
            },
          ],
          onResetFilters: () => handleStatusChange("all"),
        }}
      />

      {/* Detail Drawer (reusable dari features/pengajuan) */}
      <PengajuanDetailDrawer
        item={selectedItemDetail}
        onClose={() => setSelectedItemDetail(null)}
      />

      {/* Modal Aksi Persetujuan / Penolakan */}
      <ApprovalActionModal
        isOpen={!!activeActionItem}
        onClose={() => {
          setActiveActionItem(null);
          setActionType(null);
        }}
        onConfirm={handleConfirmAction}
        actionType={actionType}
        item={activeActionItem}
        isLoading={isSubmittingAction}
      />
    </>
  );
}
