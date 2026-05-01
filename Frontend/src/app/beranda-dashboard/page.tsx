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
  image_url: string;
  kategori?: { nama_kategori: string };
  seller?: { username: string };
}

export default function BerandaDashboard() {
  const [dbProducts, setDbProducts] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    
    // PROTEKSI: Jika dia Seller, lempar ke dashboard khusus seller
    if (storedRole === "SELLER") {
      router.push("/beranda-dashboard-seller");
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/products");
        const data = await response.json();
        setDbProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [router]);

  const resetFilters = () => {
    const inputs = document.querySelectorAll('.filter-check input') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => input.checked = false);
  };

  return (
    // ── PEMBUNGKUS UTAMA ──
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow Hijau */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Sesuai Layout Terbaru max-w-1600px) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-10">
            <Link href="/" className="flex items-center gap-2.5 group no-underline">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight uppercase hidden sm:block">Green<span className="text-[#2fa84f]">Market</span></span>
            </Link>

            <div className="hidden lg:flex items-center gap-4">
              <Link 
                href="/register-penjual" 
                className="bg-[#2fa84f] text-white px-4 py-2 rounded-lg text-sm font-bold no-underline hover:bg-[#268c41] transition-all shadow-[0_4px_12px_rgba(47,168,79,0.3)] flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Mulai Berjualan
              </Link>
              <Link href="/komunitas" className="text-white/70 font-bold text-sm no-underline hover:text-[#2fa84f] transition-colors flex items-center gap-2 px-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Komunitas
              </Link>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="flex-1 max-w-xl mx-10 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input type="text" placeholder="Cari produk ramah lingkungan..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] transition-all placeholder-gray-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] hover:bg-white/10 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 pl-2 group no-underline">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">Profil Saya</p>
                  <p className="text-[10px] text-gray-400 m-0 uppercase">Buyer</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px] shadow-lg group-hover:scale-105 transition-transform">
                 <div className="w-full h-full rounded-full bg-[#0d130e] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
               </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MAIN LAYOUT (FLEX GROW, max-w-1600px) ── */}
      <main className="flex-grow container max-w-[1600px] mx-auto pt-28 px-6 lg:px-6 pb-20 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTER (Dark Glassmorphism) */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/10 shadow-xl sticky top-28">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-[#2fa84f] rounded-full"></div>
                <h2 className="text-lg font-[800] text-white m-0 tracking-tight">Filter Pasar</h2>
              </div>
              <div className="flex flex-col gap-4 mb-8">
                {["Toko Populer", "Toko Terpercaya", "Toko Terlaris", "Promo Spesial", "Gratis Ongkir"].map((item) => (
                  <label key={item} className="filter-check flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="accent-[#2fa84f] w-4 h-4 cursor-pointer rounded bg-white/10 border-white/20" />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{item}</span>
                  </label>
                ))}
              </div>
              <div className="pt-6 border-t border-white/5">
                <button onClick={resetFilters} className="w-full py-3.5 bg-white/5 text-gray-400 border border-transparent hover:border-white/10 rounded-2xl font-bold text-xs hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Reset Filter
                </button>
              </div>
            </div>
          </aside>

          {/* PRODUCT AREA */}
          <section className="flex-1">
            <h3 className="text-2xl font-[800] text-white mb-8 tracking-tight m-0">Produk Pilihan Untukmu</h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#2fa84f]">
                <div className="animate-spin w-10 h-10 border-4 border-current border-t-transparent rounded-full mb-4"></div>
                <p className="font-bold animate-pulse text-sm">Mencari produk hijau...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {dbProducts.map((p) => (
                  <div key={p.id_produk} className="group bg-[#1a1f1b]/60 backdrop-blur-md border border-white/10 rounded-[24px] overflow-hidden hover:border-[#2fa84f]/50 transition-all duration-500 flex flex-col relative shadow-xl">
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 bg-[#2fa84f]/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-white shadow-md uppercase tracking-wider">
                        Terbaru
                      </span>
                    </div>

                    <div className="relative aspect-square bg-white/5 overflow-hidden">
                      <Image 
                        src={p.image_url || "/placeholder.png"} 
                        alt={p.nama_produk} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0b] via-transparent to-transparent opacity-40"></div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="font-bold text-[14px] text-white mb-1 line-clamp-2 leading-snug group-hover:text-[#2fa84f] transition-colors min-h-[40px]">
                        {p.nama_produk}
                      </div>
                      
                      <div className="text-[#2fa84f] font-[900] text-lg mb-4 mt-1">
                        Rp {p.harga?.toLocaleString('id-ID')}
                      </div>

                      <div className="flex justify-between items-center pt-3 mt-auto border-t border-white/10 text-[9px] font-bold uppercase tracking-widest text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="3"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z"/><path d="M19 2v10"/></svg>
                          {p.kategori?.nama_kategori || "Umum"}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          {p.seller?.username || "Anonim"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      {/* ── FOOTER (MT-AUTO) ── */}
      <footer className="bg-[#0a110b] pt-10 pb-6 px-8 text-white relative z-10 border-t border-white/5 text-center mt-auto">
         <div className="max-w-6xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
               <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
               </div>
               <span className="text-sm font-black text-white tracking-tighter uppercase">GreenMarket</span>
            </div>
            <p className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase m-0">
               © 2026 GREENMARKET INC. All Rights Reserved.
            </p>
         </div>
      </footer>
    </div>
  );
}