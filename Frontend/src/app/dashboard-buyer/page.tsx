"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";

// Animation styles for smooth entrance effects
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
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

  /* Stagger delays */
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
  .delay-600 { animation-delay: 600ms; }
  .delay-700 { animation-delay: 700ms; }
  .delay-800 { animation-delay: 800ms; }
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

type NotificationState = { type: "success" | "error"; message: string } | null;

function FormNotification({ notification }: { notification: NotificationState }) {
  if (!notification) return null;

  const isSuccess = notification.type === "success";
  const text = notification.message.replace(/^[⚠✓]\s*/, "");

  return (
    <div className="fixed inset-x-0 top-24 sm:inset-x-auto sm:right-5 sm:top-28 lg:right-8 lg:top-28 z-[200] flex justify-center sm:justify-end pointer-events-none">
      <motion.div
        key={notification.message}
        role="alert"
        initial={{ opacity: 0, x: 32, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 24, scale: 0.96 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className={
          isSuccess
            ? "pointer-events-auto flex w-max max-w-[min(400px,calc(100vw-2rem))] items-center gap-2 rounded-full border border-[#2fa84f]/45 bg-[#111815]/90 px-3 py-1.5 shadow-[0_6px_28px_rgba(47,168,79,0.3)] backdrop-blur-xl"
            : "pointer-events-auto flex w-max max-w-[min(400px,calc(100vw-2rem))] items-center gap-2 rounded-full border border-red-500/40 bg-[#111815]/90 px-3 py-1.5 shadow-[0_6px_28px_rgba(239,68,68,0.32)] backdrop-blur-xl"
        }
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-[#2fa84f]/35 text-[#7ee8a0] shadow-[0_0_12px_rgba(47,168,79,0.4)]"
              : "bg-red-500/35 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.45)]"
          }`}
        >
          {isSuccess ? (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
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
          )}
        </span>
        <p className={`whitespace-nowrap text-xs font-semibold ${isSuccess ? "text-[#b8f5c8]" : "text-red-100"}`}>
          {text}
        </p>
      </motion.div>
    </div>
  );
}

export default function DashboardBuyer() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [dbProducts, setDbProducts] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("User");
  const [userRoleState, setUserRoleState] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0);
  const [isGoingForward, setIsGoingForward] = useState(true);
  const [showSellerPopup, setShowSellerPopup] = useState(false);
  const [notification, setNotification] = useState<NotificationState>(null);

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  }, [notification]);

  const carouselSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
      title: "Temukan Gaya Hidup Berkelanjutan.",
      subtitle:
        "Jelajahi ribuan produk ramah lingkungan dari penjual terverifikasi dan dukung masa depan bumi dari langkah terkecil.",
      badge: "GreenMarket Explorer",
    },
    {
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1000&auto=format&fit=crop",
      title: "Daur Ulang untuk Masa Depan.",
      subtitle:
        "Setiap produk daur ulang yang Anda beli adalah kontribusi nyata untuk mengurangi limbah dan menyelamatkan bumi.",
      badge: "Recycling Movement",
    },
    {
      image:
        "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1000&auto=format&fit=crop",
      title: "Bergabung dengan Komunitas Hijau.",
      subtitle:
        "Terhubung dengan ribuan penjual dan pembeli yang peduli lingkungan, bersama membangun ekosistem berkelanjutan.",
      badge: "Eco Community",
    },
  ];

  const router = useRouter();
  const userRole = "BUYER";

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevSlide(currentSlide);
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      setIsGoingForward(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handlePrevSlide = () => {
    setPrevSlide(currentSlide);
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setIsGoingForward(false);
  };

  const handleNextSlide = () => {
    setPrevSlide(currentSlide);
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setIsGoingForward(true);
  };

  const handleDotClick = (index: number) => {
    setPrevSlide(currentSlide);
    setIsGoingForward(index > currentSlide);
    setCurrentSlide(index);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      const storedUserId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("userRole");
      const storedUser = localStorage.getItem("user");

      if (!storedUserId) {
        router.push("/login");
        return;
      }
      
      if (storedRole) setUserRoleState(storedRole);

      if (storedRole === "SELLER") {
        router.push("/dashboard-seller");
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
          throw new Error("Gagal mengambil data produk");
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

      <AnimatePresence mode="wait">
        {notification && <FormNotification notification={notification} />}
      </AnimatePresence>

      {showSellerPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto">
          <style>{`
            .popup-bounce {
              animation: bounceIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            @keyframes bounceIn {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSellerPopup(false)}></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center bg-[#0a110b] border border-[#2fa84f]/20 rounded-[24px] p-8 w-[420px] shadow-2xl popup-bounce">
            <button 
              onClick={() => setShowSellerPopup(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            

            <h2 className="text-white text-2xl font-bold mb-3 tracking-tight text-center">Mulai Jualan, Yuk!</h2>
            <p className="text-gray-300 text-sm font-medium tracking-wide text-center leading-relaxed mb-8">
              Daftar gratis untuk upload produk dan kelola toko kamu.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              <Link href="/register" className="w-full py-3.5 rounded-[16px] font-bold text-sm text-white bg-[#2fa84f] hover:bg-[#268c41] transition-all shadow-[0_4px_15px_rgba(47,168,79,0.3)] hover:-translate-y-0.5 text-center flex items-center justify-center">
                Daftar Sekarang
              </Link>
              <Link href="/login" className="w-full py-3.5 rounded-[16px] font-bold text-sm text-white bg-transparent border border-white/20 hover:bg-white/5 transition-all text-center flex items-center justify-center">
                Sudah Punya Akun? Login
              </Link>
            </div>
          </div>
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between ${shouldAnimate ? "animate-fade-in" : "opacity-0"}`}
      >
        <div className="flex items-center gap-8">
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
            <span className="text-xl font-black text-white tracking-tight uppercase">
              Green<span className="text-[#2fa84f]">Market</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                const userRole = localStorage.getItem("userRole");

                if (userRole === "GUEST") {
                  setShowSellerPopup(true);
                  return;
                }

                router.push("/register-penjual");
              }}
              className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold no-underline hover:bg-[#2fa84f] hover:border-transparent transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Mulai Berjualan
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-10">
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
              placeholder="Cari produk ramah lingkungan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {userRoleState === "GUEST" ? (
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
          ) : (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase transition-colors bg-transparent border-none cursor-pointer mx-2"
            >
              Logout
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              const userRole = localStorage.getItem("userRole");

              if (userRole === "GUEST") {
                showNotification("error", "Fitur ini tidak tersedia pada akun guest");
                return;
              }

              router.push("/profile");
            }}
            className="flex items-center gap-3 group no-underline border-l border-white/10 pl-4 bg-transparent border-y-0 border-r-0 cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">
                {userName}
              </p>
              <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">
                Buyer
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                {userName.charAt(0)}
              </div>
            </div>
          </button>
        </div>
      </nav>

      <main className="flex-grow container max-w-[1600px] mx-auto pt-24 px-6 pb-20 relative z-10 w-full">
        <div
          className={`w-full h-[240px] md:h-[280px] rounded-[32px] overflow-hidden relative mb-8 shadow-2xl border border-white/10 ${shouldAnimate ? "animate-scale-in delay-100" : "opacity-0"}`}
        >
          {carouselSlides.map((slide, index) => {
            const isActive = index === currentSlide;
            const isPrev = index === prevSlide && prevSlide !== currentSlide;
            
            let translateX = '0%';
            let opacity = '1';
            
            if (!isActive && isPrev) {
              translateX = isGoingForward ? '-100%' : '100%';
              opacity = '0';
            } else if (!isActive) {
              translateX = isGoingForward ? '100%' : '-100%';
              opacity = '0';
            }
            
            return (
              <div
                key={index}
                style={{
                  transform: `translateX(${translateX})`,
                  opacity: opacity,
                  transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease'
                }}
                className="absolute inset-0"
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
              );
            })}

          <button
            onClick={handlePrevSlide}
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
            onClick={handleNextSlide}
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
                onClick={() => handleDotClick(index)}
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
                Eksplorasi Katalog Hijau
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
                Tidak ada produk yang sesuai dengan pencarian.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id_produk}
                    className={`relative group ${shouldAnimate ? "animate-fade-in-up" : "opacity-0"}`}
                    style={shouldAnimate ? { animationDelay: "500ms" } : {}}
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
                              {p.seller?.username || "Toko Hijau"}
                            </span>
                            <span className="text-[9px] text-[#2fa84f] bg-[#2fa84f]/10 px-2 py-1 rounded font-black uppercase">
                              {p.stok} Unit
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
