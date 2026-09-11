import React from "react";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  CreditCard,
  FileSpreadsheet,
  PieChart,
  BarChart3,
} from "lucide-react";

export type RoleType = "divisi" | "manager" | "bendahara" | "finance";

export interface NavChildItem {
  id: string;
  label: string;
  path: string;
  badge?: string | number;
  badgeColor?: string;
  roles: RoleType[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  badge?: string | number;
  badgeColor?: string;
  roles: RoleType[];
  children?: NavChildItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "MAIN",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
        roles: ["divisi", "manager", "bendahara", "finance"],
      },
      {
        id: "rka-matrix",
        label: "Matriks RKA 12 Bulan",
        icon: FileSpreadsheet,
        path: "/rka",
        roles: ["divisi", "manager", "bendahara", "finance"],
      },
    ],
  },
  {
    title: "PENGAJUAN DANA",
    items: [
      {
        id: "form-pengajuan",
        label: "Form Pengajuan",
        icon: FileText,
        roles: ["divisi", "manager", "bendahara", "finance"],
        children: [
          {
            id: "pengajuan-rka",
            label: "RKA",
            path: "/pengajuan/create?type=rka",
            roles: ["divisi"],
          },
          {
            id: "pengajuan-insidental",
            label: "Insidental",
            path: "/pengajuan/create?type=insidental",
            roles: ["divisi"],
          },
          {
            id: "pengajuan-reimbursement",
            label: "Reimbursement",
            path: "/pengajuan/create?type=reimbursement",
            roles: ["divisi"],
          },
          {
            id: "pengajuan-dinas",
            label: "Perjalanan Dinas",
            path: "/pengajuan/create?type=jaldis",
            roles: ["divisi"],
          },
        ],
      },
      {
        id: "lpj",
        label: "LPJ",
        icon: CreditCard,
        path: "/lpj",
        roles: ["divisi", "manager", "bendahara", "finance"],
      },
    ],
  },
  {
    title: "LAPORAN & VERIFIKASI",
    items: [
      {
        id: "laporan",
        label: "Laporan",
        icon: BarChart3,
        path: "/laporan",
        roles: ["divisi", "manager", "bendahara", "finance"],
      },
      {
        id: "approval-group",
        label: "Persetujuan Approval",
        icon: CheckSquare,
        roles: ["manager", "bendahara", "finance"],
        children: [
          {
            id: "approval-manager",
            label: "Persetujuan Manager",
            path: "/approval/manager",
            badge: 3,
            badgeColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300",
            roles: ["manager"],
          },
          {
            id: "approval-bendahara",
            label: "Persetujuan Bendahara",
            path: "/approval/bendahara",
            badge: 2,
            badgeColor: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300",
            roles: ["bendahara"],
          },
          {
            id: "pencairan-finance",
            label: "Pencairan Finance",
            path: "/pencairan",
            badge: 5,
            badgeColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300",
            roles: ["finance"],
          },
        ],
      },
      {
        id: "coa",
        label: "Mata Anggaran (COA)",
        icon: PieChart,
        path: "/master/coa",
        roles: ["finance", "bendahara"],
      },
    ],
  },
];
