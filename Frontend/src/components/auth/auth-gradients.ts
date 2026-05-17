import type { CSSProperties } from "react";

/** Warna tepi kanan hero — harus sama dengan background panel form */
export const AUTH_FORM_EDGE = "#111815";

/** Gradasi halus dari kanan (solid) ke kiri (transparan) di atas gambar hero */
export const HERO_EDGE_BLEND_STYLE: CSSProperties = {
  background: `linear-gradient(
    to left,
    ${AUTH_FORM_EDGE} 0%,
    ${AUTH_FORM_EDGE} 6%,
    rgba(17, 24, 21, 0.97) 14%,
    rgba(17, 24, 21, 0.88) 24%,
    rgba(17, 24, 21, 0.65) 38%,
    rgba(17, 24, 21, 0.38) 52%,
    rgba(10, 17, 11, 0.18) 68%,
    rgba(10, 17, 11, 0.06) 82%,
    transparent 100%
  )`,
};
