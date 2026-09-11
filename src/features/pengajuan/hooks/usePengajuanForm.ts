"use client";

import { useState, useMemo, useEffect } from "react";
import { PengajuanPayload, PengajuanItemDetail, COAOption } from "../services/pengajuanService.types";
import { PengajuanServiceFactory } from "../services/pengajuanService.factory";
import { RoleType } from "@/components/layout/Sidebar";

export interface UsePengajuanFormReturn {
  // Form State
  nomorPengajuan: string;
  setNomorPengajuan: (v: string) => void;
  judul: string;
  setJudul: (v: string) => void;
  divisi: string;
  setDivisi: (v: string) => void;
  selectedCoaCode: string;
  setSelectedCoaCode: (v: string) => void;
  tanggalPengajuan: string;
  setTanggalPengajuan: (v: string) => void;
  tanggalKebutuhan: string;
  setTanggalKebutuhan: (v: string) => void;
  tanggalHarapan: string;
  setTanggalHarapan: (v: string) => void;
  urgensi: "normal" | "urgent" | "emergency";
  setUrgensi: (v: "normal" | "urgent" | "emergency") => void;

  // Item List State
  items: PengajuanItemDetail[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: keyof PengajuanItemDetail, value: any) => void;

  // Rekening & Vendor State
  namaBank: string;
  setNamaBank: (v: string) => void;
  noRekening: string;
  setNoRekening: (v: string) => void;
  namaPemilikRekening: string;
  setNamaPemilikRekening: (v: string) => void;
  namaVendor: string;
  setNamaVendor: (v: string) => void;

  // Catatan & Attachments
  catatan: string;
  setCatatan: (v: string) => void;

  // Calculated Values
  totalNominal: number;
  coaOptions: COAOption[];
  selectedCoa: COAOption | null;
  isOverBudget: boolean;

  // Drawer UI State
  isRkaDrawerOpen: boolean;
  setIsRkaDrawerOpen: (open: boolean) => void;

  // Actions
  isSubmitting: boolean;
  handleSubmit: (asDraft?: boolean) => Promise<void>;
}

export function usePengajuanForm(
  role: RoleType = "divisi",
  onSuccess?: (created: { id: string; kode: string }) => void
): UsePengajuanFormReturn {
  const service = useMemo(() => PengajuanServiceFactory.getService(role), [role]);

  // COA Options state
  const [coaOptions, setCoaOptions] = useState<COAOption[]>([]);
  const [selectedCoaCode, setSelectedCoaCode] = useState<string>("");

  // Form Fields
  const [nomorPengajuan, setNomorPengajuan] = useState<string>("001/PJ/2026");
  const [judul, setJudul] = useState<string>("");
  const [divisi, setDivisi] = useState<string>("IT & Infrastructure");
  const [tanggalPengajuan, setTanggalPengajuan] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [tanggalKebutuhan, setTanggalKebutuhan] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [tanggalHarapan, setTanggalHarapan] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [urgensi, setUrgensi] = useState<"normal" | "urgent" | "emergency">("normal");

  // Dynamic Item List
  const [items, setItems] = useState<PengajuanItemDetail[]>([]);

  // Vendor & Bank Account Details
  const [namaBank, setNamaBank] = useState<string>("Bank Mandiri");
  const [noRekening, setNoRekening] = useState<string>("");
  const [namaPemilikRekening, setNamaPemilikRekening] = useState<string>("");
  const [namaVendor, setNamaVendor] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");

  // Drawer State
  const [isRkaDrawerOpen, setIsRkaDrawerOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch COA Options on mount
  useEffect(() => {
    service.getCOAOptions().then((options) => {
      setCoaOptions(options);
      if (options.length > 0) {
        setSelectedCoaCode(options[0].code);
      }
    });
  }, [service]);

  // Active selected COA object
  const selectedCoa = useMemo(() => {
    return coaOptions.find((c) => c.code === selectedCoaCode) || null;
  }, [coaOptions, selectedCoaCode]);

  // Dynamic Total Calculation
  const totalNominal = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.nominalPengajuan ?? curr.subtotal ?? 0), 0);
  }, [items]);

  // Check if current proposed total exceeds remaining monthly budget for COA
  const isOverBudget = useMemo(() => {
    if (!selectedCoa) return false;
    return totalNominal > selectedCoa.sisaBulanIni;
  }, [selectedCoa, totalNominal]);

  // Item List Handlers
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        kelompok: "Operasional",
        kegiatanRka: "Pengadaan Hardware IT & Server",
        bulan: "Januari",
        budgetRka: 25000000,
        nominalPengajuan: 0,
        subtotal: 0,
        namaItem: "",
        volume: 1,
        satuan: "Unit",
        hargaSatuan: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return; // Keep at least 1 row
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PengajuanItemDetail, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: value };

      if (field === "nominalPengajuan" || field === "subtotal") {
        const val = Number(value) || 0;
        target.nominalPengajuan = val;
        target.subtotal = val;
      }

      if (field === "volume" || field === "hargaSatuan" || field === "biaya") {
        const vol = field === "volume" ? Number(value) : (target.volume ?? 1);
        const harga = (field === "hargaSatuan" || field === "biaya") ? Number(value) : (target.biaya ?? target.hargaSatuan ?? 0);
        target.volume = vol;
        target.biaya = harga;
        target.hargaSatuan = harga;
        target.subtotal = (vol || 0) * (harga || 0);
        target.nominalPengajuan = target.subtotal;
      }

      updated[index] = target;
      return updated;
    });
  };

  // Submit Handler
  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && (!nomorPengajuan.trim() || !selectedCoaCode || items.length === 0)) {
      alert("Mohon lengkapi nomor pengajuan, COA, dan minimal 1 rincian item.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: PengajuanPayload = {
        nomorPengajuan,
        judul: judul || nomorPengajuan,
        divisi,
        coaCode: selectedCoaCode,
        tanggalPengajuan,
        tanggalKebutuhan,
        tanggalHarapan,
        urgensi,
        items,
        totalNominal,
        namaBank,
        noRekening,
        namaPemilikRekening,
        namaVendor,
        catatan,
        status: asDraft ? "draft" : "menunggu",
      };

      const result = await service.createPengajuan(payload);
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess(result);
      } else {
        alert(
          asDraft
            ? `Draft pengajuan berhasil disimpan!`
            : `Pengajuan ${result.kode} berhasil dikirim ke Manager!`
        );
      }
    } catch (err: any) {
      setIsSubmitting(false);
      alert(`Gagal menyimpan pengajuan: ${err.message}`);
    }
  };

  return {
    nomorPengajuan,
    setNomorPengajuan,
    judul,
    setJudul,
    divisi,
    setDivisi,
    selectedCoaCode,
    setSelectedCoaCode,
    tanggalPengajuan,
    setTanggalPengajuan,
    tanggalKebutuhan,
    setTanggalKebutuhan,
    tanggalHarapan,
    setTanggalHarapan,
    urgensi,
    setUrgensi,
    items,
    addItem,
    removeItem,
    updateItem,
    namaBank,
    setNamaBank,
    noRekening,
    setNoRekening,
    namaPemilikRekening,
    setNamaPemilikRekening,
    namaVendor,
    setNamaVendor,
    catatan,
    setCatatan,
    totalNominal,
    coaOptions,
    selectedCoa,
    isOverBudget,
    isRkaDrawerOpen,
    setIsRkaDrawerOpen,
    isSubmitting,
    handleSubmit,
  };
}
