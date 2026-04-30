"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Produk {
  id_produk?: number;
  nama_produk: string;
  harga: number;
  stok: number;
  image_url: string;
  id_kategori: string;
}

export default function PanelPenjual() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produk | null>(null);

  // State untuk form
  const [formData, setFormData] = useState<Produk>({
    nama_produk: "",
    harga: 0,
    stok: 0,
    image_url: "",
    id_kategori: "1",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setLoading(false);
    }
  };

  const handleOpenModal = (product: Produk | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ nama_produk: "", harga: 0, stok: 0, image_url: "", id_kategori: "1" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct 
      ? `http://localhost:5050/api/products/${editingProduct.id_produk}` 
      : "http://localhost:5050/api/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingProduct ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!");
        setShowModal(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await fetch(`http://localhost:5050/api/products/${id}`, { method: "DELETE" });
        fetchProducts();
      } catch (error) {
        console.error("Gagal menghapus:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <Link href="/beranda-dashboard-seller" className="text-[#2fa84f] font-bold text-sm hover:underline mb-2 block">← Kembali ke Beranda</Link>
            <h1 className="text-3xl font-[800] text-[#1a2e1f]">Panel Penjual</h1>
            <p className="text-[#6b7c71]">Kelola inventaris produk ramah lingkungan Anda.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#2fa84f] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#1a2e1f] transition-all shadow-lg flex items-center gap-2 w-fit"
          >
            <span>+</span> Unggah Produk Baru
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-[24px] border border-[#e0e6e2] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f1f8e9] text-[#1a2e1f] text-sm uppercase">
                <tr>
                  <th className="p-5 font-[800]">Produk</th>
                  <th className="p-5 font-[800]">Harga</th>
                  <th className="p-5 font-[800]">Stok</th>
                  <th className="p-5 font-[800] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2ef]">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-[#2fa84f] animate-pulse">Memproses data...</td></tr>
                ) : products.map((p) => (
                  <tr key={p.id_produk} className="hover:bg-[#fcfdfc] transition">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                          <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-[#1a2e1f]">{p.nama_produk}</span>
                      </div>
                    </td>
                    <td className="p-5 text-[#2fa84f] font-bold">Rp {p.harga.toLocaleString('id-ID')}</td>
                    <td className="p-5 text-[#6b7c71]">{p.stok} unit</td>
                    <td className="p-5">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleOpenModal(p)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => p.id_produk && handleDelete(p.id_produk)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form Unggah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-[800] text-[#1a2e1f] mb-6">
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6b7c71] uppercase mb-2">Nama Produk</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#f8faf9] border border-[#e0e6e2] rounded-xl px-4 py-3 outline-none focus:border-[#2fa84f] transition"
                  value={formData.nama_produk}
                  onChange={(e) => setFormData({...formData, nama_produk: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6b7c71] uppercase mb-2">Harga (Rp)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-[#f8faf9] border border-[#e0e6e2] rounded-xl px-4 py-3 outline-none focus:border-[#2fa84f] transition"
                    value={formData.harga}
                    onChange={(e) => setFormData({...formData, harga: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6b7c71] uppercase mb-2">Stok</label>
                  <input 
                    type="number" 
                    required
                    className="w-full bg-[#f8faf9] border border-[#e0e6e2] rounded-xl px-4 py-3 outline-none focus:border-[#2fa84f] transition"
                    value={formData.stok}
                    onChange={(e) => setFormData({...formData, stok: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b7c71] uppercase mb-2">URL Gambar</label>
                <input 
                  type="text" 
                  placeholder="https://image.com/produk.jpg"
                  className="w-full bg-[#f8faf9] border border-[#e0e6e2] rounded-xl px-4 py-3 outline-none focus:border-[#2fa84f] transition"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-[#e0e6e2] rounded-xl font-bold text-[#6b7c71] hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#2fa84f] text-white rounded-xl font-bold hover:bg-[#1a2e1f] transition shadow-md"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}