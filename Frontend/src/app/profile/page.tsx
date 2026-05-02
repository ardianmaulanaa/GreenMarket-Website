"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "", 
  });

  useEffect(() => {
    // Efek loading saat memuat/berpindah ke halaman profil
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    // Mengambil data user dari session
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

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const isSeller = form.role === "SELLER" || form.role === "Penjual";

  // ── TAMPILAN LOADING SCREEN ──
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Memuat Profil...
        </p>
      </div>
    );
  }

  // ── TAMPILAN UTAMA PROFIL ──
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>
        </div>

        {/* SEARCH BAR (Opsional di profil, disamakan ukurannya dengan dashboard) */}
        <div className="flex-1 max-w-xl mx-10 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari produk ramah lingkungan..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/beranda-dashboard" className="text-gray-400 hover:text-white text-xs font-bold transition-colors bg-transparent border-none cursor-pointer mr-2 no-underline flex items-center gap-1">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             Kembali
          </Link>
          <div className="flex items-center gap-3 pl-2 group">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">{form.nama}</p>
                  <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">{form.role}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
                 <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                    {form.nama ? form.nama.charAt(0) : "U"}
                 </div>
               </div>
          </div>
        </div>
      </nav>

      {/* ── KONTEN UTAMA ── */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">

        {/* ── SIDEBAR PROFIL ── */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl">
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img src={`https://ui-avatars.com/api/?name=${form.nama.replace(" ", "+")}&background=2fa84f&color=fff&size=128`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/40 object-cover shadow-[0_0_15px_rgba(47,168,79,0.3)]" alt="Avatar" />
              </div>
              <h3 className="text-lg font-[800] text-white m-0 tracking-tight">{form.nama}</h3>
              <p className="text-[10px] text-[#2fa84f] m-0 mt-1.5 uppercase font-black tracking-[2px]">{form.role}</p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_4px_15px_rgba(47,168,79,0.2)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-sm">Profil Saya</span>
              </Link>

              <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#2fa84f] transition-colors">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-sm">Daftar Alamat</span>
              </Link>
              
              <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-[#2fa84f] transition-colors"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                <span className="text-sm">Pesanan Saya</span>
              </Link>

              {!isSeller ? (
                <Link href="/register-penjual" className="flex items-center gap-3 p-3.5 rounded-2xl text-[#2fa84f] bg-[#2fa84f]/10 border border-[#2fa84f]/20 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span className="text-sm">Mulai Berjualan</span>
                </Link>
              ) : (
                <Link href="/panel-penjual" className="flex items-center gap-3 p-3.5 rounded-2xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="text-sm">Panel Inventaris</span>
                </Link>
              )}
              
              <div className="my-4 border-t border-white/5" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition font-bold text-left group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-sm">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── FORM PROFIL ── */}
        <main className="flex-1">
          <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 border border-white/5 shadow-2xl relative overflow-hidden h-full">
            {/* Dekorasi Glow di dalam kartu */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#2fa84f] rounded-full opacity-[0.15] blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 mb-10">
              <h2 className="text-3xl font-[800] text-white tracking-tight m-0">Pengaturan Profil</h2>
              <p className="text-sm text-gray-400 mt-2 font-medium">Kelola informasi data diri dan keamanan akun Anda.</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Field Nama */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={form.nama} 
                    onChange={(e) => setForm({...form, nama: e.target.value})}
                    className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" 
                  />
                </div>

                {/* Field Email (Read Only) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                    Email 
                    <span className="text-[#2fa84f] lowercase tracking-normal flex items-center gap-1">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                       Terverifikasi
                    </span>
                  </label>
                  <input 
                    type="email" 
                    value={form.email} 
                    readOnly 
                    className="w-full px-5 py-4 border border-white/5 rounded-2xl text-sm bg-white/5 cursor-not-allowed outline-none font-medium text-gray-500 shadow-inner" 
                  />
                </div>

                {/* Field Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password Baru</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Kosongkan jika tidak diubah" 
                      className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 pr-14 shadow-inner transition-all placeholder:text-gray-600" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Field Role */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status Keanggotaan</label>
                  <div className={`w-full px-5 py-4 border border-[#2fa84f]/30 rounded-2xl text-sm flex items-center justify-between bg-[#2fa84f]/10 shadow-inner`}>
                    <span className={`font-black text-[#2fa84f] uppercase tracking-wider`}>{form.role}</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-[#2fa84f] font-bold uppercase tracking-wider">Aktif</span>
                       <div className="w-2.5 h-2.5 rounded-full bg-[#2fa84f] animate-pulse shadow-[0_0_8px_#2fa84f]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Submit */}
              <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                <button type="submit" className="bg-[#2fa84f] text-white px-8 py-3.5 rounded-xl font-[800] text-sm hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:-translate-y-1 active:scale-[0.98]">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-transparent py-8 text-center border-t border-[#1a2e1f]/10 mt-auto relative z-10">
         <p className="text-[#1a2e1f]/50 text-[10px] font-black tracking-[4px] uppercase m-0">
            © 2026 GREENMARKET. ALL SELLER & BUYER CATALOG.
         </p>
      </footer>
    </div>
  );
}