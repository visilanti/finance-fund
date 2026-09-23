"use client";

import React, { useState } from "react";
import { CreditCard, Plus, Trash2, CheckCircle2, Copy, Check, Building, AlertCircle } from "lucide-react";
import { FormCardSection } from "@/components/shared/FormCardSection";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { COMMON_BANKS } from "@/constants";
import { Profile, ProfileRekening } from "../types";
import { BankCard } from "../../pengajuan/components/forms/BankCard";

interface MasterRekeningSectionProps {
  profile: Profile;
  onAddRekening: (rekening: Omit<ProfileRekening, "id">) => void;
  onDeleteRekening: (id: string) => void;
  onSetDefaultRekening: (id: string) => void;
}

export function MasterRekeningSection({
  profile,
  onAddRekening,
  onDeleteRekening,
  onSetDefaultRekening,
}: MasterRekeningSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [bank, setBank] = useState(COMMON_BANKS[0]);
  const [noRekening, setNoRekening] = useState("");
  const [namaPemilik, setNamaPemilik] = useState(profile.fullName || "");
  const [isDefault, setIsDefault] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const daftarRekening = profile.daftarRekening || [
    {
      id: "rek-default",
      bank: profile.rekeningAktif?.bank || "-",
      noRekening: profile.rekeningAktif?.noRekening || "-",
      name: profile.rekeningAktif?.name || "-",
      isDefault: true,
    },
  ];

  const formatRekeningNumber = (num: string) => {
    if (!num) return "-";
    const cleaned = num.replace(/\s+/g, "");
    return cleaned.match(/.{1,4}/g)?.join(" ") || num;
  };

  const handleCopy = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bank || !noRekening.trim() || !namaPemilik.trim()) return;

    onAddRekening({
      bank,
      noRekening: noRekening.trim(),
      name: namaPemilik.trim(),
      isDefault,
    });

    // Reset Form
    setNoRekening("");
    setShowAddForm(false);
    setIsDefault(false);
  };

  return (
    <FormCardSection
      title="Master Rekening Pencairan"
      description="Atur rekening bank tujuan transfer untuk pencairan dana."
      action={
        !showAddForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Tambah Rekening
          </Button>
        )
      }
    >
      {profile.rekeningAktif && (
        <BankCard
          bank={profile.rekeningAktif.bank}
          noRekening={profile.rekeningAktif.noRekening}
          name={profile.rekeningAktif.name}
          isDefault={profile.rekeningAktif.isDefault ?? true}
          variant="primary"
        />
      )}

      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 space-y-4 transition-all"
        >
          <div className="flex items-center justify-between border-b border-primary/20 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-primary" />
              Tambah Rekening Baru
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Bank
              </label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {COMMON_BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Rekening
              </label>
              <Input
                value={noRekening}
                onChange={(e) => setNoRekening(e.target.value.replace(/\D/g, ""))}
                placeholder="Hanya digit angka"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Pemilik Rekening
              </label>
              <Input
                value={namaPemilik}
                onChange={(e) => setNamaPemilik(e.target.value)}
                placeholder="Harus sesuai buku tabungan"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
              />
              <span>Jadikan sebagai rekening utama pencairan</span>
            </label>

            <div className="flex items-center gap-2 self-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Simpan Rekening
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Daftar Rekening Tersimpan ({daftarRekening.length})
        </h4>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 font-semibold">Nama Bank</th>
                <th className="p-3 font-semibold">Nomor Rekening</th>
                <th className="p-3 font-semibold">Atas Nama</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {daftarRekening.map((rek, idx) => {
                const isCurrentDefault =
                  rek.isDefault ||
                  (profile.rekeningAktif &&
                    profile.rekeningAktif.noRekening === rek.noRekening);

                const itemKey = rek.id || `rek-${idx}`;

                return (
                  <tr
                    key={itemKey}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rek.bank}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span>{rek.noRekening}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(itemKey, rek.noRekening)}
                          title="Salin No. Rekening"
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
                        >
                          {copiedId === itemKey ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {rek.name}
                    </td>
                    <td className="p-3 text-center">
                      {isCurrentDefault ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Utama
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCurrentDefault && (
                          <button
                            type="button"
                            onClick={() => onSetDefaultRekening(rek.id || itemKey)}
                            className="px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors cursor-pointer"
                          >
                            Set Utama
                          </button>
                        )}
                        {daftarRekening.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onDeleteRekening(rek.id || itemKey)}
                            title="Hapus Rekening"
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </FormCardSection>
  );
}
