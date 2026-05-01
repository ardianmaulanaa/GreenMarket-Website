"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface InfoCardProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  desc: string;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-[#f1f8e9] text-[#1a2e1f] font-sans overflow-x-hidden">
      
      {/* ── NAVBAR (Glassmorphism Sinkron) ── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 h-[72px] flex items-center ${
          scrolled
            ? "bg-[#1a1f1b]/80 backdrop-blur-md shadow-lg border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-10 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_4px_12px_rgba(47,168,79,0.35)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/>
              </svg>
            </div>
            <span className={`text-[20px] font-[800] tracking-[-0.5px] transition-colors ${scrolled ? "text-white" : "text-[#1a2e1f]"}`}>
              GreenMarket
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <div className={`hidden md:flex items-center space-x-6 font-bold text-[14px] ${scrolled ? "text-white/70" : "text-[#1a2e1f]"}`}>
              <Link href="/beranda-dashboard" className="hover:text-[#2fa84f] transition no-underline">Jelajahi</Link>
              <Link href="/komunitas" className="hover:text-[#2fa84f] transition no-underline">Komunitas</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className={`font-bold text-[14px] no-underline hover:text-[#2fa84f] transition ${scrolled ? "text-white" : "text-[#1a2e1f]"}`}>Masuk</Link>
              <Link
                href="/register"
                className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold no-underline hover:bg-secondary transition shadow-lg shadow-[#2fa84f]/20"
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION (Overlay Gradasi ke Gelap) ── */}
      <section 
        className="h-screen flex items-center bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(241, 248, 233, 0.9), rgba(10, 17, 11, 0.6)), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop')`
        }}
      >
        <div className="container mx-auto px-10">
          <div className="max-w-[750px]">
            <h1 className="text-[68px] font-[800] leading-[1.05] text-[#1a2e1f] mb-6 tracking-tight">
              Barang lama, <br /> <span className="text-[#2fa84f]">cerita baru.</span>
            </h1>
            <p className="text-xl text-[#6b7c71] mb-10 leading-relaxed max-w-[600px]">
              Bantu selamatkan bumi dengan memberikan nafas kedua bagi barang tak terpakai Anda. Marketplace ramah lingkungan nomor satu di Indonesia.
            </p>
            <Link
              href="/beranda-dashboard"
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold no-underline inline-block hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)] hover:bg-secondary transition-all duration-300"
            >
              Mulai Jelajahi Produk
            </Link>
          </div>
        </div>
      </section>

      {/* ── KATEGORI ── */}
      <section className="py-32 px-[5%] bg-white text-center">
        <span className="bg-[#f1f8e9] text-[#2fa84f] px-5 py-2 rounded-xl font-[800] text-[10px] uppercase tracking-widest border border-[#e0e6e2]">
          Kategori Pilihan
        </span>
        <h2 className="text-[40px] font-[800] mt-5 mb-16 tracking-tight">Telusuri Kebutuhan Hijaumu</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Elektronik", svg: <path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12m16 0a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2m16 0V4M4 16v-12M8 20h8M12 17v3"/> },
            { name: "Fashion", svg: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></> },
            { name: "DIY", svg: <><path d="m14.7 6.3 5 5"/><path d="m3.1 20.9 7.4-7.4"/><path d="m16.4 4.6 2.8 2.8a1 1 0 0 1 0 1.4l-6.2 6.2a1 1 0 0 1-1.4 0l-2.8-2.8a1 1 0 0 1 0-1.4l6.2-6.2a1 1 0 0 1 1.4 0Z"/></> },
            { name: "Sepeda", svg: <><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><path d="M15 17.5V11l-3-3 3-3"/><path d="M5.5 17.5 12 11"/></> },
            { name: "Lainnya", svg: <><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></> },
          ].map((item) => (
            <div
              key={item.name}
              className="group bg-[#fcfdfc] border border-[#eef2ef] p-12 rounded-[32px] text-center cursor-pointer transition-all duration-500 hover:bg-[#1a2e1f] hover:text-white hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="w-16 h-16 bg-[#f1f8e9] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2fa84f] transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2fa84f] group-hover:text-white">
                  {item.svg}
                </svg>
              </div>
              <h5 className="font-[800] text-[15px]">{item.name}</h5>
            </div>
          ))}
        </div>
      </section>

      {/* ── INFO SECTION (Mix Hijau-Hitam) ── */}
      <section className="py-24 px-[5%] bg-gradient-to-b from-white to-[#f1f8e9]">
        <div className="grid md:grid-cols-2 gap-10 max-w-7xl mx-auto">
          <InfoCard 
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z"/><path d="M19 2v10"/></svg>} 
            badge="GreenJualan" 
            title="Ubah barang lama Anda jadi berkah." 
            desc="Daftarkan barang tak terpakai Anda dalam hitungan menit dan temukan pembeli yang peduli lingkungan."
          />
          <InfoCard 
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} 
            badge="GCommunity" 
            title="Komunitas peduli masa depan." 
            desc="Diskusikan ide-ide berkelanjutan dan temukan tips mendaur ulang dari jutaan pengguna kami."
          />
        </div>
      </section>

      {/* ── CTA SECTION (Gelap Sinkron Register) ── */}
      <section className="py-20 px-[5%] bg-[#f1f8e9]">
        <div className="bg-[#1a1f1b] p-20 rounded-[48px] text-center relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="white"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z"/></svg>
          </div>
          <h2 className="text-white text-[48px] font-[800] leading-tight tracking-tight">Daftar sekarang untuk <br /> membantu mencintai bumi</h2>
          <p className="text-white/50 my-10 text-xl max-w-2xl mx-auto">Mulai langkah kecil untuk bumi yang lebih baik bersama jutaan pahlawan bumi lainnya.</p>
          <Link href="/register" className="bg-[#2fa84f] text-white px-12 py-4 rounded-2xl font-bold no-underline inline-block hover:scale-105 transition-all shadow-xl shadow-[#2fa84f]/20">
            Mulai Sekarang Gratis
          </Link>
        </div>
      </section>

      {/* ── FOOTER (Gelap Premium) ── */}
      <footer className="bg-[#0a110b] py-24 px-[5%] text-white">
        <div className="container mx-auto grid lg:grid-cols-3 gap-16">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-[30px] h-[30px] rounded-[8px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
                </div>
                <div className="text-white text-xl font-[800]">GreenMarket</div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">Solusi ramah lingkungan untuk masa depan. Kami menghubungkan barang berkualitas dengan pemilik baru yang peduli bumi.</p>
          </div>
          <div className="text-left">
            <h6 className="font-bold text-[#2fa84f] mb-8 text-[14px] uppercase tracking-widest">Newsletter</h6>
            <div className="flex bg-white/5 rounded-xl overflow-hidden mb-5 border border-white/10">
              <input type="email" placeholder="Email Anda" className="bg-transparent px-5 py-3 outline-none flex-grow text-sm text-white" />
              <button className="bg-[#2fa84f] text-white px-5 py-3 hover:bg-[#268c41] transition">🚀</button>
            </div>
            <p className="text-white/30 text-[11px] font-bold tracking-widest">© 2026 GREENMARKET INC.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ icon, badge, title, desc }: InfoCardProps) {
  return (
    <div className="bg-[#1a1f1b] p-14 rounded-[40px] shadow-2xl border border-white/5 h-full transition-all hover:border-[#2fa84f]/40 text-left group">
      <div className="w-[64px] h-[64px] bg-white/5 text-[#2fa84f] rounded-[20px] flex items-center justify-center mb-8 group-hover:bg-[#2fa84f] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h5 className="text-[#2fa84f] font-[800] text-[10px] uppercase tracking-[2px]">{badge}</h5>
      <h2 className="text-[30px] font-[800] my-5 leading-tight tracking-tight text-white">{title}</h2>
      <p className="text-white/50 leading-relaxed mb-8 text-[15px]">{desc}</p>
      <Link href="/login" className="text-[#2fa84f] font-[800] text-[14px] no-underline group flex items-center gap-2 transition hover:text-white">
        Gabung Sekarang <span className="transition-transform group-hover:translate-x-2">→</span>
      </Link>
    </div>
  );
}