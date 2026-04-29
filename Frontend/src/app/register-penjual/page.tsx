"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPenjual() {
  const [step, setStep] = useState(1);
  const [umur, setUmur] = useState("");
  const [loading, setLoading] = useState(false); // State untuk loading

  // FUNGSI UNTUK UPGRADE ROLE
  const handleFinalSubmit = async () => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      alert("Silakan login terlebih dahulu!");
      window.location.href = "/login";
      return;
    }

    setLoading(true); // Mulai loading

    try {
      const response = await fetch(`http://localhost:5050/api/users/upgrade/${storedUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        window.location.href = "/profile"; 
      } else {
        alert("Terjadi kesalahan saat mendaftar. Pastikan Backend menyala.");
      }
    } catch (error) {
      console.error("Gagal upgrade role:", error);
      alert("Koneksi ke server backend gagal.");
    } finally {
      setLoading(false); // Matikan loading baik sukses maupun gagal
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
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[15px] border-4 transition-all duration-300 ${
            step >= s.id 
            ? "bg-[#2fa84f] border-[#f1f8e9] text-white shadow-md" 
            : "bg-white border-[#f8faf9] text-[#6b7c71]"
          }`}>
            {s.id}
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${
            step >= s.id ? "text-[#2fa84f]" : "text-[#6b7c71]"
          }`}>
            {s.label}
          </span>
          {s.id < 3 && (
            <div className={`absolute top-6 -right-16 w-12 h-[2px] hidden lg:block ${
              step > s.id ? "bg-[#2fa84f]" : "bg-[#e0e6e2]"
            }`}></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f8e9] font-sans pb-20">
      <nav className="fixed top-0 w-full z-[100] bg-white border-b border-[#e0e6e2] shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/beranda-dashboard" className="text-[#2fa84f] text-2xl font-[800] no-underline">
            GreenMarket
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-sm font-bold text-[#6b7c71] hover:text-[#2fa84f] transition">
              ← Kembali ke Profil
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto pt-28 px-4 lg:px-10 flex flex-col items-center">
        <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef] w-full max-w-3xl relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#f1f8e9] rounded-full z-0 opacity-50"></div>

          <div className="relative z-10">
            <h3 className="text-2xl font-[800] text-[#1a2e1f] mb-2 text-center">Register Penjual</h3>
            <p className="text-[#6b7c71] text-sm text-center mb-10">Lengkapi data untuk mulai berkontribusi pada bumi</p>
            
            {renderStepIndicator()}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Nama Sesuai KTP</label>
                    <input type="text" placeholder="Masukkan nama lengkap" className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Pilih Umur Anda</label>
                    <select 
                      value={umur}
                      onChange={(e) => setUmur(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl outline-none transition-all text-[15px] cursor-pointer ${
                        umur && parseInt(umur) < 18 ? "border-red-400 bg-red-50 focus:border-red-500" : "border-[#e0e6e2] bg-[#fcfdfc] focus:border-[#2fa84f]"
                      }`}
                    >
                      <option value="" disabled>Pilih Umur</option>
                      {Array.from({ length: 61 }, (_, i) => i + 10).map((val) => (
                        <option key={val} value={val.toString()}>{val} Tahun</option>
                      ))}
                    </select>
                    {umur && parseInt(umur) < 18 && (
                      <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-100 text-red-600 rounded-lg animate-pulse">
                        <span className="text-sm">⚠️</span>
                        <p className="text-[10px] font-bold uppercase tracking-tight">Maaf, pendaftaran minimal berusia 18 tahun.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-6">
                  <button onClick={() => setStep(2)} disabled={!umur || parseInt(umur) < 18} className={`w-full py-4 rounded-xl font-bold text-sm shadow-sm ${!umur || parseInt(umur) < 18 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#2fa84f] text-white"}`}>
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Nama Toko</label>
                    <input type="text" placeholder="Contoh: Toko Organik Makmur" className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] bg-[#fcfdfc]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Email Bisnis</label>
                    <input type="email" placeholder="toko@example.com" className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] bg-[#fcfdfc]" />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 text-[#6b7c71] font-bold text-sm hover:bg-gray-50 rounded-xl">Kembali</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-[#2fa84f] text-white py-4 rounded-xl font-bold text-sm">Selanjutnya</button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-6 bg-[#fcfdfc] p-6 rounded-2xl border border-[#f1f8e9]">
                   <div className="w-24 h-24 bg-[#333] rounded-2xl flex items-center justify-center text-white text-3xl cursor-pointer hover:opacity-90 transition shadow-lg">+</div>
                   <span className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider block">Foto Produk Pertama</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Harga Awal</label>
                  <input type="number" placeholder="Rp 0" className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none bg-[#fcfdfc]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Deskripsi Produk</label>
                  <textarea placeholder="Ceritakan keunggulan produkmu..." className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none bg-[#fcfdfc] h-24 resize-none"></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(2)} className="flex-1 py-4 text-[#6b7c71] font-bold text-sm hover:bg-gray-50 rounded-xl" disabled={loading}>Kembali</button>
                  <button 
                    onClick={handleFinalSubmit} 
                    disabled={loading}
                    className={`flex-1 py-4 rounded-xl font-[800] text-sm transition shadow-md ${
                      loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-[#2fa84f] text-white hover:bg-[#268c41]"
                    }`}
                  >
                    {loading ? "Sedang Memproses..." : "Kirim & Mulai Berjualan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}