import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Print Center — Cetak Cepat, Hasil Rapi | AMAN Digital",
  description:
    "Print Center AMAN Digital — cetak dokumen, banner, spanduk, stiker, brosur, dan merchandise promosi dengan hasil rapi dan pengerjaan cepat untuk bisnis Anda di Aceh.",
  path: "/print-center",
});

export default function PrintCenterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
