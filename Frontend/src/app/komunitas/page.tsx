"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ForumPage() {
  const pathname = usePathname();
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);
  
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Siti Rahma",
      avatar: "https://ui-avatars.com/api/?name=Siti+Rahma&background=f1c40f&color=1a2e1f",
      time: "1 jam yang lalu",
      group: "#DIY_Recycle",
      content: "Wah keren banget kursi dari ban bekas! Aku juga mau coba bikin. Ada tutorialnya nggak? 🌱",
      image: null,
      likes: 45,
      comments: 12,
      shares: 5,
      isLiked: false,
    },
    {
      id: 2,
      user: "Budi Santoso",
      avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=3498db&color=fff",
      time: "2 jam yang lalu",
      group: null,
      content: "Tips membawa tote bag membantu! Aku sudah terbiasa bawa kantong belanja sendiri sejak tahun lalu.",
      image: null,
      likes: 89,
      comments: 23,
      shares: 12,
      isLiked: false,
    },
    {
      id: 3,
      user: "Ardian Maulana",
      avatar: "https://ui-avatars.com/api/?name=Ardian+Maulana&background=2fa84f&color=fff",
      time: "2 jam yang lalu",
      group: "#DIY_Recycle",
      content: "Baru saja menyelesaikan proyek kursi dari ban bekas. Sangat kokoh dan nyaman untuk taman belakang! Ada yang mau tutorialnya? 🌱♻️",
      image: "https://images.unsplash.com/photo-1610990381327-0e3d9e1f8c1a?w=500&h=300&fit=crop",
      likes: 124,
      comments: 18,
      shares: 24,
      isLiked: false,
    },
    {
      id: 4,
      user: "Dewi Lestari",
      avatar: "https://ui-avatars.com/api/?name=Dewi+Lestari&background=e67e22&color=fff",
      time: "3 jam yang lalu",
      group: "#KebunOrganik",
      content: "Hasil panen sayur hidroponik pertama saya! Lumayan untuk kebutuhan sehari-hari. Siapa mau belajar bareng? 🌿🥬",
      image: "https://images.unsplash.com/photo-1585685521112-5c2c5b7a408d?w=500&h=300&fit=crop",
      likes: 67,
      comments: 15,
      shares: 8,
      isLiked: false,
    },
    {
      id: 5,
      user: "Rina Anggraeni",
      avatar: "https://ui-avatars.com/api/?name=Rina+Anggraeni&background=9b59b6&color=fff",
      time: "4 jam yang lalu",
      group: "#ZeroWasteIndo",
      content: "Aku punya tips nih! Gunakan botol minum stainless steel, lebih awet dan nggak bau plastik 💚",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=300&fit=crop",
      likes: 52,
      comments: 9,
      shares: 6,
      isLiked: false,
    },
    {
      id: 6,
      user: "Cahyo Wiguna",
      avatar: "https://ui-avatars.com/api/?name=Cahyo+Wiguna&background=e74c3c&color=fff",
      time: "5 jam yang lalu",
      group: null,
      content: "Halo teman teman, rekomendasiin aku cara membuat daur ulang dari kardus bekas dong 🙏",
      image: "https://images.unsplash.com/photo-1585685521112-5c2c5b7a408d?w=500&h=300&fit=crop",
      likes: 60,
      comments: 34,
      shares: 10,
      isLiked: false,
    },
  ]);

  const menuItems = [
    { name: "🏠 Beranda", href: "/forum" },
    { name: "🧭 Eksplorasi", href: "/forum/eksplorasi" },
    { name: "🔖 Tersimpan", href: "/forum/tersimpan" },
  ];

  const groups = [
    { name: "# DIY_Recycle", href: "/forum/grup/diy-recycle" },
    { name: "# ZeroWasteIndo", href: "/forum/grup/zero-waste" },
    { name: "# KebunOrganik", href: "/forum/grup/kebun-organik" },
  ];

  const trends = [
    { tag: "#ZeroWasteWeek", count: "1.2k Postingan" },
    { tag: "#OlahanSampah", count: "850 Postingan" },
    { tag: "#E-WasteSolution", count: "530 Postingan" },
  ];

  const handleLike = (id) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
      const previewUrl = URL.createObjectURL(file);
      setPostImagePreview(previewUrl);
    }
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      const newPost = {
        id: Date.now(),
        user: "Ardian Maulana",
        avatar: "https://ui-avatars.com/api/?name=Ardian+Maulana&background=2fa84f&color=fff",
        time: "Baru saja",
        group: null,
        content: postContent,
        image: postImagePreview,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
      };
      setPosts([newPost, ...posts]);
      setPostContent("");
      setPostImage(null);
      setPostImagePreview(null);
      setShowPostForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f8e9] font-sans flex flex-col">
      {/* NAVBAR */}
      <nav id="navbar" className="fixed top-0 w-full z-[100] bg-white border-b border-[#e0e6e2] shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/beranda-dashboard" className="text-[#2fa84f] text-2xl font-[800] no-underline">
            GreenMarket
          </Link>
          <div className="flex items-center gap-6">
            <button className="text-xl text-[#6b7c71] hover:text-[#2fa84f] transition">🔍</button>
            <button className="text-xl text-[#6b7c71] hover:text-[#2fa84f] transition">🔔</button>
            <Link href="/profile" className="text-xl text-[#6b7c71] hover:text-[#2fa84f] transition">👤</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto pt-24 px-4 lg:px-10 pb-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SIDEBAR KIRI */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef] sticky top-24">
              <h5 className="font-extrabold text-[#1a2e1f] mb-6 text-lg">GCommunity</h5>
              <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition no-underline ${
                      pathname === item.href
                        ? "bg-[#f1f8e9] text-[#2fa84f] font-bold"
                        : "text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] font-medium"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className="my-4 border-[#eef2ef]" />
                <p className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider mb-2 ml-3">
                  Grup Anda
                </p>
                {groups.map((group) => (
                  <Link
                    key={group.href}
                    href={group.href}
                    className="flex items-center gap-3 p-3 rounded-xl text-[#6b7c71] hover:text-[#2fa84f] transition text-sm no-underline"
                  >
                    {group.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN FEED - FORUM */}
          <main className="lg:col-span-6 space-y-6">
            {/* BUAT POSTINGAN (hanya Ardian Maulana) */}
            <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="https://ui-avatars.com/api/?name=Ardian+Maulana&background=2fa84f&color=fff" 
                  className="w-10 h-10 rounded-full" 
                  alt="Ardian Maulana"
                />
                <span className="font-bold text-[#1a2e1f] text-sm">Ardian Maulana</span>
              </div>
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="w-full text-left bg-[#f8faf9] border border-[#e0e6e2] rounded-full px-5 py-3 text-sm text-[#6b7c71] hover:border-[#2fa84f] transition-all"
              >
                Apa yang sedang kamu pikirkan, Ardian?
              </button>
            </div>

            {/* FORM BUAT POSTINGAN */}
            {showPostForm && (
              <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://ui-avatars.com/api/?name=Ardian+Maulana&background=2fa84f&color=fff" 
                    className="w-10 h-10 rounded-full" 
                    alt="Ardian Maulana"
                  />
                  <span className="font-bold text-[#1a2e1f]">Ardian Maulana</span>
                </div>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Apa yang sedang kamu pikirkan, Ardian?"
                  className="w-full bg-[#f8faf9] border border-[#e0e6e2] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2fa84f] transition-all resize-none min-h-[100px]"
                />
                
                {/* Preview Gambar */}
                {postImagePreview && (
                  <div className="mt-3 relative">
                    <img src={postImagePreview} className="w-full h-40 object-cover rounded-xl" alt="Preview" />
                    <button
                      onClick={() => {
                        setPostImage(null);
                        setPostImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-black/70"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Tambahkan Foto/Video */}
                <div className="mt-3 flex items-center gap-3">
                  <label className="flex items-center gap-2 text-[#6b7c71] text-sm cursor-pointer hover:text-[#2fa84f] transition">
                    <span>📷</span>
                    <span>Tambahkan Foto/Video</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {postImagePreview && (
                    <span className="text-[11px] text-[#2fa84f]">1 file terpilih</span>
                  )}
                </div>

                <div className="flex justify-end mt-4 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPostForm(false);
                      setPostContent("");
                      setPostImage(null);
                      setPostImagePreview(null);
                    }}
                    className="px-6 py-2 rounded-full font-bold text-sm border border-[#e0e6e2] text-[#6b7c71] hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitPost}
                    className="bg-[#2fa84f] text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#268c41] transition shadow-sm active:scale-95"
                  >
                    Kirim
                  </button>
                </div>
              </div>
            )}

            {/* LIST POSTINGAN */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-[24px] p-6 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
                {/* Header Post */}
                <div className="flex items-center gap-3 mb-4">
                  <img src={post.avatar} className="w-11 h-11 rounded-full border-2 border-[#f1f8e9]" alt={post.user} />
                  <div>
                    <p className="font-bold text-[#1a2e1f] text-[15px]">{post.user}</p>
                    <span className="text-[11px] text-[#6b7c71]">
                      {post.time} {post.group && <>dalam <span className="font-bold text-[#2fa84f]">{post.group}</span></>}
                    </span>
                  </div>
                </div>

                {/* Konten Post */}
                <div className="text-[15px] text-[#1a2e1f] leading-relaxed mb-4">
                  {post.content}
                </div>

                {/* Image Post */}
                {post.image && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img src={post.image} className="w-full rounded-xl object-cover max-h-80" alt="Post" />
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="flex items-center gap-2 border-t border-[#f8faf9] pt-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition ${
                      post.isLiked 
                        ? "bg-[#f1f8e9] text-[#2fa84f]" 
                        : "bg-[#f8faf9] text-[#6b7c71] hover:bg-[#f1f8e9] hover:text-[#2fa84f]"
                    }`}
                  >
                    {post.isLiked ? "❤️" : "🤍"} <span>{post.likes} Menyukai</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8faf9] text-[13px] font-bold text-[#6b7c71] hover:bg-[#f1f8e9] hover:text-[#2fa84f] transition">
                    💬 <span>{post.comments} Komentar</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8faf9] text-[13px] font-bold text-[#6b7c71] hover:bg-[#f1f8e9] hover:text-[#2fa84f] transition ml-auto">
                    🔗 <span>Bagikan</span>
                  </button>
                </div>
              </div>
            ))}
          </main>

          {/* SIDEBAR KANAN */}
          <aside className="lg:col-span-3">
            <div className="bg-[#1a2e1f] rounded-[24px] p-6 shadow-lg text-white sticky top-24">
              <h6 className="font-extrabold mb-6 flex items-center gap-2">
                🔥 Sedang Tren
              </h6>
              <div className="space-y-5">
                {trends.map((trend) => (
                  <Link key={trend.tag} href="#" className="block group no-underline">
                    <p className="text-[14px] font-bold text-white group-hover:text-[#2fa84f] transition mb-1">
                      {trend.tag}
                    </p>
                    <p className="text-[11px] text-white/60 font-bold">
                      {trend.count}
                    </p>
                  </Link>
                ))}
              </div>
              <hr className="my-6 border-white/10" />
              <p className="text-[12px] text-white/70 leading-relaxed text-center italic">
                "Ayo bergabung dengan diskusi dan bantu selamatkan bumi kita!"
              </p>
              {/* Copyright di dalam sidebar kanan (ikut scroll) */}
              <p className="mt-6 text-center text-[10px] text-white/40 font-bold">
                © 2026 GREENMARKET COMMUNITY
              </p>
            </div>
          </aside>

        </div>
      </div>

      {/* FOOTER BESAR */}
      <footer className="bg-white border-t border-[#e0e6e2] pt-20 pb-10 px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
            <div className="lg:col-span-1">
              <div className="text-[#2fa84f] text-2xl font-[800] mb-5">GreenMarket</div>
              <p className="text-[#6b7c71] text-sm leading-relaxed">Solusi ramah lingkungan untuk masa depan. Kami menghubungkan barang berkualitas dengan pemilik baru yang peduli bumi.</p>
            </div>
            <div>
              <h6 className="font-bold mb-6">Tautan</h6>
              <ul className="text-[#6b7c71] text-sm space-y-3 p-0 list-none">
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Marketplace</Link></li>
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Kategori</Link></li>
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Tentang Kami</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold mb-6">Bantuan</h6>
              <ul className="text-[#6b7c71] text-sm space-y-3 p-0 list-none">
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Hubungi Kami</Link></li>
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">Privasi</Link></li>
                <li><Link href="#" className="no-underline text-inherit hover:text-[#2fa84f] transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold mb-6">Berlangganan</h6>
              <div className="flex bg-[#f1f8e9] rounded-xl overflow-hidden mb-4 border border-[#e0e6e2]">
                <input type="email" placeholder="Email Anda" className="bg-transparent px-5 py-3 outline-none flex-grow text-sm" />
                <button className="bg-[#2fa84f] text-white px-5 py-3 hover:bg-[#268c41] transition">🚀</button>
              </div>
              <p className="text-[#6b7c71] text-[11px]">© 2026 GreenMarket. Dibuat dengan penuh rasa cinta untuk bumi.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}