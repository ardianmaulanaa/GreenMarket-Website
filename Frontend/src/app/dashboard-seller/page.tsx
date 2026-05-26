"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/navbar";

// Animation styles for smooth entrance effects
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

interface Produk {
  id_produk: string;
  id_user_seller: number;
  nama_produk: string;
  harga: number;
  stok: number;
  status_produk?: string;
  deskripsi: string;

  foto_produk?: string;
  foto_produk_list?: string[];

  konten_deskripsi?: string;
  catatan_penjual?: string;

  kategori?: { nama_kategori: string };
  seller?: { username: string; email: string };
}

export default function DashboardSeller() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [dbProducts, setDbProducts] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("User");
  const [sellerId, setSellerId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
      title: "Pusat Kendali Bisnis Hijau Anda.",
      subtitle:
        "Pantau inventaris, tingkatkan penjualan, dan jadilah agen perubahan untuk lingkungan bersama ribuan penjual lainnya.",
      badge: "Seller Dashboard",
    },
    {
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1000&auto=format&fit=crop",
      title: "Kelola Produk Daur Ulang.",
      subtitle:
        "Tampilkan produk daur ulang Anda ke pasar yang peduli lingkungan dan bangun bisnis berkelanjutan yang sukses.",
      badge: "Recycling Business",
    },
    {
      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1000&auto=format&fit=crop",
      title: "Jangkau Lebih Banyak Pelanggan.",
      subtitle:
        "Hubungkan produk Anda dengan komunitas pembeli yang aktif mencari solusi ramah lingkungan.",
      badge: "Grow Your Impact",
    },
  ];

  const router = useRouter();
  const userRole = "SELLER";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const myProducts = sellerId
    ? dbProducts.filter((p) => p.id_user_seller === sellerId)
    : [];

  const totalProduk = myProducts.length;
  const totalStok = myProducts.reduce((acc, curr) => acc + curr.stok, 0);
  const produkMenipis = myProducts.filter((p) => p.stok < 5).length;

  useEffect(() => {
    const loadDashboard = async () => {
      const storedUserId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("userRole");
      const storedUser = localStorage.getItem("user");
      setSellerId(Number(storedUserId));

      if (!storedUserId) {
        router.push("/login");
        return;
      }

      if (storedRole !== "SELLER") {
        router.push("/dashboard-buyer");
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

      try {
        setLoading(true);

        const response = await fetch("http://localhost:5050/api/products");

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk seller");
        }

        const data = await response.json();
        setDbProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error Fetching:", error);
        setDbProducts([]);
      } finally {
        setLoading(false);

        setTimeout(() => {
          setIsPageLoading(false);
          setShouldAnimate(true);
        }, 500);
      }
    };

    loadDashboard();
  }, [router]);

  const resetFilters = () => {
    const inputs = document.querySelectorAll(
      ".filter-check input",
    ) as NodeListOf<HTMLInputElement>;

    inputs.forEach((input) => {
      input.checked = false;
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const getProductImage = (product: Produk) => {
    return (
      product.foto_produk ||
      product.foto_produk_list?.[0] ||
      "https://placehold.co/500x500/1a1f1b/2fa84f?text=No+Image"
    );
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Menyiapkan Ekosistem...
        </p>
      </div>
    );
  }

  const filteredProducts = dbProducts.filter(
    (p) =>
      p.nama_produk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kategori?.nama_kategori
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      <style>{animationStyles}</style>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none"></div>

      <Nav
        variant="dashboardSeller"
        shouldAnimate={shouldAnimate}
        userName={userName}
        userRole={userRole}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleLogout={handleLogout}
      />

      <main className="flex-grow container max-w-[1600px] mx-auto pt-24 px-6 pb-20 relative z-10 w-full">
        <div
          className={`w-full h-[240px] md:h-[280px] rounded-[32px] overflow-hidden relative mb-8 shadow-2xl border border-white/10 ${shouldAnimate ? "animate-scale-in delay-100" : "opacity-0"}`}
        >
          {carouselSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e1f]/95 via-[#1a2e1f]/60 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
                <span className="text-[#2fa84f] font-black tracking-widest text-[10px] md:text-xs uppercase mb-2 drop-shadow-md">
                  {slide.badge}
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-xl max-w-2xl leading-tight">
                  {slide.title}
                </h1>
                <p className="text-white/80 font-medium max-w-lg text-xs md:text-sm leading-relaxed drop-shadow-md">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          <button
            onClick={() =>
              setCurrentSlide(
                (prev) =>
                  (prev - 1 + carouselSlides.length) % carouselSlides.length,
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20 z-20"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/20 z-20"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-[#2fa84f] w-6"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 ${shouldAnimate ? "animate-fade-in-up delay-200" : "opacity-0"}`}
        >
          <div className="bg-[#1a1f1b]/80 backdrop-blur-md p-5 rounded-[24px] border border-white/5 shadow-xl hover:-translate-y-2 hover:border-[#2fa84f]/40 hover:shadow-[0_15px_30px_rgba(47,168,79,0.15)] transition-all duration-300 group cursor-pointer">
            <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1 group-hover:text-white/70 transition-colors">
              Produk Saya
            </p>
            <h4 className="text-2xl font-black text-white group-hover:text-[#2fa84f] transition-colors">
              {totalProduk}{" "}
              <span className="text-[12px] text-gray-500 font-medium group-hover:text-white/50 transition-colors">
                Item
              </span>
            </h4>
          </div>

          <div className="bg-[#1a1f1b]/80 backdrop-blur-md p-5 rounded-[24px] border border-white/5 shadow-xl hover:-translate-y-2 hover:border-[#2fa84f]/40 hover:shadow-[0_15px_30px_rgba(47,168,79,0.15)] transition-all duration-300 group cursor-pointer">
            <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1 group-hover:text-white/70 transition-colors">
              Total Stok Saya
            </p>
            <h4 className="text-2xl font-black text-[#2fa84f] group-hover:scale-105 transform origin-left transition-transform">
              {totalStok}{" "}
              <span className="text-[12px] text-gray-500 font-medium">
                Unit
              </span>
            </h4>
          </div>

          <div className="bg-[#1a1f1b]/80 backdrop-blur-md p-5 rounded-[24px] border border-white/5 shadow-xl hover:-translate-y-2 hover:border-red-500/40 hover:shadow-[0_15px_30px_rgba(239,68,68,0.15)] transition-all duration-300 group cursor-pointer">
            <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1 group-hover:text-white/70 transition-colors">
              Stok Menipis
            </p>
            <h4 className="text-2xl font-black text-red-500 group-hover:scale-105 transform origin-left transition-transform">
              {produkMenipis}{" "}
              <span className="text-[12px] text-gray-500 font-medium">
                Item
              </span>
            </h4>
          </div>

          <div className="bg-[#1a1f1b]/80 backdrop-blur-md p-5 rounded-[24px] border border-[#2fa84f]/20 shadow-xl flex items-center justify-between hover:-translate-y-2 hover:border-[#2fa84f]/60 hover:shadow-[0_15px_30px_rgba(47,168,79,0.2)] transition-all duration-300 group cursor-pointer">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1 group-hover:text-white/70 transition-colors">
                Status Seller
              </p>
              <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#2fa84f] transition-colors">
                Terverifikasi
              </h4>
            </div>
            <div className="w-3 h-3 bg-[#2fa84f] rounded-full animate-pulse shadow-[0_0_10px_#2fa84f] group-hover:shadow-[0_0_20px_#2fa84f] transition-shadow duration-300"></div>
          </div>
        </div>

        <div
          className={`flex flex-col lg:flex-row gap-8 ${shouldAnimate ? "animate-fade-in delay-200" : "opacity-0"}`}
        >
          <aside className="w-full lg:w-[280px] shrink-0">
            <div
              className={`bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl sticky top-28 ${shouldAnimate ? "animate-slide-in-left delay-300" : "opacity-0"}`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-[#2fa84f] rounded-full shadow-[0_0_8px_#2fa84f]"></div>
                <h2 className="text-lg font-[800] text-white m-0 tracking-tight">
                  Filter Pasar
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "Pakaian Organik",
                  "Daur Ulang",
                  "Ramah Lingkungan",
                  "Terlaris",
                ].map((item) => (
                  <label
                    key={item}
                    className="filter-check flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="accent-[#2fa84f] w-4 h-4 cursor-pointer bg-white/5 border-white/10 rounded"
                    />
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={resetFilters}
                className="w-full py-3.5 bg-white/5 text-gray-400 border border-transparent hover:border-white/10 rounded-2xl font-bold text-xs hover:bg-[#2fa84f] hover:text-white transition-all uppercase tracking-widest"
              >
                Reset Filter
              </button>
            </div>
          </aside>

          <section className="flex-1">
            <div
              className={`flex justify-between items-end mb-8 ${shouldAnimate ? "animate-fade-in-up delay-300" : "opacity-0"}`}
            >
              <h3 className="text-2xl font-[800] text-[#1a2e1f] tracking-tight m-0">
                Katalog Produk GreenMarket
              </h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#2fa84f]">
                <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-[11px] uppercase tracking-[3px] animate-pulse text-[#1a2e1f]">
                  Memuat Katalog...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-[40px] border border-dashed border-[#2fa84f]/30 text-[#1a2e1f] font-bold shadow-sm">
                Belum ada produk yang sesuai dengan pencarian.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((p, i) => {
                  const isMyProduct =
                    sellerId !== null && p.id_user_seller === sellerId;

                  return (
                    <div
                      key={p.id_produk}
                      className={`relative group ${
                        shouldAnimate ? "animate-fade-in-up" : "opacity-0"
                      }`}
                      style={
                        shouldAnimate
                          ? { animationDelay: `${400 + (i % 8) * 100}ms` }
                          : {}
                      }
                    >
                      <Link
                        href={`/katalog-detail/${p.id_produk}`}
                        className="no-underline block h-full"
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

                            {isMyProduct && (
                              <div className="absolute top-4 right-4 bg-yellow-400 text-[#1a1f1b] text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Produk Saya
                              </div>
                            )}
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
                              <span className="text-[9px] text-gray-500 uppercase font-black truncate max-w-[100px] flex items-center gap-1.5">
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                                {p.seller?.username || "Toko Saya"}
                              </span>

                              <span className="text-[9px] text-[#2fa84f] bg-[#2fa84f]/10 px-2 py-1 rounded font-black uppercase">
                                {p.stok} Unit
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
