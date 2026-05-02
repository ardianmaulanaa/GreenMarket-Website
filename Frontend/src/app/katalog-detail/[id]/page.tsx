"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface ProdukDetail {
  id_detail: string;
  konten_deskripsi: string;
  catatan_penjual?: string | null;
}

interface Produk {
  id_produk: string;
  nama_produk: string;
  harga: number;
  stok: number;
  deskripsi: string;
  detail?: ProdukDetail;
  fotos: { url_foto: string; }[];
  kategori?: { nama_kategori: string; };
  seller?: {
    username: string;
    email: string;
  };
}

export default function DetailProdukPage() {
  const router = useRouter();

  const params = useParams();
  const productId = params?.id;

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [user, setUser] = useState({ nama: "", role: "" });

  const [product, setProduct] = useState<Produk | null>(null);
  
  // State interaktif halaman detail
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Data Dummy Produk (Bisa diganti dari fetch API nanti)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        nama: userData.username || userData.name || "User",
        role: userData.role || "BUYER"
      });
    }

    const fetchProductDetail = async () => {
      // Kalau ID belum dapet dari URL, stop loading.
      if (!productId) {
        setIsPageLoading(false);
        return;
      }

      try {
        // Nembak ke backend kamu sesuai ID yang diklik!
        const response = await fetch(`http://localhost:5050/api/products/${productId}`);
        if (!response.ok) throw new Error("Gagal mengambil detail produk");

        // Kalau sukses, masukkan datanya ke state 'product'
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error Fetching Product:", error);
      } finally {
        setIsPageLoading(false); // Matikan loading screen
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleQuantity = (type: 'min' | 'plus') => {
    if (type === 'min' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'plus' && quantity < product.stok) setQuantity(quantity + 1);
  };

  // ── TAMPILAN LOADING SCREEN ──
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Memuat Detail Produk...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans text-white">
        <h2 className="text-2xl font-bold mb-4">Produk Tidak Ditemukan</h2>
        <Link href="/beranda-dashboard" className="text-[#2fa84f] hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden">
      
      {/* ── BACKGROUND DECOR ── */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-20 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#2fa84f] opacity-10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* ── NAVBAR (Konsisten) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/90 backdrop-blur-xl border-b border-white/10 shadow-lg h-[72px] px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight uppercase hidden sm:block">Green<span className="text-[#2fa84f]">Market</span></span>
          </Link>
        </div>

        <div className="flex-1 max-w-xl mx-10 hidden md:block">
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

        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </Link>
          <Link href="/profile" className="flex items-center gap-3 pl-2 group no-underline border-l border-white/10 ml-2">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white m-0 group-hover:text-[#2fa84f] transition-colors">{user.nama || "User"}</p>
                  <p className="text-[10px] text-[#2fa84f] m-0 font-black uppercase">{user.role}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2fa84f] to-[#1a7a35] p-[2px]">
                 <div className="w-full h-full rounded-full bg-[#0a110b] flex items-center justify-center text-white font-bold uppercase">
                    {user.nama ? user.nama.charAt(0) : "U"}
                 </div>
               </div>
          </Link>
        </div>
      </nav>

      {/* ── KONTEN UTAMA ── */}
      <main className="flex-grow container max-w-[1200px] mx-auto pt-28 px-6 pb-20 relative z-10 w-full">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-6">
          <Link href="/beranda-dashboard" className="hover:text-[#2fa84f] transition-colors">GreenMarket</Link>
          <span>/</span>
          <span className="hover:text-[#2fa84f] transition-colors cursor-pointer">{product.kategori?.nama_kategori}</span>
          <span>/</span>
          <span className="text-[#2fa84f] truncate max-w-[200px] sm:max-w-none">{product.nama_produk}</span>
        </div>

        {/* ── BAGIAN 1: INFO PRODUK UTAMA ── */}
        <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 lg:p-10 border border-white/5 shadow-2xl mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Kiri: Galeri Gambar */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Gambar Utama */}
              <div className="w-full aspect-square bg-[#0a110b] rounded-[24px] overflow-hidden border border-white/10 relative shadow-inner group cursor-crosshair">
                <Image 
                  src={product.fotos[activeImage]?.url_foto || "https://via.placeholder.com/1000"} 
                  alt={product.nama_produk} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
              </div>
              
              {/* Thumbnail Gambar */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {product.fotos.map((foto, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? "border-[#2fa84f] shadow-[0_0_15px_rgba(47,168,79,0.3)]" : "border-white/10 hover:border-[#2fa84f]/50"
                    }`}
                  >
                    <Image src={foto.url_foto || "https://via.placeholder.com/1000"} alt={`Thumb ${idx}`} fill className="object-cover opacity-80" />
                  </button>
                ))}
              </div>

              {/* Action Buttons: Cuma Favorite */}
              
            </div>

            {/* Kanan: Detail & Aksi Beli */}
            <div className="lg:col-span-7 flex flex-col">
              <h1 className="text-2xl sm:text-[28px] font-[800] text-white tracking-tight leading-tight mb-3">
                {product.nama_produk}
              </h1>
              
              <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mb-6">
                <div className="flex items-center gap-1 text-[#2fa84f] border-b border-[#2fa84f] pb-0.5">
                  <span className="text-lg text-white">4.8</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <div>
                  <span className="text-white text-base">Terverifikasi</span> Sistem
                </div>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <div>
                  <span className="text-white text-base">1400</span> Terjual
                </div>
              </div>

              {/* Box Harga */}
              <div className="bg-[#1a1f1b]/50 border border-white/5 rounded-[24px] p-6 mb-8 shadow-inner">
                <div className="flex items-end gap-3">
                  <span className="text-3xl sm:text-[40px] font-black text-[#2fa84f] tracking-tighter">
                    Rp {product.harga.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Info Pengiriman */}
              <div className="grid grid-cols-[120px_1fr] gap-4 mb-8 text-sm font-bold">
                <span className="text-gray-500 uppercase tracking-widest text-[11px] mt-1">Pengiriman</span>
                <div className="flex flex-col gap-2">
                   <div className="flex items-start gap-2 text-white">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2.5" className="mt-0.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                     <div>
                        <span>Pengiriman Ramah Lingkungan</span>
                        <p className="text-gray-400 text-xs mt-1 font-medium leading-relaxed">Emisi karbon dari pengiriman ini dikompensasi oleh GreenMarket.</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Kuantitas */}
              <div className="grid grid-cols-[120px_1fr] gap-4 items-center mb-10">
                <span className="text-gray-500 uppercase tracking-widest text-[11px] font-bold">Kuantitas</span>
                <div className="flex items-center gap-5">
                  <div className="flex items-center border border-white/20 rounded-xl overflow-hidden bg-white/5">
                    <button onClick={() => handleQuantity('min')} className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors border-r border-white/10">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <div className="w-14 h-10 flex items-center justify-center text-white font-bold text-sm bg-[#1a1f1b]">
                      {quantity}
                    </div>
                    <button onClick={() => handleQuantity('plus')} className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors border-l border-white/10">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-400">Tersisa {product.stok} buah</span>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-4 mt-auto">
                <button className="flex-1 lg:flex-none lg:w-[220px] py-4 rounded-2xl font-[800] text-sm text-[#2fa84f] bg-[#2fa84f]/10 border border-[#2fa84f]/30 hover:bg-[#2fa84f]/20 transition-all flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                  Masukkan Keranjang
                </button>
                <button className="flex-1 py-4 rounded-2xl font-[800] text-sm text-white bg-[#2fa84f] hover:bg-[#268c41] transition-all shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:-translate-y-1">
                  Beli Sekarang
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ── BAGIAN 2: INFO TOKO PENJUAL (Sederhana) ── */}
        <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-6 lg:p-8 border border-white/5 shadow-2xl mb-8 flex flex-col md:flex-row items-center gap-8">
           
           <div className="flex items-center gap-5 w-full shrink-0">
             <div className="w-20 h-20 rounded-full border-[3px] border-[#2fa84f]/30 p-1 relative">
                <div className="w-full h-full bg-[#0a110b] rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-2xl font-black text-white">
                  {(product.seller?.username || "TO").substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#2fa84f] border-2 border-[#1a1f1b] rounded-full"></div>
             </div>
             <div className="flex-1 flex justify-between items-center pr-4">
               <div>
                 <h3 className="text-lg font-[800] text-white mb-1 tracking-tight">{product.seller?.username || "Toko Hijau"}</h3>
                 <p className="text-[11px] text-[#2fa84f] font-bold uppercase tracking-widest">Toko Terverifikasi</p>
               </div>
               <div className="text-right">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Bergabung</span>
                  <span className="font-black text-white text-sm">Baru Saja</span>
               </div>
             </div>
           </div>

        </div>

        {/* ── BAGIAN 3: DESKRIPSI PRODUK ── */}
        <div className="bg-[#1a1f1b]/80 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 border border-white/5 shadow-2xl">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#2fa84f] rounded-full shadow-[0_0_8px_#2fa84f]"></div>
             <h2 className="text-xl font-[800] text-white m-0 tracking-tight uppercase">Spesifikasi & Deskripsi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 mb-8 text-sm font-bold">
            <span className="text-gray-500 uppercase tracking-widest text-[11px]">Kategori</span>
            <span className="text-[#2fa84f]">{product.kategori?.nama_kategori || "Umum"}</span>
            
            <span className="text-gray-500 uppercase tracking-widest text-[11px]">Stok Tersedia</span>
            <span className="text-white">{product.stok}</span>
            
            <span className="text-gray-500 uppercase tracking-widest text-[11px]">Dikirim Dari</span>
            <span className="text-white">KOTA JAKARTA SELATAN</span>
          </div>

          <div className="w-full h-[1px] bg-white/5 mb-8"></div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 font-medium leading-relaxed text-sm whitespace-pre-line">
              {product.detail?.konten_deskripsi || product.deskripsi || "Deskripsi produk tidak tersedia."}
            </p>
          </div>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-transparent py-8 text-center border-t border-[#1a2e1f]/10 mt-auto relative z-10">
         <p className="text-[#1a2e1f]/50 text-[10px] font-black tracking-[4px] uppercase m-0">
            © 2026 GREENMARKET. ALL SELLER & BUYER CATALOG.
         </p>
      </footer>
    </div>
  );
}