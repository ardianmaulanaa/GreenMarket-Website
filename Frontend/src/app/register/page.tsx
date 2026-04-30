"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    terms: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
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
    }
  };

  return (
    // Background perpaduan Hijau ke Hitam (Linear Gradient)
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/20 to-[#0a110b] font-sans m-0 overflow-hidden relative">
      
      {/* Dekorasi Glow Hijau agar transisi ke gelap lebih halus */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] bg-[#2fa84f] opacity-20 blur-[100px] rounded-full"></div>

      {/* TOMBOL KEMBALI */}
      <Link
        href="/"
        className="absolute top-[30px] left-[30px] flex items-center gap-2 text-[#1a2e1f] no-underline text-sm font-semibold px-5 py-2.5 rounded-[50px] bg-white/60 backdrop-blur-md border border-white/20 hover:text-[#2fa84f] hover:bg-white transition-all duration-300 shadow-sm z-20"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Beranda
      </Link>

      {/* CARD REGISTER (Semi-Transparan Gelap) */}
      <div className="bg-[#1a1f1b]/95 backdrop-blur-xl p-[45px] rounded-[32px] w-full max-w-[480px] shadow-[0_30px_100px_rgba(0,0,0,0.4)] text-center border border-white/10 relative z-10">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 no-underline justify-center mb-8 group">
          <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_4px_12px_rgba(47,168,79,0.4)] group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/>
            </svg>
          </div>
          <span className="text-[20px] font-[800] text-white tracking-[-0.5px]">
            GreenMarket
          </span>
        </Link>

        <h1 className="text-[26px] font-bold text-white mb-2 tracking-tight">
          Buat Akun Baru
        </h1>
        
        <p className="text-sm text-gray-400 mb-[35px]">
          Mari mulai langkah kecil untuk bumi yang lebih baik.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col text-left space-y-4">
          
          {/* USERNAME */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[1px] mb-1.5 block ml-1">
              username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Masukkan username unik"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-white/10 rounded-[14px] h-[52px] px-4 bg-white/5 text-white text-sm focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] outline-none transition-all placeholder:text-gray-600"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[1px] mb-1.5 block ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-white/10 rounded-[14px] h-[52px] px-4 bg-white/5 text-white text-sm focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] outline-none transition-all placeholder:text-gray-600"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[1px] mb-1.5 block ml-1">
              Kata Sandi
            </label>
            <input
              name="password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-white/10 rounded-[14px] h-[52px] px-4 bg-white/5 text-white text-sm focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] outline-none transition-all placeholder:text-gray-600"
              required
            />
          </div>

          {/* TERMS & CONDITIONS */}
          <div className="flex gap-3 items-start p-1 text-left">
            <input
              name="terms"
              type="checkbox"
              checked={form.terms}
              onChange={handleChange}
              className="w-5 h-5 accent-[#2fa84f] mt-0.5 cursor-pointer rounded-lg"
              required
            />
            <p className="text-[12px] text-gray-400 m-0 leading-[1.6]">
              Saya setuju dengan{" "}
              <Link href="#" className="text-[#2fa84f] font-bold no-underline hover:underline">Syarat & Ketentuan</Link>{" "}
              serta Kebijakan Privasi.
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-[#2fa84f] text-white py-[16px] rounded-[14px] font-bold text-[16px] w-full transition-all duration-300 hover:bg-[#268c41] hover:-translate-y-[2px] hover:shadow-[0_10px_25px_rgba(47,168,79,0.4)] active:scale-[0.98] mt-2"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-[30px] text-sm text-gray-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#2fa84f] font-[800] no-underline hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}