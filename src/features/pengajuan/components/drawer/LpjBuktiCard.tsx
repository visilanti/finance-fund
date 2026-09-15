import React from "react";
import { FileCheck, Download, ExternalLink, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface LpjBuktiCardProps {
  buktiLpjUrl?: string;
  buktiLpjNama?: string;
  tanggalUploadLpj?: string;
  kode?: string;
  kegiatan?: string;
  divisi?: string;
  nominal?: number;
}

export function LpjBuktiCard({
  buktiLpjUrl,
  buktiLpjNama = "Dokumen_LPJ_Laporan_Pertanggungjawaban.pdf",
  tanggalUploadLpj = "14 Maret 2026",
  kode = "",
  kegiatan = "",
  divisi = "",
  nominal,
}: LpjBuktiCardProps) {
  const fileUrl = buktiLpjUrl || "#";

  const handleDownload = () => {
    if (fileUrl && fileUrl !== "#") {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = buktiLpjNama;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const fileContent = `=================================================\nLAPORAN PERTANGGUNGJAWABAN (LPJ) KEUANGAN\n=================================================\nKode Pengajuan : ${kode || "PJ-2026"}\nKegiatan       : ${kegiatan || "Pengajuan Keuangan"}\nTanggal Upload : ${tanggalUploadLpj}\nStatus LPJ     : VERIFIKASI SELESAI\n=================================================\nDokumen ini merupakan bukti sah pengesahan LPJ.`;
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = buktiLpjNama.endsWith(".pdf")
        ? buktiLpjNama.replace(".pdf", ".txt")
        : buktiLpjNama;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card
      variant="secondary"
    >
      <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
              {buktiLpjNama}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Diupload: {tanggalUploadLpj} • PDF Document (2.4 MB)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {fileUrl && fileUrl !== "#" && (
            <button
              type="button"
              onClick={() => window.open(fileUrl, "_blank")}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Pratinjau File"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
          <Button
            type="button"
            size="sm"
            variant="primary"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownload}
            className="text-[11px] py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white border-none cursor-pointer"
          >
            Download LPJ
          </Button>
        </div>
      </div>
    </Card>
  );
}
