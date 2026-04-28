"use client";

import React from "react";
import Link from "next/link";

export default function KomunitasPage() {
  const posts = [
    {
      id: 1,
      user: "Ardian Maulana",
      avatar: "https://ui-avatars.com/api/?name=Ardian+Maulana&background=a8e063&color=1a2e1f",
      time: "2 jam yang lalu",
      group: "#DIY_Recycle",
      content: "Baru saja menyelesaikan proyek kursi dari ban bekas. Sangat kokoh dan nyaman untuk taman belakang! Ada yang mau tutorialnya? 🌱♻️",
      likes: 124,
      comments: 18
    },
    {
      id: 2,
      user: "Siska Putri",
      avatar: "https://ui-avatars.com/api/?name=Siska+Putri&background=f1f8e9&color=2fa84f",
      time: "5 jam yang lalu",
      group: null,
      content: "Tips mengurangi penggunaan plastik saat belanja di pasar tradisional: Selalu sedia tote bag di bagasi motor. Kecil tapi berdampak besar!",
      likes: 89,
      comments: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#f1f8e9] font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] bg-white border-b border-[#e0e6e2] shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/beranda-dashboard" className="text-[#2fa84f] text-2xl font-[800] no-underline">
            GreenMarket
          </Link>
          <div className="flex items-center gap-6">
            <button className="text-xl text-[#6b7c71] hover:text-[#2fa84f] transition">🔍</button>
            <button className="text-xl text-[#6b7c71] hover:text-[#2fa84f] transition">🔔</button>
            <Link href="/profile" className="text-xl text-[#6b7c71] hover:text-[#2fa84f] transition">👤</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto pt-24 px-4 lg:px-10 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SIDEBAR KIRI */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#eef2ef] sticky top-24">
              <h5 className="font-extrabold text-[#1a2e1f] mb-6 text-lg">GCommunity</h5>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="flex items-center gap-3 p-3 rounded-xl bg-[#f1f8e9] text-[#2fa84f] font-bold transition">
                  🏠 <span>Beranda</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] transition font-medium">
                  🧭 <span>Eksplorasi</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] transition font-medium">
                  🔖 <span>Tersimpan</span>
                </Link>
                <hr className="my-4 border-[#eef2ef]" />
                <p className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider mb-2 ml-3">Grup Anda</p>
                <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-[#6b7c71] hover:text-[#2fa84f] transition text-sm">
                  # DIY_Recycle
                </Link>
                <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-[#6b7c71] hover:text-[#2fa84f] transition text-sm">
                  # ZeroWasteIndo
                </Link>
                <Link href="#" className="flex items-center gap-3 p-3 rounded-xl text-[#6b7c71] hover:text-[#2fa84f] transition text-sm">
                  # KebunOrganik
                </Link>
              </nav>
            </div>
          </aside>

          {/* MAIN FEED */}
          <main className="lg:col-span-6 space-y-6">
            {/* CREATE POST */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-[#eef2ef] flex items-center gap-4">
              <img src="https://ui-avatars.com/api/?name=User&background=2fa84f&color=fff" className="w-10 h-10 rounded-full" alt="User" />
              <input 
                type="text" 
                className="flex-1 bg-[#f8faf9] border border-[#e0e6e2] rounded-full px-5 py-2.5 text-sm outline-none focus:border-[#2fa84f] transition-all"
                placeholder="Apa ide hijau Anda hari ini?"
              />
              <button className="bg-[#2fa84f] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#268c41] transition shadow-sm active:scale-95">
                Kirim
              </button>
            </div>

            {/* POST LIST */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-[#eef2ef]">
                <div className="flex items-center gap-3 mb-4">
                  <img src={post.avatar} className="w-11 h-11 rounded-full border-2 border-[#f1f8e9]" alt={post.user} />
                  <div>
                    <p className="font-bold text-[#1a2e1f] text-[15px]">{post.user}</p>
                    <span className="text-[11px] text-[#6b7c71]">
                      {post.time} {post.group && <>dalam <b className="text-[#2fa84f]">{post.group}</b></>}
                    </span>
                  </div>
                </div>
                <div className="text-[15px] text-[#1a2e1f] leading-relaxed mb-5">
                  {post.content}
                </div>
                <div className="flex items-center gap-2 border-t border-[#f8faf9] pt-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8faf9] text-[13px] font-bold text-[#6b7c71] hover:bg-[#f1f8e9] hover:text-[#2fa84f] transition">
                    ❤️ <span>{post.likes} Suka</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8faf9] text-[13px] font-bold text-[#6b7c71] hover:bg-[#f1f8e9] hover:text-[#2fa84f] transition">
                    💬 <span>{post.comments} Komentar</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8faf9] text-[13px] font-bold text-[#6b7c71] hover:bg-[#f1f8e9] hover:text-[#2fa84f] transition ml-auto">
                    🔗 <span>Bagikan</span>
                  </button>
                </div>
              </div>
            ))}
          </main>

          {/* SIDEBAR KANAN */}
          <aside className="lg:col-span-3">
            <div className="bg-[#1a2e1f] rounded-[24px] p-6 shadow-lg text-white sticky top-24">
              <h6 className="font-extrabold mb-6 flex items-center gap-2">
                🔥 Sedang Tren
              </h6>
              <div className="space-y-5">
                {[
                  { tag: "#ZeroWasteWeek", count: "1.2k Postingan" },
                  { tag: "#OlahanSampah", count: "850 Postingan" },
                  { tag: "#E-WasteSolution", count: "530 Postingan" }
                ].map((trend) => (
                  <Link key={trend.tag} href="#" className="block group no-underline">
                    <p className="text-[14px] font-bold text-white group-hover:text-[#2fa84f] transition mb-1">{trend.tag}</p>
                    <p className="text-[11px] text-white/60 uppercase font-bold">{trend.count}</p>
                  </Link>
                ))}
              </div>
              <hr className="my-6 border-white/10" />
              <p className="text-[12px] text-white/70 leading-relaxed text-center italic">
                "Ayo bergabung dengan diskusi dan bantu selamatkan bumi kita!"
              </p>
            </div>
            <p className="mt-8 text-center text-[11px] text-[#6b7c71] font-bold">
              © 2026 GREENMARKET COMMUNITY
            </p>
          </aside>

        </div>
      </div>
    </div>
  );
}