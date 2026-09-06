import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "IT Support & Advisor untuk Kantor Kecil | AMAN Digital",
  description:
    "IT Support & Advisor untuk kantor kecil dan UMKM: perbaikan hardware, setup jaringan WiFi, keamanan data, dan konsultasi perangkat — tanpa biaya vendor besar.",
  path: "/it-advisor",
});

export default function ItAdvisorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
