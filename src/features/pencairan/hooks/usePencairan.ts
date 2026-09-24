"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { PencairanItem, PencairanPayload, PencairanStatus } from "../types";
import { pencairanService } from "../services/pencairan.service";
import { DateRangeFilter, NominalRangeFilter } from "@/components/shared/TableToolbar";

export interface UsePencairanProps {
  initialData?: PencairanItem[];
  jenis?: string;
}

export function usePencairan({ initialData = [], jenis }: UsePencairanProps = {}) {
  const [data, setData] = useState<PencairanItem[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>({ startDate: "", endDate: "" });
  const [nominalRangeFilter, setNominalRangeFilter] = useState<NominalRangeFilter>({ minNominal: "", maxNominal: "" });

  // Drawers & Modals
  const [selectedItemDetail, setSelectedItemDetail] = useState<PencairanItem | null>(null);
  const [activeModalItem, setActiveModalItem] = useState<PencairanItem | null>(null);

  // Sync initialData or fetch
  useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await pencairanService.getPencairanList(jenis);
      setData(result);
    } catch (error) {
      console.error("Gagal memuat data pencairan:", error);
    } finally {
      setIsLoading(false);
    }
  }, [jenis]);

  // Statistics for Status Pills
  const stats = useMemo(() => {
    const summary = {
      all: { count: data.length, total: 0 },
      diproses: { count: 0, total: 0 },
      selesai: { count: 0, total: 0 },
    };

    data.forEach((item) => {
      const nominal = item.nominalDiterima || item.nominalPengajuan || 0;
      summary.all.total += nominal;

      const st = item.statusPencairan || (item.buktiTransferUrl ? "selesai" : "diproses");
      if (st === "selesai") {
        summary.selesai.count += 1;
        summary.selesai.total += nominal;
      } else {
        summary.diproses.count += 1;
        summary.diproses.total += nominal;
      }
    });

    return summary;
  }, [data]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Jenis Match
      const itemJenisLower = (item.jenis || "").toLowerCase();
      const currentJenisLower = (jenis || "").toLowerCase();
      const matchJenis = !jenis || currentJenisLower === "all" || itemJenisLower === currentJenisLower;

      // 2. Status Pencairan Match (hanya 2 status: diproses / selesai)
      const currentItemStatus: PencairanStatus = item.statusPencairan || (item.buktiTransferUrl ? "selesai" : "diproses");
      const matchStatus = statusFilter === "all" || currentItemStatus === statusFilter;

      // 3. Date Range
      const itemDateStr = item.tanggalPengajuan;
      const matchStart = !dateRangeFilter.startDate || (itemDateStr ? new Date(itemDateStr) >= new Date(dateRangeFilter.startDate) : true);
      const matchEnd = !dateRangeFilter.endDate || (itemDateStr ? new Date(itemDateStr) <= new Date(dateRangeFilter.endDate) : true);

      // 4. Nominal Range
      const minNom = Number(nominalRangeFilter.minNominal);
      const maxNom = Number(nominalRangeFilter.maxNominal);
      const nominalVal = item.nominalDiterima || item.nominalPengajuan;
      const matchMinNominal = nominalRangeFilter.minNominal === "" || nominalRangeFilter.minNominal === undefined || nominalVal >= minNom;
      const matchMaxNominal = nominalRangeFilter.maxNominal === "" || nominalRangeFilter.maxNominal === undefined || nominalVal <= maxNom;

      return matchJenis && matchStatus && matchStart && matchEnd && matchMinNominal && matchMaxNominal;
    });
  }, [data, jenis, statusFilter, dateRangeFilter, nominalRangeFilter]);

  // Modal Handlers
  const handleOpenPencairanModal = useCallback((item: PencairanItem) => {
    setActiveModalItem(item);
  }, []);

  const handleClosePencairanModal = useCallback(() => {
    setActiveModalItem(null);
  }, []);

  // Submit Bukti Transfer & Selesaikan Pencairan
  const handleSubmitPencairan = useCallback(
    async (payload: PencairanPayload) => {
      setIsSubmitting(true);
      try {
        const updatedItem = await pencairanService.submitPencairan(payload);

        // Update local dataset
        setData((prev) =>
          prev.map((it) => (it.id === payload.id ? updatedItem : it))
        );

        // Also update selected drawer item if currently open
        if (selectedItemDetail?.id === payload.id) {
          setSelectedItemDetail(updatedItem);
        }

        handleClosePencairanModal();
      } catch (error) {
        console.error("Gagal memproses pencairan:", error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedItemDetail, handleClosePencairanModal]
  );

  return {
    data,
    filteredData,
    isLoading,
    isSubmitting,
    stats,
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
  };
}
