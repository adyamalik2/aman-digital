import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "AMAN Invoice | Buat Faktur Profesional untuk UMKM",
  description:
    "AMAN Invoice membantu UMKM buat faktur profesional dalam hitungan menit. Kirim tagihan ke pelanggan via WhatsApp atau PDF, pantau status pembayaran dari HP.",
  path: "/invoice",
});

export default function InvoiceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
