"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function PesananPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("semua");
  const [user, setUser] = useState({ nama: "", role: "" });

  useEffect(() => {
    // Efek loading transisi halaman
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        nama: userData.username || userData.name || "User",
        role: userData.role || "BUYER"
      });
    }

    return () => clearTimeout(timer);
  }, []);

  const isSeller = user.role === "SELLER" || user.role === "Penjual";

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

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

  // ── TAMPILAN LOADING SCREEN ──
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Memuat Pesanan...
        </p>
      </div>
    );
  }

  // ── TAMPILAN UTAMA ──
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>
        </div>

        {/* SEARCH BAR (Disembunyikan di mobile) */}
        <div className="flex-1 max-w-xl mx-10 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari pesanan Anda..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/beranda-dashboard" className="text-gray-400 hover:text-white text-xs font-bold transition-colors bg-transparent border-none cursor-pointer mr-2 no-underline flex items-center gap-1">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             Kembali
          </Link>
          <div className="flex items-center gap-3 pl-2 group">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">{user.nama}</p>
                  <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">{user.role}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
                 <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                    {user.nama ? user.nama.charAt(0) : "U"}
                 </div>
               </div>
          </div>
        </div>
      </nav>

      {/* ── KONTEN UTAMA ── */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">
        
        {/* ── SIDEBAR PROFIL ── */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl">
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff&size=128`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/40 object-cover shadow-[0_0_15px_rgba(47,168,79,0.3)]" alt="Avatar" />
              </div>
              <h3 className="text-lg font-[800] text-white m-0 tracking-tight">{user.nama || "Loading..."}</h3>
              <p className="text-[10px] text-[#2fa84f] m-0 mt-1.5 uppercase font-black tracking-[2px]">{user.role}</p>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-[#2fa84f] transition-colors"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-sm">Profil Saya</span>
              </Link>
              
              <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#2fa84f] transition-colors"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-sm">Daftar Alamat</span>
              </Link>

              {/* Tanda Aktif pada Pesanan */}
              <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_4px_15px_rgba(47,168,79,0.2)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span className="text-sm">Pesanan Saya</span>
              </Link>

              {!isSeller ? (
                <Link href="/register-penjual" className="flex items-center gap-3 p-3.5 rounded-2xl text-[#2fa84f] bg-[#2fa84f]/10 border border-[#2fa84f]/20 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span className="text-sm">Mulai Berjualan</span>
                </Link>
              ) : (
                <Link href="/panel-penjual" className="flex items-center gap-3 p-3.5 rounded-2xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="text-sm">Panel Inventaris</span>
                </Link>
              )}
              
              <div className="my-4 border-t border-white/5" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition font-bold text-left group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-sm">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── DAFTAR PESANAN UTAMA ── */}
        <main className="flex-1">
          <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 border border-white/5 shadow-2xl relative overflow-hidden h-full">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#2fa84f] rounded-full opacity-[0.15] blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 mb-8">
              <h2 className="text-3xl font-[800] text-white tracking-tight m-0">Pesanan Saya</h2>
              <p className="text-sm text-gray-400 mt-2 font-medium">Pantau status pengiriman dan riwayat belanja Anda.</p>
            </div>
            
            {/* Tabs Filter */}
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

            {/* List Pesanan */}
            <div className="space-y-6 relative z-10">
              {orders.map((order) => (
                <div key={order.id} className="border border-white/10 rounded-[28px] overflow-hidden bg-[#1a1f1b]/50 hover:border-[#2fa84f]/40 transition-all shadow-lg backdrop-blur-sm">
                  
                  {/* Header Pesanan */}
                  <div className="px-7 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2fa84f] text-white flex items-center justify-center shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </div>
                      <span className="font-bold text-white text-[15px]">{order.shopName}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#2fa84f] bg-[#2fa84f]/10 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-[#2fa84f]/20 shadow-inner">
                      {order.status}
                    </span>
                  </div>

                  {/* Body Pesanan (Items) */}
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-7 flex gap-6 border-b border-white/5 last:border-b-0">
                      <div className="w-24 h-24 bg-[#0a110b] rounded-[20px] flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                         {/* Ganti dengan Image produk yang asli jika ada */}
                         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="1.2" className="opacity-50"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-white text-[16px] mb-3 leading-snug">{item.name}</h4>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[10px] font-black text-[#2fa84f] border border-[#2fa84f]/30 bg-[#2fa84f]/10 px-2.5 py-1.5 rounded-lg uppercase tracking-wider">{item.condition}</span>
                                <p className="text-[12px] text-gray-400 font-medium flex items-center gap-1.5">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                  {item.location} • {item.quantity} barang
                                </p>
                            </div>
                          </div>
                          <p className="font-bold text-white text-[16px] whitespace-nowrap mt-2 sm:mt-0">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Footer Pesanan */}
                  <div className="px-7 py-6 bg-[#0a110b]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[2px] mb-1">Total Pesanan</p>
                      <p className="text-[22px] font-black text-[#2fa84f] tracking-tight">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-7 py-3.5 text-xs font-bold text-gray-300 border border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/30 hover:text-white transition-all uppercase tracking-widest">Detail</button>
                      <button className="flex-1 sm:flex-none px-7 py-3.5 text-xs font-bold text-white bg-[#2fa84f] rounded-2xl hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] uppercase tracking-widest hover:-translate-y-1">Beli Lagi</button>
                    </div>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[24px] border border-dashed border-white/10 text-gray-500 font-bold">
                  Belum ada pesanan tersimpan.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-transparent py-8 text-center border-t border-[#1a2e1f]/10 mt-auto relative z-10">
         <p className="text-[#1a2e1f]/50 text-[10px] font-black tracking-[4px] uppercase m-0">
            © 2026 GREENMARKET. ALL SELLER & BUYER CATALOG.
         </p>
      </footer>
    </div>
  );
}