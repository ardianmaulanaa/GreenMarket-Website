"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // State untuk efek loading awal masuk halaman
  const [isPageLoading, setIsPageLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // Memberikan efek jeda (loading) selama 800ms saat masuk halaman
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Hapus data lama sebelum login baru (mencegah konflik role)
    localStorage.clear();

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

      const data = await response.json() as any;

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role); 

        alert("Login Berhasil! Selamat datang kembali.");
        
        if (data.user.role === "ADMIN") {
          router.push("/admin-panel");
        } else {
          router.push("/beranda-dashboard");
        } 
      } else {
        alert(data.message || "Login Gagal");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Gagal terhubung ke server. Pastikan Backend jalan di port 5050");
    }
  };

  // ── TAMPILAN LOADING SCREEN ──
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Menghubungkan...
        </p>
      </div>
    );
  }

  // ── TAMPILAN UTAMA LOGIN ──
  return (
    <main className="min-h-screen flex bg-[#0a110b] font-sans m-0 overflow-hidden">
      
      {/* ── BAGIAN KIRI: GAMBAR DAUN AI ── */}
      <div className="hidden lg:block relative w-1/2 min-h-screen bg-[#1a2e1f] overflow-hidden">
        {/* Ganti src ini dengan path gambar AI Anda */}
        <img 
          src="https://images.unsplash.com/photo-1536882240095-0379873feb4e?q=80&w=1000&auto=format&fit=crop" 
          alt="AI Generated Leaf"
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* OVERLAY: Memudarkan sisi kanan gambar ke hitam pekat agar menyatu dengan form */}
        <div className="absolute inset-0 bg-[#0a110b]/20"></div>
        <div className="absolute inset-y-0 right-0 w-[250px] bg-gradient-to-l from-[#0a110b] via-[#0a110b]/90 to-transparent z-10"></div>
        
        {/* Teks Sambutan di atas gambar */}
        <div className="absolute bottom-20 left-16 max-w-md z-20">
          <h2 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight shadow-black drop-shadow-lg">
            Masa Depan Bumi <br />
            <span className="text-[#2fa84f]">Ada di Tangan Kita.</span>
          </h2>
          <p className="text-white/80 text-sm font-medium leading-relaxed drop-shadow-md">
            Bergabunglah dengan ribuan penjual dan pembeli lainnya dalam mewujudkan ekosistem perdagangan yang ramah lingkungan dan berkelanjutan.
          </p>
        </div>
      </div>

      {/* ── BAGIAN KANAN: FORM LOGIN ── */}
      {/* box-shadow dikiri form membuat garis pemisah menjadi hilang/blur menyatu dengan gambar */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative p-6 bg-gradient-to-br from-[#0a110b] via-[#1a1f1b] to-[#0a110b] z-20 [box-shadow:-40px_0_60px_10px_#0a110b]">
        
        {/* Dekorasi Glow Hijau Khusus Form */}
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#2fa84f] opacity-[0.15] blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#2fa84f] opacity-[0.1] blur-[100px] rounded-full pointer-events-none"></div>

        {/* TOMBOL KEMBALI */}
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 no-underline text-sm font-bold px-4 py-2 rounded-full border border-white/10 hover:text-white hover:bg-white/5 transition-all duration-300 z-20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali
        </Link>

        {/* CARD LOGIN */}
        <div className="w-full max-w-[420px] relative z-10">
          
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 no-underline group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_4px_15px_rgba(47,168,79,0.4)] group-hover:scale-105 transition-transform">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/>
                </svg>
              </div>
              <span className="text-2xl font-[900] text-white tracking-tight">
                GreenMarket
              </span>
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              Masuk untuk melanjutkan aksi hijau Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                Email Anda
              </label>
              <input
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-white/10 rounded-2xl h-[56px] px-5 bg-[#1a1f1b]/50 text-white text-sm focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] outline-none transition-all placeholder:text-gray-600 shadow-inner"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
                  Kata Sandi
                </label>
                <Link href="#" className="text-[11px] text-[#2fa84f] no-underline font-bold hover:underline">
                  Lupa Sandi?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-white/10 rounded-2xl h-[56px] px-5 bg-[#1a1f1b]/50 text-white text-sm focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] outline-none transition-all placeholder:text-gray-600 shadow-inner"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#2fa84f] text-white py-4 rounded-2xl font-bold text-base w-full transition-all duration-300 hover:bg-[#268c41] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(47,168,79,0.3)] active:scale-[0.98] mt-4"
            >
              Masuk Sekarang
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-8">
            <p className="text-sm text-gray-400 font-medium">
              Belum punya akun?{" "}
              <Link href="/register" className="text-[#2fa84f] font-black no-underline hover:underline">
                Daftar Gratis
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}