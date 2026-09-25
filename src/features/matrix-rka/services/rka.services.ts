import {
  RKADocument,
  RKANode,
  MatrixMonthCell,
  RKAStatusPencairan,
  MatrixMetricsSummary,
  MatrixTableRow,
} from "../types";

export const MOCK_RKA: RKADocument[] = [
  {
    id: "2a160650-db7e-41d9-8e02-902ba9dc743a",
    name: "RKA_SMA-BDG",
    tahun: 2026,
    unit: "Divisi IT & Operasional Sekolah",
    statistic: {
      totalAnggaran: 96860000, 
      totalDicairkan: 54800000, 
      totalBelumCair: 10780000, 
      totalHangus: 31280000
    },
    list_item: [
      {
        id: "grp-1",
        name: "Kegiatan Kurikulum",
        category: "kelompok_group",
        children: [
          {
            id: "kel-1",
            name: "Kegiatan Pembelajaran dan Praktikum",
            category: "kelompok",
            children: [
              {
                id: "keg-1",
                name: "Pembinaan Klub",
                category: "kegiatan",
                isHasBudget: false,
                children: [
                  {
                    id: "sub-1",
                    name: "Klub 1 Archery",
                    category: "sub_kegiatan",
                    isHasBudget: true,
                    metadata: {
                      jurnal_code: "JRN-5011",
                      jurnal_name: "Beban Ekstrakurikuler",
                      cource_fund: "Dana BOS"
                    },
                    list_budget: [
                      { bulan: "Januari", budget: 1000000, realisasi: 1000000, status: "dicairkan", catatan: "Target bantalan busa" },
                      { bulan: "Februari", budget: 4780000, realisasi: 0, status: "hangus", catatan: "Sewa pelatih dibatalkan/waktu lewat" }
                    ]
                  },
                  {
                    id: "sub-2",
                    name: "Klub 2 Voli",
                    category: "sub_kegiatan",
                    isHasBudget: true,
                    metadata: {
                      jurnal_code: "JRN-5011",
                      jurnal_name: "Beban Ekstrakurikuler",
                      cource_fund: "Dana BOS"
                    },
                    list_budget: [
                      { bulan: "Februari", budget: 1300000, realisasi: 1300000, status: "dicairkan", catatan: "Bola voli Mikasa" },
                      { bulan: "September", budget: 6780000, realisasi: 0, status: "belum_cair", catatan: "Persiapan turnamen antar sekolah" }
                    ]
                  }
                ]
              },
              {
                id: "keg-2",
                name: "Workshop Kurikulum Merdeka (Kegiatan Langsung)",
                category: "kegiatan",
                isHasBudget: true,
                metadata: {
                  jurnal_code: "JRN-5021",
                  jurnal_name: "Beban Pelatihan Guru",
                  cource_fund: "Dana Yayasan"
                },
                list_budget: [
                  { bulan: "Januari", budget: 5000000, realisasi: 0, status: "hangus", catatan: "Dibatalkan karena jadwal bentrok" },
                  { bulan: "Maret", budget: 7500000, realisasi: 7500000, status: "dicairkan", catatan: "Honor narasumber" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "grp-2",
        name: "Kegiatan Humas",
        category: "kelompok_group",
        children: [
          {
            id: "kel-2",
            name: "Pertemuan Orang Tua dan Rapor",
            category: "kelompok",
            children: [
              {
                id: "keg-3",
                name: "Konsumsi Pertemuan Orang Tua",
                category: "kegiatan",
                isHasBudget: true,
                metadata: {
                  jurnal_code: "JRN-5103",
                  jurnal_name: "Beban Rapat dan Konsumsi",
                  cource_fund: "Dana Komite"
                },
                list_budget: [
                  { bulan: "Januari", budget: 2500000, realisasi: 2500000, status: "dicairkan", catatan: "Snack & makan siang rapat" },
                  { bulan: "Juni", budget: 3000000, realisasi: 0, status: "hangus", catatan: "Sisa dana rapat kelulusan tidak terserap" }
                ]
              }
            ]
          },
          {
            id: "kel-3",
            name: "KEHUMASAN",
            category: "kelompok",
            children: [
              {
                id: "keg-4",
                name: "Publikasi Media & Brosur PPDB",
                category: "kegiatan",
                isHasBudget: true,
                metadata: {
                  jurnal_code: "JRN-5201",
                  jurnal_name: "Beban Promosi dan Publikasi",
                  cource_fund: "Dana Yayasan"
                },
                list_budget: [
                  { bulan: "Februari", budget: 4000000, realisasi: 4000000, status: "dicairkan", catatan: "Cetak brosur & spanduk PPDB" },
                  { bulan: "Maret", budget: 2000000, realisasi: 0, status: "hangus", catatan: "Vendor iklan tidak tersedia, dana hangus" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "grp-3",
        name: "Sarana Prasarana & Operasional IT",
        category: "kelompok_group",
        children: [
          {
            id: "kel-4",
            name: "Pemeliharaan & Internet",
            category: "kelompok",
            children: [
              {
                id: "keg-5",
                name: "Langganan Internet & Lisensi Software",
                category: "kegiatan",
                isHasBudget: true,
                metadata: {
                  jurnal_code: "JRN-5301",
                  jurnal_name: "Beban Komunikasi dan Internet",
                  cource_fund: "Dana BOS"
                },
                list_budget: [
                  { bulan: "Januari", budget: 3500000, realisasi: 3500000, status: "dicairkan", catatan: "Dedicated 100Mbps" },
                  { bulan: "Februari", budget: 3500000, realisasi: 3500000, status: "dicairkan", catatan: null },
                  { bulan: "Maret", budget: 3500000, realisasi: 3500000, status: "dicairkan", catatan: null },
                  { bulan: "April", budget: 3500000, realisasi: 0, status: "hangus", catatan: "Subsidi internet gagal ditagihkan tepat waktu" }
                ]
              },
              {
                id: "keg-6",
                name: "ATK & Perlengkapan Kantor",
                category: "kegiatan",
                isHasBudget: true,
                metadata: {
                  jurnal_code: "JRN-5302",
                  jurnal_name: "Beban Alat Tulis Kantor",
                  cource_fund: "Dana BOS"
                },
                list_budget: [
                  { bulan: "Januari", budget: 2000000, realisasi: 2000000, status: "dicairkan", catatan: "Kertas & tinta printer" },
                  { bulan: "Februari", budget: 1500000, realisasi: 1500000, status: "dicairkan", catatan: null },
                  { bulan: "Maret", budget: 1500000, realisasi: 1500000, status: "dicairkan", catatan: null },
                  { bulan: "April", budget: 2000000, realisasi: 0, status: "hangus", catatan: "Pembelian ATK dialihkan ke bulan lain" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "grp-4",
        name: "Kegiatan Kesiswaan",
        category: "kelompok_group",
        children: [
          {
            id: "kel-5",
            name: "Pengembangan Karakter Siswa",
            category: "kelompok",
            children: [
              {
                id: "keg-7",
                name: "Latihan Dasar Kepemimpinan (LDKS)",
                category: "kegiatan",
                isHasBudget: true,
                metadata: {
                  jurnal_code: "JRN-5401",
                  jurnal_name: "Beban Kesiswaan",
                  cource_fund: "Dana Komite"
                },
                list_budget: [
                  { bulan: "Juli", budget: 10000000, realisasi: 10000000, status: "dicairkan", catatan: "Sewa tempat dan logistik panitia" },
                  { bulan: "Agustus", budget: 2000000, realisasi: 0, status: "hangus", catatan: "Kelebihan dana tidak terserap" },
                  { bulan: "September", budget: 5000000, realisasi: 5000000, status: "dicairkan", catatan: "Cetak sertifikat dan dokumentasi akhir" },
                  { bulan: "Oktober", budget: 5000000, realisasi: 0, status: "belum_cair", catatan: "Rencana reward untuk kelompok terbaik (Waktu telah lewat)" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "grp-5",
        name: "Pengembangan SDM",
        category: "kelompok_group",
        children: [
          {
            id: "kel-6",
            name: "Sertifikasi dan Pelatihan Eksternal",
            category: "kelompok",
            children: [
              {
                id: "keg-8",
                name: "Sertifikasi IT Guru dan Staf",
                category: "kegiatan",
                isHasBudget: true,
                metadata: {
                  jurnal_code: "JRN-5502",
                  jurnal_name: "Beban Peningkatan Mutu SDM",
                  cource_fund: "Dana Yayasan"
                },
                list_budget: [
                  { bulan: "Mei", budget: 8000000, realisasi: 8000000, status: "dicairkan", catatan: "Pendaftaran sertifikasi Microsoft" },
                  { bulan: "September", budget: 4000000, realisasi: 0, status: "belum_cair", catatan: "Pendaftaran batch 2" },
                  { bulan: "November", budget: 4000000, realisasi: 0, status: "belum_cair", catatan: "Pendaftaran batch 3 (Waktu telah lewat)" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// HELPER CONSTANTS & CALCULATION FUNCTIONS (SoC SERVICE LAYER)
// ---------------------------------------------------------------------------

export const STANDARD_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export const SHORT_MONTH_MAP: Record<string, string> = {
  Januari: "Jan",
  Februari: "Feb",
  Maret: "Mar",
  April: "Apr",
  Mei: "Mei",
  Juni: "Jun",
  Juli: "Jul",
  Agustus: "Agt",
  September: "Sep",
  Oktober: "Okt",
  November: "Nov",
  Desember: "Des",
};

/**
 * Format angka nominal sesuai tampilan tabel keuangan (e.g. 45.000.000).
 */
export function formatMatrixNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount) || amount === 0) {
    return "0";
  }
  return amount.toLocaleString("id-ID");
}

/**
 * Hitung nilai alokasi, realisasi, dan status untuk suatu node pada bulan tertentu secara rekursif.
 */
export function calculateNodeMonthValues(
  node: RKANode,
  month: string
): MatrixMonthCell {
  // Jika leaf node (memegang budget langsung)
  if (node.isHasBudget && node.list_budget) {
    const item = node.list_budget.find(
      (b) => b.bulan.trim().toLowerCase() === month.trim().toLowerCase()
    );
    if (!item) {
      return { budget: 0, realisasi: 0, status: undefined, catatan: null };
    }
    return {
      budget: item.budget || 0,
      realisasi: item.realisasi || 0,
      status: item.status,
      catatan: item.catatan || null,
    };
  }

  // Jika parent container, lakukan rollup rekursif dari seluruh children
  if (node.children && node.children.length > 0) {
    let sumBudget = 0;
    let sumRealisasi = 0;
    const statuses: (RKAStatusPencairan | undefined)[] = [];

    for (const child of node.children) {
      const childVal = calculateNodeMonthValues(child, month);
      sumBudget += childVal.budget;
      sumRealisasi += childVal.realisasi || 0;
      if (childVal.status) {
        statuses.push(childVal.status);
      }
    }

    let overallStatus: RKAStatusPencairan | undefined = undefined;
    if (sumBudget > 0) {
      if (statuses.every((s) => s === "dicairkan")) {
        overallStatus = "dicairkan";
      } else if (statuses.some((s) => s === "belum_cair")) {
        overallStatus = "belum_cair";
      } else if (statuses.every((s) => s === "hangus")) {
        overallStatus = "hangus";
      } else {
        overallStatus = "belum_cair";
      }
    }

    return {
      budget: sumBudget,
      realisasi: sumRealisasi,
      status: overallStatus,
      catatan: null,
    };
  }

  return { budget: 0, realisasi: 0, status: undefined, catatan: null };
}

/**
 * Hitung total tahunan dari sebuah node.
 */
export function calculateNodeYearTotal(node: RKANode): number {
  if (node.isHasBudget && node.list_budget) {
    return node.list_budget.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  }
  if (node.children && node.children.length > 0) {
    return node.children.reduce((acc, child) => acc + calculateNodeYearTotal(child), 0);
  }
  return 0;
}

/**
 * Ambil metrik ringkasan global dari dokumen RKA (ditentukan backend/statistic).
 */
export function calculateMatrixMetrics(doc: RKADocument): MatrixMetricsSummary {
  return (
    doc.statistic || {
      totalAnggaran: 0,
      totalDicairkan: 0,
      totalBelumCair: 0,
      totalHangus: 0,
    }
  );
}

/**
 * Build flattened rows untuk tampilan tabel matriks lengkap dengan baris Subtotal per Group.
 */
export function buildMatrixTableRows(
  doc: RKADocument,
  expandedIds: Set<string>,
  searchQuery: string = "",
  months: readonly string[] = STANDARD_MONTHS
): MatrixTableRow[] {
  const rows: MatrixTableRow[] = [];
  const query = searchQuery.trim().toLowerCase();

  // Helper untuk mengecek apakah node atau anaknya match dengan search query
  function matchesSearch(node: RKANode): boolean {
    if (!query) return true;
    if (node.name.toLowerCase().includes(query)) return true;
    if (node.children) {
      return node.children.some(matchesSearch);
    }
    return false;
  }

  let groupCounter = 0;

  for (const group of doc.list_item) {
    if (!matchesSearch(group)) continue;
    groupCounter++;

    // Hitung alokasi bulan untuk group
    const groupMonths: Record<string, MatrixMonthCell> = {};
    for (const m of months) {
      groupMonths[m] = calculateNodeMonthValues(group, m);
    }
    const groupTotalYear = calculateNodeYearTotal(group);
    const isGroupExpanded = expandedIds.has(group.id);

    // Baris Header Group (A. PENDAPATAN / KEGIATAN KURIKULUM, dll)
    rows.push({
      id: group.id,
      originalNodeId: group.id,
      no: String.fromCharCode(64 + groupCounter), // A, B, C, dst
      name: group.name,
      category: group.category,
      rowType: "group",
      level: 0,
      isHasBudget: false,
      hasChildren: Boolean(group.children && group.children.length > 0),
      isExpanded: isGroupExpanded,
      groupId: group.id,
      months: groupMonths,
      totalYear: groupTotalYear,
    });

    // Jika group dibuka, tampilkan anak-anaknya
    if (isGroupExpanded && group.children) {
      let kelompokCounter = 0;
      for (const kel of group.children) {
        if (!matchesSearch(kel)) continue;
        kelompokCounter++;

        const kelMonths: Record<string, MatrixMonthCell> = {};
        for (const m of months) {
          kelMonths[m] = calculateNodeMonthValues(kel, m);
        }
        const kelTotalYear = calculateNodeYearTotal(kel);
        const isKelExpanded = expandedIds.has(kel.id);

        rows.push({
          id: kel.id,
          originalNodeId: kel.id,
          no: kelompokCounter,
          name: kel.name,
          category: kel.category,
          rowType: "kelompok",
          level: 1,
          isHasBudget: kel.isHasBudget,
          hasChildren: Boolean(kel.children && kel.children.length > 0),
          isExpanded: isKelExpanded,
          parentId: group.id,
          groupId: group.id,
          months: kelMonths,
          totalYear: kelTotalYear,
          metadata: kel.metadata,
        });

        // Kegiatan
        if (isKelExpanded && kel.children) {
          let kegCounter = 0;
          for (const keg of kel.children) {
            if (!matchesSearch(keg)) continue;
            kegCounter++;

            const kegMonths: Record<string, MatrixMonthCell> = {};
            for (const m of months) {
              kegMonths[m] = calculateNodeMonthValues(keg, m);
            }
            const kegTotalYear = calculateNodeYearTotal(keg);
            const isKegExpanded = expandedIds.has(keg.id);

            rows.push({
              id: keg.id,
              originalNodeId: keg.id,
              no: kegCounter,
              name: keg.name,
              category: keg.category,
              rowType: "kegiatan",
              level: 2,
              isHasBudget: keg.isHasBudget,
              hasChildren: Boolean(keg.children && keg.children.length > 0),
              isExpanded: isKegExpanded,
              parentId: kel.id,
              groupId: group.id,
              months: kegMonths,
              totalYear: kegTotalYear,
              metadata: keg.metadata,
            });

            // Sub-kegiatan (jika ada)
            if (isKegExpanded && keg.children) {
              let subCounter = 0;
              for (const sub of keg.children) {
                if (!matchesSearch(sub)) continue;
                subCounter++;

                const subMonths: Record<string, MatrixMonthCell> = {};
                for (const m of months) {
                  subMonths[m] = calculateNodeMonthValues(sub, m);
                }
                const subTotalYear = calculateNodeYearTotal(sub);

                rows.push({
                  id: sub.id,
                  originalNodeId: sub.id,
                  no: `${kegCounter}.${subCounter}`,
                  name: sub.name,
                  category: sub.category,
                  rowType: "sub_kegiatan",
                  level: 3,
                  isHasBudget: true,
                  hasChildren: false,
                  isExpanded: false,
                  parentId: keg.id,
                  groupId: group.id,
                  months: subMonths,
                  totalYear: subTotalYear,
                  metadata: sub.metadata,
                });
              }
            }
          }
        }
      }
    }

    // Baris Subtotal per Group (kuning/amber background)
    rows.push({
      id: `subtotal-${group.id}`,
      name: `Subtotal ${group.name}`,
      category: "kelompok_group",
      rowType: "subtotal",
      level: 0,
      isHasBudget: false,
      hasChildren: false,
      groupId: group.id,
      months: groupMonths,
      totalYear: groupTotalYear,
    });
  }

  return rows;
}
