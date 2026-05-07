"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Produk {
  id_produk: string;
  nama_produk: string;
  harga: number;
  stok: number;
  deskripsi: string;
  fotos?: { url_foto: string }[];
  kategori?: { nama_kategori: string };
  seller?: { username: string; email: string };
}

interface JasaKirim {
  id_jasa: string;
  nama_jasa: string;
  harga_pengiriman: number;
  estimasi_waktu: string;
}

interface MetodePembayaran {
  id_metode: string;
  nama_metode: string;
  kode_metode: string;
}

interface Address {
  id_alamat: string;
  id_user: number;
  nama_penerima: string;
  nomor_hp: string;
  alamat_lengkap: string;
}

export default function PembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const produkId = searchParams.get("produk");
  const qtyParam = Number(searchParams.get("qty") || "1");

  const [product, setProduct] = useState<Produk | null>(null);
  const [quantity, setQuantity] = useState(qtyParam > 0 ? qtyParam : 1);
  const [metodePembayaran, setMetodePembayaran] = useState<MetodePembayaran[]>(
    [],
  );
  const [selectedPayment, setSelectedPayment] = useState("");
  const [jasaKirim, setJasaKirim] = useState<JasaKirim[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [shippingInsurance, setShippingInsurance] = useState(false);
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [tempSelectedShipping, setTempSelectedShipping] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ nama: "User", role: "BUYER" });

  const fetchMetodePembayaran = async () => {
    try {
      const response = await fetch(
        "http://localhost:5050/api/metode-pembayaran",
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengambil metode pembayaran");
        return;
      }

      setMetodePembayaran(data);

      if (data.length > 0) {
        const defaultMethod =
          data.find((item: MetodePembayaran) => item.kode_metode === "QRIS") ||
          data[0];

        setSelectedPayment(defaultMethod.id_metode);
      }
    } catch (error) {
      console.error("Gagal mengambil metode pembayaran:", error);
    }
  };

  const fetchAddresses = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5050/api/alamat/${userId}`,
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengambil alamat");
        return;
      }

      setAddresses(data);

      if (data.length > 0) {
        setSelectedAddress(data[0].id_alamat);
      }
    } catch (error) {
      console.error("Gagal mengambil alamat:", error);
    }
  };

  const fetchProduct = async () => {
    if (!produkId) {
      alert("Produk tidak ditemukan");
      router.push("/beranda-dashboard");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5050/api/products/${produkId}`,
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengambil data produk");
        router.push("/beranda-dashboard");
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      alert("Terjadi kesalahan saat mengambil produk");
      router.push("/beranda-dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchJasaKirim = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/jasa-kirim");
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal mengambil jasa kirim");
        return;
      }

      setJasaKirim(data);

      if (data.length > 0) {
        const defaultShipping =
          data.find((item: JasaKirim) => item.nama_jasa === "Green Reguler") ||
          data[0];

        setSelectedShipping(defaultShipping.id_jasa);
      }
    } catch (error) {
      console.error("Gagal mengambil jasa kirim:", error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser({
          nama: userData.username || userData.name || "User",
          role: userData.role || "BUYER",
        });
      } catch (error) {
        console.error("Gagal membaca user:", error);
      }
    }

    fetchJasaKirim();
    fetchProduct();
    fetchMetodePembayaran();
    fetchAddresses();
  }, [produkId, router]);

  const selectedShippingData = useMemo(() => {
    return jasaKirim.find((item) => item.id_jasa === selectedShipping);
  }, [jasaKirim, selectedShipping]);

  const subtotal = (product?.harga || 0) * quantity;
  const ongkir = selectedShippingData?.harga_pengiriman || 0;
  const biayaAsuransi = shippingInsurance ? 500 : 0;
  const total = subtotal + ongkir + biayaAsuransi;

  const handleQuantity = (type: "min" | "plus") => {
    if (!product) return;

    if (type === "min" && quantity > 1) {
      setQuantity(quantity - 1);
    }

    if (type === "plus" && quantity < product.stok) {
      setQuantity(quantity + 1);
    }
  };

  const handleBayar = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (!product) {
      alert("Produk tidak ditemukan");
      return;
    }

    if (!selectedAddress) {
      alert("Pilih alamat terlebih dahulu");
      return;
    }

    if (!selectedPayment) {
      alert("Pilih metode pembayaran terlebih dahulu");
      return;
    }

    if (!selectedShipping) {
      alert("Pilih jasa kirim terlebih dahulu");
      return;
    }

    try {
      const response = await fetch("http://localhost:5050/api/transaksi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: Number(userId),
          id_alamat: selectedAddress,
          id_jasa_kirim: selectedShipping,
          id_metode_pembayaran: selectedPayment,
          kuantitas: quantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Gagal membuat transaksi");
        return;
      }

      const paymentData = {
        id_transaksi: data.transaksi.id_transaksi,
        id_user: Number(userId),
        id_produk: product.id_produk,
        nama_produk: product.nama_produk,
        quantity,
        id_alamat: selectedAddress,
        id_jasa_kirim: selectedShipping,
        id_metode_pembayaran: selectedPayment,
        jasa_kirim: selectedShippingData?.nama_jasa || "",
        ongkir,
        asuransi_pengiriman: shippingInsurance,
        biaya_asuransi: biayaAsuransi,
        subtotal,
        total_harga: total,
        status_transaksi: data.transaksi.status_transaksi,
        status_pembayaran: data.transaksi.pembayaran?.status_pembayaran,
      };

      localStorage.setItem("paymentData", JSON.stringify(paymentData));

      alert(data.message || "Transaksi berhasil dibuat");
      router.push("/profile");
    } catch (error) {
      console.error("Gagal membuat transaksi:", error);
      alert("Terjadi kesalahan saat membuat transaksi");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f8ee] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2fa84f] font-bold text-sm">
            {" "}
            Memuat pembayaran...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f3f8ee] flex items-center justify-center">
        <p className="text-[#1a2e1f] font-bold">Produk tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf3e7] relative overflow-hidden font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/beranda-dashboard"
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
            {user.role === "SELLER" && (
              <Link
                href="/panel-penjual"
                className="bg-[#2fa84f] text-white px-5 py-2.5 rounded-xl text-xs font-bold no-underline hover:bg-[#268c41] transition-all shadow-[0_4px_12px_rgba(47,168,79,0.3)] flex items-center gap-2"
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
                Panel Inventaris
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/wishlist"
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
                {user.nama || "User"}
              </p>
              <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">
                {user.role === "SELLER" ? "Seller Hub" : "Buyer"}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                {user.nama ? user.nama.charAt(0) : "U"}
              </div>
            </div>
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-[1280px] mx-auto pt-[110px] px-6 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.7fr] gap-6">
          {/* LEFT */}
          <div className="bg-[#f7f7f7] rounded-[28px] shadow-lg p-6 lg:p-8">
            {/* PRODUK */}
            <div className="flex items-start justify-between gap-6 pb-7 border-b border-gray-200">
              <div className="flex items-start gap-6">
                <img
                  src={
                    product.fotos?.[0]?.url_foto ||
                    "https://via.placeholder.com/120"
                  }
                  alt={product.nama_produk}
                  className="w-[120px] h-[120px] rounded-[20px] object-cover border border-gray-200 shrink-0"
                />

                <div>
                  <p className="text-[13px] text-gray-500 font-semibold mb-1">
                    {product.seller?.username || "GreenMarket Store"}
                  </p>

                  <h2 className="text-[30px] font-black text-[#1f1f1f] leading-tight mb-2">
                    {product.nama_produk}
                  </h2>

                  <p className="text-[20px] font-black text-[#111]">
                    Rp {product.harga.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0 mt-4">
                <div className="border border-gray-300 rounded-xl flex items-center overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => handleQuantity("min")}
                    className="px-6 py-3 text-red-500 font-bold text-lg"
                  >
                    -
                  </button>

                  <span className="px-7 py-3 text-sm font-bold text-[#1f1f1f]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleQuantity("plus")}
                    className="px-6 py-3 text-[#2fa84f] font-bold text-lg"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm text-gray-500">
                  Stok tersedia: {product.stok}
                </span>
              </div>
            </div>

            {/* ALAMAT PENGIRIMAN */}
            <div className="pt-4 pb-3 border-b border-gray-200">
              <h3 className="text-[18px] font-black text-[#1f1f1f] mb-4">
                Alamat Pengiriman
              </h3>

              {addresses.length === 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-[16px] p-4">
                  <p className="text-sm text-red-500 font-bold mb-3">
                    Belum ada alamat tersimpan.
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/alamat")}
                    className="bg-[#2fa84f] text-white px-4 py-2 rounded-xl font-bold text-sm"
                  >
                    Tambah Alamat
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id_alamat}
                      className={`block border rounded-[18px] p-4 cursor-pointer transition-all ${
                        selectedAddress === address.id_alamat
                          ? "border-[#2fa84f] bg-[#eef9f0]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-[#1f1f1f]">
                            {address.nama_penerima}
                          </p>

                          <p className="text-sm text-gray-600">
                            {address.nomor_hp}
                          </p>

                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {address.alamat_lengkap}
                          </p>
                        </div>

                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === address.id_alamat}
                          onChange={() => setSelectedAddress(address.id_alamat)}
                          className="w-4 h-4 accent-[#2fa84f] mt-1"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* JASA KIRIM */}
            <div className="pt-4">
              <h3 className="text-[18px] font-black text-[#1f1f1f] mb-4">
                Pilih Jasa Kirim
              </h3>

              <button
                type="button"
                onClick={() => {
                  setTempSelectedShipping(selectedShipping);
                  setShowShippingOptions(true);
                }}
                className="w-full border border-[#2fa84f] bg-[#eef9f0] rounded-[18px] p-4 flex items-center justify-between text-left hover:bg-[#e5f6e8] transition-all"
              >
                <div>
                  <p className="font-bold text-[#1f1f1f] text-[15px]">
                    {selectedShippingData?.nama_jasa || "Pilih Jasa Kirim"}{" "}
                    {selectedShippingData && (
                      <span>
                        (Rp{" "}
                        {selectedShippingData.harga_pengiriman.toLocaleString(
                          "id-ID",
                        )}
                        )
                      </span>
                    )}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {selectedShippingData?.estimasi_waktu ||
                      "Pilih layanan pengiriman"}
                  </p>
                </div>

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2fa84f"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <label className="flex items-center justify-between mt-4 border border-gray-300 rounded-[16px] p-4 bg-white cursor-pointer">
                <p className="text-[15px] font-semibold text-[#1f1f1f]">
                  Asuransi Pengiriman (Rp 500)
                </p>

                <input
                  type="checkbox"
                  checked={shippingInsurance}
                  onChange={(e) => setShippingInsurance(e.target.checked)}
                  className="w-4 h-4 accent-[#2fa84f]"
                />
              </label>
            </div>

            {/* MODAL JASA KIRIM */}
            {showShippingOptions && (
              <div className="fixed inset-0 z-[300] bg-black/60 flex items-end sm:items-start justify-center p-0 sm:px-6 sm:pt-[96px] sm:pb-6">
                <div className="bg-white w-full sm:max-w-xl rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden max-h-[calc(100vh-120px)] flex flex-col">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-[#1f1f1f]">
                        Pilih Jasa Kirim
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Pilih layanan pengiriman yang tersedia
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowShippingOptions(false)}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1">
                    {jasaKirim.map((item) => {
                      const isSelected = tempSelectedShipping === item.id_jasa;

                      return (
                        <button
                          key={item.id_jasa}
                          type="button"
                          onClick={() => {
                            setTempSelectedShipping(item.id_jasa);
                          }}
                          className={`w-full flex items-center gap-4 px-5 py-4 border-b border-gray-100 text-left transition-all ${
                            isSelected
                              ? "bg-[#eef9f0]"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-[#2fa84f]"
                                : "border-gray-400"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#2fa84f]" />
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="font-bold text-[15px] text-[#1f1f1f]">
                              {item.nama_jasa}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {item.estimasi_waktu}
                            </p>
                          </div>

                          <p className="font-bold text-[#1f1f1f]">
                            Rp {item.harga_pengiriman.toLocaleString("id-ID")}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShipping(tempSelectedShipping);
                        setShowShippingOptions(false);
                      }}
                      className="w-full bg-[#2fa84f] hover:bg-[#268c41] text-white font-black py-4 rounded-[16px] transition-all"
                    >
                      Konfirmasi
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-[#f7f7f7] rounded-[24px] shadow-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] font-black text-[#1f1f1f]">
                Metode pembayaran
              </h3>
            </div>

            <div className="space-y-3 mb-6">
              {metodePembayaran.map((item) => (
                <label
                  key={item.id_metode}
                  className="flex items-center justify-between border-b border-gray-200 pb-3 cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-[#1f1f1f]">
                      {item.nama_metode}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === item.id_metode}
                    onChange={() => setSelectedPayment(item.id_metode)}
                    className="w-4 h-4 accent-[#2fa84f]"
                  />
                </label>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-[16px] font-black text-[#1f1f1f] mb-4">
                Cek ringkasan transaksimu
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Ongkir</span>
                  <span>Rp {ongkir.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Asuransi</span>
                  <span>Rp {biayaAsuransi.toLocaleString("id-ID")}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between font-black text-[#1f1f1f] text-[16px]">
                  <span>Total transaksi</span>
                  <span>Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleBayar}
              className="w-full bg-[#4caf50] hover:bg-[#419746] text-white font-black py-4 rounded-[14px] transition-all"
            >
              Bayar sekarang
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
