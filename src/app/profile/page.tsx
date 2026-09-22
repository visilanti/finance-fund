import React from "react";
import { MainLayoutShell } from "@/components/layout/MainLayoutShell";
import { ProfilePageContent } from "@/features/profile/components";

export const metadata = {
  title: "Profil & Pengaturan Akun | Finance Fund",
  description:
    "Kelola data identitas diri, master rekening bank tujuan pencairan, dan spesimen tanda tangan digital resmi.",
};

export default function ProfilePage() {
  return (
    <MainLayoutShell
      pageTitle="Profil & Pengaturan Akun"
      initialRole="divisi"
      activePath="/profile"
    >
      <ProfilePageContent />
    </MainLayoutShell>
  );
}