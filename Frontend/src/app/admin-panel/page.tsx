"use client";

import Link from "next/link";

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-[#f1f8e9] text-[#1a2e1f] font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a2e1f]">Admin Panel</h1>
          <Link href="/beranda-dashboard" className="text-[#2fa84f] hover:text-[#268c41] font-bold no-underline">
            ← Kembali ke Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-[24px] shadow-[0_10px_35px_rgba(30,80,40,0.04)] overflow-hidden">
          <div className="p-6 border-b border-[#e0e6e2]">
            <h2 className="text-2xl font-bold text-[#1a2e1f]">Dashboard Admin</h2>
            <p className="text-[#6b7c71]">Kelola pengguna, produk, dan komunitas</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#f1f8e9] rounded-[15px] p-6 border border-[#e0e6e2]">
                <h3 className="text-lg font-bold text-[#1a2e1f] mb-2">Total Pengguna</h3>
                <p className="text-3xl font-bold text-[#2fa84f]">1,248</p>
              </div>
              
              <div className="bg-[#f1f8e9] rounded-[15px] p-6 border border-[#e0e6e2]">
                <h3 className="text-lg font-bold text-[#1a2e1f] mb-2">Total Produk</h3>
                <p className="text-3xl font-bold text-[#2fa84f]">567</p>
              </div>
              
              <div className="bg-[#f1f8e9] rounded-[15px] p-6 border border-[#e0e6e2]">
                <h3 className="text-lg font-bold text-[#1a2e1f] mb-2">Total Komunitas</h3>
                <p className="text-3xl font-bold text-[#2fa84f]">24</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[15px] border border-[#e0e6e2] p-6">
                <h3 className="text-xl font-bold text-[#1a2e1f] mb-4">Pengguna Terbaru</h3>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-[#f8faf9] rounded-[12px] transition-colors duration-300">
                      <div className="w-10 h-10 bg-[#f1f8e9] rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#1a2e1f]">Nama Pengguna {i+1}</p>
                        <p className="text-sm text-[#6b7c71]">email{Math.floor(Math.random() * 100)}@contoh.com</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-[15px] border border-[#e0e6e2] p-6">
                <h3 className="text-xl font-bold text-[#1a2e1f] mb-4">Produk Terbaru</h3>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-[#f8faf9] rounded-[12px] transition-colors duration-300">
                      <div className="w-16 h-16 bg-[#f1f8e9] rounded-[10px] flex items-center justify-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1a2e1f]">Produk {i+1}</p>
                        <p className="text-[#2fa84f] font-bold">Rp 100.000</p>
                        <p className="text-sm text-[#6b7c71]">Terjual oleh: Nama Penjual</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}