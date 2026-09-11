import { create } from "zustand";

interface SidebarState {
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  expandedSubmenus: Record<string, boolean>;
  
  toggleMobileOpen: () => void;
  closeMobile: () => void;
  toggleDesktopCollapsed: () => void;
  toggleSubmenu: (menuId: string) => void;
  isSubmenuOpen: (menuId: string) => boolean;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isMobileOpen: false,
  isDesktopCollapsed: false,
  expandedSubmenus: {},

  toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  closeMobile: () => set({ isMobileOpen: false }),
  toggleDesktopCollapsed: () =>
    set((state) => ({ isDesktopCollapsed: !state.isDesktopCollapsed })),
  toggleSubmenu: (menuId: string) =>
    set((state) => ({
      expandedSubmenus: {
        ...state.expandedSubmenus,
        [menuId]: !state.expandedSubmenus[menuId],
      },
    })),
  isSubmenuOpen: (menuId: string) => Boolean(get().expandedSubmenus[menuId]),
}));
