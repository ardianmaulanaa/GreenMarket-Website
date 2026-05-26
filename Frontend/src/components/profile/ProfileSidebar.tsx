"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type ActiveMenu =
  | "profile"
  | "alamat"
  | "pesanan"
  | "pesanan-masuk"
  | "inventaris";

type ProfileSidebarProps = {
  username?: string;
  role?: string;
  activeMenu: ActiveMenu;
  shouldAnimate?: boolean;
  unpaidOrderCount?: number;
};

export default function ProfileSidebar({
  username = "User",
  role = "BUYER",
  activeMenu,
  shouldAnimate = true,
  unpaidOrderCount = 0,
}: ProfileSidebarProps) {
  const router = useRouter();

  const user = {
    nama: username,
    role: role,
  };

  const isSeller = user.role === "SELLER" || user.role === "Penjual";

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const menuClass = (menu: ActiveMenu) =>
    `flex items-center gap-3 p-3.5 rounded-2xl transition no-underline font-bold ${
      activeMenu === menu
        ? "bg-[#2fa84f] text-white shadow-[0_4px_15px_rgba(47,168,79,0.2)]"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  const renderNotificationBadge = (count: number) => {
    if (count <= 0) return null;

    return (
      <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-black leading-5 text-center shadow-[0_0_12px_rgba(239,68,68,0.45)]">
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0">
      <div
        className={`sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl ${shouldAnimate ? "animate-slide-in-left" : "opacity-0"}`}
      >
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
          <Link href="/profile" className={menuClass("profile")}>
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

          <Link href="/alamat" className={menuClass("alamat")}>
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
          <Link href="/pesanan" className={menuClass("pesanan")}>
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
            {renderNotificationBadge(unpaidOrderCount)}
          </Link>

          {isSeller && (
            <Link
              href="/pesanan?mode=seller"
              className={menuClass("pesanan-masuk")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span className="text-sm">Pesanan Masuk</span>
            </Link>
          )}

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
  );
}
