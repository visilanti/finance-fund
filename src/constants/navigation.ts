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
        id: "list-pengajuan",
        label: "List Pengajuan",
        icon: ListFilter,
        roles: ["divisi", "finance"],
        children: [
          {
            id: "list-rka",
            label: "RKA",
            path: "/pengajuan?type=rka",
            roles: ["divisi", "finance"],
          },
          {
            id: "list-insidental",
            label: "Insidental",
            path: "/pengajuan?type=insidental",
            roles: ["divisi", "finance"],
          },
          {
            id: "list-reimbursement",
            label: "Reimbursement",
            path: "/pengajuan?type=reimbursement",
            roles: ["divisi", "finance"],
          },
          {
            id: "list-dinas",
            label: "Perjalanan Dinas",
            path: "/pengajuan?type=jaldis",
            roles: ["divisi", "finance"],
          },
        ],
      },
      // {
      //   id: "form-pengajuan",
      //   label: "Form Pengajuan",
      //   icon: FileText,
      //   roles: ["divisi", "finance"],
      //   children: [
      //     {
      //       id: "pengajuan-rka",
      //       label: "RKA",
      //       path: "/pengajuan/create?type=rka",
      //       roles: ["divisi", "finance"],
      //     },
      //     {
      //       id: "pengajuan-insidental",
      //       label: "Insidental",
      //       path: "/pengajuan/create?type=insidental",
      //       roles: ["divisi", "finance"],
      //     },
      //     {
      //       id: "pengajuan-reimbursement",
      //       label: "Reimbursement",
      //       path: "/pengajuan/create?type=reimbursement",
      //       roles: ["divisi", "finance"],
      //     },
      //     {
      //       id: "pengajuan-dinas",
      //       label: "Perjalanan Dinas",
      //       path: "/pengajuan/create?type=jaldis",
      //       roles: ["divisi", "finance"],
      //     },
      //   ],
      // },
    ],
  },
  {
    title: "LAPORAN & VERIFIKASI",
    items: [
      {
        id: "approval-group",
        label: "List Approval",
        icon: CheckSquare,
        roles: ["manager", "bendahara", "finance"],
        children: [
          {
            id: "approval-rka",
            label: "Persetujuan RKA",
            path: "/approval/rka",
            badge: 3,
            badgeColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300",
            roles: ["manager", "bendahara", "finance"],
          },
          {
            id: "approval-insidental",
            label: "Persetujuan Insidental",
            path: "/approval/insidental",
            badge: 2,
            badgeColor: "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300",
            roles: ["manager", "bendahara", "finance"],
          },
          {
            id: "approval-reimbursement",
            label: "Pencairan Finance",
            path: "/pencairan",
            badge: 5,
            badgeColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300",
            roles: ["manager", "bendahara", "finance"],
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
      {
        id: "laporan",
        label: "Laporan",
        icon: BarChart3,
        path: "/laporan",
        roles: ["divisi", "manager", "bendahara", "finance"],
      },
    ],
  },
];
