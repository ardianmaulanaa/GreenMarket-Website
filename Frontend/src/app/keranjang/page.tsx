"use client";

import React, { useEffect, useMemo, useState } from "react";
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

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(60px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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

  .animate-slide-in-up {
    opacity: 0;
    animation: slideInUp 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
`;

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

  const dashboardHref =
    user.role === "SELLER" ? "/dashboard-seller" : "/dashboard-buyer";

  const formatRupiah = (value = 0) => `Rp${value.toLocaleString("id-ID")}`;

  const getProductImage = (product?: ProdukKeranjang) =>
    product?.foto_produk ||
    product?.foto_produk_list?.[0] ||
    "https://placehold.co/160x160/e9f7ec/2fa84f?text=GreenMarket";

  useEffect(() => {
    let isMounted = true;

    const initializePage = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        router.push("/login");
        return;
      }

      try {
        const [profileResponse, keranjangResponse] = await Promise.all([
          fetch(`http://localhost:5050/api/users/${userId}`),
          fetch(`http://localhost:5050/api/keranjang/${userId}`),
        ]);

        const profileData = await profileResponse.json();
        const keranjangData = await keranjangResponse.json();

        if (!profileResponse.ok) {
          console.error(profileData.message || "Gagal mengambil profile");
        }

        if (!keranjangResponse.ok) {
          alert(keranjangData.message || "Gagal mengambil keranjang");
          return;
        }

        if (!isMounted) {
          return;
        }

        if (profileResponse.ok) {
          setUser({
            nama: profileData.username || "User",
            role: profileData.role || "BUYER",
          });

          localStorage.setItem("user", JSON.stringify(profileData));
          localStorage.setItem("userRole", profileData.role);
        }

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
      } catch (error) {
        console.error("Gagal memuat keranjang:", error);
      }
    };

    initializePage();

    // Trigger animations after a short delay
    setTimeout(() => {
      setShouldAnimate(true);
    }, 300);

    return () => {
      isMounted = false;
    };
  }, [router]);

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
      const stock = item.produk.stok || 99;
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
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Silakan login terlebih dahulu");
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
        alert(data.message || "Gagal menghapus keranjang");
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
      alert("Terjadi kesalahan saat menghapus keranjang");
    }
  };

  const deleteSelectedItems = () => {
    if (selectedItems.length === 0) {
      alert("Pilih produk yang ingin dihapus");
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
      alert("Pilih produk yang ingin di-checkout");
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
    <div className="min-h-screen bg-gradient-to-br from-[#eefbe8] via-[#c7e5c5] to-[#253229] font-sans text-white pb-32 relative overflow-hidden">
      <style>{animationStyles}</style>
      <div className="absolute top-0 left-0 right-0 h-[360px] bg-[radial-gradient(circle_at_20%_20%,rgba(47,168,79,0.28),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(238,251,232,0.7),transparent_36%)] pointer-events-none"></div>
      <div className="absolute right-[-160px] bottom-[80px] w-[520px] h-[520px] rounded-full bg-[#1f2a22]/45 blur-[120px] pointer-events-none"></div>

      <nav className={`bg-[#1f2a22]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-[0_10px_30px_rgba(10,17,11,0.22)] ${shouldAnimate ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-6 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center justify-between lg:justify-start gap-5 shrink-0">
            <div className="flex items-center">
              <Link
                href={dashboardHref}
                className="flex items-center gap-2 no-underline group"
              >
                <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
                </div>
                <span className="text-xl font-black text-white tracking-tight uppercase hidden sm:block">Green<span className="text-[#2fa84f]">Market</span></span>
              </Link>
              <div className="h-6 w-[2px] bg-white/20 mx-4 hidden sm:block"></div>
              <span className="text-xl font-bold text-[#2fa84f] tracking-tight hidden sm:block">Keranjang Saya</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl lg:ml-16 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input
                type="text"
                placeholder="Cari produk di GreenMarket..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            type="button"
              onClick={() => {
                const userRole = localStorage.getItem("userRole");

                if (userRole === "GUEST") {
                  alert("Fitur ini tidak tersedia pada akun guest.");
                  return;
                }

                router.push("/profile");
              }}
              className="hidden lg:flex items-center gap-3 text-right bg-transparent border-0 cursor-pointer"
            >
              <div>
                <p className="m-0 text-sm font-bold text-white">
                  {user.nama || "User"}
                </p>
                <p className="m-0 text-[11px] font-bold text-[#2fa84f] uppercase">
                  {user.role === "SELLER" ? "Seller Hub" : "Buyer"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#101a13] border-2 border-[#2fa84f] flex items-center justify-center text-white font-black uppercase">
                {user.nama ? user.nama.charAt(0) : "U"}
        </div>
</button>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-8 relative z-10">
        <div className={`hidden lg:grid grid-cols-[56px_1.7fr_180px_180px_180px_150px] items-center gap-5 bg-[#1f2a22]/90 backdrop-blur-xl rounded-[18px] shadow-[0_18px_45px_rgba(10,17,11,0.22)] border border-white/10 h-20 px-8 text-slate-300 font-semibold ${shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
          <div className={`bg-[#1f2a22]/90 backdrop-blur-xl mt-6 rounded-[24px] min-h-[420px] flex flex-col items-center justify-center text-center px-6 border border-white/10 shadow-[0_18px_45px_rgba(10,17,11,0.22)] ${shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'}`}>
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
                className={`bg-[#1f2a22]/92 backdrop-blur-xl rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(10,17,11,0.25)] overflow-hidden ${shouldAnimate ? 'animate-slide-in-up' : 'opacity-0'}`}
                style={shouldAnimate ? { animationDelay: `${200 + groupIndex * 150}ms` } : {}}
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
      </main>

      {keranjangItems.length > 0 && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 bg-[#1f2a22]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_34px_rgba(10,17,11,0.28)] ${shouldAnimate ? 'animate-slide-in-up' : 'opacity-0'}`} style={shouldAnimate ? { animationDelay: '600ms' } : {}}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-4 flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-7 text-[15px] sm:text-[17px]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  type="checkbox"
                  className="w-5 h-5 accent-[#2fa84f]"
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

            <div className="lg:ml-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="text-right">
                <p className="m-0 text-[17px] font-semibold text-slate-200">
                  Total ({selectedItems.length} produk):
                  <span className="ml-2 text-[30px] font-black text-[#2fa84f]">
                    {formatRupiah(selectedTotal)}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={checkoutSelected}
                className="h-14 px-14 bg-[#2fa84f] text-white font-bold rounded-[4px] hover:bg-[#268c41] transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
