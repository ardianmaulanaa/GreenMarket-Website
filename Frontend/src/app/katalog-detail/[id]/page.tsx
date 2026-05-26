"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/useToast";
import Nav from "@/components/navbar";

interface Produk {
  id_produk: string;
  id_user_seller: number;
  nama_produk: string;
  harga: number;
  stok: number;
  deskripsi: string;
  foto_produk?: string;
  foto_produk_list?: string[];
  konten_deskripsi?: string;
  catatan_penjual?: string | null;
  kategori?: { nama_kategori: string };
  seller?: {
    username: string;
    email: string;
    createdAt?: string;
    toko?: {
      id_toko: string;
      nama_toko: string;
      email_bisnis?: string | null;
      alamat_toko?: string | null;
      created_at?: string;
    } | null;
  };
  total_terjual?: number;
}

export default function DetailProdukPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const searchParams = useSearchParams();
  const fromToko = searchParams.get("fromToko");

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [user, setUser] = useState({ nama: "", role: "" });
  const [product, setProduct] = useState<Produk | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      queueMicrotask(() => {
        setUser({
          nama: userData.username || userData.name || "User",
          role: userData.role || "BUYER",
        });
      });
    }

    const fetchProductDetail = async () => {
      if (!productId) {
        setIsPageLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5050/api/products/${productId}`,
        );
        if (!response.ok) throw new Error("Gagal mengambil detail produk");

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error Fetching Product:", error);
        showToast("Gagal memuat detail produk. Periksa koneksi internet Anda.", "error");
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchProductDetail();

    return () => clearTimeout(timer);
  }, [productId]);

  const isGuestUser = () => {
    const userRole = localStorage.getItem("userRole");

    if (userRole === "GUEST") {
      setShowLoginPopup(true);
      return true;
    }

    return false;
  };

  const handleAddKeranjang = async () => {
    if (isGuestUser()) return;

    const userId = localStorage.getItem("userId");

    if (!userId) {
      showToast("Silakan login terlebih dahulu", "warning");
      router.push("/login");
      return;
    }

    if (!product?.id_produk) {
      showToast("Produk tidak ditemukan", "error");
      return;
    }

    if (currentUserId === product.id_user_seller) {
      showToast("Produk sendiri bisa dikelola lewat panel inventaris.", "warning");
      router.push(`/panel-penjual?edit=${product.id_produk}`);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5050/api/keranjang/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_produk: product.id_produk,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Gagal memasukkan produk ke keranjang.", "error");
        return;
      }

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Gagal tambah keranjang:", error);
      showToast("Terjadi kesalahan. Periksa koneksi internet Anda.", "error");
    }
  };

  const handleBeliSekarang = () => {
    if (isGuestUser()) return;

    if (!product?.id_produk) {
      showToast("Produk tidak ditemukan", "error");
      return;
    }

    if (currentUserId === product.id_user_seller) {
      showToast("Produk sendiri tidak bisa dibeli. Buka panel inventaris untuk mengedit.", "warning");
      router.push(`/panel-penjual?edit=${product.id_produk}`);
      return;
    }

    router.push(`/pembayaran?produk=${product.id_produk}&qty=${quantity}`);
  };

  const handleEditProduct = () => {
    if (!product?.id_produk) return;

    router.push(`/panel-penjual?edit=${product.id_produk}`);
  };

  const handleQuantity = (type: "min" | "plus") => {
    if (!product) return;
    if (type === "min" && quantity > 1) setQuantity(quantity - 1);
    if (type === "plus" && quantity < product.stok) setQuantity(quantity + 1);
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Memuat Detail Produk...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans text-white">
        <h2 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h2>
        <Link
          href="/dashboard-buyer"
          className="text-[#2fa84f] hover:underline"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const productImages =
    product.foto_produk_list && product.foto_produk_list.length > 0
      ? product.foto_produk_list
      : product.foto_produk
        ? [product.foto_produk]
        : ["https://via.placeholder.com/1000"];

  const currentUserId =
    typeof window === "undefined"
      ? null
      : Number(localStorage.getItem("userId")) || null;

  const isOwnProduct = currentUserId === product.id_user_seller;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#2fa84f] opacity-10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {showPopup && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto"
          onClick={() => setShowPopup(false)}
        >
          <style>{`
            .animate-checkmark {
              stroke-dasharray: 50;
              stroke-dashoffset: 50;
              animation: drawCheck 0.4s cubic-bezier(0.65, 0, 0.45, 1) forwards;
              animation-delay: 0.15s;
            }
            @keyframes drawCheck {
              to { stroke-dashoffset: 0; }
            }
            .popup-bounce {
              animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            @keyframes bounceIn {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>

          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>

          <div className="relative z-10 flex flex-col items-center justify-center bg-[#2c2c2c]/95 backdrop-blur-md rounded-[16px] p-8 w-[340px] shadow-2xl popup-bounce border border-white/5">
            <div className="w-[84px] h-[84px] bg-[#00c09d] rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  className="animate-checkmark"
                  points="20 6 9 17 4 12"
                ></polyline>
              </svg>
            </div>
            <p className="text-white text-[19px] font-medium tracking-wide text-center leading-snug drop-shadow-md">
              Produk telah ditambahkan ke keranjang belanja
            </p>
          </div>
        </div>
      )}

      {showLoginPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginPopup(false)}
          ></div>

          <div className="relative z-10 flex flex-col items-center justify-center bg-[#0a110b] border border-[#2fa84f]/20 rounded-[24px] p-8 w-[420px] shadow-2xl popup-bounce">
            <button
              onClick={() => setShowLoginPopup(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="w-[84px] h-[84px] bg-[#2fa84f] rounded-[24px] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(47,168,79,0.3)]">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="2"></circle>
                <circle cx="20" cy="21" r="2"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>

            <h2 className="text-white text-2xl font-bold mb-3 tracking-tight text-center">
              Login Diperlukan
            </h2>
            <p className="text-gray-300 text-sm font-medium tracking-wide text-center leading-relaxed mb-8">
              Anda harus login terlebih dahulu untuk melanjutkan
              <br />
              pembelian produk.
            </p>

            <div className="flex gap-4 w-full">
              <Link
                href="/login"
                className="flex-1 py-3.5 rounded-[16px] font-bold text-sm text-white bg-[#2fa84f] hover:bg-[#268c41] transition-all shadow-[0_4px_15px_rgba(47,168,79,0.3)] hover:-translate-y-0.5 text-center flex items-center justify-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex-1 py-3.5 rounded-[16px] font-bold text-sm text-white bg-transparent border border-white/20 hover:bg-white/5 transition-all text-center flex items-center justify-center"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
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
            <svg
              className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali
          </button>
          <Link
            href="/dashboard-buyer"
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

        <div className="flex-1 max-w-xl mx-10 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari produk di GreenMarket..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/keranjang"
            className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </Link>
          {user.role === "GUEST" && (
            <div className="flex items-center gap-3 mx-2 border-l border-white/10 pl-6 h-8">
              <Link
                href="/login"
                className="bg-transparent border border-[#2fa84f] text-[#2fa84f] px-5 py-2 rounded-xl text-xs font-bold no-underline hover:bg-[#2fa84f]/10 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-[#2fa84f] text-white px-5 py-2 rounded-xl text-xs font-bold no-underline hover:bg-[#268c41] transition-colors shadow-[0_4px_15px_rgba(47,168,79,0.2)] hover:-translate-y-0.5"
              >
                Daftar
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              const userRole = localStorage.getItem("userRole");

              if (userRole === "GUEST") {
                showToast("Fitur ini tidak tersedia pada akun guest.", "warning");
                return;
              }

              router.push("/profile");
            }}
            className="flex items-center gap-3 pl-2 group no-underline border-l border-white/10 ml-2 bg-transparent border-y-0 border-r-0 cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">
                {user.nama || "User"}
              </p>
              <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">
                {user.role}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                {user.nama ? user.nama.charAt(0) : "U"}
              </div>
            </div>
          </button>
        </div>
      </nav>
      <Nav variant="detail" user={user} />

      <main className="flex-grow container max-w-[1200px] mx-auto pt-28 px-6 pb-20 relative z-10 w-full">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-6">
          <Link
            href="/dashboard-buyer"
            className="hover:text-[#2fa84f] transition-colors"
          >
            GreenMarket
          </Link>
          {fromToko && (
            <>
              <span>/</span>
              <Link
                href={`/toko/${product.id_user_seller}`}
                className="hover:text-[#2fa84f] transition-colors truncate max-w-[160px]"
              >
                {fromToko}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#2fa84f] truncate max-w-[200px] sm:max-w-none">
            {product.nama_produk}
          </span>
        </div>

        <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 lg:p-10 border border-white/5 shadow-2xl mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="w-full aspect-square bg-[#0a110b] rounded-[24px] overflow-hidden border border-white/10 relative shadow-inner group cursor-crosshair">
                <Image
                  src={productImages[activeImage] || productImages[0]}
                  alt={product.nama_produk}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
              </div>

              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {productImages.map((foto, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx
                        ? "border-[#2fa84f] shadow-[0_0_15px_rgba(47,168,79,0.3)]"
                        : "border-white/10 hover:border-[#2fa84f]/50"
                      }`}
                  >
                    <Image
                      src={foto || "https://via.placeholder.com/1000"}
                      alt={`Thumb ${idx + 1}`}
                      fill
                      className="object-cover opacity-80"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col">
              <h1 className="text-2xl sm:text-[28px] font-[800] text-white tracking-tight leading-tight mb-3">
                {product.nama_produk}
              </h1>

              <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mb-6">
                <div>
                  <span className="text-white text-base">
                    {product.kategori?.nama_kategori}
                  </span>
                </div>

                <div className="h-4 w-[1px] bg-white/20"></div>

                <div>
                  <span className="text-white text-base">
                    {product.total_terjual || 0}
                  </span>{" "}
                  Terjual
                </div>

                <div className="h-4 w-[1px] bg-white/20"></div>

                <div>
                  Stok{" "}
                  <span className="text-white text-base">{product.stok}</span>
                </div>
              </div>

              <div className="bg-[#1a1f1b]/50 border border-white/5 rounded-[24px] p-6 mb-8 shadow-inner">
                <div className="flex items-end gap-3">
                  <span className="text-3xl sm:text-[40px] font-black text-[#2fa84f] tracking-tighter">
                    Rp {product.harga.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 mb-8 text-sm font-bold">
                <span className="text-gray-500 uppercase tracking-widest text-[11px] mt-1">
                  Pengiriman
                </span>

                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-white">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2fa84f"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5"
                    >
                      <rect x="3" y="6" width="13" height="11" rx="2" />
                      <path d="M16 10h4l3 3v4h-7" />
                      <circle cx="7" cy="17" r="2" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>

                    <div>
                      <span>
                        Dikirim dari{" "}
                        {product.seller?.toko?.alamat_toko || "lokasi toko"}
                      </span>
                      <p className="text-gray-400 text-xs mt-1 font-medium leading-relaxed">
                        Pilihan jasa kirim dapat dipilih saat pembayaran.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {isOwnProduct ? (
                <div className="flex justify-end mt-10">
                  <button
                    type="button"
                    onClick={handleEditProduct}
                    className="flex-1 rounded-2xl bg-[#2fa84f] py-4 text-sm font-[800] text-white shadow-[0_10px_25px_rgba(47,168,79,0.3)] transition-all hover:-translate-y-1 hover:bg-[#268c41] sm:flex-none sm:w-[220px]"
                  >
                    Edit Produk
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-[120px_1fr] gap-4 items-center mb-10">
                    <span className="text-gray-500 uppercase tracking-widest text-[11px] font-bold">
                      Kuantitas
                    </span>
                    <div className="flex items-center gap-5">
                      <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5">
                        <button
                          onClick={() => handleQuantity("min")}
                          className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors border-r border-white/10"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <div className="w-14 h-10 flex items-center justify-center text-white font-bold text-sm bg-[#1a1f1b]">
                          {quantity}
                        </div>
                        <button
                          onClick={() => handleQuantity("plus")}
                          className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors border-l border-white/10"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-400">
                        Maks. {product.stok} item
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end mt-10">
                    <button
                      onClick={handleAddKeranjang}
                      className="flex-1 lg:flex-none lg:w-[230px] py-4 rounded-2xl font-[800] text-sm text-[#2fa84f] bg-[#2fa84f]/10 border border-[#2fa84f]/30 hover:bg-[#2fa84f]/20 transition-all flex items-center justify-center gap-2"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      Masukkan Keranjang
                    </button>
                    <button
                      onClick={handleBeliSekarang}
                      className="flex-1 lg:flex-none lg:w-[220px] py-4 rounded-2xl font-[800] text-sm text-white bg-[#2fa84f] hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:-translate-y-1"
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 lg:p-8 border border-white/5 shadow-2xl mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-5 w-full shrink-0">
            <div className="w-20 h-20 rounded-full border-[3px] border-[#2fa84f]/30 p-1 relative">
              <div className="w-full h-full bg-[#0a110b] rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-2xl font-black text-white">
                  {(
                    product.seller?.toko?.nama_toko ||
                    product.seller?.username ||
                    "TO"
                  )
                    .substring(0, 2)
                    .toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 flex justify-between items-center pr-4">
              <div>
                <Link
                  href={`/toko/${product.id_user_seller}`}
                  className="text-lg font-[800] text-white mb-1 tracking-tight hover:text-[#2fa84f] transition-colors no-underline inline-block"
                >
                  {product.seller?.toko?.nama_toko ||
                    product.seller?.username ||
                    "Toko"}
                </Link>
                <p className="text-[11px] text-[#2fa84f] font-bold uppercase tracking-widest">
                  Toko Terverifikasi
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Bergabung
                </span>
                <span className="font-black text-white text-sm">
                  {product.seller?.createdAt
                    ? new Date(product.seller.createdAt).toLocaleDateString(
                      "id-ID",
                      {
                        month: "short",
                        year: "numeric",
                      },
                    )
                    : "Baru"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 border border-white/5 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#2fa84f] rounded-full shadow-[0_0_8px_#2fa84f]"></div>
            <h2 className="text-xl font-[800] text-white m-0 tracking-tight uppercase">
              Spesifikasi & Deskripsi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 mb-8 text-sm font-bold">
            <span className="text-gray-500 uppercase tracking-widest text-[11px]">
              Kategori
            </span>
            <span className="text-[#2fa84f]">
              {product.kategori?.nama_kategori || "Umum"}
            </span>

            <span className="text-gray-500 uppercase tracking-widest text-[11px]">
              Stok Tersedia
            </span>
            <span className="text-white">{product.stok}</span>

            <span className="text-gray-500 uppercase tracking-widest text-[11px]">
              Dikirim Dari
            </span>
            <span className="text-white">
              {product.seller?.toko?.alamat_toko || "Belum ditentukan"}
            </span>

            <span className="text-gray-500 uppercase tracking-widest text-[11px]">
              Email Komplain
            </span>
            <span className="text-white">
              {product.seller?.toko?.email_bisnis ||
                product.seller?.email ||
                "Belum tersedia"}
            </span>
          </div>

          <div className="w-full h-[1px] bg-white/5 mb-8"></div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 font-medium leading-relaxed text-sm whitespace-pre-line">
              {product.konten_deskripsi ||
                product.deskripsi ||
                "Deskripsi produk tidak tersedia."}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
