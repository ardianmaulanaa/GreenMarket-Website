"use client";

import { AUTH_FORM_EDGE, HERO_EDGE_BLEND_STYLE } from "@/components/auth/auth-gradients";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOGIN_IMAGE =
  "https://images.unsplash.com/photo-1536882240095-0379873feb4e?q=80&w=1200&auto=format&fit=crop";

function Particles() {
  return (
    <motion.div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden>
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/45"
          style={{
            left: `${(i * 21) % 100}%`,
            top: `${(i * 29 + 8) % 100}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.12, 0.55, 0.12] }}
          transition={{
            duration: 4.5 + (i % 5),
            repeat: Infinity,
            delay: i * 0.18,
          }}
        />
      ))}
    </motion.div>
  );
}

export default function LoginHeroPanel() {
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
    <motion.div className="relative hidden min-h-full overflow-hidden lg:block lg:w-1/2">
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url('${LOGIN_IMAGE}')`,
          x: mouse.x * -14,
          y: mouse.y * -8,
          scale: 1.06,
        }}
      />

      {/* Base tint — tidak terlalu gelap di kiri */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a110b]/40 via-transparent to-[#0a110b]/25" />

      {/* Gradasi kanan→kiri full-panel (halus, tidak patah) */}
      <motion.div
        className="absolute inset-0 z-[6]"
        style={HERO_EDGE_BLEND_STYLE}
        aria-hidden
      />

      {/* Samarkan garis vertikal dengan panel form */}
      <div
        className="pointer-events-none absolute inset-y-0 -right-px z-[7] w-px"
        style={{ backgroundColor: AUTH_FORM_EDGE }}
        aria-hidden
      />

      <motion.div
        className="absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_25%_75%,rgba(47,168,79,0.14),transparent_50%)]"
        style={{ x: mouse.x * 8, y: mouse.y * 6 }}
      />

      <motion.div
        className="pointer-events-none absolute -left-16 top-[20%] z-[2] h-72 w-72 rounded-full bg-[#2fa84f]/28 blur-[90px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-[30%] right-[20%] z-[2] h-56 w-56 rounded-full bg-[#2fa84f]/18 blur-[70px]"
        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <Particles />

      <motion.div
        className="absolute bottom-16 left-10 z-20 max-w-lg pr-8 md:left-14 md:bottom-20 lg:pr-16"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.25 }}
      >
        <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-lg md:text-4xl xl:text-[2.65rem]">
          Masa Depan Bumi{" "}
          <span className="gradient-text-shine">Ada di Tangan Kita</span>
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 md:text-base">
          Bergabunglah dalam ekosistem perdagangan ramah lingkungan yang lebih
          berkelanjutan.
        </p>
      </motion.div>
    </motion.div>
  );
}
