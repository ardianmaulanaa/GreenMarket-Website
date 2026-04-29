"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PesananPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("semua");

  // Data pesanan dengan nama produk eco-friendly
  const orders = [
    {
      id: 1,
      shopName: "EcoLiving Indonesia",
      shopId: "ecoliving",
      status: "SELESAI",
      statusDesc: "Pesanan tiba di alamat tujuan. diterima oleh Lainnya.",
      items: [
        {
          name: "Tempat Pensil Organik - Ramah Lingkungan",
          image: "https://placehold.co/400x400/2fa84f/white?text=EcoLiving",
          quantity: 1,
          price: 10000,
          originalPrice: null,
          condition: "Bekas",
          rating: 4.8,
          location: "Bandung",
        },
      ],
      totalPrice: 10000,
      canReview: true,
      reviewDeadline: "22-09-2026",
    },
    {
      id: 2,
      shopName: "HijauKertas",
      shopId: "hijaukertas",
      status: "SELESAI",
      statusDesc: "Pesanan tiba di alamat tujuan. diterima oleh Lainnya.",
      items: [
        {
          name: "Buku Catatan Linen - Kertas Daur Ulang",
          image: "https://placehold.co/400x400/2fa84f/white?text=HijauKertas",
          quantity: 1,
          price: 45000,
          originalPrice: null,
          condition: "Baru",
          rating: 5.0,
          location: "Jakarta",
        },
      ],
      totalPrice: 45000,
      canReview: true,
      reviewDeadline: "15-07-2026",
    },
    {
      id: 3,
      shopName: "BambooEco",
      shopId: "bambooeco",
      status: "SELESAI",
      statusDesc: "Pesanan tiba di alamat tujuan. diterima oleh Yang bersangkutan.",
      items: [
        {
          name: "Sedotan Bambu Set - 6 Pcs",
          image: "https://placehold.co/400x400/2fa84f/white?text=BambooEco",
          quantity: 1,
          price: 15000,
          originalPrice: null,
          condition: "Bekas",
          rating: 5.0,
          location: "Bogor",
        },
      ],
      totalPrice: 15000,
      canReview: true,
      reviewDeadline: "12-07-2026",
    },
    {
      id: 4,
      shopName: "GreenBag",
      shopId: "greenbag",
      status: "SELESAI",
      statusDesc: "Pesanan tiba di alamat tujuan.",
      items: [
        {
          name: "Tote Bag Organik - Katun Alami",
          image: "https://placehold.co/400x400/2fa84f/white?text=GreenBag",
          quantity: 1,
          price: 5000,
          originalPrice: null,
          condition: "Bekas",
          rating: 4.9,
          location: "Surakarta",
        },
      ],
      totalPrice: 5000,
      canReview: true,
      reviewDeadline: "11-07-2026",
    },
  ];

  const menuItems = [
    { name: "👤 Profil Saya", href: "/profile" },
    { name: "📍 Alamat", href: "/alamat" },
    { name: "🛍️ Pesanan Saya", href: "/pesanan" },
  ];

  const tabs = [
    { id: "semua", name: "Semua" },
    { id: "belum_bayar", name: "Belum Dibayar" },
    { id: "dikemas", name: "Dikemas" },
    { id: "dikirim", name: "Dikirim" },
    { id: "selesai", name: "Selesai" },
    { id: "batal", name: "Dibatalkan" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f8e9] font-sans pb-20">
      {/* NAVBAR */}
      <nav id="navbar" className="fixed top-0 w-full z-[100] bg-white border-b border-[#e0e6e2] shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/beranda-dashboard" className="text-[#2fa84f] text-2xl font-[800] no-underline">
            GreenMarket
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/wishlist" className="text-[#6b7c71] hover:text-[#2fa84f] transition text-xl flex items-center">
              🛒
            </Link>
            <div className="font-bold text-sm text-[#6b7c71]">
              Halo, Muhammad!
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto pt-28 px-4 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef] sticky top-28">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4 group">
                  <img 
                    src="https://ui-avatars.com/api/?name=Muhammad+Ardian&background=2fa84f&color=fff" 
                    className="w-full h-full rounded-full border-4 border-[#f1f8e9] object-cover" 
                    alt="Avatar"
                  />
                  <button className="absolute bottom-0 right-0 bg-[#2fa84f] text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white hover:bg-[#268c41] transition-all">
                    📷
                  </button>
                </div>
                <h6 className="font-extrabold text-[#1a2e1f] mb-1">Muhammad Ardian</h6>
                <p className="text-[12px] text-[#6b7c71] font-medium">Member Sejak 2026</p>
              </div>
              
              <hr className="my-6 border-[#f8faf9]" />

              <nav className="flex flex-col gap-2">
                <Link href="/profile" className={`flex items-center gap-3 p-3.5 rounded-xl transition no-underline ${pathname === "/profile" ? "bg-[#f1f8e9] text-[#2fa84f] font-bold" : "text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] font-medium"}`}>
                  👤 Profil Saya
                </Link>
                <Link href="/alamat" className={`flex items-center gap-3 p-3.5 rounded-xl transition no-underline ${pathname === "/alamat" ? "bg-[#f1f8e9] text-[#2fa84f] font-bold" : "text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] font-medium"}`}>
                  📍 Alamat
                </Link>
                <Link href="/pesanan" className={`flex items-center gap-3 p-3.5 rounded-xl transition no-underline ${pathname === "/pesanan" ? "bg-[#f1f8e9] text-[#2fa84f] font-bold" : "text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] font-medium"}`}>
                  🛍️ Pesanan Saya
                </Link>
                <Link href="/login" className="flex items-center gap-3 p-3.5 rounded-xl text-[#e53e3e] hover:bg-[#fff5f5] no-underline font-bold transition mt-4">
                  🚪 Keluar
                </Link>
              </nav>
            </div>
          </aside>

          {/* KONTEN PESANAN */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
              <h3 className="text-2xl font-[800] text-[#1a2e1f] mb-6">🛍️ Pesanan Saya</h3>
              
              {/* TABS */}
              <div className="flex gap-1 border-b border-[#eef2ef] mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition ${
                      activeTab === tab.id
                        ? "text-[#2fa84f] border-b-2 border-[#2fa84f]"
                        : "text-[#6b7c71] hover:text-[#1a2e1f]"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* LIST PESANAN */}
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-[#e0e6e2] rounded-2xl overflow-hidden">
                    {/* Header Toko */}
                    <div className="flex flex-wrap justify-between items-center p-4 bg-[#fcfdfc] border-b border-[#eef2ef] gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-bold text-[#1a2e1f]">{order.shopName}</span>
                        <div className="flex gap-2">
                          <button className="text-[#2fa84f] text-xs font-medium border border-[#2fa84f] px-3 py-1 rounded-full hover:bg-[#f1f8e9] transition">
                            Chat
                          </button>
                          <button className="text-[#6b7c71] text-xs font-medium border border-[#e0e6e2] px-3 py-1 rounded-full hover:bg-gray-50 transition">
                            Kunjungi Toko
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#e53e3e] text-xs font-bold">{order.status}</span>
                        <p className="text-[10px] text-[#6b7c71] mt-1">{order.statusDesc}</p>
                      </div>
                    </div>

                    {/* Item Produk */}
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 border-b border-[#eef2ef] last:border-b-0">
                        <div className="w-20 h-20 bg-[#f1f8e9] rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl text-[#2fa84f]">🌿</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.condition === "Baru" 
                                ? "bg-green-100 text-[#2fa84f]" 
                                : "bg-orange-100 text-orange-600"
                            }`}>
                              {item.condition}
                            </span>
                            <span className="text-[10px] text-[#6b7c71]">📍 {item.location}</span>
                          </div>
                          <h4 className="font-medium text-[#1a2e1f] text-sm mb-1">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-yellow-500 text-xs">⭐</span>
                            <span className="text-[11px] font-medium text-[#1a2e1f]">{item.rating}</span>
                          </div>
                          <p className="text-[11px] text-[#6b7c71] mt-1">x{item.quantity}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-[#1a2e1f]">Rp{item.price.toLocaleString()}</span>
                            {item.originalPrice && (
                              <span className="text-[11px] text-[#6b7c71] line-through">Rp{item.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Total & Aksi */}
                    <div className="p-4 bg-[#fcfdfc] border-t border-[#eef2ef]">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-[#6b7c71]">Total Pesanan:</span>
                        <span className="font-bold text-[#1a2e1f]">Rp{order.totalPrice.toLocaleString()}</span>
                      </div>

                      {/* Tombol Aksi */}
                      <div className="flex gap-2 justify-end flex-wrap">
                        <button className="px-4 py-1.5 text-xs font-medium text-[#2fa84f] border border-[#2fa84f] rounded-full hover:bg-[#f1f8e9] transition">
                          Beri Nilai
                        </button>
                        <button className="px-4 py-1.5 text-xs font-medium text-[#6b7c71] border border-[#e0e6e2] rounded-full hover:bg-gray-50 transition">
                          Ajukan Pengembalian
                        </button>
                        <button className="px-4 py-1.5 text-xs font-medium text-[#6b7c71] border border-[#e0e6e2] rounded-full hover:bg-gray-50 transition">
                          Beli Lagi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pesanan Kosong */}
                {orders.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-[#6b7c71]">Belum ada pesanan</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}