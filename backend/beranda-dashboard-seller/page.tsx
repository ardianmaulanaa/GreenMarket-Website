"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface Produk {
  id_produk: string; // Menggunakan string sesuai schema Prisma (uuid)
  nama_produk: string;
  harga: number;
  stok: number;
  status_produk?: string;
  deskripsi: string; // Kolom kategori (Pakaian Organik, dll)
  
  // Tabel relasi deskripsi manual
  detail?: {
    konten_deskripsi: string;
    catatan_penjual?: string;
  };

  fotos: {
    url_foto: string;
  }[]; 
  
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
            <span className="text-[18px] font-[800] text-white tracking-[-0.5px]">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/panel-penjual" className="bg-[#2fa84f] text-white px-5 py-2 rounded-xl text-[11px] font-bold no-underline hover:bg-[#268c41] transition-all shadow-lg flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Unggah Produk
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
          <input type="text" placeholder="Cari di katalog saya..." className="bg-transparent border-none outline-none w-full text-sm text-white placeholder:text-gray-500" />
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

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow container mx-auto pt-28 px-4 lg:px-10 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          
          <aside className="w-full lg:w-[240px] shrink-0">
            <div className="bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[24px] p-6 border border-white/5 shadow-2xl sticky top-28">
              <h2 className="text-lg font-[800] text-white mb-6 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2.5"><line x1="4" y1="21" x2="4" y2="14"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
                Filter Pasar
              </h2>
              <div className="space-y-3 mb-6">
                {["Produk Terlaris", "Rating Tertinggi", "Stok Tersedia", "Promo Diskon"].map((item) => (
                  <label key={item} className="filter-check flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="accent-[#2fa84f] w-4 h-4 cursor-pointer rounded" />
                    <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{item}</span>
                  </label>
                ))}
              </div>
              <button onClick={resetFilters} className="w-full py-2.5 bg-[#f1f8e9] text-[#2fa84f] rounded-xl font-bold text-[11px] hover:bg-[#2fa84f] hover:text-white transition-all uppercase tracking-wider">
                Reset Filter
              </button>
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-6">
              <h3 className="text-xl font-[800] text-white tracking-tight">Katalog Produk Saya</h3>
              <p className="text-gray-400 text-xs mt-1 font-medium">Pantau performa penjualan dan stok barang secara real-time.</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#2fa84f]">
                <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold tracking-wide text-xs">Sinkronisasi data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {dbProducts.map((p) => (
                  <div key={p.id_produk} className="group bg-[#1a1f1b]/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-[#2fa84f]/60 hover:-translate-y-1 transition-all duration-300 shadow-lg flex flex-col">
                    
                    {/* Gambar & Badge */}
                    <div className="relative aspect-square overflow-hidden bg-white/5">
                      <Image 
                        src={p.fotos && p.fotos.length > 0 ? p.fotos[0].url_foto : "/placeholder.png"} 
                        alt={p.nama_produk} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      {/* Badge Kategori */}
                      <div className="absolute top-2 left-2 bg-[#2fa84f]/90 text-white text-[9px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm shadow-md">
                        {p.deskripsi}
                      </div>
                    </div>

                    {/* Konten Detail */}
                    <div className="p-3 flex flex-col flex-grow">
                      <h4 className="font-medium text-[13px] text-white/90 mb-1 line-clamp-1 leading-snug">
                        {p.nama_produk}
                      </h4>

                      {/* Deskripsi Manual */}
                      <p className="text-gray-400 text-[10px] mb-3 line-clamp-2 italic opacity-70">
                        {p.detail?.konten_deskripsi || "Tidak ada detail produk..."}
                      </p>

                      <div className="text-[#2fa84f] font-bold text-base mb-1 mt-auto">
                        <span className="text-[10px] mr-0.5 font-medium">Rp</span>
                        {p.harga?.toLocaleString('id-ID')}
                      </div>

                      {/* Info Rating & Terjual */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center text-[10px] text-yellow-500 font-bold">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="mr-0.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          4.9
                        </div>
                        <div className="w-[1px] h-3 bg-white/10"></div>
                        <div className="text-[10px] text-gray-400">Tersedia: {p.stok}</div>
                      </div>

                      {/* Footer Kartu */}
                      <div className="pt-2.5 border-t border-white/5 flex justify-between items-center text-[10px] font-semibold">
                        <span className="text-gray-500 flex items-center gap-1 uppercase tracking-tighter">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          {p.seller?.username || "Toko"}
                        </span>
                        <span className="text-[#2fa84f] text-[9px] font-black uppercase">Aktif</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-[#0a110b] pt-10 pb-6 px-8 text-white relative z-10 border-t border-white/5 text-center mt-auto">
         <p className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">
            © 2026 GREENMARKET INC. Seller Center.
         </p>
      </footer>
    </div>
  );
}