"use client";

import React from "react";
import { Mail, Building2, CheckCircle2, CreditCard } from "lucide-react";
import { Profile } from "../types";
import { getInitials } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = getInitials(profile.fullName || "User");
  const hasTtd = Boolean(profile.ttdUrl);
  const hasRekening = Boolean(profile.rekeningAktif?.noRekening);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 md:p-6 shadow-sm relative overflow-hidden transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-1">
        {/* User Info Avatar & Details */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-md border-2 border-white dark:border-slate-800">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white" title="Akun Aktif">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg md:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {profile.fullName}
              </h1>
              {/* Role Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.roles?.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {profile.unit}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
                <span className={`w-1.5 h-1.5 rounded-full ${hasTtd ? "bg-emerald-500" : "bg-amber-400"}`} />
                <span className="font-medium">TTD {hasTtd ? "Aktif" : "Belum Ada"}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
                <CreditCard className="w-3 h-3 text-slate-400" />
                <span className="font-medium">{hasRekening ? profile.rekeningAktif.bank : "Rekening Belum Diatur"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
