import { Profile, ProfileRekening } from "../types";

const PROFILE_STORAGE_KEY = "finance_fund_user_profile";

export const INITIAL_PROFILE: Profile = {
  fullName: "Ahmad Hidayat",
  email: "ahmad.hidayat@perusahaan.co.id",
  unit: "General Affairs & Operasional",
  roles: ["ICT"],
  nip: "19880512 201503 1 002",
  telepon: "0812-3456-7890",
  rekeningAktif: {
    id: "rek-1",
    bank: "Bank Mandiri",
    noRekening: "1370019283741",
    name: "Ahmad Hidayat",
    isDefault: true,
  },
  daftarRekening: [
    {
      id: "rek-1",
      bank: "Bank Mandiri",
      noRekening: "1370019283741",
      name: "Ahmad Hidayat",
      isDefault: true,
    },
    {
      id: "rek-2",
      bank: "BCA",
      noRekening: "8021948210",
      name: "Ahmad Hidayat",
      isDefault: false,
    },
    {
      id: "rek-3",
      bank: "BRI",
      noRekening: "034101000213501",
      name: "Ahmad Hidayat",
      isDefault: false,
    },
  ],
  ttdUrl: "/images/signature.png",
};

export class ProfileService {
  public static getProfile(): Profile {
    if (typeof window === "undefined") {
      return INITIAL_PROFILE;
    }

    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback on storage errors
    }

    return INITIAL_PROFILE;
  }

  public static saveProfile(updated: Partial<Profile>): Profile {
    const current = this.getProfile();
    const merged: Profile = {
      ...current,
      ...updated,
      rekeningAktif: updated.rekeningAktif || current.rekeningAktif,
      daftarRekening: updated.daftarRekening || current.daftarRekening,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new Event("profile-updated"));
      } catch {
        // Fallback on storage errors
      }
    }

    return merged;
  }

  public static updateSignature(ttdUrl: string): Profile {
    return this.saveProfile({ ttdUrl });
  }

  public static addRekening(newRek: Omit<ProfileRekening, "id">): Profile {
    const current = this.getProfile();
    const id = `rek-${Date.now()}`;
    const rekItem: ProfileRekening = { ...newRek, id };

    const daftarRekening = [...(current.daftarRekening || []), rekItem];
    let rekeningAktif = current.rekeningAktif;

    if (newRek.isDefault || !rekeningAktif || !rekeningAktif.noRekening) {
      daftarRekening.forEach((r) => {
        r.isDefault = r.id === id;
      });
      rekeningAktif = rekItem;
    }

    return this.saveProfile({ daftarRekening, rekeningAktif });
  }

  public static deleteRekening(rekId: string): Profile {
    const current = this.getProfile();
    const daftarRekening = (current.daftarRekening || []).filter(
      (r) => r.id !== rekId
    );

    let rekeningAktif = current.rekeningAktif;
    if (rekeningAktif?.id === rekId) {
      const nextDefault = daftarRekening[0] || {
        id: "",
        bank: "",
        noRekening: "",
        name: "",
        isDefault: true,
      };
      if (daftarRekening[0]) {
        daftarRekening[0].isDefault = true;
      }
      rekeningAktif = nextDefault;
    }

    return this.saveProfile({ daftarRekening, rekeningAktif });
  }

  public static setDefaultRekening(rekId: string): Profile {
    const current = this.getProfile();
    const daftarRekening = (current.daftarRekening || []).map((r) => ({
      ...r,
      isDefault: r.id === rekId,
    }));

    const target = daftarRekening.find((r) => r.id === rekId);
    return this.saveProfile({
      daftarRekening,
      rekeningAktif: target || current.rekeningAktif,
    });
  }

  public static resetProfile(): Profile {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        window.dispatchEvent(new Event("profile-updated"));
      } catch {
        // Fallback on storage errors
      }
    }
    return INITIAL_PROFILE;
  }

  public static getCurrentUser(): {
    fullName: string;
    email: string;
    unit: string;
    tandaTanganUrl: string;
  } {
    const prof = this.getProfile();
    return {
      fullName: prof.fullName,
      email: prof.email,
      unit: prof.unit,
      tandaTanganUrl: prof.ttdUrl || "/images/signature.png",
    };
  }
}