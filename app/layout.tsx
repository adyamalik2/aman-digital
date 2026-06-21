import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amandigital.web.id"),
  title: "AMAN Digital | Sistem Bisnis, Dashboard & Digital Printing",
  description:
    "AMAN Digital bantu UMKM, toko, dan kantor kecil merapikan sistem kerja: dashboard, aplikasi no-code, IT support, digital printing, dan konten promosi.",
  icons: { icon: "/icon.png" },
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "AMAN Digital | Jasa Sistem Bisnis, Dashboard, IT Support, dan Digital Printing",
    description:
      "Partner digital praktis untuk UMKM, toko, dan kantor kecil: dashboard bisnis, aplikasi no-code, IT support, digital printing, dan konten promosi.",
    url: "/",
    type: "website",
    siteName: "AMAN Digital",
    locale: "id_ID",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AMAN Digital | Jasa Sistem Bisnis, Dashboard, IT Support, dan Digital Printing",
    description: "Solusi digital praktis untuk UMKM, toko, dan kantor kecil.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
