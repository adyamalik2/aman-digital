import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — AMAN Content Engine | AMAN Digital",
  robots: { index: false, follow: false },
};

export default function AmanContentEngineMasukLayout({ children }: { children: React.ReactNode }) {
  return children;
}
