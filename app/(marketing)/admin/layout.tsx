import type { Metadata, Viewport } from "next";

// PWA: bisa dipasang ke layar utama HP ("Tambahkan ke Layar Utama" di
// browser), sama seperti panel admin di web.id dulu (manifest.webmanifest).
// Ini yang jadi "tombol khusus" -- ikon di HP, bukan link di menu situs
// (memang sengaja tidak ditaut publik, panel ini berpassword & noindex).
export const metadata: Metadata = {
  title: "Admin — AMAN Digital",
  robots: { index: false, follow: false },
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "AMAN Admin" },
  icons: { apple: "/images/logo-tab.png" },
};

export const viewport: Viewport = {
  themeColor: "#070b14",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
