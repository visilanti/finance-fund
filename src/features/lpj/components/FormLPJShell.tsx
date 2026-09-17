"use client";

import React, { useState } from "react";
import { LPJBase, DetailItemLPJ } from "../types";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/utils";
import { FormLPJItemsTable } from "./FormLPJItemsTable";
import { PernyataanModal } from "./PernyataanModal";
import { AlertCircle, Send, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormStickyFooter } from "@/components/shared/FormStickyFooter";

interface FormLPJShellProps {
  lpj: LPJBase;
  onSave: (data: LPJBase) => Promise<void>;
  isSubmitting?: boolean;
}

export function FormLPJShell({ lpj, onSave, isSubmitting = false }: FormLPJShellProps) {
  const router = useRouter();

  // Local form state - rincian belanja (memisahkan baris awal Pencairan Dana jika sudah tersimpan sebelumnya)
  const [items, setItems] = useState<DetailItemLPJ[]>(() => {
    const raw = lpj.rincian?.item || [];
    return raw.filter(
      (it) => !it.keterangan?.toLowerCase().startsWith("pencairan dana")
    );
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isPernyataanOpen, setIsPernyataanOpen] = useState(false);

  // Real-time calculations: Pengeluaran kredit mengurangi saldo awal
  const totalKredit = items.reduce((acc, curr) => acc + (Number(curr.kredit) || 0), 0);
  const saldoAkhir = lpj.saldoAwal - totalKredit;
  const silpa = Math.max(0, saldoAkhir);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        tanggal: "",
        noKwitansi: "",
        keterangan: "",
        debit: 0,
        kredit: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof DetailItemLPJ, value: any) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPernyataanOpen(true);
  };

  const handleConfirmSubmit = async () => {
    // Baris 1: Pencairan Dana Awal yang disabled di form
    const pencairanRow: DetailItemLPJ = {
      tanggal: lpj.tanggalCair,
      noKwitansi: "-",
      keterangan: `Pencairan Dana — ${lpj.jenis}`,
      debit: lpj.saldoAwal,
      kredit: 0,
    };

    const updatedLpj: LPJBase = {
      ...lpj,
      status: "submit",
      rincian: {
        item: [pencairanRow, ...items],
        saldoAkhir,
        silpa,
      },
      LpjUrl: lpj.LpjUrl,
    };

    await onSave(updatedLpj);
    setIsPernyataanOpen(false);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFiles([]);
  };

  const isDitolak = lpj.status === "ditolak";

  return (
    <form onSubmit={handleSubmit} className="relative pb-28 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "List LPJ", href: "/lpj" },
          { label: `Form LPJ - ${lpj.noPengajuan}` },
        ]}
      />

      {/* Banner Peringatan jika status ditolak / perlu revisi */}
      {isDitolak && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1.5 text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Catatan Verifikator</span>
          </div>
          <div className="text-xs text-rose-800 dark:text-rose-300 bg-white/70 dark:bg-rose-900/30 p-2.5 rounded-lg border border-rose-200/60 dark:border-rose-800/40">
            Silakan sesuaikan item kwitansi atau perbarui lampiran scan kwitansi yang belum jelas/lengkap.
          </div>
        </div>
      )}

      {/* KARTU 1: Informasi Dasar Pengajuan (Read-Only) */}
      <FormCardSection
        title="Informasi Pengajuan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Input
              label="Nomor Pengajuan"
              value={lpj.noPengajuan}
              disabled
              className="font-mono font-medium text-slate-700 dark:text-slate-300"
            />
          </div>

          <div>
            <Input
              label="Jenis Pengajuan"
              value={lpj.jenis}
              disabled
              className="font-medium text-slate-700 dark:text-slate-300"
            />
          </div>

          <div>
            <Input
              label="Tanggal Cair"
              value={lpj.tanggalCair}
              disabled
              className="font-medium text-slate-700 dark:text-slate-300"
            />
          </div>

          <div>
            <Input
              label="Saldo Awal Dana"
              value={formatIDR(lpj.saldoAwal)}
              disabled
              className="font-bold text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </FormCardSection>

      {/* KARTU 2: Rincian Realisasi Kwitansi (Tabel Dinamis) */}
      <FormLPJItemsTable
        items={items}
        saldoAwal={lpj.saldoAwal}
        tanggalCair={lpj.tanggalCair}
        jenis={lpj.jenis}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onUpdateItem={handleUpdateItem}
      />

      {/* KARTU 3: Upload Dokumen Berkas LPJ */}
      <FormCardSection
        title="Dokumen Berkas LPJ"
      >
        <FileUploadZone
          label="Tarik & Lepas Berkas LPJ di Sini"
          sublabel="Format PDF (Maksimal 10MB)"
          accept=".pdf,application/pdf"
          onFileSelect={handleFileSelect}
          files={uploadedFiles}
          onRemoveFile={handleRemoveFile}
        />
      </FormCardSection>

      {/* Sticky Bottom Summary & Submit Bar */}
      <FormStickyFooter
        totalLabel="Total Realisasi"
        totalNominal={totalKredit}
        actions={
          <>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
              isLoading={isSubmitting}
            >
              Kirim LPJ
            </Button>
          </>
        }
      />

      {/* Modal Pernyataan LPJ (Varian TaskModal - Terkunci dari Klik Backdrop) */}
      <PernyataanModal
        isOpen={isPernyataanOpen}
        onClose={() => setIsPernyataanOpen(false)}
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmitting}
        namaPenerima="Budi Santoso"
        divisi={
          lpj.noPengajuan.includes("/IT/")
            ? "Divisi IT"
            : lpj.noPengajuan.includes("/HR/")
            ? "Divisi HR"
            : lpj.noPengajuan.includes("/MKT/")
            ? "Divisi Marketing"
            : lpj.noPengajuan.includes("/GA/")
            ? "Divisi General Affairs"
            : lpj.noPengajuan.includes("/BD/")
            ? "Divisi Business Development"
            : "Divisi IT"
        }
        tanggalCair={lpj.tanggalCair}
        noPengajuan={lpj.noPengajuan}
        jenis={lpj.jenis}
        saldoAwal={lpj.saldoAwal}
        saldoAkhir={saldoAkhir}
        silpa={silpa}
        items={items}
      />
    </form>
  );
}
