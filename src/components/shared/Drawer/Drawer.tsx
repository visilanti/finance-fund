"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import useMediaQuery from "./useMediaQuery";
import {
  Drawer as UiDrawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
} from "@/components/ui/drawer";

export interface DrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  maxWidthClass?: string;
  swipeDirection?: "down" | "right" | "left" | "up";
  mobileSwipeDirection?: "down" | "right" | "left" | "up";
  desktopSwipeDirection?: "down" | "right" | "left" | "up";
  showSwipeHandle?: boolean;
  className?: string;
}

export function Drawer({
  isOpen,
  open,
  onClose,
  onOpenChange,
  title,
  subtitle,
  children,
  footerActions,
  maxWidthClass,
  swipeDirection,
  mobileSwipeDirection,
  desktopSwipeDirection,
  showSwipeHandle = true,
  className,
}: DrawerProps) {
  const isDrawerOpen = isOpen ?? open ?? false;
  const isMobileOrTab = useMediaQuery("(max-width: 1024px)");

  // Compute direction: Mobile & Tab (<=1024px) defaults to bottom sheet ("down"), Desktop (>1024px) defaults to side panel ("right")
  const computedDirection = isMobileOrTab
    ? (mobileSwipeDirection ?? (swipeDirection && !desktopSwipeDirection ? swipeDirection : "down"))
    : (desktopSwipeDirection ?? swipeDirection ?? "right");

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange?.(newOpen);
    if (!newOpen) {
      onClose?.();
    }
  };

  const isYAxis = computedDirection === "down" || computedDirection === "up";

  // Desktop Side Panel (>1024px): min-width 420px, max-width 520px, full height
  // Mobile & Tab Bottom Sheet (<=1024px): direction "down", full width (w-full max-w-full), min-height 280-320px, max-height 90dvh
  const responsiveMaxWidth = isYAxis
    ? "w-full max-w-full mx-auto"
    : maxWidthClass || "w-full min-w-[min(420px,100vw)] sm:min-w-[420px] max-w-[520px]";

  return (
    <UiDrawer
      open={isDrawerOpen}
      onOpenChange={handleOpenChange}
      swipeDirection={computedDirection}
      showSwipeHandle={showSwipeHandle}
    >
      <DrawerContent
        className={cn(
          isYAxis && "w-full max-w-full mx-auto min-h-[300px] min-h-[40vh] max-h-[90dvh]",
          !isYAxis &&
            (computedDirection === "right" || computedDirection === "left") &&
            "h-full w-full min-w-[min(420px,100vw)] sm:min-w-[420px] max-w-[520px]",
          responsiveMaxWidth,
          className
        )}
      >
        {(title || subtitle) && (
          <DrawerHeader className="relative border-b border-slate-100 dark:border-slate-800 p-4 shrink-0">
            <div className="pr-8 text-left">
              {typeof title === "string" ? (
                <DrawerTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {title}
                </DrawerTitle>
              ) : (
                <div>{title}</div>
              )}
              {subtitle && (
                typeof subtitle === "string" ? (
                  <DrawerDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {subtitle}
                  </DrawerDescription>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</div>
                )
              )}
            </div>
            <DrawerClose className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer">
              <X className="h-5 w-5" />
              <span className="sr-only">Tutup</span>
            </DrawerClose>
          </DrawerHeader>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {children}
        </div>

        {footerActions && (
          <DrawerFooter className="flex-row items-center gap-2 border-t border-slate-100 dark:border-slate-800 p-4 shrink-0">
            {footerActions}
          </DrawerFooter>
        )}
      </DrawerContent>
    </UiDrawer>
  );
}

export {
  UiDrawer as BaseDrawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerSwipeHandle,
};

