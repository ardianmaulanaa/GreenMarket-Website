"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Animation styles for smooth entrance effects
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-fade-in-up {
    opacity: 0;
    animation: fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .animate-fade-in {
    opacity: 0;
    animation: fadeIn 0.8s ease-out forwards;
  }

  .animate-slide-in-left {
    opacity: 0;
    animation: slideInLeft 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
`;

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-white/5 rounded-2xl animate-pulse" />,
});

export default function AlamatPage() {
  const router = useRouter();
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [user, setUser] = useState({ nama: "", role: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coords, setCoords] = useState<[number, number]>([-6.9175, 107.6191]);
  
  interface Address {
    id_alamat: string;
    id_user: number;
    nama_penerima: string;
    nomor_hp: string;
    alamat_lengkap: string;
  }

  const [addresses, setAddresses] = useState<Address[]>([]);
  
  const [formData, setFormData] = useState({
    nama_penerima: "",
    nomor_hp: "",
    alamat_lengkap: "",
    latitude: "",
    longitude: "",
  });

  const fetchAddresses = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) { router.push("/login"); return; }
    try {
      const response = await fetch(`http://localhost:5050/api/alamat/${userId}`);
      const data = await response.json();
      if (!response.ok) { alert(data.message || "Gagal mengambil data alamat"); return; }
      setAddresses(data);
    } catch (error) {
      console.error("Gagal mengambil alamat:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      setShouldAnimate(true);
    }, 300);
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      queueMicrotask(() => {
        setUser({ nama: userData.username || userData.name || "User", role: userData.role || "BUYER" });
      });
    }
    queueMicrotask(() => {
      void fetchAddresses();
    });
    return () => clearTimeout(timer);
  }, []);

  const isSeller = user.role === "SELLER" || user.role === "Penjual";

  const handleLogout = () => { localStorage.clear(); router.push("/login"); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Silakan login terlebih dahulu"); router.push("/login"); return; }
    try {
      const url = editingId
        ? `http://localhost:5050/api/alamat/${userId}/${editingId}`
        : `http://localhost:5050/api/alamat/${userId}`;
      const method = editingId ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.message || "Gagal menyimpan alamat"); return; }
      alert(data.message || "Alamat berhasil disimpan");
      await fetchAddresses();
      resetForm();
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Gagal menyimpan alamat:", error);
    }
  };

  const resetForm = () => {
    setFormData({ nama_penerima: "", nomor_hp: "", alamat_lengkap: "", latitude: "", longitude: "" });
    setCoords([-6.9175, 107.6191]);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      nama_penerima: address.nama_penerima,
      nomor_hp: address.nomor_hp,
      alamat_lengkap: address.alamat_lengkap,
      latitude: "",
      longitude: "",
    });
    setEditingId(address.id_alamat);
    setShowForm(true);
  };

  const handleDelete = async (id_alamat: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Silakan login terlebih dahulu"); router.push("/login"); return; }
    if (!confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;
    try {
      const response = await fetch(`http://localhost:5050/api/alamat/${userId}/${id_alamat}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) { alert(data.message || "Gagal menghapus alamat"); return; }
      alert(data.message || "Alamat berhasil dihapus");
      await fetchAddresses();
    } catch (error) {
      console.error("Gagal menghapus alamat:", error);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">Memuat Alamat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      <style>{animationStyles}</style>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between ${shouldAnimate ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => {
              const role = localStorage.getItem("userRole");
              if (role === "SELLER") router.push("/dashboard-seller");
              else router.push("/dashboard-buyer");
            }}
            className="group mr-1 flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 shadow-[0_0_20px_rgba(47,168,79,0.15)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2fa84f]/45 hover:bg-white/10 hover:text-white hover:shadow-[0_6px_28px_rgba(47,168,79,0.28)]"
          >
            <svg className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali
          </button>
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>

          {!isSeller && (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/register-penjual"
                className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold no-underline hover:bg-[#2fa84f] hover:border-transparent transition-all flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Mulai Berjualan
              </Link>
            </div>
          )}
        </div>
        <div className="flex-1 max-w-xl mx-10 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input type="text" placeholder="Cari produk ramah lingkungan..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500" />
          </div>
        </div>
        <div className="flex items-center gap-4">
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

      {/* KONTEN UTAMA */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">

        {/* SIDEBAR */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className={`sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl ${shouldAnimate ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff&size=128`} className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/40 object-cover shadow-[0_0_15px_rgba(47,168,79,0.3)]" alt="Avatar" />
              </div>
              <h3 className="text-lg font-[800] text-white m-0 tracking-tight">{user.nama || "Loading..."}</h3>
              <p className="text-[10px] text-[#2fa84f] m-0 mt-1.5 uppercase font-black tracking-[2px]">{user.role}</p>
            </div>
            <nav className="flex flex-col gap-2">
              <Link href="/profile" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#2fa84f] transition-colors"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-sm">Profil Saya</span>
              </Link>
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
              <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition font-bold text-left group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-sm">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* DAFTAR ALAMAT */}
        <main className="flex-1">
          <div className={`bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 border border-white/5 shadow-2xl relative overflow-hidden h-full ${shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#2fa84f] rounded-full opacity-[0.15] blur-3xl pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 relative z-10">
              <div>
                <h2 className="text-3xl font-[800] text-white tracking-tight m-0">Daftar Alamat</h2>
                <p className="text-sm text-gray-400 mt-2 font-medium">Kelola lokasi pengiriman pesanan Anda.</p>
              </div>
              <button onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }} className="bg-[#2fa84f] text-white px-7 py-3 rounded-2xl font-[800] text-sm hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:-translate-y-1 whitespace-nowrap flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Tambah Alamat Baru
              </button>
            </div>
            <div className="grid grid-cols-1 gap-5 relative z-10">
              {addresses.map((address, index) => (
                <div key={address.id_alamat} className={`border border-white/10 rounded-[24px] p-7 bg-[#1a1f1b]/50 hover:border-[#2fa84f]/40 hover:bg-white/5 transition-all group shadow-lg ${shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'}`} style={shouldAnimate ? { animationDelay: `${300 + index * 100}ms` } : {}}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3.5 py-1.5 bg-[#2fa84f] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">Alamat</span>
                        <span className="font-bold text-white text-lg">{address.nama_penerima}</span>
                      </div>
                      <p className="text-[14px] text-white/90 font-bold mb-1 tracking-wide">{address.nomor_hp}</p>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-2xl mt-2 font-medium">{address.alamat_lengkap}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto opacity-100 transition-opacity mt-4 md:mt-0">
                      <button onClick={() => handleEdit(address)} className="flex-1 md:flex-none px-4 py-2.5 text-white text-xs font-bold bg-white/10 rounded-xl hover:bg-[#2fa84f] transition-all border border-white/5 hover:border-transparent">Edit</button>
                      <button onClick={() => handleDelete(address.id_alamat)} className="flex-1 md:flex-none px-4 py-2.5 text-red-400 text-xs font-bold bg-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 hover:border-transparent">Hapus</button>
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

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1f1b] p-5 lg:p-6 rounded-[24px] w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-[800] mb-5 text-white tracking-tight">
              {editingId ? "Edit Alamat" : "Tambah Alamat Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Nama Penerima</label>
                <input name="nama_penerima" value={formData.nama_penerima} onChange={handleInputChange} className="w-full px-4 py-3 border border-white/10 rounded-xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" required />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Nomor Telepon</label>
                <input name="nomor_hp" value={formData.nomor_hp} onChange={handleInputChange} className="w-full px-4 py-3 border border-white/10 rounded-xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all" required />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Alamat Lengkap</label>
                <textarea name="alamat_lengkap" value={formData.alamat_lengkap} onChange={handleInputChange} className="w-full px-4 py-3 border border-white/10 rounded-xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all min-h-[70px] resize-none" required />
              </div>

              {/* MAP PICKER */}
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">
                  Pilih Lokasi di Peta
                </label>
                <MapPicker
                  position={coords}
                  onSelect={(lat, lng, alamat) => {
                    setCoords([lat, lng]);
                    setFormData(prev => ({
                      ...prev,
                      latitude: lat.toString(),
                      longitude: lng.toString(),
                      alamat_lengkap: alamat,
                    }));
                  }}
                />
                <p className="text-[11px] text-gray-500 mt-1.5 ml-1">Cari atau klik peta untuk menentukan lokasi</p>
              </div>

              <div className="flex gap-3 col-span-2 mt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl font-[800] text-sm text-gray-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-[800] text-sm text-white bg-[#2fa84f] hover:bg-[#268c41] transition-all shadow-[0_10px_20px_rgba(47,168,79,0.3)] hover:-translate-y-1">Simpan Alamat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-transparent py-8 text-center border-t border-[#1a2e1f]/10 mt-auto relative z-10">
        <p className="text-[#1a2e1f]/50 text-[10px] font-black tracking-[4px] uppercase m-0">
          © 2026 GREENMARKET. ALL SELLER & BUYER CATALOG.
        </p>
      </footer>
    </div>
  );
}
