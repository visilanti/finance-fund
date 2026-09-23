"use client";

import { useState, useMemo, useEffect } from "react";
import { PengajuanPayload, PengajuanItemDetail } from "../services/pengajuanService.types";
import { PengajuanServiceFactory } from "../services/pengajuanService.factory";
import { RoleType } from "@/components/layout/Sidebar";
import { KelompokRKA } from "../types";
import { MOCK_KELOMPOK_RKA } from "../services/divisiPengajuan.service";

export interface UsePengajuanFormReturn {
  // Form State
  nomorPengajuan: string;
  setNomorPengajuan: (v: string) => void;
  judul: string;
  setJudul: (v: string) => void;
  divisi: string;
  setDivisi: (v: string) => void;
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
  isOverBudget: boolean;
  kelompokRkaList: KelompokRKA[];

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

  // Data RKA state
  const [kelompokRkaList, setKelompokRkaList] = useState<KelompokRKA[]>([]);

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

  // Fetch Edit Data on mount
  useEffect(() => {
    if (service.getDataRKA) {
      service.getDataRKA().then((rkaData) => {
        if (rkaData && rkaData.length > 0) {
          setKelompokRkaList(rkaData);
        }
      });
    }

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const editId = searchParams.get("editId") || searchParams.get("id");
      if (editId) {
        service.getPengajuanById(editId).then((data) => {
          if (data) {
            const statusLower = data.status?.toLowerCase();
            const isEditable = statusLower === "ditolak" || statusLower === "draft";

            if (!isEditable) {
              window.location.href = "/pengajuan?type=rka";
              return;
            }

            setIsEditMode(true);
            if (data.nomorPengajuan || data.kode) setNomorPengajuan(data.nomorPengajuan || data.kode || "");
            if (data.judul) setJudul(data.judul);
            if (data.divisi) setDivisi(data.divisi);
            if (data.tanggalPengajuan) setTanggalPengajuan(data.tanggalPengajuan);
            if (data.tanggalHarapan) setTanggalHarapan(data.tanggalHarapan);
            if (data.items && data.items.length > 0) setItems(data.items);
            if (data.namaBank) setNamaBank(data.namaBank);
            if (data.noRekening) setNoRekening(data.noRekening);
            if (data.namaPemilikRekening) setNamaPemilikRekening(data.namaPemilikRekening);
            if (data.catatan) setCatatan(data.catatan);
            if (data.alasan) setAlasan(data.alasan);
          } else {
            window.location.href = "/pengajuan?type=rka";
          }
        });
      }
    }
  }, [service]);

  // Dynamic Total Calculation
  const totalNominal = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.nominalPengajuan ?? curr.subtotal ?? 0), 0);
  }, [items]);

  // Check if current proposed items exceed budget RKA
  const isOverBudget = useMemo(() => {
    const hasItemOverBudget = items.some(
      (item) => (item.budgetRka || 0) > 0 && (item.nominalPengajuan || 0) > (item.budgetRka || 0)
    );
    const totalBudget = items.reduce((acc, curr) => acc + (curr.budgetRka || 0), 0);
    return hasItemOverBudget || (totalBudget > 0 && totalNominal > totalBudget);
  }, [items, totalNominal]);

  // Item List Handlers
  const addItem = () => {
    setItems((prev) => [
      ...prev,
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
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return; // Keep at least 1 row
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PengajuanItemDetail, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: value };
      const activeRkaList = kelompokRkaList.length > 0 ? kelompokRkaList : MOCK_KELOMPOK_RKA;

      if (field === "kelompok") {
        target.kelompok = value;
        if (target.kegiatanRka && activeRkaList.length > 0) {
          const kel = activeRkaList.find((k) => k.namaKelompok === value);
          const stillValid = kel?.DetailItemRKA.some((d) => d.kegiatanRka === target.kegiatanRka);
          if (!stillValid) {
            target.kegiatanRka = "";
            target.bulan = "";
            target.budgetRka = 0;
          }
        }
      }

      if (field === "kegiatanRka") {
        target.kegiatanRka = value;
        if (value && activeRkaList.length > 0) {
          const currentKel = activeRkaList.find((k) => k.namaKelompok === target.kelompok);
          const parentKel = target.kelompok
            ? currentKel
            : activeRkaList.find((k) => k.DetailItemRKA.some((d) => d.kegiatanRka === value));
          const matched = parentKel?.DetailItemRKA.find((d) => d.kegiatanRka === value);

          if (matched && parentKel) {
            if (!target.kelompok) target.kelompok = parentKel.namaKelompok;
            const availableMonths = matched.detail.map((d) => d.bulan);
            if (!target.bulan || !availableMonths.includes(target.bulan)) {
              target.bulan = availableMonths[0] || "";
            }
            const matchedMonth = matched.detail.find((d) => d.bulan === target.bulan);
            target.budgetRka = matchedMonth?.budget || 0;
          } else {
            target.bulan = "";
            target.budgetRka = 0;
          }
        }
      }

      if (field === "bulan") {
        target.bulan = value;
        if (target.kegiatanRka && activeRkaList.length > 0) {
          const kel = activeRkaList.find((k) => k.namaKelompok === target.kelompok);
          const matchedKeg =
            kel?.DetailItemRKA.find((d) => d.kegiatanRka === target.kegiatanRka) ||
            activeRkaList.flatMap((k) => k.DetailItemRKA).find((d) => d.kegiatanRka === target.kegiatanRka);
          const matchedMonth = matchedKeg?.detail.find((d) => d.bulan === value);
          if (matchedMonth) {
            target.budgetRka = matchedMonth.budget;
          }
        }
      }

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

      if (field === "detailItemLPJ") {
        target.detailItemLPJ = value;
      }

      updated[index] = target;
      return updated;
    });
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!nomorPengajuan.trim() || items.length === 0) {
      alert("Mohon lengkapi nomor pengajuan dan minimal 1 rincian item.");
      return;
    }

    if (!namaBank.trim() || !noRekening.trim() || !namaPemilikRekening.trim()) {
      alert("Mohon lengkapi informasi rekening bank tujuan transfer pencairan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: PengajuanPayload = {
        nomorPengajuan,
        judul: judul || nomorPengajuan,
        divisi,
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
    isOverBudget,
    kelompokRkaList,
    isRkaDrawerOpen,
    setIsRkaDrawerOpen,
    alasan,
    isEditMode,
    isSubmitting,
    handleSubmit,
  };
}
