import { PengajuanDanaItem, KelompokRKA } from "../types";
import { DetailItemLPJ } from "@/features/lpj/types";

export interface RKAItemMonthly {
  month: string; // "Jan", "Feb", ... "Des"
  budget: number;
  terpakai: number;
  sisa: number;
}

export interface PengajuanItemDetail {
  id?: string;
  kelompok?: string;
  kegiatanRka?: string;
  bulan?: string;
  budgetRka?: number;
  nominalPengajuan?: number;
  namaItem?: string;
  volume?: number;
  satuan?: string;
  hargaSatuan?: number;
  biaya?: number;
  subtotal?: number;
  keterangan?: string;
  detailItemLPJ?: DetailItemLPJ[];
}

export interface PengajuanPayload {
  id?: string;
  kode?: string;
  nomorPengajuan?: string;
  divisi: string;
  judul: string;
  tanggalPengajuan?: string;
  tanggalKebutuhan?: string;
  tanggalHarapan?: string;
  urgensi: "normal" | "urgent" | "emergency";
  items: PengajuanItemDetail[];
  totalNominal: number;

  // Rekening Vendor / Penerima
  namaBank: string;
  noRekening: string;
  namaPemilikRekening: string;
  namaVendor: string;

  // Dokumen Pendukung & Catatan
  catatan?: string;
  lampiranFiles?: string[];

  status?: "draft" | "menunggu" | "disetujui" | "ditolak" | "diproses" | "selesai";
  alasan?: string;
}

export interface PengajuanMetricsSummary {
  totalUsulan: number;
  menungguApprovalCount: number;
  disetujuiTotal: number;
  sisaPlafonRka: number;
}

export interface IPengajuanService {
  createPengajuan(payload: PengajuanPayload): Promise<{ id: string; kode: string }>;
  getPengajuanById(id: string): Promise<PengajuanPayload | null>;
  getDaftarPengajuan(): Promise<PengajuanDanaItem[]>;
  getDataRKA(): Promise<KelompokRKA[]>;
  getMetricsSummary(): Promise<PengajuanMetricsSummary>;
  approvePengajuan(id: string, notes?: string): Promise<boolean>;
  rejectPengajuan(id: string, reason: string): Promise<boolean>;
}

