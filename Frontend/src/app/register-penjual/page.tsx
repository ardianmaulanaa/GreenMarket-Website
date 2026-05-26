"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";

// Animation styles removed - imported globally from globals.css

export default function RegisterPenjual() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [step, setStep] = useState(1);
  const [namaToko, setNamaToko] = useState("");
  const [emailBisnis, setEmailBisnis] = useState("");
  const [alamatToko, setAlamatToko] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ nama: "", role: "" });
  const { showToast } = useToast();
  const { userId, userRole, user: userProfile, refreshUser } = useUser();

  const router = useRouter();

  const isSeller = user.role === "SELLER" || user.role === "Penjual";
  const dashboardHref = isSeller ? "/dashboard-seller" : "/dashboard-buyer";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      setTimeout(() => setShouldAnimate(true), 50);
    }, 800);

    if (userId === null && userRole === null) {
      return () => clearTimeout(timer);
    }

    if (!userId) {
      router.push("/login");
      return () => clearTimeout(timer);
    }

    if (userRole === "SELLER") {
      router.push("/dashboard-seller");
      return () => clearTimeout(timer);
    }

    if (userProfile) {
      setUser({
        nama: userProfile.username || "User",
        role: userRole || "BUYER",
      });
    } else {
      setUser({
        nama: "User",
        role: userRole || "BUYER",
      });
    }

    return () => clearTimeout(timer);
  }, [userId, userRole, userProfile]);

  const handleFinalSubmit = async () => {
    if (!userId) {
      showToast("Silakan login terlebih dahulu", "warning");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5050/api/users/upgrade/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama_toko: namaToko,
            email_bisnis: emailBisnis,
            alamat_toko: alamatToko,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        showToast(data?.message || "Gagal daftar sebagai penjual.", "error");
        return;
      }

      const currentData = JSON.parse(localStorage.getItem("user") || "{}");

      const updatedUser = data?.user
        ? data.user
        : {
            ...currentData,
            role: "SELLER",
          };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("userRole", "SELLER");
      refreshUser();

      setUser({
        nama: updatedUser.username || updatedUser.name || "User",
        role: "SELLER",
      });

      showToast("Selamat! Anda sekarang menjadi Penjual.", "success");

      setTimeout(() => {
        router.replace("/dashboard-seller");
      }, 1000);
    } catch (error) {
      console.error("Gagal upgrade seller:", error);
      showToast("Terjadi kesalahan saat daftar sebagai penjual.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center items-center gap-6 sm:gap-10 mb-10 relative z-10 w-full max-w-sm mx-auto">
      {[
        { id: 1, label: "Identitas" },
        { id: 2, label: "Info Toko" },
        { id: 3, label: "Konfirmasi" },
      ].map((s) => (
        <div
          key={s.id}
          className="flex flex-col items-center gap-3 relative z-10"
        >
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-[14px] sm:text-[15px] border-2 transition-all duration-500 ${
              step >= s.id
                ? "bg-[#2fa84f] border-[#2fa84f] text-white shadow-[0_0_20px_rgba(47,168,79,0.4)]"
                : "bg-[#1a1f1b]/80 border-white/10 text-gray-500"
            }`}
          >
            {s.id}
          </div>

          <span
            className={`text-[9px] sm:text-[10px] font-[800] uppercase tracking-[1px] sm:tracking-[2px] transition-colors duration-500 ${
              step >= s.id ? "text-[#2fa84f]" : "text-gray-500"
            }`}
          >
            {s.label}
          </span>

          {s.id < 3 && (
            <div
              className={`absolute top-5 sm:top-6 -right-[40px] sm:-right-[55px] w-8 sm:w-10 h-[2px] transition-colors duration-500 ${
                step > s.id
                  ? "bg-[#2fa84f] shadow-[0_0_8px_#2fa84f]"
                  : "bg-white/10"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-[#0a110b] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#2fa84f]/20 border-t-[#2fa84f] rounded-full animate-spin mb-4"></div>
        <p className="text-[#2fa84f] font-bold text-[11px] tracking-[3px] uppercase animate-pulse">
          Menyiapkan Ruang Toko...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex bg-[#0a110b] font-sans m-0 overflow-hidden">
      <div className="hidden lg:block relative w-1/2 min-h-screen bg-[#1a2e1f] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1536882240095-0379873feb4e?q=80&w=1000&auto=format&fit=crop"
          alt="AI Generated Leaf"
          className="w-full h-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-[#0a110b]/20"></div>
        <div className="absolute inset-y-0 right-0 w-[250px] bg-gradient-to-l from-[#0a110b] via-[#0a110b]/90 to-transparent z-10"></div>

        <div
          className={`absolute bottom-20 left-16 max-w-md z-20 ${shouldAnimate ? "animate-slide-in-left delay-200" : "opacity-0"}`}
        >
          <h2 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight shadow-black drop-shadow-lg">
            Buka Peluang Baru, <br />
            <span className="text-[#2fa84f]">Jadilah Penjual Hijau.</span>
          </h2>
          <p className="text-white/80 text-sm font-medium leading-relaxed drop-shadow-md">
            Halo {user.nama || "User"}, saatnya mengubah inisiatif hijau Anda
            menjadi bisnis. Jangkau ribuan pembeli yang peduli pada bumi.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center relative p-6 sm:p-10 bg-gradient-to-br from-[#0a110b] via-[#1a1f1b] to-[#0a110b] z-20 [box-shadow:-40px_0_60px_10px_#0a110b] overflow-y-auto h-screen">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#2fa84f] opacity-[0.1] blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#2fa84f] opacity-[0.08] blur-[100px] rounded-full pointer-events-none"></div>

        <Link
          href={dashboardHref}
          className={`absolute top-8 left-8 flex items-center gap-2 text-gray-400 no-underline text-sm font-bold px-4 py-2 rounded-full border border-white/10 hover:text-white hover:bg-white/5 transition-all duration-300 z-30 ${shouldAnimate ? "animate-fade-in delay-100" : "opacity-0"}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali
        </Link>

        <div
          className={`w-full max-w-[460px] relative z-10 py-16 my-auto ${shouldAnimate ? "animate-fade-in-up delay-200" : "opacity-0"}`}
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2fa84f] to-[#1a7a35] flex items-center justify-center shadow-[0_4px_15px_rgba(47,168,79,0.4)]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Buka Toko Anda
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              Tiga langkah mudah untuk mulai berjualan.
            </p>
          </div>

          {renderStepIndicator()}

          <div className="bg-[#1a1f1b]/40 backdrop-blur-md border border-white/5 p-8 rounded-[32px] shadow-2xl relative">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Nama Sesuai KTP
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      defaultValue={user.nama}
                      className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl font-[800] text-sm uppercase tracking-widest transition-all mt-4 bg-[#2fa84f] text-white hover:bg-[#268c41] shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:-translate-y-1 border-none"
                >
                  Langkah Berikutnya
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Nama Toko
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Green Solutions"
                      value={namaToko}
                      onChange={(e) => setNamaToko(e.target.value)}
                      className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Email Bisnis
                    </label>
                    <input
                      type="email"
                      placeholder="toko@greenmarket.id"
                      value={emailBisnis}
                      onChange={(e) => setEmailBisnis(e.target.value)}
                      className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Alamat Toko
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Bandung, Jawa Barat"
                      value={alamatToko}
                      onChange={(e) => setAlamatToko(e.target.value)}
                      className="w-full px-5 py-4 border border-white/10 rounded-2xl outline-none focus:border-[#2fa84f] focus:ring-1 focus:ring-[#2fa84f] focus:bg-[#1a1f1b] text-sm text-white bg-[#1a1f1b]/50 shadow-inner transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 text-gray-400 font-bold text-xs bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => {
                      if (!namaToko.trim()) {
                        showToast("Nama toko wajib diisi.", "warning");
                        return;
                      }
                      if (!emailBisnis.trim()) {
                        showToast("Email wajib diisi.", "warning");
                        return;
                      }
                      if (!alamatToko.trim()) {
                        showToast("Alamat wajib diisi.", "warning");
                        return;
                      }

                      setStep(3);
                    }}
                    className="flex-[2] bg-[#2fa84f] text-white py-4 rounded-2xl font-[800] text-xs uppercase tracking-widest shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:bg-[#268c41] transition-all hover:-translate-y-1 border-none cursor-pointer"
                  >
                    Lanjut
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-[#2fa84f]/10 border border-[#2fa84f]/20 rounded-3xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2fa84f] flex items-center justify-center mb-5 shadow-[0_0_25px_rgba(47,168,79,0.4)]">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>

                  <h2 className="text-xl font-black text-white mb-2">
                    Konfirmasi Menjadi Penjual
                  </h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Setelah selesai, akun Anda akan berubah menjadi{" "}
                    <span className="text-[#2fa84f] font-bold">SELLER</span>.
                    Anda bisa mengunggah dan mengelola produk melalui Panel
                    Inventaris.
                  </p>
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 text-gray-400 font-bold text-xs bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
                    disabled={loading}
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className={`flex-[2] py-4 rounded-2xl font-[800] text-xs uppercase tracking-widest transition-all border-none ${
                      loading
                        ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
                        : "bg-[#2fa84f] text-white hover:bg-[#268c41] shadow-[0_10px_25px_rgba(47,168,79,0.3)] hover:-translate-y-1 cursor-pointer"
                    }`}
                  >
                    {loading ? "Memproses..." : "Selesaikan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
