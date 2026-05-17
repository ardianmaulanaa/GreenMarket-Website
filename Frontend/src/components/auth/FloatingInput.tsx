"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FloatingInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  showToggle?: boolean;
  index?: number;
  autoComplete?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export default function FloatingInput({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  required,
  showToggle = false,
  index = 0,
  autoComplete,
  readOnly = false,
  placeholder,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const active = focused || value.length > 0;
  const inputType = showToggle ? (visible ? "text" : "password") : type;
  // Hindari label floating + placeholder bersamaan saat kosong
  const showPlaceholder = Boolean(placeholder && active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.07 }}
      className="relative"
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border bg-[#111815]/60 backdrop-blur-md transition-colors duration-300"
        animate={{
          borderColor: readOnly
            ? "rgba(255,255,255,0.06)"
            : focused
              ? "rgba(47,168,79,0.65)"
              : "rgba(255,255,255,0.1)",
          boxShadow:
            !readOnly && focused
              ? "0 0 0 1px rgba(47,168,79,0.35), 0 0 28px rgba(47,168,79,0.15)"
              : "0 0 0 0px transparent",
        }}
      >
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-5 z-10 transition-all duration-300 ${
            active
              ? "top-2.5 text-[10px] font-bold uppercase tracking-wider text-[#2fa84f]"
              : "top-1/2 -translate-y-1/2 text-sm text-white/40"
          }`}
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => !readOnly && setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          readOnly={readOnly}
          placeholder={showPlaceholder ? placeholder : ""}
          className={`w-full border-0 bg-transparent pb-3.5 pl-5 pr-12 pt-7 text-sm outline-none ${
            readOnly ? "cursor-not-allowed text-white/45" : "text-white"
          }`}
          autoComplete={
            autoComplete ??
            (name === "password" || name === "confirmPassword"
              ? "new-password"
              : name === "email"
                ? "email"
                : "username")
          }
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-lg p-1.5 text-white/40 transition hover:bg-white/5 hover:text-[#2fa84f]"
            aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          >
            {visible ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-[#2fa84f] to-[#7ee8a0]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        />
      </motion.div>
    </motion.div>
  );
}
