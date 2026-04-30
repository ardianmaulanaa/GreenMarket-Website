"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface Produk {
  id_produk: number;
  nama_produk: string;
  harga: number;
  stok: number;
  status_produk?: string;
  image_url?: string;
  kategori?: {
    nama_kategori: string;
  };
  seller?: {
    username: string;
    email: string;
  };
}

export default function BerandaDashboardSeller() {
  const [dbProducts, setDbProducts] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole !== "SELLER") {
      router.push("/beranda-dashboard");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/products");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        setDbProducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [router]);

  const resetFilters = () => {
    const inputs = document.querySelectorAll('.filter-check input') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => (input.checked = false));
  };

  return (
    // ── PEMBUNGKUS UTAMA (Memastikan footer di bawah) ──
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-md border-b border-white/5 shadow-lg py-3 px-8 flex items-center justify-between h-[68px]">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-[18px] font-[800] text-white tracking-[-0.5px]">GreenMarket</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/seller/dashboard" className="bg-[#2fa84f] text-white px-5 py-2 rounded-xl text-[11px] font-bold no-underline hover:bg-[#268c41] transition-all shadow-lg flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Panel Penjual
            </Link>
            <Link href="/komunitas" className="text-white/70 font-bold text-sm no-underline hover:text-[#2fa84f] transition-colors flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Komunitas
            </Link>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-lg mx-10 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex items-center group focus-within:border-[#2fa84f] transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" className="mr-2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Pantau pasar ramah lingkungan..." className="bg-transparent border-none outline-none w-full text-sm text-white placeholder:text-gray-500" />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </Link>
          <Link href="/profile" className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center text-white shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </div>
      </nav>

      {/* ── MAIN CONTENT (Gunakan flex-grow agar mendorong footer) ── */}
      <main className="flex-grow container mx-auto pt-28 px-6 lg:px-12 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="w-full lg:w-1/4">
            <div className="bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[32px] p-8 border border-white/5 shadow-2xl sticky top-28">
              <h2 className="text-xl font-[800] text-white mb-8 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
                Analisis Pasar
              </h2>
              <div className="space-y-4 mb-8">
                {["Toko Populer", "Toko Terpercaya", "Toko Terlaris"].map((item) => (
                  <label key={item} className="filter-check flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="accent-[#2fa84f] w-4 h-4 cursor-pointer rounded" />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{item}</span>
                  </label>
                ))}
              </div>
              <button onClick={resetFilters} className="w-full py-3 bg-[#f1f8e9] text-[#2fa84f] rounded-2xl font-bold text-xs hover:bg-[#2fa84f] hover:text-white transition-all">
                Reset Filter
              </button>
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-[800] text-white tracking-tight">Dashboard Seller</h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">Selamat datang kembali! Pantau produk Anda di sini.</p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#2fa84f]">
                <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold tracking-wide">Menghubungkan data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {dbProducts.map((p) => (
                  <div key={p.id_produk} className="group bg-white rounded-[28px] overflow-hidden border border-white/5 hover:border-[#2fa84f]/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#f8faf9]">
                      <Image src={p.image_url || "/placeholder.png"} alt={p.nama_produk} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-[15px] text-[#1a2e1f] mb-1">{p.nama_produk}</h4>
                      <div className="text-[#2fa84f] font-[800] text-lg mb-4">Rp {p.harga?.toLocaleString('id-ID')}</div>
                      <div className="pt-4 border-t border-[#f1f8e9] flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-[#6b7c71]">
                        <span className="flex items-center gap-1">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="3"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z"/></svg>
                           {p.kategori?.nama_kategori || "Umum"}
                        </span>
                        <span className="text-[#1a2e1f]">Stok: {p.stok}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── FOOTER (Fleksibel & mt-auto) ── */}
      <footer className="bg-[#0a110b] pt-12 pb-8 px-8 text-white relative z-10 border-t border-white/5 text-center mt-auto">
         <p className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">
            © 2026 GREENMARKET INC. Seller Center.
         </p>
      </footer>
    </div>
  );
}