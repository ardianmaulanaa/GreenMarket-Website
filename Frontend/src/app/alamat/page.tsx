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

  const isSeller = user.role === "SELLER";

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
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden flex flex-col">
      
      {/* Dekorasi Glow Hijau */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-md border-b border-white/5 shadow-lg py-3 px-8 flex items-center justify-between h-[68px]">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_4px_12px_rgba(47,168,79,0.35)] group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/>
              </svg>
            </div>
            <span className="text-[18px] font-[800] text-white tracking-[-0.5px]">GreenMarket</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>
            <Link href="/profile" className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center text-white shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto pt-[100px] pb-[60px] px-8 flex gap-7 relative z-10 w-full">
        
        {/* ── SIDEBAR (Luxury Dark) ── */}
        <aside className="w-[260px] shrink-0">
          <div className="sticky top-[84px] bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="text-center mb-6">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <img src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/30" alt="Avatar" />
              </div>
              <h3 className="text-[15px] font-[800] text-white m-0">{user.nama || "Loading..."}</h3>
              <p className="text-[11px] text-[#2fa84f] m-0 mt-1 uppercase font-bold tracking-widest">{user.role}</p>
            </div>
            
            <nav className="flex flex-col gap-1.5">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-[13px]">Profil Saya</span>
              </Link>
              <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_4px_12px_rgba(47,168,79,0.25)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-[13px]">Alamat</span>
              </Link>
              <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span className="text-[13px]">Pesanan Saya</span>
              </Link>

              {isSeller ? (
                <Link href="/seller/dashboard" className="flex items-center gap-3 p-3.5 rounded-xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="text-[13px]">Dashboard Toko</span>
                </Link>
              ) : (
                <Link href="/register-penjual" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span className="text-[13px]">Mulai Berjualan</span>
                </Link>
              )}
              
              <div className="my-2 border-t border-white/5" />
              <button 
                onClick={() => { localStorage.clear(); window.location.href="/login"; }}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition font-bold text-left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-[13px]">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1">
          <div className="bg-white rounded-[32px] p-10 border border-[#eef2ef] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f1f8e9] rounded-bl-full opacity-50 -z-0"></div>
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div>
                <h2 className="text-[24px] font-[800] text-[#1a2e1f] tracking-tight">Daftar Alamat</h2>
                <p className="text-[13px] text-[#6b7c71] mt-1 font-medium">Kelola lokasi pengiriman pesanan Anda</p>
              </div>
              <button 
                onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}
                className="bg-[#2fa84f] text-white px-7 py-3 rounded-2xl font-[800] text-[13px] hover:bg-[#268c41] transition-all shadow-[0_10px_20px_rgba(47,168,79,0.2)] hover:-translate-y-0.5"
              >
                + Tambah Alamat Baru
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-5 relative z-10">
              {addresses.map((address) => (
                <div key={address.id} className="border border-[#eef2ef] rounded-[24px] p-7 bg-[#fcfdfc] hover:border-[#2fa84f]/40 hover:bg-white transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3.5 py-1.5 bg-[#f1f8e9] text-[#2fa84f] text-[10px] font-[800] rounded-xl uppercase tracking-widest border border-[#2fa84f]/10">{address.label}</span>
                        <span className="font-[800] text-[#1a2e1f] text-[16px]">{address.name}</span>
                      </div>
                      <p className="text-[14px] text-[#1a2e1f] font-bold mb-1">{address.phone}</p>
                      <p className="text-[14px] text-[#6b7c71] leading-relaxed max-w-xl">
                        {address.fullAddress}, {address.district}, {address.city}, {address.province} ({address.postalCode})
                      </p>
                      {address.detail && <p className="text-[12px] text-[#2fa84f] mt-2 font-bold italic">Catatan: {address.detail}</p>}
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(address)} className="px-4 py-2 text-[#2fa84f] text-[12px] font-[800] bg-[#f1f8e9] rounded-xl hover:bg-[#2fa84f] hover:text-white transition-colors">Edit</button>
                      <button onClick={() => handleDelete(address.id)} className="px-4 py-2 text-[#e53e3e] text-[12px] font-[800] bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-colors">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL FORM ── */}
      {showForm && (
        <div className="fixed inset-0 bg-[#0a110b]/60 backdrop-blur-sm flex items-center justify-center z-[200] p-6">
           <div className="bg-white p-10 rounded-[40px] w-full max-w-2xl shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
              <h3 className="text-2xl font-[800] mb-8 text-[#1a2e1f] tracking-tight">{editingId ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1 mb-2 block">Label Alamat (Contoh: Rumah / Kantor)</label>
                  <input name="label" value={formData.label} onChange={handleInputChange} className="w-full px-4 py-3 border border-[#e0e6e2] rounded-2xl outline-none focus:border-[#2fa84f] text-[14px]" placeholder="Masukkan label" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1 mb-2 block">Nama Penerima</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-[#e0e6e2] rounded-2xl outline-none focus:border-[#2fa84f] text-[14px]" required />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1 mb-2 block">Nomor Telepon</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-[#e0e6e2] rounded-2xl outline-none focus:border-[#2fa84f] text-[14px]" required />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1 mb-2 block">Alamat Lengkap</label>
                  <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} className="w-full px-4 py-3 border border-[#e0e6e2] rounded-2xl outline-none focus:border-[#2fa84f] text-[14px] min-h-[100px] resize-none" required />
                </div>
                <div className="flex gap-4 col-span-2 mt-6">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3.5 rounded-2xl font-[800] text-[13px] text-[#6b7c71] bg-gray-100 hover:bg-gray-200 transition-colors">Batal</button>
                    <button type="submit" className="flex-1 py-3.5 rounded-2xl font-[800] text-[13px] text-white bg-[#2fa84f] hover:bg-[#268c41] transition-all shadow-lg shadow-[#2fa84f]/20">Simpan Alamat</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}