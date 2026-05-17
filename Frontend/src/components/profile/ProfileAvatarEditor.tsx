"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface ProfileAvatarEditorProps {
  src: string;
  name: string;
  size?: number;
  onImageSelect: (dataUrl: string) => void;
}

export default function ProfileAvatarEditor({
  src,
  name,
  size = 120,
  onImageSelect,
}: ProfileAvatarEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onImageSelect(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <motion.div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#2fa84f] via-[#7ee8a0] to-[#2fa84f] opacity-80"
        animate={{
          boxShadow: [
            "0 0 24px rgba(47,168,79,0.35)",
            "0 0 40px rgba(47,168,79,0.55)",
            "0 0 24px rgba(47,168,79,0.35)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="relative overflow-hidden rounded-full border-2 border-[#1a1f1b] bg-[#111815]"
        style={{ width: size, height: size }}
      >
        <img
          src={src}
          alt={name ? `Foto profil ${name}` : "Foto profil"}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=2fa84f&color=fff&size=256`;
          }}
        />
      </motion.div>

      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute -bottom-0.5 -right-0.5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1a1f1b] bg-[#2fa84f] text-white shadow-[0_4px_20px_rgba(47,168,79,0.45)] transition-colors hover:bg-[#268c41]"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ubah foto profil"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </motion.button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </motion.div>
  );
}
