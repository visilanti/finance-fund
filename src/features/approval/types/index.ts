import { PengajuanDanaItem } from "@/features/pengajuan/types";

export type StatusApprovalFilter = "all" | "menunggu" | "disetujui" | "ditolak";

export type ApprovalItem = PengajuanDanaItem & {
  catatanVerifikator?: string;
  tanggalApproval?: string;
  approvedBy?: string;
};

export interface ApprovalActionPayload {
  id: string;
  status: "disetujui" | "ditolak";
  catatan?: string;
  danaDisetujui?: number;
}
