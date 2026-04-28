import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Menggunakan font Plus Jakarta Sans agar sesuai desain GreenMarket
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "GreenMarket - Solusi Ramah Lingkungan",
  description: "Platform marketplace untuk daur ulang dan jual beli barang bekas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${jakarta.className} min-h-screen bg-[#f1f8e9] text-[#1a2e1f] antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}