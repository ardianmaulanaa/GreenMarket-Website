"use client";

import Link from "next/link";
import { useState } from "react";

export default function UploadProduk() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    condition: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Di sini nanti akan ditambahkan logika untuk mengirim data ke backend
  };

  return (
    <div className="min-h-screen bg-[#f1f8e9] text-[#1a2e1f] font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a2e1f]">Upload Produk Baru</h1>
          <Link href="/beranda-dashboard" className="text-[#2fa84f] hover:text-[#268c41] font-bold no-underline">
            ← Kembali ke Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-[24px] shadow-[0_10px_35px_rgba(30,80,40,0.04)] p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1a2e1f] mb-6">Informasi Produk</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#6b7c71] mb-2">Nama Produk</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama produk..."
                    className="w-full border border-[#e0e6e2] rounded-[12px] p-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#6b7c71] mb-2">Harga (Rp)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Masukkan harga produk..."
                    className="w-full border border-[#e0e6e2] rounded-[12px] p-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#6b7c71] mb-2">Kategori</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-[#e0e6e2] rounded-[12px] p-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    <option value="elektronik">Elektronik</option>
                    <option value="fashion">Fashion</option>
                    <option value="sepeda">Sepeda</option>
                    <option value="aksesoris">Aksesoris</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#6b7c71] mb-2">Kondisi</label>
                  <select 
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full border border-[#e0e6e2] rounded-[12px] p-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all"
                    required
                  >
                    <option value="">Pilih kondisi</option>
                    <option value="baru">Baru</option>
                    <option value="bekas">Bekas</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#6b7c71] mb-2">Deskripsi</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Deskripsikan produk Anda..."
                    rows={4}
                    className="w-full border border-[#e0e6e2] rounded-[12px] p-3 bg-[#fcfdfc] text-sm focus:border-[#2fa84f] focus:shadow-[0_0_0_0.25rem_rgba(47,168,79,0.1)] focus:bg-white focus:outline-none transition-all"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-[#1a2e1f] mb-6">Foto Produk</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#6b7c71] mb-2">Upload Foto</label>
                  <div className="border-2 border-dashed border-[#e0e6e2] rounded-[15px] p-8 text-center cursor-pointer hover:border-[#2fa84f] transition-colors duration-300">
                    <p className="text-[#6b7c71] mb-4">Klik atau seret foto ke sini</p>
                    <button type="button" className="text-[#2fa84f] font-bold py-2 px-6 rounded-[12px] border border-[#2fa84f] hover:bg-[#2fa84f] hover:text-white transition">
                      Pilih File
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-[#6b7c71] mb-2">Preview</label>
                  <div className="bg-[#f1f8e9] rounded-[15px] h-64 flex items-center justify-center">
                    <span className="text-[#6b7c71]">Preview foto akan muncul di sini</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button 
                type="submit" 
                className="bg-[#2fa84f] text-white py-3 px-8 rounded-[12px] font-bold hover:bg-[#268c41] transition"
              >
                Upload Produk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}