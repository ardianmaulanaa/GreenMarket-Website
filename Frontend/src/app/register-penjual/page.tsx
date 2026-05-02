"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function RegisterPenjual() {
  const [step, setStep] = useState(1);
  const [umur, setUmur] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ nama: "", role: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        nama: userData.username || userData.name || "User",
        role: userData.role || "BUYER"
      });
    }
  }, []);

  const handleFinalSubmit = async () => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5050/api/users/upgrade/${storedUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const currentData = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentData, role: "SELLER" };
        
        localStorage.setItem("user", JSON.stringify(updatedUser)); 
        localStorage.setItem("userRole", "SELLER");               

        alert("Selamat! Anda sekarang menjadi Penjual.");
        
        window.location.href = "/beranda-dashboard"; 
      } else {
        alert("Gagal daftar.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center gap-10 mb-12 relative z-10">
      {[
        { id: 1, label: "Identitas" },
        { id: 2, label: "Informasi Toko" },
        { id: 3, label: "Barang" },
      ].map((s) => (
        <div key={s.id} className="flex flex-col items-center gap-3 relative">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-[15px] border-2 transition-all duration-300 ${
            step >= s.id 
            ? "bg-[#2fa84f]/20 border-[#2fa84f] text-[#2fa84f] shadow-[0_0_15px_rgba(47,168,79,0.3)]" 
            : "bg-white/5 border-white/10 text-gray-500"
          }`}>
            {s.id}
          </div>
          <span className={`text-[10px] font-[800] uppercase tracking-[2px] ${
            step >= s.id ? "text-[#2fa84f]" : "text-gray-500"
          }`}>
            {s.label}
          </span>
          {s.id < 3 && (
            <div className={`absolute top-6 -right-16 w-12 h-[2px] hidden lg:block ${
              step > s.id ? "bg-[#2fa84f]" : "bg-white/10"
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans relative overflow-hidden flex flex-col">
      
      {/* ── Latar Belakang Glow Hijau ── */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Sesuai Layout Terbaru max-w-1600px) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2.5 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase hidden sm:block">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/komunitas" className="text-white/70 font-bold text-sm no-underline hover:text-[#2fa84f] transition-colors flex items-center gap-2 px-2 mr-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Komunitas
            </Link>
            
            <Link href="/profile" className="flex items-center gap-3 pl-2 group no-underline border-l border-white/10 pt-1 pb-1">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">Profil Saya</p>
                  <p className="text-[10px] text-gray-400 m-0 uppercase">{user.role}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px] shadow-lg group-hover:scale-105 transition-transform ml-2">
                 <div className="w-full h-full rounded-full bg-[#0d130e] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
               </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT (Dark Glassmorphism) ── */}
      <main className="flex-grow container max-w-[1600px] mx-auto pt-32 pb-20 px-4 relative z-10 flex flex-col items-center">
        <div className="bg-[#1a1f1b]/60 backdrop-blur-md rounded-[40px] p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 w-full max-w-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#2fa84f] rounded-bl-full opacity-10 blur-3xl -z-0 pointer-events-none"></div>

          <div className="relative z-10">
            <header className="text-center mb-10">
                <h1 className="text-[28px] lg:text-[32px] font-[800] text-white mb-2 tracking-tight">Menjadi Penjual Hijau</h1>
                <p className="text-gray-400 text-sm font-medium">Bantu selamatkan bumi dengan barang berkualitas Anda.</p>
            </header>
            
            {renderStepIndicator()}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Sesuai KTP</label>
                    <input type="text" placeholder="Masukkan nama lengkap" className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white text-[15px] transition-all placeholder-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Umur Anda</label>
                    <select 
                      value={umur}
                      onChange={(e) => setUmur(e.target.value)}
                      className={`w-full px-5 py-4 bg-black/20 border rounded-2xl outline-none focus:ring-1 transition-all text-[15px] cursor-pointer appearance-none ${
                        umur && parseInt(umur) < 18 ? "border-red-500 text-red-400 focus:border-red-500 focus:ring-red-500" : "border-white/10 text-white focus:border-[#2fa84f] focus:ring-[#2fa84f]"
                      }`}
                    >
                      <option value="" disabled className="bg-[#1a1f1b] text-gray-500">Pilih Umur Anda</option>
                      {Array.from({ length: 61 }, (_, i) => i + 10).map((val) => (
                        <option key={val} value={val.toString()} className="bg-[#1a1f1b] text-white">{val} Tahun</option>
                      ))}
                    </select>
                    {umur && parseInt(umur) < 18 && (
                      <p className="text-[10px] font-[800] text-red-400 uppercase tracking-widest mt-2 ml-1">⚠️ Maaf, pendaftaran minimal berusia 18 tahun.</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!umur || parseInt(umur) < 18} className={`w-full py-4 rounded-2xl font-[800] text-sm uppercase tracking-widest transition-all ${!umur || parseInt(umur) < 18 ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5" : "bg-[#2fa84f] text-white hover:bg-[#268c41] shadow-[0_10px_20px_rgba(47,168,79,0.2)] hover:-translate-y-0.5 border-none"}`}>
                  Langkah Berikutnya
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Toko</label>
                    <input type="text" placeholder="Contoh: Green Solutions" className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white text-[15px] transition-all placeholder-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Bisnis</label>
                    <input type="email" placeholder="toko@greenmarket.id" className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white text-[15px] transition-all placeholder-gray-600" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 text-gray-400 font-bold text-sm bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">Kembali</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-[#2fa84f] text-white py-4 rounded-2xl font-[800] text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(47,168,79,0.2)] hover:bg-[#268c41] transition-all hover:-translate-y-0.5 border-none cursor-pointer">Lanjut</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[24px] border border-white/10 group hover:border-[#2fa84f]/50 hover:bg-white/10 transition-all cursor-pointer">
                   <div className="w-20 h-20 bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">+</div>
                   <div>
                       <span className="text-[11px] font-bold text-[#2fa84f] uppercase tracking-[2px]">Unggah Foto</span>
                       <p className="text-[13px] text-gray-400 mt-1 m-0">Produk pertama toko Anda.</p>
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Harga Produk (Rp)</label>
                    <input type="number" placeholder="0" className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white transition-all placeholder-gray-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
                    <textarea placeholder="Contoh: Produk daur ulang dari ban bekas..." className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white h-28 resize-none transition-all placeholder-gray-600"></textarea>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 py-4 text-gray-400 font-bold text-sm bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-white transition-colors uppercase tracking-widest cursor-pointer" disabled={loading}>Kembali</button>
                  <button 
                    onClick={handleFinalSubmit} 
                    disabled={loading}
                    className={`flex-1 py-4 rounded-2xl font-[800] text-[13px] uppercase tracking-[2px] transition-all border-none ${
                      loading ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5" : "bg-[#2fa84f] text-white hover:bg-[#268c41] shadow-[0_10px_20px_rgba(47,168,79,0.3)] hover:-translate-y-0.5 cursor-pointer"
                    }`}
                  >
                    {loading ? "Memproses..." : "Kirim Pendaftaran"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── FOOTER (Sesuai Dashboard) ── */}
      <footer className="bg-[#0a110b] pt-10 pb-6 px-8 text-white relative z-10 border-t border-white/5 text-center mt-auto">
         <div className="max-w-6xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
               <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
               </div>
               <span className="text-sm font-black text-white tracking-tighter uppercase">GreenMarket</span>
            </div>
            <p className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase m-0">
               © 2026 GREENMARKET INC. Seller Onboarding.
            </p>
         </div>
      </footer>
    </div>
  );
}