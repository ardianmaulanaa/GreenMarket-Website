"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/useToast";
import Nav from "@/components/navbar";

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
    id_user_seller: number;
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

type OrderGroup = {
  id_group: string;
  id_transaksi: string;
  sellerId: number;
  sellerName: string;
  items: DetailTransaksi[];
  subtotal: number;
  tanggal_transaksi: string;
  status_transaksi: string;
  alamat?: Transaksi["alamat"];
  jasa_kirim?: Transaksi["jasa_kirim"];
  metode_pembayaran?: Transaksi["metode_pembayaran"];
  pembayaran?: Transaksi["pembayaran"];
  tracking_logs: TrackingLog[];
  status_pengiriman: string;
};

function formatStatus(status: string | undefined | null): string {
  if (!status) return "-";

  const upper = status.toUpperCase().trim();
  if (upper.startsWith("DIKIRIM_SELLER_")) {
    return "Sedang Dikirim";
  }
  if (upper.startsWith("SELESAI_SELLER_")) {
    return "Selesai";
  }

  switch (upper) {
    case "BELUM_BAYAR":
      return "Belum Bayar";
    case "MENUNGGU_PEMBAYARAN":
      return "Menunggu Pembayaran";
    case "SEDANG_DIKIRIM":
    case "DIKIRIM":
      return "Sedang Dikirim";
    case "DIKEMAS":
      return "Dikemas";
    case "SELESAI":
      return "Selesai";
    case "BATAL":
      return "Batal";
    default:
      return status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function isUnpaidTransaction(trx: Transaksi): boolean {
  const transactionStatus = trx.status_transaksi?.toUpperCase();
  const paymentStatus = trx.pembayaran?.status_pembayaran?.toUpperCase();

  return (
    transactionStatus === "BELUM_BAYAR" ||
    paymentStatus === "MENUNGGU_PEMBAYARAN"
  );
}

function PesananContent() {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState("semua");
  const orderMode: "buyer" | "seller" =
    mode === "seller" ? "seller" : "buyer";
  const [user, setUser] = useState({ nama: "", role: "" });
  const [buyerTransactions, setBuyerTransactions] = useState<Transaksi[]>([]);
  const [sellerTransactions, setSellerTransactions] = useState<Transaksi[]>([]);
  const [buyerLoaded, setBuyerLoaded] = useState(false);
  const [sellerLoaded, setSellerLoaded] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState<Transaksi | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const activeTransactions =
    orderMode === "seller" ? sellerTransactions : buyerTransactions;

  const unpaidTransactionCount = activeTransactions.filter(
    isUnpaidTransaction,
  ).length;

  const fetchTransactions = async (
    modeTarget: "buyer" | "seller" = orderMode,
    forceRefresh = false,
  ) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    const alreadyLoaded = modeTarget === "seller" ? sellerLoaded : buyerLoaded;

    if (alreadyLoaded && !forceRefresh) {
      return;
    }

    try {
      setIsOrderLoading(true);

      const endpoint =
        modeTarget === "seller"
          ? `http://localhost:5050/api/transaksi/seller/${userId}`
          : `http://localhost:5050/api/transaksi/user/${userId}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Gagal mengambil pesanan.", "error");
        return;
      }

      if (modeTarget === "seller") {
        setSellerTransactions(data);
        setSellerLoaded(true);
      } else {
        setBuyerTransactions(data);
        setBuyerLoaded(true);
      }
    } catch (error) {
      console.error("Gagal mengambil pesanan:", error);
      showToast("Gagal mengambil pesanan. Periksa koneksi internet Anda.", "error");
      alert("Terjadi kesalahan saat mengambil pesanan");
    } finally {
      setIsOrderLoading(false);
    }
  };

  useEffect(() => {
    const modeTarget: "buyer" | "seller" =
      mode === "seller" ? "seller" : "buyer";

    const timer = setTimeout(() => {
      setIsPageLoading(false);
      setShouldAnimate(true);
    }, 300);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        nama: userData.username || userData.name || "User",
        role: userData.role || "BUYER",
      });
    }

    void fetchTransactions(modeTarget);

    const interval = setInterval(() => {
      void fetchTransactions(modeTarget, true);
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [mode]);

  const isSeller = user.role === "SELLER" || user.role === "Penjual";

  const handleKonfirmasiKirim = async (idTransaksi: string) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5050/api/transaksi/${idTransaksi}/konfirmasi-kirim`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_seller: Number(userId),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Gagal konfirmasi pengiriman.", "error");
        return;
      }

      showToast("Pesanan berhasil dikonfirmasi dikirim.", "success");
      await fetchTransactions();
      alert("Pesanan berhasil dikonfirmasi dikirim");
      await fetchTransactions("seller", true);
    } catch (error) {
      console.error("Gagal konfirmasi kirim:", error);
      showToast("Terjadi kesalahan. Periksa koneksi internet Anda.", "error");
    }
  };

  const getSellerShippingStatus = (
    sellerId: number,
    logs: TrackingLog[] = [],
    statusTransaksi?: string,
    statusPembayaran?: string,
  ) => {
    const trxStatus = statusTransaksi?.toUpperCase();
    const payStatus = statusPembayaran?.toUpperCase();

    if (trxStatus === "BELUM_BAYAR" || payStatus === "MENUNGGU_PEMBAYARAN") {
      return "BELUM_BAYAR";
    }

    const selesai = logs.some(
      (log) => log.status === `SELESAI_SELLER_${sellerId}`,
    );

    if (selesai) return "SELESAI";

    const dikirim = logs.some(
      (log) => log.status === `DIKIRIM_SELLER_${sellerId}`,
    );

    if (dikirim) return "DIKIRIM";

    return "DIKEMAS";
  };

  const searchedTransactions = activeTransactions.filter((trx) => {
    const keyword = searchTerm.toLowerCase();

    const matchSearch =
      trx.detail_transaksi?.some((detail) =>
        detail.produk?.nama_produk?.toLowerCase().includes(keyword),
      ) ||
      trx.detail_transaksi?.some((detail) =>
        detail.produk?.seller?.username?.toLowerCase().includes(keyword),
      ) ||
      trx.status_transaksi?.toLowerCase().includes(keyword) ||
      trx.id_transaksi?.toLowerCase().includes(keyword);

    return matchSearch;
  });

  const orderGroups: OrderGroup[] = searchedTransactions.flatMap((trx) => {
    const currentUserId = Number(localStorage.getItem("userId"));

    const details =
      orderMode === "seller"
        ? trx.detail_transaksi.filter(
          (detail) => detail.produk?.id_user_seller === currentUserId,
        )
        : trx.detail_transaksi.filter(
          (detail) => detail.produk?.id_user_seller !== currentUserId,
        );

    const groups = new Map<number, DetailTransaksi[]>();

    details.forEach((detail) => {
      const sellerId = detail.produk?.id_user_seller;

      if (!sellerId) return;

      if (!groups.has(sellerId)) {
        groups.set(sellerId, []);
      }

      groups.get(sellerId)?.push(detail);
    });

    return Array.from(groups.entries()).map(([sellerId, items]) => {
      const firstItem = items[0];

      const sellerName =
        firstItem?.produk?.seller?.username || "GreenMarket Store";

      const subtotal = items.reduce(
        (total, detail) => total + detail.subtotal,
        0,
      );

      return {
        id_group: `${trx.id_transaksi}-${sellerId}`,
        id_transaksi: trx.id_transaksi,
        sellerId,
        sellerName,
        items,
        subtotal,
        tanggal_transaksi: trx.tanggal_transaksi,
        status_transaksi: trx.status_transaksi,
        alamat: trx.alamat,
        jasa_kirim: trx.jasa_kirim,
        metode_pembayaran: trx.metode_pembayaran,
        pembayaran: trx.pembayaran,
        tracking_logs: trx.tracking_logs,
        status_pengiriman: getSellerShippingStatus(
          sellerId,
          trx.tracking_logs,
          trx.status_transaksi,
          trx.pembayaran?.status_pembayaran,
        ),
      };
    });
  });

  const filteredOrderGroups = orderGroups.filter((group) => {
    const statusPengiriman = group.status_pengiriman?.toUpperCase();
    const statusPembayaran = group.pembayaran?.status_pembayaran?.toUpperCase();

    if (activeTab === "semua") return true;

    if (activeTab === "belum_bayar") {
      return (
        statusPengiriman === "BELUM_BAYAR" ||
        statusPembayaran === "MENUNGGU_PEMBAYARAN"
      );
    }

    if (activeTab === "dikemas") return statusPengiriman === "DIKEMAS";
    if (activeTab === "dikirim") return statusPengiriman === "DIKIRIM";
    if (activeTab === "selesai") return statusPengiriman === "SELESAI";

    return true;
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
      <Nav variant="pesanan" shouldAnimate={shouldAnimate} user={user} />

      {/* ── KONTEN UTAMA ── */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">
        {/* ── SIDEBAR PROFIL ── */}
        <ProfileSidebar
          username={user.nama || "User"}
          role={user.role || "BUYER"}
          activeMenu={orderMode === "seller" ? "pesanan-masuk" : "pesanan"}
          unpaidOrderCount={unpaidTransactionCount}
        />

        {/* ── DAFTAR PESANAN UTAMA ── */}
        <main className="flex-1">
          <div
            className={`bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 border border-white/5 shadow-2xl relative overflow-hidden h-full ${shouldAnimate ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#2fa84f] rounded-full opacity-[0.15] blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-[800] text-white tracking-tight m-0">
              {orderMode === "seller" ? "Pesanan Masuk" : "Pesanan Saya"}
            </h2>
            <p className="text-sm text-gray-400 mt-2 font-medium">
              {orderMode === "seller"
                ? "Kelola pesanan pembeli yang membeli produk Anda."
                : "Pantau status pengiriman dan riwayat belanja Anda."}
            </p>

            {/* Tabs Filter */}
            <div className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar relative z-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 text-[13px] font-[800] transition-all relative whitespace-nowrap uppercase tracking-wider ${activeTab === tab.id
                      ? "text-[#2fa84f]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {tab.name}
                    {tab.id === "belum_bayar" && unpaidTransactionCount > 0 && (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black leading-5 text-center shadow-[0_0_12px_rgba(239,68,68,0.45)]">
                        {unpaidTransactionCount > 99
                          ? "99+"
                          : unpaidTransactionCount}
                      </span>
                    )}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2fa84f] rounded-t-full shadow-[0_-2px_10px_rgba(47,168,79,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            {/* List Pesanan */}
            <div className="space-y-6 relative z-10">
              {isOrderLoading && filteredOrderGroups.length === 0 && (
                <div className="text-center py-10 bg-white/5 rounded-[24px] border border-white/10 text-gray-400 font-bold">
                  Memuat pesanan...
                </div>
              )}

              {filteredOrderGroups.map((group, index) => {
                const firstDetail = group.items[0];
                const firstProduct = firstDetail?.produk;

                const productImage =
                  firstProduct?.foto_produk ||
                  firstProduct?.foto_produk_list?.[0] ||
                  firstProduct?.fotos?.[0]?.url_foto ||
                  "https://placehold.co/120x120/e9f7ec/2fa84f?text=GreenMarket";

                const totalBarang =
                  group.items.reduce(
                    (total, detail) => total + detail.kuantitas,
                    0,
                  ) || 0;

                const totalPesanan = group.subtotal;

                return (
                  <div
                    key={group.id_group}
                    className={`border border-white/10 rounded-[28px] overflow-hidden bg-[#1a1f1b]/50 hover:border-[#2fa84f]/40 transition-all shadow-lg backdrop-blur-sm ${shouldAnimate ? "animate-fade-in-up" : "opacity-0"}`}
                    style={
                      shouldAnimate
                        ? { animationDelay: `${300 + index * 120}ms` }
                        : {}
                    }
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
                          {orderMode === "seller"
                            ? group.alamat?.nama_penerima || "Pembeli"
                            : group.sellerName}
                        </span>
                      </div>

                      <span className="text-[10px] font-black text-[#2fa84f] bg-[#2fa84f]/10 px-4 py-1.5 rounded-xl uppercase tracking-widest border border-[#2fa84f]/20 shadow-inner">
                        {formatStatus(group.status_pengiriman)}
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
                            <h4 className="font-bold text-white text-[16px] mb-2 leading-snug">
                              {firstProduct?.nama_produk ||
                                "Produk tidak ditemukan"}

                              {group.items.length > 1 && (
                                <span className="text-gray-400">
                                  {" "}
                                  dan {group.items.length - 1} produk lainnya
                                  dari seller ini
                                </span>
                              )}
                            </h4>

                            <p className="text-[11px] text-gray-500 mb-3 font-bold">
                              ID Transaksi: {group.id_transaksi}
                            </p>

                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[10px] font-black text-[#2fa84f] border border-[#2fa84f]/30 bg-[#2fa84f]/10 px-2.5 py-1.5 rounded-lg uppercase tracking-wider">
                                {formatStatus(group.pembayaran?.status_pembayaran || "BELUM_BAYAR")}
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
                                {group.jasa_kirim?.nama_jasa || "-"} •{" "}
                                {totalBarang} barang
                              </p>
                            </div>

                            <p className="text-[12px] text-gray-500 mt-3">
                              {group.alamat?.alamat_lengkap ||
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
                          onClick={() =>
                            setSelectedTracking({
                              id_transaksi: group.id_transaksi,
                              total_harga: group.subtotal,
                              status_transaksi: group.status_pengiriman,
                              tanggal_transaksi: group.tanggal_transaksi,
                              detail_transaksi: group.items,
                              alamat: group.alamat,
                              jasa_kirim: group.jasa_kirim,
                              metode_pembayaran: group.metode_pembayaran,
                              pembayaran: group.pembayaran,
                              tracking_logs: group.tracking_logs,
                            })
                          }
                          className="flex-1 sm:flex-none px-7 py-3.5 text-xs font-bold text-gray-300 border border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/30 hover:text-white transition-all uppercase tracking-widest"
                        >
                          Detail
                        </button>

                        {orderMode === "seller" &&
                          group.status_pengiriman === "DIKEMAS" ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleKonfirmasiKirim(group.id_transaksi)
                            }
                            className="flex-1 sm:flex-none px-7 py-3.5 text-xs font-bold text-white bg-[#2fa84f] rounded-2xl hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] uppercase tracking-widest hover:-translate-y-1"
                          >
                            Konfirmasi Kirim
                          </button>
                        ) : orderMode === "buyer" ? (
                          <Link
                            href={`/katalog-detail/${firstProduct?.id_produk || ""}`}
                            className="flex-1 sm:flex-none px-7 py-3.5 text-xs font-bold text-white bg-[#2fa84f] rounded-2xl hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] uppercase tracking-widest hover:-translate-y-1 no-underline text-center"
                          >
                            Beli Lagi
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}

              {!isOrderLoading && filteredOrderGroups.length === 0 && (
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
                  {formatStatus(selectedTracking.pembayaran?.status_pembayaran || "BELUM_BAYAR")}
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
                            {formatStatus(log.status)}
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
      <Footer />
    </div>
  );
}

export default function PesananPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
          <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
          <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
            Memuat Pesanan...
          </p>
        </div>
      }
    >
      <PesananContent />
    </Suspense>
  );
}
