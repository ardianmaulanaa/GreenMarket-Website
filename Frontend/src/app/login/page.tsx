"use client";

import FloatingInput from "@/components/auth/FloatingInput";
import LoginHeroPanel from "@/components/auth/LoginHeroPanel";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

interface LoginResponse {
  message?: string;
  user?: {
    id: number | string;
    username?: string;
    email?: string;
    role: "ADMIN" | "SELLER" | "BUYER" | string;
  };
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function LoadingScreen() {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-[#0a110b]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative mb-6 h-14 w-14"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-[#2fa84f]/20" />
        <motion.div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2fa84f]" />
      </motion.div>
      <motion.p
        className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#2fa84f]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Menghubungkan...
      </motion.p>
    </motion.div>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) {
      setForm((prev) => ({ ...prev, email: saved, rememberMe: true }));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.clear();

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (response.ok && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", String(data.user.id));
        localStorage.setItem("userRole", data.user.role);

        if (form.rememberMe) {
          localStorage.setItem("rememberedEmail", form.email);
        }

        alert("Login Berhasil! Selamat datang kembali.");

        if (data.user.role === "ADMIN") {
          router.push("/admin-panel");
        } else if (data.user.role === "SELLER") {
          router.push("/dashboard-seller");
        } else if (data.user.role === "BUYER") {
          router.push("/dashboard-buyer");
        }
      } else {
        alert(data.message || "Login Gagal");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Gagal terhubung ke server. Pastikan Backend jalan di port 5050");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#111815] via-[#1a1f1b] to-[#0a110b] font-sans lg:flex-row">
      <motion.div
        className="pointer-events-none absolute -right-24 top-0 h-[480px] w-[480px] rounded-full bg-[#2fa84f]/12 blur-[120px]"
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <LoginHeroPanel />

      {/* Mobile hero */}
      <motion.div
        className="relative flex min-h-[180px] items-end overflow-hidden p-6 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1536882240095-0379873feb4e?q=80&w=1200&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111815] via-[#0a110b]/85 to-[#0a110b]/50" />
        <p className="relative z-10 text-lg font-extrabold leading-snug text-white">
          Masa Depan Bumi{" "}
          <span className="text-[#2fa84f]">Ada di Tangan Kita</span>
        </p>
      </motion.div>

      {/* Form panel — warna & shadow menyatu dengan gradasi hero */}
      <motion.div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center bg-[#111815] px-5 py-10 lg:w-1/2 lg:bg-gradient-to-br lg:from-[#111815] lg:via-[#1a1f1b] lg:to-[#0a110b] lg:px-10 lg:py-12 lg:shadow-[-56px_0_72px_28px_#111815]">
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-28 bg-gradient-to-r from-[#111815] via-[#111815]/80 to-transparent lg:block"
          aria-hidden
        />
        <Link
          href="/"
          className="absolute left-5 top-6 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 no-underline backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white lg:left-8 lg:top-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali
        </Link>

        <motion.div
          className="w-full max-w-[440px]"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#2fa84f]/20 blur-[60px]" />
            <div
              className="pointer-events-none absolute inset-0 rounded-[32px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 45%, rgba(47,168,79,0.06) 100%)",
              }}
            />

            <motion.div variants={fadeUp} custom={1} className="relative z-10 mb-8 flex justify-center">
              <Link href="/" className="flex items-center gap-2.5 no-underline">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] shadow-[0_4px_20px_rgba(47,168,79,0.4)]"
                  whileHover={{ scale: 1.06 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z" />
                  </svg>
                </motion.div>
                <span className="text-xl font-extrabold tracking-tight text-white">GreenMarket</span>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} custom={2} className="relative z-10 mb-8 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Selamat Datang Kembali
              </h1>
              <p className="mt-2 text-sm text-white/50">Lanjutkan aksi hijau Anda</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              <FloatingInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                index={0}
              />
              <FloatingInput
                id="password"
                name="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                required
                showToggle
                autoComplete="current-password"
                index={1}
              />

              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex items-center justify-between gap-3 pt-1"
              >
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/5 accent-[#2fa84f]"
                  />
                  <span className="text-xs font-medium text-white/55">Remember Me</span>
                </label>
                <Link
                  href="#"
                  className="text-xs font-semibold text-[#2fa84f] no-underline transition hover:text-[#7ee8a0]"
                >
                  Lupa Password
                </Link>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                variants={fadeUp}
                custom={4}
                whileHover={!isSubmitting ? { y: -3, scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="relative mt-1 w-full overflow-hidden rounded-2xl bg-[#2fa84f] py-4 text-sm font-bold text-white shadow-[0_8px_32px_rgba(47,168,79,0.4)] transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={isSubmitting ? {} : { x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.2 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.span
                        className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Memproses...
                    </>
                  ) : (
                    "Masuk Sekarang"
                  )}
                </span>
              </motion.button>
            </form>

            <motion.div
              variants={fadeUp}
              custom={5}
              className="relative z-10 mt-8 border-t border-white/10 pt-6 text-center"
            >
              <p className="text-sm text-white/45">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#2fa84f] no-underline hover:text-[#7ee8a0]"
                >
                  Daftar Gratis
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
