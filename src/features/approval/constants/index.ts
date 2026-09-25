export interface ApprovalStatusPill {
  key: string;
  label: string;
  color: string;
}

export const APPROVAL_STATUS_PILLS: ApprovalStatusPill[] = [
  { key: "all", label: "Semua Status", color: "bg-slate-500" },
  { key: "pending", label: "Menunggu Verifikasi", color: "bg-amber-500" },
  { key: "disetujui", label: "Disetujui", color: "bg-emerald-500" },
  { key: "ditolak", label: "Ditolak", color: "bg-rose-500" },
];
