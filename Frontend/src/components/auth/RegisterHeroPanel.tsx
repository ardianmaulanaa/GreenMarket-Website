"use client";

import { AUTH_FORM_EDGE, HERO_EDGE_BLEND_STYLE } from "@/components/auth/auth-gradients";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop";

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/50"
          style={{
            left: `${(i * 23) % 100}%`,
            top: `${(i * 31 + 10) % 100}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.15, 0.6, 0.15] }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

export default function RegisterHeroPanel() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="relative hidden min-h-full overflow-hidden lg:block lg:w-1/2">
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${HERO_IMAGE}')`,
          x: mouse.x * -16,
          y: mouse.y * -10,
          scale: 1.08,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-[#0a110b]/40 via-transparent to-[#0a110b]/25" />

      <div className="absolute inset-0 z-[6]" style={HERO_EDGE_BLEND_STYLE} aria-hidden />

      <motion.div
        className="pointer-events-none absolute inset-y-0 -right-px z-[7] w-px"
        style={{ backgroundColor: AUTH_FORM_EDGE }}
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute -left-20 top-1/4 z-[2] h-80 w-80 rounded-full bg-[#2fa84f]/30 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-1/4 right-1/4 z-[2] h-64 w-64 rounded-full bg-[#2fa84f]/20 blur-[80px]"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <Particles />

      <motion.div
        className="absolute bottom-16 left-10 z-20 max-w-lg pr-8 md:left-14 md:bottom-20 lg:pr-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl xl:text-[2.75rem]">
          Masa Depan Bumi{" "}
          <span className="gradient-text-shine">Ada di Tangan Kita</span>
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-white/75 md:text-base">
          Bergabunglah dengan ribuan pengguna dalam membangun ekosistem perdagangan
          yang ramah lingkungan.
        </p>
      </motion.div>
    </div>
  );
}
