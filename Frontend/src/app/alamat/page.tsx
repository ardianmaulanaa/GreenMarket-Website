"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AlamatPage() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isPageLoading, setIsPageLoading] = useState(true);
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
    // Efek loading transisi halaman
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        nama: userData.username || userData.name || "User",
        role: userData.role || "BUYER"
      });
    }

    return () => clearTimeout(timer);
  }, []);

  const isSeller = user.role === "SELLER" || user.role === "Penjual";

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

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

  // ── TAMPILAN LOADING SCREEN ──
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Memuat Alamat...
        </p>
      </div>
    );
  }

  // ── TAMPILAN UTAMA ──
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>
        </div>

        {/* SEARCH BAR (Disembunyikan di mobile) */}
        <div className="flex-1 max-w-xl mx-10 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari produk ramah lingkungan..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/beranda-dashboard" className="text-gray-400 hover:text-white text-xs font-bold transition-colors bg-transparent border-none cursor-pointer mr-2 no-underline flex items-center gap-1">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             Kembali
          </Link>
          <div className="flex items-center gap-3 pl-2 group">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">{user.nama}</p>
                  <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">{user.role}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
                 <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                    {user.nama ? user.nama.charAt(0) : "U"}
                 </div>
               </div>
          </div>
        </div>
      </nav>

      {/* ── KONTEN UTAMA ── */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">

        {/* ── SIDEBAR (Sama dengan Profil, menu Alamat yang aktif) ── */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl">
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff&size=128`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/40 object-cover shadow-[0_0_15px_rgba(47,168,79,0.3)]" alt="Avatar" />
              </div>
              <h3 className="text-lg font-[800] text-white m-0 tracking-tight">{user.nama || "Loading..."}</h3>
              <p className="text-[10px] text-[#2fa84f] m-0 mt-1.5 uppercase font-black tracking-[2px]">{user.role}</p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#2fa84f] transition-colors">
                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span className="text-sm">Profil Saya</span>
              </Link>

              {/* Tanda Aktif pada Alamat */}
              <Link href="/alamat" className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_4px_15px_rgba(47,168,79,0.2)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-sm">Daftar Alamat</span>
              </Link>
              
              <Link href="/pesanan" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-[#2fa84f] transition-colors"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                <span className="text-sm">Pesanan Saya</span>
              </Link>

              {!isSeller ? (
                <Link href="/register-penjual" className="flex items-center gap-3 p-3.5 rounded-2xl text-[#2fa84f] bg-[#2fa84f]/10 border border-[#2fa84f]/20 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <span className="text-sm">Mulai Berjualan</span>
                </Link>
              ) : (
                <Link href="/panel-penjual" className="flex items-center gap-3 p-3.5 rounded-2xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  <span className="text-sm">Panel Inventaris</span>
                </Link>
              )}
              
              <div className="my-4 border-t border-white/5" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition font-bold text-left group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-sm">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── DAFTAR ALAMAT UTAMA ── */}
        <main className="flex-1">
          <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 border border-white/5 shadow-2xl relative overflow-hidden h-full">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#2fa84f] rounded-full opacity-[0.15] blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 relative z-10">
              <div>
                <h2 className="text-3xl font-[800] text-white tracking-tight m-0">Daftar Alamat</h2>
                <p className="text-sm text-gray-400 mt-2 font-medium">Kelola lokasi pengiriman pesanan Anda.</p>
              </div>
              <button 
                onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }}
                className="bg-[#2fa84f] text-white px-7 py-3 rounded-2xl font-[800] text-sm hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:-translate-y-1 whitespace-nowrap"
              >
                + Tambah Alamat Baru
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-5 relative z-10">
              {addresses.map((address) => (
                <div key={address.id} className="border border-white/10 rounded-[24px] p-7 bg-[#1a1f1b]/50 hover:border-[#2fa84f]/40 hover:bg-white/5 transition-all group shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3.5 py-1.5 bg-[#2fa84f] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">{address.label}</span>
                        <span className="font-bold text-white text-lg">{address.name}</span>
                      </div>
                      <p className="text-[14px] text-white/90 font-bold mb-1 tracking-wide">{address.phone}</p>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mt-2 font-medium">
                        {address.fullAddress}, {address.district}, {address.city}, {address.province} ({address.postalCode})
                      </p>
                      {address.detail && <p className="text-[12px] text-[#2fa84f] mt-3 font-bold italic bg-[#2fa84f]/10 inline-block px-3 py-1.5 rounded-lg">Catatan: {address.detail}</p>}
                    </div>
                    
                    {/* Tombol Aksi di dalam Kartu Alamat */}
                    <div className="flex gap-2 w-full md:w-auto opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity mt-4 md:mt-0">
                      <button onClick={() => handleEdit(address)} className="flex-1 md:flex-none px-4 py-2.5 text-white text-xs font-bold bg-white/10 rounded-xl hover:bg-[#2fa84f] transition-all border border-white/5 hover:border-transparent">Edit</button>
                      <button onClick={() => handleDelete(address.id)} className="flex-1 md:flex-none px-4 py-2.5 text-red-400 text-xs font-bold bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 hover:border-transparent">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
              
              {addresses.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[24px] border border-dashed border-white/10 text-gray-500 font-bold">
                  Belum ada alamat tersimpan.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── MODAL FORM (Dark Mode yang Konsisten) ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-in fade-in duration-200">
           <div className="bg-[#1a1f1b] p-8 lg:p-10 rounded-[32px] w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-[800] mb-8 text-white tracking-tight">
                {editingId ? 'Edit Alamat' : 'Tambah Alamat Baru'}
              </h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Label Alamat (Rumah / Kantor)</label>
                  <input name="label" value={formData.label} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" placeholder="Misal: Rumah" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nama Penerima</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nomor Telepon</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" required />
                </div>
                
                {/* Baris Lokasi (Provinsi, Kota) */}
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Provinsi</label>
                  <input name="province" value={formData.province} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Kota / Kabupaten</label>
                  <input name="city" value={formData.city} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" required />
                </div>
                
                {/* Baris Lokasi (Kecamatan, Kode Pos) */}
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Kecamatan</label>
                  <input name="district" value={formData.district} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" required />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Kode Pos</label>
                  <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" required />
                </div>

                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Detail Jalan / Bangunan</label>
                  <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all min-h-[100px] resize-none" required />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Catatan Tambahan (Opsional)</label>
                  <input name="detail" value={formData.detail} onChange={handleInputChange} className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" placeholder="Warna pagar, patokan, dll" />
                </div>

                <div className="flex gap-4 col-span-2 mt-6">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-4 rounded-2xl font-[800] text-sm text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all">Batal</button>
                    <button type="submit" className="flex-1 py-4 rounded-2xl font-[800] text-sm text-white bg-[#2fa84f] hover:bg-[#268c41] transition-all shadow-[0_10px_20px_rgba(47,168,79,0.3)] hover:-translate-y-1">Simpan Alamat</button>
                </div>
              </form>
           </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-transparent py-8 text-center border-t border-[#1a2e1f]/10 mt-auto relative z-10">
         <p className="text-[#1a2e1f]/50 text-[10px] font-black tracking-[4px] uppercase m-0">
            © 2026 GREENMARKET. ALL SELLER & BUYER CATALOG.
         </p>
      </footer>
    </div>
  );
}