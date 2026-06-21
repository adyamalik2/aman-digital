import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "AMAN Kasir | Aplikasi Kasir Offline untuk Warung & UMKM",
  description:
    "AMAN Kasir membantu warung, toko kecil, dan UMKM mencatat transaksi, stok, omzet, dan laba meski internet tidak stabil. Bisa dipakai dari browser HP dan cocok untuk UMKM.",
  path: "/kasir",
});

export default function KasirLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
