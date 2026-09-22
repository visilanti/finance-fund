import React from "react";

interface ChipCardIconProps {
  className?: string;
}

export function ChipCardIcon({ className = "w-9 h-7 text-amber-200/90 shadow-sm flex-shrink-0" }: ChipCardIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="36" height="28" rx="4" fill="#F3C68F" fillOpacity="0.85" />
      <rect x="2" y="2" width="32" height="24" rx="3" stroke="#D49B59" strokeWidth="0.8" />
      <path
        d="M2 10H14M2 18H14M34 10H22M34 18H22M14 2V26M22 2V26"
        stroke="#D49B59"
        strokeWidth="0.8"
      />
    </svg>
  );
}
