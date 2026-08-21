import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — AMAN Engine | AMAN Digital",
  robots: { index: false, follow: false },
};

export default function AmanEngineMasukLayout({ children }: { children: React.ReactNode }) {
  return children;
}
