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

export interface PengajuanDanaItem {
  id: string;
  kode: string;
  tanggal: string;
  kegiatan: string;
  divisi: string;
  kelompok?: string;
  nominal: number;
  status: "disetujui" | "ditolak" | "menunggu" | "diproses";
  approverNext: string;
  harapanRealisasi?: string;
  jenis: "RKA" | "Insidental" | "Reimbursement" | "Perjalanan";

  // Detailed fields based on type (Untitled-1 spec)
  itemsRka?: DetailItemRKA[];
  itemsReimbursement?: DetailItemReimbursement[];
  itemsInsidental?: DetailItemReimbursement[];
  itemsJaldis?: DetailItemJaldis[];

  rekeningTujuan?: RekeningTujuan;
  pengesahan?: Pengesahan;
  buktiPembayaranUrl?: string;

  informasiKwitansi?: InformasiKwitansi;
  buktiKwitansiUrl?: string;
}
