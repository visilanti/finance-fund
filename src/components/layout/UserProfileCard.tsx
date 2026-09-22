"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  ShieldCheck, 
  Settings
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/features/profile/store/useProfileStore";

interface UserProfileCardProps {
  userName?: string;
  userRoleTitle?: string;
  roleTitle?: string;
  userEmail?: string;
  onLogout?: () => void;
}

export function UserProfileCard({
  userName = "Ahmad Hidayat",
  userRoleTitle,
  roleTitle = "Staf / Kadiv Operasional",
  userEmail = "ahmad.hidayat@perusahaan.co.id",
  onLogout,
}: UserProfileCardProps) {
  const router = useRouter();
  const { profile, loadProfile } = useProfileStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    loadProfile();
  }, [loadProfile]);

  const effectiveName = profile?.fullName || userName;
  const effectiveEmail = profile?.email || userEmail;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDarkMode = mounted ? (resolvedTheme === "dark" || theme === "dark") : false;

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      alert("Proses logout berhasil. Mengalihkan ke halaman login...");
      window.location.href = "/";
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-2 sm:gap-3 cursor-pointer p-1.5 rounded-xl transition-all duration-150 outline-none select-none",
          isOpen
            ? "bg-slate-100 dark:bg-slate-800/80 ring-1 ring-slate-200 dark:ring-slate-700"
            : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
        )}
      >
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center text-white font-bold text-xs">
            {getInitials(effectiveName)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </div>

        <div className="hidden lg:block text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
              {effectiveName}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium leading-none mt-0.5 truncate">
            {userRoleTitle || roleTitle}
          </p>
        </div>

        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 dark:text-slate-400 hidden sm:block transition-transform duration-200 shrink-0",
            isOpen && "rotate-180 text-slate-700 dark:text-slate-200"
          )}
        />
      </button>

      {/* Dropdown Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl z-50 py-2.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center text-white font-bold text-sm">
                {getInitials(effectiveName)}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {effectiveName}
              </h4>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400 truncate mt-0.5">
                {effectiveEmail}
              </p>
              <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-3 h-3 text-primary" />
                <span>{userRoleTitle || roleTitle}</span>
              </div>
            </div>
          </div>

          {/* Quick Settings & Tools */}
          <div className="p-1.5 space-y-0.5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pengaturan & Fitur
            </div>

            {/* Dark Mode Switcher Item */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-indigo-950 text-amber-600 dark:text-indigo-400">
                  {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                </div>
                <span>Mode Tampilan</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400">
                  {isDarkMode ? "Gelap" : "Terang"}
                </span>
                <div
                  className={cn(
                    "w-8 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center",
                    isDarkMode ? "bg-primary justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                  )}
                >
                  <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
                </div>
              </div>
            </button>

            {/* Profil Saya Item */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>Profil & Pengaturan</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="p-1.5 pt-1">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-rose-100/60 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                <LogOut className="w-3.5 h-3.5" />
              </div>
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
