"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Kategori {
  id_kategori: string;
  nama_kategori: string;
}

interface Produk {
  id_produk?: string;
  nama_produk: string;
  harga: number;
  stok: number;
  image_url: string;
  id_kategori: string;
  id_user?: number;
}

export default function PanelPenjual() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produk | null>(null);

  const [formData, setFormData] = useState<Produk>({
    nama_produk: "",
    harga: 0,
    stok: 0,
    image_url: "",
    id_kategori: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("http://localhost:5050/api/categories"),
        fetch("http://localhost:5050/api/products")
      ]);

      if (!catRes.ok || !prodRes.ok) throw new Error("Gagal mengambil data dari server");

      const catData = await catRes.json();
      const prodData = await prodRes.json();

      setCategories(catData);
      setProducts(Array.isArray(prodData) ? prodData : []);
      
      if (catData.length > 0 && !formData.id_kategori) {
        setFormData(prev => ({ ...prev, id_kategori: catData[0].id_kategori }));
      }
    } catch (error) {
      console.error("Gagal mengambil data awal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product: Produk | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        nama_produk: "",
        harga: 0,
        stok: 0,
        image_url: "",
        id_kategori: categories[0]?.id_kategori || "", 
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("Sesi berakhir, silakan login ulang.");
      window.location.href = "/login";
      return;
    }

    const url = editingProduct 
      ? `http://localhost:5050/api/products/${editingProduct.id_produk}` 
      : "http://localhost:5050/api/products";
    const method = editingProduct ? "PUT" : "POST";

    if (!formData.id_kategori) {
      alert("Silakan pilih kategori produk.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      harga: Number(formData.harga),
      stok: Number(formData.stok),
      id_user: Number(storedUserId)
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(editingProduct ? "Berhasil diperbarui!" : "Produk berhasil diunggah!");
        setShowModal(false);
        fetchInitialData();
      } else {
        const err = await response.json();
        alert("Gagal: " + (err.message || "Pastikan data valid"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Koneksi gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus produk ini secara permanen?")) {
      try {
        const response = await fetch(`http://localhost:5050/api/products/${id}`, { method: "DELETE" });
        if(response.ok) fetchInitialData();
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* ── Latar Belakang Glow Hijau ── */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Sesuai Dashboard max-w-1600px) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/beranda-dashboard-seller" className="flex items-center gap-2.5 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase hidden sm:block">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/beranda-dashboard-seller" className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm font-bold hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 no-underline border border-transparent hover:border-white/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT (max-w-1600px) ── */}
      <main className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex-1 w-full relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-10">
          <div>
            <span className="text-[11px] font-[800] text-[#2fa84f] uppercase tracking-[3px] mb-2 block">Seller Hub</span>
            <h1 className="text-[32px] lg:text-[36px] font-[800] text-white tracking-tight leading-tight m-0">Panel Inventaris</h1>
            <p className="text-gray-400 text-sm font-medium mt-2 m-0">Kelola listing produk Anda secara dinamis.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#2fa84f] text-white px-8 py-4 rounded-2xl font-[800] text-[13px] hover:bg-[#268c41] transition-all shadow-[0_10px_20px_rgba(47,168,79,0.2)] flex items-center justify-center gap-2 hover:-translate-y-1 uppercase tracking-widest border-none cursor-pointer"
          >
            <span className="text-xl leading-none">+</span> Unggah Produk
          </button>
        </div>

        {/* Tabel Produk (Dark Glassmorphism) */}
        <div className="bg-[#1a1f1b]/60 backdrop-blur-md rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#2fa84f] rounded-bl-full opacity-10 blur-3xl -z-0 pointer-events-none"></div>
          
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 text-[10px] uppercase font-[900] tracking-[2px]">
                <tr>
                  <th className="p-6 font-[900]">Produk</th>
                  <th className="p-6 text-center font-[900]">Harga</th>
                  <th className="p-6 text-center font-[900]">Stok Tersedia</th>
                  <th className="p-6 text-center font-[900]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="p-20 text-center text-[#2fa84f] font-bold animate-pulse">Menghubungkan Database...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={4} className="p-20 text-center text-gray-500 font-medium">Belum ada produk yang diunggah.</td></tr>
                ) : products.map((p) => (
                  <tr key={p.id_produk} className="hover:bg-white/[0.03] transition-colors group text-white">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0 shadow-sm">
                          <img src={p.image_url} alt={p.nama_produk} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <span className="font-[800] text-[15px]">{p.nama_produk}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center text-[#2fa84f] font-[800]">Rp {p.harga.toLocaleString('id-ID')}</td>
                    <td className="p-6 text-center">
                      <span className={`font-bold px-3 py-1.5 rounded-lg text-[12px] border ${p.stok < 10 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-gray-300 border-white/10'}`}>
                        {p.stok} Unit
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleOpenModal(p)} className="p-2.5 bg-white/5 text-gray-400 border border-transparent rounded-xl hover:bg-[#2fa84f]/20 hover:text-[#2fa84f] hover:border-[#2fa84f]/30 transition-all cursor-pointer">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={() => p.id_produk && handleDelete(p.id_produk)} className="p-2.5 bg-white/5 text-gray-400 border border-transparent rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── MODAL FORM (Dark Mode) ── */}
      {showModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmitting && setShowModal(false)}></div>
          <div className="bg-[#1a1f1b] w-full max-w-xl rounded-[40px] p-8 lg:p-10 shadow-2xl border border-white/10 relative overflow-hidden animate-in zoom-in-95 duration-300">
            <h2 className="text-[24px] font-[800] text-white mb-8 tracking-tight">
              {editingProduct ? "Edit Produk" : "Unggah Produk Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div>
                <label className="block text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2 ml-1">Nama Produk</label>
                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white text-sm transition-colors placeholder-gray-600" placeholder="Masukkan nama produk..." value={formData.nama_produk} onChange={(e) => setFormData({...formData, nama_produk: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2 ml-1">Harga (Rp)</label>
                  <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white text-sm transition-colors" value={formData.harga} onChange={(e) => setFormData({...formData, harga: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2 ml-1">Stok Tersedia</label>
                  <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white text-sm transition-colors" value={formData.stok} onChange={(e) => setFormData({...formData, stok: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2 ml-1">Kategori Produk</label>
                <div className="relative">
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white text-sm appearance-none cursor-pointer transition-colors"
                    value={formData.id_kategori}
                    onChange={(e) => setFormData({...formData, id_kategori: e.target.value})}
                  >
                    {categories.length === 0 && <option value="">Memuat kategori...</option>}
                    {categories.map((cat) => (
                      <option key={cat.id_kategori} value={cat.id_kategori} className="bg-[#1a1f1b] text-white">
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-[800] text-gray-400 uppercase tracking-widest mb-2 ml-1">URL Gambar</label>
                <input type="text" required placeholder="https://contoh-gambar.com/img.jpg" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] text-white text-sm transition-colors placeholder-gray-600" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})}/>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" disabled={isSubmitting} onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/5 border border-white/10 text-gray-400 rounded-2xl font-[800] text-[12px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#2fa84f] text-white rounded-2xl font-[800] text-[12px] uppercase tracking-widest hover:bg-[#268c41] transition-all shadow-[0_10px_20px_rgba(47,168,79,0.2)] cursor-pointer border-none">
                  {isSubmitting ? "Memproses..." : "Simpan Produk"}
                </button>
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