"use client";

import Link from "next/link";

export default function Notifikasi() {
  // Data notifikasi contoh
  const notifications = [
    {
      id: 1,
      title: "Pesanan Baru",
      message: "Anda memiliki pesanan baru untuk produk 'Kamera DSLR'",
      time: "10 menit yang lalu",
      read: false
    },
    {
      id: 2,
      title: "Pembayaran Diterima",
      message: "Pembayaran untuk pesanan #1234 berhasil diterima",
      time: "1 jam yang lalu",
      read: true
    },
    {
      id: 3,
      title: "Pengiriman Diproses",
      message: "Pesanan #1233 sedang dalam proses pengiriman",
      time: "2 jam yang lalu",
      read: true
    },
    {
      id: 4,
      title: "Produk Disukai",
      message: "Produk 'Sepeda Gunung' telah disukai oleh pengguna",
      time: "3 jam yang lalu",
      read: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#f1f8e9] text-[#1a2e1f] font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a2e1f]">Notifikasi</h1>
          <Link href="/beranda-dashboard" className="text-[#2fa84f] hover:text-[#268c41] font-bold no-underline">
            ← Kembali ke Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-[24px] shadow-[0_10px_35px_rgba(30,80,40,0.04)] overflow-hidden">
          <div className="p-6 border-b border-[#e0e6e2]">
            <h2 className="text-2xl font-bold text-[#1a2e1f]">Pusat Notifikasi</h2>
            <p className="text-[#6b7c71]">Kelola semua notifikasi Anda di sini</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-[12px] border ${notification.read ? 'border-[#e0e6e2] bg-[#fcfdfc]' : 'border-[#2fa84f] bg-[#f1f8e9]'} transition-all duration-300`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[#1a2e1f] mb-1">{notification.title}</h3>
                      <p className="text-[#6b7c71] mb-2">{notification.message}</p>
                      <p className="text-xs text-[#a0a0a0]">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <span className="w-3 h-3 bg-[#2fa84f] rounded-full"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button className="text-[#2fa84f] font-bold py-2 px-6 rounded-[12px] border border-[#2fa84f] hover:bg-[#2fa84f] hover:text-white transition">
                Tandai Semua Telah Dibaca
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}