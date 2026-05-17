"use client";

import { motion } from "framer-motion";

interface RoleBadgeProps {
  role: string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const normalized = role?.trim().toUpperCase();
  const isSeller = normalized === "SELLER";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
        isSeller
          ? "border border-[#2fa84f]/40 bg-[#2fa84f]/15 text-[#7ee8a0] shadow-[0_0_20px_rgba(47,168,79,0.2)]"
          : "border border-[#3db89a]/40 bg-[#2a6b5c]/25 text-[#8ee4cf] shadow-[0_0_20px_rgba(61,184,154,0.15)]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isSeller ? "bg-[#2fa84f]" : "bg-[#3db89a]"}`}
      />
      {normalized || "BUYER"}
    </motion.span>
  );
}
