import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoleType } from "@/constants/navigation";

interface SidebarState {
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  isHovered: boolean;
  isHover: boolean;
  expandedSubmenus: Record<string, boolean>;
  currentRole: RoleType;

  toggleMobileOpen: () => void;
  closeMobile: () => void;
  toggleDesktopCollapsed: () => void;
  setIsHovered: (hovered: boolean) => void;
  setHover: (hover: boolean) => void;
  closeHover: () => void;
  toggleSubmenu: (menuId: string) => void;
  isSubmenuOpen: (menuId: string) => boolean;
  setRole: (role: RoleType) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isMobileOpen: false,
      isDesktopCollapsed: false,
      isHovered: false,
      isHover: false,
      expandedSubmenus: {},
      currentRole: "divisi",

      toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
      closeMobile: () => set({ isMobileOpen: false }),
      toggleDesktopCollapsed: () =>
        set((state) => ({
          isDesktopCollapsed: !state.isDesktopCollapsed,
          isHovered: false,
          isHover: false,
        })),
      setIsHovered: (hovered: boolean) =>
        set({ isHovered: hovered, isHover: hovered }),
      setHover: (hover: boolean) =>
        set({ isHovered: hover, isHover: hover }),
      closeHover: () => set({ isHovered: false, isHover: false }),
      toggleSubmenu: (menuId: string) =>
        set((state) => ({
          expandedSubmenus: {
            ...state.expandedSubmenus,
            [menuId]: !state.expandedSubmenus[menuId],
          },
        })),
      isSubmenuOpen: (menuId: string) => Boolean(get().expandedSubmenus[menuId]),
      setRole: (role: RoleType) => set({ currentRole: role }),
    }),
    {
      name: "finance_sidebar_store",
      partialize: (state) => ({ currentRole: state.currentRole }),
    }
  )
);

