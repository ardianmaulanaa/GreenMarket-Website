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
      
      {/* Dekorasi Glow Hijau */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Luxury Dark Glassmorphism) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-md border-b border-white/5 shadow-lg py-3 px-8 flex items-center justify-between h-[68px]">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_4px_12px_rgba(47,168,79,0.35)] group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/>
              </svg>
            </div>
            <span className="text-[18px] font-[800] text-white tracking-[-0.5px]">GreenMarket</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-[#2fa84f]/30 bg-[#2fa84f]/10 flex items-center justify-center text-[#2fa84f] transition-all shadow-[0_0_15px_rgba(47,168,79,0.2)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>
            <Link href="/profile" className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center text-white shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-[1000px] mx-auto pt-[100px] pb-[60px] px-8 relative z-10 w-full">
        <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div>
                <h1 className="text-[28px] font-[800] text-[#1a2e1f] tracking-tight">Wishlist Saya</h1>
                <p className="text-[14px] text-[#6b7c71] font-medium">Barang-barang impian untuk masa depan yang lebih hijau.</p>
            </div>
        </div>

        <div className="bg-white rounded-[32px] border border-[#eef2ef] shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="grid grid-cols-1 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="group border border-[#f1f8e9] rounded-[28px] p-6 flex flex-col sm:flex-row items-center gap-8 hover:border-[#2fa84f]/30 hover:shadow-[0_15px_40px_rgba(47,168,79,0.08)] transition-all duration-500 bg-[#fcfdfc]">
                  
                  {/* Image Container */}
                  <div className="w-full sm:w-[160px] h-[160px] bg-[#f8faf9] rounded-[24px] flex items-center justify-center border border-[#f1f8e9] overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="1.2" className="opacity-20"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow text-center sm:text-left">
                    <span className="inline-block px-3 py-1.5 bg-[#f1f8e9] text-[#2fa84f] text-[10px] font-[800] rounded-xl uppercase tracking-widest border border-[#2fa84f]/10 mb-3">
                       🌿 {item.category}
                    </span>
                    <h3 className="font-[800] text-[#1a2e1f] text-[19px] mb-2 leading-tight group-hover:text-[#2fa84f] transition-colors">{item.name}</h3>
                    <p className="text-[#2fa84f] font-[800] text-[22px] mb-3">Rp {item.price.toLocaleString('id-ID')}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4 text-[#6b7c71] text-[13px] font-bold">
                        <span className="flex items-center gap-1.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            {item.location}
                        </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-[180px] shrink-0">
                    <Link href={`/produk/${item.id}`} className="flex-1 text-center bg-[#2fa84f] text-white font-[800] py-3.5 px-6 rounded-2xl text-[13px] hover:bg-[#268c41] shadow-[0_8px_20px_rgba(47,168,79,0.2)] transition-all hover:-translate-y-0.5 active:scale-95">
                      Beli Sekarang
                    </Link>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-red-500 font-[800] py-3.5 px-6 rounded-2xl border border-red-100 hover:bg-red-50 transition-all text-[13px] active:scale-95"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {wishlistItems.length === 0 && (
              <div className="text-center py-24 bg-[#fcfdfc] rounded-[32px] border-2 border-dashed border-[#eef2ef]">
                <div className="w-20 h-20 bg-[#f1f8e9] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h2 className="text-[20px] font-[800] text-[#1a2e1f] mb-2">Wishlist-mu masih kosong</h2>
                <p className="text-[#6b7c71] mb-10 font-medium">Yuk, jelajahi ribuan produk ramah lingkungan lainnya!</p>
                <Link href="/beranda-dashboard" className="bg-[#2fa84f] text-white px-10 py-4 rounded-2xl font-[800] shadow-xl hover:bg-[#268c41] transition-all hover:-translate-y-1 inline-block">
                  Jelajahi Produk Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#0a110b] pt-16 pb-8 px-8 text-white mt-auto relative z-10 border-t border-white/5 text-center">
         <p className="text-white/20 text-[11px] font-bold tracking-[3px] uppercase">© 2026 GREENMARKET INC. SAVING THE EARTH.</p>
      </footer>
    </div>
  );
}