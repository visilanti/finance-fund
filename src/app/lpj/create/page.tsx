"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { FormLPJShell } from "@/features/lpj/components/FormLPJShell";
import { lpjService } from "@/features/lpj/services/lpj.service";
import { LPJBase } from "@/features/lpj/types";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

function CreateLPJContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [lpj, setLpj] = useState<LPJBase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await lpjService.getLPJDetail(id);
        setLpj(data);
      } catch (err) {
        console.error("Gagal memuat detail LPJ:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (updatedData: LPJBase) => {
    setIsSubmitting(true);
    try {
      await lpjService.saveLPJ(updatedData);
      alert(`Laporan Pertanggungjawaban (LPJ) ${updatedData.noPengajuan} berhasil disimpan dan dikirim!`);
      router.push("/lpj");
    } catch (err) {
      console.error("Gagal menyimpan LPJ:", err);
      alert("Terjadi kesalahan saat menyimpan LPJ. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-medium text-slate-500">Memuat data pengajuan LPJ...</span>
      </div>
    );
  }

  if (!id || !lpj) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Pengajuan Tidak Ditemukan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Pembuatan LPJ harus berdasarkan data pengajuan yang valid dan sudah dicairkan. Silakan pilih pengajuan dari daftar LPJ terlebih dahulu.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push("/lpj")}
          className="mx-auto"
        >
          Kembali ke Daftar LPJ
        </Button>
      </div>
    );
  }

  return <FormLPJShell lpj={lpj} onSave={handleSave} isSubmitting={isSubmitting} />;
}

export default function CreateLPJPage() {
  return (
    <MainLayoutShell
      pageTitle="Form Laporan Pertanggungjawaban (LPJ)"
      initialRole="divisi"
      activePath="/lpj"
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-xs font-medium text-slate-500">Memuat...</span>
          </div>
        }
      >
        <CreateLPJContent />
      </Suspense>
    </MainLayoutShell>
  );
}
