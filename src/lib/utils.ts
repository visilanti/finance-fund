import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as IDR (Indonesian Rupiah).
 * Example: 45000000 -> "Rp 45.000.000"
 */
export function formatIDR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate initials from a full name.
 * Example: "Budi Santoso" -> "BS", "Administrator" -> "AD"
 */
export function getInitials(name?: string | null): string {
  if (!name || typeof name !== "string") return "U";
  const trimmed = name.trim();
  if (!trimmed) return "U";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Convert a number into Indonesian Terbilang string.
 * Example: 8600000 -> "Delapan Juta Enam Ratus Ribu Rupiah"
 */
export function numberToTerbilang(n: number | null | undefined): string {
  if (!n || n <= 0 || isNaN(n)) return "";
  const angka = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];

  function terbilang(x: number): string {
    if (x < 12) return angka[x];
    if (x < 20) return terbilang(x - 10) + " Belas";
    if (x < 100) return terbilang(Math.floor(x / 10)) + " Puluh " + terbilang(x % 10);
    if (x < 200) return "Seratus " + terbilang(x % 100);
    if (x < 1000) return terbilang(Math.floor(x / 100)) + " Ratus " + terbilang(x % 100);
    if (x < 2000) return "Seribu " + terbilang(x % 1000);
    if (x < 1000000) return terbilang(Math.floor(x / 1000)) + " Ribu " + terbilang(x % 1000);
    if (x < 1000000000) return terbilang(Math.floor(x / 1000000)) + " Juta " + terbilang(x % 1000000);
    if (x < 1000000000000) return terbilang(Math.floor(x / 1000000000)) + " Miliar " + terbilang(x % 1000000000);
    return terbilang(Math.floor(x / 1000000000000)) + " Triliun " + terbilang(x % 1000000000000);
  }

  return terbilang(Math.round(n)).replace(/\s+/g, " ").trim() + " Rupiah";
}

