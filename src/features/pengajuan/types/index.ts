export interface PengajuanDanaItem {
  id: string;
  kode: string;
  tanggal: string;
  judul: string;
  divisi: string;
  coa: string;
  nominal: number;
  status: "disetujui" | "ditolak" | "menunggu" | "diproses";
  approverNext: string;
  jenis: "RKA" | "Insidental" | "Reimbursement" | "Perjalanan";
}
