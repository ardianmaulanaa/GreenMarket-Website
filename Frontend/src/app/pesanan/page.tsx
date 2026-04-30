"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PesananPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("semua");

  // 1. Sinkronisasi Data User
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

  const isSeller = user.role === "SELLER";

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
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>
            <Link href="/profile" className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center text-white shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto pt-[100px] pb-[60px] px-8 flex gap-7 relative z-10 w-full">
        
        {/* ── SIDEBAR (Luxury Dark Card) ── */}
        <aside className="w-[260px] shrink-0">
          <div className="sticky top-[84px] bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/30" alt="Avatar" />
              </div>
              <h3 className="text-[15px] font-[800] text-white m-0">{user.nama || "Loading..."}</h3>
              <p className="text-[11px] text-[#2fa84f] m-0 mt-1 uppercase font-bold tracking-widest">{user.role}</p>
            </div>
            
            <nav className="flex flex-col gap-1.5">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-[13px]">Profil Saya</span>
              </Link>
              <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-[13px]">Alamat</span>
              </Link>
              <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_4px_12px_rgba(47,168,79,0.25)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span className="text-[13px]">Pesanan Saya</span>
              </Link>

              {isSeller ? (
                <Link href="/seller/dashboard" className="flex items-center gap-3 p-3.5 rounded-xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="text-[13px]">Dashboard Toko</span>
                </Link>
              ) : (
                <Link href="/register-penjual" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span className="text-[13px]">Mulai Berjualan</span>
                </Link>
              )}
              
              <div className="my-2 border-t border-white/5" />
              <button 
                onClick={() => { localStorage.clear(); window.location.href="/login"; }}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition font-bold text-left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-[13px]">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT (List Pesanan) ── */}
        <main className="flex-1">
          <div className="bg-white rounded-[32px] p-8 border border-[#eef2ef] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f1f8e9] rounded-bl-full opacity-50 -z-0"></div>
            
            <h2 className="text-[24px] font-[800] text-[#1a2e1f] mb-8 tracking-tight relative z-10">Pesanan Saya</h2>
            
            {/* Tabs Filter */}
            <div className="flex gap-2 border-b border-[#f1f8e9] mb-8 overflow-x-auto no-scrollbar relative z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 text-[13px] font-[800] transition-all relative whitespace-nowrap uppercase tracking-wider ${
                    activeTab === tab.id ? "text-[#2fa84f]" : "text-gray-400 hover:text-[#1a2e1f]"
                  }`}
                >
                  {tab.name}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2fa84f] rounded-t-full shadow-[0_-2px_10px_rgba(47,168,79,0.3)]" />
                  )}
                </button>
              ))}
            </div>

            {/* List Pesanan */}
            <div className="space-y-6 relative z-10">
              {orders.map((order) => (
                <div key={order.id} className="border border-[#eef2ef] rounded-[28px] overflow-hidden bg-[#fcfdfc] hover:border-[#2fa84f]/20 transition-all">
                  <div className="px-7 py-5 border-b border-[#f1f8e9] flex justify-between items-center bg-white/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f1f8e9] flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </div>
                      <span className="font-[800] text-[#1a2e1f] text-[14px]">{order.shopName}</span>
                    </div>
                    <span className="text-[10px] font-[800] text-[#2fa84f] bg-[#f1f8e9] px-4 py-1.5 rounded-xl uppercase tracking-widest border border-[#2fa84f]/10">{order.status}</span>
                  </div>

                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-7 flex gap-6 border-b border-[#f1f8e9] last:border-b-0">
                      <div className="w-24 h-24 bg-[#f1f8e9] rounded-[20px] flex items-center justify-center border border-[#2fa84f]/5 overflow-hidden">
                         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="1.2"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-[800] text-[#1a2e1f] text-[16px] mb-2 leading-tight">{item.name}</h4>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-[800] text-[#2fa84f] bg-[#f1f8e9] px-2 py-1 rounded-md uppercase tracking-tighter">{item.condition}</span>
                                <p className="text-[13px] text-[#6b7c71] font-medium flex items-center gap-1.5">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                  {item.location} • {item.quantity} barang
                                </p>
                            </div>
                          </div>
                          <p className="font-[800] text-[#1a2e1f] text-[16px]">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="px-7 py-6 bg-white border-t border-[#f1f8e9] flex justify-between items-center">
                    <div>
                      <p className="text-[11px] text-[#6b7c71] font-bold uppercase tracking-wider mb-1">Total Pesanan</p>
                      <p className="text-[20px] font-[800] text-[#2fa84f]">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex gap-4">
                      <button className="px-7 py-3 text-[12px] font-[800] text-[#6b7c71] border border-[#e0e6e2] rounded-2xl hover:bg-gray-50 transition-colors uppercase tracking-widest">Detail</button>
                      <button className="px-7 py-3 text-[12px] font-[800] text-white bg-[#2fa84f] rounded-2xl hover:bg-[#268c41] transition-all shadow-[0_8px_20px_rgba(47,168,79,0.2)] uppercase tracking-widest hover:-translate-y-0.5">Beli Lagi</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}