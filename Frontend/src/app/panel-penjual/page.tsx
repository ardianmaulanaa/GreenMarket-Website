"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Animation styles
const animationStyles = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
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
  .animate-scale-in {
    opacity: 0;
    animation: scaleIn 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
`;

interface Kategori {
  id_kategori: string;
  nama_kategori: string;
}

interface Produk {
  id_produk?: string;
  nama_produk: string;
  harga: number;
  stok: number;
  foto_produk?: string;
  foto_produk_list?: string[];
  id_kategori: string;
  id_user?: number;
  deskripsi: string;
  konten_deskripsi: string;
  catatan_penjual?: string;
}

export default function PanelPenjual() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("User");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [products, setProducts] = useState<Produk[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produk | null>(null);
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, productId: string | null, productName: string | null}>({ isOpen: false, productId: null, productName: null });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slotInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState<Produk>({
    nama_produk: "",
    harga: 0,
    stok: 0,
    foto_produk: "",
    foto_produk_list: [],
    id_kategori: "",
    deskripsi: "Produk ramah lingkungan.",
    konten_deskripsi: "",
    catatan_penjual: "",
  });

  const fetchInitialData = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");

      const [catRes, prodRes] = await Promise.all([
        fetch("http://localhost:5050/api/categories"),
        fetch(`http://localhost:5050/api/products?userId=${storedUserId}`),
      ]);

      if (!catRes.ok || !prodRes.ok) throw new Error("Gagal mengambil data dari server");

      const catData = (await catRes.json()) as Kategori[];
      const prodData = (await prodRes.json()) as Produk[];

      setCategories(catData);

      const mappedProducts = prodData.map((p) => ({
        ...p,
        konten_deskripsi: p.konten_deskripsi || "",
        catatan_penjual: p.catatan_penjual || "",
        foto_produk: p.foto_produk || "",
        foto_produk_list: p.foto_produk_list || [],
      }));

      setProducts(Array.isArray(mappedProducts) ? mappedProducts : []);

      if (catData.length > 0) {
        setFormData((prev) =>
          prev.id_kategori ? prev : { ...prev, id_kategori: catData[0].id_kategori },
        );
      }
    } catch (error) {
      console.error("Gagal mengambil data awal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUser = localStorage.getItem("user");
    
    if (!storedUserId) {
      alert("Silakan login terlebih dahulu");
      window.location.href = "/login";
      return;
    }
    
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.username) setUserName(parsed.username);
      } catch (e) {
        console.error("Gagal membaca user dari localStorage:", e);
      }
    }

    queueMicrotask(async () => {
      await fetchInitialData();
      setIsPageLoading(false);
      setTimeout(() => {
        setShouldAnimate(true);
      }, 100);
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

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

  const handleOpenModal = (product: Produk | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        konten_deskripsi: product.konten_deskripsi || "",
        catatan_penjual: product.catatan_penjual || "",
        foto_produk_list: product.foto_produk_list || [],
      });
      setImagePreviews(
        product.foto_produk_list && product.foto_produk_list.length > 0
          ? product.foto_produk_list
          : product.foto_produk
            ? [product.foto_produk]
            : []
      );
      setImageFiles([]);
    } else {
      setEditingProduct(null);
      setFormData({
        nama_produk: "",
        harga: 0,
        stok: 0,
        foto_produk: "",
        foto_produk_list: [],
        id_kategori: categories[0]?.id_kategori || "",
        deskripsi: "Produk ramah lingkungan.",
        konten_deskripsi: "",
        catatan_penjual: "",
      });
      setImagePreviews([]);
      setImageFiles([]);
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

    const existingFotoList = editingProduct?.foto_produk_list || [];

    if (imageFiles.length === 0 && existingFotoList.length === 0 && !editingProduct?.foto_produk) {
      alert("Harap upload minimal 1 foto produk.");
      setIsSubmitting(false);
      return;
    }

    const url = editingProduct
      ? `http://localhost:5050/api/products/${editingProduct.id_produk}`
      : "http://localhost:5050/api/products";

    const method = editingProduct ? "PUT" : "POST";

    const payload = new FormData();
    payload.append("nama_produk", formData.nama_produk);
    payload.append("harga", String(Number(formData.harga)));
    payload.append("stok", String(Number(formData.stok)));
    payload.append("id_kategori", formData.id_kategori);
    payload.append("deskripsi", formData.deskripsi);
    payload.append("konten_deskripsi", formData.konten_deskripsi);
    payload.append("catatan_penjual", formData.catatan_penjual || "");
    payload.append("id_user", storedUserId);

    imageFiles.forEach((file) => {
      payload.append("foto_produk_list", file);
    });

    if (editingProduct && imageFiles.length === 0) {
      const existingList =
        editingProduct.foto_produk_list && editingProduct.foto_produk_list.length > 0
          ? editingProduct.foto_produk_list
          : editingProduct.foto_produk
            ? [editingProduct.foto_produk]
            : [];

      payload.append("existing_foto_produk_list", JSON.stringify(existingList));
    }

    try {
      const response = await fetch(url, {
        method,
        body: payload,
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

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, productId: id, productName: name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.productId) return;
    const storedUserId = localStorage.getItem("userId");

    try {
      const response = await fetch(
        `http://localhost:5050/api/products/${deleteModal.productId}?userId=${storedUserId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        fetchInitialData();
        setDeleteModal({ isOpen: false, productId: null, productName: null });
      } else {
        const err = await response.json();
        alert(err.message || "Gagal menghapus produk");
      }
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Menyiapkan Panel...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      <style>{animationStyles}</style>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>

      <nav className={`fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-4 md:px-8 flex items-center justify-between ${shouldAnimate ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard-seller"
            className="flex items-center gap-2 no-underline group"
          >
            <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z" />
              </svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase hidden sm:block">
              Green<span className="text-[#2fa84f]">Market</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase transition-colors bg-transparent border-none cursor-pointer mx-2"
          >
            Logout
          </button>

          <Link
            href="/profile"
            className="flex items-center gap-3 group no-underline border-l border-white/10 pl-4"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">
                {userName}
              </p>
              <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">
                Seller Hub
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </Link>
        </div>
      </nav>

      <main className={`max-w-[1200px] mx-auto pt-28 pb-20 px-4 sm:px-8 flex-1 w-full relative z-10 ${shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-[11px] font-[800] text-[#2fa84f] uppercase tracking-[3px] mb-2 block">
              Seller Hub
            </span>
            <h1 className="text-[32px] font-[800] text-[#1a2e1f] m-0">Panel Inventaris</h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#2fa84f] text-white px-8 py-4 rounded-2xl font-[800] text-[13px] hover:bg-[#268c41] transition-all uppercase tracking-widest border-none cursor-pointer flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Unggah Produk
          </button>
        </div>

        <div className="bg-[#1f2a22]/90 backdrop-blur-xl rounded-[24px] border border-white/10 overflow-hidden shadow-[0_18px_45px_rgba(10,17,11,0.22)]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-black/20 border-b border-white/10 text-slate-300 text-[11px] uppercase font-bold tracking-[2px]">
              <tr>
                <th className="p-6 px-8">Produk</th>
                <th className="p-6 px-8 text-center">Harga</th>
                <th className="p-6 px-8 text-center">Stok</th>
                <th className="p-6 px-8 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-[#2fa84f] font-bold">
                    Memuat data produk...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-400 font-medium">
                    Belum ada produk. Klik Unggah Produk untuk memulai.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id_produk} className="hover:bg-white/[0.04] transition-colors">
                    <td className="p-6 px-8">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            p.foto_produk ||
                            p.foto_produk_list?.[0] ||
                            "https://placehold.co/300x300/1a1f1b/2fa84f?text=No+Image"
                          }
                          alt={p.nama_produk}
                          className="w-14 h-14 rounded-xl object-cover border border-white/10 shadow-sm"
                        />
                        <div>
                          <div className="font-[800] text-white text-[15px]">{p.nama_produk}</div>
                          <div className="text-[11px] text-slate-400 italic mt-0.5">
                            {p.konten_deskripsi?.substring(0, 40)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 px-8 text-center font-bold text-[#2fa84f] text-[15px]">
                      Rp {p.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="p-6 px-8 text-center font-semibold text-white">
                      {p.stok}
                    </td>
                    <td className="p-6 px-8 align-middle text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="px-4 py-2 bg-white/5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-bold cursor-pointer border border-transparent transition-all shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => p.id_produk && handleDelete(p.id_produk, p.nama_produk)}
                          className="px-4 py-2 bg-red-500/10 rounded-xl text-red-400 hover:bg-red-500 hover:text-white font-bold cursor-pointer border border-transparent transition-all shadow-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1f1b] w-full max-w-2xl rounded-[40px] p-8 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-white font-bold text-xl mb-6">
              {editingProduct ? "Edit Produk" : "Unggah Produk"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Foto Produk{" "}
                  <span className="text-gray-500 normal-case">
                    (PNG/JPG, maks 4 foto)
                  </span>
                </label>

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

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
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
                        <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          {i + 1}
                          {i === 0 ? " · Utama" : ""}
                        </span>
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

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

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
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[420px] rounded-[32px] p-8 md:p-10 shadow-2xl relative text-center scale-95 animate-[scaleIn_0.2s_ease-out_forwards]">
            <button
              onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: null })}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="bg-red-50 w-28 h-28 rounded-[36px] mx-auto flex items-center justify-center mb-6">
              <div className="bg-red-100/80 w-20 h-20 rounded-[28px] flex items-center justify-center text-[#ff1e56]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Hapus produk ini?</h3>
            <p className="text-[15px] text-slate-500 mb-8 leading-relaxed px-2">
              Kamu akan menghapus <span className="text-[#059669] font-bold">"{deleteModal.productName}"</span> dari inventaris. Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: null })}
                className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-slate-700 font-bold hover:bg-gray-50 transition-colors cursor-pointer bg-white shadow-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3.5 rounded-2xl bg-[#ff1e56] text-white font-bold shadow-[0_8px_20px_rgba(255,30,86,0.25)] hover:bg-[#ff003e] transition-all border-none cursor-pointer"
              >
                Ya, hapus
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
