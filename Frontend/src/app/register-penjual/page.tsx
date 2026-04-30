"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPenjual() {
  const [step, setStep] = useState(1);
  const [umur, setUmur] = useState("");
  const [loading, setLoading] = useState(false);

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
      // --- TAMBAHKAN BARIS INI ---
      const currentData = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentData, role: "SELLER" };
      
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Update objek user
      localStorage.setItem("userRole", "SELLER");               // Update string role
      // ---------------------------

      alert("Selamat! Anda sekarang menjadi Penjual.");
      
      // Gunakan ini agar halaman refresh total dan membaca data baru
      window.location.href = "/beranda-dashboard-seller"; 
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
    <div className="flex justify-center items-center gap-10 mb-12">
      {[
        { id: 1, label: "Identitas" },
        { id: 2, label: "Informasi Toko" },
        { id: 3, label: "Barang" },
      ].map((s) => (
        <div key={s.id} className="flex flex-col items-center gap-3 relative">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-[15px] border-2 transition-all duration-300 ${
            step >= s.id 
            ? "bg-[#2fa84f] border-[#2fa84f] text-white shadow-[0_4px_12px_rgba(47,168,79,0.3)]" 
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
      
      {/* Glow Effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] bg-[#2fa84f] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-md border-b border-white/5 shadow-lg py-3 px-8 flex items-center justify-between h-[68px]">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-[18px] font-[800] text-white tracking-[-0.5px]">GreenMarket</span>
          </Link>
          <Link href="/profile" className="text-sm font-bold text-[#2fa84f] hover:text-white transition-colors flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Profil
          </Link>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow container mx-auto pt-32 pb-20 px-4 relative z-10 flex flex-col items-center">
        <div className="bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[40px] p-8 lg:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-white/10 w-full max-w-2xl relative overflow-hidden">
          
          <div className="relative z-10">
            <header className="text-center mb-10">
                <h1 className="text-[28px] font-[800] text-white mb-2 tracking-tight">Menjadi Penjual Hijau</h1>
                <p className="text-gray-400 text-sm font-medium">Bantu selamatkan bumi dengan barang berkualitas Anda.</p>
            </header>
            
            {renderStepIndicator()}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nama Sesuai KTP</label>
                    <input type="text" placeholder="Masukkan nama lengkap" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-white text-[15px] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Umur Anda</label>
                    <select 
                      value={umur}
                      onChange={(e) => setUmur(e.target.value)}
                      className={`w-full px-4 py-3.5 bg-white/5 border rounded-2xl outline-none transition-all text-[15px] cursor-pointer ${
                        umur && parseInt(umur) < 18 ? "border-red-500 text-red-400" : "border-white/10 text-white"
                      }`}
                    >
                      <option value="" disabled className="bg-[#1a1f1b]">Pilih Umur</option>
                      {Array.from({ length: 61 }, (_, i) => i + 10).map((val) => (
                        <option key={val} value={val.toString()} className="bg-[#1a1f1b]">{val} Tahun</option>
                      ))}
                    </select>
                    {umur && parseInt(umur) < 18 && (
                      <p className="text-[10px] font-[800] text-red-400 uppercase tracking-widest mt-2 ml-1">⚠️ Maaf, pendaftaran minimal berusia 18 tahun.</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!umur || parseInt(umur) < 18} className={`w-full py-4 rounded-2xl font-[800] text-sm uppercase tracking-widest transition-all ${!umur || parseInt(umur) < 18 ? "bg-white/5 text-gray-600 cursor-not-allowed" : "bg-[#2fa84f] text-white hover:bg-[#268c41] shadow-lg shadow-[#2fa84f]/20"}`}>
                  Langkah Berikutnya
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nama Toko</label>
                    <input type="text" placeholder="Contoh: Green Solutions" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-white text-[15px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Bisnis</label>
                    <input type="email" placeholder="toko@greenmarket.id" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-white text-[15px]" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 text-gray-500 font-bold text-sm hover:text-white transition-colors uppercase tracking-widest">Kembali</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-[#2fa84f] text-white py-4 rounded-2xl font-[800] text-sm uppercase tracking-widest shadow-lg shadow-[#2fa84f]/20">Lanjut</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[24px] border border-white/5 group hover:border-[#2fa84f]/30 transition-all cursor-pointer">
                   <div className="w-20 h-20 bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">+</div>
                   <div>
                       <span className="text-[11px] font-bold text-[#2fa84f] uppercase tracking-[2px]">Unggah Foto</span>
                       <p className="text-[13px] text-gray-500 mt-1">Produk pertama toko Anda.</p>
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Harga Produk (Rp)</label>
                    <input type="number" placeholder="0" className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
                    <textarea placeholder="Contoh: Produk daur ulang dari ban bekas..." className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-white h-28 resize-none"></textarea>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 py-4 text-gray-500 font-bold text-sm uppercase tracking-widest" disabled={loading}>Batal</button>
                  <button 
                    onClick={handleFinalSubmit} 
                    disabled={loading}
                    className={`flex-1 py-4 rounded-2xl font-[800] text-[13px] uppercase tracking-[2px] transition-all ${
                      loading ? "bg-white/5 text-gray-700 cursor-not-allowed" : "bg-[#2fa84f] text-white hover:bg-[#268c41] shadow-[0_8px_20px_rgba(47,168,79,0.3)]"
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

      <footer className="bg-[#0a110b] pt-10 pb-8 px-8 text-white mt-auto relative z-10 border-t border-white/5 text-center">
         <p className="text-white/20 text-[10px] font-[800] tracking-[4px] uppercase">© 2026 GREENMARKET • SELLER ONBOARDING</p>
      </footer>
    </div>
  );
}