"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/useToast";
import Nav from "@/components/navbar";

// ── IMPORT IKON LUCIDE (ZERO EMOJI) ──
import {
  Leaf,
  Users,
  Package,
  ShoppingBag,
  BarChart3,
  TrendingUp,
  Wallet,
  Activity,
  Bell,
  Search,
  LayoutDashboard,
  Store,
  Calendar,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut
} from "lucide-react";

// ── IMPORT RECHARTS UNTUK SPARKLINE RIIL ──
import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface AdminUser {
  id: number | string;
  username?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

export default function AdminPanel() {
  const { showToast } = useToast();
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState<{
    totalUsers: number;
    activeProducts: number;
    pendingProducts: number;
    totalTransactions: number;
  } | null>(null);

  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("7 hari terakhir");

  useEffect(() => {
    // Efek loading saat memuat halaman (800ms)
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    const role = localStorage.getItem("userRole");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const userData = JSON.parse(savedUser) as AdminUser;
      queueMicrotask(() => {
        setAdminName(userData.username || userData.name || "Admin");
      });
    }

    // Pengecekan Keamanan Role Admin
    if (role !== "ADMIN") {
      showToast("Akses ditolak! Halaman ini khusus Administrator.", "error");
      if (role === "SELLER" || role === "BUYER") {
        router.push("/beranda-dashboard");
      } else {
        router.push("/login");
      }
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:5050/admin/users?role=${role}`,
        );
        const data = await response.json();
        if (response.ok) setUsers(data);
      } catch (error) {
        console.error("Gagal koneksi ke API", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch(
          `http://localhost:5050/admin/stats?role=${role}`,
        );
        const data = await response.json();
        if (response.ok) setStats(data);
      } catch (error) {
        console.error("Gagal koneksi ke API Stats", error);
      }
    };

    const fetchLatestProducts = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/products");
        const data = await response.json();
        if (response.ok) {
          setLatestProducts(Array.isArray(data) ? data.slice(0, 5) : []);
        }
      } catch (error) {
        console.error("Gagal koneksi ke API Products", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchUsers();
    fetchStats();
    fetchLatestProducts();

    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const filteredUsers = users.filter((u) => {
    const searchTerm = (userSearchTerm || "").toLowerCase();
    const matchesSearch =
      (u.username || "").toLowerCase().includes(searchTerm) ||
      (u.email || "").toLowerCase().includes(searchTerm);
    const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // ── MEMOIZED TRENDS CALCULATIONS (LIGHTWEIGHT, SINGLE PASS) ──
  const trendStats = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

    const computeTrend = (list: any[], dateField: string) => {
      let recent = 0;
      let previous = 0;

      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const rawDate = item[dateField];
        if (!rawDate) continue;
        const time = new Date(rawDate).getTime();
        if (time >= sevenDaysAgo && time <= now) {
          recent++;
        } else if (time >= fourteenDaysAgo && time < sevenDaysAgo) {
          previous++;
        }
      }

      if (previous > 0) {
        const pct = Math.round(((recent - previous) / previous) * 100);
        return { label: `↑ ${pct}%`, sub: "vs 7 hari lalu", hasData: true };
      }
      return { label: "", sub: "", hasData: false };
    };

    const buyers = users.filter((u) => u.role === "BUYER");
    const sellers = users.filter((u) => u.role === "SELLER");

    return {
      buyer: computeTrend(buyers, "createdAt"),
      seller: computeTrend(sellers, "createdAt"),
      produk: computeTrend(latestProducts, "created_at"),
    };
  }, [users, latestProducts]);

  // ── MEMOIZED DATA SPARKLINE RECHARTS (OPTIMIZED SINGLE LOOP) ──
  const sparklineData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const dayStr = d.toLocaleDateString("id-ID", { weekday: "short" });
      const dayStart = new Date(d.setHours(0, 0, 0, 0)).getTime();
      const dayEnd = new Date(d.setHours(23, 59, 59, 999)).getTime();
      return { dayStr, dayStart, dayEnd, buyer: 0, seller: 0, produk: 0 };
    });

    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      if (!u.createdAt) continue;
      const t = new Date(u.createdAt).getTime();
      for (let j = 0; j < 7; j++) {
        if (t >= days[j].dayStart && t <= days[j].dayEnd) {
          if (u.role === "BUYER") days[j].buyer++;
          if (u.role === "SELLER") days[j].seller++;
          break;
        }
      }
    }

    for (let i = 0; i < latestProducts.length; i++) {
      const p = latestProducts[i];
      const rawDate = p.created_at || p.createdAt;
      if (!rawDate) continue;
      const t = new Date(rawDate).getTime();
      for (let j = 0; j < 7; j++) {
        if (t >= days[j].dayStart && t <= days[j].dayEnd) {
          days[j].produk++;
          break;
        }
      }
    }

    return days.map((day) => ({
      day: day.dayStr,
      buyer: day.buyer,
      seller: day.seller,
      produk: day.produk,
    }));
  }, [users, latestProducts]);

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#07110A] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-500 font-bold text-[10px] tracking-[4px] uppercase animate-pulse">
          Otentikasi Sistem...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07110A] font-sans text-gray-200 relative overflow-hidden">
      {/* ── SOFT PREMIUM ECO-BACKGROUND BLUR ── */}
      <div className="absolute top-[-30%] right-[-10%] w-[800px] h-[800px] bg-[#2fa84f] opacity-[0.08] blur-[180px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-35%] left-[-15%] w-[700px] h-[700px] bg-[#2fa84f] opacity-[0.05] blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* ── NAVBAR ── */}
      <Nav variant="admin" adminName={adminName} />

      <div className="max-w-[1680px] mx-auto pt-24 pb-20 px-8 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">
        {/* ── PREMIUM STICKY SIDEBAR (Mockup Style) ── */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-24 bg-[#0d1510]/80 backdrop-blur-2xl rounded-[28px] p-6 border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between h-[calc(100vh-140px)]">
            <div>
              {/* Logo Area */}
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2fa84f] to-[#4ade80] flex items-center justify-center shadow-[0_0_12px_rgba(47,168,79,0.3)]">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-black text-white tracking-wider block">GREENMARKET</span>
                  <span className="text-[9px] font-semibold text-[#2fa84f] tracking-[1.5px] uppercase">ADMIN CONSOLE</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1.5">
                <Link
                  href="#dashboard"
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#2fa84f]/10 text-[#4ade80] border border-[#2fa84f]/25 font-bold transition-all duration-300 no-underline group shadow-[0_0_15px_rgba(47,168,79,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-[#4ade80]" />
                    <span className="text-xs tracking-wide">Dashboard</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2fa84f] shadow-[0_0_8px_#2fa84f]"></div>
                </Link>
                <Link
                  href="#users"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 no-underline font-semibold border border-transparent"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-xs tracking-wide">Pengguna</span>
                </Link>
                <Link
                  href="#products"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 no-underline font-semibold border border-transparent"
                >
                  <Package className="w-4 h-4" />
                  <span className="text-xs tracking-wide">Produk</span>
                </Link>
                <Link
                  href="#transactions"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 no-underline font-semibold border border-transparent"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs tracking-wide">Transaksi</span>
                </Link>
                <Link
                  href="#transactions"
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 no-underline font-semibold border border-transparent"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs tracking-wide">Laporan</span>
                </Link>
                <div className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 font-semibold border border-transparent relative group">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span className="text-xs tracking-wide">Filter Data</span>
                  </div>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  >
                    <option value="7 hari terakhir">7 hari terakhir</option>
                    <option value="14 hari terakhir">14 hari terakhir</option>
                    <option value="30 hari terakhir">30 hari terakhir</option>
                  </select>
                  <span className="text-[9px] bg-[#2fa84f]/10 text-[#4ade80] px-2 py-0.5 rounded-full font-bold group-hover:bg-[#2fa84f]/20 transition-colors">
                    {timeFilter}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 font-semibold border border-transparent bg-transparent cursor-pointer text-left w-full group"
                >
                  <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                  <span className="text-xs tracking-wide">Keluar Sistem</span>
                </button>
              </nav>
            </div>

            {/* Bottom Card Leaf Illustration & Admin Badge */}
            <div className="flex flex-col gap-4 border-t border-white/5 pt-5">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="flex w-full items-center gap-3 bg-[#07110a]/80 p-3 rounded-2xl border border-white/5 text-left hover:border-[#2fa84f]/40 hover:bg-[#0d1510] transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2fa84f]/20 to-transparent flex items-center justify-center border border-[#2fa84f]/20 text-[#4ade80] font-black text-xs shrink-0 group-hover:scale-105 transition-transform">
                  {adminName.charAt(0)}
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-xs font-black text-white truncate leading-none mb-1 group-hover:text-[#4ade80] transition-colors">{adminName}</p>
                  <span className="text-[8px] font-black text-[#2fa84f] tracking-wider uppercase">SUPERADMIN</span>
                </div>
              </button>

              {/* Ecosystem Block */}
              <div className="bg-[#07110a]/50 p-4 rounded-[20px] border border-white/5 text-center">
                <Leaf className="w-5 h-5 text-[#2fa84f] mx-auto mb-2 animate-pulse" />
                <p className="text-[9px] font-bold text-white tracking-wide leading-tight mb-1">GreenMarket</p>
                <p className="text-[8px] text-gray-500 leading-relaxed mb-0">Ekosistem hijau untuk masa depan.</p>
              </div>

              <p className="text-[8px] text-gray-600 text-center tracking-wider uppercase mb-0">
                © 2026 GreenMarket Inc. All rights reserved.
              </p>
            </div>
          </div>
        </aside>

        {/* ── MAIN EXECUTIVES DASHBOARD ── */}
        <main id="dashboard" className="flex-grow scroll-mt-24 min-w-0">
          {/* ── PREMIUM HEADER CONTROL BAR ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[#0d1510]/30 backdrop-blur-md p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] font-black text-[#2fa84f] uppercase tracking-[3px]">
              DASHBOARD PUSAT DATA
            </span>
            
            <div className="flex items-center gap-4 self-end md:self-auto">
              {/* Premium Glass Search Bar */}
              <div className="relative shrink-0 w-44 md:w-56">
                <input
                  type="text"
                  placeholder="Cari apa saja..."
                  className="w-full bg-[#07110a]/70 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[10px] text-white focus:outline-none focus:border-[#2fa84f]/60 transition-all placeholder-gray-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              </div>

              {/* Notification Bell */}
              <button className="relative p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all shrink-0">
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#2fa84f] rounded-full"></span>
              </button>

              {/* Admin Avatar Circle */}
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-8 h-8 rounded-full bg-[#2fa84f] border border-white/10 flex items-center justify-center text-white text-[10px] font-black shrink-0 hover:scale-105 hover:opacity-80 transition-all cursor-pointer"
                title="Lihat Profil"
              >
                {adminName.substring(0, 1).toUpperCase()}
              </button>

              {/* Date Filter Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-white/5 border border-white/5 text-gray-400 text-[10px] rounded-xl px-3 py-2 focus:outline-none focus:border-[#2fa84f]/60 transition-all font-semibold cursor-pointer"
                >
                  <option value="7 hari terakhir">7 hari terakhir</option>
                  <option value="14 hari terakhir">14 hari terakhir</option>
                  <option value="30 hari terakhir">30 hari terakhir</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── HERO HEADER GREETINGS ── */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-[900] text-white tracking-tight leading-tight mb-2">
              Selamat datang kembali, <span className="text-transparent bg-gradient-to-r from-[#2fa84f] to-[#4ade80] bg-clip-text font-black">{adminName}</span>
            </h1>
            <p className="text-gray-400 text-xs font-semibold leading-relaxed mb-6">
              Pantau dan kelola seluruh ekosistem GreenMarket secara real-time.
            </p>

            {/* Horizontal Mini Glass Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-[#0d1510]/80 border border-white/5 rounded-full px-3.5 py-1.5 text-[9px] font-bold text-gray-300 shadow-[0_0_12px_rgba(0,0,0,0.4)]">
                <Users className="w-3.5 h-3.5 text-[#3b82f6]" />
                <span>{stats?.totalUsers ?? users.length ?? 0} Pengguna</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0d1510]/80 border border-white/5 rounded-full px-3.5 py-1.5 text-[9px] font-bold text-gray-300 shadow-[0_0_12px_rgba(0,0,0,0.4)]">
                <Store className="w-3.5 h-3.5 text-[#a855f7]" />
                <span>{users.filter((u) => u.role === "SELLER").length} Seller</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0d1510]/80 border border-white/5 rounded-full px-3.5 py-1.5 text-[9px] font-bold text-gray-300 shadow-[0_0_12px_rgba(0,0,0,0.4)]">
                <Package className="w-3.5 h-3.5 text-[#2fa84f]" />
                <span>{stats?.activeProducts ?? latestProducts.length ?? 0} Produk</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0d1510]/80 border border-white/5 rounded-full px-3.5 py-1.5 text-[9px] font-bold text-gray-300 shadow-[0_0_12px_rgba(0,0,0,0.4)]">
                <Wallet className="w-3.5 h-3.5 text-amber-500" />
                <span>{stats?.totalTransactions ?? 0} Transaksi</span>
              </div>
            </div>
          </div>

          {/* ── KPI CARDS WITH REAL SPARKLINE CHARTS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "BUYER",
                value: users.filter((u) => u.role === "BUYER").length,
                icon: <Users className="w-4 h-4 text-emerald-400" />,
                trend: trendStats.buyer,
                color: "#10b981",
                dataKey: "buyer",
                glow: "rgba(16,185,129,0.12)"
              },
              {
                label: "SELLER",
                value: users.filter((u) => u.role === "SELLER").length,
                icon: <Store className="w-4 h-4 text-purple-400" />,
                trend: trendStats.seller,
                color: "#a855f7",
                dataKey: "seller",
                glow: "rgba(168,85,247,0.12)"
              },
              {
                label: "PRODUK",
                value: stats?.activeProducts ?? latestProducts.length ?? 0,
                icon: <Package className="w-4 h-4 text-blue-400" />,
                trend: trendStats.produk,
                color: "#3b82f6",
                dataKey: "produk",
                glow: "rgba(59,130,246,0.12)"
              },
              {
                label: "TRANSAKSI",
                value: stats?.totalTransactions ?? 0,
                icon: <Wallet className="w-4 h-4 text-amber-400" />,
                trend: { label: "", hasData: false, sub: "" },
                color: "#f59e0b",
                dataKey: "buyer",
                glow: "rgba(245,158,11,0.12)"
              }
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-[#0d1510]/80 backdrop-blur-xl p-6 rounded-[28px] border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-[#2fa84f]/25 hover:scale-[1.01] group"
                style={{ boxShadow: `0 10px 30px -15px ${card.glow}` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-400 font-bold text-[9px] uppercase tracking-[1.5px]">
                    {card.label}
                  </h3>
                  <div className="p-1.5 rounded-xl bg-white/5 border border-white/5 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[34px] font-[900] text-white tracking-tighter leading-none mb-1.5">
                    {card.value}
                  </p>
                  
                  {/* Dynamic Trend Badge (Real Data Only) */}
                  {card.trend.hasData ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">
                        {card.trend.label}
                      </span>
                      <span className="text-[8px] text-gray-500">{card.trend.sub}</span>
                    </div>
                  ) : (
                    <span className="text-[8px] font-semibold text-gray-500 block">
                      No comparison data
                    </span>
                  )}
                </div>

                {/* Recharts Premium Sparkline (AreaChart) */}
                {card.label === "TRANSAKSI" ? (
                  <div className="w-full h-12 mt-3 -mx-6 -mb-6 flex items-center justify-center bg-black/15 border-t border-white/5">
                    <span className="text-[8px] font-black text-gray-500 tracking-wider uppercase">
                      No activity data
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-12 mt-3 -mx-6 -mb-6 opacity-30 group-hover:opacity-70 transition-opacity duration-300">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData}>
                        <defs>
                          <linearGradient id={`colorGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={card.color} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={card.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey={card.dataKey}
                          stroke={card.color}
                          strokeWidth={1.5}
                          fillOpacity={1}
                          fill={`url(#colorGrad-${idx})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── AKTIVITAS SISTEM TERBARU (LIVE BADGE & MOCKUP ROWS) ── */}
          <div id="transactions" className="bg-[#0d1510]/80 backdrop-blur-xl rounded-[28px] border border-white/5 shadow-2xl p-7 mb-8 scroll-mt-24">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-[800] text-white tracking-tight">
                  Aktivitas Sistem Terbaru
                </h3>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  LIVE
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Kolom 1: Pengguna Terbaru */}
              <div className="bg-[#07110a]/50 p-5 rounded-2xl border border-white/5 flex flex-col h-[320px] hover:border-[#2fa84f]/25 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    PENGGUNA TERDAFTAR BARU
                  </h4>
                  <Link href="#users" className="text-[#2fa84f] text-[9px] font-bold hover:underline no-underline">
                    Lihat Semua
                  </Link>
                </div>
                <div className="space-y-3 overflow-y-auto no-scrollbar flex-grow">
                  {users.slice(0, 4).map((u) => {
                    const rawDate = u.createdAt;
                    const formattedTime = rawDate 
                      ? new Date(rawDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) 
                      : "Baru saja";
                    return (
                      <div key={u.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-all border border-transparent">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-white font-bold uppercase shrink-0">
                            {u.username ? u.username.charAt(0) : "?"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="text-[11px] font-bold text-white truncate leading-none">{u.username}</p>
                              <span className={`text-[7px] font-black px-1.5 py-0.2 rounded uppercase ${
                                u.role === "ADMIN" ? "bg-purple-500/10 text-purple-400" : u.role === "SELLER" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {u.role}
                              </span>
                            </div>
                            <p className="text-[9px] text-gray-500 truncate leading-none">{u.email}</p>
                          </div>
                        </div>
                        <span className="text-[8px] text-gray-600 font-medium shrink-0">{formattedTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom 2: Produk Baru Terdaftar */}
              <div className="bg-[#07110a]/50 p-5 rounded-2xl border border-white/5 flex flex-col h-[320px] hover:border-[#2fa84f]/25 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    PRODUK BARU KATALOG
                  </h4>
                  <Link href="#products" className="text-[#2fa84f] text-[9px] font-bold hover:underline no-underline">
                    Lihat Semua
                  </Link>
                </div>
                <div className="space-y-3 overflow-y-auto no-scrollbar flex-grow">
                  {productsLoading ? (
                    <p className="text-[9px] text-gray-500 animate-pulse">Menghubungkan...</p>
                  ) : latestProducts.slice(0, 4).map((prod) => {
                    const rawDate = prod?.createdAt || prod?.created_at;
                    const formattedTime = rawDate 
                      ? new Date(rawDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) 
                      : "Baru saja";
                    return (
                      <div key={prod?.id_produk} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-all border border-transparent">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden text-[10px] text-[#2fa84f] font-bold">
                            {prod?.foto_produk || prod?.foto_produk_list?.[0] ? (
                              <img src={prod?.foto_produk || prod?.foto_produk_list?.[0]} alt="p" className="w-full h-full object-cover" />
                            ) : (
                              prod?.nama_produk?.charAt(0) || "P"
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-white truncate leading-none mb-1">{prod?.nama_produk}</p>
                            <p className="text-[9px] text-[#2fa84f] font-bold leading-none">Rp {(prod?.harga || 0).toLocaleString("id-ID")}</p>
                          </div>
                        </div>
                        <span className="text-[8px] text-gray-600 font-medium shrink-0">{formattedTime}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom 3: Status Transaksi */}
              <div className="bg-[#07110a]/50 p-5 rounded-2xl border border-white/5 flex flex-col h-[320px] justify-center items-center text-center hover:border-white/10 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-[#2fa84f]/20 flex items-center justify-center text-[#2fa84f] mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">
                  Transaksi belum tersedia
                </h4>
                <p className="text-[9px] text-gray-500 max-w-[200px] leading-relaxed mb-0">
                  Fitur monitoring transaksi sistem global akan aktif setelah endpoint dedicated <code className="text-[#2fa84f] bg-white/5 px-1 py-0.5 rounded">GET /admin/transactions</code> tersedia pada database backend.
                </p>
              </div>
            </div>
          </div>

          {/* ── SECTION 4: KATALOG PRODUK AKTIF (Mockup Cards Row) ── */}
          <div id="products" className="bg-[#0d1510]/80 backdrop-blur-xl rounded-[28px] border border-white/5 shadow-2xl p-7 mb-8 scroll-mt-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-[800] text-white tracking-tight">
                Katalog Produk Terbaru
              </h3>
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard-buyer"
                  className="text-[#2fa84f] text-[10px] font-bold hover:underline no-underline"
                >
                  Lihat Semua
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {productsLoading ? (
                <div className="col-span-4 flex flex-col items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
                  <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
                    Sinkronisasi Database...
                  </span>
                </div>
              ) : latestProducts.length === 0 ? (
                <div className="col-span-4 text-center py-10 text-gray-500 font-bold text-[10px] border border-dashed border-white/10 rounded-2xl">
                  Tidak ada data produk di database.
                </div>
              ) : (
                latestProducts.slice(0, 4).map((prod) => {
                  const sellerName = prod?.seller?.username || prod?.user?.username || "EcoStore";
                  const rawDate = prod?.createdAt || prod?.created_at;
                  const createdDate = rawDate
                    ? new Date(rawDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : null;

                  const isRecent = rawDate
                    ? (Date.now() - new Date(rawDate).getTime()) / (1000 * 60 * 60 * 24) < 3
                    : false;

                  return (
                    <div
                      key={prod?.id_produk}
                      className="bg-[#07110a]/50 rounded-[22px] border border-white/5 overflow-hidden hover:border-[#2fa84f]/30 transition-all duration-300 group hover:scale-[1.02]"
                    >
                      {/* Product Image Area */}
                      <div className="h-32 bg-white/5 relative flex items-center justify-center overflow-hidden border-b border-white/5">
                        {prod?.foto_produk || prod?.foto_produk_list?.[0] ? (
                          <img
                            src={prod?.foto_produk || prod?.foto_produk_list?.[0]}
                            alt={prod?.nama_produk || "Produk"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-600" />
                        )}
                        {isRecent && (
                          <span className="absolute top-3 left-3 bg-[#2fa84f] text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            BARU
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <p className="font-bold text-white text-xs truncate leading-tight mb-1">
                          {prod?.nama_produk || "Produk Tanpa Nama"}
                        </p>
                        <p className="text-[#2fa84f] font-black text-xs mb-3">
                          Rp {(prod?.harga || 0).toLocaleString("id-ID")}
                        </p>
                        
                        <div className="border-t border-white/5 pt-2 flex flex-col gap-0.5 text-[9px] text-gray-500 font-medium">
                          <p className="truncate m-0">Oleh: <span className="text-gray-300">{sellerName}</span></p>
                          {createdDate && <p className="m-0">{createdDate}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── SECTION 5: MANAJEMEN PENGGUNA TERBARU ── */}
          <div id="users" className="bg-[#0d1510]/80 backdrop-blur-xl rounded-[28px] border border-white/5 shadow-2xl p-7 scroll-mt-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-[800] text-white tracking-tight">
                Pengguna Terbaru
              </h3>
              <Link href="#users" className="text-[#2fa84f] text-[9px] font-bold hover:underline no-underline">
                Lihat Semua
              </Link>
            </div>
            
            {/* Filter controls matching Mockup */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full bg-[#07110a]/80 border border-white/5 rounded-xl px-4 py-2 pl-9 text-[10px] text-white focus:outline-none focus:border-[#2fa84f]/60 transition-all placeholder-gray-500"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
              </div>
              
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-[#07110a]/80 border border-white/5 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-[#2fa84f]/60 transition-all cursor-pointer font-semibold"
              >
                <option value="ALL">Semua Peran</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SELLER">SELLER</option>
                <option value="BUYER">BUYER</option>
              </select>
            </div>

            {/* List Rows */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
                  <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest animate-pulse">
                    Sinkronisasi Database...
                  </span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-gray-500 font-bold text-[10px] border border-dashed border-white/10 rounded-[20px]">
                  Tidak ada data pengguna terdaftar.
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3.5 bg-[#07110a]/50 rounded-[20px] border border-white/5 hover:border-[#2fa84f]/35 hover:bg-white/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Avatar colored by role */}
                      <div className={`w-9 h-9 bg-gradient-to-tr ${
                        u.role === "ADMIN" ? "from-purple-600/25 to-purple-500/10 text-purple-400 border-purple-500/20" : u.role === "SELLER" ? "from-blue-600/25 to-blue-500/10 text-blue-400 border-blue-500/20" : "from-[#2fa84f]/25 to-[#2fa84f]/10 text-[#4ade80] border-[#2fa84f]/20"
                      } rounded-full flex items-center justify-center font-black uppercase text-xs border shrink-0`}>
                        {u.username ? u.username.charAt(0) : "?"}
                      </div>
                      
                      <div className="min-w-0">
                        <p className="font-bold text-white text-[12px] leading-tight mb-1 truncate">
                          {u.username}
                        </p>
                        <p className="text-[9px] text-gray-500 truncate leading-none">
                          {u.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={`text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border ${
                          u.role === "ADMIN" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : u.role === "SELLER" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-[#2fa84f]/10 text-[#4ade80] border-[#2fa84f]/20"
                        }`}
                      >
                        {u.role}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        Aktif
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-transparent py-8 text-center border-t border-white/5 mt-auto relative z-10">
        <p className="text-gray-600 text-[9px] font-black tracking-[4px] uppercase m-0">
          © 2026 GREENMARKET INC. ADMINISTRATOR CONSOLE HUB.
        </p>
      </footer>
    </div>
  );
}
