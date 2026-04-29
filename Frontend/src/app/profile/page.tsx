"use client";

import React from "react";
import Link from "next/link";
// Jika sudah install bootstrap-icons, silakan aktifkan:
// import { CameraFill, Person, GeoAlt, BagCheck, BoxArrowRight, Cart3 } from 'bootstrap-icons/react';

export default function ProfilePage() {
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
          
          {/* SIDEBAR PROFIL */}
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
                <Link href="#" className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f1f8e9] text-[#2fa84f] font-bold no-underline transition">
                  👤 Profil Saya
                </Link>
                <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-xl text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] no-underline font-medium transition">
                  📍 Alamat
                </Link>
                <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-xl text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] no-underline font-medium transition">
                  🛍️ Pesanan Saya
                </Link>
                <Link href="/login" className="flex items-center gap-3 p-3.5 rounded-xl text-[#e53e3e] hover:bg-[#fff5f5] no-underline font-bold transition mt-4">
                  🚪 Keluar
                </Link>
              </nav>
            </div>
          </aside>

          {/* FORM PROFIL */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
              <h3 className="text-2xl font-[800] text-[#1a2e1f] mb-8">Pengaturan Profil</h3>
              
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      defaultValue="Muhammad Ardian Maulana"
                      className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Username</label>
                    <input 
                      type="text" 
                      defaultValue="ardian_maulana"
                      className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Email</label>
                    <input 
                      type="email" 
                      defaultValue="ardian@example.com"
                      className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Nomor Telepon</label>
                    <input 
                      type="text" 
                      defaultValue="08123456789"
                      className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                    />
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-[#f8faf9]">
                  <button 
                    type="submit" 
                    className="bg-[#2fa84f] text-white px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-[#268c41] hover:-translate-y-0.5 transition-all shadow-sm active:scale-95"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}