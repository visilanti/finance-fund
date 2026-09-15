"use client";

import { useState, useMemo } from "react";
import { numberToTerbilang } from "@/lib/utils";

export interface JaldisItem {
  no: number;
  uraian: string;
  jumlah: number;
}

export interface UseJaldisFormReturn {
  // Header kwitansi
  noKwitansi: string;
  setNoKwitansi: (v: string) => void;
  tanggal: string;
  setTanggal: (v: string) => void;
  diberikanKepada: string;
  setDiberikanKepada: (v: string) => void;
  /** Nominal anggaran yang diisi manual oleh user (patokan/batas) */
  batasAnggaran: number;
  setBatasAnggaran: (v: number) => void;
  /** Terbilang dari batasAnggaran */
  terbilangBatas: string;
  untukPembayaran: string;
  setUntukPembayaran: (v: string) => void;

  // Divisi (auto-filled)
  divisi: string;

  // Tabel rincian
  items: JaldisItem[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: keyof JaldisItem, value: string | number) => void;

  // Lampiran
  lampiranFiles: File[];
  addLampiran: (files: FileList | null) => void;
  removeLampiran: (index: number) => void;

  // Calculated
  totalJumlah: number;
  isOverBudget: boolean;

  // Actions
  isSubmitting: boolean;
  handleSubmit: () => void;
}

export function useJaldisForm(
  onSuccess?: (data: { kode: string }) => void
): UseJaldisFormReturn {
  const [noKwitansi, setNoKwitansi] = useState("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [diberikanKepada, setDiberikanKepada] = useState("");
  const [untukPembayaran, setUntukPembayaran] = useState("");
  const [divisi] = useState("IT & Infrastructure");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState<JaldisItem[]>([
    { no: 1, uraian: "", jumlah: 0 },
  ]);

  const [lampiranFiles, setLampiranFiles] = useState<File[]>([]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { no: prev.length + 1, uraian: "", jumlah: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, no: i + 1 }))
    );
  };

  const updateItem = (index: number, field: keyof JaldisItem, value: string | number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addLampiran = (files: FileList | null) => {
    if (files && files.length > 0) {
      setLampiranFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeLampiran = (index: number) => {
    setLampiranFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [batasAnggaran, setBatasAnggaran] = useState<number>(0);

  const totalJumlah = useMemo(
    () => items.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0),
    [items]
  );

  const terbilangBatas = useMemo(
    () => (batasAnggaran > 0 ? numberToTerbilang(batasAnggaran) : ""),
    [batasAnggaran]
  );

  const isOverBudget = useMemo(
    () => batasAnggaran > 0 && totalJumlah > batasAnggaran,
    [batasAnggaran, totalJumlah]
  );

  const handleSubmit = () => {
    if (!noKwitansi.trim() || !diberikanKepada.trim()) {
      alert("Mohon lengkapi No. Kwitansi dan nama penerima.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess({ kode: noKwitansi || "JALDIS-001" });
      }
    }, 800);
  };

  return {
    noKwitansi,
    setNoKwitansi,
    tanggal,
    setTanggal,
    diberikanKepada,
    setDiberikanKepada,
    batasAnggaran,
    setBatasAnggaran,
    terbilangBatas,
    untukPembayaran,
    setUntukPembayaran,
    divisi,
    items,
    addItem,
    removeItem,
    updateItem,
    lampiranFiles,
    addLampiran,
    removeLampiran,
    totalJumlah,
    isOverBudget,
    isSubmitting,
    handleSubmit,
  };
}
