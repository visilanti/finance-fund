"use client";

import { useState, useMemo } from "react";

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
  handleSubmit: (asDraft?: boolean) => void;
}

function numberToTerbilang(n: number): string {
  if (n === 0) return "Nol";
  const satuan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan",
    "Sepuluh", "Sebelas", "Dua Belas", "Tiga Belas", "Empat Belas", "Lima Belas",
    "Enam Belas", "Tujuh Belas", "Delapan Belas", "Sembilan Belas"];

  function baca(x: number): string {
    if (x < 20) return satuan[x];
    if (x < 100) return satuan[Math.floor(x / 10) + 10 - 10] === "" ? "" : `${satuan[Math.floor(x / 10) + 10 - 10]} Puluh${x % 10 !== 0 ? " " + satuan[x % 10] : ""}`;
    if (x < 200) return `Seratus${x % 100 !== 0 ? " " + baca(x % 100) : ""}`;
    if (x < 1000) return `${satuan[Math.floor(x / 100)]} Ratus${x % 100 !== 0 ? " " + baca(x % 100) : ""}`;
    if (x < 2000) return `Seribu${x % 1000 !== 0 ? " " + baca(x % 1000) : ""}`;
    if (x < 1000000) return `${baca(Math.floor(x / 1000))} Ribu${x % 1000 !== 0 ? " " + baca(x % 1000) : ""}`;
    if (x < 1000000000) return `${baca(Math.floor(x / 1000000))} Juta${x % 1000000 !== 0 ? " " + baca(x % 1000000) : ""}`;
    return `${baca(Math.floor(x / 1000000000))} Miliar${x % 1000000000 !== 0 ? " " + baca(x % 1000000000) : ""}`;
  }

  return baca(Math.round(n)) + " Rupiah";
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

  const handleSubmit = (asDraft = false) => {
    if (!asDraft && (!noKwitansi.trim() || !diberikanKepada.trim())) {
      alert("Mohon lengkapi No. Kwitansi dan nama penerima.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess({ kode: noKwitansi || "JALDIS-DRAFT" });
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
