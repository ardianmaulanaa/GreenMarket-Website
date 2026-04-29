"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DashboardSellerPage() {
  const [activeTab, setActiveTab] = useState("produk");
  const [showNotifications, setShowNotifications] = useState(false);

  // Data statistik penjual
  const stats = [
    { label: "Total Produk", value: 24, icon: "📦", color: "bg-blue-100", textColor: "text-blue-600" },
    { label: "Total Pesanan", value: 156, icon: "🛍️", color: "bg-green-100", textColor: "text-green-600" },
    { label: "Pendapatan", value: "Rp 12.5jt", icon: "💰", color: "bg-yellow-100", textColor: "text-yellow-600" },
    { label: "Ulasan", value: 89, icon: "⭐", color: "bg-purple-100", textColor: "text-purple-600" },
  ];

  // Data produk dengan gambar
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: "Tempat Pensil Organik", 
      price: 10000, 
      stock: 45, 
      status: "Aktif", 
      image: "https://images.unsplash.com/photo-1585685521112-5c2c5b7a408d?w=200&h=200&fit=crop",
      description: "Tempat pensil dari bahan kardus daur ulang, ramah lingkungan."
    },
    { 
      id: 2, 
      name: "Buku Catatan Linen", 
      price: 45000, 
      stock: 23, 
      status: "Aktif", 
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop",
      description: "Buku catatan dengan sampul linen, kertas daur ulang."
    },
    { 
      id: 3, 
      name: "Sedotan Bambu Set", 
      price: 15000, 
      stock: 78, 
      status: "Aktif", 
      image: "https://images.unsplash.com/photo-1585685521112-5c2c5b7a408d?w=200&h=200&fit=crop",
      description: "Set 6 sedotan bambu alami + sikat pembersih."
    },
    { 
      id: 4, 
      name: "Tote Bag Organik", 
      price: 5000, 
      stock: 12, 
      status: "Habis", 
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop",
      description: "Tote bag dari katun organik, bisa dilipat."
    },
  ]);

  // Data pesanan
  const [orders, setOrders] = useState([
    { id: "INV-001", customer: "Siti Rahma", product: "Tempat Pensil Organik", total: 10000, status: "Diproses", date: "28 Apr 2026" },
    { id: "INV-002", customer: "Budi Santoso", product: "Buku Catatan Linen", total: 45000, status: "Dikirim", date: "27 Apr 2026" },
    { id: "INV-003", customer: "Dewi Lestari", product: "Sedotan Bambu Set", total: 15000, status: "Selesai", date: "26 Apr 2026" },
    { id: "INV-004", customer: "Rina Anggraeni", product: "Tote Bag Organik", total: 5000, status: "Diproses", date: "25 Apr 2026" },
  ]);

  // Notifikasi untuk seller
  const notifications = [
    { id: 1, message: "Pesanan baru dari Siti Rahma", time: "5 menit lalu", read: false },
    { id: 2, message: "Produk 'Tempat Pensil' habis", time: "1 jam lalu", read: false },
    { id: 3, message: "Ulasan baru untuk 'Sedotan Bambu'", time: "3 jam lalu", read: true },
  ];

  // State untuk form tambah/edit produk
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ 
    name: "", 
    price: "", 
    stock: "", 
    status: "Aktif",
    image: "",
    description: ""
  });
  const [imagePreview, setImagePreview] = useState(null);

  // State untuk ubah status pesanan
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const menuItems = [
    { name: "📦 Produk Saya", id: "produk" },
    { name: "📝 Tambah Produk", id: "tambah_produk" },
    { name: "📋 Pesanan Masuk", id: "pesanan" },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProductForm({ ...productForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (productForm.name && productForm.price) {
      const newProduct = {
        id: Date.now(),
        name: productForm.name,
        price: parseInt(productForm.price),
        stock: parseInt(productForm.stock) || 0,
        status: productForm.status,
        image: imagePreview || "https://via.placeholder.com/200?text=No+Image",
        description: productForm.description,
      };
      setProducts([...products, newProduct]);
      resetForm();
      setActiveTab("produk");
    }
  };

  const handleEditProduct = () => {
    if (editingProduct && productForm.name) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...p, 
              name: productForm.name, 
              price: parseInt(productForm.price), 
              stock: parseInt(productForm.stock), 
              status: productForm.status,
              image: imagePreview || p.image,
              description: productForm.description,
            }
          : p
      ));
      resetForm();
      setActiveTab("produk");
    }
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", stock: "", status: "Aktif", image: "", description: "" });
    setImagePreview(null);
  };

  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      setOrders(orders.map(o => 
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      ));
      setSelectedOrder(null);
      setNewStatus("");
      setActiveTab("pesanan");
    }
  };

  const statusOptions = ["Diproses", "Dikirim", "Selesai", "Dibatalkan"];

  const getStatusColor = (status) => {
    switch(status) {
      case "Diproses": return "bg-yellow-100 text-yellow-600";
      case "Dikirim": return "bg-blue-100 text-blue-600";
      case "Selesai": return "bg-green-100 text-green-600";
      case "Dibatalkan": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f1f8e9] font-sans flex flex-col">
      {/* NAVBAR KHUSUS SELLER */}
      <nav id="navbar" className="fixed top-0 w-full z-[100] bg-white border-b border-[#e0e6e2] shadow-sm py-3 px-6">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo dengan badge Seller */}
          <div className="flex items-center gap-3">
            <Link href="/beranda-dashboard" className="text-[#2fa84f] text-2xl font-[800] no-underline">
              GreenMarket
            </Link>
            <div className="bg-[#2fa84f] text-white text-[10px] font-bold px-2 py-1 rounded-full">
              SELLER
            </div>
          </div>
          
          {/* Fitur Khusus Seller di Navbar */}
          <div className="flex items-center gap-6">
            {/* Pendapatan Hari Ini */}
            <div className="hidden md:flex items-center gap-2 bg-[#f1f8e9] px-3 py-1.5 rounded-full">
              <span className="text-[#2fa84f]">💰</span>
              <span className="text-xs font-bold text-[#1a2e1f]">Hari ini: Rp 850.000</span>
            </div>

            {/* Notifikasi dengan dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-[#6b7c71] hover:text-[#2fa84f] transition text-xl flex items-center"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Dropdown Notifikasi */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-[#eef2ef] overflow-hidden z-50">
                  <div className="p-3 bg-[#f1f8e9] border-b border-[#eef2ef]">
                    <h4 className="font-bold text-[#1a2e1f] text-sm">Notifikasi Seller</h4>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-3 border-b border-[#f8faf9] ${!notif.read ? 'bg-[#f1f8e9]/30' : ''}`}>
                        <p className="text-sm text-[#1a2e1f]">{notif.message}</p>
                        <p className="text-[10px] text-[#6b7c71] mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center border-t border-[#eef2ef]">
                    <button className="text-[#2fa84f] text-xs font-medium">Lihat Semua</button>
                  </div>
                </div>
              )}
            </div>

            {/* Ringkasan Pesanan */}
            <Link href="#" className="hidden md:flex items-center gap-2 text-[#6b7c71] hover:text-[#2fa84f] transition">
              <span>📋</span>
              <span className="text-sm font-medium">Pesanan: 4</span>
            </Link>

            {/* Profile Seller */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2fa84f] flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="hidden md:block">
                <div className="font-bold text-sm text-[#1a2e1f]">Ardian Maulana</div>
                <p className="text-[10px] text-[#6b7c71]">⭐ 4.9 ★ Seller</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto pt-24 px-4 lg:px-10 pb-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR SELLER */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-[32px] p-6 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef] sticky top-24">
              <div className="text-center mb-6">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <img 
                    src="https://ui-avatars.com/api/?name=Ardian+Maulana&background=2fa84f&color=fff" 
                    className="w-full h-full rounded-full border-4 border-[#f1f8e9] object-cover" 
                    alt="Avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#2fa84f] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                    🏪
                  </div>
                </div>
                <h6 className="font-extrabold text-[#1a2e1f] text-sm">Ardian Maulana</h6>
                <p className="text-[10px] text-[#6b7c71]">GreenStore Official</p>
                <div className="mt-2 inline-block bg-[#f1f8e9] px-2 py-0.5 rounded-full">
                  <p className="text-[9px] font-bold text-[#2fa84f]">⭐ 4.9 ★ Seller</p>
                </div>
              </div>
              
              <hr className="my-4 border-[#f8faf9]" />

              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      resetForm();
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition w-full text-left text-sm ${
                      activeTab === item.id
                        ? "bg-[#f1f8e9] text-[#2fa84f] font-bold"
                        : "text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] font-medium"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
                <hr className="my-3 border-[#f8faf9]" />
                <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] no-underline font-medium transition text-sm">
                  👤 Beralih ke Pembeli
                </Link>
                <Link href="/login" className="flex items-center gap-3 p-3 rounded-xl text-[#e53e3e] hover:bg-[#fff5f5] no-underline font-bold transition text-sm mt-1">
                  🚪 Keluar
                </Link>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-9">
            {/* STATISTIK CARD */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-5 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color} ${stat.textColor}`}>
                      +12%
                    </span>
                  </div>
                  <p className="text-[#6b7c71] text-xs font-medium">{stat.label}</p>
                  <p className="text-[#1a2e1f] text-2xl font-extrabold mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* PRODUK SAYA - CARD VIEW */}
            {activeTab === "produk" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-[800] text-[#1a2e1f]">📦 Produk Saya</h3>
                  <button 
                    onClick={() => setActiveTab("tambah_produk")}
                    className="bg-[#2fa84f] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#268c41] transition flex items-center gap-2"
                  >
                    + Tambah Produk
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef] hover:shadow-lg transition">
                      <div className="h-48 overflow-hidden bg-[#f1f8e9]">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-[#1a2e1f] text-base mb-1 line-clamp-1">{product.name}</h4>
                        <p className="text-[#2fa84f] font-extrabold text-lg">Rp{product.price.toLocaleString()}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#6b7c71]">Stok: {product.stock}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              product.status === "Aktif" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}>
                              {product.status}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setProductForm({
                                  name: product.name,
                                  price: product.price,
                                  stock: product.stock,
                                  status: product.status,
                                  image: product.image,
                                  description: product.description || "",
                                });
                                setImagePreview(product.image);
                                setActiveTab("tambah_produk");
                              }}
                              className="text-blue-500 text-xs font-medium hover:underline"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 text-xs font-medium hover:underline"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-[#eef2ef]">
                    <p className="text-[#6b7c71]">Belum ada produk. Klik "Tambah Produk" untuk menambahkan.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAMBAH / EDIT PRODUK - DENGAN UPLOAD GAMBAR KEBAWAH SEJAJAR */}
            {(activeTab === "tambah_produk") && (
              <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
                <h3 className="text-xl font-[800] text-[#1a2e1f] mb-6">
                  {editingProduct ? "✏️ Edit Produk" : "📝 Tambah Produk"}
                </h3>
                
                {/* Upload Gambar - Full width di atas */}
                <div className="mb-6">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Foto Produk</label>
                  <div className="mt-2">
                    <div className="relative w-full h-48 bg-[#f8faf9] rounded-xl border-2 border-dashed border-[#e0e6e2] overflow-hidden">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                          <button
                            onClick={() => {
                              setImagePreview(null);
                              setProductForm({...productForm, image: ""});
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                          <span className="text-3xl mb-2">📷</span>
                          <span className="text-xs text-[#6b7c71]">Klik untuk upload gambar</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Input - Grid 2 kolom untuk Nama dan Harga/Stok */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Nama Produk</label>
                    <input 
                      type="text" 
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] mt-1"
                      placeholder="Contoh: Tempat Pensil Organik"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Harga</label>
                      <input 
                        type="number" 
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] mt-1"
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Stok</label>
                      <input 
                        type="number" 
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] mt-1"
                        placeholder="50"
                      />
                    </div>
                  </div>
                </div>

                {/* Status dan Deskripsi dalam satu baris (sejajar) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Status</label>
                    <select 
                      value={productForm.status}
                      onChange={(e) => setProductForm({...productForm, status: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] mt-1"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Habis">Habis</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">Deskripsi Produk</label>
                    <textarea 
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] mt-1 resize-none"
                      rows="4"
                      placeholder="Deskripsi produk..."
                    />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-3 pt-4 border-t border-[#f8faf9]">
                  <button 
                    onClick={() => {
                      setActiveTab("produk");
                      resetForm();
                    }}
                    className="flex-1 border border-[#e0e6e2] py-3 rounded-xl font-bold text-sm text-[#6b7c71] hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={editingProduct ? handleEditProduct : handleAddProduct}
                    className="flex-1 bg-[#2fa84f] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#268c41] transition"
                  >
                    {editingProduct ? "Update Produk" : "Simpan Produk"}
                  </button>
                </div>
              </div>
            )}

            {/* PESANAN MASUK dengan tombol kelola status di dalam tabel */}
            {activeTab === "pesanan" && (
              <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-[800] text-[#1a2e1f]">📋 Pesanan Masuk</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-[#eef2ef]">
                      <tr className="text-left text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider">
                        <th className="pb-3">ID Pesanan</th>
                        <th className="pb-3">Pembeli</th>
                        <th className="pb-3">Produk</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-[#f8faf9] last:border-b-0">
                          <td className="py-3 text-sm font-medium text-[#1a2e1f]">{order.id}</td>
                          <td className="py-3 text-sm text-[#6b7c71]">{order.customer}</td>
                          <td className="py-3 text-sm text-[#6b7c71]">{order.product}</td>
                          <td className="py-3 text-sm font-medium text-[#1a2e1f]">Rp{order.total.toLocaleString()}</td>
                          <td className="py-3">
                            <select 
                              value={order.status}
                              onChange={(e) => {
                                setOrders(orders.map(o => 
                                  o.id === order.id ? { ...o, status: e.target.value } : o
                                ));
                              }}
                              className={`text-xs font-bold px-2 py-1 rounded-full border-0 focus:ring-1 focus:ring-[#2fa84f] ${getStatusColor(order.status)}`}
                            >
                              {statusOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                           </td>
                          <td className="py-3">
                            <button 
                              className="text-[#2fa84f] text-xs font-medium hover:underline"
                            >
                              Detail
                            </button>
                           </td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* FOOTER */}
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