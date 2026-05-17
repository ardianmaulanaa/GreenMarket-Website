"use client";

import FloatingInput from "@/components/auth/FloatingInput";
import RegisterHeroPanel from "@/components/auth/RegisterHeroPanel";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

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
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative mb-6 h-14 w-14"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <motion.div className="absolute inset-0 rounded-full border-4 border-[#2fa84f]/20" />
        <motion.div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2fa84f]" />
        <motion.div
          className="absolute inset-2 rounded-full bg-[#2fa84f]/20 blur-md"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      <motion.p
        className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#2fa84f]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Menyiapkan Ekosistem...
      </motion.p>
    </motion.div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 900);
    return () => clearTimeout(timer);
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
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registrasi Berhasil! Silakan Login.");
        router.push("/login");
      } else {
        alert(data.message || "Terjadi kesalahan saat mendaftar");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Gagal terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#111815] via-[#1a1f1b] to-[#0a110b] font-sans lg:flex-row">
      {/* Ambient glow — right panel */}
      <motion.div
        className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#2fa84f]/15 blur-[120px]"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#2fa84f]/10 blur-[100px]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <RegisterHeroPanel />

      {/* Mobile hero strip */}
      <motion.div
        className="relative flex min-h-[200px] items-end overflow-hidden p-6 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111815] via-[#0a110b]/80 to-[#0a110b]/40" />
        <p className="relative z-10 text-lg font-extrabold leading-snug text-white">
          Masa Depan Bumi{" "}
          <span className="text-[#2fa84f]">Ada di Tangan Kita</span>
        </p>
      </motion.div>

      {/* Form side — menyatu dengan gradasi hero */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center bg-[#111815] px-5 py-10 lg:w-1/2 lg:bg-gradient-to-br lg:from-[#111815] lg:via-[#1a1f1b] lg:to-[#0a110b] lg:px-10 lg:py-12 lg:shadow-[-56px_0_72px_28px_#111815]">
        <div
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
          className="relative w-full max-w-[440px]"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Glass card */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-10"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#2fa84f]/20 blur-[70px]" />
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[32px]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(47,168,79,0.05) 100%)",
              }}
            />

            <motion.div variants={fadeUp} custom={1} className="relative z-10 mb-8 flex justify-center">
              <Link href="/" className="flex items-center gap-2.5 no-underline">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] shadow-[0_4px_20px_rgba(47,168,79,0.4)]"
                  whileHover={{ scale: 1.06, rotate: 3 }}
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
                Buat Akun Baru
              </h1>
              <p className="mt-2 text-sm text-white/50">
                Mari mulai aksi hijau Anda dari sini
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              <FloatingInput
                id="username"
                name="username"
                label="Username"
                value={form.username}
                onChange={handleChange}
                required
                index={0}
              />
              <FloatingInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                required
                index={1}
              />
              <FloatingInput
                id="password"
                name="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                required
                showToggle
                index={2}
              />
              <FloatingInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                showToggle
                index={3}
              />

              <motion.div
                variants={fadeUp}
                custom={5}
                className="flex items-start gap-3 pt-1"
              >
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange}
                  required
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-white/5 accent-[#2fa84f]"
                />
                <label htmlFor="terms" className="cursor-pointer text-xs leading-relaxed text-white/50">
                  Saya setuju dengan{" "}
                  <Link href="#" className="font-semibold text-[#2fa84f] no-underline hover:text-[#7ee8a0]">
                    Syarat & Ketentuan
                  </Link>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                variants={fadeUp}
                custom={6}
                whileHover={!isSubmitting ? { y: -3, scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="relative mt-2 w-full overflow-hidden rounded-2xl bg-[#2fa84f] py-4 text-sm font-bold text-white shadow-[0_8px_32px_rgba(47,168,79,0.4)] transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={isSubmitting ? {} : { x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.span
                        className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      Mendaftar...
                    </>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </span>
              </motion.button>
            </form>

            <motion.div
              variants={fadeUp}
              custom={7}
              className="relative z-10 mt-8 border-t border-white/10 pt-6 text-center"
            >
              <p className="text-sm text-white/45">
                Sudah punya akun?{" "}
                <Link href="/login" className="font-bold text-[#2fa84f] no-underline hover:text-[#7ee8a0]">
                  Masuk di sini
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
