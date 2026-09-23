export type RKAStatusPencairan = "dicairkan" | "belum_cair" | "hangus";

export interface ItemBudgetBulan {
  bulan: string;
  budget: number;
  realisasi?: number;
  status?: RKAStatusPencairan;
  catatan?: string | null;
}

export type RKACategory =
  | "kelompok_group"
  | "kelompok"
  | "kegiatan"
  | "sub_kegiatan";

export interface RKANode {
  id: string;
  name: string;
  category: RKACategory;
  isHasBudget?: boolean;
  children?: RKANode[];
  list_budget?: ItemBudgetBulan[];
  metadata?: metadata;
}

export interface metadata {
  jurnal_code: string;
  jurnal_name: string;
  cource_fund: string;
}

export interface RKADocument {
  id: string;
  name: string;
  tahun: number;
  unit?: string;
  statistic: MatrixMetricsSummary;
  list_item: RKANode[];
}

export type MatrixRowType = "group" | "kelompok" | "kegiatan" | "sub_kegiatan" | "subtotal";

export interface MatrixMonthCell {
  budget: number;
  realisasi?: number;
  status?: RKAStatusPencairan;
  catatan?: string | null;
}

export interface MatrixTableRow {
  id: string;
  originalNodeId?: string;
  no?: string | number;
  name: string;
  category: RKACategory;
  rowType: MatrixRowType;
  level: number; // 0: group, 1: kelompok, 2: kegiatan, 3: sub_kegiatan, 4: subtotal
  isHasBudget?: boolean;
  hasChildren: boolean;
  isExpanded?: boolean;
  parentId?: string;
  groupId?: string;
  months: Record<string, MatrixMonthCell>; // Key: nama bulan (Januari, Februari, dll)
  totalYear: number;
  metadata?: metadata;
}

export interface MatrixMetricsSummary {
  totalAnggaran: number;
  totalDicairkan: number;
  totalBelumCair: number;
  totalHangus: number;
}

