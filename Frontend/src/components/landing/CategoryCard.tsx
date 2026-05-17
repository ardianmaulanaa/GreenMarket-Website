"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CategoryCardProps {
  name: string;
  icon: ReactNode;
  index: number;
}

export default function CategoryCard({ name, icon, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="group relative cursor-pointer"
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#2fa84f]/0 via-[#2fa84f]/0 to-[#2fa84f]/0 opacity-0 blur-md transition-opacity duration-500 group-hover:from-[#2fa84f]/30 group-hover:via-[#2fa84f]/10 group-hover:to-transparent group-hover:opacity-100" />
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/55 p-8 text-center shadow-[0_8px_40px_rgba(26,46,31,0.08)] backdrop-blur-xl transition-shadow duration-500 group-hover:border-[#2fa84f]/35 group-hover:shadow-[0_20px_50px_rgba(47,168,79,0.18)] sm:p-10"
        whileHover={{ scale: 1.01 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-[#f1f8e9]/30" />
        <motion.div
          className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2fa84f]/15 bg-[#2fa84f]/10 text-[#2fa84f] transition-all duration-300 group-hover:border-[#2fa84f]/40 group-hover:bg-[#2fa84f] group-hover:text-white group-hover:shadow-[0_0_28px_rgba(47,168,79,0.35)]"
          whileHover={{ rotate: [0, -6, 6, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h5 className="relative z-10 text-sm font-bold text-[#1a2e1f] sm:text-[15px]">{name}</h5>
      </motion.div>
    </motion.div>
  );
}
