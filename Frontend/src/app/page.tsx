"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Definisi tipe data untuk props InfoCard agar TypeScript aman
interface InfoCardProps {
  icon: string;
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
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-700 py-5 ${
          scrolled
            ? "bg-white py-[15px] shadow-[0_4px_25px_rgba(30,80,40,0.05)] border-b border-[#e0e6e2]"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-10 flex justify-between items-center">
          <Link href="/" className="text-[#2fa84f] text-2xl font-[800] no-underline">
            GreenMarket
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-[#1a2e1f] font-bold text-[15px] no-underline hover:text-[#2fa84f] transition">Jelajahi</Link>
            <Link href="#" className="text-[#1a2e1f] font-bold text-[15px] no-underline hover:text-[#2fa84f] transition">Tentang</Link>
            <Link href="#" className="text-[#1a2e1f] font-bold text-[15px] no-underline hover:text-[#2fa84f] transition">Kontak</Link>
            <Link href="/login" className="text-[#1a2e1f] font-bold text-[15px] no-underline hover:text-[#2fa84f] transition">Masuk</Link>
            <span className="text-[#e0e6e2]">|</span>
            <Link
              href="/register"
              className="bg-[#2fa84f] text-white px-[25px] py-2 rounded-[12px] font-bold no-underline hover:bg-[#268c41] transition"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section 
        className="h-screen flex items-center bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(241, 248, 233, 0.8), rgba(241, 248, 233, 0.8)), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop')`
        }}
      >
        <div className="container mx-auto px-10">
          <div className="max-w-[700px]">
            <h1 className="text-[64px] font-[800] leading-[1.1] text-[#1a2e1f] mb-5">
              Barang tak terpakai? <br /> Saatnya ubah jadi peluang emas.
            </h1>
            <p className="text-lg text-[#6b7c71] mb-[35px]">
              Mulai langkah kecil untuk bumi dengan mendaur ulang barang tak terpakai Anda menjadi sesuatu yang bernilai tinggi.
            </p>
            <Link
              href="/berandaDashboard"
              className="bg-[#2fa84f] text-white px-[35px] py-[15px] rounded-[14px] font-bold no-underline inline-block hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(47,168,79,0.3)] hover:bg-[#268c41] transition-all duration-300"
            >
              Jelajahi Marketplace →
            </Link>
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section className="py-[100px] px-[5%] bg-white text-center">
        <span className="bg-[#f1f8e9] text-[#2fa84f] px-4 py-2 rounded-full font-bold text-xs uppercase">
          Kategori Pilihan
        </span>
        <h2 className="text-[36px] font-[800] mt-[15px] mb-[50px]">Telusuri berdasarkan kebutuhan</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {[
            { name: "Elektronik", icon: "💻" },
            { name: "Fashion", icon: "👜" },
            { name: "DIY", icon: "🛠️" },
            { name: "Sepeda", icon: "🚲" },
            { name: "Aksesoris", icon: "⌚" },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-[#fcfdfc] border border-[#eef2ef] p-10 rounded-[24px] text-center cursor-pointer transition-all duration-300 hover:bg-white hover:border-[#2fa84f] hover:-translate-y-[10px] hover:shadow-[0_15px_35px_rgba(30,80,40,0.05)]"
            >
              <div className="text-[40px] mb-4">{item.icon}</div>
              <h5 className="font-bold">{item.name}</h5>
            </div>
          ))}
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="py-20 px-[5%]">
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <InfoCard 
            icon="♻️" 
            badge="GreenJualan" 
            title="Ubah barang lama Anda jadi berkah." 
            desc="Daftarkan barang tak terpakai Anda dalam hitungan menit dan temukan pembeli yang peduli lingkungan."
          />
          <InfoCard 
            icon="👥" 
            badge="GCommunity" 
            title="Komunitas peduli masa depan." 
            desc="Diskusikan ide-ide berkelanjutan dan temukan tips mendaur ulang dari jutaan pengguna kami."
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-[100px] px-[5%]">
        <div className="bg-[#1a2e1f] p-20 rounded-[40px] text-center">
          <h2 className="text-white text-[42px] font-[800]">Daftar sekarang untuk membantu mencintai bumi</h2>
          <p className="text-white/70 my-8 text-lg">Mulai perjalanan konsumsi berkelanjutan Anda hari ini. Ribuan produk menunggu Anda.</p>
          <Link href="/register" className="bg-[#2fa84f] text-white px-10 py-4 rounded-[14px] font-bold no-underline inline-block hover:shadow-lg transition">
            Mulai Sekarang Secara Gratis →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-20 px-[5%] border-t border-[#e0e6e2]">
        <div className="container mx-auto grid lg:grid-cols-4 gap-12 text-left">
          <div className="lg:col-span-1">
            <div className="text-[#2fa84f] text-2xl font-[800] mb-5">GreenMarket</div>
            <p className="text-[#6b7c71] text-sm leading-relaxed">Solusi ramah lingkungan untuk masa depan. Kami menghubungkan barang berkualitas dengan pemilik baru yang peduli bumi.</p>
          </div>
          <div>
            <h6 className="font-bold mb-6">Tautan</h6>
            <ul className="text-[#6b7c71] text-sm space-y-3 p-0 list-none">
              <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f]">Marketplace</Link></li>
              <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f]">Kategori</Link></li>
              <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f]">Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-6">Dukungan</h6>
            <ul className="text-[#6b7c71] text-sm space-y-3 p-0 list-none">
              <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f]">Hubungi Kami</Link></li>
              <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f]">Privasi</Link></li>
              <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f]">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold mb-6">Berlangganan</h6>
            <div className="flex bg-[#f1f8e9] rounded-xl overflow-hidden mb-4">
              <input type="email" placeholder="Email Anda" className="bg-transparent px-5 py-3 outline-none flex-grow" />
              <button className="bg-[#2fa84f] text-white px-5 py-3 hover:bg-[#268c41] transition">🚀</button>
            </div>
            <p className="text-[#6b7c71] text-xs">© 2026 GreenMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ icon, badge, title, desc }: InfoCardProps) {
  return (
    <div className="bg-white p-12 rounded-[32px] shadow-[0_10px_40px_rgba(30,80,40,0.04)] h-full text-left">
      <div className="w-[60px] h-[60px] bg-[#f1f8e9] text-[#2fa84f] rounded-[16px] flex items-center justify-center text-2xl mb-6">
        {icon}
      </div>
      <h5 className="text-[#2fa84f] font-bold text-sm uppercase">{badge}</h5>
      <h2 className="text-[28px] font-[800] my-4 leading-tight">{title}</h2>
      <p className="text-[#6b7c71] leading-relaxed mb-[30px]">{desc}</p>
      <Link href="#" className="text-[#2fa84f] font-bold no-underline hover:text-[#268c41] group transition">
        Gabung Sekarang <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}