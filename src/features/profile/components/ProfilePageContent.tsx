"use client";

import React, { useEffect, useState } from "react";
import { useProfileStore } from "../store/useProfileStore";
import { ProfileHeader } from "./ProfileHeader";
import { MasterRekeningSection } from "./MasterRekeningSection";
import { DigitalSignatureSection } from "./DigitalSignatureSection";
import { Check, RefreshCw } from "lucide-react";

export function ProfilePageContent() {
  const {
    profile,
    loadProfile,
    updateProfile,
    updateSignature,
    addRekening,
    deleteRekening,
    setDefaultRekening,
    resetProfile,
  } = useProfileStore();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateIdentity = (updated: Parameters<typeof updateProfile>[0]) => {
    updateProfile(updated);
    showToast("Data identitas diri berhasil disimpan.");
  };

  const handleUpdateSignature = (ttdUrl: string) => {
    updateSignature(ttdUrl);
    showToast("Spesimen tanda tangan digital berhasil diperbarui.");
  };

  const handleResetSignature = () => {
    updateSignature("/images/signature.png");
    showToast("Spesimen tanda tangan dikembalikan ke default.");
  };

  const handleAddRekening = (rek: Parameters<typeof addRekening>[0]) => {
    addRekening(rek);
    showToast("Rekening baru berhasil ditambahkan.");
  };

  const handleDeleteRekening = (id: string) => {
    deleteRekening(id);
    showToast("Rekening berhasil dihapus.");
  };

  const handleSetDefaultRekening = (id: string) => {
    setDefaultRekening(id);
    showToast("Rekening utama pencairan berhasil diubah.");
  };

  return (
    <div className="space-y-6 pb-12">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 dark:text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold">{toastMessage}</p>
        </div>
      )}

      <ProfileHeader profile={profile} />

      <MasterRekeningSection
        profile={profile}
        onAddRekening={handleAddRekening}
        onDeleteRekening={handleDeleteRekening}
        onSetDefaultRekening={handleSetDefaultRekening}
      />

      <DigitalSignatureSection
        profile={profile}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <p className="text-xs text-slate-400">
          Setiap perubahan pada identitas, rekening, dan TTD disimpan langsung pada sesi akun Anda.
        </p>
      </div>
    </div>
  );
}
