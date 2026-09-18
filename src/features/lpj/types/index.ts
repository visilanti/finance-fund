export type StatusLPJ = "belum_lpj" | "submit" | "ditolak" | "disetujui" | string;
export type JenisLPJ = "RKA" | "Insidental" | "Reimbursement" | "Jaldis" | string;

//get info utama lpj untuk semua jenis
export interface InfoLPJ {
  id: string;
  noPengajuan: string;
  tanggalCair: string;
  tanggalPengajuan?: string;
  jenis: JenisLPJ;
  saldoAwal: number;
  saldoAkhir?: number;
  status: StatusLPJ;
}

export interface DetailItemLPJ {
  tanggal: string;
  noKwitansi: string;
  keterangan: string;
  debit: number;
  kredit: number;
}

//buat get dan insert by id 
export interface LPJBase {
  id: string;
  noPengajuan: string;
  tanggalCair: string;
  jenis: JenisLPJ;
  saldoAwal: number;
  saldoAkhir?: number;
  silpa?: number;
  status: StatusLPJ;
  rincian: {
    item: DetailItemLPJ[];
  };
  LpjUrl: string;
}
