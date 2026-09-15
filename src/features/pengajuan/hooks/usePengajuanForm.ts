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
  namaPemohon: string;
  setNamaPemohon: (v: string) => void;
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

  // Revision & Edit Mode
  alasan: string | null;
  isEditMode: boolean;

  // Actions
  isSubmitting: boolean;
  handleSubmit: () => Promise<void>;
}

export function usePengajuanForm(
  role: RoleType = "divisi",
  onSuccess?: (created: { id: string; kode: string }) => void
): UsePengajuanFormReturn {
  const service = useMemo(() => PengajuanServiceFactory.getService(role), [role]);

  // COA Options state
  const [coaOptions, setCoaOptions] = useState<COAOption[]>([]);
  const [selectedCoaCode, setSelectedCoaCode] = useState<string>("");

  // Form Fields (Empty by default for Create mode)
  const [nomorPengajuan, setNomorPengajuan] = useState<string>("");
  const [judul, setJudul] = useState<string>("");
  const [divisi, setDivisi] = useState<string>("IT & Infrastructure");
  const [tanggalPengajuan, setTanggalPengajuan] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [tanggalKebutuhan, setTanggalKebutuhan] = useState<string>("");
  const [tanggalHarapan, setTanggalHarapan] = useState<string>("");
  const [urgensi, setUrgensi] = useState<"normal" | "urgent" | "emergency">("normal");

  // Dynamic Item List (Start with 1 blank item row)
  const [items, setItems] = useState<PengajuanItemDetail[]>([
    {
      kelompok: "",
      kegiatanRka: "",
      bulan: "",
      budgetRka: 0,
      nominalPengajuan: 0,
      subtotal: 0,
      namaItem: "",
      volume: 1,
      satuan: "Unit",
      hargaSatuan: 0,
    },
  ]);

  // Vendor & Bank Account Details (Empty by default for Create mode)
  const [namaBank, setNamaBank] = useState<string>("");
  const [noRekening, setNoRekening] = useState<string>("");
  const [namaPemilikRekening, setNamaPemilikRekening] = useState<string>("");
  const [namaPemohon, setNamaPemohon] = useState<string>("");
  const [namaVendor, setNamaVendor] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");

  // Drawer State
  const [isRkaDrawerOpen, setIsRkaDrawerOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Revision & Edit Mode State
  const [alasan, setAlasan] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Fetch COA Options & Edit Data on mount
  useEffect(() => {
    service.getCOAOptions().then((options) => {
      setCoaOptions(options);
      if (options.length > 0) {
        setSelectedCoaCode(options[0].code);
      }
    });

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const editId = searchParams.get("editId") || searchParams.get("id");
      if (editId) {
        setIsEditMode(true);
        service.getPengajuanById(editId).then((data) => {
          if (data) {
            if (data.nomorPengajuan || data.kode) setNomorPengajuan(data.nomorPengajuan || data.kode || "");
            if (data.judul) setJudul(data.judul);
            if (data.divisi) setDivisi(data.divisi);
            if (data.coaCode) setSelectedCoaCode(data.coaCode);
            if (data.tanggalPengajuan) setTanggalPengajuan(data.tanggalPengajuan);
            if (data.tanggalHarapan) setTanggalHarapan(data.tanggalHarapan);
            if (data.items && data.items.length > 0) setItems(data.items);
            if (data.namaBank) setNamaBank(data.namaBank);
            if (data.noRekening) setNoRekening(data.noRekening);
            if (data.namaPemilikRekening) setNamaPemilikRekening(data.namaPemilikRekening);
            if (data.catatan) setCatatan(data.catatan);
            if (data.alasan) setAlasan(data.alasan);
          }
        });
      }
    }
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
  const handleSubmit = async () => {
    if (!nomorPengajuan.trim() || !selectedCoaCode || items.length === 0) {
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
        status: "menunggu",
      };

      const result = await service.createPengajuan(payload);
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess(result);
      } else {
        alert(`Pengajuan ${result.kode} berhasil dikirim ke Manager!`);
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
    namaPemohon,
    setNamaPemohon,
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
    alasan,
    isEditMode,
    isSubmitting,
    handleSubmit,
  };
}
