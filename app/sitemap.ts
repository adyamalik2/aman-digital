import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/notion";

// Wajib untuk output: 'export' — render sebagai file statis saat build.
export const dynamic = "force-static";

// Canonical host situs marketing (sama dengan metadataBase di app/layout.tsx).
const SITE_URL = "https://amandigital.my.id";

// Route statis utama (termasuk halaman daftar /blog).
const staticRoutes = [
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
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  // Artikel blog dari Notion (diambil saat build). Jika Notion gagal/kosong,
  // getAllSlugs() mengembalikan [] sehingga sitemap tetap valid.
  const slugs = await getAllSlugs();
  const blogEntries: MetadataRoute.Sitemap = slugs.map(({ slug }) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
