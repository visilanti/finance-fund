"use client";

import React, {
  useId,
  useState,
  useRef,
  useEffect,
  useMemo,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./Label";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id?: string;
  name?: string;
  label?: string;
  isRequired?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  options?: (SelectOption | string)[];
  value?: string;
  defaultValue?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: string } } | string
  ) => void;
  isSearchable?: boolean;
  className?: string;
}

export const Select = React.forwardRef<HTMLInputElement, SelectProps>(
  (
    {
      id: providedId,
      name,
      label,
      isRequired,
      error,
      leftIcon,
      disabled = false,
      placeholder = "Pilih opsi...",
      options = [],
      value,
      defaultValue,
      onChange,
      isSearchable = false,
      className,
      ...props
    },
    ref
  ) => {
    const internalId = useId();
    const id = providedId ?? internalId;

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => hiddenInputRef.current as HTMLInputElement);

    const initialVal = String(value ?? defaultValue ?? "");
    const [selectedValue, setSelectedValue] = useState<string>(initialVal);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    // Coords for Portal floating positioning
    const [dropdownCoords, setDropdownCoords] = useState<{
      top: number;
      left: number;
      width: number;
    }>({ top: 0, left: 0, width: 0 });

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(String(value));
      }
    }, [value]);

    // Normalize options array into { value, label, disabled }
    const normalizedOptions: SelectOption[] = useMemo(() => {
      return options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
      );
    }, [options]);

    // Active selected option
    const selectedOption = useMemo(() => {
      return normalizedOptions.find((opt) => opt.value === selectedValue);
    }, [normalizedOptions, selectedValue]);

    const displayLabel = selectedOption ? selectedOption.label : selectedValue;

    // Real-time search filtering
    const filteredOptions = useMemo(() => {
      if (!isSearchable || !searchTerm.trim()) return normalizedOptions;
      const term = searchTerm.toLowerCase();
      return normalizedOptions.filter(
        (opt) =>
          opt.label.toLowerCase().includes(term) ||
          opt.value.toLowerCase().includes(term)
      );
    }, [normalizedOptions, isSearchable, searchTerm]);

    // Update portal dropdown position based on trigger bounding box
    const updateCoords = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownCoords({
          top: rect.bottom + 6,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    // Close on click outside (Check both containerRef and popoverRef for Portal compatibility)
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;
        const isInsideContainer = containerRef.current && containerRef.current.contains(target);
        const isInsidePopover = popoverRef.current && popoverRef.current.contains(target);

        if (!isInsideContainer && !isInsidePopover) {
          setIsOpen(false);
          setSearchTerm("");
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // AUTO-CLOSE ON SCROLL (Ignores scroll inside the dropdown popover itself)
    useEffect(() => {
      if (!isOpen) return;

      const handleScroll = (event: Event) => {
        const target = event.target as Node;
        // Ignore scroll events originating inside the popover options list
        if (popoverRef.current && popoverRef.current.contains(target)) {
          return;
        }

        setIsOpen(false);
        setSearchTerm("");
      };

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }, [isOpen]);

    // Focus search input when open
    useEffect(() => {
      if (isOpen && isSearchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, isSearchable]);

    // Calculate coordinates when opening
    useEffect(() => {
      if (isOpen) {
        updateCoords();
      }
    }, [isOpen]);

    // Handle Option Selection
    const handleSelectOption = (opt: SelectOption) => {
      if (opt.disabled) return;
      setSelectedValue(opt.value);
      setIsOpen(false);
      setSearchTerm("");

      if (hiddenInputRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(hiddenInputRef.current, opt.value);

        hiddenInputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        hiddenInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }

      if (onChange) {
        if (typeof onChange === "function") {
          (onChange as any)({ target: { name, value: opt.value } });
          (onChange as any)(opt.value);
        }
      }
    };

    // Handle Clear Selection
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedValue("");
      setSearchTerm("");
      setIsOpen(false);

      if (hiddenInputRef.current) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(hiddenInputRef.current, "");

        hiddenInputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        hiddenInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }

      if (onChange) {
        if (typeof onChange === "function") {
          (onChange as any)({ target: { name, value: "" } });
          (onChange as any)("");
        }
      }
    };

    return (
      <div className="flex flex-col gap-1 w-full relative" ref={containerRef}>
        {label && (
          <Label htmlFor={id} isRequired={isRequired}>
            {label}
          </Label>
        )}

        <div className="relative w-full">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center z-10">
              {leftIcon}
            </div>
          )}

          {/* Hidden Input for Form Compatibility */}
          <input
            id={id}
            ref={hiddenInputRef}
            type="text"
            name={name}
            value={selectedValue}
            readOnly
            className="sr-only"
            {...props}
          />

          {/* Trigger Box */}
          <div
            ref={triggerRef}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                !disabled && setIsOpen((prev) => !prev);
              }
            }}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer select-none",
              leftIcon && "pl-9",
              selectedValue && !disabled ? "pr-14" : "pr-9",
              isOpen && "ring-1 ring-primary border-primary bg-white dark:bg-slate-800",
              disabled && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900",
              error && "border-rose-500 dark:border-rose-500 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20 dark:bg-rose-950/20",
              className
            )}
          >
            <span className={cn("truncate", !displayLabel && "text-slate-400 dark:text-slate-500")}>
              {displayLabel || placeholder}
            </span>
          </div>

          {/* Action Indicators (Clear & Chevron) */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
            {selectedValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                title="Hapus Pilihan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 pointer-events-none",
                isOpen && "rotate-180 text-primary dark:text-red-400"
              )}
            />
          </div>
        </div>

        {/* Portal Floating Popover Dropdown (Outside DOM Stacking Context z-[9999]) */}
        {isOpen &&
          !disabled &&
          isMounted &&
          createPortal(
            <div
              ref={popoverRef}
              style={{
                position: "fixed",
                top: `${dropdownCoords.top}px`,
                left: `${dropdownCoords.left}px`,
                width: `${dropdownCoords.width}px`,
              }}
              className="z-[9999] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden"
            >
              {/* Optional Search Input */}
              {isSearchable && (
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari opsi..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              )}

              {/* Options List */}
              <div className="max-h-56 overflow-y-auto py-1 text-xs">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 font-medium text-center">
                    Tidak ada opsi ditemukan
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = selectedValue === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!opt.disabled) handleSelectOption(opt);
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!opt.disabled) handleSelectOption(opt);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer select-none",
                          opt.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                          isSelected
                            ? "bg-red-50/80 dark:bg-red-950/40 text-primary dark:text-red-400 font-bold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-primary dark:text-red-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>,
            document.body
          )}

        {error && (
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in duration-150">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
