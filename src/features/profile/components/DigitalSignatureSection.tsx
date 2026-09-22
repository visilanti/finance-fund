"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Profile } from "../types";
import { Button } from "@/components/ui/Button";
import { ModalTtd } from "./ModalTtd";
import { useProfileStore } from "../store/useProfileStore";

interface DigitalSignatureSectionProps {
  profile: Profile;
}

export function DigitalSignatureSection({
  profile,
}: DigitalSignatureSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateSignature = useProfileStore((s) => s.updateSignature);
  const currentTtd = profile.ttdUrl || "/images/signature.png";

  return (
    <>
      <FormCardSection
        title="Spesimen Tanda Tangan Digital (TTD)"
        description="TTD ini akan otomatis disematkan pada setiap lembar pengesahan transaksi pengajuan dan verifikasi."
        action={
          <Button
            type="button"
            variant="outline"
            className="px-4 h-9"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Ubah Spesimen
          </Button>
        }
      >
        <div className="bg-slate-50/80 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden">
          <img
            src={currentTtd}
            alt="Spesimen Tanda Tangan"
            className="max-h-16 max-w-[180px] object-contain dark:invert dark:brightness-200 transition-all duration-200"
          />
          <div className="w-full text-center border-t border-dashed border-slate-300 dark:border-slate-700 pt-1.5 mt-2">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {profile.fullName || "Ahmad Hidayat"}
            </p>
            <p className="text-[10px] font-mono text-slate-400">
              {profile.nip ? `NIP. ${profile.nip}` : profile.unit}
            </p>
          </div>
        </div>
      </FormCardSection>

      <ModalTtd
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentTtdUrl={currentTtd}
        onSave={(newTtd) => updateSignature(newTtd)}
        onResetDefault={() => updateSignature("/images/signature.png")}
      />
    </>
  );
}
