"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "", 
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setForm({
        nama: userData.username || userData.name || "User",
        email: userData.email || "",
        password: "", 
        role: userData.role || "BUYER",
      });
    }
  }, []);

  const isSeller = form.role === "SELLER" || form.role === "Penjual";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Luxury Dark Glassmorphism) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-md border-b border-white/5 shadow-lg py-3 px-8 flex items-center justify-between h-[68px]">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_4px_12px_rgba(47,168,79,0.35)] group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/>
              </svg>
            </div>
            <span className="text-[18px] font-[800] text-white tracking-[-0.5px]">GreenMarket</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </Link>
            <Link href="/profile" className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(47,168,79,0.35)] ring-2 ring-[#2fa84f]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto pt-[100px] pb-[60px] px-8 flex gap-7 relative z-10">

        {/* ── SIDEBAR (Semi-Transparent Dark Card) ── */}
        <aside className="w-[260px] shrink-0">
          <div className="sticky top-[84px] bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img src={`https://ui-avatars.com/api/?name=${form.nama.replace(" ", "+")}&background=2fa84f&color=fff`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/30" alt="Avatar" />
              </div>
              <h3 className="text-[15px] font-[800] text-white m-0">{form.nama || "Loading..."}</h3>
              <p className="text-[11px] text-[#2fa84f] m-0 mt-1 uppercase font-bold tracking-widest">{form.role}</p>
            </div>

            <nav className="flex flex-col gap-1.5">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_4px_12px_rgba(47,168,79,0.25)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-[13px]">Profil Saya</span>
              </Link>

              <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-[13px]">Alamat</span>
              </Link>
              
              <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                <span className="text-[13px]">Pesanan Saya</span>
              </Link>

              {!isSeller ? (
                <Link href="/register-penjual" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span className="text-[13px]">Mulai Berjualan</span>
                </Link>
              ) : (
                <Link href="/seller/dashboard" className="flex items-center gap-3 p-3.5 rounded-xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="text-[13px]">Dashboard Toko</span>
                </Link>
              )}
              
              <div className="my-2 border-t border-white/5" />
              
              <button 
                onClick={() => { localStorage.clear(); window.location.href="/login"; }}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition font-bold text-left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-[13px]">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── FORM PROFIL (Luxury Card) ── */}
        <main className="flex-1">
          <div className="bg-white rounded-[32px] p-10 border border-[#eef2ef] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            {/* Dekorasi halus dalam card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f1f8e9] rounded-bl-full opacity-50 -z-0"></div>
            
            <h2 className="text-[24px] font-[800] text-[#1a2e1f] mb-8 tracking-tight relative z-10">Pengaturan Profil</h2>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-[1px] ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={form.nama} 
                    onChange={(e) => setForm({...form, nama: e.target.value})}
                    className="w-full px-4 py-3.5 border border-[#e0e6e2] rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-4 focus:ring-[#2fa84f]/5 text-[14px] bg-[#fcfdfc] transition-all" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-[1px] ml-1">Email</label>
                  <input 
                    type="email" 
                    value={form.email} 
                    readOnly 
                    className="w-full px-4 py-3.5 border border-[#e0e6e2] rounded-2xl text-[14px] bg-[#f5f5f5] cursor-not-allowed outline-none font-medium text-gray-500" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-[1px] ml-1">Password Baru</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Kosongkan jika tidak diubah" 
                      className="w-full px-4 py-3.5 border border-[#e0e6e2] rounded-2xl outline-none focus:border-[#2fa84f] text-[14px] bg-[#fcfdfc] pr-12 transition-all" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7c71] hover:text-[#2fa84f] transition-colors">
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-[1px] ml-1">Role Akun</label>
                  <div className={`w-full px-4 py-3.5 border border-[#e0e6e2] rounded-2xl text-[14px] flex items-center justify-between bg-[#f8faf9]`}>
                    <span className={`font-bold text-[#2fa84f] uppercase tracking-tighter`}>{form.role}</span>
                    <div className="w-2 h-2 rounded-full bg-[#2fa84f] animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#f1f8e9] flex justify-end">
                <button type="submit" className="bg-[#2fa84f] text-white px-10 py-3.5 rounded-2xl font-[800] text-[14px] hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:-translate-y-1 active:scale-[0.98]">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}