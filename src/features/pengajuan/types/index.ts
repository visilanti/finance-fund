export interface DetailItemRKA {
  kelompok: string;
  kegiatanRka: string;
  bulan: string;
  budget: number;
  nominal: number;
}

export interface DetailItemReimbursement {
  keterangan: string;
  volume: number;
  biaya: number;
  jumlah: number;
}

export type DetailItemInsidental = DetailItemReimbursement;

export interface DetailItemJaldis {
  uraian: string;
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

export interface InformasiKwitansi {
  nomor: string;
  tanggal: string;
  diberikanKepada: string;
  terbilang: string;
  tujuan: string;
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
  tanggal: string;
  kegiatan: string;
  divisi: string;
  kelompok?: string;
  nominalPengajuan: number;
  currentStatus: StatusType;
  currentStep: StepType;
  riwayatStep?: RiwayatStep[];
  harapanRealisasi?: string;
  pengesahan?: Pengesahan;
  buktiLpjUrl?: string;
  buktiLpjNama?: string;
  tanggalUploadLpj?: string;
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
  buktiPembayaranUrl?: string;
}

export interface PengajuanDanaItemJaldis extends PengajuanDanaBase {
  jenis: "Jaldis";
  itemsJaldis?: DetailItemJaldis[];
  informasiKwitansi?: InformasiKwitansi;
  buktiKwitansiUrl?: string;
}

export type PengajuanDanaItem =
  | PengajuanDanaItemRKA
  | PengajuanDanaItemInsidental
  | PengajuanDanaItemReimbursement
  | PengajuanDanaItemJaldis;
