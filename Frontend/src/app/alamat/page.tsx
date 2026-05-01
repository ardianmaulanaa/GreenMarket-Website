"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AlamatPage() {
  const pathname = usePathname();
  
  const [user, setUser] = useState({ nama: "", role: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Rumah",
      name: "Muhammad Ardian",
      phone: "08123456789",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      district: "Kebayoran Baru",
      postalCode: "12120",
      fullAddress: "Jl. Merdeka No. 123",
      detail: "Depan Masjid Al-Ikhlas",
    }
  ]);
  
  const [formData, setFormData] = useState({
    label: "", name: "", phone: "", province: "", city: "", district: "", postalCode: "", fullAddress: "", detail: "",
  });

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

  const isSeller = user.role === "SELLER" || user.role === "Penjual";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(addr => addr.id === editingId ? { ...formData, id: editingId } : addr));
      setEditingId(null);
    } else {
      setAddresses([...addresses, { ...formData, id: Date.now() }]);
    }
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({ label: "", name: "", phone: "", province: "", city: "", district: "", postalCode: "", fullAddress: "", detail: "" });
  };

  const handleEdit = (address: any) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Sesuai Dashboard & Profile max-w-1600px) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 pl-2 group no-underline">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0">Profil Saya</p>
                  <p className="text-[10px] text-emerald-400 m-0 uppercase">{user.role}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-emerald-400 p-[2px] shadow-lg">
                 <div className="w-full h-full rounded-full bg-[#0d130e] flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
               </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── KONTEN UTAMA (Sesuai container Dashboard max-w-1600px) ── */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">

        {/* ── SIDEBAR (Luxury Dark Glassmorphism) ── */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[28px] p-6 border border-white/10 shadow-xl">
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/30 object-cover" alt="Avatar" />
              </div>
              <h3 className="text-[15px] font-[800] text-white m-0">{user.nama || "Loading..."}</h3>
              <p className="text-[10px] text-[#2fa84f] m-0 mt-1.5 uppercase font-black tracking-[2px]">{user.role}</p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="group-hover:text-[#2fa84f] transition-colors"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-[13px]">Profil Saya</span>
              </Link>

              <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_10px_20px_rgba(47,168,79,0.2)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-[13px]">Daftar Alamat</span>
              </Link>
              
              <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="group-hover:text-[#2fa84f] transition-colors"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                <span className="text-[13px]">Pesanan Saya</span>
              </Link>

              {!isSeller ? (
                <Link href="/register-penjual" className="flex items-center gap-3 p-3.5 rounded-xl text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 transition no-underline font-bold mt-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span className="text-[13px]">Mulai Berjualan</span>
                </Link>
              ) : (
                <Link href="/seller/dashboard" className="flex items-center gap-3 p-3.5 rounded-xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="text-[13px]">Dashboard Toko</span>
                </Link>
              )}
              
              <div className="my-4 border-t border-white/10" />
              
              <button 
                onClick={() => { localStorage.clear(); window.location.href="/login"; }}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition font-bold text-left group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-[13px]">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT (Dark Glassmorphism) ── */}
        <main className="flex-1">
          <div className="bg-[#1a1f1b]/60 backdrop-blur-md rounded-[32px] p-8 lg:p-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2fa84f] rounded-bl-full opacity-10 blur-3xl -z-0 pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 relative z-10">
              <div>
                <h2 className="text-2xl lg:text-3xl font-[800] text-white tracking-tight m-0">Daftar Alamat</h2>
                <p className="text-sm text-gray-400 mt-2 font-medium">Kelola lokasi pengiriman pesanan Anda</p>
              </div>
              <button 
                onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}
                className="bg-[#2fa84f] text-white px-7 py-3 rounded-2xl font-[800] text-[13px] hover:bg-[#268c41] transition-all shadow-[0_10px_20px_rgba(47,168,79,0.2)] hover:-translate-y-0.5 whitespace-nowrap"
              >
                + Tambah Alamat Baru
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-5 relative z-10">
              {addresses.map((address) => (
                <div key={address.id} className="border border-white/10 rounded-[24px] p-7 bg-white/5 hover:border-[#2fa84f]/40 hover:bg-white/10 transition-all group shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3.5 py-1.5 bg-[#2fa84f]/20 text-[#2fa84f] text-[10px] font-[800] rounded-xl uppercase tracking-widest border border-[#2fa84f]/30">{address.label}</span>
                        <span className="font-[800] text-white text-[16px]">{address.name}</span>
                      </div>
                      <p className="text-[14px] text-white/90 font-bold mb-1">{address.phone}</p>
                      <p className="text-[14px] text-gray-400 leading-relaxed max-w-xl">
                        {address.fullAddress}, {address.district}, {address.city}, {address.province} ({address.postalCode})
                      </p>
                      {address.detail && <p className="text-[12px] text-[#2fa84f] mt-2 font-bold italic">Catatan: {address.detail}</p>}
                    </div>
                    
                    {/* Tombol Aksi di dalam Kartu Alamat */}
                    <div className="flex md:flex-col gap-2 w-full md:w-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(address)} className="flex-1 md:flex-none px-4 py-2.5 text-white text-[12px] font-[800] bg-white/10 rounded-xl hover:bg-[#2fa84f] transition-colors border border-white/10">Edit Alamat</button>
                      <button onClick={() => handleDelete(address.id)} className="flex-1 md:flex-none px-4 py-2.5 text-red-400 text-[12px] font-[800] bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-500/20">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL FORM (Dark Mode) ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
           <div className="bg-[#1a1f1b] p-8 lg:p-10 rounded-[40px] w-full max-w-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-[800] mb-8 text-white tracking-tight">{editingId ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Label Alamat (Contoh: Rumah / Kantor)</label>
                  <input name="label" value={formData.label} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-[14px] text-white placeholder-gray-600 transition-colors" placeholder="Masukkan label" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Nama Penerima</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-[14px] text-white transition-colors" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Nomor Telepon</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-[14px] text-white transition-colors" required />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Alamat Lengkap</label>
                  <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] text-[14px] text-white min-h-[100px] resize-none transition-colors" required />
                </div>
                <div className="flex gap-4 col-span-2 mt-6">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3.5 rounded-2xl font-[800] text-[13px] text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors">Batal</button>
                    <button type="submit" className="flex-1 py-3.5 rounded-2xl font-[800] text-[13px] text-white bg-[#2fa84f] hover:bg-[#268c41] transition-all shadow-[0_10px_20px_rgba(47,168,79,0.2)]">Simpan Alamat</button>
                </div>
              </form>
           </div>
        </div>
      )}

      {/* ── FOOTER (Sesuai Dashboard) ── */}
      <footer className="bg-[#0a110b] pt-10 pb-6 px-8 text-white relative z-10 border-t border-white/5 text-center mt-auto">
         <div className="max-w-6xl mx-auto flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
               <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
               </div>
               <span className="text-sm font-black text-white tracking-tighter uppercase">GreenMarket</span>
            </div>
            <p className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase m-0">
               © 2026 GREENMARKET INC. All Rights Reserved.
            </p>
         </div>
      </footer>
    </div>
  );
}