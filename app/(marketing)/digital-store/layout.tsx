import { pageMeta } from "@/lib/seo";

// Metadata dipindah ke layout karena page.tsx sekarang client component
// (butuh useState untuk akordeon FAQ) — pola yang sama dipakai halaman
// produk lain seperti /kasir dan /invoice.
export const metadata = pageMeta({
  title: "700+ Produk Digital 2026 | Sekali Beli, Akses Selamanya",
  description:
    "44 produk digital terkurasi — tema Islami, edukasi anak, game ringan, dan template konten — plus folder Google Drive berisi 700+ berkas. Satu kode akses, buka langsung di browser tanpa unduh satu per satu.",
  path: "/digital-store",
});

export default function DigitalStoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
