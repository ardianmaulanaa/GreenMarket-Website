"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import Nav from "@/components/navbar";

// Animation styles removed - imported globally from globals.css

interface UserState {
  nama: string;
  role: string;
}

interface ProdukKeranjang {
  id_produk: string;
  nama_produk: string;
  harga: number;
  stok?: number;
  foto_produk?: string;
  foto_produk_list?: string[];
  kategori?: {
    nama_kategori?: string;
  };
  seller?: {
    id?: number;
    username?: string;
    email?: string;
  };
}

interface KeranjangItem {
  id_keranjang: string;
  produk: ProdukKeranjang;
}

export default function KeranjangPage() {
  const router = useRouter();

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [user, setUser] = useState<UserState>({ nama: "", role: "" });
  const [keranjangItems, setKeranjangItems] = useState<KeranjangItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCheckoutDocked, setIsCheckoutDocked] = useState(false);
  const { showToast } = useToast();
  const { userId, loading } = useUser();
  const checkoutDockRef = useRef<HTMLDivElement | null>(null);

  const dashboardHref =
    user.role === "SELLER" ? "/dashboard-seller" : "/dashboard-buyer";

  const formatRupiah = (value = 0) => `Rp${value.toLocaleString("id-ID")}`;

  const getProductImage = (product?: ProdukKeranjang) =>
    product?.foto_produk ||
    product?.foto_produk_list?.[0] ||
    "https://placehold.co/160x160/e9f7ec/2fa84f?text=GreenMarket";

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      router.push("/login");
      return;
    }

    let isMounted = true;

    const initializePage = async (uid: string) => {
      try {
        const [profileResult, keranjangResult] = await Promise.allSettled([
          fetch(`http://localhost:5050/api/users/${uid}`),
          fetch(`http://localhost:5050/api/keranjang/${uid}`),
        ]);

        let profileOk = false;
        let profileData: any = null;
        if (profileResult.status === "fulfilled") {
          const profileResponse = profileResult.value;
          profileData = await profileResponse.json().catch(() => null);
          profileOk = profileResponse.ok;
          if (!profileOk) {
            console.error(profileData?.message || "Gagal mengambil profile");
          }
        }

        let keranjangOk = false;
        let keranjangData: any = null;
        if (keranjangResult.status === "fulfilled") {
          const keranjangResponse = keranjangResult.value;
          keranjangData = await keranjangResponse.json().catch(() => null);
          keranjangOk = keranjangResponse.ok;
          if (!keranjangOk) {
            showToast(keranjangData?.message || "Gagal mengambil keranjang", "error");
          }
        } else {
          showToast("Gagal terhubung ke layanan keranjang", "error");
        }

        if (!isMounted) return;

        if (profileOk && profileData) {
          setUser({
            nama: profileData.username || "User",
            role: profileData.role || "BUYER",
          });

          localStorage.setItem("user", JSON.stringify(profileData));
          localStorage.setItem("userRole", profileData.role);
        }

        if (keranjangOk && keranjangData) {
          setKeranjangItems(keranjangData);
          setQuantities((currentQuantities) => {
            const nextQuantities = { ...currentQuantities };

            keranjangData.forEach((item: KeranjangItem) => {
              if (!nextQuantities[item.id_keranjang]) {
                nextQuantities[item.id_keranjang] = 1;
              }
            });

            return nextQuantities;
          });
        }
      } catch (error) {
        console.error("Gagal memuat data keranjang:", error);
      }
    };

    initializePage(userId);

    setTimeout(() => {
      setShouldAnimate(true);
    }, 100);

    return () => {
      isMounted = false;
    };
  }, [userId, loading, router]);

  useEffect(() => {
    const updateCheckoutDock = () => {
      const dock = checkoutDockRef.current;

      if (!dock) {
        setIsCheckoutDocked(false);
        return;
      }

      setIsCheckoutDocked(
        dock.getBoundingClientRect().top <= window.innerHeight,
      );
    };

    const frame = window.requestAnimationFrame(updateCheckoutDock);

    window.addEventListener("scroll", updateCheckoutDock, { passive: true });
    window.addEventListener("resize", updateCheckoutDock);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateCheckoutDock);
      window.removeEventListener("resize", updateCheckoutDock);
    };
  }, [keranjangItems.length]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, KeranjangItem[]> = {};

    keranjangItems.forEach((item) => {
      const sellerName = item.produk?.seller?.username || "GreenMarket Store";
      if (!groups[sellerName]) {
        groups[sellerName] = [];
      }
      groups[sellerName].push(item);
    });

    return Object.entries(groups).map(([sellerName, items]) => ({
      sellerName,
      items,
    }));
  }, [keranjangItems]);

  const selectedTotal = keranjangItems
    .filter((item) => selectedItems.includes(item.id_keranjang))
    .reduce((total, item) => {
      const quantity = quantities[item.id_keranjang] || 1;
      return total + item.produk.harga * quantity;
    }, 0);

  const isAllSelected =
    keranjangItems.length > 0 && selectedItems.length === keranjangItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
      return;
    }

    setSelectedItems(keranjangItems.map((item) => item.id_keranjang));
  };

  const toggleItem = (idKeranjang: string) => {
    setSelectedItems((currentItems) =>
      currentItems.includes(idKeranjang)
        ? currentItems.filter((itemId) => itemId !== idKeranjang)
        : [...currentItems, idKeranjang],
    );
  };

  const updateQuantity = (item: KeranjangItem, type: "min" | "plus") => {
    setQuantities((currentQuantities) => {
      const currentQuantity = currentQuantities[item.id_keranjang] || 1;
      const stock = item.produk.stok ?? 99;
      const nextQuantity =
        type === "plus"
          ? Math.min(currentQuantity + 1, stock)
          : Math.max(currentQuantity - 1, 1);

      return {
        ...currentQuantities,
        [item.id_keranjang]: nextQuantity,
      };
    });
  };

  const removeItem = async (idProduk: string) => {
    if (!userId) {
      showToast("Silakan login terlebih dahulu", "warning");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5050/api/keranjang/${userId}/${idProduk}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Gagal menghapus keranjang", "error");
        return;
      }

      setKeranjangItems((currentItems) =>
        currentItems.filter((item) => item.produk.id_produk !== idProduk),
      );
      setSelectedItems((currentItems) =>
        currentItems.filter((idKeranjang) =>
          keranjangItems.some(
            (item) =>
              item.id_keranjang === idKeranjang &&
              item.produk.id_produk !== idProduk,
          ),
        ),
      );
    } catch (error) {
      console.error("Gagal menghapus keranjang:", error);
      showToast("Terjadi kesalahan saat menghapus keranjang", "error");
    }
  };

  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) {
      showToast("Pilih produk yang ingin dihapus", "warning");
      return;
    }

    const selectedProducts = keranjangItems.filter((item) =>
      selectedItems.includes(item.id_keranjang),
    );

    selectedProducts.forEach((item) => removeItem(item.produk.id_produk));
  };

  const checkoutSelected = () => {
    const selectedProducts = keranjangItems.filter((item) =>
      selectedItems.includes(item.id_keranjang),
    );

    if (selectedProducts.length === 0) {
      showToast("Pilih produk yang ingin di-checkout", "warning");
      return;
    }

    const checkoutItems = selectedProducts.map((item) => ({
      id_keranjang: item.id_keranjang,
      id_produk: item.produk.id_produk,
      nama_produk: item.produk.nama_produk,
      harga: item.produk.harga,
      stok: item.produk.stok || 0,
      foto_produk: item.produk.foto_produk,
      foto_produk_list: item.produk.foto_produk_list,
      kuantitas: quantities[item.id_keranjang] || 1,
    }));

    localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));

    router.push("/pembayaran?mode=cart");
  };

  const buyNow = (item: KeranjangItem) => {
    const quantity = quantities[item.id_keranjang] || 1;
    router.push(`/pembayaran?produk=${item.produk.id_produk}&qty=${quantity}`);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-[#eefbe8] via-[#c7e5c5] to-[#253229] font-sans text-white">
      <div className="absolute top-0 left-0 right-0 h-[360px] bg-[radial-gradient(circle_at_20%_20%,rgba(47,168,79,0.28),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(238,251,232,0.7),transparent_36%)] pointer-events-none"></div>
      <div className="absolute right-[-160px] bottom-[80px] w-[520px] h-[520px] rounded-full bg-[#1f2a22]/45 blur-[120px] pointer-events-none"></div>

      <Nav
        variant="keranjang"
        shouldAnimate={shouldAnimate}
        user={user}
        dashboardHref={dashboardHref}
      />

      <main className="relative z-10 mx-auto w-full max-w-[1200px] flex-1 px-4 pt-8 pb-8 sm:px-8 md:pb-10">
        <div
          className={`mb-6 ${shouldAnimate ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <button
            type="button"
            onClick={() => {
              const role = localStorage.getItem("userRole");
              if (role === "SELLER") router.push("/dashboard-seller");
              else router.push("/dashboard-buyer");
            }}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#1a2e1f]/15 bg-[#1a2e1f]/5 px-5 py-2 text-xs font-bold text-[#1a2e1f]/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2fa84f] hover:text-white hover:border-transparent hover:shadow-[0_6px_20px_rgba(47,168,79,0.25)]"
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
        </div>

        <div
          className={`hidden lg:grid grid-cols-[56px_1.7fr_180px_180px_180px_150px] items-center gap-5 bg-[#1f2a22]/90 backdrop-blur-xl rounded-[18px] shadow-[0_18px_45px_rgba(10,17,11,0.22)] border border-white/10 h-20 px-8 text-slate-300 font-semibold ${shouldAnimate ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <input
            checked={isAllSelected}
            onChange={toggleSelectAll}
            type="checkbox"
            className="w-5 h-5 accent-[#2fa84f]"
            aria-label="Pilih semua produk"
          />
          <span>Produk</span>
          <span className="text-center">Harga Satuan</span>
          <span className="text-center">Kuantitas</span>
          <span className="text-center">Total Harga</span>
          <span className="text-center">Aksi</span>
        </div>

        {keranjangItems.length === 0 ? (
          <div
            className={`bg-[#1f2a22]/90 backdrop-blur-xl mt-6 rounded-[24px] min-h-[420px] flex flex-col items-center justify-center text-center px-6 border border-white/10 shadow-[0_18px_45px_rgba(10,17,11,0.22)] ${shouldAnimate ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <div className="w-24 h-24 rounded-full bg-[#2fa84f]/15 flex items-center justify-center text-[#2fa84f] mb-6 border border-[#2fa84f]/25">
              <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h2 className="text-[24px] font-black text-white m-0">
              Keranjangmu masih kosong
            </h2>
            <p className="text-slate-300 mt-2 mb-8">
              Yuk, jelajahi produk ramah lingkungan dari GreenMarket.
            </p>
            <Link
              href={dashboardHref}
              className="bg-[#2fa84f] text-white px-9 py-3 rounded-[4px] font-bold no-underline hover:bg-[#268c41] transition-colors"
            >
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="space-y-5 mt-5">
            {groupedItems.map((group, groupIndex) => (
              <section
                key={group.sellerName}
                className={`bg-[#1f2a22]/92 backdrop-blur-xl rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(10,17,11,0.25)] overflow-hidden ${shouldAnimate ? "animate-slide-in-up" : "opacity-0"}`}
                style={
                  shouldAnimate
                    ? { animationDelay: `${80 + groupIndex * 60}ms` }
                    : {}
                }
              >
                <div className="h-[72px] px-5 sm:px-8 flex items-center gap-4 border-b border-white/10">
                  <input
                    checked={group.items.every((item) =>
                      selectedItems.includes(item.id_keranjang),
                    )}
                    onChange={() => {
                      const allGroupSelected = group.items.every((item) =>
                        selectedItems.includes(item.id_keranjang),
                      );

                      setSelectedItems((currentItems) =>
                        allGroupSelected
                          ? currentItems.filter(
                            (idKeranjang) =>
                              !group.items.some(
                                (item) => item.id_keranjang === idKeranjang,
                              ),
                          )
                          : Array.from(
                            new Set([
                              ...currentItems,
                              ...group.items.map((item) => item.id_keranjang),
                            ]),
                          ),
                      );
                    }}
                    type="checkbox"
                    className="w-5 h-5 accent-[#2fa84f]"
                    aria-label={`Pilih semua produk dari ${group.sellerName}`}
                  />
                  <span className="font-bold text-white text-lg">
                    {group.sellerName}
                  </span>
                </div>

                {group.items.map((item) => {
                  const quantity = quantities[item.id_keranjang] || 1;
                  const itemTotal = item.produk.harga * quantity;

                  return (
                    <div
                      key={item.id_keranjang}
                      className="grid grid-cols-1 lg:grid-cols-[56px_1.7fr_180px_180px_180px_150px] lg:items-center gap-5 px-5 sm:px-8 py-8 border-b border-white/10 last:border-b-0"
                    >
                      <div className="hidden lg:block">
                        <input
                          checked={selectedItems.includes(item.id_keranjang)}
                          onChange={() => toggleItem(item.id_keranjang)}
                          type="checkbox"
                          className="w-5 h-5 accent-[#2fa84f]"
                          aria-label={`Pilih ${item.produk.nama_produk}`}
                        />
                      </div>

                      <div className="flex gap-5 min-w-0">
                        <input
                          checked={selectedItems.includes(item.id_keranjang)}
                          onChange={() => toggleItem(item.id_keranjang)}
                          type="checkbox"
                          className="lg:hidden mt-10 w-5 h-5 accent-[#2fa84f] shrink-0"
                          aria-label={`Pilih ${item.produk.nama_produk}`}
                        />
                        <img
                          src={getProductImage(item.produk)}
                          alt={item.produk.nama_produk}
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-[14px] border border-white/10 bg-[#edf8e9] shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/katalog-detail/${item.produk.id_produk}`}
                            className="text-[16px] sm:text-[18px] font-semibold leading-snug text-white no-underline hover:text-[#2fa84f] line-clamp-2"
                          >
                            {item.produk.nama_produk}
                          </Link>
                          <p className="mt-3 mb-0 text-sm text-slate-400">
                            {item.produk.kategori?.nama_kategori ||
                              "Produk ramah lingkungan"}
                          </p>
                        </div>
                      </div>

                      <div className="lg:text-center text-white font-semibold">
                        <span className="lg:hidden text-slate-400 mr-2">
                          Harga:
                        </span>
                        {formatRupiah(item.produk.harga)}
                      </div>

                      <div className="flex lg:justify-center">
                        <div className="inline-flex h-10 border border-white/10 rounded-[8px] overflow-hidden bg-[#101a13]/70">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item, "min")}
                            className="w-11 text-xl text-slate-200 hover:bg-white/10"
                            aria-label="Kurangi kuantitas"
                          >
                            -
                          </button>
                          <span className="w-14 flex items-center justify-center border-x border-white/10 font-semibold text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item, "plus")}
                            className="w-11 text-xl text-slate-200 hover:bg-white/10"
                            aria-label="Tambah kuantitas"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="lg:text-center text-[#2fa84f] text-[18px] font-bold">
                        <span className="lg:hidden text-slate-400 text-base font-normal mr-2">
                          Total:
                        </span>
                        {formatRupiah(itemTotal)}
                      </div>

                      <div className="flex lg:flex-col gap-3 lg:items-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.produk.id_produk)}
                          className="text-slate-200 hover:text-red-400 font-semibold"
                        >
                          Hapus
                        </button>
                        <button
                          type="button"
                          onClick={() => buyNow(item)}
                          className="text-[#2fa84f] hover:text-[#1d7d37] font-semibold"
                        >
                          Beli Sekarang
                        </button>
                      </div>
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        )}

        {keranjangItems.length > 0 && (
          <div
            className={`fixed bottom-0 left-0 right-0 z-30 px-4 transition-opacity duration-200 sm:px-8 ${shouldAnimate && !isCheckoutDocked ? "animate-slide-in-up opacity-100" : "pointer-events-none opacity-0"}`}
            style={{
              animationDelay: shouldAnimate ? "120ms" : undefined,
            }}
          >
            <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-t-[14px] border border-white/10 bg-[#1f2a22]/95 shadow-[0_-10px_34px_rgba(10,17,11,0.28)] backdrop-blur-xl">
              <div className="flex flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center">
                <div className="flex flex-wrap items-center gap-4 text-[15px] sm:gap-7 sm:text-[17px]">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      type="checkbox"
                      className="h-5 w-5 accent-[#2fa84f]"
                    />
                    <span>Pilih Semua ({keranjangItems.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={deleteSelectedItems}
                    className="text-slate-200 hover:text-red-400"
                  >
                    Hapus
                  </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:ml-auto lg:justify-end lg:gap-6">
                  <div className="text-left sm:text-right">
                    <p className="m-0 text-[16px] font-semibold text-slate-200 sm:text-[17px]">
                      Total ({selectedItems.length} produk):
                      <span className="ml-2 text-[26px] font-black text-[#2fa84f] sm:text-[30px]">
                        {formatRupiah(selectedTotal)}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={checkoutSelected}
                    className="h-14 w-full rounded-[4px] bg-[#2fa84f] px-10 font-bold text-white transition-colors hover:bg-[#268c41] sm:w-auto sm:px-14"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {keranjangItems.length > 0 && (
        <div
          ref={checkoutDockRef}
          className="relative z-10 mx-auto w-full max-w-[1200px] px-4 pb-8 sm:px-8"
        >
          <div className="overflow-hidden rounded-[14px] border border-white/10 bg-[#1f2a22]/95 shadow-[0_16px_40px_rgba(10,17,11,0.22)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center">
              <div className="flex flex-wrap items-center gap-4 text-[15px] sm:gap-7 sm:text-[17px]">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    type="checkbox"
                    className="h-5 w-5 accent-[#2fa84f]"
                  />
                  <span>Pilih Semua ({keranjangItems.length})</span>
                </label>
                <button
                  type="button"
                  onClick={deleteSelectedItems}
                  className="text-slate-200 hover:text-red-400"
                >
                  Hapus
                </button>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:ml-auto lg:justify-end lg:gap-6">
                <div className="text-left sm:text-right">
                  <p className="m-0 text-[16px] font-semibold text-slate-200 sm:text-[17px]">
                    Total ({selectedItems.length} produk):
                    <span className="ml-2 text-[26px] font-black text-[#2fa84f] sm:text-[30px]">
                      {formatRupiah(selectedTotal)}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={checkoutSelected}
                  className="h-14 w-full rounded-[4px] bg-[#2fa84f] px-10 font-bold text-white transition-colors hover:bg-[#268c41] sm:w-auto sm:px-14"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
