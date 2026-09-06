import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "AMAN-in | Catat Pemasukan & Pengeluaran Pakai Suara",
  description:
    "Catat pemasukan dan pengeluaran cukup dengan diucapkan — untuk UMKM maupun keuangan pribadi. Multi-dompet, laporan otomatis, dan tetap jalan tanpa internet.",
  path: "/amanin",
});

export default function AmaninLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
