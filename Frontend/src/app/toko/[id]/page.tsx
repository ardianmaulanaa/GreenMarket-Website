"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  kategori?: {
    nama_kategori: string;
  };
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
}

export default function TokoPage() {
  const { showToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const sellerId = params?.id;
  const [searchTerm, setSearchTerm] = useState("");

  const [products, setProducts] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    nama: "User",
    role: "BUYER",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("userRole");

    if (savedUser) {
      const userData = JSON.parse(savedUser);

      setUser({
        nama: userData.username || userData.name || "User",
        role: savedRole || userData.role || "BUYER",
      });
    }
  }, []);

  useEffect(() => {
    const fetchProdukToko = async () => {
      if (!sellerId) return;

      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5050/api/products?userId=${sellerId}`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil produk toko");
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error mengambil produk toko:", error);
        showToast("Gagal memuat produk toko. Periksa koneksi internet Anda.", "error");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdukToko();
  }, [sellerId]);

  const toko = products[0]?.seller;

  const namaToko = toko?.toko?.nama_toko || toko?.username || "Toko";
  const isSeller = user.role === "SELLER";
  const dashboardHref = isSeller ? "/dashboard-seller" : "/dashboard-buyer";

  const getProductImage = (product: Produk) => {
    return (
      product.foto_produk ||
      product.foto_produk_list?.[0] ||
      "https://placehold.co/500x500/1a1f1b/2fa84f?text=No+Image"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none" />

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
      <Nav
        variant="toko"
        user={user}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="flex-grow container max-w-[1200px] mx-auto pt-28 px-6 pb-20 relative z-10 w-full">
        <section className="bg-[#1a1f1b]/85 backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white/5 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full border-[3px] border-[#2fa84f]/30 p-1">
                <div className="w-full h-full bg-[#0a110b] rounded-full flex items-center justify-center">
                  <span className="text-2xl font-black text-white">
                    {namaToko.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-white mb-1">
                  {namaToko}
                </h1>
                <p className="text-[11px] text-[#2fa84f] font-bold uppercase tracking-widest">
                  Toko Terverifikasi
                </p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                Total Produk
              </p>
              <p className="text-white font-black text-xl">
                {products.length} Produk
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#2fa84f] rounded-full shadow-[0_0_8px_#2fa84f]" />
            <h2 className="text-xl font-[800] text-black m-0 tracking-tight uppercase">
              Produk dari Toko Ini
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center text-black font-bold">
              Memuat produk toko...
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center bg-[#1a1f1b]/80 rounded-[32px] border border-white/5 text-white font-bold">
              Toko ini belum memiliki produk.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => (
                <Link
                  key={p.id_produk}
                  href={`/katalog-detail/${p.id_produk}?fromToko=${encodeURIComponent(
                    namaToko,
                  )}`}
                  className="no-underline block h-full group"
                >
                  <div className="bg-[#1a1f1b]/90 backdrop-blur-md border border-white/5 rounded-[28px] overflow-hidden hover:border-[#2fa84f]/50 transition-all duration-500 flex flex-col relative shadow-xl hover:-translate-y-1 h-full">
                    <div className="relative aspect-square bg-[#0a110b] overflow-hidden">
                      <img
                        src={getProductImage(p)}
                        alt={p.nama_produk}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                      />

                      <div className="absolute top-4 left-4 bg-[#2fa84f] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        {p.kategori?.nama_kategori || "Eco Product"}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h4 className="font-bold text-[14px] text-white mb-1.5 line-clamp-1 leading-snug group-hover:text-[#2fa84f] transition-colors">
                        {p.nama_produk}
                      </h4>

                      <p className="text-gray-400 text-[11px] mb-4 line-clamp-2 italic opacity-70 leading-relaxed">
                        {p.deskripsi}
                      </p>

                      <div className="text-[#2fa84f] font-[900] text-lg mb-4 mt-auto tracking-tight">
                        <span className="text-[11px] mr-0.5">Rp</span>
                        {p.harga?.toLocaleString("id-ID")}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-[9px] text-gray-500 uppercase font-black truncate max-w-[100px]">
                          {p.seller?.toko?.nama_toko ||
                            p.seller?.username ||
                            "Toko Hijau"}
                        </span>

                        <span className="text-[9px] text-[#2fa84f] bg-[#2fa84f]/10 px-2 py-1 rounded font-black uppercase">
                          {p.stok} Unit
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
