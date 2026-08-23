import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "AMAN-in | Catat Pemasukan & Pengeluaran Pakai Suara",
  description:
    "AMAN-in mencatat pemasukan dan pengeluaran cukup dengan diucapkan — untuk UMKM maupun keuangan pribadi. Multi-dompet, laporan otomatis, kunci PIN, dan tetap jalan tanpa internet.",
  path: "/amanin",
});

export default function AmaninLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
