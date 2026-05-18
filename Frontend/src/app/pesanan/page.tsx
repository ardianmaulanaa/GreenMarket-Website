"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
`;

interface TrackingLog {
  id_log: string;
  id_transaksi: string;
  status: string;
  waktu: string;
}

interface DetailTransaksi {
  id_detail: string;
  kuantitas: number;
  harga_satuan: number;
  subtotal: number;
  produk: {
    id_produk: string;
    nama_produk: string;
    harga: number;
    foto_produk?: string;
    foto_produk_list?: string[];
    fotos?: { url_foto: string }[];
    seller?: {
      username: string;
      email: string;
    };
    kategori?: {
      nama_kategori: string;
    };
  };
}

interface Transaksi {
  id_transaksi: string;
  total_harga: number;
  status_transaksi: string;
  tanggal_transaksi: string;
  detail_transaksi: DetailTransaksi[];

  alamat?: {
    nama_penerima: string;
    nomor_hp: string;
    alamat_lengkap: string;
  };

  jasa_kirim?: {
    nama_jasa: string;
    harga_pengiriman: number;
    estimasi_waktu: string;
  };

  metode_pembayaran?: {
    nama_metode: string;
    kode_metode: string;
  };

  pembayaran?: {
    status_pembayaran: string;
  };

  tracking_logs: TrackingLog[];
}

export default function PesananPage() {
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState("semua");
  const [user, setUser] = useState({ nama: "", role: "" });
  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const [selectedTracking, setSelectedTracking] = useState<Transaksi | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5050/api/transaksi/user/${userId}`,
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengambil pesanan");
        return;
      }

      setTransactions(data);
    } catch (error) {
      console.error("Gagal mengambil pesanan:", error);
      alert("Terjadi kesalahan saat mengambil pesanan");
    }
  };

  useEffect(() => {
    // Efek loading transisi halaman
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      setShouldAnimate(true);
    }, 300);

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
    queueMicrotask(() => {
      void fetchTransactions();
    });

    const interval = setInterval(() => {
      void fetchTransactions();
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const isSeller = user.role === "SELLER" || user.role === "Penjual";

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const filteredTransactions = transactions.filter((trx) => {
    const statusTransaksi = trx.status_transaksi?.toUpperCase();
    const statusPembayaran = trx.pembayaran?.status_pembayaran?.toUpperCase();
    const keyword = searchTerm.toLowerCase();

    const matchTab =
      activeTab === "semua" ||
      (activeTab === "belum_bayar" &&
        (statusTransaksi === "BELUM_BAYAR" ||
          statusPembayaran === "MENUNGGU_PEMBAYARAN")) ||
      (activeTab === "dikemas" && statusTransaksi === "DIKEMAS") ||
      (activeTab === "dikirim" && statusTransaksi === "DIKIRIM") ||
      (activeTab === "selesai" && statusTransaksi === "SELESAI");

    const matchSearch =
      trx.detail_transaksi?.some((detail) =>
        detail.produk?.nama_produk?.toLowerCase().includes(keyword),
      ) ||
      trx.detail_transaksi?.some((detail) =>
        detail.produk?.seller?.username?.toLowerCase().includes(keyword),
      ) ||
      trx.status_transaksi?.toLowerCase().includes(keyword);

    return matchTab && matchSearch;
  });

  const tabs = [
    { id: "semua", name: "Semua" },
    { id: "belum_bayar", name: "Belum Bayar" },
    { id: "dikemas", name: "Dikemas" },
    { id: "dikirim", name: "Dikirim" },
    { id: "selesai", name: "Selesai" },
  ];

  const selectedTotalProduk =
    selectedTracking?.detail_transaksi?.reduce(
      (total, detail) => total + detail.subtotal,
      0,
    ) || 0;

  const selectedOngkir = selectedTracking?.jasa_kirim?.harga_pengiriman || 0;

  const selectedTotalPesanan =
    selectedTracking?.total_harga || selectedTotalProduk + selectedOngkir;

  // ── TAMPILAN LOADING SCREEN ──
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Memuat Pesanan...
        </p>
      </div>
    );
  }

  // ── TAMPILAN UTAMA ──
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      <style>{animationStyles}</style>
      {/* Dekorasi Glow Hijau Latar Belakang */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between ${shouldAnimate ? 'animate-fade-in' : 'opacity-0'}`}>
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
            <svg className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali
          </button>
          <Link
            href={isSeller ? "/dashboard-seller" : "/dashboard-buyer"}
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
          
          {!isSeller && (
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/register-penjual"
                className="bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold no-underline hover:bg-[#2fa84f] hover:border-transparent transition-all flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Mulai Berjualan
              </Link>
            </div>
          )}
        </div>

        {/* SEARCH BAR (Disembunyikan di mobile) */}
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
              placeholder="Cari pesanan Anda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-2 group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">
                {user.nama}
              </p>
              <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">
                {user.role === "SELLER" ? "SELLER HUB" : "BUYER"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                {user.nama ? user.nama.charAt(0) : "U"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── KONTEN UTAMA ── */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">
        {/* ── SIDEBAR PROFIL ── */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className={`sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl ${shouldAnimate ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff&size=128`}
                  className="w-full h-full rounded-full border-[3px] border-[#2fa84f]/40 object-cover shadow-[0_0_15px_rgba(47,168,79,0.3)]"
                  alt="Avatar"
                />
              </div>
              <h3 className="text-lg font-[800] text-white m-0 tracking-tight">
                {user.nama || "Loading..."}
              </h3>
              <p className="text-[10px] text-[#2fa84f] m-0 mt-1.5 uppercase font-black tracking-[2px]">
                {user.role}
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="group-hover:text-[#2fa84f] transition-colors"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-sm">Profil Saya</span>
              </Link>

              <Link
                href="/alamat"
                className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:text-[#2fa84f] transition-colors"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm">Daftar Alamat</span>
              </Link>

              {/* Tanda Aktif pada Pesanan */}
              <Link
                href="/pesanan"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_4px_15px_rgba(47,168,79,0.2)]"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span className="text-sm">Pesanan Saya</span>
              </Link>

              {!isSeller ? (
                <Link
                  href="/register-penjual"
                  className="flex items-center gap-3 p-3.5 rounded-2xl text-[#2fa84f] bg-[#2fa84f]/10 border border-[#2fa84f]/20 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2 shadow-sm"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="text-sm">Mulai Berjualan</span>
                </Link>
              ) : (
                <Link
                  href="/panel-penjual"
                  className="flex items-center gap-3 p-3.5 rounded-2xl text-[#2fa84f] border border-[#2fa84f]/20 bg-[#2fa84f]/10 hover:bg-[#2fa84f]/20 transition no-underline font-bold mt-2 shadow-sm"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  <span className="text-sm">Panel Inventaris</span>
                </Link>
              )}

              <div className="my-4 border-t border-white/5" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition font-bold text-left group"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="text-sm">Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── DAFTAR PESANAN UTAMA ── */}
        <main className="flex-1">
          <div className={`bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 border border-white/5 shadow-2xl relative overflow-hidden h-full ${shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#2fa84f] rounded-full opacity-[0.15] blur-3xl pointer-events-none"></div>

            <div className="relative z-10 mb-8">
              <h2 className="text-3xl font-[800] text-white tracking-tight m-0">
                Pesanan Saya
              </h2>
              <p className="text-sm text-gray-400 mt-2 font-medium">
                Pantau status pengiriman dan riwayat belanja Anda.
              </p>
            </div>

            {/* Tabs Filter */}
            <div className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar relative z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 text-[13px] font-[800] transition-all relative whitespace-nowrap uppercase tracking-wider ${
                    activeTab === tab.id
                      ? "text-[#2fa84f]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.name}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2fa84f] rounded-t-full shadow-[0_-2px_10px_rgba(47,168,79,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            {/* List Pesanan */}
            <div className="space-y-6 relative z-10">
              {filteredTransactions.map((trx, index) => {
                const firstDetail = trx.detail_transaksi?.[0];
                const firstProduct = firstDetail?.produk;

                const productImage =
                  firstProduct?.foto_produk ||
                  firstProduct?.foto_produk_list?.[0] ||
                  firstProduct?.fotos?.[0]?.url_foto ||
                  "https://placehold.co/120x120/e9f7ec/2fa84f?text=GreenMarket";

                const totalBarang =
                  trx.detail_transaksi?.reduce(
                    (total, detail) => total + detail.kuantitas,
                    0,
                  ) || 0;

                const totalProduk =
                  trx.detail_transaksi?.reduce(
                    (total, detail) => total + detail.subtotal,
                    0,
                  ) || 0;

                const ongkir = trx.jasa_kirim?.harga_pengiriman || 0;

                const totalPesanan = trx.total_harga || totalProduk + ongkir;

                return (
                  <div
                    key={trx.id_transaksi}
                    className={`border border-white/10 rounded-[28px] overflow-hidden bg-[#1a1f1b]/50 hover:border-[#2fa84f]/40 transition-all shadow-lg backdrop-blur-sm ${shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={shouldAnimate ? { animationDelay: `${300 + index * 120}ms` } : {}}
                  >
                    {/* Header Pesanan */}
                    <div className="px-7 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#2fa84f] text-white flex items-center justify-center shadow-sm">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        </div>

                        <span className="font-bold text-white text-[15px]">
                          {firstProduct?.seller?.username ||
                            "GreenMarket Store"}
                        </span>
                      </div>

                      <span className="text-[10px] font-black text-[#2fa84f] bg-[#2fa84f]/10 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-[#2fa84f]/20 shadow-inner">
                        {trx.status_transaksi}
                      </span>
                    </div>

                    {/* Body Pesanan */}
                    <div className="p-7 flex gap-6 border-b border-white/5">
                      <div className="w-24 h-24 bg-[#0a110b] rounded-[20px] flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
                        <img
                          src={productImage}
                          alt={firstProduct?.nama_produk || "Produk"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-white text-[16px] mb-3 leading-snug">
                              {firstProduct?.nama_produk ||
                                "Produk tidak ditemukan"}

                              {trx.detail_transaksi.length > 1 && (
                                <span className="text-gray-400">
                                  {" "}
                                  dan {trx.detail_transaksi.length - 1} produk
                                  lainnya
                                </span>
                              )}
                            </h4>

                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-black text-[#2fa84f] border border-[#2fa84f]/30 bg-[#2fa84f]/10 px-2.5 py-1.5 rounded-lg uppercase tracking-wider">
                                {trx.pembayaran?.status_pembayaran ||
                                  "BELUM BAYAR"}
                              </span>

                              <p className="text-[12px] text-gray-400 font-medium flex items-center gap-1.5">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                >
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                {trx.jasa_kirim?.nama_jasa || "-"} •{" "}
                                {totalBarang} barang
                              </p>
                            </div>

                            <p className="text-[12px] text-gray-500 mt-3">
                              {trx.alamat?.alamat_lengkap ||
                                "Alamat tidak tersedia"}
                            </p>
                          </div>

                          <p className="font-bold text-white text-[16px] whitespace-nowrap mt-2 sm:mt-0">
                            Rp {totalPesanan.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Pesanan */}
                    <div className="px-7 py-6 bg-[#0a110b]/50 flex justify-end items-center">
                      <div className="flex gap-4 w-full sm:w-auto">
                        <button
                          onClick={() => setSelectedTracking(trx)}
                          className="flex-1 sm:flex-none px-7 py-3.5 text-xs font-bold text-gray-300 border border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/30 hover:text-white transition-all uppercase tracking-widest"
                        >
                          Detail
                        </button>

                        <Link
                          href={`/katalog-detail/${firstProduct?.id_produk || ""}`}
                          className="flex-1 sm:flex-none px-7 py-3.5 text-xs font-bold text-white bg-[#2fa84f] rounded-2xl hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] uppercase tracking-widest hover:-translate-y-1 no-underline text-center"
                        >
                          Beli Lagi
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[24px] border border-dashed border-white/10 text-gray-500 font-bold">
                  Belum ada pesanan tersimpan.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {selectedTracking && (
        <div className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-6">
          <div className="bg-[#1a1f1b] border border-white/10 rounded-[28px] w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white">
                  Detail Pesanan
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedTracking.detail_transaksi?.[0]?.produk
                    ?.nama_produk || "Detail Pesanan"}
                </p>
              </div>

              <button
                onClick={() => setSelectedTracking(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[2px] mb-2">
                  Status Pembayaran
                </p>
                <p className="text-[#2fa84f] font-black">
                  {selectedTracking.pembayaran?.status_pembayaran || "-"}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[2px] mb-3">
                  Produk dalam Pesanan
                </p>

                <div className="space-y-3">
                  {selectedTracking.detail_transaksi?.map((detail) => (
                    <div
                      key={detail.id_detail}
                      className="flex justify-between gap-4 rounded-2xl bg-white/5 border border-white/10 p-4"
                    >
                      <div>
                        <p className="text-white font-bold text-sm">
                          {detail.produk?.nama_produk || "Produk"}
                        </p>

                        <p className="text-gray-500 text-xs mt-1">
                          {detail.kuantitas} x Rp{" "}
                          {detail.harga_satuan.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <p className="text-[#2fa84f] font-black text-sm">
                        Rp {detail.subtotal.toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[2px] mb-3">
                  Jasa Kirim
                </p>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">
                    {selectedTracking.jasa_kirim?.nama_jasa || "Jasa kirim"}
                  </span>

                  <span className="text-[#2fa84f] font-black text-sm">
                    Rp {selectedOngkir.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[2px] mb-2">
                  Alamat
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedTracking.alamat?.alamat_lengkap || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[2px] mb-4">
                  Riwayat Tracking
                </p>

                <div className="space-y-4">
                  {selectedTracking.tracking_logs?.length > 0 ? (
                    selectedTracking.tracking_logs.map((log) => (
                      <div key={log.id_log} className="flex gap-4">
                        <div className="w-3 h-3 rounded-full bg-[#2fa84f] mt-1.5 shrink-0"></div>

                        <div>
                          <p className="text-white font-bold text-sm">
                            {log.status}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(log.waktu).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Belum ada tracking log.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-transparent py-8 text-center border-t border-[#1a2e1f]/10 mt-auto relative z-10">
        <p className="text-[#1a2e1f]/50 text-[10px] font-black tracking-[4px] uppercase m-0">
          © 2026 GREENMARKET. ALL SELLER & BUYER CATALOG.
        </p>
      </footer>
    </div>
  );
}
