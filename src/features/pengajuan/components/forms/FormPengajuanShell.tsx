"use client";

import React, { useState } from "react";
import { UsePengajuanFormReturn } from "@/features/pengajuan/hooks/usePengajuanForm";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { FormItemsTable } from "./FormItemsTable";
import { FormInsidentalItemsTable } from "./FormInsidentalItemsTable";
import { FormStickyFooter } from "./FormStickyFooter";
import { RKAMatrixDrawer } from "./RKAMatrixDrawer";

import { AlertCircle } from "lucide-react";

interface FormPengajuanShellProps {
  form: UsePengajuanFormReturn;
  type?: "rka" | "insidental" | "reimbursement";
}

export function FormPengajuanShell({ form, type = "rka" }: FormPengajuanShellProps) {
  const [ttdPreviewUrl, setTtdPreviewUrl] = useState<string | null>(null);
  const [invoiceFiles, setInvoiceFiles] = useState<File[]>([]);

  const isRka = type === "rka";
  const isReimbursement = type === "reimbursement";

  const typeLabelMap: Record<string, string> = {
    rka: "RKA",
    insidental: "Insidental",
    reimbursement: "Reimbursement",
  };

  const BREADCRUMB_MAP: Record<string, string> = {
    rka: "Form RKA",
    insidental: "Form Insidental",
    reimbursement: "Form Reimbursement",
    jaldis: "Form Perjalanan Dinas",
  };

  const displayTypeLabel = typeLabelMap[type || "rka"] || "RKA";

  const handleTtdSelect = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setTtdPreviewUrl(url);
    }
  };

  const handleInvoiceSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      setInvoiceFiles(Array.from(files));
    }
  };

  const handleRemoveInvoice = () => {
    setInvoiceFiles([]);
  };

  return (
    <div className="relative pb-28 space-y-6">
      <Breadcrumb
        items={[
          {
            label: "List Pengajuan",
            href: `/pengajuan?type=${type}`,
          },
          { label: BREADCRUMB_MAP[type] || "Form Pengajuan" },
        ]}
      />

      {/* Revision Rejection Banner if applicable */}
      {form.alasan && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1.5 text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Catatan Verifikator</span>
          </div>
          <div className="text-xs text-rose-800 dark:text-rose-300 bg-white/70 dark:bg-rose-900/30 p-2.5 rounded-lg border border-rose-200/60 dark:border-rose-800/40">
            {form.alasan}
          </div>
        </div>
      )}

      <FormCardSection
        // stepNumber={1}
        title="Informasi Pengajuan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nomor Pengajuan"
              isRequired
              value={form.nomorPengajuan}
              onChange={(e) => form.setNomorPengajuan(e.target.value)}
              placeholder="Contoh: 001/PJ/2026"
            />
          </div>

          <div>
            <DatePicker
              id="tanggalPengajuan"
              label="Tanggal Pengajuan"
              isRequired
              value={form.tanggalPengajuan}
              onChange={(_: Date[], dateStr: string) => form.setTanggalPengajuan(dateStr as string)}
              placeholder="Pilih tanggal pengajuan..."
            />
          </div>

          <div>
            <DatePicker
              id="tanggalHarapan"
              label="Harapan Cair"
              isRequired
              value={form.tanggalHarapan}
              onChange={(_: Date[], dateStr: string) => form.setTanggalHarapan(dateStr as string)}
              placeholder="Pilih tanggal harapan cair..."
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

          <div>
            <Input
              label="Type Pengajuan"
              isRequired
              value={displayTypeLabel}
              disabled
            />
          </div>
        </div>
      </FormCardSection>

      {isRka ? (
        <FormItemsTable
          items={form.items}
          onAddItem={form.addItem}
          onRemoveItem={form.removeItem}
          onUpdateItem={form.updateItem}
          totalNominal={form.totalNominal}
        />
      ) : (
        <FormInsidentalItemsTable
          items={form.items}
          onAddItem={form.addItem}
          onRemoveItem={form.removeItem}
          onUpdateItem={form.updateItem}
          totalNominal={form.totalNominal}
        />
      )}

      {/* KARTU 3: Rekening Tujuan & Vendor */}
      <FormCardSection
        // stepNumber={3}
        title="Info Rekening Tujuan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Bank Tujuan"
              value={form.namaBank}
              onChange={(e) => form.setNamaBank(e.target.value)}
              placeholder="Bank Mandiri / BCA / BNI"
            />
          </div>

          <div>
            <Input
              label="Nomor Rekening"
              value={form.noRekening}
              onChange={(e) => form.setNoRekening(e.target.value)}
              placeholder="Contoh: 1370019283741"
            />
          </div>

          <div>
            <Input
              label="Atas Nama (a.n)"
              value={form.namaPemilikRekening}
              onChange={(e) => form.setNamaPemilikRekening(e.target.value)}
              placeholder="Nama pemilik rekening"
            />
          </div>
        </div>
      </FormCardSection>

      <FormCardSection
        // stepNumber={4}
        title="Tanda Tangan & Pengesahan"
      >
        <FileUploadZone
          label="Upload / Tarik TTD di Sini"
          sublabel="Format PNG/JPG Transparan (Maks 2MB)"
          accept="image/*"
          onFileSelect={handleTtdSelect}
          previewUrl={ttdPreviewUrl}
          onClearPreview={() => setTtdPreviewUrl(null)}
        />

        <Input
          label="Nama Terang Pemohon"
          placeholder="Masukkan nama pemohon..."
          value={form.namaPemohon}
          onChange={(e) => form.setNamaPemohon(e.target.value)}
        />
      </FormCardSection>

      {isReimbursement && (
        <FormCardSection
          title="Upload Invoice"
        >
          <FileUploadZone
            label="Tarik & Lepas Invoice di Sini"
            sublabel="Format PDF (Maksimal 10MB)"
            accept=".pdf,application/pdf"
            onFileSelect={handleInvoiceSelect}
            files={invoiceFiles}
            onRemoveFile={handleRemoveInvoice}
          />
        </FormCardSection>
      )}

      <FormStickyFooter
        totalNominal={form.totalNominal}
        isOverBudget={isRka && form.isOverBudget}
        isSubmitting={form.isSubmitting}
        showRkaButton={isRka}
        onOpenRkaDrawer={() => form.setIsRkaDrawerOpen(true)}
        onSubmitFinal={() => form.handleSubmit()}
      />

      {isRka && (
        <RKAMatrixDrawer
          isOpen={form.isRkaDrawerOpen}
          onClose={() => form.setIsRkaDrawerOpen(false)}
          selectedCoa={form.selectedCoa}
        />
      )}
    </div>
  );
}
