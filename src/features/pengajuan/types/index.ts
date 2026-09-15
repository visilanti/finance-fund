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

// 1. Kumpulkan semua properti yang sama ke dalam Base Interface
export interface PengajuanDanaBase {
  id: string;
  kode: string;
  tanggal: string;
  kegiatan: string;
  divisi: string;
  kelompok?: string;
  nominal: number;
  status: "disetujui" | "ditolak" | "menunggu" | "diproses" | "selesai";
  alasan?: string;
  currentStep: StepType;
  harapanRealisasi?: string;
  pengesahan?: Pengesahan;
  buktiLpjUrl?: string;
  buktiLpjNama?: string;
  tanggalUploadLpj?: string;
}

// 2. Extend Base Interface untuk tipe RKA
export interface PengajuanDanaItemRKA extends PengajuanDanaBase {
  jenis: "RKA";
  itemsRka?: DetailItemRKA[];
  rekeningTujuan?: RekeningTujuan;
}

// 3. Extend Base Interface untuk tipe Insidental
export interface PengajuanDanaItemInsidental extends PengajuanDanaBase {
  jenis: "Insidental";
  itemsInsidental?: DetailItemInsidental[];
  rekeningTujuan?: RekeningTujuan;
}

// 4. Extend Base Interface untuk tipe Reimbursement
export interface PengajuanDanaItemReimbursement extends PengajuanDanaBase {
  jenis: "Reimbursement";
  itemsReimbursement?: DetailItemReimbursement[];
  rekeningTujuan?: RekeningTujuan;
  buktiPembayaranUrl?: string;
}

// 5. Extend Base Interface untuk tipe Jaldis
export interface PengajuanDanaItemJaldis extends PengajuanDanaBase {
  jenis: "Perjalanan";
  itemsJaldis?: DetailItemJaldis[];
  informasiKwitansi?: InformasiKwitansi;
  buktiKwitansiUrl?: string;
}

// 6. Discriminated Union type untuk semua jenis PengajuanDanaItem
export type PengajuanDanaItem =
  | PengajuanDanaItemRKA
  | PengajuanDanaItemInsidental
  | PengajuanDanaItemReimbursement
  | PengajuanDanaItemJaldis;
