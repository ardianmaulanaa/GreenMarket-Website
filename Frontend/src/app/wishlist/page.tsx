"use client";

import Link from "next/link";

export default function Wishlist() {
  // Data produk contoh untuk wishlist
  const wishlistItems = [
    {
      id: 1,
      name: "Kamera DSLR Bekas",
      price: "Rp 1.200.000",
      location: "Jakarta Selatan",
      rating: 4.5,
      image: ""
    },
    {
      id: 2,
      name: "Sepeda Gunung",
      price: "Rp 800.000",
      location: "Bandung",
      rating: 5,
      image: ""
    },
    {
      id: 3,
      name: "Laptop Bekas",
      price: "Rp 1.500.000",
      location: "Yogyakarta",
      rating: 4,
      image: ""
    }
  ];

  return (
    <div className="min-h-screen bg-[#f1f8e9] text-[#1a2e1f] font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a2e1f]">Daftar Keinginan</h1>
          <Link href="/beranda-dashboard" className="text-[#2fa84f] hover:text-[#268c41] font-bold no-underline">
            ← Kembali ke Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-[24px] shadow-[0_10px_35px_rgba(30,80,40,0.04)] overflow-hidden">
          <div className="p-6 border-b border-[#e0e6e2]">
            <h2 className="text-2xl font-bold text-[#1a2e1f]">Produk yang Disukai</h2>
            <p className="text-[#6b7c71]">Kelola semua produk yang telah Anda sukai</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="border border-[#e0e6e2] rounded-[15px] p-4 flex items-center gap-4 hover:bg-[#f8faf9] transition-colors duration-300">
                  <div className="flex-shrink-0 w-16 h-16 bg-[#f1f8e9] rounded-[10px] flex items-center justify-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-[#1a2e1f] mb-1">{item.name}</h3>
                    <p className="text-[#2fa84f] font-bold mb-1">{item.price}</p>
                    <p className="text-[#6b7c71] text-sm mb-2">{item.location}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-[#fbbc05] text-sm">{'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-[#2fa84f] font-bold py-2 px-4 rounded-[10px] border border-[#2fa84f] hover:bg-[#2fa84f] hover:text-white transition text-sm">
                      Lihat Detail
                    </button>
                    <button className="text-red-500 font-bold py-2 px-4 rounded-[10px] border border-red-500 hover:bg-red-500 hover:text-white transition text-sm">
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {wishlistItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#6b7c71] mb-4">Daftar keinginan Anda masih kosong</p>
                <Link href="/beranda-dashboard" className="text-[#2fa84f] hover:text-[#268c41] font-bold no-underline">
                  Jelajahi Produk →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}