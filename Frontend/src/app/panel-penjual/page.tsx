"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import Nav from "@/components/navbar";

// Animation styles removed - imported globally from globals.css

interface Kategori {
  id_kategori: string;
  nama_kategori: string;
}

interface Produk {
  id_produk?: string;
  nama_produk: string;
  harga: number | "";
  stok: number | "";
  foto_produk?: string;
  foto_produk_list?: string[];
  id_kategori: string;
  id_user?: number;
  deskripsi: string;
  konten_deskripsi: string;
  catatan_penjual?: string;
}

interface SelectOption {
  label: string;
  value: string;
}

const MAX_PRODUCT_PHOTOS = 4;
const MAX_PRODUCT_IMAGE_SIZE_MB = 5;
const MAX_PRODUCT_IMAGE_SIZE_BYTES =
  MAX_PRODUCT_IMAGE_SIZE_MB * 1024 * 1024;

function ProductSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white/5 px-3 py-3 text-left text-white outline-none transition-all ${isOpen
            ? "border-[#2fa84f] shadow-[0_0_10px_rgba(47,168,79,0.3)]"
            : "border-white/10 hover:border-white/20"
          }`}
      >
        <span className="truncate">
          {selectedOption?.label || "Pilih kategori"}
        </span>
        <svg
          className={`ml-3 h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-[#2fa84f]" : ""
            }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[280] overflow-hidden rounded-xl border border-white/10 bg-[#101612] shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${isSelected
                    ? "bg-[#2fa84f]/15 text-[#64d681]"
                    : "text-slate-200 hover:bg-white/7 hover:text-white"
                  }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg
                    className="h-4 w-4 text-[#2fa84f]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PanelPenjual() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("User");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [products, setProducts] = useState<Produk[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produk | null>(null);
  const [nameError, setNameError] = useState("");
  const [successModal, setSuccessModal] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string | null;
    productName: string | null;
  }>({ isOpen: false, productId: null, productName: null });
  const { showToast } = useToast();
  const { userId, user, loading } = useUser();

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slotInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const processedEditProductId = useRef<string | null>(null);

  const [formData, setFormData] = useState<Produk>({
    nama_produk: "",
    harga: "",
    stok: "",
    foto_produk: "",
    foto_produk_list: [],
    id_kategori: "",
    deskripsi: "Produk ramah lingkungan.",
    konten_deskripsi: "",
    catatan_penjual: "",
  });

  const fetchInitialData = async (uid: string) => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("http://localhost:5050/api/categories"),
        fetch(`http://localhost:5050/api/products?userId=${uid}`),
      ]);

      if (!catRes.ok || !prodRes.ok)
        throw new Error("Gagal mengambil data dari server");

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
          prev.id_kategori
            ? prev
            : { ...prev, id_kategori: catData[0].id_kategori },
        );
      }
    } catch (error) {
      console.error("Gagal mengambil data awal:", error);
    } finally {
      setIsProductsLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      showToast("Silakan login terlebih dahulu", "warning");
      router.push("/login");
      return;
    }

    if (user && user.username) {
      setUserName(user.username);
    }

    const init = async () => {
      await fetchInitialData(userId);
      setIsPageLoading(false);
      setTimeout(() => {
        setShouldAnimate(true);
      }, 100);
    };

    init();
  }, [userId, loading, user]);

  useEffect(() => {
    if (!successModal) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessModal(null);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [successModal]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const addFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      if (file.size <= MAX_PRODUCT_IMAGE_SIZE_BYTES) {
        return true;
      }

      showToast(
        `Foto "${file.name}" melebihi batas ${MAX_PRODUCT_IMAGE_SIZE_MB} MB. Pilih gambar yang lebih kecil.`,
        "warning",
      );
      return false;
    });

    const remaining = MAX_PRODUCT_PHOTOS - imagePreviews.length;
    const toAdd = validFiles.slice(0, remaining);

    if (validFiles.length > remaining) {
      showToast(
        `Hanya bisa tambah ${remaining} foto lagi (maks ${MAX_PRODUCT_PHOTOS} total).`,
        "warning",
      );
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
            : [],
      );
      setImageFiles([]);
    } else {
      setEditingProduct(null);
      setFormData({
        nama_produk: "",
        harga: "",
        stok: "",
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
    setNameError("");
    setShowModal(true);
  };

  useEffect(() => {
    if (isProductsLoading) return;

    const editProductId = new URLSearchParams(window.location.search).get(
      "edit",
    );

    if (!editProductId || processedEditProductId.current === editProductId) {
      return;
    }

    processedEditProductId.current = editProductId;

    const targetProduct = products.find(
      (product) => product.id_produk === editProductId,
    );

    if (targetProduct) {
      const timer = window.setTimeout(() => {
        handleOpenModal(targetProduct);
      }, 0);

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      showToast("Produk tidak ditemukan di inventaris Anda.", "warning");
    }, 0);

    return () => {
      window.clearTimeout(timer);
      return;
    };
  }, [isProductsLoading, products]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, nama_produk: val });
    if (val && !/^[a-zA-Z\s'.]+$/.test(val)) {
      setNameError("Nama produk hanya boleh huruf");
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userId) {
      showToast("Sesi berakhir, silakan login ulang.", "warning");
      router.push("/login");
      setIsSubmitting(false);
      return;
    }

    if (!formData.nama_produk || formData.nama_produk.trim() === "") {
      showToast("Nama produk tidak boleh kosong.", "warning");
      setIsSubmitting(false);
      return;
    }

    if (formData.harga === "" || Number(formData.harga) <= 0) {
      showToast("Harga produk harus lebih dari 0.", "warning");
      setIsSubmitting(false);
      return;
    }

    if (formData.stok === "" || Number(formData.stok) < 0 || !Number.isInteger(Number(formData.stok))) {
      showToast("Stok produk tidak valid.", "warning");
      setIsSubmitting(false);
      return;
    }

    const existingFotoList = editingProduct?.foto_produk_list || [];

    if (
      imageFiles.length === 0 &&
      existingFotoList.length === 0 &&
      !editingProduct?.foto_produk
    ) {
      showToast("Harap upload minimal 1 foto produk.", "warning");
      setIsSubmitting(false);
      return;
    }

    if (nameError) {
      showToast("Data tidak valid, periksa kembali input Anda.", "warning");
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
    payload.append("id_user", userId);

    imageFiles.forEach((file) => {
      payload.append("foto_produk_list", file);
    });

    if (editingProduct && imageFiles.length === 0) {
      const existingList =
        editingProduct.foto_produk_list &&
          editingProduct.foto_produk_list.length > 0
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
        setSuccessModal({
          title: editingProduct
            ? "Berhasil diperbarui"
            : "Produk berhasil diunggah",
          message: editingProduct
            ? "Perubahan produk sudah tersimpan di inventaris."
            : "Produk baru sudah masuk ke inventaris toko kamu.",
        });
        setShowModal(false);
        if (userId) fetchInitialData(userId);
      } else {
        const err = await response.json();
        showToast("Gagal: " + (err.message || "Pastikan data valid"), "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Terjadi kesalahan jaringan.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, productId: id, productName: name });
  };

  const confirmDelete = async () => {
    if (!deleteModal.productId) return;

    try {
      const response = await fetch(
        `http://localhost:5050/api/products/${deleteModal.productId}?userId=${userId}`,
        { method: "DELETE" },
      );

      if (response.ok) {
        if (userId) fetchInitialData(userId);
        setDeleteModal({ isOpen: false, productId: null, productName: null });
      } else {
        const err = await response.json();
        showToast(err.message || "Gagal menghapus produk", "error");
      }
    } catch (error) {
      console.error("Gagal menghapus:", error);
      showToast("Terjadi kesalahan jaringan saat menghapus produk.", "error");
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
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>

      <Nav
        variant="panelPenjual"
        shouldAnimate={shouldAnimate}
        userName={userName}
        userRole="SELLER"
        handleLogout={handleLogout}
      />

      <main
        className={`max-w-[1200px] mx-auto pt-28 pb-20 px-4 sm:px-8 flex-1 w-full relative z-10 ${shouldAnimate ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-[11px] font-[800] text-[#2fa84f] uppercase tracking-[3px] mb-2 block">
              Seller Hub
            </span>
            <h1 className="text-[32px] font-[800] text-[#1a2e1f] m-0">
              Panel Inventaris
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#2fa84f] text-white px-8 py-4 rounded-2xl font-[800] text-[13px] hover:bg-[#268c41] transition-all uppercase tracking-widest border-none cursor-pointer flex items-center justify-center gap-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
              {isProductsLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-20 text-center text-[#2fa84f] font-bold"
                  >
                    Memuat data produk...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-20 text-center text-slate-400 font-medium"
                  >
                    Belum ada produk. Klik Unggah Produk untuk memulai.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id_produk}
                    className="hover:bg-white/[0.04] transition-colors"
                  >
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
                          <div className="font-[800] text-white text-[15px]">
                            {p.nama_produk}
                          </div>
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
                          onClick={() =>
                            p.id_produk &&
                            handleDelete(p.id_produk, p.nama_produk)
                          }
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
                    className={`w-full bg-white/5 border rounded-xl p-3 text-white outline-none transition-all ${nameError ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "border-white/10 focus:border-[#2fa84f]"}`}
                    value={formData.nama_produk}
                    onChange={handleNameChange}
                  />
                  {nameError && (
                    <p className="mt-1.5 ml-1 text-xs text-red-400 font-medium">
                      {nameError}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                    Kategori Label
                  </label>
                  <ProductSelect
                    value={formData.deskripsi}
                    onChange={(value) =>
                      setFormData({ ...formData, deskripsi: value })
                    }
                    options={[
                      { label: "Umum", value: "Produk ramah lingkungan." },
                      { label: "Pakaian Organik", value: "Pakaian Organik" },
                      { label: "Daur Ulang", value: "Daur Ulang" },
                    ]}
                  />
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
                    placeholder="Masukkan harga"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#2fa84f] focus:shadow-[0_0_10px_rgba(47,168,79,0.3)] transition-all"
                    value={formData.harga}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        harga:
                          e.target.value === "" ? "" : Number(e.target.value),
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
                    placeholder="Masukkan stok"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#2fa84f] focus:shadow-[0_0_10px_rgba(47,168,79,0.3)] transition-all"
                    value={formData.stok}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stok:
                          e.target.value === "" ? "" : Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Kategori
                </label>
                <ProductSelect
                  value={formData.id_kategori}
                  onChange={(value) =>
                    setFormData({ ...formData, id_kategori: value })
                  }
                  options={categories.map((item) => ({
                    label: item.nama_kategori,
                    value: item.id_kategori,
                  }))}
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Deskripsi
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#2fa84f]"
                  placeholder="Jelaskan detail produk..."
                  value={formData.konten_deskripsi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      konten_deskripsi: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Foto Produk{" "}
                  <span className="text-gray-500 normal-case">
                    (PNG/JPG, maks {MAX_PRODUCT_PHOTOS} foto,{" "}
                    {MAX_PRODUCT_IMAGE_SIZE_MB} MB/foto)
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
                      Pilih hingga {MAX_PRODUCT_PHOTOS} foto PNG/JPG, maks{" "}
                      {MAX_PRODUCT_IMAGE_SIZE_MB} MB per foto
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

                    {Array.from({
                      length: MAX_PRODUCT_PHOTOS - imagePreviews.length,
                    }).map(
                      (_, i) => (
                        <label
                          key={`slot-${i}`}
                          className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#2fa84f]/40 hover:bg-white/[0.03] transition-all"
                        >
                          <span className="text-white/20 text-3xl leading-none">
                            +
                          </span>
                          <span className="text-[10px] text-gray-600 mt-1">
                            Tambah
                          </span>
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
                      ),
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-gray-500">
                    {imagePreviews.length} dari {MAX_PRODUCT_PHOTOS} foto{" "}
                    dipilih
                    {imagePreviews.length > 0 &&
                      " · Foto pertama jadi gambar utama produk"}
                  </span>
                  {imagePreviews.length > 0 &&
                    imagePreviews.length < MAX_PRODUCT_PHOTOS && (
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
      {successModal && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center p-6 bg-black/45 backdrop-blur-sm">
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 bg-[#111815] p-8 text-center shadow-[0_30px_90px_rgba(0,0,0,0.45)] animate-[scaleIn_0.2s_ease-out_forwards]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2fa84f] via-[#63d683] to-[#2fa84f]" />

            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[30px] bg-[#2fa84f]/10 ring-1 ring-[#2fa84f]/25">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#2fa84f] text-white shadow-[0_14px_30px_rgba(47,168,79,0.28)]">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <h3 className="mb-3 text-2xl font-black tracking-tight text-white">
              {successModal.title}
            </h3>
            <p className="mx-auto mb-8 max-w-[300px] text-sm leading-relaxed text-slate-400">
              {successModal.message}
            </p>

            <button
              type="button"
              onClick={() => setSuccessModal(null)}
              className="h-12 w-full rounded-2xl border-none bg-[#2fa84f] font-bold text-white shadow-[0_10px_24px_rgba(47,168,79,0.24)] transition-colors hover:bg-[#268c41]"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[420px] rounded-[32px] p-8 md:p-10 shadow-2xl relative text-center scale-95 animate-[scaleIn_0.2s_ease-out_forwards]">
            <button
              onClick={() =>
                setDeleteModal({
                  isOpen: false,
                  productId: null,
                  productName: null,
                })
              }
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="bg-red-50 w-28 h-28 rounded-[36px] mx-auto flex items-center justify-center mb-6">
              <div className="bg-red-100/80 w-20 h-20 rounded-[28px] flex items-center justify-center text-[#ff1e56]">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
              Hapus produk ini?
            </h3>
            <p className="text-[15px] text-slate-500 mb-8 leading-relaxed px-2">
              Kamu akan menghapus{" "}
              <span className="text-[#059669] font-bold">
                &quot;{deleteModal.productName}&quot;
              </span>{" "}
              dari inventaris. Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    productId: null,
                    productName: null,
                  })
                }
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
    </div>
  );
}
