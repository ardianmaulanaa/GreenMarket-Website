"use client";

import React, { useEffect, useRef, useState } from "react";
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

  // State untuk foto
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slotInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

      const [catRes, prodRes] = await Promise.all([
        fetch("http://localhost:5050/api/categories"),
        fetch(`http://localhost:5050/api/products?userId=${storedUserId}`),
      ]);

      if (!catRes.ok || !prodRes.ok) throw new Error("Gagal mengambil data dari server");

      const catData = await catRes.json();
      const prodData = await prodRes.json();

      setCategories(catData);

      const mappedProducts = prodData.map((p: any) => ({
        ...p,
        konten_deskripsi: p.detail?.konten_deskripsi || "",
      }));

      setProducts(Array.isArray(mappedProducts) ? mappedProducts : []);

      if (catData.length > 0 && !formData.id_kategori) {
        setFormData((prev) => ({ ...prev, id_kategori: catData[0].id_kategori }));
      }
    } catch (error) {
      console.error("Gagal mengambil data awal:", error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Foto Handlers ─────────────────────────────────────────────────────────

  const addFiles = (files: File[]) => {
    const remaining = 4 - imagePreviews.length;
    const toAdd = files.slice(0, remaining);

    if (files.length > remaining) {
      alert(`Hanya bisa tambah ${remaining} foto lagi (maks 4 total).`);
    }

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
        setImageFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    e.target.value = "";
  };

  const removePhoto = (idx: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ─── Modal ─────────────────────────────────────────────────────────────────

  const handleOpenModal = (product: Produk | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product, konten_deskripsi: product.konten_deskripsi || "" });
      // Preload existing image as preview (URL string, bukan File)
      setImagePreviews(product.image_url ? [product.image_url] : []);
      setImageFiles([]);
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
      setImagePreviews([]);
      setImageFiles([]);
    }
    setShowModal(true);
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("Sesi berakhir, silakan login ulang.");
      window.location.href = "/login";
      return;
    }

    if (imageFiles.length === 0 && !editingProduct?.image_url) {
      alert("Harap upload minimal 1 foto produk.");
      setIsSubmitting(false);
      return;
    }

    const url = editingProduct
      ? `http://localhost:5050/api/products/${editingProduct.id_produk}`
      : "http://localhost:5050/api/products";

    const method = editingProduct ? "PUT" : "POST";

    // Kirim sebagai FormData agar bisa bawa file
    const payload = new FormData();
    payload.append("nama_produk", formData.nama_produk);
    payload.append("harga", String(Number(formData.harga)));
    payload.append("stok", String(Number(formData.stok)));
    payload.append("id_kategori", formData.id_kategori);
    payload.append("deskripsi", formData.deskripsi);
    payload.append("konten_deskripsi", formData.konten_deskripsi);
    payload.append("id_user", storedUserId);

    // Lampirkan semua file foto baru
    imageFiles.forEach((file, i) => {
      payload.append(`foto_${i}`, file);
    });

    // Kalau edit dan tidak ada file baru, kirim URL lama
    if (editingProduct && imageFiles.length === 0 && editingProduct.image_url) {
      payload.append("existing_image_url", editingProduct.image_url);
    }

    try {
      const response = await fetch(url, {
        method,
        body: payload,
        // Jangan set Content-Type — biarkan browser set boundary multipart/form-data
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
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    const storedUserId = localStorage.getItem("userId");

    if (confirm("Hapus produk ini secara permanen?")) {
      try {
        const response = await fetch(
          `http://localhost:5050/api/products/${id}?userId=${storedUserId}`,
          { method: "DELETE" }
        );

        if (response.ok) {
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

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2.5 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z" />
              </svg>
            </div>
            <span className="text-xl font-black text-white uppercase sm:block hidden">
              Green<span className="text-[#2fa84f]">Market</span>
            </span>
          </Link>
          <Link
            href="/beranda-dashboard"
            className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm font-bold no-underline border border-transparent hover:border-white/10"
          >
            Kembali
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex-1 w-full relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-[11px] font-[800] text-[#2fa84f] uppercase tracking-[3px] mb-2 block">
              Seller Hub
            </span>
            <h1 className="text-[32px] font-[800] text-white m-0">Panel Inventaris</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#2fa84f] text-white px-8 py-4 rounded-2xl font-[800] text-[13px] hover:bg-[#268c41] transition-all uppercase tracking-widest border-none cursor-pointer"
          >
            + Unggah Produk
          </button>
        </div>

        {/* Tabel Produk */}
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
                <tr>
                  <td colSpan={4} className="p-20 text-center text-[#2fa84f]">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-500">
                    Belum ada produk. Klik Unggah Produk untuk memulai.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id_produk} className="hover:bg-white/[0.03]">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={p.image_url}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-[800]">{p.nama_produk}</div>
                          <div className="text-[10px] text-gray-500 italic">
                            {p.konten_deskripsi?.substring(0, 30)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center text-[#2fa84f]">
                      Rp {p.harga.toLocaleString()}
                    </td>
                    <td className="p-6 text-center">{p.stok}</td>
                    <td className="p-6 flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer border-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => p.id_produk && handleDelete(p.id_produk)}
                        className="p-2 bg-white/5 rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer border-none"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ─── MODAL ─────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1f1b] w-full max-w-2xl rounded-[40px] p-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-white font-bold text-xl mb-6">
              {editingProduct ? "Edit Produk" : "Unggah Produk"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama & Kategori Label */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#2fa84f]"
                    value={formData.nama_produk}
                    onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    Kategori Label
                  </label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  >
                    <option value="Produk ramah lingkungan.">Umum</option>
                    <option value="Pakaian Organik">Pakaian Organik</option>
                    <option value="Daur Ulang">Daur Ulang</option>
                  </select>
                </div>
              </div>

              {/* Harga & Stok */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    Harga
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                    value={Number.isNaN(formData.harga) ? "" : formData.harga}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        harga: e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                    value={Number.isNaN(formData.stok) ? "" : formData.stok}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stok: e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* ID Kategori Database */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  ID Kategori (Database)
                </label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                  value={formData.id_kategori}
                  onChange={(e) => setFormData({ ...formData, id_kategori: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id_kategori} value={c.id_kategori}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Deskripsi Manual
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#2fa84f]"
                  placeholder="Jelaskan detail produk..."
                  value={formData.konten_deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, konten_deskripsi: e.target.value })
                  }
                />
              </div>

              {/* ─── FOTO PRODUK ─────────────────────────────────────────── */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Foto Produk{" "}
                  <span className="text-gray-500 normal-case">
                    (PNG/JPG, maks 4 foto)
                  </span>
                </label>

                {/* Upload zone — tampil hanya saat belum ada foto */}
                {imagePreviews.length === 0 && (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-[#2fa84f]/50 transition-colors bg-white/[0.02]">
                    <svg
                      className="w-9 h-9 text-gray-500 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-400 font-semibold">
                      Klik untuk pilih foto
                    </span>
                    <span className="text-[11px] text-gray-600 mt-1">
                      Pilih hingga 4 foto PNG/JPG sekaligus
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}

                {/* Grid preview foto + slot kosong */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {/* Foto yang sudah dipilih */}
                    {imagePreviews.map((url, i) => (
                      <div
                        key={`photo-${i}`}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group"
                      >
                        <img
                          src={url}
                          alt={`foto ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Badge nomor foto */}
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          {i + 1}
                          {i === 0 ? " · Utama" : ""}
                        </span>
                        {/* Tombol hapus */}
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                          aria-label={`Hapus foto ${i + 1}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Slot kosong yang bisa diklik untuk tambah foto */}
                    {Array.from({ length: 4 - imagePreviews.length }).map((_, i) => (
                      <label
                        key={`slot-${i}`}
                        className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#2fa84f]/40 hover:bg-white/[0.03] transition-all"
                      >
                        <span className="text-white/20 text-3xl leading-none">+</span>
                        <span className="text-[10px] text-gray-600 mt-1">Tambah</span>
                        <input
                          ref={(el) => {
                            slotInputRefs.current[i] = el;
                          }}
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    ))}
                  </div>
                )}

                {/* Counter & info */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-gray-500">
                    {imagePreviews.length} dari 4 foto dipilih
                    {imagePreviews.length > 0 && " · Foto pertama jadi gambar utama produk"}
                  </span>
                  {imagePreviews.length > 0 && imagePreviews.length < 4 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-[#2fa84f] underline bg-transparent border-none cursor-pointer p-0"
                    >
                      + Tambah foto
                    </button>
                  )}
                </div>

                {/* Hidden input utama (untuk trigger dari tombol "Tambah foto") */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {/* ─────────────────────────────────────────────────────────── */}

              {/* Tombol aksi */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 p-4 bg-white/5 text-gray-400 rounded-xl font-bold cursor-pointer border-none hover:bg-white/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 p-4 bg-[#2fa84f] text-white rounded-xl font-bold cursor-pointer border-none hover:bg-[#268c41] transition-colors disabled:opacity-50"
                >
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
