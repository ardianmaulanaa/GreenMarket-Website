"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ParticlesOverlayProps {
  tone?: "light" | "dark";
}

export default function ParticlesOverlay({ tone = "dark" }: ParticlesOverlayProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 19) % 100}%`,
        top: `${(i * 27 + 7) % 100}%`,
        size: 1.5 + (i % 3) * 0.5,
        duration: 5 + (i % 6),
        delay: (i % 7) * 0.35,
      })),
    []
  );

  const color = tone === "dark" ? "bg-white/60" : "bg-[#2fa84f]/50";
  const shadow =
    tone === "dark"
      ? "0 0 10px rgba(255,255,255,0.4)"
      : "0 0 10px rgba(47,168,79,0.5)";

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute rounded-full ${color}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            boxShadow: shadow,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: tone === "dark" ? [0.1, 0.5, 0.1] : [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}
