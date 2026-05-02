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
  deskripsi: string; 
  konten_deskripsi: string; 
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
    deskripsi: "Produk ramah lingkungan.",
    konten_deskripsi: "",
  });

  useEffect(() => {
    // Validasi Login di awal
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("Silakan login terlebih dahulu");
      window.location.href = "/login";
      return;
    }
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");
      
      // Mengirim userId sebagai query parameter agar backend melakukan filter
      const [catRes, prodRes] = await Promise.all([
        fetch("http://localhost:5050/api/categories"),
        fetch(`http://localhost:5050/api/products?userId=${storedUserId}`)
      ]);

      if (!catRes.ok || !prodRes.ok) throw new Error("Gagal mengambil data dari server");

      const catData = await catRes.json();
      const prodData = await prodRes.json();

      setCategories(catData);
      
      const mappedProducts = prodData.map((p: any) => ({
        ...p,
        konten_deskripsi: p.detail?.konten_deskripsi || ""
      }));

      setProducts(Array.isArray(mappedProducts) ? mappedProducts : []);
      
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
      setFormData({
        ...product,
        konten_deskripsi: product.konten_deskripsi || ""
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nama_produk: "",
        harga: 0,
        stok: 0,
        image_url: "",
        id_kategori: categories[0]?.id_kategori || "", 
        deskripsi: "Produk ramah lingkungan.",
        konten_deskripsi: "",
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

    const payload = {
      ...formData,
      harga: Number(formData.harga),
      stok: Number(formData.stok),
      id_user: Number(storedUserId) // id_user dikirim untuk identifikasi pemilik
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const storedUserId = localStorage.getItem("userId");
    
    if (confirm("Hapus produk ini secara permanen?")) {
      try {
        // Mengirim userId sebagai query param agar backend memverifikasi kepemilikan
        const response = await fetch(`http://localhost:5050/api/products/${id}?userId=${storedUserId}`, { 
          method: "DELETE" 
        });
        
        if(response.ok) {
          fetchInitialData();
        } else {
          const err = await response.json();
          alert(err.message || "Gagal menghapus produk");
        }
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  return (
    /* ... (Sisa kode UI tetap sama seperti sebelumnya) ... */
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      {/* Kode UI Anda di sini */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2.5 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white uppercase sm:block hidden">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>
          <Link href="/beranda-dashboard" className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm font-bold no-underline border border-transparent hover:border-white/10">
            Kembali
          </Link>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex-1 w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-[11px] font-[800] text-[#2fa84f] uppercase tracking-[3px] mb-2 block">Seller Hub</span>
            <h1 className="text-[32px] font-[800] text-white m-0">Panel Inventaris</h1>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#2fa84f] text-white px-8 py-4 rounded-2xl font-[800] text-[13px] hover:bg-[#268c41] transition-all uppercase tracking-widest border-none cursor-pointer"
          >
            + Unggah Produk
          </button>
        </div>

        <div className="bg-[#1a1f1b]/60 backdrop-blur-md rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 text-[10px] uppercase font-[900] tracking-[2px]">
              <tr>
                <th className="p-6">Produk</th>
                <th className="p-6 text-center">Harga</th>
                <th className="p-6 text-center">Stok</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-[#2fa84f]">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-gray-500">Belum ada produk. Klik Unggah Produk untuk memulai.</td></tr>
              ) : products.map((p) => (
                <tr key={p.id_produk} className="hover:bg-white/[0.03]">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={p.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="font-[800]">{p.nama_produk}</div>
                        <div className="text-[10px] text-gray-500 italic">{p.konten_deskripsi?.substring(0, 30)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center text-[#2fa84f]">Rp {p.harga.toLocaleString()}</td>
                  <td className="p-6 text-center">{p.stok}</td>
                  <td className="p-6 flex justify-center gap-2">
                    <button onClick={() => handleOpenModal(p)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer border-none">Edit</button>
                    <button onClick={() => p.id_produk && handleDelete(p.id_produk)} className="p-2 bg-white/5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer border-none">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL FORM TETAP SAMA */}
      {showModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1f1b] w-full max-w-2xl rounded-[40px] p-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-white font-bold text-xl mb-6">{editingProduct ? "Edit Produk" : "Unggah Produk"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Nama Produk</label>
                  <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#2fa84f]" value={formData.nama_produk} onChange={(e) => setFormData({...formData, nama_produk: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Kategori Label</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}>
                    <option value="Produk ramah lingkungan.">Umum</option>
                    <option value="Pakaian Organik">Pakaian Organik</option>
                    <option value="Daur Ulang">Daur Ulang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Harga</label>
                  <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={formData.harga} onChange={(e) => setFormData({...formData, harga: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Stok</label>
                  <input type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={formData.stok} onChange={(e) => setFormData({...formData, stok: parseInt(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">ID Kategori (Database)</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={formData.id_kategori} onChange={(e) => setFormData({...formData, id_kategori: e.target.value})}>
                  {categories.map(c => <option key={c.id_kategori} value={c.id_kategori}>{c.nama_kategori}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Deskripsi Manual</label>
                <textarea 
                  required 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#2fa84f]"
                  placeholder="Jelaskan detail produk..."
                  value={formData.konten_deskripsi}
                  onChange={(e) => setFormData({...formData, konten_deskripsi: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">URL Gambar</label>
                <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 p-4 bg-white/5 text-gray-400 rounded-xl font-bold cursor-pointer border-none">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 p-4 bg-[#2fa84f] text-white rounded-xl font-bold cursor-pointer border-none">
                  {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}