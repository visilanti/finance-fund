import { create } from "zustand";

interface SidebarState {
  isMobileOpen: boolean;
  isDesktopCollapsed: boolean;
  isHovered: boolean;
  isHover: boolean;
  expandedSubmenus: Record<string, boolean>;
  
  toggleMobileOpen: () => void;
  closeMobile: () => void;
  toggleDesktopCollapsed: () => void;
  setIsHovered: (hovered: boolean) => void;
  setHover: (hover: boolean) => void;
  closeHover: () => void;
  toggleSubmenu: (menuId: string) => void;
  isSubmenuOpen: (menuId: string) => boolean;
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  isMobileOpen: false,
  isDesktopCollapsed: false,
  isHovered: false,
  isHover: false,
  expandedSubmenus: {},

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
}));
