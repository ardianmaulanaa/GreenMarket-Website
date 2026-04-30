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
      
      // Sinkronisasi: Set kategori pertama sebagai default jika id_kategori kosong
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
        id_kategori: categories[0]?.id_kategori || "", // Pastikan kategori pertama terpilih otomatis
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

    // Validasi tambahan agar id_kategori tidak kosong (UUID)
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
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-md border-b border-white/5 shadow-lg py-3 px-8 flex items-center justify-between h-[68px]">
        <div className="flex items-center gap-8 text-white">
          <Link href="/beranda-dashboard-seller" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-[18px] font-[800] tracking-[-0.5px]">GreenMarket</span>
          </Link>
          <Link href="/beranda-dashboard-seller" className="text-white/70 font-bold text-sm no-underline hover:text-[#2fa84f] transition-colors flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Beranda Seller
          </Link>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow container mx-auto pt-28 px-6 lg:px-12 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-[11px] font-[800] text-[#2fa84f] uppercase tracking-[3px] mb-2 block">Seller Hub</span>
            <h1 className="text-[36px] font-[800] text-white tracking-tight leading-tight">Panel Inventaris</h1>
            <p className="text-gray-400 text-sm font-medium mt-1">Kelola listing produk Anda secara dinamis.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#2fa84f] text-white px-8 py-4 rounded-2xl font-[800] text-[13px] hover:bg-[#268c41] transition-all shadow-xl flex items-center gap-2 hover:-translate-y-1 uppercase tracking-widest"
          >
            <span className="text-xl">+</span> Unggah Produk
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-white/50 text-[10px] uppercase font-[900] tracking-[2px]">
                <tr>
                  <th className="p-6">Produk</th>
                  <th className="p-6 text-center">Harga</th>
                  <th className="p-6 text-center">Stok</th>
                  <th className="p-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="p-20 text-center text-[#2fa84f] font-bold animate-pulse">Menghubungkan Database...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={4} className="p-20 text-center text-white/30 font-medium">Belum ada produk yang diunggah.</td></tr>
                ) : products.map((p) => (
                  <tr key={p.id_produk} className="hover:bg-white/[0.02] transition-colors group text-white">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0">
                          <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-[800] text-[15px]">{p.nama_produk}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center text-[#2fa84f] font-[800]">Rp {p.harga.toLocaleString('id-ID')}</td>
                    <td className="p-6 text-center font-bold text-gray-500">{p.stok} Unit</td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleOpenModal(p)} className="p-2.5 bg-white/5 text-[#2fa84f] rounded-xl hover:bg-[#2fa84f] hover:text-white transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                        <button onClick={() => p.id_produk && handleDelete(p.id_produk)} className="p-2.5 bg-white/5 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0a110b]/80 backdrop-blur-md" onClick={() => !isSubmitting && setShowModal(false)}></div>
          <div className="bg-[#1a1f1b] w-full max-w-lg rounded-[40px] p-10 shadow-2xl border border-white/10 relative overflow-hidden">
            <h2 className="text-[26px] font-[800] text-white mb-8 tracking-tight">
              {editingProduct ? "Edit Produk" : "Unggah Produk"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-[800] text-gray-500 uppercase tracking-widest mb-2 ml-1">Nama Produk</label>
                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] text-white text-sm" value={formData.nama_produk} onChange={(e) => setFormData({...formData, nama_produk: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-[800] text-gray-500 uppercase tracking-widest mb-2 ml-1">Harga (Rp)</label>
                  <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] text-white text-sm" value={formData.harga} onChange={(e) => setFormData({...formData, harga: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-[800] text-gray-500 uppercase tracking-widest mb-2 ml-1">Stok</label>
                  <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] text-white text-sm" value={formData.stok} onChange={(e) => setFormData({...formData, stok: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-[800] text-gray-500 uppercase tracking-widest mb-2 ml-1">Kategori Produk</label>
                <div className="relative">
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] text-white text-sm appearance-none cursor-pointer"
                    value={formData.id_kategori}
                    onChange={(e) => setFormData({...formData, id_kategori: e.target.value})}
                  >
                    {categories.length === 0 && <option value="">Memuat kategori...</option>}
                    {categories.map((cat) => (
                      <option key={cat.id_kategori} value={cat.id_kategori} className="bg-[#1a1f1b]">
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-[800] text-gray-500 uppercase tracking-widest mb-2 ml-1">URL Gambar</label>
                <input type="text" required placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#2fa84f] text-white text-sm" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" disabled={isSubmitting} onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-[800] text-[12px] uppercase tracking-widest hover:text-white transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#2fa84f] text-white rounded-2xl font-[800] text-[12px] uppercase tracking-widest hover:bg-[#268c41] transition-all shadow-lg shadow-[#2fa84f]/20">
                  {isSubmitting ? "Memproses..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#0a110b] pt-12 pb-8 px-8 text-white relative z-10 border-t border-white/5 text-center mt-auto">
         <p className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">© 2026 GREENMARKET HUB</p>
      </footer>
    </div>
  );
}