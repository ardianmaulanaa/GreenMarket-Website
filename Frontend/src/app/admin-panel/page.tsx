"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const router = useRouter();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    if (role !== "ADMIN") {
      alert("Akses ditolak!");
      if (role === "SELLER" && role == "BUYER") router.push("/beranda-dashboard");
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
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* ── BACKGROUND DECOR ── */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-md border-b border-white/5 shadow-lg py-3 px-8 flex items-center justify-between h-[68px]">
        <div className="flex items-center gap-8 text-white">
          <Link href="/" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-[18px] font-[800] tracking-[-0.5px]">GreenMarket</span>
          </Link>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow container mx-auto pt-28 px-6 lg:px-12 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10">
          <span className="text-[11px] font-[800] text-[#2fa84f] uppercase tracking-[3px] mb-2 block">Executive Control</span>
          <h1 className="text-[36px] font-[800] text-white tracking-tight leading-tight">Admin Panel</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">Kelola ekosistem pengguna, produk, dan komunitas.</p>
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Pengguna", value: users.length, icon: "👤" },
            { label: "Total Produk", value: "567", icon: "📦" },
            { label: "Total Komunitas", value: "24", icon: "🤝" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#1a1f1b]/95 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform">{stat.icon}</div>
               <h3 className="text-gray-500 font-[800] text-[10px] uppercase tracking-[2px] mb-2">{stat.label}</h3>
               <p className="text-[32px] font-[900] text-white tracking-tight">{stat.value}</p>
               <div className="h-1 w-12 bg-[#2fa84f] rounded-full mt-4 group-hover:w-full transition-all duration-500"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ── PENGGUNA TERBARU ── */}
          <div className="bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-[18px] font-[800] text-white">Pengguna Terbaru</h3>
              <span className="bg-[#2fa84f]/10 text-[#2fa84f] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Live Sync</span>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center p-10 text-[#2fa84f] font-bold animate-pulse">Menghubungkan Database...</div>
                ) : (
                  users.slice(0, 6).map((user: any) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.03] rounded-[24px] border border-transparent hover:border-white/5 transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#2fa84f]/20 to-transparent rounded-2xl flex items-center justify-center border border-[#2fa84f]/20 text-xl">
                        👤
                      </div>
                      <div className="flex-grow">
                        <p className="font-[800] text-white text-[15px]">{user.username}</p>
                        <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-[900] px-3 py-1 rounded-lg uppercase tracking-wider ${
                          user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 
                          user.role === 'SELLER' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#2fa84f]/20 text-[#2fa84f]'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── PRODUK TERBARU ── */}
          <div className="bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5">
              <h3 className="text-[18px] font-[800] text-white">Produk Terbaru</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/[0.03] rounded-[24px] border border-transparent hover:border-white/5 transition-all">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                       <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-[800] text-white text-[15px]">Sampel Produk {i+1}</p>
                      <p className="text-[#2fa84f] font-[800] text-sm">Rp 100.000</p>
                    </div>
                    <div className="opacity-30">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a110b] pt-12 pb-8 px-8 text-white relative z-10 border-t border-white/5 text-center mt-auto">
         <p className="text-white/20 text-[10px] font-bold tracking-[3px] uppercase">© 2026 GREENMARKET ADM HUB</p>
      </footer>
    </div>
  );
}