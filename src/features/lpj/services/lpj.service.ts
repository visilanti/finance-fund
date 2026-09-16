import { InfoLPJ, LPJBase, DetailItemLPJ } from "../types";

let MOCK_INFO_LPJ: InfoLPJ[] = [
  {
    idPengajuan: "001/PJ-RKA/IT/2026",
    tanggalCair: "09 Mar 2026",
    jenis: "RKA",
    saldoAwal: 45000000,
    saldoAkhir: 1500000,
    status: "disetujui",
  },
  {
    idPengajuan: "002/PJ-RKA/CLOUD/2026",
    tanggalCair: "08 Mar 2026",
    jenis: "RKA",
    saldoAwal: 78500000,
    saldoAkhir: 0,
    status: "submit",
  },
  {
    idPengajuan: "003/PJ-INS/OPS/2026",
    tanggalCair: "06 Mar 2026",
    jenis: "Insidental",
    saldoAwal: 15000000,
    saldoAkhir: undefined,
    status: "belum_lpj",
  },
  {
    idPengajuan: "004/REIMB/MKT/2026",
    tanggalCair: "07 Mar 2026",
    jenis: "Reimbursement",
    saldoAwal: 5100000,
    saldoAkhir: 0,
    status: "disetujui",
  },
  {
    idPengajuan: "005/REIMB/GA/2026",
    tanggalCair: "11 Mar 2026",
    jenis: "Reimbursement",
    saldoAwal: 3750000,
    saldoAkhir: undefined,
    status: "belum_lpj",
  },
  {
    idPengajuan: "006/KW-JALDIS/IT/2026",
    tanggalCair: "05 Mar 2026",
    jenis: "Jaldis",
    saldoAwal: 8600000,
    saldoAkhir: 450000,
    status: "ditolak",
  },
  {
    idPengajuan: "007/KW-JALDIS/BD/2026",
    tanggalCair: "12 Mar 2026",
    jenis: "Jaldis",
    saldoAwal: 12400000,
    saldoAkhir: 800000,
    status: "submit",
  },
  {
    idPengajuan: "008/PJ-INS/HR/2026",
    tanggalCair: "04 Mar 2026",
    jenis: "Insidental",
    saldoAwal: 9800000,
    saldoAkhir: 200000,
    status: "ditolak",
  },
];

const MOCK_LPJ_DETAIL_MAP: Record<string, LPJBase> = {
  "001/PJ-RKA/IT/2026": {
    idPengajuan: "001/PJ-RKA/IT/2026",
    tanggalCair: "09 Mar 2026",
    jenis: "RKA",
    saldoAwal: 45000000,
    status: "disetujui",
    rincian: {
      item: [
        {
          tanggal: "10 Mar 2026",
          noKwitansi: "KW-IT/001/2026",
          keterangan: "Pembelian Unit Workstation Core i9 14900K",
          debit: 0,
          kredit: 35000000,
        },
        {
          tanggal: "11 Mar 2026",
          noKwitansi: "KW-IT/002/2026",
          keterangan: "Upgrade RAM 64GB DDR5 & NVMe Gen4 2TB",
          debit: 0,
          kredit: 8500000,
        },
        {
          tanggal: "12 Mar 2026",
          noKwitansi: "KW-IT/003/2026",
          keterangan: "Pengembalian Sisa Dana Operasional ke Kas",
          debit: 1500000,
          kredit: 0,
        },
      ],
      saldoAkhir: 1500000,
      silpa: 1500000,
    },
    LpjUrl: "/documents/LPJ_001_PJ-RKA_IT_2026.pdf",
  },
  "002/PJ-RKA/CLOUD/2026": {
    idPengajuan: "002/PJ-RKA/CLOUD/2026",
    tanggalCair: "08 Mar 2026",
    jenis: "RKA",
    saldoAwal: 78500000,
    status: "submit",
    rincian: {
      item: [
        {
          tanggal: "09 Mar 2026",
          noKwitansi: "KW-INV/AWS-2026-03",
          keterangan: "Pembayaran Tagihan Cloud AWS Production Cluster Q1",
          debit: 0,
          kredit: 52300000,
        },
        {
          tanggal: "10 Mar 2026",
          noKwitansi: "KW-INV/GCP-2026-03",
          keterangan: "Langganan Google Cloud Platform Data Warehouse",
          debit: 0,
          kredit: 26200000,
        },
      ],
      saldoAkhir: 0,
      silpa: 0,
    },
    LpjUrl: "/documents/LPJ_002_PJ-RKA_CLOUD_2026.pdf",
  },
  "003/PJ-INS/OPS/2026": {
    idPengajuan: "003/PJ-INS/OPS/2026",
    tanggalCair: "06 Mar 2026",
    jenis: "Insidental",
    saldoAwal: 15000000,
    status: "belum_lpj",
    rincian: {
      item: [],
      saldoAkhir: undefined,
      silpa: undefined,
    },
    LpjUrl: "",
  },
  "004/REIMB/MKT/2026": {
    idPengajuan: "004/REIMB/MKT/2026",
    tanggalCair: "07 Mar 2026",
    jenis: "Reimbursement",
    saldoAwal: 5100000,
    status: "disetujui",
    rincian: {
      item: [
        {
          tanggal: "07 Mar 2026",
          noKwitansi: "RESTO-MKT-081",
          keterangan: "Jamuan Makan Siang Kemitraan Bank Nusantara",
          debit: 0,
          kredit: 3200000,
        },
        {
          tanggal: "07 Mar 2026",
          noKwitansi: "TAXI-EXP-992",
          keterangan: "Transportasi Tim Presentasi & Meeting",
          debit: 0,
          kredit: 1900000,
        },
      ],
      saldoAkhir: 0,
      silpa: 0,
    },
    LpjUrl: "/documents/LPJ_004_REIMB_MKT_2026.pdf",
  },
  "005/REIMB/GA/2026": {
    idPengajuan: "005/REIMB/GA/2026",
    tanggalCair: "11 Mar 2026",
    jenis: "Reimbursement",
    saldoAwal: 3750000,
    status: "belum_lpj",
    rincian: {
      item: [],
      saldoAkhir: undefined,
      silpa: undefined,
    },
    LpjUrl: "",
  },
  "006/KW-JALDIS/IT/2026": {
    idPengajuan: "006/KW-JALDIS/IT/2026",
    tanggalCair: "05 Mar 2026",
    jenis: "Jaldis",
    saldoAwal: 8600000,
    status: "ditolak",
    rincian: {
      item: [
        {
          tanggal: "06 Mar 2026",
          noKwitansi: "TIKET-GA-2291",
          keterangan: "Tiket Kereta Eksekutif PP Jakarta - Surabaya",
          debit: 0,
          kredit: 3400000,
        },
        {
          tanggal: "07 Mar 2026",
          noKwitansi: "HTL-SBY-883",
          keterangan: "Akomodasi Hotel 2 Malam Surabaya Pusat",
          debit: 0,
          kredit: 2850000,
        },
        {
          tanggal: "08 Mar 2026",
          noKwitansi: "OPR-TRP-012",
          keterangan: "Uang Saku Harian & Transport Lokal (Kwitansi tidak lengkap)",
          debit: 0,
          kredit: 1900000,
        },
      ],
      saldoAkhir: 450000,
      silpa: 450000,
    },
    LpjUrl: "/documents/LPJ_006_KW-JALDIS_IT_2026.pdf",
  },
  "007/KW-JALDIS/BD/2026": {
    idPengajuan: "007/KW-JALDIS/BD/2026",
    tanggalCair: "12 Mar 2026",
    jenis: "Jaldis",
    saldoAwal: 12400000,
    status: "submit",
    rincian: {
      item: [
        {
          tanggal: "13 Mar 2026",
          noKwitansi: "AV-GA-9912",
          keterangan: "Tiket Pesawat Garuda Indonesia PP Bali",
          debit: 0,
          kredit: 6200000,
        },
        {
          tanggal: "14 Mar 2026",
          noKwitansi: "HTL-DPS-102",
          keterangan: "Hotel Seminar & Workshop Edukasi",
          debit: 0,
          kredit: 3900000,
        },
        {
          tanggal: "15 Mar 2026",
          noKwitansi: "MEAL-DPS-091",
          keterangan: "Konsumsi Harian dan Sewa Kendaraan",
          debit: 0,
          kredit: 1500000,
        },
      ],
      saldoAkhir: 800000,
      silpa: 800000,
    },
    LpjUrl: "/documents/LPJ_007_KW-JALDIS_BD_2026.pdf",
  },
  "008/PJ-INS/HR/2026": {
    idPengajuan: "008/PJ-INS/HR/2026",
    tanggalCair: "04 Mar 2026",
    jenis: "Insidental",
    saldoAwal: 9800000,
    status: "ditolak",
    rincian: {
      item: [
        {
          tanggal: "05 Mar 2026",
          noKwitansi: "KW-HR/MED-01",
          keterangan: "Pemberian Bantuan Kesehatan Darurat Karyawan",
          debit: 0,
          kredit: 7500000,
        },
        {
          tanggal: "06 Mar 2026",
          noKwitansi: "KW-HR/MED-02",
          keterangan: "Obat-obatan & Perlengkapan Medis Khusus (Struk buram)",
          debit: 0,
          kredit: 2100000,
        },
      ],
      saldoAkhir: 200000,
      silpa: 200000,
    },
    LpjUrl: "/documents/LPJ_008_PJ-INS_HR_2026.pdf",
  },
};

export class LPJService {
  /**
   * Mengambil daftar seluruh pengajuan LPJ (semua jenis pengajuan).
   */
  async getDaftarLPJ(): Promise<InfoLPJ[]> {
    // Simulasi latency network ringan
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_INFO_LPJ]);
      }, 100);
    });
  }

  /**
   * Mengambil detail lengkap LPJ berdasarkan ID Pengajuan.
   */
  async getLPJDetail(idPengajuan: string): Promise<LPJBase | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const detail = MOCK_LPJ_DETAIL_MAP[idPengajuan];
        if (detail) {
          resolve({ ...detail });
          return;
        }

        // Fallback jika idPengajuan ada di MOCK_INFO_LPJ tapi belum dibuat di MOCK_LPJ_DETAIL_MAP
        const info = MOCK_INFO_LPJ.find((i) => i.idPengajuan === idPengajuan);
        if (info) {
          const fallback: LPJBase = {
            idPengajuan: info.idPengajuan,
            tanggalCair: info.tanggalCair,
            jenis: info.jenis,
            saldoAwal: info.saldoAwal,
            status: info.status,
            rincian: {
              item: [],
              saldoAkhir: info.saldoAkhir,
              silpa: info.saldoAkhir,
            },
            LpjUrl: "",
          };
          resolve(fallback);
          return;
        }

        resolve(null);
      }, 100);
    });
  }

  /**
   * Mengunggah dokumen LPJ untuk suatu pengajuan.
   * Mengubah status menjadi "submit", memperbarui tanggal, dan menyimpan url dokumen.
   */
  async uploadLPJ(
    idPengajuan: string,
    fileData: { name: string; size?: number | string; url?: string },
    keterangan?: string
  ): Promise<{ success: boolean; data: LPJBase }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Perbarui di info list
        MOCK_INFO_LPJ = MOCK_INFO_LPJ.map((item) => {
          if (item.idPengajuan === idPengajuan) {
            return {
              ...item,
              status: "submit",
              saldoAkhir: item.saldoAkhir ?? 0,
            };
          }
          return item;
        });

        // Perbarui di detail map
        let existingDetail = MOCK_LPJ_DETAIL_MAP[idPengajuan];
        if (!existingDetail) {
          const info = MOCK_INFO_LPJ.find((i) => i.idPengajuan === idPengajuan)!;
          existingDetail = {
            idPengajuan,
            tanggalCair: info.tanggalCair,
            jenis: info.jenis,
            saldoAwal: info.saldoAwal,
            status: "submit",
            rincian: {
              item: [
                {
                  tanggal: new Date().toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }),
                  noKwitansi: `KW-${idPengajuan.replace(/[^a-zA-Z0-9]/g, "")}`,
                  keterangan: keterangan || `Pertanggungjawaban LPJ Berkas ${fileData.name}`,
                  debit: 0,
                  kredit: info.saldoAwal,
                },
              ],
              saldoAkhir: 0,
              silpa: 0,
            },
            LpjUrl: fileData.url || `/documents/${fileData.name}`,
          };
        } else {
          existingDetail = {
            ...existingDetail,
            status: "submit",
            LpjUrl: fileData.url || `/documents/${fileData.name}`,
            rincian: {
              ...existingDetail.rincian,
              item:
                existingDetail.rincian.item.length > 0
                  ? existingDetail.rincian.item
                  : [
                      {
                        tanggal: new Date().toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }),
                        noKwitansi: `KW-${idPengajuan.replace(/[^a-zA-Z0-9]/g, "")}`,
                        keterangan: keterangan || `Realisasi Dokumen ${fileData.name}`,
                        debit: 0,
                        kredit: existingDetail.saldoAwal,
                      },
                    ],
              saldoAkhir: existingDetail.rincian.saldoAkhir ?? 0,
              silpa: existingDetail.rincian.silpa ?? 0,
            },
          };
        }

        MOCK_LPJ_DETAIL_MAP[idPengajuan] = existingDetail;

        resolve({
          success: true,
          data: existingDetail,
        });
      }, 250);
    });
  }
}

export const lpjService = new LPJService();
