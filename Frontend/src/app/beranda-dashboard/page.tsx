"use client";

import React from "react";
import Link from "next/link";
// Jika kamu sudah install bootstrap-icons, aktifkan baris di bawah ini:
// import { Cart3, PersonCircle, Bell, GeoAltFill, Search, ArrowRepeat } from 'bootstrap-icons/react';

export default function BerandaDashboard() {
  const resetFilters = () => {
    const inputs = document.querySelectorAll('.filter-check input') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => input.checked = false);
  };

  const products = [
    {
      name: "Tempat Pensil Organik",
      price: "Rp 10.000",
      location: "Bandung",
      rating: "4.8",
      badge: "Bekas",
      isNew: false,
      img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop",
    },
    {
      name: "Buku Catatan Linen",
      price: "Rp 45.000",
      location: "Jakarta",
      rating: "5.0",
      badge: "Baru",
      isNew: true,
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    },
    {
      name: "Sedotan Bambu Set",
      price: "Rp 15.000",
      location: "Bogor",
      rating: "4.5",
      badge: "Bekas",
      isNew: false,
      img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
    },
    {
      name: "Tote Bag Organik",
      price: "Rp 5.000",
      location: "Surakarta",
      rating: "4.9",
      badge: "Baru",
      isNew: true,
      img: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=300&h=300&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f8e9] font-sans">
      {/* NAVBAR */}
      <nav id="navbar" className="fixed top-0 w-full z-[100] bg-white border-b border-[#e0e6e2] shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-[#2fa84f] text-2xl font-[800] no-underline">
            GreenMarket
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <Link href="#" className="text-[#1a2e1f] font-bold text-sm no-underline hover:text-[#2fa84f] transition">Mulai Berjualan</Link>
            <Link href="/komunitas" className="text-[#1a2e1f] font-bold text-sm no-underline hover:text-[#2fa84f] transition">Komunitas</Link>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-lg mx-10 bg-[#f8faf9] border border-[#e0e6e2] rounded-xl px-4 py-2 flex items-center group focus-within:border-[#2fa84f] transition-all">
          <span className="text-gray-400 mr-2">🔍</span>
          <input 
            type="text" 
            placeholder="Cari produk ramah lingkungan..." 
            className="bg-transparent border-none outline-none w-full text-sm text-[#1a2e1f]"
          />
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-5">
          <Link href="/wishlist" className="text-xl text-[#6b7c71] hover:text-[#2fa84f] transition flex items-center">🛒</Link>
  
          <Link href="/profile" className="text-xl text-[#6b7c71] hover:text-[#2fa84f] transition flex items-center">👤</Link>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="container-fluid pt-28 px-6 lg:px-12 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTER */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white rounded-[32px] p-8 border border-[#e0e6e2] shadow-[0_10px_40px_rgba(30,80,40,0.04)] sticky top-28">
              <h2 className="text-2xl font-[800] mb-8 text-[#1a2e1f]">Filter</h2>

              {/* Kategori */}
              <div className="mb-8">
                <div className="text-[11px] font-bold text-[#2fa84f] uppercase tracking-wider mb-4">Kategori</div>
                <div className="flex flex-col gap-3">
                  {["Toko Populer", "Toko Terpercaya", "Toko Terlaris"].map((item) => (
                    <label key={item} className="filter-check flex items-center gap-3 cursor-pointer text-sm font-medium text-[#6b7c71] hover:text-[#1a2e1f] transition">
                      <input type="checkbox" className="accent-[#2fa84f] w-4 h-4 cursor-pointer" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lokasi */}
              <div className="mb-8">
                <div className="text-[11px] font-bold text-[#2fa84f] uppercase tracking-wider mb-4">Lokasi</div>
                <div className="flex flex-col gap-3">
                  {["Terdekat", "Jakarta", "Bandung"].map((item) => (
                    <label key={item} className="filter-check flex items-center gap-3 cursor-pointer text-sm font-medium text-[#6b7c71] hover:text-[#1a2e1f] transition">
                      <input type="radio" name="lokasi" className="accent-[#2fa84f] w-4 h-4 cursor-pointer" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button 
                onClick={resetFilters}
                className="w-full py-3 bg-[#f1f8e9] text-[#2fa84f] rounded-xl font-bold text-sm hover:bg-[#2fa84f] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                🔄 Reset Semua
              </button>
            </div>
          </aside>

          {/* PRODUCT AREA */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-[800] text-[#1a2e1f]">Produk Terbaru</h3>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7c71] text-xs font-bold uppercase tracking-tight">Urutkan:</span>
                <select className="border border-[#e0e6e2] rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:border-[#2fa84f] cursor-pointer">
                  <option>Popularitas</option>
                  <option>Harga Terendah</option>
                  <option>Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <div key={i} className="product-card group bg-white rounded-[24px] overflow-hidden border border-[#eef2ef] hover:border-[#2fa84f] hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(30,80,40,0.08)] transition-all duration-300">
                  <div className="relative aspect-square overflow-hidden bg-[#f8faf9]">
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm ${p.isNew ? 'bg-[#2fa84f]' : 'bg-[#ff6b35]'}`}>
                      {p.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="font-bold text-[15px] text-[#1a2e1f] mb-1 group-hover:text-[#2fa84f] transition">{p.name}</div>
                    <div className="text-[#2fa84f] font-[800] text-lg mb-3">{p.price}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-[12px] text-[#6b7c71] flex items-center gap-1">
                        📍 {p.location}
                      </div>
                      <div className="text-[#fbbc05] text-[12px] font-bold flex items-center gap-1">
                        ⭐ {p.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* FOOTER - Menggunakan struktur Landing Page */}
      <footer className="bg-white border-t border-[#e0e6e2] pt-20 pb-10 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
            <div className="lg:col-span-1">
              <div className="text-[#2fa84f] text-2xl font-[800] mb-5">GreenMarket</div>
              <p className="text-[#6b7c71] text-sm leading-relaxed">Solusi ramah lingkungan untuk masa depan. Kami menghubungkan barang berkualitas dengan pemilik baru yang peduli bumi.</p>
            </div>
            <div>
              <h6 className="font-bold mb-6">Tautan</h6>
              <ul className="text-[#6b7c71] text-sm space-y-3 p-0 list-none">
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Marketplace</Link></li>
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Kategori</Link></li>
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Tentang Kami</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold mb-6">Bantuan</h6>
              <ul className="text-[#6b7c71] text-sm space-y-3 p-0 list-none">
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Hubungi Kami</Link></li>
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Privasi</Link></li>
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold mb-6">Berlangganan</h6>
              <div className="flex bg-[#f1f8e9] rounded-xl overflow-hidden mb-4 border border-[#e0e6e2]">
                <input type="email" placeholder="Email Anda" className="bg-transparent px-5 py-3 outline-none flex-grow text-sm" />
                <button className="bg-[#2fa84f] text-white px-5 py-3 hover:bg-[#268c41] transition">🚀</button>
              </div>
              <p className="text-[#6b7c71] text-[11px]">© 2026 GreenMarket. Dibuat dengan penuh rasa cinta untuk bumi.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}