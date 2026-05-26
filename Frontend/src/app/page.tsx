"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import AnimatedCounter from "@/components/landing/AnimatedCounter";
import CategoryCard from "@/components/landing/CategoryCard";
import FloatingBlobs from "@/components/landing/FloatingBlobs";
import InfoCard from "@/components/landing/InfoCard";
import ParticlesOverlay from "@/components/landing/ParticlesOverlay";
import Nav from "@/components/navbar";

import { useToast } from "@/hooks/useToast";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.09,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const categories = [
  {
    name: "Elektronik",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12m16 0a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2m16 0V4M4 16v-12M8 20h8M12 17v3" />
      </svg>
    ),
  },
  {
    name: "Fashion",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    name: "DIY",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m14.7 6.3 5 5" />
        <path d="m3.1 20.9 7.4-7.4" />
        <path d="m16.4 4.6 2.8 2.8a1 1 0 0 1 0 1.4l-6.2 6.2a1 1 0 0 1-1.4 0l-2.8-2.8a1 1 0 0 1 0-1.4l6.2-6.2a1 1 0 0 1 1.4 0Z" />
      </svg>
    ),
  },
  {
    name: "Sepeda",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="18.5" cy="17.5" r="3.5" />
        <circle cx="5.5" cy="17.5" r="3.5" />
        <path d="M15 17.5V11l-3-3 3-3" />
        <path d="M5.5 17.5 12 11" />
      </svg>
    ),
  },
  {
    name: "Lainnya",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  },
];

function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-72px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
    >
      {children}
    </motion.div>
  );
}

function GradientHighlight({ children }: { children: string }) {
  return <span className="gradient-text-shine">{children}</span>;
}

export default function LandingPage() {
  const { showToast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroBottomFade = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  const handleGuestAccess = async () => {
    if (isGuestLoading) return;

    setIsGuestLoading(true);

    try {
      const rememberedEmail = localStorage.getItem("rememberedEmail");

      localStorage.clear();

      if (rememberedEmail) {
        localStorage.setItem("rememberedEmail", rememberedEmail);
      }

      const response = await fetch("http://localhost:5050/guest", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.user) {
        showToast(data.message || "Gagal masuk sebagai guest.", "error");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userId", String(data.user.id));
      localStorage.setItem("userRole", data.user.role);

      router.push("/dashboard-buyer");
    } catch (error) {
      console.error("Guest access error:", error);
      showToast("Gagal terhubung ke server. Periksa koneksi internet Anda.", "error");
    } finally {
      setIsGuestLoading(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      setMouse({ x: nx, y: ny });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="relative overflow-x-hidden bg-[#f4f9f0] text-[#1a2e1f]">
      <motion.header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "border-b border-white/20 bg-white/70 shadow-[0_8px_32px_rgba(10,17,11,0.08)] backdrop-blur-2xl"
            : "bg-white/5 backdrop-blur-md"
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Nav
          variant="home"
          scrolled={scrolled}
          handleGuestAccess={handleGuestAccess}
          isGuestLoading={isGuestLoading}
        />
      </motion.header>

      <section ref={heroRef} className="relative min-h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            scale: bgScale,
            y: bgY,
            x: mouse.x * -18,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-br from-[#0a110b]/75 via-[#111815]/55 to-[#1a1f1b]/65" />

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#f4f9f0] via-transparent to-[#0a110b]/30"
          style={{ opacity: heroBottomFade }}
        />

        <FloatingBlobs variant="hero" />
        <ParticlesOverlay tone="dark" />

        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(47,168,79,0.18),transparent_55%)]"
          style={{ x: mouse.x * 24, y: mouse.y * 16 }}
        />

        <motion.div
          className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-24 pt-28 md:px-10 md:pt-32"
          style={{ y: heroContentY, opacity: heroOpacity }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2fa84f]" />
              Marketplace Ramah Lingkungan
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            >
              Barang lama, <br />
              <GradientHighlight>cerita baru.</GradientHighlight>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
            >
              Bantu selamatkan bumi dengan memberikan nafas kedua bagi barang
              tak terpakai Anda.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.button
                type="button"
                onClick={handleGuestAccess}
                disabled={isGuestLoading}
                whileHover={!isGuestLoading ? { y: -3, scale: 1.02 } : {}}
                whileTap={!isGuestLoading ? { scale: 0.97 } : {}}
                className="inline-flex items-center justify-center rounded-2xl bg-[#2fa84f] px-7 py-4 text-sm font-bold text-white shadow-[0_8px_32px_rgba(47,168,79,0.42)] transition hover:bg-[#268c41] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGuestLoading ? "Memproses..." : "Mulai Jelajahi Produk"}
                <span className="ml-2">→</span>
              </motion.button>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white no-underline backdrop-blur-md transition hover:border-white/40 hover:bg-white/15"
              >
                Daftar Gratis
                <span className="ml-2">→</span>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-14 grid grid-cols-1 gap-6 border-t border-white/15 pt-10 sm:grid-cols-3 sm:gap-8"
            >
              <AnimatedCounter
                value={50}
                suffix="K+"
                label="Produk Daur Ulang"
              />
              <AnimatedCounter
                value={12}
                suffix="K+"
                label="Pengguna Aktif"
                delay={0.1}
              />
              <AnimatedCounter
                value={98}
                suffix="%"
                label="Kepuasan Hijau"
                delay={0.2}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-10 w-6 rounded-full border border-white/30 p-1 backdrop-blur-sm">
            <motion.div
              className="mx-auto h-2 w-1 rounded-full bg-[#2fa84f]"
              animate={{ y: [0, 10, 0], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#f4f9f0] via-white to-[#f1f8e9] px-5 py-20 md:px-10 md:py-28">
        <FloatingBlobs variant="light" />
        <ParticlesOverlay tone="light" />

        <SectionReveal className="relative z-10 mx-auto max-w-6xl">
          <motion.div variants={fadeUp} custom={0} className="text-center">
            <span className="inline-block rounded-full border border-[#2fa84f]/20 bg-white/80 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#2fa84f] backdrop-blur-sm">
              Kategori Pilihan
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#1a2e1f] md:text-4xl lg:text-5xl">
              Telusuri Kebutuhan Hijaumu
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-[#6b7c71]">
              Temukan barang bekas berkualitas di kategori favoritmu.
            </p>
          </motion.div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.name}
                name={cat.name}
                icon={cat.icon}
                index={i}
              />
            ))}
          </div>
        </SectionReveal>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-[#f1f8e9] via-white to-[#eef6ea] px-5 py-20 md:px-10 md:py-28">
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(47,168,79,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(47,168,79,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <FloatingBlobs variant="light" />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[#2fa84f]/40 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />

        <SectionReveal className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mx-auto mb-14 max-w-2xl text-center md:mb-16"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2fa84f]/20 bg-white/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#2fa84f] backdrop-blur-sm">
              <span className="h-1 w-1 rounded-full bg-[#2fa84f]" />
              Mengapa GreenMarket
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#1a2e1f] md:text-4xl lg:text-[2.75rem]">
              Lebih dari sekadar jual beli
            </h2>

            <p className="mt-4 text-base text-[#6b7c71] md:text-lg">
              Dua cara GreenMarket membantu kamu dan planet—dengan pengalaman
              yang terasa premium dari awal.
            </p>
          </motion.div>

          <motion.div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
            <InfoCard
              index={0}
              variant="light"
              step="01"
              badge="GreenJualan"
              title="Ubah barang lama Anda jadi berkah"
              desc="Daftarkan barang tak terpakai dalam hitungan menit dan temukan pembeli yang peduli lingkungan."
              href="/register"
              cta="Mulai berjualan"
              icon={
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z" />
                  <path d="M19 2v10" />
                </svg>
              }
            />

            <motion.button
              type="button"
              onClick={handleGuestAccess}
              disabled={isGuestLoading}
              variants={fadeUp}
              custom={1}
              whileHover={!isGuestLoading ? { y: -8, scale: 1.01 } : {}}
              whileTap={!isGuestLoading ? { scale: 0.98 } : {}}
              className="group relative min-h-[360px] overflow-hidden rounded-[32px] border border-white/10 bg-[#111815] p-8 text-left shadow-[0_24px_80px_rgba(10,17,11,0.25)] transition disabled:cursor-not-allowed disabled:opacity-70 md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(47,168,79,0.25),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%,rgba(47,168,79,0.12))]" />
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#2fa84f]/25 blur-[70px]" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="rounded-full border border-[#2fa84f]/30 bg-[#2fa84f]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7ee8a0]">
                      EcoTransact
                    </span>
                    <span className="text-sm font-black text-white/25">02</span>
                  </div>

                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2fa84f]/15 text-[#7ee8a0] shadow-[0_12px_40px_rgba(47,168,79,0.22)]">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white md:text-3xl">
                    Transaksi lebih hijau dan berkelanjutan
                  </h3>

                  <p className="mt-5 text-sm leading-relaxed text-white/55 md:text-base">
                    Setiap transaksi mendukung ekonomi sirkular dan mengurangi
                    limbah yang mencemari bumi.
                  </p>
                </div>

                <div className="mt-8 inline-flex items-center text-sm font-bold text-[#7ee8a0]">
                  {isGuestLoading ? "Memproses..." : "Jelajahi produk"}
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </SectionReveal>
      </section>

      <section className="relative bg-[#f1f8e9] px-5 py-16 md:px-10 md:py-24">
        <SectionReveal className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#1a1f1b] px-8 py-14 text-center shadow-[0_24px_80px_rgba(10,17,11,0.25)] md:rounded-[44px] md:px-16 md:py-20"
          >
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 25% 50%, rgba(47,168,79,0.2), transparent 55%)",
                  "radial-gradient(circle at 75% 50%, rgba(47,168,79,0.28), transparent 55%)",
                  "radial-gradient(circle at 25% 50%, rgba(47,168,79,0.2), transparent 55%)",
                ],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#2fa84f]/25 blur-[80px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 6, repeat: Infinity }}
            />

            <h2 className="relative text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
              Daftar sekarang untuk <br className="hidden sm:block" />
              membantu mencintai bumi
            </h2>

            <p className="relative mx-auto my-8 max-w-2xl text-base text-white/50 md:my-10 md:text-lg">
              Mulai langkah kecil untuk bumi yang lebih baik bersama jutaan
              pahlawan bumi lainnya.
            </p>

            <Link
              href="/register"
              className="relative inline-flex items-center justify-center rounded-2xl bg-[#2fa84f] px-7 py-4 text-sm font-bold text-white no-underline shadow-[0_8px_32px_rgba(47,168,79,0.42)] transition hover:bg-[#268c41]"
            >
              Mulai Sekarang Gratis
              <span className="ml-2">→</span>
            </Link>
          </motion.div>
        </SectionReveal>
      </section>

      <footer className="border-t border-white/10 bg-[#0a110b] px-5 py-16 text-white md:px-10 md:py-20">
        <motion.div
          className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2fa84f] to-[#1a7a35]">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z" />
                </svg>
              </div>

              <span className="text-lg font-extrabold">GreenMarket</span>
            </motion.div>

            <p className="max-w-sm text-sm leading-relaxed text-white/45">
              Solusi ramah lingkungan untuk masa depan. Menghubungkan barang
              berkualitas dengan pemilik baru yang peduli bumi.
            </p>
          </div>

          <div>
            <h6 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2fa84f]">
              Newsletter
            </h6>

            <div className="flex max-w-md overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
              <input
                type="email"
                placeholder="Email Anda"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
              />

              <motion.button
                className="shrink-0 bg-[#2fa84f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#268c41]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Kirim
              </motion.button>
            </div>

            <p className="mt-6 text-[11px] font-semibold tracking-widest text-white/25">
              © 2026 GREENMARKET INC.
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
