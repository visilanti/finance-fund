import { InfoLPJ, LPJBase } from "../types";

let MOCK_INFO_LPJ: InfoLPJ[] = [
  {
    id: "e2b80456-821f-4b9e-9d29-a35c24e68e01",
    noPengajuan: "001/PJ-RKA/IT/2026",
    tanggalCair: "2026-03-09",
    tanggalPengajuan: "2026-03-01",
    jenis: "RKA",
    saldoAwal: 45000000,
    saldoAkhir: 1500000,
    status: "disetujui",
  },
  {
    id: "7f3c1a24-9d18-4b72-88ec-d59160e94202",
    noPengajuan: "002/PJ-RKA/CLOUD/2026",
    tanggalCair: "2026-03-08",
    tanggalPengajuan: "2026-03-02",
    jenis: "RKA",
    saldoAwal: 78500000,
    saldoAkhir: 0,
    status: "submit",
  },
  {
    id: "3b92f75a-674e-4df0-9b48-e8cb90172303",
    noPengajuan: "003/PJ-INS/OPS/2026",
    tanggalCair: "2026-03-06",
    tanggalPengajuan: "2026-02-28",
    jenis: "Insidental",
    saldoAwal: 15000000,
    saldoAkhir: undefined,
    status: "belum_lpj",
  },
  {
    id: "6c1e5a82-f38b-4a57-bf91-b75d26390404",
    noPengajuan: "004/REIMB/MKT/2026",
    tanggalCair: "2026-03-07",
    tanggalPengajuan: "2026-03-01",
    jenis: "RKA",
    saldoAwal: 5100000,
    saldoAkhir: 0,
    status: "disetujui",
  },
  {
    id: "9a4d8c71-2e53-4b6a-8f19-35c7e1905505",
    noPengajuan: "005/REIMB/GA/2026",
    tanggalCair: "2026-03-11",
    tanggalPengajuan: "2026-03-03",
    jenis: "RKA",
    saldoAwal: 3750000,
    saldoAkhir: undefined,
    status: "belum_lpj",
  },
  {
    id: "1d8e2c47-3b95-4fa6-82e7-91c530e46606",
    noPengajuan: "006/PJ-INS/IT/2026",
    tanggalCair: "2026-03-05",
    tanggalPengajuan: "2026-02-25",
    jenis: "Insidental",
    saldoAwal: 8600000,
    saldoAkhir: 450000,
    status: "revisi",
  },
  {
    id: "5e7b9a32-8f14-4dc5-9321-e490b6287707",
    noPengajuan: "007/PJ-RKA/BD/2026",
    tanggalCair: "2026-03-12",
    tanggalPengajuan: "2026-03-05",
    jenis: "RKA",
    saldoAwal: 12400000,
    saldoAkhir: 800000,
    status: "submit",
  },
  {
    id: "8c2f4e19-5d73-4ea8-b619-a34c89208808",
    noPengajuan: "008/PJ-INS/HR/2026",
    tanggalCair: "2026-03-04",
    tanggalPengajuan: "2026-02-27",
    jenis: "Insidental",
    saldoAwal: 9800000,
    saldoAkhir: 200000,
    status: "revisi",
  },
];

const MOCK_LPJ_DETAIL_MAP: Record<string, LPJBase> = {
  "e2b80456-821f-4b9e-9d29-a35c24e68e01": {
    id: "e2b80456-821f-4b9e-9d29-a35c24e68e01",
    noPengajuan: "001/PJ-RKA/IT/2026",
    tanggalCair: "2026-03-09",
    jenis: "RKA",
    saldoAwal: 45000000,
    saldoAkhir: 1500000,
    silpa: 1500000,
    status: "disetujui",
    rincian: {
      item: [
        {
          tanggal: "2026-03-10",
          noKwitansi: "KW-IT/001/2026",
          keterangan: "Pembelian Unit Workstation Core i9 14900K",
          debit: 0,
          kredit: 35000000,
          buktiUrl: "/documents/nota/KW-IT-001.pdf",
          buktiNama: "KW-IT-001.pdf",
        },
        {
          tanggal: "2026-03-11",
          noKwitansi: "KW-IT/002/2026",
          keterangan: "Upgrade RAM 64GB DDR5 & NVMe Gen4 2TB",
          debit: 0,
          kredit: 8500000,
          buktiUrl: "/documents/nota/KW-IT-002.pdf",
          buktiNama: "KW-IT-002.pdf",
        },
        {
          tanggal: "2026-03-12",
          noKwitansi: "KW-IT/003/2026",
          keterangan: "Pengembalian Sisa Dana Operasional ke Kas",
          debit: 1500000,
          kredit: 0,
        },
      ],
    },
  },
  "7f3c1a24-9d18-4b72-88ec-d59160e94202": {
    id: "7f3c1a24-9d18-4b72-88ec-d59160e94202",
    noPengajuan: "002/PJ-RKA/CLOUD/2026",
    tanggalCair: "2026-03-08",
    jenis: "RKA",
    saldoAwal: 78500000,
    saldoAkhir: 0,
    silpa: 0,
    status: "submit",
    rincian: {
      item: [
        {
          tanggal: "2026-03-09",
          noKwitansi: "KW-INV/AWS-2026-03",
          keterangan: "Pembayaran Tagihan Cloud AWS Production Cluster Q1",
          debit: 0,
          kredit: 52300000,
          buktiUrl: "/documents/nota/INV-AWS-2026-03.pdf",
          buktiNama: "INV-AWS-2026-03.pdf",
        },
        {
          tanggal: "2026-03-10",
          noKwitansi: "KW-INV/GCP-2026-03",
          keterangan: "Langganan Google Cloud Platform Data Warehouse",
          debit: 0,
          kredit: 26200000,
          buktiUrl: "/documents/nota/INV-GCP-2026-03.pdf",
          buktiNama: "INV-GCP-2026-03.pdf",
        },
      ],
    },
  },
  "3b92f75a-674e-4df0-9b48-e8cb90172303": {
    id: "3b92f75a-674e-4df0-9b48-e8cb90172303",
    noPengajuan: "003/PJ-INS/OPS/2026",
    tanggalCair: "2026-03-06",
    jenis: "Insidental",
    saldoAwal: 15000000,
    saldoAkhir: undefined,
    silpa: undefined,
    status: "belum_lpj",
    rincian: {
      item: [],
    },
  },
  "6c1e5a82-f38b-4a57-bf91-b75d26390404": {
    id: "6c1e5a82-f38b-4a57-bf91-b75d26390404",
    noPengajuan: "004/REIMB/MKT/2026",
    tanggalCair: "2026-03-07",
    jenis: "RKA",
    saldoAwal: 5100000,
    saldoAkhir: 0,
    silpa: 0,
    status: "disetujui",
    rincian: {
      item: [
        {
          tanggal: "2026-03-07",
          noKwitansi: "RESTO-MKT-081",
          keterangan: "Jamuan Makan Siang Kemitraan Bank Nusantara",
          debit: 0,
          kredit: 3200000,
          buktiUrl: "/documents/nota/RESTO-MKT-081.jpg",
          buktiNama: "RESTO-MKT-081.jpg",
        },
        {
          tanggal: "2026-03-07",
          noKwitansi: "TAXI-EXP-992",
          keterangan: "Transportasi Tim Presentasi & Meeting",
          debit: 0,
          kredit: 1900000,
          buktiUrl: "/documents/nota/TAXI-EXP-992.jpg",
          buktiNama: "TAXI-EXP-992.jpg",
        },
      ],
    },
  },
  "9a4d8c71-2e53-4b6a-8f19-35c7e1905505": {
    id: "9a4d8c71-2e53-4b6a-8f19-35c7e1905505",
    noPengajuan: "005/REIMB/GA/2026",
    tanggalCair: "2026-03-11",
    jenis: "RKA",
    saldoAwal: 3750000,
    saldoAkhir: undefined,
    silpa: undefined,
    status: "belum_lpj",
    rincian: {
      item: [],
    },
  },
  "1d8e2c47-3b95-4fa6-82e7-91c530e46606": {
    id: "1d8e2c47-3b95-4fa6-82e7-91c530e46606",
    noPengajuan: "006/PJ-INS/IT/2026",
    tanggalCair: "2026-03-05",
    jenis: "Insidental",
    saldoAwal: 8600000,
    saldoAkhir: 450000,
    silpa: 450000,
    status: "revisi",
    rincian: {
      item: [
        {
          tanggal: "2026-03-06",
          noKwitansi: "TIKET-GA-2291",
          keterangan: "Tiket Kereta Eksekutif PP Jakarta - Surabaya",
          debit: 0,
          kredit: 3400000,
          buktiUrl: "/documents/nota/TIKET-GA-2291.pdf",
          buktiNama: "TIKET-GA-2291.pdf",
        },
        {
          tanggal: "2026-03-07",
          noKwitansi: "HTL-SBY-883",
          keterangan: "Akomodasi Hotel 2 Malam Surabaya Pusat",
          debit: 0,
          kredit: 2850000,
          buktiUrl: "/documents/nota/HTL-SBY-883.jpg",
          buktiNama: "HTL-SBY-883.jpg",
        },
        {
          tanggal: "2026-03-08",
          noKwitansi: "OPR-TRP-012",
          keterangan: "Uang Saku Harian & Transport Lokal (Kwitansi tidak lengkap)",
          debit: 0,
          kredit: 1900000,
          // buktiUrl sengaja kosong — alasan penolakan LPJ
        },
      ],
    },
  },
  "5e7b9a32-8f14-4dc5-9321-e490b6287707": {
    id: "5e7b9a32-8f14-4dc5-9321-e490b6287707",
    noPengajuan: "007/PJ-RKA/BD/2026",
    tanggalCair: "2026-03-12",
    jenis: "RKA",
    saldoAwal: 12400000,
    saldoAkhir: 800000,
    silpa: 800000,
    status: "submit",
    rincian: {
      item: [
        {
          tanggal: "2026-03-13",
          noKwitansi: "AV-GA-9912",
          keterangan: "Tiket Pesawat Garuda Indonesia PP Bali",
          debit: 0,
          kredit: 6200000,
          buktiUrl: "/documents/nota/AV-GA-9912.pdf",
          buktiNama: "AV-GA-9912.pdf",
        },
        {
          tanggal: "2026-03-14",
          noKwitansi: "HTL-DPS-102",
          keterangan: "Hotel Seminar & Workshop Edukasi",
          debit: 0,
          kredit: 3900000,
          buktiUrl: "/documents/nota/HTL-DPS-102.pdf",
          buktiNama: "HTL-DPS-102.pdf",
        },
        {
          tanggal: "2026-03-15",
          noKwitansi: "MEAL-DPS-091",
          keterangan: "Konsumsi Harian dan Sewa Kendaraan",
          debit: 0,
          kredit: 1500000,
          buktiUrl: "/documents/nota/MEAL-DPS-091.jpg",
          buktiNama: "MEAL-DPS-091.jpg",
        },
      ],
    },
  },
  "8c2f4e19-5d73-4ea8-b619-a34c89208808": {
    id: "8c2f4e19-5d73-4ea8-b619-a34c89208808",
    noPengajuan: "008/PJ-INS/HR/2026",
    tanggalCair: "2026-03-04",
    jenis: "Insidental",
    saldoAwal: 9800000,
    saldoAkhir: 200000,
    silpa: 200000,
    status: "revisi",
    rincian: {
      item: [
        {
          tanggal: "2026-03-05",
          noKwitansi: "KW-HR/MED-01",
          keterangan: "Pemberian Bantuan Kesehatan Darurat Karyawan",
          debit: 0,
          kredit: 7500000,
          buktiUrl: "/documents/nota/KW-HR-MED-01.pdf",
          buktiNama: "KW-HR-MED-01.pdf",
        },
        {
          tanggal: "2026-03-06",
          noKwitansi: "KW-HR/MED-02",
          keterangan: "Obat-obatan & Perlengkapan Medis Khusus (Struk buram)",
          debit: 0,
          kredit: 2100000,
          // buktiUrl sengaja kosong — alasan penolakan LPJ
        },
      ],
    },
  },
};

export class LPJService {
  /**
   * Mengambil daftar seluruh pengajuan LPJ (semua jenis pengajuan).
   */
  async getDaftarLPJ(): Promise<InfoLPJ[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_INFO_LPJ]);
      }, 100);
    });
  }

  /**
   * Mengambil detail lengkap LPJ berdasarkan UUID id atau Nomor Pengajuan.
   */
  async getLPJDetail(idOrNoPengajuan: string): Promise<LPJBase | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Cari di map langsung berdasarkan key
        let detail = MOCK_LPJ_DETAIL_MAP[idOrNoPengajuan];
        if (!detail) {
          // Cari berdasarkan id atau noPengajuan
          detail = Object.values(MOCK_LPJ_DETAIL_MAP).find(
            (d) => d.id === idOrNoPengajuan || d.noPengajuan === idOrNoPengajuan
          )!;
        }

        if (detail) {
          resolve({ ...detail });
          return;
        }

        // Fallback jika ada di MOCK_INFO_LPJ tapi belum ada entry detail
        const info = MOCK_INFO_LPJ.find(
          (i) => i.id === idOrNoPengajuan || i.noPengajuan === idOrNoPengajuan
        );
        if (info) {
          const fallback: LPJBase = {
            id: info.id,
            noPengajuan: info.noPengajuan,
            tanggalCair: info.tanggalCair,
            jenis: info.jenis,
            saldoAwal: info.saldoAwal,
            saldoAkhir: info.saldoAkhir,
            silpa: info.saldoAkhir,
            status: info.status,
            rincian: {
              item: [],
            },
          };
          resolve(fallback);
          return;
        }

        resolve(null);
      }, 100);
    });
  }

  /**
   * Simpan atau update data LPJ secara penuh (termasuk rincian kwitansi & bukti nota per item).
   */
  async saveLPJ(lpjData: LPJBase): Promise<{ success: boolean; data: LPJBase }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Perbarui di info list
        MOCK_INFO_LPJ = MOCK_INFO_LPJ.map((item) => {
          if (item.id === lpjData.id || item.noPengajuan === lpjData.noPengajuan) {
            return {
              ...item,
              status: lpjData.status,
              saldoAkhir: lpjData.saldoAkhir ?? item.saldoAkhir,
            };
          }
          return item;
        });

        // Simpan ke detail map
        MOCK_LPJ_DETAIL_MAP[lpjData.id] = { ...lpjData };

        resolve({
          success: true,
          data: { ...lpjData },
        });
      }, 250);
    });
  }
}

export const lpjService = new LPJService();
