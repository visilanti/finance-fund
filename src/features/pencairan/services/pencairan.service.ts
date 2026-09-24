import { apiClient } from "@/lib/api/apiClient";
import { PencairanItem, PencairanPayload } from "../types";

export const MOCK_PENCAIRAN_LIST: PencairanItem[] = [
  {
    id: "pen-1",
    kode: "001/PJ-RKA/IT/2026",
    tanggalPengajuan: "09 Mar 2026",
    harapanRealisasi: "2026-03-25",
    kegiatan: "Pengadaan Workstation High-Spec Core i9 untuk Dev Team",
    divisi: "IT & Infrastructure",
    kelompok: "Belanja Modal (CAPEX)",
    nominalPengajuan: 45000000,
    nominalDiterima: 45000000,
    statusPencairan: "diproses",
    currentStatus: "diproses",
    currentStep: "finance",
    jenis: "RKA",
    buktiTransferUrl: null,
    buktiTransferNama: null,
    tanggalPencairan: null,
    catatanFinance: null,
    rekeningTujuan: {
      namaBank: "Bank Mandiri",
      nomorRekening: "1370019283741",
      namaPemilikRekening: "PT Tech Solusindo Utama",
    },
    itemsRka: [
      {
        kelompok: "Belanja Modal (CAPEX)",
        kegiatanRka: "Pengadaan Workstation High-Spec Core i9",
        bulan: "Maret 2026",
        budget: 50000000,
        nominal: 45000000,
      },
    ],
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-09T09:00:00Z", diupdateOleh: "Ahmad Subagja, M.Kom." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-09T11:30:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "finance", status: "diproses", tanggalUpdate: "2026-03-09T13:00:00Z", diupdateOleh: "Finance Team" },
    ],
  },
  {
    id: "pen-2",
    kode: "002/PJ-RKA/CLOUD/2026",
    tanggalPengajuan: "08 Mar 2026",
    harapanRealisasi: "2026-03-20",
    kegiatan: "Langganan Cloud Infrastructure AWS & GCP Q1 2026",
    divisi: "Cloud Engineering",
    kelompok: "Belanja Operasional (OPEX)",
    nominalPengajuan: 78500000,
    nominalDiterima: 78500000,
    statusPencairan: "selesai",
    currentStatus: "selesai",
    currentStep: "selesai",
    jenis: "RKA",
    buktiTransferUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    buktiTransferNama: "bukti-transfer-aws-maret2026.jpg",
    tanggalPencairan: "08 Mar 2026",
    catatanFinance: "Transfer via Mandiri Corporate Banking No Ref: MCM-9912089",
    rekeningTujuan: {
      namaBank: "Bank BCA",
      nomorRekening: "8820194812",
      namaPemilikRekening: "PT Cloud Hosting Indonesia",
    },
    itemsRka: [
      {
        kelompok: "Belanja Operasional (OPEX)",
        kegiatanRka: "Langganan Cloud Infrastructure AWS & GCP Q1 2026",
        bulan: "Maret 2026",
        budget: 80000000,
        nominal: 78500000,
      },
    ],
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-08T09:00:00Z", diupdateOleh: "Ahmad Subagja, M.Kom." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-08T11:30:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "finance", status: "selesai", tanggalUpdate: "2026-03-08T14:15:00Z", diupdateOleh: "Dewi Lestari, S.E." },
      { step: "selesai", status: "selesai", tanggalUpdate: "2026-03-08T16:00:00Z", diupdateOleh: "Finance Team" },
    ],
  },
  {
    id: "pen-3",
    kode: "003/PJ-RKA/HR/2026",
    tanggalPengajuan: "06 Mar 2026",
    harapanRealisasi: "2026-03-22",
    kegiatan: "Pelatihan & Sertifikasi AWS Certified Solutions Architect",
    divisi: "HR & People Ops",
    kelompok: "Pengembangan SDM",
    nominalPengajuan: 18500000,
    nominalDiterima: 18500000,
    statusPencairan: "diproses",
    currentStatus: "diproses",
    currentStep: "finance",
    jenis: "RKA",
    buktiTransferUrl: null,
    buktiTransferNama: null,
    tanggalPencairan: null,
    catatanFinance: null,
    rekeningTujuan: {
      namaBank: "Bank BNI",
      nomorRekening: "0391829384",
      namaPemilikRekening: "PT Digital Academy Nusantara",
    },
    itemsRka: [
      {
        kelompok: "Pengembangan SDM",
        kegiatanRka: "Pelatihan & Sertifikasi AWS Certified Solutions Architect",
        bulan: "Maret 2026",
        budget: 20000000,
        nominal: 18500000,
      },
    ],
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-06T09:00:00Z", diupdateOleh: "Rina Wulandari, S.Psi." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-06T11:00:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "finance", status: "diproses", tanggalUpdate: "2026-03-06T13:30:00Z", diupdateOleh: "Finance Team" },
    ],
  },
  {
    id: "pen-4",
    kode: "004/PJ-INS/GA/2026",
    tanggalPengajuan: "04 Mar 2026",
    harapanRealisasi: "2026-03-10",
    kegiatan: "Perbaikan Darurat AC Central Ruang Server Utama",
    divisi: "General Affairs",
    nominalPengajuan: 22000000,
    nominalDiterima: 22000000,
    statusPencairan: "diproses",
    currentStatus: "diproses",
    currentStep: "finance",
    jenis: "Insidental",
    buktiTransferUrl: null,
    buktiTransferNama: null,
    tanggalPencairan: null,
    catatanFinance: null,
    rekeningTujuan: {
      namaBank: "Bank Mandiri",
      nomorRekening: "1370098234123",
      namaPemilikRekening: "CV Sejuk Abadi Mandiri",
    },
    itemsInsidental: [
      {
        keterangan: "Penggantian Kompresor AC Central 5PK dan Pengisian Freon R410A",
        volume: 1,
        biaya: 22000000,
        jumlah: 22000000,
      },
    ],
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-04T10:00:00Z", diupdateOleh: "Andi Pratama, S.T." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-04T13:00:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "finance", status: "diproses", tanggalUpdate: "2026-03-04T14:30:00Z", diupdateOleh: "Finance Team" },
    ],
  },
  {
    id: "pen-5",
    kode: "005/REIMB/GA/2026",
    tanggalPengajuan: "02 Mar 2026",
    harapanRealisasi: "2026-03-05",
    kegiatan: "Reimbursement Pembelian Material Kebersihan & Protocol Health",
    divisi: "General Affairs",
    nominalPengajuan: 3250000,
    nominalDiterima: 3250000,
    statusPencairan: "selesai",
    currentStatus: "selesai",
    currentStep: "selesai",
    jenis: "Reimbursement",
    buktiTransferUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
    buktiTransferNama: "transfer-reimb-budi-0203.jpg",
    tanggalPencairan: "02 Mar 2026",
    catatanFinance: "Ditransfer langsung ke rekening GA Officer Budi Santoso",
    rekeningTujuan: {
      namaBank: "Bank Mandiri",
      nomorRekening: "1370019283741",
      namaPemilikRekening: "Budi Santoso (GA Officer)",
    },
    itemsReimbursement: [
      {
        keterangan: "Pembelian Hand Sanitizer & Disinfektan",
        volume: 1,
        biaya: 1750000,
        jumlah: 1750000,
      },
      {
        keterangan: "Perlengkapan Alat Kebersihan Lantai",
        volume: 1,
        biaya: 1500000,
        jumlah: 1500000,
      },
    ],
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-02T09:30:00Z", diupdateOleh: "Andi Pratama, S.T." },
      { step: "finance", status: "disetujui", tanggalUpdate: "2026-03-02T11:45:00Z", diupdateOleh: "Dewi Lestari, S.E." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-02T14:20:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "finance", status: "selesai", tanggalUpdate: "2026-03-02T16:30:00Z", diupdateOleh: "Dewi Lestari, S.E." },
    ],
  },
  {
    id: "pen-6",
    kode: "006/REIMB/MKT/2026",
    tanggalPengajuan: "07 Mar 2026",
    harapanRealisasi: "2026-03-12",
    kegiatan: "Reimbursement Jamuan Client Enterprise - Bank Nusantara",
    divisi: "Marketing & Business",
    nominalPengajuan: 5100000,
    nominalDiterima: 5100000,
    statusPencairan: "diproses",
    currentStatus: "diproses",
    currentStep: "finance",
    jenis: "Reimbursement",
    buktiTransferUrl: null,
    buktiTransferNama: null,
    tanggalPencairan: null,
    catatanFinance: null,
    rekeningTujuan: {
      namaBank: "Bank BCA",
      nomorRekening: "7720918231",
      namaPemilikRekening: "Dina Mariana, S.I.Kom",
    },
    itemsReimbursement: [
      {
        keterangan: "Jamuan Business Lunch & Meeting Persiapan Kerjasama Enterprise",
        volume: 1,
        biaya: 5100000,
        jumlah: 5100000,
      },
    ],
    riwayatStep: [
      { step: "manager", status: "disetujui", tanggalUpdate: "2026-03-07T09:00:00Z", diupdateOleh: "Ahmad Subagja, M.Kom." },
      { step: "bendahara", status: "disetujui", tanggalUpdate: "2026-03-07T11:30:00Z", diupdateOleh: "Dra. Hj. Siti Rahmah" },
      { step: "finance", status: "diproses", tanggalUpdate: "2026-03-07T14:00:00Z", diupdateOleh: "Finance Team" },
    ],
  },
];

export class PencairanService {
  private items: PencairanItem[] = [...MOCK_PENCAIRAN_LIST];

  async getPencairanList(jenis?: string): Promise<PencairanItem[]> {
    const normalizedJenis = jenis?.toUpperCase();
    const filtered = normalizedJenis && normalizedJenis !== "ALL"
      ? this.items.filter((item) => item.jenis.toUpperCase() === normalizedJenis)
      : this.items;

    const res = await apiClient<PencairanItem[]>("/pencairan/list", {
      mockData: filtered,
    });
    return res.data;
  }

  async getPencairanById(id: string): Promise<PencairanItem | null> {
    const item = this.items.find((it) => it.id === id) || null;
    const res = await apiClient<PencairanItem | null>(`/pencairan/${id}`, {
      mockData: item,
    });
    return res.data;
  }

  async submitPencairan(payload: PencairanPayload): Promise<PencairanItem> {
    const index = this.items.findIndex((it) => it.id === payload.id);
    if (index === -1) {
      throw new Error(`Data pencairan dengan id ${payload.id} tidak ditemukan.`);
    }

    const current = this.items[index];
    const updated: PencairanItem = {
      ...current,
      statusPencairan: "selesai",
      currentStatus: "selesai",
      currentStep: "selesai",
      buktiTransferUrl: payload.buktiTransferUrl,
      buktiTransferNama: payload.buktiTransferNama || "bukti-transfer.png",
      tanggalPencairan: payload.tanggalPencairan,
      catatanFinance: payload.catatanFinance || "Pencairan berhasil dilakukan oleh Finance.",
      nominalDiterima: payload.nominalPencairan || current.nominalDiterima || current.nominalPengajuan,
      riwayatStep: [
        ...(current.riwayatStep || []),
        {
          step: "finance",
          status: "selesai",
          tanggalUpdate: new Date().toISOString(),
          diupdateOleh: "Finance Officer",
          catatan: payload.catatanFinance || "Bukti transfer telah diverifikasi dan diunggah.",
        },
      ],
    };

    this.items[index] = updated;

    const res = await apiClient<PencairanItem>(`/pencairan/${payload.id}/upload-bukti`, {
      method: "POST",
      body: JSON.stringify(payload),
      mockData: updated,
    });

    return res.data;
  }
}

export const pencairanService = new PencairanService();
