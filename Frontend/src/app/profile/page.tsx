"use client";

import FloatingInput from "@/components/auth/FloatingInput";
import ProfileAvatarEditor from "@/components/profile/ProfileAvatarEditor";
import RoleBadge from "@/components/profile/RoleBadge";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import Nav from "@/components/navbar";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function defaultAvatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=2fa84f&color=fff&size=256`;
}

export default function ProfilePage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const { userId, loading, refreshUser } = useUser();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "",
  });

  const [profile, setProfile] = useState({
    nama: "",
    email: "",
    role: "",
  });

  const normalizeRole = (role: string) => role?.trim().toUpperCase();

  const isSeller = normalizeRole(profile.role) === "SELLER";
  const dashboardHref = isSeller ? "/dashboard-seller" : "/dashboard-buyer";

  const avatarSrc = useMemo(
    () => avatarPreview ?? defaultAvatarUrl(profile.nama),
    [avatarPreview, profile.nama],
  );

  const handleAvatarSelect = (dataUrl: string) => {
    setAvatarPreview(dataUrl);
    localStorage.setItem("profileAvatar", dataUrl);
  };

  const fetchProfile = async (uid: string) => {
    if (!uid) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/api/users/${uid}`);
      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Gagal mengambil data profile", "error");
        return;
      }

      const latestRole = normalizeRole(data.role || "BUYER");

      setProfile({
        nama: data.username || "User",
        email: data.email || "",
        role: latestRole,
      });

      setForm({
        nama: data.username || "User",
        email: data.email || "",
        password: "",
        role: latestRole,
      });

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("userRole", latestRole);
      refreshUser();
    } catch (error) {
      console.error("Gagal mengambil profile:", error);
      showToast("Terjadi kesalahan saat mengambil profile", "error");
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      router.push("/login");
      return;
    }

    const savedAvatar = localStorage.getItem("profileAvatar");
    if (savedAvatar) setAvatarPreview(savedAvatar);

    const loadProfile = async () => {
      setIsPageLoading(true);
      await fetchProfile(userId);
      setTimeout(() => setIsPageLoading(false), 500);
    };

    loadProfile();
  }, [userId, loading]);

  const handleUpdateProfile = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      showToast("Silakan login terlebih dahulu", "warning");
      router.push("/login");
      return;
    }

    if (!form.nama || !form.email) {
      showToast("Nama dan email tidak boleh kosong", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5050/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.nama,
            email: form.email,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Gagal update profile", "error");
        return;
      }

      const updatedUser = data.user;
      const latestRole = normalizeRole(updatedUser.role || "BUYER");

      showToast(data.message || "Profile berhasil diupdate", "success");

      setProfile({
        nama: updatedUser.username || "User",
        email: updatedUser.email || "",
        role: latestRole,
      });

      setForm({
        nama: updatedUser.username || "User",
        email: updatedUser.email || "",
        password: "",
        role: latestRole,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("userRole", latestRole);
      refreshUser();
    } catch (error) {
      console.error("Gagal update profile:", error);
      showToast("Terjadi kesalahan saat update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return (
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center bg-[#0a110b] font-sans"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="relative mb-6 h-14 w-14"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <motion.div className="absolute inset-0 rounded-full border-4 border-[#2fa84f]/20" />
          <motion.div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2fa84f]" />
        </motion.div>
        <motion.p
          className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#2fa84f]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Memuat Profil...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-[#f1f8e9] via-[#2fa84f]/12 to-[#0a110b] font-sans text-[#1a2e1f]">
      <motion.div
        className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-[#2fa84f]/20 blur-[140px]"
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      {/* Navbar */}
      <Nav variant="profile" profile={profile} avatarSrc={avatarSrc} />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-grow flex-col gap-6 px-4 pt-24 pb-16 sm:px-6 lg:flex-row lg:gap-8 lg:px-6 lg:pt-28 lg:pb-20">
        {/* Sidebar */}
        <ProfileSidebar
          username={profile.nama || "User"}
          role={profile.role || "BUYER"}
          activeMenu="profile"
        />

        {/* Main */}
        <main className="min-w-0 flex-1">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-6"
          >
            {/* Header card */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1f1b]/80 p-6 shadow-2xl backdrop-blur-xl sm:rounded-[32px] sm:p-8"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#2fa84f]/15 blur-[60px]" />
              <motion.div className="relative z-10 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
                <ProfileAvatarEditor
                  src={avatarSrc}
                  name={profile.nama}
                  size={120}
                  onImageSelect={handleAvatarSelect}
                />
                <div className="text-center sm:text-left">
                  <h2 className="m-0 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    {profile.nama || "Pengguna"}
                  </h2>
                  <motion.div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <RoleBadge role={profile.role} />
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Aktif
                    </span>
                  </motion.div>
                  <p className="mt-3 text-sm text-white/50">{profile.email}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Form card */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1f1b]/80 p-6 shadow-2xl backdrop-blur-xl sm:rounded-[32px] sm:p-8 lg:p-10"
            >
              <div className="pointer-events-none absolute top-[-15%] right-[-8%] h-56 w-56 rounded-full bg-[#2fa84f]/15 blur-3xl" />

              <motion.div
                variants={fadeUp}
                custom={2}
                className="relative z-10 mb-8"
              >
                <h2 className="m-0 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Pengaturan Profil
                </h2>
                <p className="mt-2 text-sm font-medium text-white/45">
                  Kelola informasi data diri dan keamanan akun Anda.
                </p>
              </motion.div>

              <form
                onSubmit={handleUpdateProfile}
                className="relative z-10 space-y-6"
              >
                <motion.div
                  variants={fadeUp}
                  custom={3}
                  className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6"
                >
                  <FloatingInput
                    id="nama"
                    name="nama"
                    label="Nama Lengkap"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    required
                    index={0}
                  />
                  <FloatingInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    value={form.email}
                    readOnly
                    index={1}
                  />
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  custom={4}
                  className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6"
                >
                  <motion.div variants={fadeUp} custom={5}>
                    <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Status Keanggotaan
                    </label>
                    <motion.div
                      className="flex items-center justify-between rounded-2xl border border-[#2fa84f]/30 bg-[#2fa84f]/10 px-5 py-4 backdrop-blur-sm"
                      whileHover={{ borderColor: "rgba(47,168,79,0.5)" }}
                    >
                      <span className="font-extrabold uppercase tracking-wider text-[#2fa84f]">
                        {form.role}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2fa84f]">
                          Aktif
                        </span>
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#2fa84f] shadow-[0_0_8px_#2fa84f]" />
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  custom={6}
                  className="flex justify-end border-t border-white/5 pt-6 sm:pt-8"
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { y: -3, scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="relative overflow-hidden rounded-2xl bg-[#2fa84f] px-8 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(47,168,79,0.35)] transition disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <motion.span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={isSubmitting ? {} : { x: ["-100%", "100%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.span
                            className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Perubahan"
                      )}
                    </span>
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
