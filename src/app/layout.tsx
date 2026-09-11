import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Pengajuan Finance - Enterprise SaaS Fund Flow",
  description: "Sistem Manajemen Pengajuan Dana, RKA, dan LPJ Keuangan Enterprise B2B SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-background text-slate-800 dark:text-slate-100 antialiased font-sans transition-colors duration-150">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
