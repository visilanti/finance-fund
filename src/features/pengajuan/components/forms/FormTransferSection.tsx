"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Wallet,
  ExternalLink,
} from "lucide-react";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Input } from "@/components/ui/Input";
import { COMMON_BANKS } from "@/constants";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { UsePengajuanFormReturn } from "@/features/pengajuan/hooks/usePengajuanForm";
import { BankCard } from "./BankCard";

interface FormTransferSectionProps {
  form: UsePengajuanFormReturn;
  type?: "rka" | "insidental" | "reimbursement";
}

export function FormTransferSection({ form, type = "rka" }: FormTransferSectionProps) {
  const { profile, loadProfile } = useProfileStore();

  const isReimbursement = type?.toLowerCase() === "reimbursement";
  const [transferSource, setTransferSource] = useState<"profile" | "manual">("profile");

  // Load user profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const daftarRekening =
    profile?.daftarRekening && profile.daftarRekening.length > 0
      ? profile.daftarRekening
      : profile?.rekeningAktif
      ? [profile.rekeningAktif]
      : [];

  const rekeningUtama =
    (profile?.rekeningAktif?.noRekening ? profile.rekeningAktif : null) ||
    daftarRekening.find((r) => r.isDefault) ||
    daftarRekening[0] || {
      bank: "Bank Mandiri",
      noRekening: "1370019283741",
      name: profile?.fullName || "Ahmad Hidayat",
      isDefault: true,
    };

  // Sync initial bank account from profile if form fields are empty or when reimbursement
  useEffect(() => {
    if (isReimbursement || transferSource === "profile") {
      if (!form.noRekening || (isReimbursement && form.noRekening !== rekeningUtama.noRekening)) {
        form.setNamaBank(rekeningUtama.bank);
        form.setNoRekening(rekeningUtama.noRekening);
        form.setNamaPemilikRekening(rekeningUtama.name);
      }
    }
  }, [isReimbursement, transferSource, rekeningUtama.bank, rekeningUtama.noRekening, rekeningUtama.name]);

  const handleSwitchToManual = () => {
    if (isReimbursement) return;
    setTransferSource("manual");
    if (!form.namaBank || !COMMON_BANKS.includes(form.namaBank)) {
      form.setNamaBank(COMMON_BANKS[0]);
    }
  };

  const handleSwitchToProfile = () => {
    setTransferSource("profile");
    if (rekeningUtama) {
      form.setNamaBank(rekeningUtama.bank);
      form.setNoRekening(rekeningUtama.noRekening);
      form.setNamaPemilikRekening(rekeningUtama.name);
    }
  };

  return (
    <FormCardSection
      title={isReimbursement ? "Rekening Pencairan Reimbursement" : "Pilihan Rekening Transfer Pencairan"}
      description={
        isReimbursement
          ? "Pencairan dana reimbursement akan ditransfer langsung ke rekening utama profil Anda."
          : "Pilih rekening tujuan pencairan dana dari Master Rekening Profil Anda atau transfer ke pihak ketiga / vendor."
      }
    >
      <div className="space-y-5">
        {/* Source Switcher: Profil vs Manual (Hanya untuk non-reimbursement) */}
        {!isReimbursement && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleSwitchToProfile}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                transferSource === "profile"
                  ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs ring-1 ring-primary/40"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50"
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  transferSource === "profile"
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Wallet className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Rekening Profil Saya
                  </span>
                  {transferSource === "profile" && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Gunakan rekening utama yang terdaftar di profil akun Anda.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleSwitchToManual}
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                transferSource === "manual"
                  ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs ring-1 ring-primary/40"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50"
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  transferSource === "manual"
                    ? "bg-primary text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Input Rekening Manual / Vendor
                  </span>
                  {transferSource === "manual" && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Kirim pencairan langsung ke rekening vendor atau pihak ketiga lainnya.
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Section 1: Rekening Profil (Selalu aktif untuk reimbursement atau saat dipilih) */}
        {(isReimbursement || transferSource === "profile") && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-primary" />
                Rekening Utama Profil Anda:
              </label>
              <a
                href="/profile"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Kelola di Profil</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {rekeningUtama ? (
              <BankCard
                bank={rekeningUtama.bank}
                noRekening={rekeningUtama.noRekening}
                name={rekeningUtama.name}
                isDefault={true}
                variant="light"
                className="max-w-md max-h-[200px]"
              />
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                Belum ada rekening utama yang diatur pada profil akun Anda.
              </div>
            )}
          </div>
        )}

        {/* Section 2: Input Manual / Rekening Vendor (Hanya untuk RKA dan Insidental) */}
        {!isReimbursement && transferSource === "manual" && (
          <div className="space-y-4 pt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Input
                  label="Bank Tujuan Transfer"
                  value={form.namaBank}
                  onChange={(e) => form.setNamaBank(e.target.value)}
                  placeholder="Contoh: Bank Mandiri"
                  isRequired
                />
              </div>

              <div>
                <Input
                  label="Nomor Rekening"
                  value={form.noRekening}
                  onChange={(e) => form.setNoRekening(e.target.value.replace(/\D/g, ""))}
                  placeholder="Contoh: 1370019283741"
                  isRequired
                />
              </div>

              <div>
                <Input
                  label="Nama Pemilik Rekening"
                  value={form.namaPemilikRekening}
                  onChange={(e) => form.setNamaPemilikRekening(e.target.value)}
                  placeholder="Sesuai dengan buku tabungan"
                  isRequired
                />
              </div>

              <div className="md:col-span-3">
                <Input
                  label="Nama Vendor / Perusahaan Penerima (Opsional)"
                  value={form.namaVendor}
                  onChange={(e) => form.setNamaVendor(e.target.value)}
                  placeholder="Contoh: PT Solusi Mitra Mandiri (Kosongkan jika transfer perorangan)"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </FormCardSection>
  );
}
