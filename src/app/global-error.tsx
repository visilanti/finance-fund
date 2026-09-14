"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto font-bold text-lg">
            !
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Terjadi Kesalahan Global</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {error.message || "Aplikasi mengalami hambatan tak terduga. Silakan coba muat ulang."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2 px-4 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
