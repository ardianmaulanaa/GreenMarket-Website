"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AlamatPage() {
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Rumah",
      name: "Muhammad Ardian",
      phone: "08123456789",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      district: "Kebayoran Baru",
      postalCode: "12120",
      fullAddress: "Jl. Merdeka No. 123",
      detail: "Depan Masjid Al-Ikhlas",
    }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    name: "",
    phone: "",
    province: "",
    city: "",
    district: "",
    postalCode: "",
    fullAddress: "",
    detail: "",
  });

  const menuItems = [
    { name: "👤 Profil Saya", href: "/profile" },
    { name: "📍 Alamat", href: "/alamat" },
    { name: "🛍️ Pesanan Saya", href: "/pesanan" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(addresses.map(addr => 
        addr.id === editingId ? { ...formData, id: editingId } : addr
      ));
      setEditingId(null);
    } else {
      setAddresses([...addresses, { ...formData, id: Date.now() }]);
    }
    setFormData({
      label: "",
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      postalCode: "",
      fullAddress: "",
      detail: "",
    });
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f8e9] font-sans pb-20">
      {/* NAVBAR */}
      <nav id="navbar" className="fixed top-0 w-full z-[100] bg-white border-b border-[#e0e6e2] shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/beranda-dashboard" className="text-[#2fa84f] text-2xl font-[800] no-underline">
            GreenMarket
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/wishlist" className="text-[#6b7c71] hover:text-[#2fa84f] transition text-xl flex items-center">
              🛒
            </Link>
            <div className="font-bold text-sm text-[#6b7c71]">
              Halo, Muhammad!
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto pt-28 px-4 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef] sticky top-28">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4 group">
                  <img 
                    src="https://ui-avatars.com/api/?name=Muhammad+Ardian&background=2fa84f&color=fff" 
                    className="w-full h-full rounded-full border-4 border-[#f1f8e9] object-cover" 
                    alt="Avatar"
                  />
                  <button className="absolute bottom-0 right-0 bg-[#2fa84f] text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white hover:bg-[#268c41] transition-all">
                    📷
                  </button>
                </div>
                <h6 className="font-extrabold text-[#1a2e1f] mb-1">Muhammad Ardian</h6>
                <p className="text-[12px] text-[#6b7c71] font-medium">Member Sejak 2026</p>
              </div>
              
              <hr className="my-6 border-[#f8faf9]" />

              <nav className="flex flex-col gap-2">
                <Link href="/profile" className={`flex items-center gap-3 p-3.5 rounded-xl transition no-underline ${pathname === "/profile" ? "bg-[#f1f8e9] text-[#2fa84f] font-bold" : "text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] font-medium"}`}>
                  👤 Profil Saya
                </Link>
                <Link href="/alamat" className={`flex items-center gap-3 p-3.5 rounded-xl transition no-underline ${pathname === "/alamat" ? "bg-[#f1f8e9] text-[#2fa84f] font-bold" : "text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] font-medium"}`}>
                  📍 Alamat
                </Link>
                <Link href="/pesanan" className={`flex items-center gap-3 p-3.5 rounded-xl transition no-underline ${pathname === "/pesanan" ? "bg-[#f1f8e9] text-[#2fa84f] font-bold" : "text-[#6b7c71] hover:bg-[#f8faf9] hover:text-[#1a2e1f] font-medium"}`}>
                  🛍️ Pesanan Saya
                </Link>
                <Link href="/login" className="flex items-center gap-3 p-3.5 rounded-xl text-[#e53e3e] hover:bg-[#fff5f5] no-underline font-bold transition mt-4">
                  🚪 Keluar
                </Link>
              </nav>
            </div>
          </aside>

          {/* KONTEN ALAMAT */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-[32px] p-8 lg:p-12 shadow-[0_10px_40px_rgba(30,80,40,0.04)] border border-[#eef2ef]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-[800] text-[#1a2e1f]">📍 Daftar Alamat</h3>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      label: "",
                      name: "",
                      phone: "",
                      province: "",
                      city: "",
                      district: "",
                      postalCode: "",
                      fullAddress: "",
                      detail: "",
                    });
                    setShowForm(true);
                  }}
                  className="bg-[#2fa84f] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#268c41] transition-all shadow-sm"
                >
                  + Tambah Alamat
                </button>
              </div>
              
              {/* LIST ALAMAT */}
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-12 text-[#6b7c71]">
                    Belum ada alamat. Klik "Tambah Alamat" untuk menambahkan.
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div key={address.id} className="border border-[#e0e6e2] rounded-xl p-5 bg-[#fcfdfc] hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-[#1a2e1f] text-lg">{address.label || "Alamat"}</span>
                          </div>
                          <p className="text-sm text-[#6b7c71] mt-1">
                            👤 {address.name}
                          </p>
                          <p className="text-sm text-[#6b7c71] mt-1">
                            📞 {address.phone}
                          </p>
                          <p className="text-sm text-[#6b7c71] mt-1">
                            📍 {address.fullAddress}
                          </p>
                          <p className="text-sm text-[#6b7c71] mt-1">
                            {address.district}, {address.city}, {address.province} - {address.postalCode}
                          </p>
                          {address.detail && (
                            <p className="text-xs text-[#6b7c71] mt-1">
                              📝 {address.detail}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleEdit(address)}
                            className="text-[#2fa84f] text-sm font-medium hover:text-[#268c41] transition"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(address.id)}
                            className="text-[#e53e3e] text-sm font-medium hover:text-red-700 transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* MODAL FORM TAMBAH/EDIT ALAMAT */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-[#eef2ef] p-6 rounded-t-[32px]">
              <h3 className="text-2xl font-[800] text-[#1a2e1f]">
                {editingId ? "Edit Alamat" : "Tambah Alamat Baru"}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Label Alamat */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                  Label Alamat
                </label>
                <select
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                >
                  <option value="">Pilih Label</option>
                  <option value="Rumah">🏠 Rumah</option>
                  <option value="Kantor">🏢 Kantor</option>
                  <option value="Apartemen">🏙️ Apartemen</option>
                  <option value="Lainnya">📍 Lainnya</option>
                </select>
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Muhammad Ardian"
                  required
                  className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                />
              </div>

              {/* Nomor Telepon */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Contoh: 08123456789"
                  required
                  className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                />
              </div>

              {/* Provinsi, Kota, Kecamatan, Kode Pos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    placeholder="Contoh: DKI Jakarta"
                    required
                    className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                    Kota/Kabupaten
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Contoh: Jakarta Selatan"
                    required
                    className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="Contoh: Kebayoran Baru"
                    required
                    className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Contoh: 12120"
                    required
                    className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc]"
                  />
                </div>
              </div>

              {/* Nama Jalan, Gedung, No. Rumah */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                  Nama Jalan, Gedung, No. Rumah
                </label>
                <textarea
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jl. Merdeka No. 123, Gedung Permai"
                  rows="2"
                  required
                  className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc] resize-none"
                />
              </div>

              {/* Detail Lainnya */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#6b7c71] uppercase tracking-wider ml-1">
                  Detail Lainnya <span className="text-[10px] font-normal">(Opsional)</span>
                </label>
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  placeholder="Contoh: Blok A No. 5, Depan Masjid Al-Ikhlas"
                  rows="2"
                  className="w-full px-4 py-3 border border-[#e0e6e2] rounded-xl outline-none focus:border-[#2fa84f] text-[15px] transition-all bg-[#fcfdfc] resize-none"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-4 mt-6 border-t border-[#f8faf9]">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-sm border-2 border-[#e0e6e2] text-[#6b7c71] hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2fa84f] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#268c41] transition-all shadow-sm hover:-translate-y-0.5 active:scale-95"
                >
                  {editingId ? "Update Alamat" : "Simpan Alamat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}