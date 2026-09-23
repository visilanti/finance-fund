import { PengajuanDanaItem, StepType } from "@/features/pengajuan/types";
import { PengajuanServiceFactory } from "@/features/pengajuan/services/pengajuanService.factory";
import { ApprovalActionPayload } from "../types";

class ApprovalService {
  private localCache: PengajuanDanaItem[] | null = null;

  async getDaftarApproval(jenis?: string): Promise<PengajuanDanaItem[]> {
    if (!this.localCache) {
      const pengajuanService = PengajuanServiceFactory.getService("divisi");
      this.localCache = await pengajuanService.getDaftarPengajuan();
    }

    if (!jenis || jenis.toLowerCase() === "all") {
      return this.localCache;
    }

    return this.localCache.filter(
      (item) => item.jenis.toLowerCase() === jenis.toLowerCase()
    );
  }

  async submitApprovalAction(payload: ApprovalActionPayload): Promise<boolean> {
    if (!this.localCache) return false;

    this.localCache = this.localCache.map((item) => {
      if (item.id === payload.id) {
        const updatedStatus = payload.status === "disetujui" ? "disetujui" : "ditolak";
        const nextStep: StepType = payload.status === "disetujui" ? "selesai" : item.currentStep;

        return {
          ...item,
          currentStatus: updatedStatus,
          riwayatStep: [
            ...(item.riwayatStep || []),
            {
              step: "manager",
              status: updatedStatus,
              tanggalUpdate: new Date().toISOString(),
              diupdateOleh: "Manager / Verifikator",
              catatan: payload.catatan,
            },
          ],
        };
      }
      return item;
    });

    return true;
  }
}

export const approvalService = new ApprovalService();
