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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-10">
            
            {/* Logo GreenMarket */}
            <Link href="/" className="flex items-center gap-2.5 group no-underline">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight uppercase hidden sm:block">Green<span className="text-[#2fa84f]">Market</span></span>
            </Link>

            <div className="flex items-center gap-2 lg:gap-4">
              {/* Tombol Dashboard Seller */}
              <Link href="/panel-penjual" className="hidden lg:flex px-4 py-2 rounded-lg bg-white/5 text-[#2fa84f] text-sm font-bold hover:bg-white/10 transition-all items-center gap-2 no-underline border border-transparent hover:border-[#2fa84f]/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#2fa84f] animate-pulse"></div>
                 Dashboard Seller
              </Link>
              
              {/* Menu Komunitas */}
              <Link href="/komunitas" className="text-white/70 font-bold text-sm no-underline hover:text-[#2fa84f] transition-colors flex items-center gap-2 px-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Komunitas
              </Link>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-10 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input type="text" placeholder="Cari produk di toko Anda..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] transition-all placeholder-gray-500" />
            </div>
          </div>

          {/* Ikon Kanan (Wishlist + Profil) */}
          <div className="flex items-center gap-4">
            
            {/* Wishlist Dikembalikan */}
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] hover:bg-white/10 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>

            <Link href="/profile" className="flex items-center gap-3 pl-2 group no-underline">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">Seller Mode</p>
                  <p className="text-[10px] text-gray-500 m-0">Online</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-emerald-400 p-[2px] shadow-lg group-hover:scale-105 transition-transform">
                 <div className="w-full h-full rounded-full bg-[#0d130e] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
               </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow container max-w-[1600px] mx-auto pt-28 px-6 pb-20 relative z-10 w-full">
        
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Produk', val: dbProducts.length, icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', color: 'text-blue-400' },
            { label: 'Stok Hampir Habis', val: dbProducts.filter(p => p.stok < 10).length, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-orange-400' },
            { label: 'Total Stok', val: dbProducts.reduce((acc, p) => acc + p.stok, 0), icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-emerald-400' },
            { label: 'Produk Aktif', val: dbProducts.length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#1a1f1b]/70 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon}/></svg>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Update Real-time</span>
              </div>
              <p className="text-2xl font-black text-white">{stat.val}</p>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-[#1a1f1b]/80 border border-white/10 rounded-[28px] p-6 sticky top-28 backdrop-blur-xl shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-[#2fa84f] rounded-full"></div>
                <h2 className="text-lg font-bold text-white tracking-tight m-0">Manajemen Toko</h2>
              </div>
              
              <div className="space-y-1 mb-8">
                {["Semua Produk", "Stok Tersedia", "Stok Kosong", "Arsip"].map((item, idx) => (
                  <label key={item} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
                    <input type="radio" name="filter" defaultChecked={idx === 0} className="accent-[#2fa84f] w-4 h-4 cursor-pointer" />
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">{item}</span>
                  </label>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                 <button onClick={resetFilters} className="w-full py-3.5 bg-[#2fa84f] hover:bg-[#268c41] text-white rounded-2xl font-bold text-xs transition-all shadow-[0_10px_20px_rgba(47,168,79,0.2)] uppercase tracking-widest cursor-pointer border-none">
                  Tambah Produk Baru
                </button>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight m-0">Katalog Produk Saya</h3>
                <p className="text-gray-400 text-sm mt-1 m-0">Kelola listing dan pantau ketersediaan produk Anda.</p>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 bg-[#1a1f1b]/50 rounded-lg border border-white/10 text-white hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                 </button>
                 <button className="p-2 bg-[#2fa84f] rounded-lg border border-[#2fa84f] text-white transition-all shadow-lg shadow-[#2fa84f]/30 cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                 </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-[3px] border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-bold text-xs tracking-widest uppercase">Sinkronisasi Katalog...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {dbProducts.map((p) => (
                  <div key={p.id_produk} className="group bg-[#1a1f1b]/60 backdrop-blur-md border border-white/10 rounded-[24px] overflow-hidden hover:border-[#2fa84f]/50 transition-all duration-500 flex flex-col relative shadow-xl">
                    
                    {/* Hover Quick Actions */}
                    <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                       <button className="w-8 h-8 rounded-full bg-white text-[#0a0f0b] flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer border-none">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                       </button>
                       <button className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer border-none">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                       </button>
                    </div>

                    <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                      <Image 
                        src={p.image_url || "/placeholder.png"} 
                        alt={p.nama_produk} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0b] via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-3 left-3">
                         <span className="px-2 py-1 rounded-md bg-[#2fa84f] text-[9px] font-black text-white uppercase tracking-tighter shadow-md">
                            {p.kategori?.nama_kategori || 'Produk'}
                         </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="font-bold text-[15px] text-white mb-2 line-clamp-1 group-hover:text-[#2fa84f] transition-colors m-0">
                        {p.nama_produk}
                      </h4>

                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-[#2fa84f] text-[10px] font-black uppercase">Rp</span>
                        <span className="text-xl font-black text-white leading-none">
                          {p.harga?.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="mt-auto space-y-3">
                        {/* Progress Bar Stok */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-tighter">
                             <span className="text-gray-400">Ketersediaan Stok</span>
                             <span className={p.stok < 10 ? 'text-red-400' : 'text-[#2fa84f]'}>{p.stok} Unit</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full transition-all duration-1000 ${p.stok < 10 ? 'bg-red-500' : 'bg-[#2fa84f]'}`}
                               style={{ width: `${Math.min((p.stok / 100) * 100, 100)}%` }}
                             ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-gray-500"></div>
                            SKU-{p.id_produk}00
                          </span>
                          <span className="text-[10px] text-emerald-400 font-black italic">AKTIF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a110b] pt-10 pb-6 px-8 text-white relative z-10 border-t border-white/5 text-center mt-auto">
         <div className="max-w-6xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
               <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
               </div>
               <span className="text-sm font-black text-white tracking-tighter uppercase">GreenMarket</span>
            </div>
            <p className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase m-0">
               © 2026 GREENMARKET INC. Seller Center.
            </p>
         </div>
      </footer>
    </div>
  );
}