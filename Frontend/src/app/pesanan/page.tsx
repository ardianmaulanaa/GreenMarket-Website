"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PesananPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("semua");

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

  const isSeller = user.role === "SELLER" || user.role === "Penjual";

  const orders = [
    {
      id: 1,
      shopName: "EcoLiving Indonesia",
      status: "SELESAI",
      statusDesc: "Pesanan tiba di alamat tujuan.",
      items: [
        {
          name: "Tempat Pensil Organik - Ramah Lingkungan",
          quantity: 1,
          price: 10000,
          condition: "Bekas",
          location: "Bandung",
        },
      ],
      totalPrice: 10000,
    },
    {
      id: 2,
      shopName: "HijauKertas",
      status: "SELESAI",
      statusDesc: "Diterima oleh Muhammad.",
      items: [
        {
          name: "Buku Catatan Linen - Kertas Daur Ulang",
          quantity: 1,
          price: 45000,
          condition: "Baru",
          location: "Jakarta",
        },
      ],
      totalPrice: 45000,
    },
  ];

  const tabs = [
    { id: "semua", name: "Semua" },
    { id: "belum_bayar", name: "Belum Bayar" },
    { id: "dikemas", name: "Dikemas" },
    { id: "dikirim", name: "Dikirim" },
    { id: "selesai", name: "Selesai" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Sesuai Dashboard max-w-1600px) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 pl-2 group no-underline">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0">Profil Saya</p>
                  <p className="text-[10px] text-emerald-400 m-0 uppercase">{user.role}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-emerald-400 p-[2px] shadow-lg">
                 <div className="w-full h-full rounded-full bg-[#0d130e] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
               </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── KONTEN UTAMA (Sesuai container Dashboard max-w-1600px) ── */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">
        
        {/* ── SIDEBAR (Luxury Dark Glassmorphism) ── */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[28px] p-6 border border-white/10 shadow-xl">
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/30 object-cover" alt="Avatar" />
              </div>
              <h3 className="text-[15px] font-[800] text-white m-0">{user.nama || "Loading..."}</h3>
              <p className="text-[10px] text-[#2fa84f] m-0 mt-1.5 uppercase font-black tracking-[2px]">{user.role}</p>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="group-hover:text-[#2fa84f] transition-colors"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-[13px]">Profil Saya</span>
              </Link>
              <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#2fa84f] transition-colors"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-[13px]">Daftar Alamat</span>
              </Link>
              <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_10px_20px_rgba(47,168,79,0.2)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span className="text-[13px]">Pesanan Saya</span>
              </Link>

              {!isSeller ? (
                <Link href="/register-penjual" className="flex items-center gap-3 p-3.5 rounded-xl text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 transition no-underline font-bold mt-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span className="text-[13px]">Mulai Berjualan</span>
                </Link>
              ) : (
                <Link href="/seller/dashboard" className="flex items-center gap-3 p-3.5 rounded-xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="text-[13px]">Dashboard Toko</span>
                </Link>
              )}
              
              <div className="my-4 border-t border-white/10" />
              <button 
                onClick={() => { localStorage.clear(); window.location.href="/login"; }}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition font-bold text-left group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-[13px]">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT (Dark Glassmorphism) ── */}
        <main className="flex-1">
          <div className="bg-[#1a1f1b]/60 backdrop-blur-md rounded-[32px] p-8 lg:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2fa84f] rounded-bl-full opacity-10 blur-3xl -z-0 pointer-events-none"></div>
            
            <div className="relative z-10 mb-8">
              <h2 className="text-2xl lg:text-3xl font-[800] text-white tracking-tight m-0">Pesanan Saya</h2>
              <p className="text-sm text-gray-400 mt-2 font-medium">Pantau status pengiriman dan riwayat belanja Anda.</p>
            </div>
            
            {/* Tabs Filter (Mode Gelap) */}
            <div className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar relative z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 text-[13px] font-[800] transition-all relative whitespace-nowrap uppercase tracking-wider ${
                    activeTab === tab.id ? "text-[#2fa84f]" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.name}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2fa84f] rounded-t-full shadow-[0_-2px_10px_rgba(47,168,79,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            {/* List Pesanan (Mode Gelap) */}
            <div className="space-y-6 relative z-10">
              {orders.map((order) => (
                <div key={order.id} className="border border-white/10 rounded-[28px] overflow-hidden bg-[#1a1f1b]/40 hover:border-[#2fa84f]/40 transition-all shadow-lg backdrop-blur-sm">
                  
                  {/* Header Pesanan */}
                  <div className="px-7 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2fa84f]/10 flex items-center justify-center border border-[#2fa84f]/20">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </div>
                      <span className="font-[800] text-white text-[14px]">{order.shopName}</span>
                    </div>
                    <span className="text-[10px] font-[800] text-[#2fa84f] bg-[#2fa84f]/10 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-[#2fa84f]/20">{order.status}</span>
                  </div>

                  {/* Body Pesanan (Items) */}
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-7 flex gap-6 border-b border-white/5 last:border-b-0">
                      <div className="w-24 h-24 bg-white/5 rounded-[20px] flex items-center justify-center border border-white/10 overflow-hidden">
                         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="1.2"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <h4 className="font-[800] text-white text-[16px] mb-3 leading-tight">{item.name}</h4>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[10px] font-[800] text-[#2fa84f] border border-[#2fa84f]/30 bg-[#2fa84f]/10 px-2.5 py-1 rounded-md uppercase tracking-tighter">{item.condition}</span>
                                <p className="text-[12px] text-gray-400 font-medium flex items-center gap-1.5">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                  {item.location} • {item.quantity} barang
                                </p>
                            </div>
                          </div>
                          <p className="font-[800] text-white text-[16px] whitespace-nowrap">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Footer Pesanan */}
                  <div className="px-7 py-6 bg-black/20 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Pesanan</p>
                      <p className="text-[20px] font-[800] text-[#2fa84f]">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-7 py-3 text-[12px] font-[800] text-gray-300 border border-white/20 rounded-2xl hover:bg-white/10 hover:text-white transition-colors uppercase tracking-widest">Detail</button>
                      <button className="flex-1 sm:flex-none px-7 py-3 text-[12px] font-[800] text-white bg-[#2fa84f] rounded-2xl hover:bg-[#268c41] transition-all shadow-[0_8px_20px_rgba(47,168,79,0.2)] uppercase tracking-widest hover:-translate-y-0.5">Beli Lagi</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

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
               © 2026 GREENMARKET INC. All Rights Reserved.
            </p>
         </div>
      </footer>
    </div>
  );
}