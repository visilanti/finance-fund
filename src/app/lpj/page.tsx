import { MainLayoutShell } from "@/components/layout/MainLayoutShell";

export default function Page() {
  return (
    <MainLayoutShell pageTitle="LPJ Pengajuan Dana" initialRole="divisi" activePath="/lpj">
      <h1 className="text-white">LPJ</h1>
    </MainLayoutShell>
  )
}