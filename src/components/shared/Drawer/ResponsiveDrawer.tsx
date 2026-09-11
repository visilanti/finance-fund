"use client"

import React from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import useMediaQuery from "./useMediaQuery"

export interface ResponsiveDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  /**
   * Manual direction override. If omitted, defaults to "down" on mobile and "right" on desktop.
   */
  direction?: "down" | "right" | "left" | "up"
  showSwipeHandle?: boolean
  className?: string
}

export function ResponsiveDrawer({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  direction,
  showSwipeHandle = true,
  className,
}: ResponsiveDrawerProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const computedDirection = direction ?? (isMobile ? "down" : "right")

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      swipeDirection={computedDirection}
      showSwipeHandle={showSwipeHandle}
    >
      {trigger && (
        React.isValidElement(trigger) ? (
          <DrawerTrigger render={trigger} />
        ) : (
          <DrawerTrigger>{trigger}</DrawerTrigger>
        )
      )}

      <DrawerContent
        className={cn(
          computedDirection === "right" && "sm:max-w-md w-full",
          computedDirection === "left" && "sm:max-w-md w-full",
          className
        )}
      >
        <DrawerHeader className="relative border-b border-gray-100 dark:border-gray-800 pb-4">
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
          
          <DrawerClose className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors focus:outline-none dark:hover:bg-gray-800 dark:hover:text-gray-200">
            <X className="h-4 w-4" />
            <span className="sr-only">Tutup</span>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {footer && <DrawerFooter className="border-t border-gray-100 dark:border-gray-800 pt-4">{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  )
}

export default ResponsiveDrawer
