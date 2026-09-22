import { create } from "zustand";
import { Profile, ProfileRekening } from "../types";
import { ProfileService, INITIAL_PROFILE } from "../services/Profile.services";

interface ProfileState {
  profile: Profile;
  isLoading: boolean;
  
  // Actions
  loadProfile: () => void;
  updateProfile: (updated: Partial<Profile>) => void;
  updateSignature: (ttdUrl: string) => void;
  addRekening: (rekening: Omit<ProfileRekening, "id">) => void;
  deleteRekening: (rekId: string) => void;
  setDefaultRekening: (rekId: string) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: INITIAL_PROFILE,
  isLoading: false,

  loadProfile: () => {
    const prof = ProfileService.getProfile();
    set({ profile: prof });
  },

  updateProfile: (updated: Partial<Profile>) => {
    const saved = ProfileService.saveProfile(updated);
    set({ profile: saved });
  },

  updateSignature: (ttdUrl: string) => {
    const saved = ProfileService.updateSignature(ttdUrl);
    set({ profile: saved });
  },

  addRekening: (rekening: Omit<ProfileRekening, "id">) => {
    const saved = ProfileService.addRekening(rekening);
    set({ profile: saved });
  },

  deleteRekening: (rekId: string) => {
    const saved = ProfileService.deleteRekening(rekId);
    set({ profile: saved });
  },

  setDefaultRekening: (rekId: string) => {
    const saved = ProfileService.setDefaultRekening(rekId);
    set({ profile: saved });
  },

  resetProfile: () => {
    const initial = ProfileService.resetProfile();
    set({ profile: initial });
  },
}));
