"use client";

import React, { useState } from "react";
import { UseJaldisFormReturn } from "@/features/pengajuan/hooks/useJaldisForm";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormStickyFooter } from "./FormStickyFooter";
import { FormJaldisRincianTable } from "./FormJaldisRincianTable";
import { Button } from "@/components/ui/Button";
import { Printer } from "lucide-react";

interface FormJaldisShellProps {
  form: UseJaldisFormReturn;
}

export function FormJaldisShell({ form }: FormJaldisShellProps) {
  const [ttdPreviewUrl, setTtdPreviewUrl] = useState<string | null>(null);
  const [kwitansiPreviewUrl, setKwitansiPreviewUrl] = useState<string | null>(null);

  const handleTtdSelect = (files: FileList | null) => {
    if (files && files[0]) {
      setTtdPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleKwitansiSelect = (files: FileList | null) => {
    if (files && files[0]) {
      setKwitansiPreviewUrl(URL.createObjectURL(files[0]));
      form.removeLampiran(0);
      form.addLampiran(files);
    }
  };

  const handleClearKwitansi = () => {
    setKwitansiPreviewUrl(null);
    form.removeLampiran(0);
  };

  const handlePrintKwitansi = () => {
    const kwitansiUrl = "/images/kwitansi_jaldis.jpeg";
    const win = window.open(kwitansiUrl, "_blank");
    if (win) {
      win.onload = () => {
        win.print();
      };
    } else {
      const link = document.createElement("a");
      link.href = kwitansiUrl;
      link.download = "kwitansi_jaldis.jpeg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="relative pb-28 space-y-6">
      <Breadcrumb
        items={[
          {
            label: "List Pengajuan",
            href: "/pengajuan?type=jaldis",
          },
          {
            label: "Form Perjalanan Dinas",
          },
        ]}
      />
      <FormCardSection
        // stepNumber={1}
        title="Informasi Kwitansi"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="No. Kwitansi"
              isRequired
              value={form.noKwitansi}
              onChange={(e) => form.setNoKwitansi(e.target.value)}
              placeholder="Contoh: KW-JALDIS/001/2026"
            />
          </div>

          <div>
            <DatePicker
              id="tanggalKwitansi"
              label="Tanggal Kwitansi"
              isRequired
              value={form.tanggal}
              onChange={(_: Date[], dateStr: string) => form.setTanggal(dateStr as string)}
              placeholder="Pilih tanggal kwitansi..."
            />
          </div>

          <div>
            <Input
              label="Diberikan Kepada (Nama Penerima)"
              isRequired
              value={form.diberikanKepada}
              onChange={(e) => form.setDiberikanKepada(e.target.value)}
              placeholder="Masukkan nama penerima dana..."
            />
          </div>

          <div>
            <Input
              label="Divisi"
              isRequired
              value={form.divisi}
              disabled
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Untuk Pembayaran (Tujuan Dinas)"
              isRequired
              value={form.untukPembayaran}
              onChange={(e) => form.setUntukPembayaran(e.target.value)}
              placeholder="Contoh: Perjalanan dinas survei lokasi cabang Surabaya..."
            />
          </div>

          <div>
            <Input
              label="Nominal Anggaran (Rp)"
              variant="currency"
              min={0}
              value={form.batasAnggaran || ""}
              onChange={(e) => form.setBatasAnggaran(Number(e.target.value))}
              placeholder="Masukkan nominal batas anggaran..."
            />
          </div>

          <div>
            <Input
              label="Terbilang"
              value={form.terbilangBatas}
              disabled
              placeholder="Otomatis terisi dari nominal anggaran..."
              className="bg-slate-100 dark:bg-slate-800/80 font-medium"
            />
          </div>
        </div>
      </FormCardSection>

      <FormJaldisRincianTable
        items={form.items}
        onAddItem={form.addItem}
        onRemoveItem={form.removeItem}
        onUpdateItem={form.updateItem}
        totalJumlah={form.totalJumlah}
      />

      <FormCardSection
        title="Tanda Tangan & Pengesahan"
      >
        <FileUploadZone
          label="Upload / Tarik TTD Penerima"
          sublabel="Format PNG/JPG Transparan (Maks 2MB)"
          accept="image/*"
          onFileSelect={handleTtdSelect}
          previewUrl={ttdPreviewUrl}
          onClearPreview={() => setTtdPreviewUrl(null)}
        />

        <Input
          label="Nama Terang Penerima"
          value={form.diberikanKepada}
          onChange={(e) => form.setDiberikanKepada(e.target.value)}
          placeholder="Masukkan nama terang penerima..."
        />
      </FormCardSection>

      <FormCardSection
        title="Lampiran Kwitansi"
        description="Download kwitansi dan upload"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrintKwitansi}
          >
            <span className="hidden md:inline">Download </span>Template
          </Button>
        }
      >
        <FileUploadZone
          label="Tarik & Lepas Kwitansi di Sini"
          sublabel="Format PNG/JPG (Maks 10MB)"
          accept="image/*"
          onFileSelect={handleKwitansiSelect}
          previewUrl={kwitansiPreviewUrl}
          onClearPreview={handleClearKwitansi}
        />
      </FormCardSection>

      <FormStickyFooter
        totalNominal={form.totalJumlah}
        isOverBudget={form.isOverBudget}
        isSubmitting={form.isSubmitting}
        showRkaButton={false}
        onSubmitFinal={() => form.handleSubmit()}
      />
    </div>
  );
}
