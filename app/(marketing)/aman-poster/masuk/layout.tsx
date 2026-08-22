import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk — AMAN Poster Generator | AMAN Digital",
  robots: { index: false, follow: false },
};

export default function AmanPosterMasukLayout({ children }: { children: React.ReactNode }) {
  return children;
}
