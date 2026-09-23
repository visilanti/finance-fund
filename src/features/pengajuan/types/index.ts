import { DetailItemLPJ } from "@/features/lpj/types";

export interface DetailItemRKA {
  kelompok: string;
  kegiatanRka: string;
  bulan: string;
  budget: number;
  nominal?: number;
}

export interface DetailItemReimbursement {
  keterangan: string;
  volume: number;
  biaya: number;
  jumlah: number;
  detailItemLPJ?: DetailItemLPJ[];
}

export interface DetailItemInsidental {
  keterangan: string;
  volume: number;
  biaya: number;
  jumlah: number;
}

export interface RekeningTujuan {
  namaBank: string;
  nomorRekening: string;
  namaPemilikRekening: string;
}

export interface Pengesahan {
  tandaTanganUrl?: string;
  namaTerang: string;
}


export type StepType = "manager" | "bendahara" | "finance" | "lpj" | "selesai";
export type StatusType = "disetujui" | "ditolak" | "menunggu" | "diproses" | "selesai";

export interface RiwayatStep {
  step: StepType;
  status: StatusType;
  tanggalUpdate: string;
  catatan?: string;
  diupdateOleh?: string;
}

export interface PengajuanDanaBase {
  id: string;
  kode: string;
  tanggalPengajuan: string;
  harapanRealisasi?: string;
  kegiatan: string;
  divisi: string;
  kelompok?: string;
  nominalPengajuan: number;
  nominalDiterima?: number;
  currentStatus: StatusType;
  currentStep: StepType;
  riwayatStep?: RiwayatStep[];
  pengesahan?: Pengesahan;
  buktiLpjUrl?: string;
  buktiLpjNama?: string;
  tanggalUploadLpj?: string;
  buktiUrl?: string | null;
}

export interface PengajuanDanaItemRKA extends PengajuanDanaBase {
  jenis: "RKA";
  itemsRka?: DetailItemRKA[];
  rekeningTujuan?: RekeningTujuan;
}

export interface PengajuanDanaItemInsidental extends PengajuanDanaBase {
  jenis: "Insidental";
  itemsInsidental?: DetailItemInsidental[];
  rekeningTujuan?: RekeningTujuan;
}

export interface PengajuanDanaItemReimbursement extends PengajuanDanaBase {
  jenis: "Reimbursement";
  itemsReimbursement?: DetailItemReimbursement[];
  rekeningTujuan?: RekeningTujuan;
  buktiPembayaranUrl?: string | null;
}

export type PengajuanDanaItem =
  | PengajuanDanaItemRKA
  | PengajuanDanaItemInsidental
  | PengajuanDanaItemReimbursement



// UNTUK GET DATA TABEL LIST RKA
export type KegiatanRKA = {
  kegiatanRka: string;
  detail: {
    bulan: string;
    budget: number;
    catatan?: string;
  }[];
  isChildren?: boolean;
}
//type untuk mock list kelompok dan kegiatan RKA
export interface KelompokRKA {
  id: string;
  namaKelompok: string; //nama kelompok
  DetailItemRKA: KegiatanRKA[]; //list kegiatan
}