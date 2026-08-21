/**
 * /sitemap.xml — menggantikan app/sitemap.ts (dulu baca Notion saat build).
 * Artikel blog sekarang di D1 & dirender per-permintaan, jadi sitemap-nya
 * juga harus per-permintaan supaya artikel baru langsung ikut ter-index.
 */
interface Env {
  DB: D1Database;
}

const SITE_URL = "https://amandigital.my.id";

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
  "/aman-engine",
  "/blog",
];

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const now = new Date().toISOString();

  const staticEntries = staticRoutes
    .map(
      (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("\n");

  const { results } = await context.env.DB.prepare(
    "SELECT slug, updated_at FROM articles WHERE status = 'published' ORDER BY published_at DESC"
  ).all<{ slug: string; updated_at: string }>();

  const blogEntries = (results || [])
    .map(
      (a) => `  <url>
    <loc>${SITE_URL}/blog/${encodeURIComponent(a.slug)}</loc>
    <lastmod>${a.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${blogEntries}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
