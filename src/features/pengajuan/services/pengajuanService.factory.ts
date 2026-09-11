import { RoleType } from "@/components/layout/Sidebar";
import { IPengajuanService } from "./pengajuanService.types";
import { DivisiPengajuanService } from "./divisiPengajuan.service";

export class PengajuanServiceFactory {
  private static instances: Partial<Record<RoleType, IPengajuanService>> = {};

  public static getService(role: RoleType): IPengajuanService {
    if (!this.instances[role]) {
      let serviceInstance: IPengajuanService;
      switch (role) {
        case "divisi":
          serviceInstance = new DivisiPengajuanService();
          break;
        case "manager":
        case "bendahara":
        case "finance":
          serviceInstance = new DivisiPengajuanService();
          break;
        default:
          serviceInstance = new DivisiPengajuanService();
      }
      this.instances[role] = serviceInstance;
    }
    return this.instances[role]!;
  }
}
