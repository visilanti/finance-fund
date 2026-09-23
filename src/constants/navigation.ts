import React from "react";
import {
  LayoutDashboard,
  FileText,
  ListFilter,
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
        roles: ["bendahara", "finance"],
      },
      {
        id: "rka-matrix",
        label: "Matriks RKA 12 Bulan",
        icon: FileSpreadsheet,
        path: "/matriks-rka",
        roles: ["divisi", "manager", "bendahara", "finance"],
      },
    ],
  },
  {
    title: "LIST PENCAIRAN",
    items: [
      {
        id: "list-pencairan",
        label: "List Pencairan",
        icon: ListFilter,
        path: "/pencairan",
        roles: ["finance"],
        children: [
          {
            id: "list-rka",
            label: "RKA",
            path: "/pencairan?type=rka",
            roles: ["finance"],
          },
          {
            id: "list-insidental",
            label: "Insidental",
            path: "/pencairan?type=insidental",
            roles: ["finance"],
          },
          {
            id: "list-reimbursement",
            label: "Reimbursement",
            path: "/pencairan?type=reimbursement",
            roles: ["finance"],
          },
        ],
      },
    ],
  },
  {
    title: "PENGAJUAN DANA",
    items: [
      {
        id: "list-pengajuan",
        label: "List Pengajuan",
        icon: ListFilter,
        roles: ["divisi"],
        children: [
          {
            id: "list-rka",
            label: "RKA",
            path: "/pengajuan?type=rka",
            roles: ["divisi"],
          },
          {
            id: "list-insidental",
            label: "Insidental",
            path: "/pengajuan?type=insidental",
            roles: ["divisi"],
          },
          {
            id: "list-reimbursement",
            label: "Reimbursement",
            path: "/pengajuan?type=reimbursement",
            roles: ["divisi"],
          },
        ],
      },
    ],
  },
  {
    title: "LAPORAN & VERIFIKASI",
    items: [
      {
        id: "approval-group",
        label: "List Approval",
        icon: CheckSquare,
        roles: ["manager", "bendahara"],
        children: [
          {
            id: "approval-rka",
            label: "Persetujuan RKA",
            path: "/approval/rka",
            roles: ["manager", "bendahara"],
          },
          {
            id: "approval-insidental",
            label: "Persetujuan Insidental",
            path: "/approval/insidental",
            roles: ["manager", "bendahara"],
          },
          {
            id: "approval-reimbursement",
            label: "Pencairan Finance",
            path: "/pencairan",
            roles: ["manager", "bendahara"],
          },
        ],
      },
      {
        id: "lpj",
        label: "LPJ",
        icon: CreditCard,
        path: "/lpj",
        roles: ["divisi", "finance"],
      },
      {
        id: "laporan",
        label: "Laporan",
        icon: BarChart3,
        path: "/laporan",
        roles: ["divisi", "finance"],
      },
    ],
  },
];
