"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface Produk {
  id_produk: string;
  id_user_seller: number; 
  nama_produk: string;
  harga: number;
  stok: number;
  status_produk?: string;
  deskripsi: string; 
  detail?: {
    konten_deskripsi: string;
    catatan_penjual?: string;
  };
  fotos: { url_foto: string; }[]; 
  kategori?: { nama_kategori: string; };
  seller?: { username: string; email: string; };
}

export default function BerandaDashboard() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dbProducts, setDbProducts] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const router = useRouter();

  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem("userId") : null;
  
  const myProducts = dbProducts.filter(p => String(p.id_user_seller) === String(storedUserId));
  
  const totalProduk = myProducts.length;
  const totalStok = myProducts.reduce((acc, curr) => acc + curr.stok, 0);
  const produkMenipis = myProducts.filter(p => p.stok < 5).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    const storedRole = localStorage.getItem("userRole");
    const storedUser = localStorage.getItem("user");
    
    setUserRole(storedRole);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.username) setUserName(parsed.username);
      } catch (e) {}
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = "http://localhost:5050/api/products";
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        
        setDbProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error Fetching:", error);
        setDbProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => clearTimeout(timer);
  }, []);

  const resetFilters = () => {
    const inputs = document.querySelectorAll('.filter-check input') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => (input.checked = false));
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Menyiapkan Ekosistem...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none"></div>

      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 no-underline group">
            <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            {userRole === "SELLER" ? (
              <Link href="/panel-penjual" className="bg-[#2fa84f] text-white px-5 py-2.5 rounded-xl text-xs font-bold no-underline hover:bg-[#268c41] transition-all shadow-[0_4px_12px_rgba(47,168,79,0.3)] flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Panel Inventaris
              </Link>
            ) : (
              <Link href="/register-penjual" className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold no-underline hover:bg-[#2fa84f] hover:border-transparent transition-all flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Mulai Berjualan
              </Link>
            )}
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-10">
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
          <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </Link>

          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase transition-colors bg-transparent border-none cursor-pointer mx-2">
            Logout
          </button>

          <Link href="/profile" className="flex items-center gap-3 group no-underline border-l border-white/10 pl-4">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">{userName}</p>
                  <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">{userRole === "SELLER" ? "Seller Hub" : "Buyer"}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
                 <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                    {userName.charAt(0)}
                 </div>
               </div>
          </Link>
        </div>
      </nav>

      <main className="flex-grow container max-w-[1600px] mx-auto pt-24 px-6 pb-20 relative z-10 w-full">
        
        <div className="w-full h-[240px] md:h-[280px] rounded-[32px] overflow-hidden relative mb-8 shadow-2xl border border-white/10">
          <img 
            src="https://images.unsplash.com/photo-1536882240095-0379873feb4e?q=80&w=1000&auto=format&fit=crop" 
            alt="AI Generated Leaf"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e1f]/95 via-[#1a2e1f]/60 to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
            <span className="text-[#2fa84f] font-black tracking-widest text-[10px] md:text-xs uppercase mb-2 drop-shadow-md">
              {userRole === "SELLER" ? "Seller Dashboard" : "GreenMarket Explorer"}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-xl max-w-2xl leading-tight">
              {userRole === "SELLER" ? "Pusat Kendali Bisnis Hijau Anda." : "Temukan Gaya Hidup Berkelanjutan."}
            </h1>
            <p className="text-white/80 font-medium max-w-lg text-xs md:text-sm leading-relaxed drop-shadow-md">
              {userRole === "SELLER" 
                ? "Pantau inventaris, tingkatkan penjualan, dan jadilah agen perubahan untuk lingkungan bersama ribuan penjual lainnya." 
                : "Jelajahi ribuan produk ramah lingkungan dari penjual terverifikasi dan dukung masa depan bumi dari langkah terkecil."}
            </p>
          </div>
        </div>

        {userRole === "SELLER" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
             {/* Stats Items */}
             <div className="bg-[#1a1f1b]/80 backdrop-blur-md p-5 rounded-[24px] border border-white/5 shadow-xl">
              <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">Produk Saya</p>
              <h4 className="text-2xl font-black text-white">{totalProduk} <span className="text-[12px] text-gray-500 font-medium">Item</span></h4>
            </div>
            <div className="bg-[#1a1f1b]/80 backdrop-blur-md p-5 rounded-[24px] border border-white/5 shadow-xl">
              <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">Total Stok Saya</p>
              <h4 className="text-2xl font-black text-[#2fa84f]">{totalStok} <span className="text-[12px] text-gray-500 font-medium">Unit</span></h4>
            </div>
            <div className="bg-[#1a1f1b]/80 backdrop-blur-md p-5 rounded-[24px] border border-white/5 shadow-xl">
              <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">Stok Menipis</p>
              <h4 className="text-2xl font-black text-red-500">{produkMenipis} <span className="text-[12px] text-gray-500 font-medium">Item</span></h4>
            </div>
            <div className="bg-[#1a1f1b]/80 backdrop-blur-md p-5 rounded-[24px] border border-[#2fa84f]/20 shadow-xl flex items-center justify-between">
               <div>
                <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">Status Seller</p>
                <h4 className="text-lg font-black text-white uppercase tracking-tight">Terverifikasi</h4>
               </div>
               <div className="w-3 h-3 bg-[#2fa84f] rounded-full animate-pulse shadow-[0_0_10px_#2fa84f]"></div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[280px] shrink-0">
             {/* Filter Area */}
             <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl sticky top-28">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-[#2fa84f] rounded-full shadow-[0_0_8px_#2fa84f]"></div>
                <h2 className="text-lg font-[800] text-white m-0 tracking-tight">Filter Pasar</h2>
              </div>
              <div className="space-y-4 mb-8">
                {["Pakaian Organik", "Daur Ulang", "Ramah Lingkungan", "Terlaris"].map((item) => (
                  <label key={item} className="filter-check flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="accent-[#2fa84f] w-4 h-4 cursor-pointer bg-white/5 border-white/10 rounded" />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{item}</span>
                  </label>
                ))}
              </div>
              <button onClick={resetFilters} className="w-full py-3.5 bg-white/5 text-gray-400 border border-transparent hover:border-white/10 rounded-2xl font-bold text-xs hover:bg-[#2fa84f] hover:text-white transition-all uppercase tracking-widest">
                Reset Filter
              </button>
            </div>
          </aside>

          <section className="flex-1">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-2xl font-[800] text-[#1a2e1f] tracking-tight m-0">
                Eksplorasi Katalog Hijau
              </h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#2fa84f]">
                <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-[11px] uppercase tracking-[3px] animate-pulse text-[#1a2e1f]">Memuat Katalog...</p>
              </div>
            ) : dbProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-[40px] border border-dashed border-[#2fa84f]/30 text-[#1a2e1f] font-bold shadow-sm">
                Belum ada produk di pasar.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {dbProducts.map((p) => (
                  /* 🟡 [DIUBAH DISINI]: Link sekarang MEMBUNGKUS div kartu produk agar bisa diklik seutuhnya */
                  <Link 
                    key={p.id_produk} 
                    href={`/katalog-detail/${p.id_produk}`} 
                    className="no-underline block group"
                  >
                    <div className="bg-[#1a1f1b]/90 backdrop-blur-md border border-white/5 rounded-[28px] overflow-hidden hover:border-[#2fa84f]/50 transition-all duration-500 flex flex-col relative shadow-xl hover:-translate-y-1 h-full">
                      
                      <div className="relative aspect-square bg-[#0a110b] overflow-hidden">
                        <Image 
                          src={p.fotos?.[0]?.url_foto || "https://via.placeholder.com/500"} 
                          alt={p.nama_produk} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                        />
                        <div className="absolute top-4 left-4 bg-[#2fa84f] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                          {p.kategori?.nama_kategori || "Eco Product"}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <h4 className="font-bold text-[14px] text-white mb-1.5 line-clamp-1 leading-snug group-hover:text-[#2fa84f] transition-colors">
                          {p.nama_produk}
                        </h4>
                        <p className="text-gray-400 text-[11px] mb-4 line-clamp-2 italic opacity-70 leading-relaxed">
                          {p.deskripsi}
                        </p>
                        <div className="text-[#2fa84f] font-[900] text-lg mb-4 mt-auto tracking-tight">
                          <span className="text-[11px] mr-0.5">Rp</span>
                          {p.harga?.toLocaleString('id-ID')}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <span className="text-[9px] text-gray-500 uppercase font-black truncate max-w-[100px] flex items-center gap-1.5">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            {p.seller?.username || "Toko Hijau"}
                          </span>
                          <span className="text-[9px] text-[#2fa84f] bg-[#2fa84f]/10 px-2 py-1 rounded font-black uppercase">
                            {p.stok} Unit
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-transparent py-8 text-center border-t border-[#1a2e1f]/10 mt-auto relative z-10">
         <p className="text-[#1a2e1f]/50 text-[10px] font-black tracking-[4px] uppercase m-0">
            © 2026 GREENMARKET. ALL SELLER & BUYER CATALOG.
         </p>
      </footer>
    </div>
  );
}