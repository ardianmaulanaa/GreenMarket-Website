"use client";

import { animate, motion, useInView, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  delay?: number;
  light?: boolean;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  delay = 0,
  light = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useMotionValueEvent(count, "change", (v) => {
    setDisplay(decimals > 0 ? v.toFixed(decimals) : String(Math.round(v)));
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration: 2.2,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, value, count, delay]);

  const valueClass = light ? "text-[#1a2e1f]" : "text-white";
  const labelClass = light ? "text-[#6b7c71]" : "text-white/55";

  return (
    <motion.div
      ref={ref}
      className="text-center md:text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay * 0.5 }}
    >
      <p className={`text-2xl font-extrabold tracking-tight md:text-3xl ${valueClass}`}>
        {prefix}
        {display}
        {suffix}
      </p>
      <p className={`mt-1.5 text-xs font-medium sm:text-sm ${labelClass}`}>{label}</p>
    </motion.div>
  );
}
