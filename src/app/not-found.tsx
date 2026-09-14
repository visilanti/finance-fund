import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-none space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">404 - Halaman Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Halaman rute yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-subtle transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Dashboard Utama</span>
        </Link>
      </div>
    </div>
  );
}
