import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Harga & Paket AMAN Digital | Mulai Gratis untuk UMKM",
  description:
    "Pilih paket AMAN Digital yang sesuai kebutuhan bisnis Anda. Mulai gratis, upgrade kapan saja. Paket Gratis, Dasar Rp 49rb/bln, dan Pro Rp 99rb/bln.",
  path: "/harga",
});

export default function HargaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
