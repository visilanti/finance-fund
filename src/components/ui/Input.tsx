"use client";

import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { cn, formatIDR } from "@/lib/utils";
import { Label } from "./Label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "text" | "number" | "email" | "password" | "currency" | "date";
}

/**
 * Helper to format a number or numeric string as formatted IDR currency string (e.g. 1500000 -> "Rp 1.500.000").
 */
export function formatCurrencyString(val: string | number | readonly string[] | undefined | null): string {
  if (val === undefined || val === null || val === "") return "";
  const rawDigits = String(val).replace(/\D/g, "");
  if (!rawDigits) return "";
  const num = parseInt(rawDigits, 10);
  if (isNaN(num)) return "";
  return formatIDR(num);
}

/**
 * Helper to format a string or numeric value into YYYY-MM-DD date string (e.g. 20260309 -> "2026-03-09").
 */
export function formatDateString(val: string | number | readonly string[] | undefined | null): string {
  if (val === undefined || val === null || val === "") return "";
  const str = String(val).trim();

  // Handle formatted or separator inputs (- or /)
  if (str.includes("-") || str.includes("/")) {
    const rawParts = str.split(/[-/]/);
    const y = rawParts[0].replace(/\D/g, "").slice(0, 4);
    if (!y) return "";
    if (rawParts.length === 1) return y;

    // Month part
    let m = rawParts[1] !== undefined ? rawParts[1].replace(/\D/g, "") : "";
    let extraFromMonth = "";
    if (m.length > 2) {
      extraFromMonth = m.slice(2);
      m = m.slice(0, 2);
    }

    // Auto-pad single digit month when followed by hyphen (e.g. "2026-3-")
    if (rawParts.length > 2 && m.length === 1) {
      m = "0" + m;
    }

    if (m.length === 2) {
      const mNum = parseInt(m, 10);
      if (mNum > 12) m = "12";
      else if (mNum < 1) m = "01";
    }

    if (rawParts.length === 2 && !extraFromMonth && !str.endsWith("-") && !str.endsWith("/")) {
      return y + (m ? `-${m}` : "");
    }

    if (rawParts.length === 2 && !extraFromMonth && (str.endsWith("-") || str.endsWith("/"))) {
      return y + "-" + (m ? `${m}-` : "");
    }

    // Day part
    let d = (extraFromMonth + (rawParts[2] !== undefined ? rawParts[2].replace(/\D/g, "") : "")).slice(0, 2);
    if (d.length === 2) {
      const dNum = parseInt(d, 10);
      if (dNum > 31) d = "31";
      else if (dNum < 1) d = "01";
    }
    return y + "-" + m + (d ? `-${d}` : str.endsWith("-") || str.endsWith("/") ? "-" : "");
  }

  // Pure digits without separators (e.g. "20260309")
  const rawDigits = str.replace(/\D/g, "").slice(0, 8);
  if (!rawDigits) return "";
  if (rawDigits.length <= 4) return rawDigits;
  if (rawDigits.length <= 6) {
    let m = rawDigits.slice(4);
    if (m.length === 2) {
      const mNum = parseInt(m, 10);
      if (mNum > 12) m = "12";
      else if (mNum < 1) m = "01";
    }
    return `${rawDigits.slice(0, 4)}-${m}`;
  }
  let m = rawDigits.slice(4, 6);
  const mNum = parseInt(m, 10);
  if (mNum > 12) m = "12";
  else if (mNum < 1) m = "01";

  let d = rawDigits.slice(6);
  if (d.length === 2) {
    const dNum = parseInt(d, 10);
    if (dNum > 31) d = "31";
    else if (dNum < 1) d = "01";
  }
  return `${rawDigits.slice(0, 4)}-${m}-${d}`;
}

/**
 * Helper to count how many digits exist in a formatted string up to targetDigitCount
 * and return the corresponding string index for cursor placement.
 */
function getCursorPosFromDigits(formatted: string, targetDigitCount: number): number {
  if (targetDigitCount <= 0) {
    const firstDigitIdx = formatted.search(/\d/);
    return firstDigitIdx !== -1 ? firstDigitIdx : 0;
  }
  let digitCount = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitCount++;
    }
    if (digitCount === targetDigitCount) {
      return i + 1;
    }
  }
  return formatted.length;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      isRequired,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant = "text",
      type,
      className,
      id,
      disabled,
      value,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onMouseUp,
      onPaste,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [dateDraft, setDateDraft] = useState<string>("");
    const innerRef = React.useRef<HTMLInputElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref]
    );

    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const isPasswordType = variant === "password" || type === "password";
    const isCurrencyType = variant === "currency";
    const isDateType = variant === "date";

    React.useEffect(() => {
      if (isDateType) {
        if (value !== undefined && value !== null && value !== "") {
          setDateDraft(String(value));
        } else if (!isFocused) {
          setDateDraft("");
        }
      }
    }, [value, isDateType, isFocused]);

    const computedType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : isCurrencyType || isDateType
      ? "text"
      : type || variant;

    const displayValue = isCurrencyType
      ? value !== undefined
        ? formatCurrencyString(value)
        : undefined
      : isDateType
      ? isFocused
        ? (dateDraft || "YYYY-MM-DD")
        : (value ? String(value) : "")
      : value;

    const dispatchChangeEvent = (newVal: string) => {
      if (!innerRef.current) return;
      const clonedTarget = Object.create(innerRef.current);
      Object.defineProperty(clonedTarget, "value", {
        value: newVal,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      const syntheticEvent = {
        target: clonedTarget,
        currentTarget: clonedTarget,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isDateType) {
        setIsFocused(true);
        const currentVal = value ? String(value) : "";
        const initialDraft = currentVal || "YYYY-MM-DD";
        setDateDraft(initialDraft);
        requestAnimationFrame(() => {
          if (innerRef.current) {
            innerRef.current.setSelectionRange(0, 4);
          }
        });
      }
      onFocus?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
      if (isDateType && innerRef.current) {
        const pos = innerRef.current.selectionStart || 0;
        if (pos <= 4) {
          innerRef.current.setSelectionRange(0, 4);
        } else if (pos <= 7) {
          innerRef.current.setSelectionRange(5, 7);
        } else {
          innerRef.current.setSelectionRange(8, 10);
        }
      }
      onMouseUp?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isDateType) {
        setIsFocused(false);
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateDraft)) {
          const [y, mStr, dStr] = dateDraft.split("-");
          let m = parseInt(mStr, 10);
          let d = parseInt(dStr, 10);
          if (m > 12) m = 12;
          if (m < 1) m = 1;
          if (d > 31) d = 31;
          if (d < 1) d = 1;
          const finalDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          setDateDraft(finalDate);
          dispatchChangeEvent(finalDate);
        } else {
          setDateDraft("");
          if (value) {
            dispatchChangeEvent("");
          }
        }
      }
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isDateType) {
        const inputEl = innerRef.current;
        if (!inputEl) return;

        const key = e.key;
        const selStart = inputEl.selectionStart || 0;
        const seg = selStart <= 4 ? 0 : selStart <= 7 ? 1 : 2;

        const currentStr = dateDraft || "YYYY-MM-DD";
        const parts = currentStr.split("-");
        let y = parts[0] || "YYYY";
        let m = parts[1] || "MM";
        let d = parts[2] || "DD";

        // Tab & Shift+Tab between segments
        if (key === "Tab" && !e.shiftKey) {
          if (seg === 0) {
            e.preventDefault();
            inputEl.setSelectionRange(5, 7);
            return;
          } else if (seg === 1) {
            e.preventDefault();
            inputEl.setSelectionRange(8, 10);
            return;
          }
        }

        if (key === "Tab" && e.shiftKey) {
          if (seg === 2) {
            e.preventDefault();
            inputEl.setSelectionRange(5, 7);
            return;
          } else if (seg === 1) {
            e.preventDefault();
            inputEl.setSelectionRange(0, 4);
            return;
          }
        }

        // Arrow navigation or separator jump (- or /)
        if (key === "ArrowRight" || key === "-" || key === "/") {
          e.preventDefault();
          if (seg === 0) {
            inputEl.setSelectionRange(5, 7);
          } else if (seg === 1) {
            inputEl.setSelectionRange(8, 10);
          }
          return;
        }

        if (key === "ArrowLeft") {
          e.preventDefault();
          if (seg === 2) {
            inputEl.setSelectionRange(5, 7);
          } else if (seg === 1) {
            inputEl.setSelectionRange(0, 4);
          }
          return;
        }

        // Backspace clears segment or moves to previous
        if (key === "Backspace") {
          e.preventDefault();
          if (seg === 0) {
            y = "YYYY";
            const updated = `${y}-${m}-${d}`;
            setDateDraft(updated);
            requestAnimationFrame(() => inputEl.setSelectionRange(0, 4));
          } else if (seg === 1) {
            if (m === "MM") {
              inputEl.setSelectionRange(0, 4);
            } else {
              m = "MM";
              const updated = `${y}-${m}-${d}`;
              setDateDraft(updated);
              requestAnimationFrame(() => inputEl.setSelectionRange(5, 7));
            }
          } else if (seg === 2) {
            if (d === "DD") {
              inputEl.setSelectionRange(5, 7);
            } else {
              d = "DD";
              const updated = `${y}-${m}-${d}`;
              setDateDraft(updated);
              requestAnimationFrame(() => inputEl.setSelectionRange(8, 10));
            }
          }
          return;
        }

        // Typing digits
        if (/\d/.test(key)) {
          e.preventDefault();
          let nextSeg = seg;
          if (seg === 0) {
            let cur = y === "YYYY" ? "" : y.replace(/\D/g, "");
            if (cur.length >= 4) cur = "";
            cur += key;
            y = cur.padEnd(4, "Y");
            if (cur.length === 4) {
              nextSeg = 1;
            }
          } else if (seg === 1) {
            let cur = m === "MM" ? "" : m.replace(/\D/g, "");
            if (cur.length >= 2) cur = "";
            cur += key;

            // Auto-pad jika angka pertama > 1 (e.g. ketik 2..9 otomatis menjadi 02..09)
            if (cur.length === 1 && parseInt(cur, 10) > 1) {
              cur = "0" + cur;
            }

            // Batas bulan maksimal 12 dan minimal 01
            if (cur.length === 2) {
              const num = parseInt(cur, 10);
              if (num > 12) {
                cur = "12";
              } else if (num < 1) {
                cur = "01";
              }
              nextSeg = 2;
            }

            m = cur.padEnd(2, "M");
          } else if (seg === 2) {
            let cur = d === "DD" ? "" : d.replace(/\D/g, "");
            if (cur.length >= 2) cur = "";
            cur += key;

            // Auto-pad jika angka pertama > 3 (e.g. ketik 4..9 otomatis menjadi 04..09)
            if (cur.length === 1 && parseInt(cur, 10) > 3) {
              cur = "0" + cur;
            }

            // Batas tanggal maksimal 31 dan minimal 01
            if (cur.length === 2) {
              const num = parseInt(cur, 10);
              if (num > 31) {
                cur = "31";
              } else if (num < 1) {
                cur = "01";
              }
              nextSeg = 2;
            }

            d = cur.padEnd(2, "D");
          }

          const updated = `${y}-${m}-${d}`;
          setDateDraft(updated);

          if (/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
            dispatchChangeEvent(updated);
          }

          requestAnimationFrame(() => {
            if (nextSeg === 0) inputEl.setSelectionRange(0, 4);
            else if (nextSeg === 1) inputEl.setSelectionRange(5, 7);
            else inputEl.setSelectionRange(8, 10);
          });
          return;
        }
      }

      onKeyDown?.(e);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (isDateType) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text");
        const formatted = formatDateString(pasted);
        if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
          setDateDraft(formatted);
          dispatchChangeEvent(formatted);
          requestAnimationFrame(() => {
            innerRef.current?.setSelectionRange(8, 10);
          });
        }
        return;
      }
      onPaste?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isCurrencyType) {
        const inputEl = e.target;
        const originalValue = inputEl.value;
        const selectionStart = inputEl.selectionStart || 0;

        let digitsBeforeCursor = 0;
        for (let i = 0; i < selectionStart; i++) {
          if (/\d/.test(originalValue[i])) {
            digitsBeforeCursor++;
          }
        }

        const rawDigits = originalValue.replace(/\D/g, "");
        const formatted = formatCurrencyString(rawDigits);

        const clonedTarget = Object.create(inputEl);
        Object.defineProperty(clonedTarget, "value", {
          value: rawDigits,
          writable: true,
          enumerable: true,
          configurable: true,
        });

        const syntheticEvent = Object.create(e);
        Object.defineProperty(syntheticEvent, "target", {
          value: clonedTarget,
          writable: true,
          enumerable: true,
          configurable: true,
        });
        Object.defineProperty(syntheticEvent, "currentTarget", {
          value: clonedTarget,
          writable: true,
          enumerable: true,
          configurable: true,
        });

        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);

        requestAnimationFrame(() => {
          if (inputEl && document.activeElement === inputEl) {
            const newPos = getCursorPosFromDigits(formatted, digitsBeforeCursor);
            try {
              inputEl.setSelectionRange(newPos, newPos);
            } catch {
              // ignore potential selection range errors
            }
          }
        });
      } else if (!isDateType) {
        onChange?.(e);
      }
    };

    return (
      <div className="w-full space-y-1">
        {label && (
          <Label htmlFor={inputId} isRequired={isRequired}>
            {label}
          </Label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={setRefs}
            id={inputId}
            type={computedType}
            inputMode={
              isCurrencyType || isDateType
                ? (props.inputMode || "numeric")
                : props.inputMode
            }
            maxLength={isDateType ? 10 : props.maxLength}
            placeholder={props.placeholder ?? (isDateType ? "Pilih tanggal..." : undefined)}
            disabled={disabled}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onMouseUp={handleMouseUp}
            onPaste={handlePaste}
            className={cn(
              "w-full px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-slate-800 transition-all duration-150",
              leftIcon && "pl-9",
              (rightIcon || isPasswordType) && "pr-9",
              error && "border-rose-500 dark:border-rose-500 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20 dark:bg-rose-950/20",
              disabled && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900",
              className
            )}
            {...props}
          />

          {isPasswordType ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {error ? (
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in duration-150">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

