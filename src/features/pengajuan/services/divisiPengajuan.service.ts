import { apiClient } from "@/lib/api/apiClient";
import { IPengajuanService, COAOption, PengajuanPayload, PengajuanMetricsSummary } from "./pengajuanService.types";
import { PengajuanDanaItem } from "../types";

const MOCK_PENGAJUAN_LIST: PengajuanDanaItem[] = [
  {
    id: "1",
    kode: "REQ-2026-001",
    tanggal: "09 Mar 2026",
    judul: "Pengadaan Workstation High-Spec Core i9 untuk Dev Team",
    divisi: "IT & Infrastructure",
    coa: "5.1.02.01 - Belanja Peralatan IT",
    nominal: 45000000,
    status: "menunggu",
    approverNext: "Manager IT (Budi Santoso)",
    jenis: "RKA"
  },
  {
    id: "2",
    kode: "REQ-2026-002",
    tanggal: "08 Mar 2026",
    judul: "Langganan Cloud Infrastructure AWS & GCP Q1 2026",
    divisi: "Cloud Engineering",
    coa: "5.2.01.04 - Sewa Cloud Services",
    nominal: 78500000,
    status: "disetujui",
    approverNext: "Selesai (Siap Dicairkan)",
    jenis: "RKA"
  },
  {
    id: "3",
    kode: "REQ-2026-003",
    tanggal: "07 Mar 2026",
    judul: "Biaya Workshop Cyber Security Certification Team",
    divisi: "HR & People Ops",
    coa: "5.3.04.02 - Pelatihan & Sertifikasi",
    nominal: 18500000,
    status: "diproses",
    approverNext: "Finance (Pencairan Transfer)",
    jenis: "Reimbursement"
  },
  {
    id: "4",
    kode: "REQ-2026-004",
    tanggal: "05 Mar 2026",
    judul: "Pembelian Server Rack Maintenance & UPS Backup Unit",
    divisi: "IT & Infrastructure",
    coa: "5.1.02.03 - Pemeliharaan Hardware",
    nominal: 32000000,
    status: "ditolak",
    approverNext: "Ditolak (Melebihi Plafon RKA)",
    jenis: "Perjalanan"
  },
  {
    id: "5",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  },
  {
    id: "6",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  },
  {
    id: "7",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "8",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "9",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "10",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "11",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "12",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "13",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "14",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "15",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  }, {
    id: "16",
    kode: "REQ-2026-005",
    tanggal: "04 Mar 2026",
    judul: "Renovasi Ruang Meeting & Soundproofing Lantai 3",
    divisi: "General Affairs",
    coa: "5.4.01.01 - Renovasi Gedung",
    nominal: 62500000,
    status: "menunggu",
    approverNext: "Bendahara Yayasan",
    jenis: "Insidental"
  },
];

const MOCK_METRICS_SUMMARY: PengajuanMetricsSummary = {
  totalUsulan: 236500000,
  menungguApprovalCount: 2,
  disetujuiTotal: 78500000,
  sisaPlafonRka: 32000000,
};

const MOCK_COA_LIST: COAOption[] = [
  {
    code: "5.1.02.01",
    name: "Belanja Peralatan & Perangkat IT",
    category: "Belanja Modal (CAPEX)",
    plafonTahunan: 500000000,
    sisaBulanIni: 65000000,
    monthlyBreakdown: [
      { month: "Jan", budget: 40000000, terpakai: 38000000, sisa: 2000000 },
      { month: "Feb", budget: 40000000, terpakai: 40000000, sisa: 0 },
      { month: "Mar", budget: 70000000, terpakai: 5000000, sisa: 65000000 },
      { month: "Apr", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Mei", budget: 40000000, terpakai: 0, sisa: 40000000 },
      { month: "Jun", budget: 40000000, terpakai: 0, sisa: 40000000 },
      { month: "Jul", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Agu", budget: 40000000, terpakai: 0, sisa: 40000000 },
      { month: "Sep", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Okt", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Nov", budget: 45000000, terpakai: 0, sisa: 45000000 },
      { month: "Des", budget: 50000000, terpakai: 0, sisa: 50000000 },
    ],
  },
  {
    code: "5.2.01.04",
    name: "Sewa Cloud Infrastructure & SaaS",
    category: "Belanja Operasional (OPEX)",
    plafonTahunan: 950000000,
    sisaBulanIni: 120000000,
    monthlyBreakdown: [
      { month: "Jan", budget: 80000000, terpakai: 78000000, sisa: 2000000 },
      { month: "Feb", budget: 80000000, terpakai: 80000000, sisa: 0 },
      { month: "Mar", budget: 120000000, terpakai: 0, sisa: 120000000 },
      { month: "Apr", budget: 80000000, terpakai: 0, sisa: 80000000 },
      { month: "Mei", budget: 80000000, terpakai: 0, sisa: 80000000 },
      { month: "Jun", budget: 80000000, terpakai: 0, sisa: 80000000 },
      { month: "Jul", budget: 80000000, terpakai: 0, sisa: 80000000 },
      { month: "Agu", budget: 80000000, terpakai: 0, sisa: 80000000 },
      { month: "Sep", budget: 90000000, terpakai: 0, sisa: 90000000 },
      { month: "Okt", budget: 80000000, terpakai: 0, sisa: 80000000 },
      { month: "Nov", budget: 80000000, terpakai: 0, sisa: 80000000 },
      { month: "Des", budget: 100000000, terpakai: 0, sisa: 100000000 },
    ],
  },
  {
    code: "5.3.04.02",
    name: "Pelatihan & Sertifikasi Karyawan",
    category: "Pengembangan SDM",
    plafonTahunan: 200000000,
    sisaBulanIni: 25000000,
    monthlyBreakdown: [
      { month: "Jan", budget: 15000000, terpakai: 15000000, sisa: 0 },
      { month: "Feb", budget: 15000000, terpakai: 15000000, sisa: 0 },
      { month: "Mar", budget: 25000000, terpakai: 0, sisa: 25000000 },
      { month: "Apr", budget: 15000000, terpakai: 0, sisa: 15000000 },
      { month: "Mei", budget: 15000000, terpakai: 0, sisa: 15000000 },
      { month: "Jun", budget: 20000000, terpakai: 0, sisa: 20000000 },
      { month: "Jul", budget: 15000000, terpakai: 0, sisa: 15000000 },
      { month: "Agu", budget: 15000000, terpakai: 0, sisa: 15000000 },
      { month: "Sep", budget: 20000000, terpakai: 0, sisa: 20000000 },
      { month: "Okt", budget: 15000000, terpakai: 0, sisa: 15000000 },
      { month: "Nov", budget: 15000000, terpakai: 0, sisa: 15000000 },
      { month: "Des", budget: 15000000, terpakai: 0, sisa: 15000000 },
    ],
  },
];

export class DivisiPengajuanService implements IPengajuanService {
  async getCOAOptions(): Promise<COAOption[]> {
    const res = await apiClient<COAOption[]>("/coa-options", {
      mockData: MOCK_COA_LIST,
    });
    return res.data;
  }

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
    const mockPayload: PengajuanPayload = {
      id,
      kode: "REQ-2026-001",
      divisi: "IT & Infrastructure",
      coaCode: "5.1.02.01",
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
        {
          id: "item-2",
          namaItem: "Monitor 4K 27-Inch Ergonomic",
          volume: 2,
          satuan: "Unit",
          hargaSatuan: 2500000,
          subtotal: 5000000,
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
