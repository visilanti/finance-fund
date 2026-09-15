import React from "react";
import { UserCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface PengesahanCardProps {
  namaTerang: string;
  tandaTanganUrl?: string;
  digisignId?: string;
}

export function PengesahanCard({
  namaTerang,
  tandaTanganUrl,
}: PengesahanCardProps) {
  return (
    <Card
      variant="secondary"
      title="Pengesahan"
      leftIcon={<UserCheck className="w-3 h-3 text-slate-400" />}
      className="p-3 space-y-1.5 flex flex-col justify-between"
      headerClassName="border-b-0 pb-0"
    >
      {/* Preview Image Tanda Tangan Digital */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg p-1.5 flex flex-col items-center justify-center min-h-[46px]">
        <img
          src={tandaTanganUrl && tandaTanganUrl !== "#" ? tandaTanganUrl : "/images/signature.png"}
          alt="Tanda Tangan Digital"
          className="max-h-9 object-contain dark:invert dark:brightness-200"
        />
        <div className="w-full text-center border-t border-dashed border-slate-200/80 dark:border-slate-800 pt-0.5 mt-0.5 text-[9px] font-mono text-slate-400">
          {namaTerang}
        </div>
      </div>
    </Card>
  );
}
