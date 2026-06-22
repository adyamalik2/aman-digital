import type { MetadataRoute } from "next";

// Wajib untuk output: 'export' — render sebagai file statis saat build.
export const dynamic = "force-static";

// Canonical host situs marketing (sama dengan metadataBase di app/layout.tsx).
const SITE_URL = "https://amandigital.my.id";

// Route statis. Blog (/blog) sengaja tidak dimasukkan karena bersumber dari
// Notion dan jumlah/slug-nya dinamis — tambahkan terpisah jika diperlukan.
const routes = [
  "",
  "/harga",
  "/tentang",
  "/kasir",
  "/budget",
  "/invoice",
  "/faq",
  "/kontak",
  "/data-system",
  "/it-advisor",
  "/print-center",
  "/creative-studio",
  "/digital-store",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
