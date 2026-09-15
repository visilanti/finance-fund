"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;
import { Label } from "./Label";
import { Select } from "./Select";
import { cn } from "@/lib/utils";
import { BULAN_OPTIONS } from "@/lib/constants";

export type DatePickerProps = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time" | "weekly" | "monthly";
  onChange?: Hook | Hook[] | ((selectedDates: Date[], dateStr: string, instance: flatpickr.Instance | null) => void);
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
  isRequired?: boolean;
  error?: string;
  disabled?: boolean;
  value?: string;
};

/**
 * Menghitung rentang Senin–Sabtu dari minggu yang memuat `date`.
 * Range utuh 6 hari dan mengalir natural ke bulan sebelah.
 */
function getWeekRangeWithinMonth(date: Date): [Date, Date] {
  const day = date.getDay(); // 0=Minggu, 1=Senin, ..., 6=Sabtu

  // Cari Senin di minggu yang sama
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  // Sabtu = Senin + 5 hari
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);
  saturday.setHours(0, 0, 0, 0);

  return [monday, saturday];
}

/**
 * Menghitung rentang awal bulan s/d akhir bulan dari `date`.
 * Contoh: 15 Agustus 2026 -> [1 Agustus 2026, 31 Agustus 2026].
 */
function getMonthRange(date: Date): [Date, Date] {
  const year = date.getFullYear();
  const month = date.getMonth();

  const start = new Date(year, month, 1, 0, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 0, 0, 0, 0);

  return [start, end];
}

export function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder = "Pilih tanggal...",
  className = "w-full",
  isRequired,
  error,
  disabled,
  value,
}: DatePickerProps) {
  // Jika mode monthly, gunakan komponen Select dengan opsi bulan global
  if (mode === "monthly") {
    const monthPlaceholder = placeholder === "Pilih tanggal..." ? "Pilih bulan..." : placeholder;
    return (
      <Select
        id={id}
        label={label}
        value={value}
        disabled={disabled}
        isRequired={isRequired}
        error={error}
        placeholder={monthPlaceholder}
        options={[...BULAN_OPTIONS]}
        isSearchable={true}
        className={className}
        onChange={(val: any) => {
          const selectedStr = typeof val === "string" ? val : val?.target?.value || "";
          if (onChange) {
            const handlers = Array.isArray(onChange) ? onChange : [onChange];
            handlers.forEach((h: any) => h([], selectedStr, null as any));
          }
        }}
      />
    );
  }
  const inputRef = useRef<HTMLInputElement>(null);

  // Menandai bahwa onChange saat ini dipicu oleh setDate() internal kita,
  // bukan oleh klik user, supaya tidak terjadi loop tak berujung.
  const isInternalChange = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const inputEl = inputRef.current || document.getElementById(id);
    if (!inputEl) return;

    // Hancurkan instance lama jika ada sebelum membuat instance baru
    if ((inputEl as any)._flatpickr) {
      (inputEl as any)._flatpickr.destroy();
    }

    const isWeekly = mode === "weekly";
    const isCustomRange = isWeekly;

    const emit = (selectedDates: Date[], dateStr: string, instance: flatpickr.Instance) => {
      const currentOnChange = onChangeRef.current;
      if (!currentOnChange) return;
      const handlers = Array.isArray(currentOnChange) ? currentOnChange : [currentOnChange];
      handlers.forEach((h) => h(selectedDates, dateStr, instance));
    };

    const options: flatpickr.Options.Options = {
      mode: isCustomRange ? "range" : mode || "single",
      static: true,
      monthSelectorType: "dropdown",
      dateFormat: "Y-m-d",
      disableMobile: true, // Memaksa Flatpickr menggunakan custom popup kalender di HP
      onChange: isCustomRange
        ? (selectedDates, dateStr, instance) => {
            if (isInternalChange.current) {
              isInternalChange.current = false;
              emit(selectedDates, dateStr, instance);
              return;
            }

            if (selectedDates.length === 0) return;

            const clicked = selectedDates[selectedDates.length - 1];
            const [start, end] = isWeekly
              ? getWeekRangeWithinMonth(clicked)
              : getMonthRange(clicked);

            isInternalChange.current = true;
            instance.setDate([start, end], true);
          }
        : (selectedDates, dateStr, instance) => {
            emit(selectedDates, dateStr, instance);
          },
    };

    if (defaultDate !== undefined) {
      options.defaultDate = defaultDate;
    }

    if (isWeekly) {
      options.disable = [(date: Date) => date.getDay() === 0];
    }

    const flatPickr = flatpickr(inputEl, options);

    return () => {
      if (flatPickr && typeof flatPickr.destroy === "function") {
        flatPickr.destroy();
      }
    };
  }, [mode, id, defaultDate]);

  useEffect(() => {
    const inputEl = inputRef.current || document.getElementById(id);
    if (!inputEl) return;
    const fp = (inputEl as any)._flatpickr;
    if (fp && value !== undefined && value !== fp.input.value) {
      fp.setDate(value, false);
    }
  }, [value, id]);

  return (
    <div className={cn("w-full space-y-1", className)}>
      {label && (
        <Label htmlFor={id} isRequired={isRequired}>
          {label}
        </Label>
      )}

      <div className="relative flex items-center w-full [&_.flatpickr-wrapper]:w-full [&_.flatpickr-wrapper]:block">
        <input
          ref={inputRef}
          id={id}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className={cn(
            "w-full pl-3 pr-10 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all cursor-pointer",
            error && "border-rose-500 dark:border-rose-500 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20 dark:bg-rose-950/20",
            disabled && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900"
          )}
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center z-10">
          <CalendarIcon className="w-4 h-4 shrink-0" />
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
