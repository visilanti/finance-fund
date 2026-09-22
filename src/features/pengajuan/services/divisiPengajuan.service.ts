import { apiClient } from "@/lib/api/apiClient";
import { IPengajuanService, PengajuanPayload, PengajuanMetricsSummary } from "./pengajuanService.types";
import { PengajuanDanaItem, KelompokRKA } from "../types";

const MOCK_PENGAJUAN_LIST: PengajuanDanaItem[] = [
  {
    id: "1",
    kode: "001/PJ-RKA/IT/2026",
    tanggalPengajuan: "09 Mar 2026",
    kegiatan: "Pengadaan Workstation High-Spec Core i9 untuk Dev Team",
    divisi: "IT & Infrastructure",
    kelompok: "Belanja Modal (CAPEX)",
    nominalPengajuan: 45000000,
    currentStatus: "menunggu",
    currentStep: "manager",
    jenis: "RKA",
    riwayatStep: []
  },
  {
    id: "2",
    kode: "002/PJ-RKA/CLOUD/2026",
    tanggalPengajuan: "08 Mar 2026",
    kegiatan: "Langganan Cloud Infrastructure AWS & GCP Q1 2026",
    divisi: "Cloud Engineering",
    kelompok: "Belanja Operasional (OPEX)",
    nominalPengajuan: 78500000,
    nominalDiterima: 78500000,
    currentStatus: "disetujui",
    currentStep: "selesai",
    jenis: "RKA",
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-08T09:00:00Z", diupdateOleh: "Ahmad Subagja, M.Kom." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-08T11:30:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "finance", status: "disetujui", tanggalUpdate: "2026-03-08T14:15:00Z", diupdateOleh: "Dewi Lestari, S.E." },
      { step: "selesai", status: "selesai", tanggalUpdate: "2026-03-08T16:00:00Z", diupdateOleh: "Drs. Hendra Wijaya, M.M." }
    ]
  },
  {
    id: "3",
    kode: "003/REIMB/MKT/2026",
    tanggalPengajuan: "07 Mar 2026",
    kegiatan: "Reimbursement Jamuan Client Enterprise - Bank Nusantara",
    divisi: "Marketing & Business",
    nominalPengajuan: 5100000,
    nominalDiterima: 5100000,
    currentStatus: "menunggu",
    currentStep: "manager",
    jenis: "Reimbursement",
    buktiPembayaranUrl: null,
    riwayatStep: [
      { step: "finance", status: "disetujui", tanggalUpdate: "2026-03-07T09:00:00Z", diupdateOleh: "Budi Santoso, S.T." },
    ]
  },
  {
    id: "5",
    kode: "005/PJ-INS/GA/2026",
    tanggalPengajuan: "04 Mar 2026",
    kegiatan: "Perbaikan Darurat AC Central Ruang Server Utama",
    divisi: "General Affairs",
    nominalPengajuan: 22000000,
    currentStatus: "menunggu",
    currentStep: "bendahara",
    jenis: "Insidental",
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-04T10:00:00Z", diupdateOleh: "Andi Pratama, S.T." }
    ]
  },
  {
    id: "6",
    kode: "006/PJ-RKA/HR/2026",
    tanggalPengajuan: "03 Mar 2026",
    kegiatan: "Pelatihan & Sertifikasi AWS Certified Solutions Architect",
    kelompok: "Pengembangan SDM",
    divisi: "HR & People Ops",
    nominalPengajuan: 18500000,
    nominalDiterima: 18500000,
    currentStatus: "disetujui",
    currentStep: "selesai",
    jenis: "RKA",
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-03T09:00:00Z", diupdateOleh: "Rina Wulandari, S.Psi." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-03T11:00:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "finance", status: "disetujui", tanggalUpdate: "2026-03-03T15:00:00Z", diupdateOleh: "Dewi Lestari, S.E." },
      { step: "selesai", status: "selesai", tanggalUpdate: "2026-03-03T17:00:00Z", diupdateOleh: "Drs. Hendra Wijaya, M.M." }
    ]
  },
  {
    id: "7",
    kode: "007/REIMB/GA/2026",
    tanggalPengajuan: "02 Mar 2026",
    kegiatan: "Reimbursement Pembelian Material Kebersihan & Protocol Health",
    divisi: "General Affairs",
    nominalPengajuan: 3250000,
    nominalDiterima: 3250000,
    currentStatus: "disetujui",
    currentStep: "selesai",
    jenis: "Reimbursement",
    itemsReimbursement: [
      {
        keterangan: "Pembelian Hand Sanitizer & Disinfektan",
        volume: 1,
        biaya: 1750000,
        jumlah: 1750000,
        detailItemLPJ: [
          {
            tanggal: "2026-03-01",
            noKwitansi: "KW-001/MTR/2026",
            keterangan: "Hand Sanitizer 5L (5 Jerigen)",
            debit: 0,
            kredit: 1250000,
            buktiUrl: "https://placehold.co/600x400.png",
            buktiNama: "nota-sanitizer.png",
          },
          {
            tanggal: "2026-03-01",
            noKwitansi: "KW-002/MTR/2026",
            keterangan: "Cairan Disinfektan Spray 500ml",
            debit: 0,
            kredit: 500000,
            buktiUrl: "https://placehold.co/600x400.png",
            buktiNama: "nota-disinfektan.png",
          },
        ],
      },
      {
        keterangan: "Perlengkapan Alat Kebersihan Lantai",
        volume: 1,
        biaya: 1500000,
        jumlah: 1500000,
        detailItemLPJ: [
          {
            tanggal: "2026-03-02",
            noKwitansi: "KW-003/MTR/2026",
            keterangan: "Mop Set & Floor Cleaner Concentrate",
            debit: 0,
            kredit: 1500000,
            buktiUrl: "https://placehold.co/600x400.png",
            buktiNama: "nota-alat-kebersihan.png",
          },
        ],
      },
    ],
    rekeningTujuan: {
      namaBank: "Bank Mandiri",
      nomorRekening: "1370019283741",
      namaPemilikRekening: "Budi Santoso (GA Officer)",
    },
    buktiPembayaranUrl: "https://placehold.co/600x400.png",
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-02T09:30:00Z", diupdateOleh: "Andi Pratama, S.T." },
      { step: "finance", status: "disetujui", tanggalUpdate: "2026-03-02T11:45:00Z", diupdateOleh: "Dewi Lestari, S.E." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-02T14:20:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "selesai", status: "selesai", tanggalUpdate: "2026-03-02T16:30:00Z", diupdateOleh: "Drs. Hendra Wijaya, M.M." }
    ]
  },
  {
    id: "9",
    kode: "009/PJ-RKA/IT/2026",
    tanggalPengajuan: "02 Mar 2026",
    kegiatan: "Pengadaan Server Storage NAS Backup 64TB",
    divisi: "IT & Infrastructure",
    kelompok: "Belanja Modal (CAPEX)",
    nominalPengajuan: 35000000,
    currentStatus: "ditolak",
    currentStep: "manager",
    jenis: "RKA",
    riwayatStep: [
      {
        step: "manager",
        status: "ditolak",
        tanggalUpdate: "2026-03-02T10:00:00Z",
        catatan: "Nominal pengajuan melebihi sisa plafon RKA Q1. Mohon revisi rincian item atau ajukan di Q2.",
        diupdateOleh: "Ahmad Subagja, M.Kom."
      }
    ]
  },
  {
    id: "10",
    kode: "010/REIMB/GA/2026",
    tanggalPengajuan: "01 Mar 2026",
    kegiatan: "Reimbursement Pembelian Sparepart Genset Operasional",
    divisi: "General Affairs",
    nominalPengajuan: 12500000,
    currentStatus: "ditolak",
    currentStep: "bendahara",
    jenis: "Reimbursement",
    buktiPembayaranUrl: null,
    itemsReimbursement: [
      {
        keterangan: "Pembelian Sparepart Aki & Filter Genset",
        volume: 1,
        biaya: 12500000,
        jumlah: 12500000,
        detailItemLPJ: [
          {
            tanggal: "2026-03-01",
            noKwitansi: "KW-GS-99",
            keterangan: "Aki Genset 120Ah x 2 Unit",
            debit: 0,
            kredit: 8500000,
            buktiUrl: "https://placehold.co/600x400.png",
            buktiNama: "kwitansi-aki-genset.png",
          },
          {
            tanggal: "2026-03-01",
            noKwitansi: "KW-GS-100",
            keterangan: "Filter Oli & Jasa Servis",
            debit: 0,
            kredit: 4000000,
            buktiUrl: "https://placehold.co/600x400.png",
            buktiNama: "kwitansi-filter-oli.png",
          },
        ],
      },
    ],
    rekeningTujuan: {
      namaBank: "Bank BCA",
      nomorRekening: "8820192831",
      namaPemilikRekening: "Andi Pratama, S.T.",
    },
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-01T09:00:00Z", diupdateOleh: "Andi Pratama, S.T." },
      { step: "finance", status: "disetujui", tanggalUpdate: "2026-03-01T11:30:00Z", diupdateOleh: "Dewi Lestari, S.E." },
      {
        step: "bendahara",
        status: "ditolak",
        tanggalUpdate: "2026-03-01T14:30:00Z",
        catatan: "Bukti kwitansi fisik belum dibubuhi stempel resmi toko vendor dan nomor rekening tujuan belum terverifikasi.",
        diupdateOleh: "Dra. Hj. Siti Rahmah"
      }
    ]
  }
];

const MOCK_METRICS_SUMMARY: PengajuanMetricsSummary = {
  totalUsulan: 236500000,
  menungguApprovalCount: 2,
  disetujuiTotal: 78500000,
  sisaPlafonRka: 32000000,
};

export const MOCK_KELOMPOK_RKA: KelompokRKA[] = [
  {
    id: "kel-1",
    namaKelompok: "Operasional",
    DetailItemRKA: [
      {
        kegiatanRka: "Operasional Listrik & Kebersihan",
        detail: [
          { bulan: "Januari", budget: 15000000 },
          { bulan: "Februari", budget: 15000000 },
          { bulan: "Maret", budget: 18000000 },
        ],
      },
      {
        kegiatanRka: "Maintenance Jaringan & Internet",
        detail: [
          { bulan: "Februari", budget: 25000000 },
          { bulan: "Maret", budget: 27500000 },
        ],
      },
      {
        kegiatanRka: "Langganan Cloud Infrastructure AWS & GCP",
        detail: [
          { bulan: "Maret", budget: 40000000 },
        ],
      },
    ],
  },
  {
    id: "kel-2",
    namaKelompok: "Pengadaan & Sarpras",
    DetailItemRKA: [
      {
        kegiatanRka: "Pengadaan Hardware IT & Server",
        detail: [
          { bulan: "Januari", budget: 45000000 },
        ],
      },
      {
        kegiatanRka: "Pengadaan Workstation High-Spec Core i9",
        detail: [
          { bulan: "Februari", budget: 50000000 },
        ],
      },
      {
        kegiatanRka: "Pengadaan Server Storage NAS Backup 64TB",
        detail: [
          { bulan: "Maret", budget: 35000000 },
        ],
      },
    ],
  },
  {
    id: "kel-3",
    namaKelompok: "Pemeliharaan",
    DetailItemRKA: [
      {
        kegiatanRka: "Perawatan & Servis Berkala Perangkat IT",
        detail: [
          { bulan: "Januari", budget: 12000000 },
          { bulan: "Februari", budget: 14000000 },
        ],
      },
      {
        kegiatanRka: "Pemeliharaan AC Central & Ruang Server",
        detail: [
          { bulan: "Februari", budget: 18000000 },
        ],
      },
    ],
  },
  {
    id: "kel-4",
    namaKelompok: "Pengembangan SDM",
    DetailItemRKA: [
      {
        kegiatanRka: "Pelatihan & Workshop Guru",
        detail: [
          { bulan: "Januari", budget: 15000000 },
        ],
      },
      {
        kegiatanRka: "Pelatihan & Sertifikasi AWS Certified Solutions Architect",
        detail: [
          { bulan: "Februari", budget: 18500000 },
        ],
      },
      {
        kegiatanRka: "Pelatihan & Workshop DevOps Engineer",
        detail: [
          { bulan: "Maret", budget: 20000000 },
        ],
      },
    ],
  },
  {
    id: "kel-5",
    namaKelompok: "Kegiatan Siswa/Akademik",
    DetailItemRKA: [
      {
        kegiatanRka: "Bahan Ajar & Modul Pembelajaran",
        detail: [
          { bulan: "Januari", budget: 10000000 },
          { bulan: "Februari", budget: 12000000 },
        ],
      },
      {
        kegiatanRka: "Workshop UI/UX & Design System Modern",
        detail: [
          { bulan: "Februari", budget: 15000000 },
        ],
      },
    ],
  },
  {
    id: "kel-6",
    namaKelompok: "Belanja Modal (CAPEX)",
    DetailItemRKA: [
      {
        kegiatanRka: "Pengadaan Workstation High-Spec Core i9 untuk Dev Team",
        detail: [
          { bulan: "Januari", budget: 50000000 },
        ],
      },
      {
        kegiatanRka: "Pengadaan Server Storage NAS Backup 64TB",
        detail: [
          { bulan: "Februari", budget: 35000000 },
        ],
      },
    ],
  },
  {
    id: "kel-7",
    namaKelompok: "Belanja Operasional (OPEX)",
    DetailItemRKA: [
      {
        kegiatanRka: "Langganan Cloud Infrastructure AWS & GCP Q1 2026",
        detail: [
          { bulan: "Januari", budget: 28000000 },
          { bulan: "Februari", budget: 28000000 },
          { bulan: "Maret", budget: 29000000 },
        ],
      },
    ],
  },
];


export class DivisiPengajuanService implements IPengajuanService {
  async createPengajuan(payload: PengajuanPayload): Promise<{ id: string; kode: string }> {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const mockCreated = {
      id: `id-${Date.now()}`,
      kode: `REQ-2026-${randomNum}`,
    };

    const res = await apiClient<{ id: string; kode: string }>("/pengajuan", {
      method: "POST",
      body: JSON.stringify(payload),
      mockData: mockCreated,
    });

    return res.data;
  }

  async getPengajuanById(id: string): Promise<PengajuanPayload | null> {
    const foundItem = MOCK_PENGAJUAN_LIST.find((item) => item.id === id);

    const mockPayload: PengajuanPayload = foundItem
      ? {
        id: foundItem.id,
        kode: foundItem.kode,
        nomorPengajuan: foundItem.kode,
        divisi: foundItem.divisi,
        judul: foundItem.kegiatan,
        tanggalPengajuan: foundItem.tanggalPengajuan,
        tanggalKebutuhan: foundItem.harapanRealisasi || "2026-03-25",
        tanggalHarapan: foundItem.harapanRealisasi || "2026-03-25",
        urgensi: "normal",
        items:
          foundItem.jenis === "Reimbursement" && "itemsReimbursement" in foundItem && foundItem.itemsReimbursement
            ? foundItem.itemsReimbursement.map((it, idx) => ({
                id: `item-${idx + 1}`,
                namaItem: it.keterangan,
                keterangan: it.keterangan,
                volume: it.volume,
                biaya: it.biaya,
                hargaSatuan: it.biaya,
                subtotal: it.jumlah || it.volume * it.biaya,
                nominalPengajuan: it.jumlah || it.volume * it.biaya,
                detailItemLPJ: it.detailItemLPJ,
              }))
            : [
                {
                  id: "item-1",
                  kegiatanRka: foundItem.kegiatan,
                  kelompok: foundItem.kelompok || "Operasional",
                  bulan: "Maret",
                  budgetRka: Math.round(foundItem.nominalPengajuan * 1.2),
                  nominalPengajuan: foundItem.nominalPengajuan,
                  subtotal: foundItem.nominalPengajuan,
                  namaItem: foundItem.kegiatan,
                  volume: 1,
                  satuan: "Unit",
                  hargaSatuan: foundItem.nominalPengajuan,
                },
              ],
        totalNominal: foundItem.nominalPengajuan,
        namaBank: ("rekeningTujuan" in foundItem ? foundItem.rekeningTujuan?.namaBank : undefined) || "Bank Mandiri",
        noRekening: ("rekeningTujuan" in foundItem ? foundItem.rekeningTujuan?.nomorRekening : undefined) || "1370019283741",
        namaPemilikRekening: ("rekeningTujuan" in foundItem ? foundItem.rekeningTujuan?.namaPemilikRekening : undefined) || "Divisi " + foundItem.divisi,
        namaVendor: "Vendor Solusi Utama",
        catatan: "Kebutuhan operasional divisi.",
        status: foundItem.currentStatus,
        alasan: foundItem.riwayatStep?.find((r) => r.status === "ditolak")?.catatan,
      }
      : {
        id,
        kode: "REQ-2026-001",
        nomorPengajuan: "001/PJ/2026",
        divisi: "IT & Infrastructure",
        judul: "Pengadaan Workstation High-Spec Core i9 untuk Dev Team",
        tanggalKebutuhan: "2026-03-25",
        urgensi: "normal",
        items: [
          {
            id: "item-1",
            namaItem: "Laptop Developer Core i9 32GB RAM",
            volume: 2,
            satuan: "Unit",
            hargaSatuan: 20000000,
            subtotal: 40000000,
          },
        ],
        totalNominal: 45000000,
        namaBank: "Bank Mandiri",
        noRekening: "1370019283741",
        namaPemilikRekening: "PT Tech Solusindo Utama",
        namaVendor: "PT Tech Solusindo Utama",
        catatan: "Kebutuhan mendesak untuk onboarding 2 senior software engineer.",
        status: "menunggu",
      };

    const res = await apiClient<PengajuanPayload>(`/pengajuan/${id}`, {
      mockData: mockPayload,
    });

    return res.data;
  }

  async getDaftarPengajuan(): Promise<PengajuanDanaItem[]> {
    const res = await apiClient<PengajuanDanaItem[]>("/pengajuan/list", {
      mockData: MOCK_PENGAJUAN_LIST,
    });
    return res.data;
  }

  async getDataRKA(): Promise<KelompokRKA[]> {
    const res = await apiClient<KelompokRKA[]>("/rka/kelompok", {
      mockData: MOCK_KELOMPOK_RKA,
    });
    return res.data;
  }

  async getMetricsSummary(): Promise<PengajuanMetricsSummary> {
    const res = await apiClient<PengajuanMetricsSummary>("/pengajuan/metrics", {
      mockData: MOCK_METRICS_SUMMARY,
    });
    return res.data;
  }

  async approvePengajuan(id: string): Promise<boolean> {
    return true;
  }

  async rejectPengajuan(id: string, reason: string): Promise<boolean> {
    return true;
  }
}
