"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const router = useRouter();
  
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    // Efek loading saat memuat halaman (800ms)
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    const role = localStorage.getItem("userRole");
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setAdminName(userData.username || userData.name || "Admin");
    }

    // Pengecekan Keamanan Role Admin
    if (role !== "ADMIN") {
      alert("Akses ditolak! Halaman ini khusus Administrator.");
      if (role === "SELLER" || role === "BUYER") {
        router.push("/beranda-dashboard");
      } else {
        router.push("/login");
      }
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5050/admin/users?role=${role}`);
        const data = await response.json();
        if (response.ok) setUsers(data);
      } catch (err) {
        console.error("Gagal koneksi ke API");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // ── TAMPILAN LOADING SCREEN ──
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Otentikasi Sistem...
        </p>
      </div>
    );
  }

  // ── TAMPILAN UTAMA ADMIN PANEL ──
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* ── BACKGROUND DECOR ── */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#2fa84f] opacity-[0.15] blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
          <Link href="/admin-panel" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_0_20px_rgba(47,168,79,0.3)] group-hover:scale-105 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase">
              GreenMarket <span className="text-[#2fa84f] text-[10px] bg-[#2fa84f]/10 px-2 py-1 rounded-full ml-1 align-middle">ADMIN</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-3 pl-4 border-l border-white/10 group">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0">{adminName}</p>
                  <p className="text-[10px] text-purple-400 m-0 font-black uppercase tracking-wider">Superadmin</p>
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

      {/* ── MAIN LAYOUT (Sidebar + Content) ── */}
      <div className="max-w-[1600px] mx-auto pt-28 pb-20 px-6 flex flex-col lg:flex-row gap-8 relative z-10 w-full flex-grow">
        
        {/* ── SIDEBAR ADMIN ── */}
        <aside className="w-full lg:w-[280px] shrink-0">
          <div className="sticky top-28 bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[3px] mb-4 block text-center">Menu Kontrol</span>
            
            <nav className="flex flex-col gap-2">
              <Link href="/admin-panel" className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#2fa84f] text-white font-bold transition no-underline shadow-[0_4px_15px_rgba(47,168,79,0.2)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span className="text-sm">Dashboard</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-[#2fa84f] transition-colors"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span className="text-sm">Kelola Pengguna</span>
              </Link>
              <Link href="#" className="flex items-center gap-3 p-3.5 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition no-underline font-semibold group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:text-[#2fa84f] transition-colors"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <span className="text-sm">Moderasi Produk</span>
              </Link>
              
              <div className="my-4 border-t border-white/5" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition font-bold text-left group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="text-sm">Keluar Sistem</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1">
          <div className="mb-10">
            <span className="text-[11px] font-black text-[#2fa84f] uppercase tracking-[3px] mb-2 block">Executive Control Center</span>
            <h1 className="text-3xl lg:text-4xl font-[800] text-white tracking-tight leading-tight">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm font-medium mt-2">Pantau dan kelola seluruh ekosistem GreenMarket.</p>
          </div>

          {/* ── STATS CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Total Pengguna", value: users.length || 0, icon: "👥", color: "from-blue-500 to-cyan-500" },
              { label: "Produk Aktif", value: "567", icon: "📦", color: "from-[#2fa84f] to-[#1a7a35]" },
              { label: "Laporan Baru", value: "12", icon: "⚠️", color: "from-orange-500 to-red-500" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#1a1f1b]/80 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl relative group overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                 <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                 <div className="absolute top-6 right-6 text-3xl opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all">{stat.icon}</div>
                 
                 <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-[2px] mb-2">{stat.label}</h3>
                 <p className="text-[36px] font-[900] text-white tracking-tighter leading-none">{stat.value}</p>
                 <div className="h-1.5 w-12 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${stat.color} w-1/3 group-hover:w-full transition-all duration-700`}></div>
                 </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* ── PENGGUNA TERBARU ── */}
            <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-[500px]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-[800] text-white">Registrasi Pengguna</h3>
                <span className="bg-[#2fa84f]/10 text-[#2fa84f] px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#2fa84f]/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#2fa84f] rounded-full animate-pulse"></div> Live
                </span>
              </div>
              <div className="p-6 overflow-y-auto flex-grow no-scrollbar">
                <div className="space-y-3">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-40">
                      <div className="w-8 h-8 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-3"></div>
                      <span className="text-[10px] text-[#2fa84f] font-bold uppercase tracking-widest animate-pulse">Sinkronisasi Database...</span>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 font-bold text-sm border border-dashed border-white/10 rounded-2xl">Tidak ada data pengguna.</div>
                  ) : (
                    users.slice(0, 8).map((u: any) => (
                      <div key={u.id} className="flex items-center gap-4 p-4 bg-[#0a110b]/50 rounded-[20px] border border-white/5 hover:border-[#2fa84f]/40 hover:bg-white/5 transition-all group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-white/10 to-transparent rounded-full flex items-center justify-center text-white font-bold uppercase shadow-inner border border-white/5">
                          {u.username ? u.username.charAt(0) : "?"}
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-white text-[14px] leading-snug">{u.username}</p>
                          <p className="text-[11px] text-gray-500 font-medium">{u.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border ${
                            u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                            u.role === 'SELLER' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-[#2fa84f]/10 text-[#2fa84f] border-[#2fa84f]/20'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* ── PRODUK TERBARU ── */}
            <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-[500px]">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-lg font-[800] text-white">Produk Menunggu Validasi</h3>
                <Link href="#" className="text-[#2fa84f] text-[11px] font-bold hover:underline">Lihat Semua</Link>
              </div>
              <div className="p-6 overflow-y-auto flex-grow no-scrollbar">
                <div className="space-y-3">
                  {/* Contoh Dummy Produk untuk UI Admin */}
                  {[
                    { nama: "Tas Daur Ulang Plastik", harga: 150000, seller: "EcoStore" },
                    { nama: "Sedotan Bambu Set", harga: 25000, seller: "NatureVibe" },
                    { nama: "Pupuk Kompos Organik 5kg", harga: 45000, seller: "TaniMaju" },
                    { nama: "Sabun Cuci Lerak", harga: 30000, seller: "CleanEarth" }
                  ].map((prod, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-[#0a110b]/50 rounded-[20px] border border-white/5 hover:border-[#2fa84f]/40 hover:bg-white/5 transition-all group">
                      <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-white text-[13px] leading-tight mb-1">{prod.nama}</p>
                        <p className="text-[11px] text-gray-500 font-medium">Oleh: <span className="text-gray-300">{prod.seller}</span></p>
                      </div>
                      <div className="text-right">
                         <p className="text-[#2fa84f] font-black text-sm whitespace-nowrap">Rp {prod.harga.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-transparent py-8 text-center border-t border-[#1a2e1f]/10 mt-auto relative z-10">
         <p className="text-[#1a2e1f]/50 text-[10px] font-black tracking-[4px] uppercase m-0">
            © 2026 GREENMARKET INC. ADMINISTRATOR HUB.
         </p>
      </footer>
    </div>
  );
}