import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — AMAN Product Digital | AMAN Digital",
  description: "Masukkan kode akses untuk membuka katalog AMAN Product Digital.",
  robots: { index: false, follow: false },
};

export default function ProdukDigitalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
