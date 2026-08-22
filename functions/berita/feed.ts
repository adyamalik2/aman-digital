import { getLatest, getSettings } from "../_lib/news";

interface Env {
  DB: D1Database;
}

const SITE_URL = "https://amandigital.my.id";

function escXml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  const [settings, items] = await Promise.all([getSettings(db), getLatest(db, 30, 0)]);

  const rssItems = items
    .map(
      (a) => `  <item>
    <title>${escXml(a.title)}</title>
    <link>${SITE_URL}/berita/${a.slug}</link>
    <guid>${SITE_URL}/berita/${a.slug}</guid>
    <description>${escXml(a.excerpt)}</description>
    <pubDate>${a.published_at ? new Date(a.published_at.replace(" ", "T")).toUTCString() : ""}</pubDate>
    ${a.category_name ? `<category>${escXml(a.category_name)}</category>` : ""}
  </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escXml(settings.site_name || "AMAN News")}</title>
  <link>${SITE_URL}/berita</link>
  <description>${escXml(settings.site_description || "")}</description>
  <language>id-ID</language>
${rssItems}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
