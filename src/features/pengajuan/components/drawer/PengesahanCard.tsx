"use client";

import React, { useEffect } from "react";
import { UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useProfileStore } from "@/features/profile/store/useProfileStore";

interface PengesahanCardProps {
  title?: string;
  namaTerang?: string;
  tandaTanganUrl?: string | null;
  currentUser?: {
    namaTerang?: string;
    tandaTanganUrl?: string;
  };
  digisignId?: string;
}

export function PengesahanCard({
  title = "Pengesahan",
  namaTerang,
  tandaTanganUrl,
  currentUser,
}: PengesahanCardProps) {
  const { profile, loadProfile } = useProfileStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Cek ketersediaan URL tanda tangan yang valid
  const hasProvidedTtd = Boolean(tandaTanganUrl && tandaTanganUrl !== "#");

  const finalTtd = hasProvidedTtd
    ? tandaTanganUrl
    : currentUser?.tandaTanganUrl || null;

  const finalNamaTerang =
    namaTerang || currentUser?.namaTerang || (hasProvidedTtd ? profile.fullName : "-");

  return (
    <Card
      variant="secondary"
      title={title}
      leftIcon={<UserCheck className="w-3 h-3 text-slate-400" />}
      className="p-3 space-y-1.5 flex flex-col justify-between"
      headerClassName="border-b-0 pb-0"
    >
      {/* Preview Image Tanda Tangan Digital / Status Belum Tersedia */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-1.5 flex flex-col items-center justify-center min-h-[46px]">
        {finalTtd ? (
          <img
            src={finalTtd}
            alt="Tanda Tangan Digital"
            className="max-h-9 object-contain dark:invert dark:brightness-200"
          />
        ) : (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic py-1">
            Tanda tangan belum tersedia
          </span>
        )}
        <div className="w-full text-center border-t border-dashed border-slate-200/80 dark:border-slate-800 pt-0.5 mt-0.5 text-[9px] font-mono text-slate-400 truncate">
          {finalNamaTerang}
        </div>
      </div>
    </Card>
  );
}
