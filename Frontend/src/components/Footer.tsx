"use client";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-white/10 bg-[#0a110b] px-5 py-16 text-white md:px-10 md:py-20 relative z-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2fa84f] to-[#1a7a35]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M12 2L3 7v9c0 5 9 7 9 7s9-2 9-7V7l-9-5z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold">GreenMarket</span>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-white/45">
            Solusi ramah lingkungan untuk masa depan. Menghubungkan barang berkualitas
            dengan pemilik baru yang peduli bumi.
          </p>
        </div>

        <div>
          <h6 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2fa84f]">
            Newsletter
          </h6>

          <div className="flex max-w-md overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <input
              type="email"
              placeholder="Email Anda"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
            />
            <button
              type="button"
              className="shrink-0 bg-[#2fa84f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#268c41] active:scale-95 duration-200"
            >
              Kirim
            </button>
          </div>

          <p className="mt-6 text-[11px] font-semibold tracking-widest text-white/25">
            © 2026 GREENMARKET INC.
          </p>
        </div>
      </div>
    </footer>
  );
}
