"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
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
