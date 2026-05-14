import type { Metadata } from "next";
import "./globals.css";

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
        className="min-h-screen bg-[#f1f8e9] text-[#1a2e1f] antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
