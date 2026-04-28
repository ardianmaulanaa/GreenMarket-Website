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

  const router = useRouter(); // Inisialisasi router di dalam komponen

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset state atau tampilkan loading jika perlu
    try {
      const response = await fetch("http://localhost:5050/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registrasi Berhasil! Silakan Login.");
        router.push("/login"); // Pindah ke halaman login
      } else {
        // Menampilkan pesan error dari backend (misal: "Email sudah terdaftar")
        alert(data.message || "Terjadi kesalahan saat mendaftar");
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Gagal terhubung ke server. Pastikan Backend (Port 5050) sudah jalan.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f1f8e9] font-sans m-0 overflow-hidden relative">
      
      {/* TOMBOL KEMBALI */}
      <Link
        href="/login"
        className="absolute top-[30px] left-[30px] flex items-center gap-2 text-[#6b7c71] no-underline text-sm font-semibold px-4 py-2 rounded-[50px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:text-[#2fa84f] hover:-translate-x-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali
      </Link>

      {/* CARD REGISTER */}
      <div className="bg-white p-[40px_45px] rounded-[28px] w-full max-w-[480px] shadow-[0_15px_50px_rgba(30,80,40,0.08)] text-center">
        
        <div className="text-2xl font-bold text-[#2fa84f] mb-[25px] inline-block">
          🌿 GreenMarket
        </div>

        <h1 className="text-[24px] font-bold text-[#1a2e1f] mb-2">
          Buat Akun Baru
        </h1>
        
        <p className="text-sm text-[#6b7c71] mb-[30px]">
          Mari mulai langkah kecil untuk bumi yang lebih baik.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col text-left">
          
          {/* USERNAME */}
          <div className="mb-3">
            <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-[0.5px] mb-[5px] block ml-[5px]">
              username
            </label>
            <input
              name="username"
              type="text"
              placeholder="Masukkan Username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-[#e0e6e2] rounded-[12px] h-[48px] px-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-[0.5px] mb-[5px] block ml-[5px]">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[#e0e6e2] rounded-[12px] h-[48px] px-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-[0.5px] mb-[5px] block ml-[5px]">
              Kata Sandi
            </label>
            <input
              name="password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-[#e0e6e2] rounded-[12px] h-[48px] px-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>

          {/* TERMS & CONDITIONS */}
          <div className="flex gap-2 items-start mb-4 text-left">
            <input
              name="terms"
              type="checkbox"
              checked={form.terms}
              onChange={handleChange}
              className="w-[18px] h-[18px] accent-[#2fa84f] mt-[2px] cursor-pointer"
              required
            />
            <p className="text-[12px] text-[#6b7c71] m-0 leading-[1.5]">
              Saya setuju dengan{" "}
              <span className="text-[#2fa84f] font-semibold">Syarat & Ketentuan</span>{" "}
              yang berlaku di GreenMarket.
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-[#2fa84f] text-white py-[14px] rounded-[12px] font-bold text-[16px] w-full transition-all duration-300 hover:bg-[#268c41] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(47,168,79,0.25)]"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="mt-[25px] text-sm text-[#6b7c71]">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#2fa84f] font-bold no-underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}