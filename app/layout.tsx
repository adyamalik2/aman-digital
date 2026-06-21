import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amandigital.web.id"),
  title: "AMAN Digital — Partner Digital UMKM",
  description: "Platform digital untuk UMKM Indonesia",
  icons: { icon: "/icon.png" },
  alternates: { canonical: "/" },
  openGraph: {
    title: "AMAN Digital — Partner Digital UMKM",
    description:
      "Bantu UMKM, toko, dan kantor kecil punya sistem kerja yang lebih rapi — aplikasi kasir, keuangan, invoice, plus layanan data, IT, cetak, dan kreatif.",
    url: "/",
    type: "website",
    siteName: "AMAN Digital",
    locale: "id_ID",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMAN Digital — Partner Digital UMKM",
    description: "Partner digital praktis untuk UMKM Indonesia.",
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
