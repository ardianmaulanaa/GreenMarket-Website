"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ForumPage() {
  const pathname = usePathname();
  const [showPostForm, setShowPostForm] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postImagePreview, setPostImagePreview] = useState(null);

  // 1. Sinkronisasi Data User
  const [user, setUser] = useState({ nama: "", role: "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        nama: userData.username || userData.name || "User",
        role: userData.role || ""
      });
    }
  }, []);

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
      isLiked: false,
    },
    {
      id: 3,
      user: "Ardian Maulana",
      avatar: "https://ui-avatars.com/api/?name=Ardian+Maulana&background=2fa84f&color=fff",
      time: "2 jam yang lalu",
      group: "#DIY_Recycle",
      content: "Baru saja menyelesaikan proyek kursi dari ban bekas. Sangat kokoh dan nyaman untuk taman belakang!",
      image: "https://images.unsplash.com/photo-1610990381327-0e3d9e1f8c1a?w=500&h=300&fit=crop",
      likes: 124,
      comments: 18,
      isLiked: false,
    },
  ]);

  const handleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      const newPost = {
        id: Date.now(),
        user: user.nama,
        avatar: `https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff`,
        time: "Baru saja",
        group: null,
        content: postContent,
        image: postImagePreview,
        likes: 0,
        comments: 0,
        isLiked: false,
      };
      setPosts([newPost, ...posts]);
      setPostContent("");
      setPostImagePreview(null);
      setShowPostForm(false);
    }
  };

  return (
    // ── BACKGROUND GRADASI SINKRON ──
    <div className="min-h-screen bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/15 to-[#0a110b] font-sans text-[#1a2e1f] relative overflow-hidden flex flex-col">
      
      {/* Dekorasi Glow Hijau */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#2fa84f] opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] bg-[#2fa84f] opacity-15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── NAVBAR (Luxury Dark Glassmorphism) ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#1a1f1b]/85 backdrop-blur-md border-b border-white/5 shadow-lg py-3 px-8 flex items-center justify-between h-[68px]">
        <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between">
          <Link href="/beranda-dashboard" className="flex items-center gap-2 no-underline group">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_4px_12px_rgba(47,168,79,0.35)] group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z"/>
              </svg>
            </div>
            <span className="text-[18px] font-[800] text-white tracking-[-0.5px]">GreenMarket</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="w-[42px] h-[42px] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#2fa84f] transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </Link>
            <Link href="/profile" className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center text-white shadow-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto pt-28 px-4 lg:px-10 pb-10 flex-1 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR KIRI (Luxury Dark Sidebar) */}
          <aside className="lg:col-span-3">
            <div className="bg-[#1a1f1b]/95 backdrop-blur-xl rounded-[32px] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/5 sticky top-28 text-white">
              <h5 className="font-[800] mb-6 text-lg tracking-tight flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2fa84f" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                GCommunity
              </h5>
              <nav className="flex flex-col gap-1.5">
                <Link href="/komunitas" className="flex items-center gap-3 p-3.5 rounded-xl bg-[#2fa84f] text-white font-bold transition no-underline">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                   <span className="text-[13px]">Beranda Forum</span>
                </Link>
                <div className="my-4 border-t border-white/5" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-3">Grup Populer</p>
                {["#DIY_Recycle", "#ZeroWasteIndo", "#KebunOrganik"].map((group) => (
                  <Link key={group} href="#" className="flex items-center gap-3 p-3.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition text-[13px] no-underline font-medium">
                    {group}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN FEED */}
          <main className="lg:col-span-6 space-y-6">
            {/* INPUT POSTINGAN */}
            <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#eef2ef]">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.nama.replace(" ", "+")}&background=2fa84f&color=fff`} 
                  className="w-11 h-11 rounded-full border-2 border-[#f1f8e9]" 
                  alt="User"
                />
                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="flex-1 text-left bg-[#f8faf9] border border-[#e0e6e2] rounded-2xl px-5 py-3.5 text-[14px] text-[#6b7c71] hover:border-[#2fa84f] transition-all"
                >
                  Bagikan ide hijaumu, {user.nama.split(" ")[0]}...
                </button>
              </div>

              {showPostForm && (
                <div className="mt-6 pt-6 border-t border-[#f1f8e9] animate-in fade-in slide-in-from-top-4 duration-300">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Tulis sesuatu yang bermanfaat untuk bumi..."
                    className="w-full bg-[#fcfdfc] border border-[#e0e6e2] rounded-2xl px-4 py-4 text-[15px] outline-none focus:border-[#2fa84f] transition-all resize-none min-h-[140px]"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <button className="flex items-center gap-2 text-[#6b7c71] text-[13px] font-bold hover:text-[#2fa84f] transition-colors">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                       Lampirkan Foto
                    </button>
                    <div className="flex gap-3">
                        <button onClick={() => setShowPostForm(false)} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-[#6b7c71] hover:bg-gray-50 transition">Batal</button>
                        <button onClick={handleSubmitPost} className="bg-[#2fa84f] text-white px-7 py-2.5 rounded-xl font-[800] text-[13px] shadow-[0_10px_20px_rgba(47,168,79,0.2)] hover:bg-[#268c41] transition-all">Kirim Postingan</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LIST FEED */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-[32px] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#eef2ef] transition-all hover:border-[#2fa84f]/20">
                <div className="flex items-center gap-4 mb-5">
                  <img src={post.avatar} className="w-11 h-11 rounded-full border-2 border-[#f1f8e9]" alt="Avatar" />
                  <div>
                    <p className="font-[800] text-[#1a2e1f] text-[15px] m-0">{post.user}</p>
                    <span className="text-[11px] text-[#6b7c71] font-bold uppercase tracking-wide">{post.time} • <span className="text-[#2fa84f]">{post.group}</span></span>
                  </div>
                </div>
                <div className="text-[15px] leading-relaxed mb-5 text-[#1a2e1f]">{post.content}</div>
                {post.image && <img src={post.image} className="w-full rounded-[24px] object-cover max-h-[400px] mb-5 shadow-sm" alt="Post" />}
                
                <div className="flex items-center gap-4 pt-5 border-t border-[#fcfdfc]">
                  <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-[800] transition-all ${post.isLiked ? "bg-[#f1f8e9] text-[#2fa84f]" : "bg-[#f8faf9] text-[#6b7c71] hover:bg-[#f1f8e9]"}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f8faf9] text-[13px] font-[800] text-[#6b7c71] hover:bg-[#f1f8e9] transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {post.comments}
                  </button>
                </div>
              </div>
            ))}
          </main>

          {/* SIDEBAR KANAN (Trending) */}
          <aside className="lg:col-span-3">
            <div className="bg-[#1a1f1b] rounded-[32px] p-8 shadow-xl text-white border border-white/5 sticky top-28 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#2fa84f]/10 rounded-full blur-3xl"></div>
              <h6 className="font-[800] mb-8 flex items-center gap-3 text-sm tracking-[2px] text-[#2fa84f] uppercase">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Trending
              </h6>
              <div className="space-y-7 relative z-10">
                {[
                  { tag: "#ZeroWasteWeek", count: "1.2k Postingan" },
                  { tag: "#OlahanSampah", count: "850 Postingan" },
                  { tag: "#GreenLifestyle", count: "420 Postingan" }
                ].map((trend) => (
                  <div key={trend.tag} className="group cursor-pointer">
                    <p className="text-[14px] font-bold text-white mb-1 group-hover:text-[#2fa84f] transition-colors">{trend.tag}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{trend.count}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase tracking-widest">© 2026 GREENMARKET</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}