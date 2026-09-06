import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "AMAN Budget | Aplikasi Atur Keuangan Keluarga",
  description:
    "AMAN Budget bantu keluarga atur uang per anggota, target tabungan, zakat & sedekah, dan tagihan — pantau keuangan rumah tangga langsung dari HP.",
  path: "/budget",
});

export default function BudgetLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
