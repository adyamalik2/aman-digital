import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "AMAN Budget | Aplikasi Atur Keuangan Keluarga",
  description:
    "AMAN Budget bantu keluarga atur uang per anggota (Ayah/Bunda), target tabungan, zakat & sedekah, dan tagihan — pantau pemasukan & pengeluaran rumah tangga dari HP.",
  path: "/budget",
});

export default function BudgetLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
