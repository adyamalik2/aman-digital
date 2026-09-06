import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "AMAN Kasir | Aplikasi Kasir Offline untuk Warung & UMKM",
  description:
    "AMAN Kasir membantu warung dan toko kecil mencatat transaksi, stok, omzet, dan laba meski internet tidak stabil. Bisa dipakai langsung dari browser HP.",
  path: "/kasir",
});

export default function KasirLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
