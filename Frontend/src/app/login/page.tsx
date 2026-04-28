"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const router = useRouter();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

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

    const data = await response.json();

    if (response.ok) {
      // 1. Simpan data user ke LocalStorage agar bisa dipakai di halaman Profil/Dashboard
      localStorage.setItem("user", JSON.stringify(data.user));
      
      alert("Login Berhasil! Selamat datang kembali.");
      
      // 2. Lempar user ke halaman Dashboard
      router.push("/beranda-dashboard");
    } else {
      // Menampilkan pesan "Email tidak ditemukan" atau "Password salah" dari backend
      alert(data.message || "Login Gagal");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Gagal terhubung ke server. Pastikan Backend jalan di port 5050");
  }
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f1f8e9] font-sans m-0">
      
      {/* TOMBOL KEMBALI */}
      <Link
        href="/"
        className="absolute top-[30px] left-[30px] flex items-center gap-2 text-[#6b7c71] no-underline text-sm font-semibold px-4 py-2 rounded-[50px] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:text-[#2fa84f] hover:-translate-x-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all duration-300"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali
      </Link>

      {/* CARD LOGIN */}
      <div className="bg-white p-[45px] rounded-[28px] w-full max-w-[440px] shadow-[0_15px_50px_rgba(30,80,40,0.08)] text-center">
        
        <div className="text-2xl font-bold text-[#2fa84f] mb-[30px] inline-block">
          🌿 GreenMarket
        </div>

        <h1 className="text-[26px] font-bold text-[#1a2e1f] mb-2">
          Selamat Datang
        </h1>
        
        <p className="text-sm text-[#6b7c71] mb-[35px]">
          Masuk untuk melanjutkan aksi hijau Anda.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col text-left">
          
          {/* EMAIL */}
          <div className="mb-3 text-start">
            <label className="text-[12px] font-bold text-[#6b7c71] uppercase tracking-[0.5px] mb-[5px] block ml-[5px]">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-[#e0e6e2] rounded-[12px] h-[50px] px-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all pl-[15px]"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4 text-start">
            <div className="flex justify-between">
              <label className="text-[12px] font-bold text-[#6b7c71] uppercase tracking-[0.5px] mb-[5px] block ml-[5px]">
                Kata Sandi
              </label>
              <a href="#" className="text-[12px] text-[#2fa84f] no-underline font-semibold">
                Lupa?
              </a>
            </div>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-[#e0e6e2] rounded-[12px] h-[50px] px-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all mt-[5px]"
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="bg-[#2fa84f] text-white py-[14px] rounded-[12px] font-bold text-[16px] w-full transition-all duration-300 hover:bg-[#268c41] hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(47,168,79,0.25)]"
          >
            Masuk Sekarang
          </button>
        </form>

        <p className="mt-[25px] text-sm text-[#6b7c71]">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#2fa84f] font-bold no-underline">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </main>
  );
}