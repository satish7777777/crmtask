"use client";

import React, { useState } from "react";
import { IconEye, IconEyeOff } from "./Icons";

export interface InputBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string | null;
  isValid?: boolean | null;
  validationBadge?: React.ReactNode;
  helperText?: string | React.ReactNode;
  metaText?: string;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
}

export default function InputBox({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  isValid,
  validationBadge,
  helperText,
  metaText,
  showPasswordToggle = false,
  leftIcon,
  containerClassName = "",
  className = "",
  disabled = false,
  ...rest
}: InputBoxProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const effectiveType = showPasswordToggle
    ? isPasswordVisible
      ? "text"
      : "password"
    : type;

  // Determine border and background styles based on validation status
  let borderStyle = "border-slate-200 focus:border-indigo-600 focus:ring-indigo-100";
  if (error) {
    borderStyle = "border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100";
  } else if (isValid === true) {
    borderStyle = "border-emerald-400 bg-emerald-50/20 focus:border-emerald-500 focus:ring-emerald-100";
  } else if (isValid === false) {
    borderStyle = "border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-100";
  }

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {/* Label and Badge Row */}
      {(label || validationBadge) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-xs font-semibold text-slate-700">
              {label}
              {required && <span className="text-rose-500 ml-0.5">*</span>}
            </label>
          )}

          {validationBadge && <div>{validationBadge}</div>}
        </div>
      )}

      {/* Input container */}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          {...rest}
          type={effectiveType}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full py-2.5 rounded-xl text-xs border transition focus:outline-none focus:ring-2 ${
            leftIcon ? "pl-9" : "px-3.5"
          } ${showPasswordToggle ? "pr-10" : "pr-3.5"} ${borderStyle} ${
            disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "text-slate-800"
          } ${className}`}
        />

        {/* Password Show / Hide toggle button */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            tabIndex={-1}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          >
            {isPasswordVisible ? (
              <IconEyeOff className="w-4 h-4" />
            ) : (
              <IconEye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Helper text, Error text, or Meta label below input */}
      {(helperText || error || metaText) && (
        <div className="flex items-center justify-between text-[11px] px-0.5">
          <div>
            {error ? (
              <p className="text-rose-500 font-medium">{error}</p>
            ) : helperText ? (
              <div className="text-slate-500">{helperText}</div>
            ) : null}
          </div>

          {metaText && (
            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
              {metaText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
