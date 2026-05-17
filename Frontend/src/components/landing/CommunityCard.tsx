"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CommunityCardProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  desc: string;
  index: number;
}

export default function CommunityCard({
  icon,
  badge,
  title,
  desc,
  index,
}: CommunityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.12 }}
      className="group relative h-full"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ y: -14, scale: 1.015 }}
        className="relative h-full"
      >
        <motion.div className="absolute -inset-px rounded-[36px] bg-gradient-to-br from-[#2fa84f]/25 via-transparent to-transparent opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
        <motion.div className="relative h-full overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#0c120e]/85 p-10 backdrop-blur-2xl md:rounded-[40px] md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#2fa84f]/10 blur-[60px]" />
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2fa84f]/25 bg-[#2fa84f]/10 text-[#2fa84f] transition-all duration-300 group-hover:border-[#2fa84f]/50 group-hover:bg-[#2fa84f] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(47,168,79,0.4)]">
            {icon}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2fa84f]">
            {badge}
          </p>
          <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-white md:text-3xl">
            {title}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-white/45">{desc}</p>
          <Link
            href="/login"
            className="group/link mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#2fa84f] no-underline transition hover:text-[#7ee8a0]"
          >
            Gabung Sekarang
            <span className="transition-transform group-hover/link:translate-x-2">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
