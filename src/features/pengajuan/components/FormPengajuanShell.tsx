"use client";

import React, { useState } from "react";
import { UsePengajuanFormReturn } from "../hooks/usePengajuanForm";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { FileUploadZone } from "@/components/shared/FileUploadZone";
import { FormItemsTable } from "./FormItemsTable";
import { FormInsidentalItemsTable } from "./FormInsidentalItemsTable";
import { FormStickyFooter } from "./FormStickyFooter";
import { RKAMatrixDrawer } from "./RKAMatrixDrawer";
import { Input } from "@/components/ui/Input";
import { DatePicker } from "@/components/ui/DatePicker";

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
      setInvoiceFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveInvoice = (index: number) => {
    setInvoiceFiles((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="relative pb-24 space-y-6">
      <FormCardSection
        stepNumber={1}
        title="Informasi Pengajuan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nomor Pengajuan"
              isRequired
              onChange={(e) => form.setNomorPengajuan(e.target.value)}
              placeholder="Contoh: 001/PJ/2026"
            />
          </div>

          <div>
            <DatePicker
              id="tanggalPengajuan"
              label="Tanggal Pengajuan"
              isRequired
              onChange={(_, dateStr) => form.setTanggalPengajuan(dateStr as string)}
              placeholder="Pilih tanggal pengajuan..."
            />
          </div>

          <div>
            <DatePicker
              id="tanggalHarapan"
              label="Harapan Cair"
              isRequired
              onChange={(_, dateStr) => form.setTanggalHarapan(dateStr as string)}
              placeholder="Pilih tanggal harapan cair..."
            />
          </div>

          <div>
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
        stepNumber={3}
        title="Info Rekening Tujuan"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Bank Tujuan"
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
        stepNumber={4}
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
          value={form.namaPemilikRekening}
          onChange={(e) => form.setNamaPemilikRekening(e.target.value)}
        />
      </FormCardSection>

      {isReimbursement && (
        <FormCardSection
          stepNumber={5}
          title="Upload Invoice"
          description="Unggah satu atau beberapa file invoice Anda"
        >
          <FileUploadZone
            label="Upload / Tarik Invoice di Sini"
            sublabel="Format PDF/DOC/DOCX (Maks 10MB per file)"
            accept="image/*"
            multiple
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
        onSubmitDraft={() => form.handleSubmit(true)}
        onSubmitFinal={() => form.handleSubmit(false)}
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
