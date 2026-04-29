"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function BerandaDashboard() {
  // 1. State untuk data asli dari database
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Ambil data dari Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/products");
        const data = await response.json();
        setDbProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const resetFilters = () => {
    const inputs = document.querySelectorAll('.filter-check input') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => input.checked = false);
  };

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
              <button onClick={resetFilters} className="w-full py-3 bg-[#f1f8e9] text-[#2fa84f] rounded-xl font-bold text-sm hover:bg-[#2fa84f] hover:text-white transition-all flex items-center justify-center gap-2">
                🔄 Reset Semua
              </button>
            </div>
          </aside>

          {/* PRODUCT AREA */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-[800] text-[#1a2e1f]">Produk Terbaru</h3>
            </div>

            {loading ? (
              <div className="text-center py-20 text-[#2fa84f] font-bold">Memuat produk bumi...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {dbProducts.map((p) => (
                  <div key={p.id_produk} className="product-card group bg-white rounded-[24px] overflow-hidden border border-[#eef2ef] hover:border-[#2fa84f] hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(30,80,40,0.08)] transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-[#f8faf9]">
                      <img 
  src={(p.fotos && p.fotos.length > 0) ? p.fotos[0].url_foto : "https://via.placeholder.com/300"} 
  alt={p.nama_produk || "produk"} 
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
/>
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm ${p.status_produk === 'Baru' ? 'bg-[#2fa84f]' : 'bg-[#ff6b35]'}`}>
                        {p.status_produk}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="font-bold text-[15px] text-[#1a2e1f] mb-1 group-hover:text-[#2fa84f] transition">{p.nama_produk}</div>
                      <div className="text-[#2fa84f] font-[800] text-lg mb-3">
                        Rp {p.harga?.toLocaleString('id-ID')}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[12px] text-[#6b7c71] flex items-center gap-1">
                          🌿 {p.kategori?.nama_kategori}
                        </div>
                        <div className="text-[#fbbc05] text-[12px] font-bold flex items-center gap-1">
                          👤 {p.seller?.username}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#e0e6e2] pt-20 pb-10 px-6 lg:px-12">
         {/* Isi footer sama seperti sebelumnya */}
         <div className="container mx-auto text-center text-[#6b7c71] text-[11px]">
           © 2026 GreenMarket. Dibuat dengan penuh rasa cinta untuk bumi.
         </div>
      </footer>
    </div>
  );
}