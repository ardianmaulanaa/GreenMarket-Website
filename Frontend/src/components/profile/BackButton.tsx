"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = "Kembali" }: BackButtonProps) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
      <Link
        href={href}
        className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/75 no-underline backdrop-blur-md transition-all hover:border-[#2fa84f]/35 hover:bg-white/10 hover:text-white hover:shadow-[0_0_24px_rgba(47,168,79,0.2)] sm:px-4 sm:py-2.5 sm:text-sm"
      >
        <motion.span
          className="inline-flex text-[#2fa84f]"
          initial={false}
          whileHover={{ x: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </motion.span>
        <span className="hidden sm:inline">{label}</span>
      </Link>
    </motion.div>
  );
}
