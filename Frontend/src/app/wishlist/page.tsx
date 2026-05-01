"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WishlistPage() {
  const pathname = usePathname();
  const [user, setUser] = useState({ nama: "", role: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        nama: userData.username || userData.name || "User",
        role: userData.role || ""
      });
    }
  }, []);

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Kamera DSLR Bekas - Kondisi 95%",
      price: 1200000,
      location: "Jakarta Selatan",
      category: "Elektronik",
      image: ""
    },
    {
      id: 2,
      name: "Sepeda Gunung Wimcycle Ramah Lingkungan",
      price: 800000,
      location: "Bandung",
      category: "Olahraga",
      image: ""
    }
  ]);

  const removeItem = (id: number) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    // ── BACKGROUND GRADASI SINKRON ──
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden flex flex-col">
      
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Sesuai Dashboard max-w-1600px) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2.5 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase hidden sm:block">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Wishlist Icon Aktif */}
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-[#2fa84f]/40 bg-[#2fa84f]/10 flex items-center justify-center text-[#2fa84f] transition-all shadow-[0_0_15px_rgba(47,168,79,0.2)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>

            <Link href="/profile" className="flex items-center gap-3 pl-2 group no-underline border-l border-white/10 pt-1 pb-1">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">Profil Saya</p>
                  <p className="text-[10px] text-gray-400 m-0 uppercase">{user.role || 'User'}</p>
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
      <main className="max-w-[1200px] mx-auto pt-[120px] pb-[60px] px-6 lg:px-8 relative z-10 w-full flex-1">
        <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-[#1a1f1b]/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-[#2fa84f]/20">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div>
                <h1 className="text-[28px] lg:text-[32px] font-[800] text-white tracking-tight m-0">Wishlist Saya</h1>
                <p className="text-[14px] text-gray-400 font-medium m-0 mt-1">Barang-barang impian untuk masa depan yang lebih hijau.</p>
            </div>
        </div>

        <div className="bg-[#1a1f1b]/60 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#2fa84f] rounded-bl-full opacity-10 blur-3xl -z-0 pointer-events-none"></div>

          <div className="p-6 sm:p-10 relative z-10">
            <div className="grid grid-cols-1 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="group bg-white/5 border border-white/10 rounded-[28px] p-6 flex flex-col md:flex-row items-center gap-8 hover:border-[#2fa84f]/40 hover:bg-white/10 transition-all duration-500 shadow-lg">
                  
                  {/* Image Container */}
                  <div className="w-full md:w-[160px] h-[160px] bg-black/30 rounded-[24px] flex items-center justify-center border border-white/5 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="1.2" className="opacity-40"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow text-center md:text-left">
                    <span className="inline-block px-3.5 py-1.5 bg-[#2fa84f]/10 text-[#2fa84f] text-[10px] font-[800] rounded-xl uppercase tracking-widest border border-[#2fa84f]/20 mb-3">
                       🌿 {item.category}
                    </span>
                    <h3 className="font-[800] text-white text-[20px] mb-2 leading-tight group-hover:text-[#2fa84f] transition-colors m-0">{item.name}</h3>
                    <p className="text-[#2fa84f] font-[800] text-[24px] mb-4 m-0 mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 text-[13px] font-bold">
                        <span className="flex items-center gap-1.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {item.location}
                        </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-[180px] shrink-0">
                    <Link href={`/produk/${item.id}`} className="flex-1 flex items-center justify-center text-center bg-[#2fa84f] text-white font-[800] py-3.5 px-6 rounded-2xl text-[13px] hover:bg-[#268c41] shadow-[0_8px_20px_rgba(47,168,79,0.3)] transition-all hover:-translate-y-0.5 no-underline">
                      Beli Sekarang
                    </Link>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-red-400 font-[800] py-3.5 px-6 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all text-[13px] cursor-pointer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {wishlistItems.length === 0 && (
              <div className="text-center py-24 bg-white/5 rounded-[32px] border-2 border-dashed border-white/10 mt-2">
                <div className="w-20 h-20 bg-[#2fa84f]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#2fa84f]/20 shadow-lg">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h2 className="text-[22px] font-[800] text-white mb-2 tracking-tight m-0">Wishlist-mu masih kosong</h2>
                <p className="text-gray-400 mb-10 font-medium text-sm m-0 mt-1">Yuk, jelajahi ribuan produk ramah lingkungan lainnya!</p>
                <Link href="/beranda-dashboard" className="bg-[#2fa84f] text-white px-10 py-4 rounded-2xl font-[800] shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:bg-[#268c41] transition-all hover:-translate-y-1 inline-block no-underline">
                  Jelajahi Produk Sekarang
                </Link>
              </div>
            )}
          </div>
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
               © 2026 GREENMARKET INC. All Rights Reserved.
            </p>
         </div>
      </footer>
    </div>
  );
}