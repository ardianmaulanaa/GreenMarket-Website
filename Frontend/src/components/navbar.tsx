"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type UserLike = {
  nama?: string;
  username?: string;
  role?: string;
};

type ProfileLike = {
  nama?: string;
  username?: string;
  role?: string;
};

type NavbarVariant =
  | "home"
  | "admin"
  | "dashboardBuyer"
  | "dashboardSeller"
  | "detail"
  | "toko"
  | "keranjang"
  | "pembayaran"
  | "pesanan"
  | "profile"
  | "alamat"
  | "panelPenjual"
  | "komunitas";

type NavbarProps = {
  variant: NavbarVariant;

  shouldAnimate?: boolean;

  user?: UserLike;
  profile?: ProfileLike;
  userName?: string;
  userRole?: string;
  adminName?: string;

  searchTerm?: string;
  setSearchTerm?: (value: string) => void;

  scrolled?: boolean;
  handleGuestAccess?: () => void;
  isGuestLoading?: boolean;

  handleLogout?: () => void;
  setShowSellerPopup?: (value: boolean) => void;
  showNotification?: (type: "success" | "error", message: string) => void;

  dashboardHref?: string;
  avatarSrc?: string;
};

function defaultAvatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || "User",
  )}&background=2fa84f&color=fff&size=256`;
}

export default function Navbar({
  variant,
  shouldAnimate = true,

  user,
  profile,
  userName,
  userRole,
  adminName = "Admin",

  searchTerm = "",
  setSearchTerm,

  scrolled = false,
  handleGuestAccess,
  isGuestLoading = false,

  handleLogout,
  setShowSellerPopup,
  showNotification,

  dashboardHref,
  avatarSrc,
}: NavbarProps) {
  const router = useRouter();

  const finalUserName =
    userName ||
    profile?.nama ||
    profile?.username ||
    user?.nama ||
    user?.username ||
    "User";

  const [savedAvatar, setSavedAvatar] = useState<string | null>(null);

  useEffect(() => {
    const avatar = localStorage.getItem("profileAvatar");
    if (avatar) setSavedAvatar(avatar);
  }, []);

  const finalAvatarSrc = useMemo(
    () => avatarSrc || savedAvatar || defaultAvatarUrl(finalUserName),
    [avatarSrc, savedAvatar, finalUserName],
  );

  const finalRole = userRole || profile?.role || user?.role || "BUYER";
  const isSeller = finalRole === "SELLER";
  const isGuest = finalRole === "GUEST";

  const finalDashboardHref =
    dashboardHref || (isSeller ? "/dashboard-seller" : "/dashboard-buyer");

  const canShowAnimationClass = shouldAnimate ? "animate-fade-in" : "opacity-0";

  const goDashboard = () => {
    const role = localStorage.getItem("userRole");

    if (role === "SELLER") {
      router.push("/dashboard-seller");
    } else {
      router.push("/dashboard-buyer");
    }
  };

  const openProfile = () => {
    const role = localStorage.getItem("userRole");

    if (role === "GUEST") {
      if (showNotification) {
        showNotification("error", "Fitur ini tidak tersedia pada akun guest");
      } else {
        alert("Fitur ini tidak tersedia pada akun guest.");
      }
      return;
    }

    router.push("/profile");
  };

  const handleSellClick = () => {
    const role = localStorage.getItem("userRole");

    if (role === "GUEST") {
      setShowSellerPopup?.(true);
      return;
    }

    router.push("/register-penjual");
  };

  const showBack = [
    "detail",
    "toko",
    "pembayaran",
    "pesanan",
    "profile",
    "alamat",
    "panelPenjual",
  ].includes(variant);

  const showSearch = ["dashboardBuyer", "dashboardSeller", "toko"].includes(
    variant,
  );

  const showCart = [
    "dashboardBuyer",
    "dashboardSeller",
    "detail",
    "toko",
    "pembayaran",
  ].includes(variant);

  const showSellButton =
    ["dashboardBuyer", "alamat", "profile", "pesanan"].includes(variant) &&
    !isSeller;

  const showInventoryButton =
    variant === "dashboardSeller" || (variant === "pembayaran" && isSeller);

  const showLogoutButton = [
    "dashboardBuyer",
    "dashboardSeller",
    "pembayaran",
    "panelPenjual",
  ].includes(variant);

  const showProfileBlock = [
    "dashboardBuyer",
    "dashboardSeller",
    "detail",
    "toko",
    "pembayaran",
    "pesanan",
    "profile",
    "alamat",
    "panelPenjual",
  ].includes(variant);

  const searchPlaceholder =
    variant === "pesanan"
      ? "Cari pesanan Anda..."
      : variant === "detail" || variant === "toko"
        ? "Cari produk di GreenMarket..."
        : "Cari produk ramah lingkungan...";

  const logoHref =
    variant === "dashboardSeller" || variant === "panelPenjual" || isSeller
      ? "/dashboard-seller"
      : "/dashboard-buyer";

  const roleLabel = isSeller ? "SELLER HUB" : "BUYER";

  const CartButton = () => (
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
  );

  const BackButton = () => (
    <button
      type="button"
      onClick={goDashboard}
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
  );

  const Logo = ({ href = logoHref }: { href?: string }) => (
    <Link href={href} className="flex items-center gap-2 no-underline group">
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
  );

  const SearchBar = () => (
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
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm?.(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500"
        />
      </div>
    </div>
  );

  const SellButton = () => (
    <div className="hidden lg:flex items-center gap-4">
      <button
        type="button"
        onClick={handleSellClick}
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
  );

  const InventoryButton = () => (
    <div className="hidden lg:flex items-center gap-4">
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
    </div>
  );

  const LogoutButton = () => {
    if (variant === "dashboardBuyer" && isGuest) {
      return (
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
      );
    }

    return (
      <button
        onClick={handleLogout}
        className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase transition-colors bg-transparent border-none cursor-pointer mx-2"
      >
        Logout
      </button>
    );
  };

  const GuestAuthButtons = () => {
    if (!isGuest || (variant !== "detail" && variant !== "toko")) {
      return null;
    }

    return (
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
    );
  };

  const ProfileBlock = ({ label = roleLabel }: { label?: string }) => (
    <button
      type="button"
      onClick={openProfile}
      className="flex items-center gap-3 pl-4 group no-underline border-l border-white/10 bg-transparent border-y-0 border-r-0 cursor-pointer"
    >
      <div className="text-right hidden sm:block">
        <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">
          {finalUserName}
        </p>

        <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">
          {label}
        </p>
      </div>

      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
        <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase overflow-hidden">
          <img
            src={finalAvatarSrc}
            alt={finalUserName}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </button>
  );

  if (variant === "home") {
    return (
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] shadow-[0_4px_20px_rgba(47,168,79,0.4)]"
            whileHover={{ scale: 1.06 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z" />
            </svg>
          </motion.div>

          <span
            className={`text-lg font-extrabold tracking-tight transition-colors md:text-xl ${
              scrolled ? "text-[#1a2e1f]" : "text-white"
            }`}
          >
            GreenMarket
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={handleGuestAccess}
            disabled={isGuestLoading}
            className={`hidden text-sm font-semibold no-underline transition hover:text-[#2fa84f] disabled:cursor-not-allowed disabled:opacity-70 sm:inline ${
              scrolled ? "text-[#1a2e1f]/80" : "text-white/90"
            }`}
          >
            Jelajahi
          </button>

          <Link
            href="/login"
            className={`text-sm font-semibold no-underline transition hover:text-[#2fa84f] ${
              scrolled ? "text-[#1a2e1f]" : "text-white"
            }`}
          >
            Masuk
          </Link>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/register"
              className="inline-block rounded-xl bg-[#2fa84f] px-5 py-2.5 text-sm font-bold text-white no-underline shadow-[0_4px_24px_rgba(47,168,79,0.35)] transition hover:bg-[#268c41]"
            >
              Daftar
            </Link>
          </motion.div>
        </div>
      </nav>
    );
  }

  if (variant === "admin") {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
          <Link
            href="/admin-panel"
            className="flex items-center gap-2.5 no-underline group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
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
              GreenMarket{" "}
              <span className="text-[#2fa84f] text-[10px] bg-[#2fa84f]/10 px-2 py-1 rounded-full ml-1 align-middle">
                ADMIN
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-white/10 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white m-0">{adminName}</p>
                <p className="text-[10px] text-purple-400 m-0 font-black uppercase tracking-wider">
                  Superadmin
                </p>
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px] shadow-lg">
                <div className="w-full h-full rounded-full bg-[#0d130e] flex items-center justify-center text-white font-bold uppercase">
                  {adminName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (variant === "keranjang") {
    return (
      <nav
        className={`bg-[#1f2a22]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-[0_10px_30px_rgba(10,17,11,0.22)] ${canShowAnimationClass}`}
      >
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-6 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center justify-between lg:justify-start gap-5 shrink-0">
            <div className="flex items-center">
              <Link
                href={finalDashboardHref}
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

              <div className="h-6 w-[2px] bg-white/20 mx-4 hidden sm:block"></div>

              <span className="text-xl font-bold text-[#2fa84f] tracking-tight hidden sm:block">
                Keranjang Saya
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xl lg:ml-16 hidden md:block">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm?.(e.target.value)}
                placeholder="Cari produk di keranjang"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2fa84f] transition-all placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <ProfileBlock />
          </div>
        </div>
      </nav>
    );
  }

  if (variant === "komunitas") {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-xl border-b border-white/5 h-[72px]">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton />

            <Link
              href="/dashboard-buyer"
              className="flex items-center gap-2.5 group no-underline"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
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

          <div className="flex items-center gap-4">
            <ProfileBlock label="KOMUNITAS" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] ${
        variant === "profile"
          ? "px-4 sm:px-6 lg:px-8"
          : variant === "panelPenjual"
            ? "px-4 md:px-8"
            : "px-8"
      } flex items-center justify-between ${
        variant === "detail" ||
        variant === "toko" ||
        variant === "pembayaran" ||
        variant === "profile"
          ? ""
          : canShowAnimationClass
      }`}
    >
      <div
        className={
          variant === "profile"
            ? "flex min-w-0 items-center gap-2 sm:gap-3"
            : "flex items-center gap-8"
        }
      >
        {showBack && <BackButton />}

        <Logo href={logoHref} />

        {showSellButton && <SellButton />}

        {showInventoryButton && <InventoryButton />}
      </div>

      {showSearch && SearchBar()}

      <div
        className={
          variant === "profile"
            ? "flex shrink-0 items-center gap-2 sm:gap-3"
            : "flex items-center gap-4"
        }
      >
        {showCart && <CartButton />}

        {showLogoutButton && <LogoutButton />}

        <GuestAuthButtons />

        {showProfileBlock && <ProfileBlock />}
      </div>
    </nav>
  );
}
