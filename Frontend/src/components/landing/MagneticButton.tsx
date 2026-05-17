"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "secondary-light";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  showArrow?: boolean;
  className?: string;
}

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  showArrow = false,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 22 });
  const springY = useSpring(y, { stiffness: 280, damping: 22 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const styles: Record<Variant, string> = {
    primary:
      "bg-[#2fa84f] text-white shadow-[0_8px_32px_rgba(47,168,79,0.4)] hover:bg-[#268c41] hover:shadow-[0_12px_48px_rgba(47,168,79,0.55)]",
    secondary:
      "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/40 hover:bg-white/20",
    "secondary-light":
      "border border-[#1a2e1f]/12 bg-white/70 text-[#1a2e1f] backdrop-blur-md hover:border-[#2fa84f]/35 hover:bg-white hover:shadow-[0_8px_30px_rgba(47,168,79,0.12)]",
  };

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-sm font-bold no-underline transition-all duration-300 hover:-translate-y-0.5 md:px-10 md:text-base ${styles[variant]} ${className}`}
      >
        {variant === "primary" && (
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
          {showArrow && (
            <motion.span
              className="inline-block"
              initial={false}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              →
            </motion.span>
          )}
        </span>
      </Link>
    </motion.div>
  );
}
