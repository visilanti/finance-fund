export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Memuat Sistem Pengajuan Finance...</p>
      </div>
    </div>
  );
}
