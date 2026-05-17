"use client";

import { motion } from "framer-motion";

interface FloatingBlobsProps {
  variant?: "hero" | "light";
}

export default function FloatingBlobs({ variant = "hero" }: FloatingBlobsProps) {
  const opacity = variant === "hero" ? "opacity-100" : "opacity-70";

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${opacity}`}
      aria-hidden
    >
      <motion.div
        className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#2fa84f]/30 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-[#2fa84f]/20 blur-[110px]"
        animate={{ x: [0, -25, 0], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      {variant === "light" && (
        <motion.div
          className="absolute bottom-0 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-[#a8e6b0]/40 blur-[90px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}
