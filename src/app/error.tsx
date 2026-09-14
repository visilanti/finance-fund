"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-none space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Terjadi Kesalahan Sistem</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {error.message || "Aplikasi mengalami hambatan saat memuat data. Silakan coba muat ulang."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-subtle transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Muat Ulang Halaman</span>
        </button>
      </div>
    </div>
  );
}
