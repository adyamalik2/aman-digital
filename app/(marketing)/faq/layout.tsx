import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "FAQ | AMAN Digital",
  description:
    "Pertanyaan umum seputar AMAN Digital, AMAN Kasir, AMAN Budget, AMAN Invoice, dan layanan digital kami untuk UMKM Indonesia.",
  path: "/faq",
});

export default function FaqLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
