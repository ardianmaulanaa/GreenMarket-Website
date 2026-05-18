"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface InfoCardProps {
  title: string;
  desc: string;
  icon: ReactNode;
  index: number;
  badge: string;
  step: string;
  href: string;
  cta: string;
  variant: "light" | "dark";
  onClick?: () => void;
}

export default function InfoCard({
  title,
  desc,
  icon,
  index,
  badge,
  step,
  href,
  cta,
  variant,
  onClick
}: InfoCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });
  const rotateX = useTransform(springY, [0, 1], [6, -6]);
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
    ref.current.style.setProperty("--ix", `${px}%`);
    ref.current.style.setProperty("--iy", `${py}%`);
  };

  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const isLight = variant === "light";

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-full perspective-[1200px]"
    >
      {/* Gradient border frame */}
      <motion.div
        className={`relative h-full rounded-[28px] p-px md:rounded-[32px] ${
          isLight
            ? "bg-gradient-to-br from-[#2fa84f]/50 via-white/80 to-[#2fa84f]/25 shadow-[0_20px_60px_rgba(47,168,79,0.12)]"
            : "bg-gradient-to-br from-[#2fa84f]/60 via-[#1a1f1b] to-[#0a110b]/90 shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
        }`}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div
          className={`relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[27px] md:min-h-[360px] md:rounded-[31px] ${
            isLight
              ? "bg-white/95 backdrop-blur-2xl"
              : "bg-gradient-to-br from-[#1a1f1b] via-[#141a17] to-[#0f1411]"
          }`}
        >
          {/* Inner glow */}
          <div
            className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-[70px] transition-opacity duration-500 group-hover:opacity-100 ${
              isLight ? "bg-[#2fa84f]/25 opacity-70" : "bg-[#2fa84f]/35 opacity-50"
            }`}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              background:
                "radial-gradient(600px circle at var(--ix,50%) var(--iy,30%), rgba(47,168,79,0.14), transparent 45%)",
            }}
          />

          <motion.div
            className="relative z-10 flex flex-1 flex-col p-8 md:p-10 lg:p-12"
            style={{ transform: "translateZ(20px)" }}
          >
            {/* Top row */}
            <motion.div className="flex items-start justify-between gap-4">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                  isLight
                    ? "border border-[#2fa84f]/20 bg-[#2fa84f]/10 text-[#1a7a35]"
                    : "border border-[#2fa84f]/30 bg-[#2fa84f]/15 text-[#7ee8a0]"
                }`}
              >
                {badge}
              </span>
              <span
                className={`font-mono text-4xl font-extrabold leading-none tracking-tighter md:text-5xl ${
                  isLight ? "text-[#2fa84f]/15" : "text-white/[0.07]"
                }`}
              >
                {step}
              </span>
            </motion.div>

            {/* Icon */}
            <motion.div
              className={`mt-8 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-105 ${
                isLight
                  ? "border-[#2fa84f]/20 bg-gradient-to-br from-[#f1f8e9] to-white text-[#2fa84f] shadow-[0_8px_24px_rgba(47,168,79,0.12)] group-hover:border-[#2fa84f]/40 group-hover:shadow-[0_12px_36px_rgba(47,168,79,0.22)]"
                  : "border-[#2fa84f]/35 bg-[#2fa84f]/10 text-[#7ee8a0] shadow-[0_0_40px_rgba(47,168,79,0.15)] group-hover:bg-[#2fa84f] group-hover:text-white group-hover:shadow-[0_0_50px_rgba(47,168,79,0.4)]"
              }`}
            >
              {icon}
            </motion.div>

            {/* Copy */}
            <h3
              className={`mt-8 text-2xl font-extrabold leading-[1.15] tracking-tight md:text-[1.75rem] lg:text-3xl ${
                isLight ? "text-[#1a2e1f]" : "text-white"
              }`}
            >
              {title}
            </h3>
            <p
              className={`mt-4 max-w-md flex-grow text-[15px] leading-relaxed md:text-base ${
                isLight ? "text-[#6b7c71]" : "text-white/55"
              }`}
            >
              {desc}
            </p>

            {/* Footer */}
            <div className="mt-8 border-t border-dashed border-[#2fa84f]/20 pt-6">
              <Link
                href={href}
                onClick={(e) => {
                  if (onClick) {
                    e.preventDefault();
                    onClick();
                  }
                }}
                className={`inline-flex items-center gap-2 text-sm font-bold no-underline transition ${
                  isLight
                    ? "text-[#2fa84f] hover:text-[#1a7a35]"
                    : "text-[#7ee8a0] hover:text-white"
                }`}
              >
                {cta}
                <motion.span
                  className="inline-block"
                  initial={false}
                  whileHover={{ x: 4 }}
                >
                  →
                </motion.span>
              </Link>
            </div>
          </motion.div>

          {/* Bottom accent line */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
              isLight
                ? "from-transparent via-[#2fa84f]/60 to-transparent"
                : "from-transparent via-[#2fa84f] to-transparent"
            }`}
          />
        </div>
      </motion.div>
    </motion.article>
  );
}
