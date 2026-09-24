import { DetailItemLPJ } from "@/features/lpj/types";
import { DetailItemRKA, DetailItemReimbursement, DetailItemInsidental, RekeningTujuan, Pengesahan, StepType, StatusType, RiwayatStep } from "@/features/pengajuan/types";

export type PencairanStatus = "diproses" | "selesai";

export interface PencairanItem {
  id: string;
  kode: string;
  tanggalPengajuan: string;
  harapanRealisasi?: string;
  kegiatan: string;
  divisi: string;
  kelompok?: string;
  nominalPengajuan: number;
  nominalDiterima: number; // Nominal yang disetujui untuk dicairkan
  
  // Status Pencairan: hanya 2 (diproses / selesai)
  statusPencairan: PencairanStatus;
  
  // Workflow compatibility
  currentStatus: StatusType;
  currentStep: StepType;
  riwayatStep?: RiwayatStep[];
  
  // Informasi Pencairan / Bukti Transfer
  buktiTransferUrl?: string | null;
  buktiTransferNama?: string | null;
  tanggalPencairan?: string | null;
  catatanFinance?: string | null;
  
  // Rekening Tujuan
  rekeningTujuan: RekeningTujuan;
  pengesahan?: Pengesahan;
  
  // Detail Items sesuai Jenis
  jenis: "RKA" | "Insidental" | "Reimbursement";
  itemsRka?: DetailItemRKA[];
  itemsInsidental?: DetailItemInsidental[];
  itemsReimbursement?: DetailItemReimbursement[];
  buktiPembayaranUrl?: string | null; // Untuk bukti awal reimbursement
}

export interface PencairanPayload {
  id: string;
  buktiTransferUrl: string;
  buktiTransferNama?: string;
  tanggalPencairan: string;
  nominalPencairan?: number;
  catatanFinance?: string;
}

export interface PencairanFilterState {
  searchQuery: string;
  statusFilter: string;
  startDate?: string;
  endDate?: string;
  minNominal?: string;
  maxNominal?: string;
}
