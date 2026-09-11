"use client";

import React, { useState } from "react";
import { UseJaldisFormReturn } from "../hooks/useJaldisForm";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { FormJaldisRincianTable } from "./FormJaldisRincianTable";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/utils";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Save, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormJaldisShellProps {
  form: UseJaldisFormReturn;
}

export function FormJaldisShell({ form }: FormJaldisShellProps) {
  const { isDesktopCollapsed } = useSidebarStore();
  const [ttdPreviewUrl, setTtdPreviewUrl] = useState<string | null>(null);

  const handleTtdSelect = (files: FileList | null) => {
    if (files && files[0]) {
      setTtdPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div className="relative pb-28 space-y-6">
      <FormCardSection
        stepNumber={1}
        title="Informasi Kwitansi"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="No. Kwitansi"
              isRequired
              value={form.noKwitansi}
              onChange={(e) => form.setNoKwitansi(e.target.value)}
              placeholder="Contoh: 001/SPD/IT/IX/2026"
            />
          </div>

          {/* Tanggal */}
          <div>
            <DatePicker
              id="tanggalJaldis"
              label="Tanggal"
              isRequired
              onChange={(_, dateStr) => form.setTanggal(dateStr as string)}
              placeholder="Pilih tanggal..."
            />
          </div>

          {/* <div>
            <Input
              label="Divisi / Unit Kerja"
              isRequired
              value={form.divisi}
              disabled
            />
          </div>

          <div>
            <Input
              label="Type Pengajuan"
              isRequired
              value="Perjalanan Dinas"
              disabled
            />
          </div> */}

          <div className="md:col-span-2">
            <Input
              label="Diberikan Kepada"
              isRequired
              value={form.diberikanKepada}
              onChange={(e) => form.setDiberikanKepada(e.target.value)}
              placeholder="Nama lengkap penerima / pelaksana perjalanan dinas"
            />
          </div>

          {/* Uang Sejumlah — input manual sebagai patokan batas anggaran */}
          <div className="md:col-span-2">
            <Input
              label="Uang Sejumlah"
              isRequired
              variant="number"
              min={0}
              value={form.batasAnggaran || ""}
              onChange={(e) => form.setBatasAnggaran(Number(e.target.value))}
              placeholder="Masukkan nominal anggaran yang disetujui..."
              helperText={
                form.batasAnggaran > 0
                  ? `Terbilang: ${form.terbilangBatas}`
                  : undefined
              }
            />
          </div>

          {/* Untuk Pembayaran */}
          <div className="md:col-span-2">
            <Input
              label="Untuk Pembayaran"
              isRequired
              value={form.untukPembayaran}
              onChange={(e) => form.setUntukPembayaran(e.target.value)}
              placeholder="Contoh: Perjalanan Dinas ke Surabaya tanggal 10-12 September 2026"
            />
          </div>
        </div>
      </FormCardSection>

      {/* KARTU 2: Tabel Rincian Biaya */}
      <FormJaldisRincianTable
        items={form.items}
        onAddItem={form.addItem}
        onRemoveItem={form.removeItem}
        onUpdateItem={form.updateItem}
        totalJumlah={form.totalJumlah}
        batasAnggaran={form.batasAnggaran}
      />

      <FormCardSection
        stepNumber={3}
        title="Tanda Tangan & Pengesahan"
      >
        <FileUploadZone
          label="Upload / Tarik TTD di Sini"
          sublabel="Format PNG/JPG Transparan (Maks 2MB)"
          accept="image/*"
          multiple
          onFileSelect={handleTtdSelect}
          previewUrl={ttdPreviewUrl}
          onClearPreview={() => setTtdPreviewUrl(null)}
        />

        <Input
          label="Nama Terang Pemohon"
          placeholder="Masukkan nama pemohon..."
          value={form.diberikanKepada}
          onChange={(e) => form.setDiberikanKepada(e.target.value)}
        />
      </FormCardSection>

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-dropdown px-4 sm:px-6 py-3 transition-all duration-200",
          "left-0",
          isDesktopCollapsed ? "md:left-20" : "md:left-64"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Total */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
              Total Kwitansi
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {formatIDR(form.totalJumlah)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Save className="w-3.5 h-3.5" />}
              onClick={() => form.handleSubmit(true)}
              isLoading={form.isSubmitting}
            >
              Simpan Draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-3.5 h-3.5" />}
              onClick={() => form.handleSubmit(false)}
              isLoading={form.isSubmitting}
            >
              Kirim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
