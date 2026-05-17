"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useSpring(0, { stiffness: 380, damping: 28 });
  const y = useSpring(0, { stiffness: 380, damping: 28 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;

    const move = (e: MouseEvent) => {
      setVisible(true);
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const hide = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden -translate-x-1/2 -translate-y-1/2 md:block"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.4 }}
    >
      <motion.div
        className="h-9 w-9 rounded-full border border-[#2fa84f]/50 bg-[#2fa84f]/10"
        animate={{
          boxShadow: [
            "0 0 16px rgba(47,168,79,0.25)",
            "0 0 32px rgba(47,168,79,0.45)",
            "0 0 16px rgba(47,168,79,0.25)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </motion.div>
  );
}
