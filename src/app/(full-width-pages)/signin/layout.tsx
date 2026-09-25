import { ThemeProvider } from "@/context/ThemeContext";
import GridShape from "@/components/shared/GridShape";
import ThemeTogglerTwo from "@/components/shared/ThemeTogglerTwo";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          {children}
          <div className="relative lg:w-1/2 w-full h-full bg-primary dark:bg-gray-900 lg:flex items-center justify-center hidden overflow-hidden">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            
            <div className="relative items-center justify-center flex z-10">
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo.png"
                    alt="Logo"
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-theme-xs"
                  />
                </Link>
                <p className="text-center text-white/80 dark:text-white/60 text-lg">
                  Sistem Management Cashout Finance <br />Edu Global School
                </p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
